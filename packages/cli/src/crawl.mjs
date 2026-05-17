import { collectSnapshot } from "./snapshot.mjs";
import { isHttpUrl, normalizeUrl, sameOrigin } from "./url-utils.mjs";

export const crawlSite = async (config) => {
  const target = normalizeUrl(config.target);
  const maxPages = config.maxPages || config.crawl?.maxPages || 50;
  const maxDepth = config.maxDepth ?? config.crawl?.maxDepth ?? 2;
  const queue = [{ url: target, depth: 0 }];
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

    const snapshot = await collectSnapshot(item.url);
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

  return { pages, skipped };
};
