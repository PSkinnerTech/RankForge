import test from "node:test";
import assert from "node:assert/strict";
import { generateMarkdownReport } from "../src/report.mjs";

test("generates a Markdown audit report from audit JSON", () => {
  const markdown = generateMarkdownReport({
    run: { target: "https://example.com" },
    findings: [
      {
        ruleId: "indexability.noindex",
        severity: "P1",
        title: "Important page has a noindex directive",
        impact: "Pages with noindex are not eligible for Google Search.",
        recommendation: "Remove noindex.",
        owner: "Engineering",
        effort: "M",
        implementationTask: {
          summary: "Remove noindex.",
          owner: "Engineering",
          effort: "M",
          acceptanceCriteria: ["The noindex finding no longer appears."],
        },
        affectedUrls: ["https://example.com"],
        sources: ["https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag"],
      },
    ],
    scores: {
      crawl_index: { score: 60, findings: ["indexability.noindex"], p0: 0, p1: 1, p2: 0, p3: 0 },
    },
    integrations: {
      lighthouse: {
        performanceScore: 42,
        metrics: { lcpMs: 4100, cls: 0.22, tbtMs: 500 },
        formFactor: "mobile",
      },
    },
    evidenceGaps: [{ id: "ranking.integrations_missing", message: "Ranking evidence missing." }],
    sources: [{ id: "robots_meta", url: "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag" }],
  });

  assert.match(markdown, /# GEO\/SEO Audit Report/);
  assert.match(markdown, /Target: https:\/\/example\.com/);
  assert.match(markdown, /Priority Findings/);
  assert.match(markdown, /indexability\.noindex/);
  assert.match(markdown, /Lighthouse/);
  assert.match(markdown, /42\/100/);
  assert.match(markdown, /Implementation Tasks/);
  assert.match(markdown, /Engineering/);
  assert.match(markdown, /Evidence Gaps/);
  assert.match(markdown, /https:\/\/developers\.google\.com\/search\/docs\/crawling-indexing\/robots-meta-tag/);
});

test("includes repository evidence when audit repo evidence exists", () => {
  const markdown = generateMarkdownReport({
    run: { target: "repo" },
    findings: [],
    scores: {},
    integrations: {},
    evidenceGaps: [],
    sources: [],
    repo: {
      path: "/repo",
      detectedFramework: "generic-static",
      packageManager: null,
      staticDirRelative: "dist\nwith pipe | value",
      previewCommand: null,
      previewUrl: null,
      routeSources: [{ type: "static_html", route: "/", path: "/repo/dist/index.html" }],
      sourceFindings: [
        {
          id: "repo.static_dir_missing",
          severity: "P1",
          message: "Static directory\nis missing | invalid.",
          evidence: "dist",
          recommendation: "Build the repository or pass an existing static directory.",
          confidence: "high",
        },
      ],
    },
  });

  assert.match(markdown, /## Repository Evidence/);
  assert.match(markdown, /Framework: generic-static/);
  assert.match(markdown, /Static dir: dist with pipe \\| value/);
  assert.match(markdown, /repo\.static_dir_missing: Static directory is missing \\| invalid\./);
});
