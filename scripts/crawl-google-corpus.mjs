import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const rawDir = path.join(root, "references/source-corpus/raw");
const pageDir = path.join(root, "references/source-corpus/pages");
fs.mkdirSync(rawDir, { recursive: true });
fs.mkdirSync(pageDir, { recursive: true });

const seeds = [
  "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
  "https://developers.google.com/search/docs/essentials",
  "https://developers.google.com/search/docs/essentials/technical",
  "https://developers.google.com/search/docs/essentials/spam-policies",
  "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
  "https://developers.google.com/search/docs/fundamentals/how-search-works",
  "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
  "https://developers.google.com/search/docs/fundamentals/using-gen-ai-content",
  "https://developers.google.com/search/docs/fundamentals/get-started",
  "https://developers.google.com/search/docs/fundamentals/get-started-developers",
  "https://developers.google.com/search/docs/fundamentals/do-i-need-seo",
];

const targetedDocs = [
  "https://developers.google.com/search/docs/crawling-indexing",
  "https://developers.google.com/search/docs/crawling-indexing/googlebot",
  "https://developers.google.com/search/docs/crawling-indexing/links-crawlable",
  "https://developers.google.com/search/docs/crawling-indexing/block-indexing",
  "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag",
  "https://developers.google.com/search/docs/crawling-indexing/robots/intro",
  "https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview",
  "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
  "https://developers.google.com/search/docs/crawling-indexing/canonicalization",
  "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
  "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics",
  "https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript",
  "https://developers.google.com/search/docs/crawling-indexing/valid-page-metadata",
  "https://developers.google.com/search/docs/crawling-indexing/special-tags",
  "https://developers.google.com/search/docs/appearance/title-link",
  "https://developers.google.com/search/docs/appearance/snippet",
  "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
  "https://developers.google.com/search/docs/appearance/structured-data/sd-policies",
  "https://developers.google.com/search/docs/appearance/structured-data/search-gallery",
  "https://developers.google.com/search/docs/appearance/structured-data/organization",
  "https://developers.google.com/search/docs/appearance/structured-data/local-business",
  "https://developers.google.com/search/docs/appearance/structured-data/product",
  "https://developers.google.com/search/docs/appearance/structured-data/article",
  "https://developers.google.com/search/docs/appearance/structured-data/faqpage",
  "https://developers.google.com/search/docs/appearance/google-images",
  "https://developers.google.com/search/docs/appearance/ai-features",
];

const relevantTerms = [
  "ai",
  "overview-ai-features",
  "crawl",
  "crawler",
  "index",
  "indexing",
  "canonical",
  "robots",
  "robotstxt",
  "noindex",
  "sitemap",
  "javascript",
  "metadata",
  "meta-tags",
  "title-link",
  "snippets",
  "favicon",
  "structured-data",
  "schema",
  "search-gallery",
  "rich-results",
  "images",
  "image",
  "appearance",
  "preview-controls",
  "helpful-content",
  "gen-ai-content",
  "spam",
  "essentials",
  "seo-starter-guide",
  "how-search-works",
];

const cleanUrl = (url) => {
  const parsed = new URL(url);
  parsed.hash = "";
  parsed.search = "";
  return parsed.href.replace(/\/$/, "");
};

const includeUrl = (url, depth) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "developers.google.com") return false;
    if (!parsed.pathname.startsWith("/search/docs/")) return false;
    if (seeds.includes(cleanUrl(parsed.href))) return true;
    if (targetedDocs.includes(cleanUrl(parsed.href))) return true;
    if (depth > 2) return false;
    const pathname = parsed.pathname.toLowerCase();
    return relevantTerms.some((term) => pathname.includes(term));
  } catch {
    return false;
  }
};

const slugFor = (url) => {
  const parsed = new URL(url);
  return (
    parsed.pathname
      .replace(/^\/search\/docs\//, "")
      .replace(/\/$/, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "index"
  );
};

const decodeEntities = (text) =>
  text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");

const htmlToText = (html) =>
  decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
      .replace(/<(h[1-6])[^>]*>/gi, "\n\n# ")
      .replace(/<\/h[1-6]>/gi, "\n")
      .replace(/<li[^>]*>/gi, "\n- ")
      .replace(/<\/(p|div|section|article|aside|table|tr|ul|ol|pre|blockquote)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n"),
  ).trim();

const extractTitle = (html) => {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = h1 || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return title ? htmlToText(title[1]).replace(/\s+\|.*$/, "").trim() : "";
};

const extractMain = (html) => {
  const candidates = [
    html.match(/<article[^>]*>([\s\S]*?)<\/article>/i),
    html.match(/<main[^>]*>([\s\S]*?)<\/main>/i),
  ];
  return (candidates.find(Boolean) || [null, html])[1];
};

const extractLinks = (html, base) => {
  const links = new Set();
  const anchorPattern = /<a\b[^>]*href=["']([^"']+)["']/gi;
  let match;
  while ((match = anchorPattern.exec(html))) {
    try {
      const absolute = cleanUrl(new URL(match[1], base).href);
      if (includeUrl(absolute, 2)) links.add(absolute);
    } catch {
      // Ignore malformed hrefs.
    }
  }
  return [...links].sort();
};

const fetchPage = async (url) => {
  const response = await fetch(url, {
    headers: { "user-agent": "OpenClaw GEO SEO audit skill corpus builder" },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
};

const queue = [...seeds, ...targetedDocs].map((url) => ({
  url: cleanUrl(url),
  depth: 0,
  seed: seeds.includes(url),
}));
const seen = new Set();
const pages = [];
const maxPages = 90;

while (queue.length && pages.length < maxPages) {
  const item = queue.shift();
  if (seen.has(item.url)) continue;
  seen.add(item.url);
  if (!includeUrl(item.url, item.depth)) continue;

  try {
    const html = await fetchPage(item.url);
    const slug = slugFor(item.url);
    const title = extractTitle(html);
    const main = extractMain(html);
    const text = htmlToText(main);
    const links = extractLinks(html, item.url);
    const fetchedAt = new Date().toISOString();

    fs.writeFileSync(path.join(rawDir, `${slug}.html`), html);
    fs.writeFileSync(
      path.join(pageDir, `${slug}.md`),
      `---
url: ${item.url}
title: ${JSON.stringify(title)}
fetched_at: ${fetchedAt}
seed: ${item.seed ? "true" : "false"}
---

# ${title || slug}

Source: ${item.url}

${text}
`,
    );

    pages.push({
      url: item.url,
      title,
      slug,
      fetchedAt,
      seed: Boolean(item.seed),
      depth: item.depth,
      raw: `references/source-corpus/raw/${slug}.html`,
      text: `references/source-corpus/pages/${slug}.md`,
      outgoingRelevantLinks: links,
    });

    for (const link of links) {
      if (!seen.has(link) && includeUrl(link, item.depth + 1)) {
        queue.push({ url: link, depth: item.depth + 1, seed: false });
      }
    }
    console.log(`fetched ${pages.length}: ${item.url}`);
  } catch (error) {
    pages.push({
      url: item.url,
      error: String(error),
      seed: Boolean(item.seed),
      depth: item.depth,
    });
    console.log(`failed: ${item.url} ${error}`);
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  scope:
    "Google Search Central docs directly relevant to GEO/SEO auditing, AI visibility, crawlability, indexing, metadata, structured data, search appearance, helpful content, and spam policies.",
  seedUrls: seeds,
  targetedDocs,
  pages,
};

fs.writeFileSync(path.join(root, "references/source-manifest.json"), JSON.stringify(manifest, null, 2));
fs.writeFileSync(
  path.join(root, "references/source-manifest.md"),
  `# Source Manifest

Generated: ${manifest.generatedAt}

Scope: ${manifest.scope}

## Pages

${pages
  .map((page, index) => {
    const label = page.title || page.url;
    const prefix = page.error ? "**FETCH ERROR** " : "";
    const suffix = page.text ? ` -- \`${page.text}\`` : "";
    return `${index + 1}. ${prefix}[${label}](${page.url})${suffix}`;
  })
  .join("\n")}
`,
);

console.log(JSON.stringify({ count: pages.length, manifest: "references/source-manifest.json" }, null, 2));
