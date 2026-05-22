import { collectSnapshot } from "./snapshot.mjs";
import { fetchWithGuards, readResponseTextLimited, resolveLimits } from "./io-guards.mjs";
import { parseRobotsTxt, isAllowedByRobots } from "./robots.mjs";
import { parseSitemap } from "./sitemap.mjs";
import { compileSafeRegex } from "./regex-guards.mjs";
import { isHttpUrl, normalizeUrl, sameOrigin } from "./url-utils.mjs";

const userAgent = "RankForgeBot";

const fetchText = async (url, options = {}) => {
  const limits = resolveLimits(options.limits);
  const maxRedirects = options.maxRedirects ?? 5;
  let current = url;

  for (let attempt = 0; attempt <= maxRedirects; attempt++) {
    const response = await fetchWithGuards(current, {
      security: options.security,
      limits,
      fetchOptions: {
        headers: { "user-agent": userAgent },
        redirect: "manual",
      },
    });
    const location = response.headers.get("location");
    if ([301, 302, 303, 307, 308].includes(response.status) && location) {
      current = new URL(location, current).href;
      continue;
    }

    return {
      url: current,
      status: response.status,
      ok: response.ok,
      text: response.ok
        ? await readResponseTextLimited(response, {
            limits,
            maxBytes: limits.maxTextBytes,
            label: current,
          })
        : "",
    };
  }

  throw new Error(`Too many redirects while fetching ${url}`);
};

const robotsUrlFor = (target) => new URL("/robots.txt", target).href;

const loadRobots = async (target, enabled, options = {}) => {
  if (!enabled) return null;
  try {
    const response = await fetchText(robotsUrlFor(target), options);
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

const loadSitemap = async (url, options = {}) => {
  try {
    const response = await fetchText(url, options);
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

const compilePatterns = (patterns = [], key = "pattern") =>
  patterns.map((pattern, index) => compileSafeRegex(pattern, `${key}[${index}]`));

const createFilter = (config, target) => {
  const include = compilePatterns(config.include || config.crawl?.include || [], "crawl.include");
  const exclude = compilePatterns(config.exclude || config.crawl?.exclude || [], "crawl.exclude");

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
  const guardOptions = { security: config.security, limits: config.limits };
  const filterReason = createFilter(config, target);
  const robots = await loadRobots(target, respectRobots, guardOptions);
  const sitemaps = [];
  const queue = [{ url: target, depth: 0 }];
  const skipped = [];

  if (sitemapUrl) {
    const sitemap = await loadSitemap(sitemapUrl, guardOptions);
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

    const snapshot = await collectSnapshot(item.url, {
      render: config.render?.mode,
      renderer: config.renderer,
      security: config.security,
      limits: config.limits,
    });
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
