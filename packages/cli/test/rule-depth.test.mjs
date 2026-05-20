import test from "node:test";
import assert from "node:assert/strict";
import { extractHtmlEvidence } from "../src/html-extract.mjs";
import {
  contentFingerprint,
  duplicateContentClusterFacts,
  entityClarityFacts,
  structuredDataVisibleContentFacts,
} from "../src/rule-depth.mjs";

const page = (url, html, overrides = {}) => ({
  finalUrl: url,
  status: 200,
  evidence: extractHtmlEvidence(html, url),
  ...overrides,
});

const longCopy = (phrase = "Useful evidence driven content") => `${phrase} `.repeat(80);

test("creates stable content fingerprints from visible text previews", () => {
  const one = "Example, BODY! Content. ".repeat(40);
  const two = "example body content ".repeat(40);

  assert.equal(
    contentFingerprint(one),
    contentFingerprint(two),
  );
  assert.equal(contentFingerprint("Short"), "");
});

test("keeps fingerprints exact after the first 500 normalized characters", () => {
  const sharedPrefix = `${"Shared introduction content ".repeat(20)}shared exact prefix marker`;
  const first = `${sharedPrefix} Original service details continue here.`;
  const second = `${sharedPrefix} Different advisory details continue here.`;

  assert.notEqual(
    contentFingerprint(first),
    contentFingerprint(second),
  );

  const pages = [
    page("https://example.com/one", `<title>One</title><h1>One</h1><p>${first}</p>`),
    page("https://example.com/two", `<title>Two</title><h1>Two</h1><p>${second}</p>`),
    page("https://example.com/tri", `<title>Tri</title><h1>Tri</h1><p>${sharedPrefix} Third variation details continue here.</p>`),
  ];

  assert.deepEqual(duplicateContentClusterFacts(pages), []);
});

test("detects structured data values absent from visible content", () => {
  const facts = structuredDataVisibleContentFacts(
    page("https://example.com/product", `
      <html>
        <head>
          <title>Services</title>
          <meta name="description" content="Services overview">
          <script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hidden Enterprise Platform","offers":{"price":"99","priceCurrency":"USD"}}</script>
        </head>
        <body><h1>Services</h1><p>${longCopy("Consulting and implementation support")}</p></body>
      </html>
    `),
    0,
  );

  assert.equal(facts.length, 1);
  assert.equal(facts[0].ruleId, "structured_data.visible_content_mismatch");
  assert.deepEqual(facts[0].evidence, [
    "$.pages[0].evidence.structuredData[0]",
    "$.pages[0].evidence.visibleTextPreview",
    "$.pages[0].evidence.title",
    "$.pages[0].evidence.h1",
    "$.pages[0].evidence.headings",
  ]);
});

test("does not treat structured data tokens as visible when they only appear as substrings", () => {
  const facts = structuredDataVisibleContentFacts(
    page("https://example.com/product", `
      <html>
        <head>
          <title>Services</title>
          <meta name="description" content="Services overview">
          <script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Ace Pro","offers":{"price":"99","priceCurrency":"USD"}}</script>
        </head>
        <body><h1>Services</h1><p>${longCopy("space process implementation support")}</p></body>
      </html>
    `),
    0,
  );

  assert.equal(facts.length, 1);
  assert.equal(facts[0].ruleId, "structured_data.visible_content_mismatch");
});

test("does not flag structured data values visible in page evidence", () => {
  const facts = structuredDataVisibleContentFacts(
    page("https://example.com/product", `
      <html>
        <head>
          <title>Hidden Enterprise Platform</title>
          <meta name="description" content="Hidden Enterprise Platform overview">
          <script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hidden Enterprise Platform","offers":{"price":"99","priceCurrency":"USD"}}</script>
        </head>
        <body><h1>Hidden Enterprise Platform</h1><p>${longCopy("Hidden Enterprise Platform")}</p></body>
      </html>
    `),
    0,
  );

  assert.deepEqual(facts, []);
});

test("ignores invalid and unsupported structured data for visible content mismatch", () => {
  const invalidFacts = structuredDataVisibleContentFacts(
    page("https://example.com/bad", `
      <html>
        <head><script type="application/ld+json">{bad json}</script></head>
        <body><h1>Bad</h1><p>${longCopy()}</p></body>
      </html>
    `),
    0,
  );
  assert.deepEqual(invalidFacts, []);

  const unsupportedFacts = structuredDataVisibleContentFacts(
    page("https://example.com/faq", `
      <html>
        <head><script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","name":"Hidden FAQ"}</script></head>
        <body><h1>FAQ</h1><p>${longCopy()}</p></body>
      </html>
    `),
    0,
  );
  assert.deepEqual(unsupportedFacts, []);
});

test("detects entity clarity gaps on substantial pages with weak signals", () => {
  const facts = entityClarityFacts(
    page("https://example.com/services", `
      <html>
        <head><title>Services</title><meta name="description" content="Services"></head>
        <body><h1>Services</h1><p>${longCopy("Implementation service details")}</p></body>
      </html>
    `),
    0,
  );

  assert.equal(facts.length, 1);
  assert.equal(facts[0].ruleId, "geo.entity_clarity_gap");
});

test("does not flag entity clarity when two strong signals exist", () => {
  const facts = entityClarityFacts(
    page("https://example.com/services", `
      <html>
        <head>
          <title>Services</title>
          <meta name="description" content="Services">
          <meta property="og:site_name" content="Example Co">
          <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Example Co","url":"https://example.com"}</script>
        </head>
        <body><h1>Services</h1><p>${longCopy("Implementation service details")}</p></body>
      </html>
    `),
    0,
  );

  assert.deepEqual(facts, []);
});

test("does not flag entity clarity on thin or noindexed pages", () => {
  assert.deepEqual(entityClarityFacts(page("https://example.com/thin", "<title>Thin</title><h1>Thin</h1><p>Short.</p>"), 0), []);
  assert.deepEqual(
    entityClarityFacts(
      page("https://example.com/private", `
        <html>
          <head><title>Private</title><meta name="robots" content="noindex"></head>
          <body><h1>Private</h1><p>${longCopy()}</p></body>
        </html>
      `),
      0,
    ),
    [],
  );
});

test("detects duplicate content clusters for substantial pages", () => {
  const copy = "Shared service detail ".repeat(30);
  const facts = duplicateContentClusterFacts([
    page("https://example.com/a", `<title>Alpha Page</title><h1>Alpha Page</h1><p>${copy}</p>`),
    page("https://example.com/b", `<title>Bravo Page</title><h1>Bravo Page</h1><p>${copy}</p>`),
    page("https://example.com/c", `<title>Charlie Page</title><h1>Charlie Page</h1><p>${copy}</p>`),
  ]);

  assert.equal(facts.length, 1);
  assert.equal(facts[0].ruleId, "policy.duplicate_content_cluster");
  assert.deepEqual(facts[0].affectedUrls, [
    "https://example.com/a",
    "https://example.com/b",
    "https://example.com/c",
  ]);
});

test("does not flag duplicate content pairs, short pages, noindexed pages, or canonical alternates", () => {
  const copy = longCopy("Shared service detail");
  assert.deepEqual(duplicateContentClusterFacts([
    page("https://example.com/a", `<title>Alpha Page</title><h1>Alpha Page</h1><p>${copy}</p>`),
    page("https://example.com/b", `<title>Bravo Page</title><h1>Bravo Page</h1><p>${copy}</p>`),
  ]), []);

  assert.deepEqual(duplicateContentClusterFacts([
    page("https://example.com/a", "<title>Alpha Page</title><h1>Alpha Page</h1><p>Short duplicate.</p>"),
    page("https://example.com/b", "<title>Bravo Page</title><h1>Bravo Page</h1><p>Short duplicate.</p>"),
    page("https://example.com/c", "<title>Charlie Page</title><h1>Charlie Page</h1><p>Short duplicate.</p>"),
  ]), []);

  assert.deepEqual(duplicateContentClusterFacts([
    page("https://example.com/a", `<title>Alpha Page</title><meta name="robots" content="noindex"><h1>Alpha Page</h1><p>${copy}</p>`),
    page("https://example.com/b", `<title>Bravo Page</title><meta name="robots" content="noindex"><h1>Bravo Page</h1><p>${copy}</p>`),
    page("https://example.com/c", `<title>Charlie Page</title><meta name="robots" content="noindex"><h1>Charlie Page</h1><p>${copy}</p>`),
  ]), []);

  assert.deepEqual(duplicateContentClusterFacts([
    page("https://example.com/a", `<title>Alpha Page</title><link rel="canonical" href="https://example.com/root"><h1>Alpha Page</h1><p>${copy}</p>`),
    page("https://example.com/b", `<title>Bravo Page</title><link rel="canonical" href="https://example.com/root"><h1>Bravo Page</h1><p>${copy}</p>`),
    page("https://example.com/c", `<title>Charlie Page</title><link rel="canonical" href="https://example.com/root"><h1>Charlie Page</h1><p>${copy}</p>`),
  ]), []);
});
