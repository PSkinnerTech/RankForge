import { isHttpUrl, resolveUrl, sameOrigin } from "./url-utils.mjs";

const decodeEntities = (value) =>
  String(value || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

export const cleanText = (value) =>
  decodeEntities(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const attr = (tag, name) => {
  const pattern = new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i");
  return tag.match(pattern)?.[1] ?? null;
};

const allMatches = (html, pattern, mapper) => {
  const results = [];
  let match;
  while ((match = pattern.exec(html))) results.push(mapper(match));
  return results;
};

const unique = (values) => [...new Set(values.filter(Boolean))];

const firstTagContent = (html, tagName) => {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = html.match(pattern);
  return match ? cleanText(match[1]) : null;
};

const metaByName = (html, name) => {
  const tags = allMatches(html, /<meta\b[^>]*>/gi, (match) => match[0]);
  const tag = tags.find((item) => attr(item, "name")?.toLowerCase() === name.toLowerCase());
  return tag ? cleanText(attr(tag, "content") || "") : null;
};

const metaByProperty = (html, property) => {
  const tags = allMatches(html, /<meta\b[^>]*>/gi, (match) => match[0]);
  const tag = tags.find((item) => attr(item, "property")?.toLowerCase() === property.toLowerCase());
  return tag ? cleanText(attr(tag, "content") || "") : null;
};

const metaContents = (html, selectors) => {
  const tags = allMatches(html, /<meta\b[^>]*>/gi, (match) => match[0]);
  return unique(
    tags.flatMap((tag) => {
      const content = cleanText(attr(tag, "content") || "");
      if (!content) return [];
      return selectors.some(({ key, value }) => attr(tag, key)?.toLowerCase() === value.toLowerCase()) ? [content] : [];
    }),
  );
};

const linkTags = (html) => allMatches(html, /<link\b[^>]*>/gi, (match) => match[0]);

const relParts = (tag) =>
  String(attr(tag, "rel") || "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

const linkByRel = (html, rel, baseUrl) => {
  const tags = linkTags(html);
  const tag = tags.find((item) =>
    relParts(item).includes(rel.toLowerCase()),
  );
  const href = tag ? attr(tag, "href") : null;
  return href && baseUrl ? resolveUrl(href, baseUrl) : href;
};

const favicon = (html, baseUrl) => {
  const tag = linkTags(html).find((item) => {
    const rel = relParts(item);
    return rel.includes("icon") || rel.includes("shortcut") || rel.includes("apple-touch-icon");
  });
  const href = tag ? attr(tag, "href") : null;
  return href && baseUrl ? resolveUrl(href, baseUrl) : href;
};

const hreflangLinks = (html, baseUrl) =>
  linkTags(html)
    .filter((tag) => relParts(tag).includes("alternate") && attr(tag, "hreflang") && attr(tag, "href"))
    .map((tag) => ({
      hreflang: attr(tag, "hreflang"),
      href: baseUrl ? resolveUrl(attr(tag, "href"), baseUrl) : attr(tag, "href"),
    }))
    .filter((item) => item.href);

const previewDirectives = (values) =>
  unique(
    values
      .filter(Boolean)
      .flatMap((value) => String(value).split(","))
      .map((item) => item.trim())
      .filter((item) => /^(?:nosnippet|noarchive|noimageindex|max-(?:snippet|image-preview|video-preview):)/i.test(item)),
  );

const structuredDataTypes = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(structuredDataTypes);
  if (typeof value !== "object") return [];

  const types = [];
  if (value["@type"]) {
    if (Array.isArray(value["@type"])) types.push(...value["@type"].map(String));
    else types.push(String(value["@type"]));
  }
  if (value["@graph"]) types.push(...structuredDataTypes(value["@graph"]));
  return types;
};

const linkCounts = (links, baseUrl) => {
  const counts = { internal: 0, external: 0 };
  for (const link of links) {
    if (!isHttpUrl(link.href)) continue;
    if (baseUrl && sameOrigin(baseUrl, link.href)) counts.internal += 1;
    else counts.external += 1;
  }
  return counts;
};

export const extractHtmlEvidence = (html, baseUrl = null) => {
  const title = firstTagContent(html, "title");
  const description = metaByName(html, "description");
  const robots = metaByName(html, "robots");
  const googlebot = metaByName(html, "googlebot");
  const canonical = linkByRel(html, "canonical", baseUrl);
  const siteName = metaByProperty(html, "og:site_name") || metaByName(html, "application-name");
  const alternates = hreflangLinks(html, baseUrl);
  const faviconUrl = favicon(html, baseUrl);

  const h1 = allMatches(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, (match) => cleanText(match[1]));
  const headings = allMatches(html, /<h([2-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (match) => ({
    level: Number(match[1]),
    text: cleanText(match[2]),
  }));

  const links = allMatches(html, /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (match) => ({
    href: baseUrl ? resolveUrl(match[1], baseUrl) : match[1],
    text: cleanText(match[2]),
  })).filter((link) => link.href);
  const countsByLinkType = linkCounts(links, baseUrl);

  const images = allMatches(html, /<img\b[^>]*>/gi, (match) => {
    const tag = match[0];
    const src = attr(tag, "src");
    return {
      src: src && baseUrl ? resolveUrl(src, baseUrl) : src,
      alt: attr(tag, "alt"),
    };
  });

  const structuredData = allMatches(
    html,
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    (match) => {
      const raw = match[1].trim();
      try {
        return { data: JSON.parse(raw) };
      } catch {
        return { parseError: true, rawPreview: cleanText(raw).slice(0, 500) };
      }
    },
  );
  const schemaTypes = unique(structuredData.flatMap((item) => structuredDataTypes(item.data)));

  const authors = metaContents(html, [
    { key: "name", value: "author" },
    { key: "property", value: "article:author" },
  ]);
  const dates = unique([
    ...metaContents(html, [
      { key: "name", value: "date" },
      { key: "property", value: "article:published_time" },
      { key: "property", value: "article:modified_time" },
      { key: "name", value: "dc.date" },
    ]),
    ...allMatches(html, /<time\b[^>]*>/gi, (match) => attr(match[0], "datetime")),
  ]);

  const visibleText = cleanText(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " "),
  );

  return {
    title,
    description,
    robots,
    canonical,
    favicon: faviconUrl,
    siteName,
    hreflang: alternates,
    previewDirectives: previewDirectives([robots, googlebot]),
    h1,
    headings,
    links,
    images,
    structuredData,
    schemaTypes,
    entitySignals: {
      authors,
      dates,
    },
    counts: {
      h1: h1.length,
      headings: headings.length,
      links: links.length,
      internalLinks: countsByLinkType.internal,
      externalLinks: countsByLinkType.external,
      images: images.length,
      structuredData: structuredData.length,
      visibleTextCharacters: visibleText.length,
    },
    visibleTextPreview: visibleText.slice(0, 1200),
  };
};
