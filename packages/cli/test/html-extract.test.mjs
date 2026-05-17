import test from "node:test";
import assert from "node:assert/strict";
import { extractHtmlEvidence } from "../src/html-extract.mjs";

const html = `<!doctype html>
<html>
  <head>
    <title>Example Page</title>
    <meta name="description" content="Useful description.">
    <meta name="robots" content="index,follow">
    <meta name="googlebot" content="max-snippet:120">
    <meta name="author" content="Jane Doe">
    <meta property="article:published_time" content="2026-05-01">
    <meta property="og:site_name" content="Example Site">
    <link rel="canonical" href="/canonical">
    <link rel="alternate" hreflang="es" href="/es/page">
    <link rel="icon" href="/favicon.ico">
    <script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization","name":"Example"},{"@type":"Product","name":"Widget"}]}</script>
    <script type="application/ld+json">{bad json}</script>
  </head>
  <body>
    <h1>Main Heading</h1>
    <h2>Section</h2>
    <a href="/next">Next page</a>
    <a href="https://external.example/resource">External resource</a>
    <time datetime="2026-05-02">May 2, 2026</time>
    <img src="/image.png" alt="Image alt">
    <script>window.secret = true;</script>
    <style>body { color: red; }</style>
    <p>This is visible body text for extraction.</p>
  </body>
</html>`;

test("extracts metadata, links, images, structured data, and visible text", () => {
  const evidence = extractHtmlEvidence(html, "https://example.com/page");
  assert.equal(evidence.title, "Example Page");
  assert.equal(evidence.description, "Useful description.");
  assert.equal(evidence.robots, "index,follow");
  assert.equal(evidence.canonical, "https://example.com/canonical");
  assert.equal(evidence.favicon, "https://example.com/favicon.ico");
  assert.equal(evidence.siteName, "Example Site");
  assert.deepEqual(evidence.hreflang, [{ hreflang: "es", href: "https://example.com/es/page" }]);
  assert.deepEqual(evidence.previewDirectives, ["max-snippet:120"]);
  assert.deepEqual(evidence.h1, ["Main Heading"]);
  assert.equal(evidence.headings[0].level, 2);
  assert.equal(evidence.links[0].href, "https://example.com/next");
  assert.equal(evidence.counts.internalLinks, 1);
  assert.equal(evidence.counts.externalLinks, 1);
  assert.equal(evidence.images[0].src, "https://example.com/image.png");
  assert.equal(evidence.images[0].alt, "Image alt");
  assert.deepEqual(evidence.schemaTypes, ["Organization", "Product"]);
  assert.equal(evidence.structuredData[1].parseError, true);
  assert.deepEqual(evidence.entitySignals.authors, ["Jane Doe"]);
  assert.deepEqual(evidence.entitySignals.dates, ["2026-05-01", "2026-05-02"]);
  assert.ok(evidence.counts.visibleTextCharacters > 0);
  assert.match(evidence.visibleTextPreview, /visible body text/);
});
