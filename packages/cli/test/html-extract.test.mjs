import test from "node:test";
import assert from "node:assert/strict";
import { extractHtmlEvidence } from "../src/html-extract.mjs";

const html = `<!doctype html>
<html>
  <head>
    <title>Example Page</title>
    <meta name="description" content="Useful description.">
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="/canonical">
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Example"}</script>
    <script type="application/ld+json">{bad json}</script>
  </head>
  <body>
    <h1>Main Heading</h1>
    <h2>Section</h2>
    <a href="/next">Next page</a>
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
  assert.deepEqual(evidence.h1, ["Main Heading"]);
  assert.equal(evidence.headings[0].level, 2);
  assert.equal(evidence.links[0].href, "https://example.com/next");
  assert.equal(evidence.images[0].src, "https://example.com/image.png");
  assert.equal(evidence.images[0].alt, "Image alt");
  assert.equal(evidence.structuredData[0].data["@type"], "Organization");
  assert.equal(evidence.structuredData[1].parseError, true);
  assert.ok(evidence.counts.visibleTextCharacters > 0);
  assert.match(evidence.visibleTextPreview, /visible body text/);
});
