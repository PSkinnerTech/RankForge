import fs from "node:fs";
import path from "node:path";

const target = process.argv[2];

if (!target || target === "--help" || target === "-h") {
  console.log("Usage: node scripts/collect-page-snapshot.mjs <url-or-html-file>");
  process.exit(target ? 0 : 1);
}

const isUrl = /^https?:\/\//i.test(target);

const readInput = async () => {
  if (isUrl) {
    const response = await fetch(target, {
      headers: { "user-agent": "RankForge GEO SEO audit snapshot" },
      redirect: "follow",
    });
    return {
      finalUrl: response.url,
      status: response.status,
      ok: response.ok,
      html: await response.text(),
      sourceType: "url",
    };
  }

  const fullPath = path.resolve(target);
  return {
    finalUrl: fullPath,
    status: null,
    ok: true,
    html: fs.readFileSync(fullPath, "utf8"),
    sourceType: "file",
  };
};

const pick = (html, pattern) => {
  const match = html.match(pattern);
  return match ? clean(match[1] || match[2] || "") : null;
};

const clean = (value) =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

const allMatches = (html, pattern, mapper) => {
  const results = [];
  let match;
  while ((match = pattern.exec(html))) results.push(mapper(match));
  return results;
};

const data = await readInput();
const html = data.html;

const title = pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
const description = pick(
  html,
  /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
);
const robots = pick(
  html,
  /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["'][^>]*>/i,
);
const canonical = pick(
  html,
  /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i,
);
const h1 = allMatches(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi, (m) => clean(m[1]));
const headings = allMatches(html, /<h([2-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (m) => ({
  level: Number(m[1]),
  text: clean(m[2]),
}));
const links = allMatches(html, /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (m) => ({
  href: m[1],
  text: clean(m[2]),
})).slice(0, 100);
const images = allMatches(html, /<img\b[^>]*>/gi, (m) => {
  const tag = m[0];
  return {
    src: pick(tag, /\bsrc=["']([^"']+)["']/i),
    alt: pick(tag, /\balt=["']([^"']*)["']/i),
  };
}).slice(0, 100);
const structuredData = allMatches(
  html,
  /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  (m) => {
    try {
      return JSON.parse(m[1]);
    } catch {
      return { parseError: true, rawPreview: clean(m[1]).slice(0, 500) };
    }
  },
);

const visibleText = clean(
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " "),
);

console.log(
  JSON.stringify(
    {
      target,
      sourceType: data.sourceType,
      finalUrl: data.finalUrl,
      status: data.status,
      ok: data.ok,
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
    },
    null,
    2,
  ),
);
