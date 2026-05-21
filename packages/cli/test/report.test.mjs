import test from "node:test";
import assert from "node:assert/strict";
import { generateMarkdownReport } from "../src/report.mjs";

const polishedAuditFixture = () => ({
  schemaVersion: "1.0.0",
  toolVersion: "0.2.0",
  run: {
    target: "https://example.com",
    startedAt: "2026-05-20T10:00:00.000Z",
    endedAt: "2026-05-20T10:00:02.000Z",
    mode: "full",
    crawl: { mode: "full", maxPages: 10, maxDepth: 2 },
    render: { mode: "never" },
  },
  pages: [
    { finalUrl: "https://example.com/", evidence: { title: "Home" } },
    { finalUrl: "https://example.com/about", evidence: { title: "About" } },
  ],
  findings: [
    {
      ruleId: "indexability.noindex",
      severity: "P1",
      dimension: "crawl_index",
      title: "Important page has a noindex directive",
      impact: "Pages with noindex are not eligible for Google Search.",
      recommendation: "Remove noindex.",
      owner: "Engineering",
      effort: "M",
      implementationTask: {
        summary: "Remove noindex from the affected template.",
        owner: "Engineering",
        effort: "M",
        acceptanceCriteria: ["The noindex finding no longer appears.", "The page remains canonical and crawlable."],
      },
      affectedUrls: ["https://example.com/"],
      evidence: ["$.pages[0].evidence.robots"],
      sources: ["https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag"],
    },
    {
      ruleId: "structured_data.visible_content_mismatch",
      severity: "P1",
      dimension: "structured_data",
      title: "Structured data names content that is not visible",
      impact: "Structured data appears to describe an entity that is not visible in page evidence.",
      recommendation: "Align JSON-LD names with visible page content.",
      owner: "Engineering",
      effort: "M",
      implementationTask: {
        summary: "Align structured data with visible entity copy.",
        owner: "Engineering",
        effort: "M",
        acceptanceCriteria: ["The visible content includes the entity named in JSON-LD."],
      },
      affectedUrls: ["https://example.com/about"],
      evidence: ["$.pages[1].evidence.structuredData[0]", "$.pages[1].evidence.visibleTextPreview"],
      sources: [
        "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
        "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
      ],
    },
    {
      ruleId: "content.thin_content",
      severity: "P2",
      dimension: "helpful_content",
      title: "Page has limited useful main content",
      impact: "Thin pages are less likely to satisfy visitor tasks.",
      recommendation: "Expand visible content with original, useful information.",
      owner: "Content",
      effort: "S",
      implementationTask: {
        summary: "Expand thin content.",
        owner: "Content",
        effort: "S",
        acceptanceCriteria: ["The page has substantial visible content."],
      },
      affectedUrls: ["https://example.com/about"],
      evidence: ["$.pages[1].evidence.counts.visibleTextCharacters"],
      sources: ["https://developers.google.com/search/docs/fundamentals/creating-helpful-content"],
    },
  ],
  scores: {
    crawl_index: { score: 60, findings: ["indexability.noindex"], p0: 0, p1: 1, p2: 0, p3: 0 },
    structured_data: { score: 60, findings: ["structured_data.visible_content_mismatch"], p0: 0, p1: 1, p2: 0, p3: 0 },
    helpful_content: { score: 80, findings: ["content.thin_content"], p0: 0, p1: 0, p2: 1, p3: 0 },
  },
  integrations: {},
  evidenceGaps: [{ id: "ranking.integrations_missing", message: "Measured rankings require Search Console, SERP, or AI answer evidence." }],
  sources: [
    { id: "robots_meta", url: "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag" },
    { id: "structured_data_intro", url: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data" },
    { id: "robots_meta_duplicate", url: "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag" },
  ],
});

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
  assert.match(markdown, /Top Priorities/);
  assert.match(markdown, /indexability\.noindex/);
  assert.match(markdown, /Lighthouse/);
  assert.match(markdown, /42\/100/);
  assert.match(markdown, /Developer Action Plan/);
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

  assert.match(markdown, /## Repository Audit Evidence/);
  assert.match(markdown, /Framework: generic-static/);
  assert.match(markdown, /Static dir: dist with pipe \\| value/);
  assert.match(markdown, /repo\.static_dir_missing/);
  assert.match(markdown, /Static directory is missing \\| invalid\./);
});

test("includes repository build evidence when present", () => {
  const markdown = generateMarkdownReport({
    schemaVersion: "1.0.0",
    toolVersion: "0.2.0",
    run: { id: "run", startedAt: "now", endedAt: "now", target: "repo", mode: "repo" },
    site: { notes: [] },
    pages: [],
    integrations: {},
    scores: {},
    findings: [],
    evidenceGaps: [],
    sources: [],
    repo: {
      path: "/repo",
      detectedFramework: "vite",
      buildCommand: "npm run build",
      build: { executed: true, exitCode: 0, durationMs: 1234 },
      staticDirRelative: "dist",
      routeList: "/repo/routes.txt",
      routeSources: [],
      sourceFindings: [],
      notes: [],
    },
  });

  assert.match(markdown, /Build command: npm run build/);
  assert.match(markdown, /Build result: exit 0 in 1234 ms/);
  assert.match(markdown, /Route list: \/repo\/routes.txt/);
});

test("includes framework manifest evidence when present", () => {
  const markdown = generateMarkdownReport({
    run: { target: "repo" },
    findings: [],
    scores: {},
    integrations: {},
    evidenceGaps: [],
    sources: [],
    repo: {
      path: "/repo",
      detectedFramework: "next",
      packageManager: "npm",
      staticDirRelative: "out",
      routeSources: [{ type: "static_html", route: "/", path: "/repo/out/index.html" }],
      frameworkManifests: [
        {
          type: "next_prerender_manifest",
          path: "/repo/.next/prerender-manifest.json",
          routes: ["/", "/about/", "/missing/"],
        },
      ],
      sourceFindings: [],
    },
  });

  assert.match(markdown, /### Framework Route Manifests/);
  assert.match(markdown, /\| next_prerender_manifest \| 3 \|/);
  assert.match(markdown, /\/repo\/\.next\/prerender-manifest\.json/);
});

test("keeps blank lines between no-finding empty states and following sections", () => {
  const markdown = generateMarkdownReport({
    run: { target: "repo", mode: "repo" },
    findings: [],
    scores: {},
    integrations: {},
    evidenceGaps: [],
    sources: [],
    repo: {
      path: "/repo",
      detectedFramework: "next",
      routeSources: [],
      frameworkManifests: [],
      sourceFindings: [],
    },
  });

  assert.doesNotMatch(markdown, /No page findings\.\n## Scores/);
  assert.doesNotMatch(markdown, /No developer actions recorded\.\n## Repository Audit Evidence/);
  assert.match(markdown, /No page findings\.\n\n## Scores/);
  assert.match(markdown, /No developer actions recorded\.\n\n## Repository Audit Evidence/);
});

test("renders polished report sections in user-facing order", () => {
  const markdown = generateMarkdownReport(polishedAuditFixture());
  const sectionOrder = [
    "## Executive Summary",
    "## Top Priorities",
    "## Findings By Dimension",
    "## Scores",
    "## Developer Action Plan",
    "## Imported Measurements",
    "## Evidence Gaps",
    "## Sources",
  ];

  let previousIndex = -1;
  for (const section of sectionOrder) {
    const index = markdown.indexOf(section);
    assert.notEqual(index, -1, `${section} should exist`);
    assert.ok(index > previousIndex, `${section} should appear after the previous section`);
    previousIndex = index;
  }

  assert.match(markdown, /Audit mode: full/);
  assert.match(markdown, /Crawl scope: full, max 10 pages, depth 2/);
  assert.match(markdown, /Evidence type: readiness-only audit/);
  assert.match(markdown, /This report evaluates SEO\/GEO readiness/);
  assert.match(markdown, /does not measure rankings, SERP positions, or AI-answer visibility unless imported evidence is present/);
});

test("summarizes top priorities and groups findings by dimension", () => {
  const markdown = generateMarkdownReport(polishedAuditFixture());

  assert.match(markdown, /Found 3 deterministic findings/);
  assert.match(markdown, /Highest severity: P1/);
  assert.match(markdown, /Affected pages: 2/);
  assert.match(markdown, /Evidence gaps: 1/);
  const topPrioritiesStart = markdown.indexOf("## Top Priorities");
  const findingsByDimensionStart = markdown.indexOf("## Findings By Dimension");
  assert.notEqual(topPrioritiesStart, -1, "## Top Priorities should exist");
  assert.notEqual(findingsByDimensionStart, -1, "## Findings By Dimension should exist");
  const topPrioritiesSection = markdown.slice(topPrioritiesStart, findingsByDimensionStart);
  const topPriorityBullets = topPrioritiesSection.split("\n").filter((line) => /^- \*\*/.test(line));
  assert.match(topPriorityBullets[0] ?? "", /^- \*\*P1\*\* `indexability\.noindex`/);
  assert.match(markdown, /Affected URLs: 1/);
  assert.match(markdown, /### Crawl Index/);
  assert.match(markdown, /### Structured Data/);
  assert.match(markdown, /### Helpful Content/);
  assert.match(markdown, /\| Severity \| Rule \| Finding \| Affected URLs \| Evidence \| Sources \|/);
});

test("caps top priorities at five findings", () => {
  const audit = polishedAuditFixture();
  for (let index = 1; index <= 6; index += 1) {
    audit.findings.push({
      ruleId: `content.low_priority_${index}`,
      severity: "P3",
      dimension: "helpful_content",
      title: `Low priority appended finding ${index}`,
      impact: `Lower-priority impact ${index}.`,
      recommendation: `Lower-priority recommendation ${index}.`,
      owner: "Content",
      effort: "S",
      affectedUrls: [`https://example.com/low-priority-${index}`],
      evidence: [`$.pages[${index}].evidence.lowPriority`],
      sources: ["https://developers.google.com/search/docs/fundamentals/creating-helpful-content"],
    });
  }

  const markdown = generateMarkdownReport(audit);
  const topPrioritiesStart = markdown.indexOf("## Top Priorities");
  const findingsByDimensionStart = markdown.indexOf("## Findings By Dimension");
  const topPrioritiesSection = markdown.slice(topPrioritiesStart, findingsByDimensionStart);
  const topPriorityBullets = topPrioritiesSection.split("\n").filter((line) => line.startsWith("- **"));

  assert.equal(topPriorityBullets.length, 5);
  assert.doesNotMatch(topPrioritiesSection, /content\.low_priority_6/);
});

test("renders developer action plan with owner, rule, URLs, and acceptance criteria", () => {
  const markdown = generateMarkdownReport(polishedAuditFixture());

  assert.match(markdown, /## Developer Action Plan/);
  assert.match(markdown, /### Engineering/);
  assert.match(markdown, /### Content/);
  assert.match(markdown, /`indexability\.noindex`/);
  assert.match(markdown, /Affected URLs: https:\/\/example\.com\//);
  assert.match(markdown, /Acceptance criteria: The noindex finding no longer appears.; The page remains canonical and crawlable\./);
});

test("deduplicates source URLs in stable order", () => {
  const markdown = generateMarkdownReport(polishedAuditFixture());
  const sourcesSection = markdown.slice(markdown.indexOf("## Sources"));
  const sourceLines = sourcesSection.split("\n").filter((line) => line.startsWith("- "));

  assert.deepEqual(sourceLines, [
    "- robots_meta: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag",
    "- structured_data_intro: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
  ]);
});

test("keeps repository source findings separate from page findings", () => {
  const audit = polishedAuditFixture();
  audit.repo = {
    path: "/repo",
    detectedFramework: "next",
    packageManager: "npm",
    buildCommand: "npm run build",
    build: { executed: true, exitCode: 0, durationMs: 1200 },
    staticDirRelative: "out",
    previewCommand: null,
    previewUrl: null,
    routeList: "/repo/routes.txt",
    routeSources: [{ type: "static_html", route: "/", path: "/repo/out/index.html" }],
    frameworkManifests: [{ type: "next_prerender_manifest", path: "/repo/.next/prerender-manifest.json", routes: ["/", "/about/"] }],
    sourceFindings: [
      {
        id: "repo.manifest_route_missing",
        severity: "P1",
        message: "Framework manifest route is missing from static output.",
        evidence: "/missing/",
        recommendation: "Regenerate static output and rerun the repository audit.",
        confidence: "high",
      },
    ],
  };

  const markdown = generateMarkdownReport(audit);
  const repoIndex = markdown.indexOf("## Repository Audit Evidence");
  const findingsIndex = markdown.indexOf("## Findings By Dimension");

  assert.ok(repoIndex > findingsIndex);
  assert.match(markdown, /### Repository Source Findings/);
  assert.match(markdown, /\| Severity \| Source Finding \| Message \| Evidence \| Recommendation \|/);
  assert.match(markdown, /repo\.manifest_route_missing/);
  assert.doesNotMatch(markdown.slice(findingsIndex, repoIndex), /repo\.manifest_route_missing/);
  assert.match(markdown, /Build command: npm run build/);
  assert.match(markdown, /Build result: exit 0 in 1200 ms/);
  assert.match(markdown, /Framework manifests: 1/);
});

test("separates imported measurements from deterministic readiness findings", () => {
  const audit = polishedAuditFixture();
  audit.integrations = {
    searchConsole: { type: "search_console_csv", rows: [{ query: "seo audit", page: "https://example.com/", clicks: 5, impressions: 100, ctr: 5, position: 7.2 }] },
    serp: { type: "serp_export", rows: [{ query: "seo audit", position: 3, url: "https://example.com/" }] },
    aiAnswers: { type: "ai_answer_export", rows: [{ query: "best seo audit", citedUrls: ["https://example.com/"] }] },
    lighthouse: { performanceScore: 42, metrics: { lcpMs: 4100, cls: 0.22, tbtMs: 500 }, formFactor: "mobile" },
  };

  const markdown = generateMarkdownReport(audit);

  assert.match(markdown, /Evidence type: includes measured visibility imports; includes imported performance evidence/);
  assert.match(markdown, /## Imported Measurements/);
  assert.match(markdown, /Search Console: 1 row/);
  assert.match(markdown, /SERP export: 1 row/);
  assert.match(markdown, /AI-answer export: 1 row/);
  assert.match(markdown, /Lighthouse: 42\/100 performance score \(mobile\); LCP 4100 ms; CLS 0\.22; TBT 500 ms\./);
  assert.match(markdown, /Measured visibility imports are present and are reported separately from readiness findings\./);
});

test("makes partial imported measurement evidence explicit", () => {
  const audit = polishedAuditFixture();
  audit.integrations = {
    lighthouse: { performanceScore: 80, metrics: {}, formFactor: "desktop" },
  };

  const markdown = generateMarkdownReport(audit);

  assert.match(markdown, /Evidence type: includes imported performance evidence/);
  assert.doesNotMatch(markdown, /Evidence type:.*includes measured visibility imports/);
  assert.match(markdown, /Search Console: not supplied\./);
  assert.match(markdown, /SERP export: not supplied\./);
  assert.match(markdown, /AI-answer export: not supplied\./);
  assert.match(markdown, /Lighthouse: 80\/100 performance score \(desktop\); LCP n\/a; CLS n\/a; TBT n\/a\./);
});

test("explains evidence gaps without turning them into findings", () => {
  const markdown = generateMarkdownReport(polishedAuditFixture());

  assert.match(markdown, /## Evidence Gaps/);
  assert.match(markdown, /ranking\.integrations_missing: Measured rankings require Search Console, SERP, or AI answer evidence\./);
  assert.match(markdown, /How to close common gaps:/);
  assert.match(markdown, /Add `--search-console`, `--serp`, or `--ai-answers` to report observed visibility\./);
  assert.doesNotMatch(markdown, /\| P\d \| ranking\.integrations_missing/);
});
