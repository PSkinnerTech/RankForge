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

export const crawlSite = async (config) => {
  const target = normalizeUrl(config.target);
  const maxPages = config.maxPages || config.crawl?.maxPages || 50;
  const maxDepth = config.maxDepth ?? config.crawl?.maxDepth ?? 2;
  const respectRobots = config.respectRobots ?? config.crawl?.respectRobots ?? false;
  const sitemapUrl = config.sitemap || config.crawl?.sitemap || null;
  const robots = await loadRobots(target, respectRobots);
  const sitemaps = [];
  const queue = [{ url: target, depth: 0 }];

  if (sitemapUrl) {
    const sitemap = await loadSitemap(sitemapUrl);
    sitemaps.push(sitemap);
    for (const url of sitemap.parsed.urls || []) {
      if (isHttpUrl(url) && sameOrigin(target, url)) queue.push({ url: normalizeUrl(url), depth: 0, source: "sitemap" });
    }
  }

  const seen = new Set();
  const pages = [];
  const skipped = [];

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

    if (respectRobots && robots?.parsed && !isAllowedByRobots(robots.parsed, item.url, userAgent)) {
      skipped.push({ url: item.url, reason: "robots_blocked" });
      continue;
    }

    const snapshot = await collectSnapshot(item.url, { render: config.render?.mode, renderer: config.renderer });
    pages.push(snapshot);

    if (item.depth >= maxDepth) continue;

    for (const link of snapshot.evidence.links || []) {
      if (!link.href || seen.has(link.href)) continue;
      if (!isHttpUrl(link.href)) {
        skipped.push({ url: link.href, reason: "not_http" });
        continue;
      }
      if (!sameOrigin(target, link.href)) {
        skipped.push({ url: link.href, reason: "cross_origin" });
        continue;
      }
      if (!queue.some((queued) => queued.url === link.href)) {
        queue.push({ url: link.href, depth: item.depth + 1 });
      }
    }
  }

  return { pages, skipped, robots, sitemaps };
};
