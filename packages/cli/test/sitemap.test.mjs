import test from "node:test";
import assert from "node:assert/strict";
import { parseSitemap } from "../src/sitemap.mjs";

test("parses urlset locations", () => {
  const parsed = parseSitemap(`
    <urlset>
      <url><loc>https://example.com/</loc></url>
      <url><loc>https://example.com/about</loc></url>
    </urlset>
  `);
  assert.equal(parsed.type, "urlset");
  assert.deepEqual(parsed.urls, ["https://example.com/", "https://example.com/about"]);
});

test("parses sitemapindex locations", () => {
  const parsed = parseSitemap(`
    <sitemapindex>
      <sitemap><loc>https://example.com/sitemap-pages.xml</loc></sitemap>
    </sitemapindex>
  `);
  assert.equal(parsed.type, "sitemapindex");
  assert.deepEqual(parsed.sitemaps, ["https://example.com/sitemap-pages.xml"]);
});
