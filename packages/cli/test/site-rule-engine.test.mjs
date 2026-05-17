import test from "node:test";
import assert from "node:assert/strict";
import { extractHtmlEvidence } from "../src/html-extract.mjs";
import { evaluateSite } from "../src/site-rule-engine.mjs";

const page = (url, html, overrides = {}) => ({
  target: url,
  sourceType: "url",
  finalUrl: url,
  status: 200,
  ok: true,
  headers: {},
  redirectChain: [],
  rawHash: "hash",
  evidence: extractHtmlEvidence(html, url),
  render: { status: "not_requested" },
  ...overrides,
});

test("detects duplicate titles and descriptions", () => {
  const findings = evaluateSite([
    page("https://example.com/a", "<title>Same</title><meta name='description' content='Same desc'><h1>A</h1>"),
    page("https://example.com/b", "<title>Same</title><meta name='description' content='Same desc'><h1>B</h1>"),
  ]);
  const ids = findings.map((finding) => finding.ruleId);
  assert.ok(ids.includes("appearance.title_duplicate"));
  assert.ok(ids.includes("appearance.meta_description_duplicate"));
  const titleFinding = findings.find((finding) => finding.ruleId === "appearance.title_duplicate");
  assert.equal(titleFinding.implementationTask.owner, titleFinding.owner);
  assert.ok(titleFinding.implementationTask.acceptanceCriteria.length > 0);
});

test("detects broken internal links and canonical target errors", () => {
  const findings = evaluateSite([
    page(
      "https://example.com/",
      "<title>Home</title><meta name='description' content='Home'><link rel='canonical' href='/missing'><h1>Home</h1><a href='/missing'>Missing</a>",
    ),
    page("https://example.com/missing", "<title>Missing</title><h1>Missing</h1>", { status: 404, ok: false }),
  ]);
  const ids = findings.map((finding) => finding.ruleId);
  assert.ok(ids.includes("crawl.broken_internal_link"));
  assert.ok(ids.includes("indexability.canonical_target_error"));
});

test("detects non-canonical URLs listed in sitemaps", () => {
  const findings = evaluateSite(
    [
      page(
        "https://example.com/duplicate",
        "<title>Duplicate</title><meta name='description' content='Duplicate'><link rel='canonical' href='https://example.com/canonical'><h1>Duplicate</h1>",
      ),
    ],
    { sitemapUrls: ["https://example.com/duplicate"] },
  );
  assert.ok(findings.map((finding) => finding.ruleId).includes("indexability.noncanonical_in_sitemap"));
});

test("detects missing sitemap and robots-blocked crawl skips", () => {
  const findings = evaluateSite(
    [
      page(
        "https://example.com/",
        "<title>Home</title><meta name='description' content='Home'><link rel='canonical' href='https://example.com/'><h1>Home</h1>",
      ),
    ],
    {
      crawled: true,
      sitemapUrls: [],
      sitemaps: [],
      skipped: [{ url: "https://example.com/private", reason: "robots_blocked" }],
    },
  );
  const ids = findings.map((finding) => finding.ruleId);
  assert.ok(ids.includes("crawl.sitemap_missing"));
  assert.ok(ids.includes("crawl.robots_blocked"));
});
