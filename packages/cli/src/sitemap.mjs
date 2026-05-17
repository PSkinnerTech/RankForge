const decodeEntities = (value) =>
  String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const locs = (xml) => {
  const results = [];
  let match;
  const pattern = /<loc\b[^>]*>([\s\S]*?)<\/loc>/gi;
  while ((match = pattern.exec(xml))) results.push(decodeEntities(match[1].trim()));
  return results;
};

export const parseSitemap = (xml) => {
  const body = String(xml || "");
  const locations = locs(body);

  if (/<sitemapindex\b/i.test(body)) {
    return { type: "sitemapindex", urls: [], sitemaps: locations };
  }

  if (/<urlset\b/i.test(body)) {
    return { type: "urlset", urls: locations, sitemaps: [] };
  }

  return { type: "unknown", urls: [], sitemaps: [] };
};
