import { collectSnapshot } from "./snapshot.mjs";
import { parseRobotsTxt, isAllowedByRobots } from "./robots.mjs";
import { parseSitemap } from "./sitemap.mjs";
import { isHttpUrl, normalizeUrl, sameOrigin } from "./url-utils.mjs";

const userAgent = "OpenClawBot";

const fetchText = async (url) => {
  const response = await fetch(url, { headers: { "user-agent": userAgent } });
  return {
    url,
    status: response.status,
    ok: response.ok,
    text: response.ok ? await response.text() : "",
  };
};

const robotsUrlFor = (target) => new URL("/robots.txt", target).href;

const loadRobots = async (target, enabled) => {
  if (!enabled) return null;
  try {
    const response = await fetchText(robotsUrlFor(target));
    return {
      url: response.url,
      status: response.status,
      ok: response.ok,
      parsed: response.ok ? parseRobotsTxt(response.text) : { groups: [] },
    };
  } catch (error) {
    return { url: robotsUrlFor(target), status: null, ok: false, error: error.message, parsed: { groups: [] } };
  }
};

const loadSitemap = async (url) => {
  try {
    const response = await fetchText(url);
    return {
      url,
      status: response.status,
      ok: response.ok,
      parsed: response.ok ? parseSitemap(response.text) : { type: "unknown", urls: [], sitemaps: [] },
    };
  } catch (error) {
    return { url, status: null, ok: false, error: error.message, parsed: { type: "unknown", urls: [], sitemaps: [] } };
  }
};

const compilePatterns = (patterns = []) => patterns.map((pattern) => new RegExp(pattern));

const createFilter = (config, target) => {
  const include = compilePatterns(config.include || config.crawl?.include || []);
  const exclude = compilePatterns(config.exclude || config.crawl?.exclude || []);

  return (url) => {
    if (normalizeUrl(url) === target) return null;
    if (exclude.some((pattern) => pattern.test(url))) return "excluded";
    if (include.length && !include.some((pattern) => pattern.test(url))) return "not_included";
    return null;
  };
};

export const crawlSite = async (config) => {
  const target = normalizeUrl(config.target);
  const maxPages = config.maxPages || config.crawl?.maxPages || 50;
  const maxDepth = config.maxDepth ?? config.crawl?.maxDepth ?? 2;
  const respectRobots = config.respectRobots ?? config.crawl?.respectRobots ?? false;
  const sitemapUrl = config.sitemap || config.crawl?.sitemap || null;
  const robots = await loadRobots(target, respectRobots);
  const sitemaps = [];
  const queue = [{ url: target, depth: 0 }];
  const filterReason = createFilter(config, target);
  const skipped = [];

  if (sitemapUrl) {
    const sitemap = await loadSitemap(sitemapUrl);
    sitemaps.push(sitemap);
    for (const url of sitemap.parsed.urls || []) {
      const normalized = normalizeUrl(url);
      if (!isHttpUrl(normalized)) {
        skipped.push({ url: normalized, reason: "not_http" });
        continue;
      }
      if (!sameOrigin(target, normalized)) {
        skipped.push({ url: normalized, reason: "cross_origin" });
        continue;
      }
      const reason = filterReason(normalized);
      if (reason) skipped.push({ url: normalized, reason });
      else queue.push({ url: normalized, depth: 0, source: "sitemap" });
    }
  }

  const seen = new Set();
  const pages = [];

  while (queue.length && pages.length < maxPages) {
    const item = queue.shift();
    if (seen.has(item.url)) continue;
    seen.add(item.url);

    if (!isHttpUrl(item.url)) {
      skipped.push({ url: item.url, reason: "not_http" });
      continue;
    }

    if (!sameOrigin(target, item.url)) {
      skipped.push({ url: item.url, reason: "cross_origin" });
      continue;
    }

    const reason = filterReason(item.url);
    if (reason) {
      skipped.push({ url: item.url, reason });
      continue;
    }

    if (respectRobots && robots?.parsed && !isAllowedByRobots(robots.parsed, item.url, userAgent)) {
      skipped.push({ url: item.url, reason: "robots_blocked" });
      continue;
    }

    const snapshot = await collectSnapshot(item.url, { render: config.render?.mode, renderer: config.renderer });
    pages.push(snapshot);

    if (item.depth >= maxDepth) continue;

    for (const link of snapshot.evidence.links || []) {
      if (!link.href) continue;
      const normalized = normalizeUrl(link.href);
      if (seen.has(normalized)) continue;
      if (!isHttpUrl(normalized)) {
        skipped.push({ url: normalized, reason: "not_http" });
        continue;
      }
      if (!sameOrigin(target, normalized)) {
        skipped.push({ url: normalized, reason: "cross_origin" });
        continue;
      }
      const reason = filterReason(normalized);
      if (reason) {
        skipped.push({ url: normalized, reason });
        continue;
      }
      if (!queue.some((queued) => queued.url === normalized)) {
        queue.push({ url: normalized, depth: item.depth + 1 });
      }
    }
  }

  return { pages, skipped, robots, sitemaps };
};
