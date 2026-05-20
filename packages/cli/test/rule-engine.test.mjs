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

const renderedSnapshotFor = (rawHtml, renderedHtml, overrides = {}) => {
  const renderedEvidence = extractHtmlEvidence(renderedHtml, "https://example.com/bad-page");
  return snapshotFor(rawHtml, {
    render: {
      status: "rendered",
      evidence: renderedEvidence,
    },
    ...overrides,
  });
};

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

test("flags structured data visible content mismatches", () => {
  const findings = evaluatePage(
    snapshotFor(`
      <html>
        <head>
          <title>Consulting Services</title>
          <meta name="description" content="Implementation support">
          <script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hidden Enterprise Platform","offers":{"price":"99","priceCurrency":"USD"}}</script>
        </head>
        <body>
          <h1>Consulting Services</h1>
          <p>${"Implementation support for operational teams. ".repeat(40)}</p>
        </body>
      </html>
    `),
  );

  const finding = findings.find((item) => item.ruleId === "structured_data.visible_content_mismatch");
  assert.ok(finding);
  assert.equal(finding.severity, "P1");
  assert.deepEqual(finding.evidence.slice(0, 2), [
    "$.pages[0].evidence.structuredData[0]",
    "$.pages[0].evidence.visibleTextPreview",
  ]);
});

test("does not flag structured data values visible in page evidence", () => {
  const findings = evaluatePage(
    snapshotFor(`
      <html>
        <head>
          <title>Hidden Enterprise Platform</title>
          <meta name="description" content="Hidden Enterprise Platform implementation">
          <script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hidden Enterprise Platform","offers":{"price":"99","priceCurrency":"USD"}}</script>
        </head>
        <body>
          <h1>Hidden Enterprise Platform</h1>
          <p>${"Hidden Enterprise Platform implementation support. ".repeat(40)}</p>
        </body>
      </html>
    `),
  );

  assert.equal(findings.some((item) => item.ruleId === "structured_data.visible_content_mismatch"), false);
});

test("flags entity clarity gaps on substantial pages with weak entity signals", () => {
  const findings = evaluatePage(
    snapshotFor(`
      <html>
        <head><title>Implementation Services</title><meta name="description" content="Implementation services"></head>
        <body>
          <h1>Implementation Services</h1>
          <p>${"Detailed service scope, process, delivery model, and customer outcomes. ".repeat(45)}</p>
        </body>
      </html>
    `, {
      finalUrl: "https://example.com/services",
    }),
  );

  const finding = findings.find((item) => item.ruleId === "geo.entity_clarity_gap");
  assert.ok(finding);
  assert.equal(finding.severity, "P2");
});

test("does not flag entity clarity gaps when two strong signals exist", () => {
  const findings = evaluatePage(
    snapshotFor(`
      <html>
        <head>
          <title>Implementation Services</title>
          <meta name="description" content="Implementation services">
          <meta property="og:site_name" content="Example Co">
          <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Example Co","url":"https://example.com"}</script>
        </head>
        <body>
          <h1>Implementation Services</h1>
          <p>${"Detailed service scope, process, delivery model, and customer outcomes. ".repeat(45)}</p>
        </body>
      </html>
    `, {
      finalUrl: "https://example.com/services",
    }),
  );

  assert.equal(findings.some((item) => item.ruleId === "geo.entity_clarity_gap"), false);
});

test("flags rendered metadata and canonical changes", () => {
  const findings = evaluatePage(renderedSnapshotFor(
    `
      <html>
        <head>
          <title>Raw title</title>
          <meta name="description" content="Raw description">
          <link rel="canonical" href="https://example.com/raw">
        </head>
        <body><h1>Product page</h1><p>${"Useful product copy ".repeat(25)}</p></body>
      </html>
    `,
    `
      <html>
        <head>
          <title>Rendered title</title>
          <meta name="description" content="Rendered description">
          <link rel="canonical" href="https://example.com/rendered">
        </head>
        <body><h1>Product page</h1><p>${"Useful product copy ".repeat(25)}</p></body>
      </html>
    `,
  ));

  const ids = findings.map((finding) => finding.ruleId);
  assert.ok(ids.includes("technical.rendered_title_changed"));
  assert.ok(ids.includes("technical.rendered_description_changed"));
  assert.ok(ids.includes("technical.rendered_canonical_changed"));

  const canonical = findings.find((finding) => finding.ruleId === "technical.rendered_canonical_changed");
  assert.equal(canonical.severity, "P1");
  assert.equal(canonical.owner, "Engineering");
  assert.deepEqual(canonical.evidence, [
    "$.pages[0].evidence.canonical",
    "$.pages[0].render.evidence.canonical",
  ]);
});

test("flags rendered primary heading and structured data loss", () => {
  const findings = evaluatePage(renderedSnapshotFor(
    `
      <html>
        <head>
          <title>Organization profile</title>
          <meta name="description" content="Organization profile description">
          <link rel="canonical" href="https://example.com/bad-page">
          <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Example"}</script>
        </head>
        <body><h1>Organization profile</h1><p>${"Useful organization context ".repeat(25)}</p></body>
      </html>
    `,
    `
      <html>
        <head>
          <title>Organization profile</title>
          <meta name="description" content="Organization profile description">
          <link rel="canonical" href="https://example.com/bad-page">
        </head>
        <body><p>${"Useful organization context ".repeat(25)}</p></body>
      </html>
    `,
  ));

  const ids = findings.map((finding) => finding.ruleId);
  assert.ok(ids.includes("technical.rendered_primary_heading_missing"));
  assert.ok(ids.includes("technical.rendered_structured_data_lost"));

  const structuredData = findings.find((finding) => finding.ruleId === "technical.rendered_structured_data_lost");
  assert.deepEqual(structuredData.evidence, [
    "$.pages[0].evidence.structuredData",
    "$.pages[0].render.evidence.structuredData",
  ]);
});

test("flags rendered_content_missing without duplicate raw_rendered_mismatch", () => {
  const findings = evaluatePage(renderedSnapshotFor(
    `
      <html>
        <head>
          <title>Long page</title>
          <meta name="description" content="Long page description">
          <link rel="canonical" href="https://example.com/bad-page">
        </head>
        <body><h1>Long page</h1><p>${"Primary content sentence with useful context. ".repeat(30)}</p></body>
      </html>
    `,
    `
      <html>
        <head>
          <title>Long page</title>
          <meta name="description" content="Long page description">
          <link rel="canonical" href="https://example.com/bad-page">
        </head>
        <body><h1>Long page</h1><p>Loading.</p></body>
      </html>
    `,
  ));

  const ids = findings.map((finding) => finding.ruleId);
  assert.ok(ids.includes("technical.rendered_content_missing"));
  assert.equal(ids.includes("technical.raw_rendered_mismatch"), false);
});

test("flags broad raw_rendered_mismatch when rendered content is still substantial", () => {
  const findings = evaluatePage(renderedSnapshotFor(
    `
      <html>
        <head>
          <title>Comparison page</title>
          <meta name="description" content="Comparison page description">
          <link rel="canonical" href="https://example.com/bad-page">
        </head>
        <body><h1>Comparison page</h1><p>${"Detailed comparison content. ".repeat(45)}</p></body>
      </html>
    `,
    `
      <html>
        <head>
          <title>Comparison page</title>
          <meta name="description" content="Comparison page description">
          <link rel="canonical" href="https://example.com/bad-page">
        </head>
        <body><h1>Comparison page</h1><p>${"Detailed comparison content. ".repeat(20)}</p></body>
      </html>
    `,
  ));

  const mismatch = findings.find((finding) => finding.ruleId === "technical.raw_rendered_mismatch");
  assert.ok(mismatch);
  assert.deepEqual(mismatch.evidence, [
    "$.pages[0].evidence.counts.visibleTextCharacters",
    "$.pages[0].render.evidence.counts.visibleTextCharacters",
  ]);
});

test("emits no render parity findings without rendered evidence or when rendered evidence matches", () => {
  const html = `
    <html>
      <head>
        <title>Stable page</title>
        <meta name="description" content="Stable page description">
        <link rel="canonical" href="https://example.com/bad-page">
        <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Example"}</script>
      </head>
      <body><h1>Stable page</h1><h2>Details</h2><p>${"Stable useful content. ".repeat(20)}</p></body>
    </html>
  `;
  const parityRuleIds = [
    "technical.rendered_title_changed",
    "technical.rendered_description_changed",
    "technical.rendered_canonical_changed",
    "technical.rendered_primary_heading_missing",
    "technical.rendered_structured_data_lost",
    "technical.rendered_content_missing",
    "technical.raw_rendered_mismatch",
  ];

  const withoutRenderedEvidence = evaluatePage(snapshotFor(html, { render: { status: "rendered" } }));
  assert.deepEqual(withoutRenderedEvidence.filter((finding) => parityRuleIds.includes(finding.ruleId)), []);

  const matchingRenderedEvidence = evaluatePage(renderedSnapshotFor(html, html));
  assert.deepEqual(matchingRenderedEvidence.filter((finding) => parityRuleIds.includes(finding.ruleId)), []);
});
