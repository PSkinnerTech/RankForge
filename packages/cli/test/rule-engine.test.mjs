import test from "node:test";
import assert from "node:assert/strict";
import { extractHtmlEvidence } from "../src/html-extract.mjs";
import { evaluatePage, scoreFindings } from "../src/rule-engine.mjs";

const snapshotFor = (html, overrides = {}) => ({
  target: "https://example.com/bad-page",
  sourceType: "url",
  finalUrl: "https://example.com/bad-page",
  status: 200,
  ok: true,
  headers: {},
  redirectChain: [],
  rawHash: "abc",
  evidence: extractHtmlEvidence(html, "https://example.com/bad-page"),
  render: { status: "not_requested" },
  ...overrides,
});

test("evaluates deterministic page findings", () => {
  const findings = evaluatePage(
    snapshotFor(`
      <html>
        <head>
          <meta name="robots" content="noindex,nofollow">
          <script type="application/ld+json">{bad json}</script>
        </head>
        <body>
          <img src="/x.png">
          <p>Short.</p>
        </body>
      </html>
    `),
  );

  const ids = findings.map((finding) => finding.ruleId);
  assert.ok(ids.includes("indexability.noindex"));
  assert.ok(ids.includes("appearance.title_missing"));
  assert.ok(ids.includes("appearance.meta_description_missing"));
  assert.ok(ids.includes("appearance.h1_missing"));
  assert.ok(ids.includes("appearance.image_alt_missing"));
  assert.ok(ids.includes("structured_data.invalid_jsonld"));
  assert.ok(ids.includes("content.thin_content"));

  const noindex = findings.find((finding) => finding.ruleId === "indexability.noindex");
  assert.equal(noindex.severity, "P1");
  assert.equal(noindex.dimension, "crawl_index");
  assert.deepEqual(noindex.affectedUrls, ["https://example.com/bad-page"]);
  assert.ok(noindex.evidence.length > 0);
  assert.ok(noindex.recommendation);
  assert.ok(noindex.confidence);
  assert.ok(noindex.sources.length > 0);
  assert.equal(noindex.implementationTask.owner, noindex.owner);
  assert.equal(noindex.implementationTask.effort, noindex.effort);
  assert.ok(noindex.implementationTask.summary);
  assert.ok(noindex.implementationTask.acceptanceCriteria.length > 0);
});

test("evaluates HTTP and header findings", () => {
  const findings = evaluatePage(
    snapshotFor("<title>Server error</title><h1>Error</h1><p>Enough visible content for this check.</p>", {
      finalUrl: "http://example.com/error",
      status: 500,
      ok: false,
      headers: { "x-robots-tag": "noindex" },
    }),
  );
  const ids = findings.map((finding) => finding.ruleId);
  assert.ok(ids.includes("technical.http_error"));
  assert.ok(ids.includes("technical.https_missing"));
  assert.ok(ids.includes("indexability.x_robots_noindex"));
});

test("evaluates redirect chain and noindex canonical conflicts", () => {
  const findings = evaluatePage(
    snapshotFor(
      `
        <html>
          <head>
            <title>Conflict</title>
            <meta name="description" content="Conflict page">
            <meta name="robots" content="noindex">
            <link rel="canonical" href="https://example.com/preferred">
          </head>
          <body><h1>Conflict</h1><p>${"Useful content ".repeat(30)}</p></body>
        </html>
      `,
      {
        redirectChain: [
          { url: "https://example.com/a", status: 301, location: "https://example.com/b" },
          { url: "https://example.com/b", status: 302, location: "https://example.com/conflict" },
        ],
      },
    ),
  );
  const ids = findings.map((finding) => finding.ruleId);
  assert.ok(ids.includes("technical.redirect_chain"));
  assert.ok(ids.includes("indexability.noindex_canonical_conflict"));
});

test("flags missing favicon on homepage-like URL pages", () => {
  const findings = evaluatePage(
    snapshotFor(
      `
        <html>
          <head>
            <title>Home</title>
            <meta name="description" content="Home page">
            <link rel="canonical" href="https://example.com/">
          </head>
          <body>
            <h1>Home</h1>
            <h2>Section</h2>
            <p>${"Useful homepage content ".repeat(30)}</p>
            <a href="/about">About</a>
          </body>
        </html>
      `,
      { finalUrl: "https://example.com/" },
    ),
  );
  assert.ok(findings.map((finding) => finding.ruleId).includes("appearance.favicon_missing"));
});

test("scores findings by dimension", () => {
  const scores = scoreFindings([
    { dimension: "crawl_index", severity: "P1", ruleId: "indexability.noindex" },
    { dimension: "search_appearance", severity: "P3", ruleId: "appearance.meta_description_missing" },
  ]);
  assert.equal(scores.crawl_index.score, 60);
  assert.equal(scores.crawl_index.p1, 1);
  assert.equal(scores.search_appearance.score, 90);
  assert.equal(scores.search_appearance.p3, 1);
});

test("evaluates homepage GEO and entity readiness gaps", () => {
  const longText = Array.from({ length: 80 }, () => "Useful product context").join(" ");
  const findings = evaluatePage(
    snapshotFor(`
      <html>
        <head>
          <title>Example Product</title>
          <meta name="description" content="Example description">
        </head>
        <body>
          <h1>Example Product</h1>
          <p>${longText}</p>
          <a href="/pricing">Pricing</a>
        </body>
      </html>
    `, {
      finalUrl: "https://example.com/",
    }),
  );

  const ids = findings.map((finding) => finding.ruleId);
  assert.ok(ids.includes("content.answerability_gap"));
  assert.ok(ids.includes("structured_data.organization_missing"));
  assert.ok(ids.includes("entity.about_contact_missing"));
});

test("flags structured data required property gaps", () => {
  const findings = evaluatePage(
    snapshotFor(`
      <html>
        <head>
          <title>Product</title>
          <meta name="description" content="Product description">
          <script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Widget"}</script>
        </head>
        <body>
          <h1>Widget</h1>
          <p>${"Useful product context ".repeat(40)}</p>
        </body>
      </html>
    `),
  );
  const finding = findings.find((item) => item.ruleId === "structured_data.required_property_missing");
  assert.ok(finding);
  assert.match(finding.impact, /offers/);
});
