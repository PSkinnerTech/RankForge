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

const longCopy = (phrase = "Shared content") => `${phrase} `.repeat(80);

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

test("detects duplicate content clusters beyond duplicate metadata", () => {
  const copy = longCopy("Detailed repeated service description");
  const findings = evaluateSite([
    page("https://example.com/a", `<title>Shared Page</title><meta name='description' content='A'><h1>Shared Page</h1><p>${copy}</p>`),
    page("https://example.com/b", `<title>Shared Page</title><meta name='description' content='B'><h1>Shared Page</h1><p>${copy}</p>`),
    page("https://example.com/c", `<title>Shared Page</title><meta name='description' content='C'><h1>Shared Page</h1><p>${copy}</p>`),
  ]);

  const finding = findings.find((item) => item.ruleId === "policy.duplicate_content_cluster");
  assert.ok(finding);
  assert.equal(finding.severity, "P2");
  assert.deepEqual(finding.affectedUrls, [
    "https://example.com/a",
    "https://example.com/b",
    "https://example.com/c",
  ]);
});

test("does not flag duplicate content cluster false positives", () => {
  const copy = longCopy("Detailed repeated service description");
  const completePreviewCopy = "Detailed repeated service description ".repeat(25);

  assert.equal(evaluateSite([
    page("https://example.com/a", `<title>Alpha Page</title><h1>Alpha Page</h1><p>${completePreviewCopy}</p>`),
    page("https://example.com/b", `<title>Bravo Page</title><h1>Bravo Page</h1><p>${completePreviewCopy}</p>`),
    page("https://example.com/c", `<title>Charlie Page</title><h1>Charlie Page</h1><p>${completePreviewCopy}</p>`),
  ]).some((finding) => finding.ruleId === "policy.duplicate_content_cluster"), false);

  assert.equal(evaluateSite([
    page("https://example.com/a", `<title>Alpha Page</title><h1>Alpha Page</h1><p>${copy}</p>`),
    page("https://example.com/b", `<title>Bravo Page</title><h1>Bravo Page</h1><p>${copy}</p>`),
  ]).some((finding) => finding.ruleId === "policy.duplicate_content_cluster"), false);

  assert.equal(evaluateSite([
    page("https://example.com/a", "<title>Alpha Page</title><h1>Alpha Page</h1><p>Short duplicate.</p>"),
    page("https://example.com/b", "<title>Bravo Page</title><h1>Bravo Page</h1><p>Short duplicate.</p>"),
    page("https://example.com/c", "<title>Charlie Page</title><h1>Charlie Page</h1><p>Short duplicate.</p>"),
  ]).some((finding) => finding.ruleId === "policy.duplicate_content_cluster"), false);

  assert.equal(evaluateSite([
    page("https://example.com/a", `<title>Alpha Page</title><meta name='robots' content='noindex'><h1>Alpha Page</h1><p>${copy}</p>`),
    page("https://example.com/b", `<title>Bravo Page</title><meta name='robots' content='noindex'><h1>Bravo Page</h1><p>${copy}</p>`),
    page("https://example.com/c", `<title>Charlie Page</title><meta name='robots' content='noindex'><h1>Charlie Page</h1><p>${copy}</p>`),
  ]).some((finding) => finding.ruleId === "policy.duplicate_content_cluster"), false);

  assert.equal(evaluateSite([
    page("https://example.com/a", `<title>Alpha Page</title><link rel='canonical' href='https://example.com/root'><h1>Alpha Page</h1><p>${copy}</p>`),
    page("https://example.com/b", `<title>Bravo Page</title><link rel='canonical' href='https://example.com/root'><h1>Bravo Page</h1><p>${copy}</p>`),
    page("https://example.com/c", `<title>Charlie Page</title><link rel='canonical' href='https://example.com/root'><h1>Charlie Page</h1><p>${copy}</p>`),
  ]).some((finding) => finding.ruleId === "policy.duplicate_content_cluster"), false);
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
