import { resolveUrl } from "./url-utils.mjs";

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

const linkByRel = (html, rel, baseUrl) => {
  const tags = allMatches(html, /<link\b[^>]*>/gi, (match) => match[0]);
  const tag = tags.find((item) =>
    String(attr(item, "rel") || "")
      .toLowerCase()
      .split(/\s+/)
      .includes(rel.toLowerCase()),
  );
  const href = tag ? attr(tag, "href") : null;
  return href && baseUrl ? resolveUrl(href, baseUrl) : href;
};

export const extractHtmlEvidence = (html, baseUrl = null) => {
  const title = firstTagContent(html, "title");
  const description = metaByName(html, "description");
  const robots = metaByName(html, "robots");
  const canonical = linkByRel(html, "canonical", baseUrl);

  const h1 = allMatches(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, (match) => cleanText(match[1]));
  const headings = allMatches(html, /<h([2-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (match) => ({
    level: Number(match[1]),
    text: cleanText(match[2]),
  }));

  const links = allMatches(html, /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (match) => ({
    href: baseUrl ? resolveUrl(match[1], baseUrl) : match[1],
    text: cleanText(match[2]),
  })).filter((link) => link.href);

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
    h1,
    headings,
    links,
    images,
    structuredData,
    counts: {
      h1: h1.length,
      headings: headings.length,
      links: links.length,
      images: images.length,
      structuredData: structuredData.length,
      visibleTextCharacters: visibleText.length,
    },
    visibleTextPreview: visibleText.slice(0, 1200),
  };
};
