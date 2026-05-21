# Reporting And Skill Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the CLI Markdown report and skill report template so existing deterministic audit evidence is easier to read, act on, and hand off.

**Architecture:** Keep `generateMarkdownReport(audit)` as the public API and refactor `packages/cli/src/report.mjs` into small deterministic helpers. Presentation changes must be generated only from audit JSON, keep repository source findings separate from page/site findings, and preserve readiness-versus-measured-visibility language.

**Tech Stack:** Node.js ESM, `node:test`, Markdown string rendering, existing CLI report and golden fixture harness.

---

## Source Spec

Approved design: `docs/superpowers/specs/2026-05-20-reporting-and-skill-polish-design.md`

## File Structure

- Modify `packages/cli/src/report.mjs`: refactor report rendering into helper functions and implement the polished section structure.
- Modify `packages/cli/test/report.test.mjs`: add targeted tests for report structure, readiness language, source deduplication, task content, repo separation, and imported evidence.
- Modify `packages/cli/test/golden-fixtures.test.mjs`: add repo Markdown golden coverage.
- Create `examples/golden/repo-framework-report.md`: normalized Markdown report for an existing framework repo fixture.
- Modify `examples/golden/known-issues-report.md`: update the known-issues Markdown golden to the polished report structure.
- Modify `skill/geo-seo-audit/templates/audit-report.md`: align the skill-facing report template with the CLI report order.
- Modify `README.md`: document the polished report sections without claiming new audit capability.
- Modify `docs/prd-deterministic-audit-cli.md`: align report behavior with Phase E.
- Modify `skill/geo-seo-audit/SKILL.md`: reinforce report usage and evidence boundaries.
- Modify `CHANGELOG.md`: record report polish in Unreleased.
- Modify `scripts/validate-skill.mjs`: require the new repo report golden.

## Task 1: Add Report Structure Tests

**Files:**
- Modify: `packages/cli/test/report.test.mjs`

- [ ] **Step 1: Add a reusable polished audit fixture**

In `packages/cli/test/report.test.mjs`, after the imports and before the first test, add:

```js
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
```

- [ ] **Step 2: Add report section order and readiness-language test**

Append this test after `generates a Markdown audit report from audit JSON`:

```js
test("renders polished report sections in user-facing order", () => {
  const markdown = generateMarkdownReport(polishedAuditFixture());
  const sectionOrder = [
    "## Executive Summary",
    "## Top Priorities",
    "## Findings By Dimension",
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
```

- [ ] **Step 3: Add top-priority and dimension grouping test**

Append:

```js
test("summarizes top priorities and groups findings by dimension", () => {
  const markdown = generateMarkdownReport(polishedAuditFixture());

  assert.match(markdown, /Found 3 deterministic findings/);
  assert.match(markdown, /Highest severity: P1/);
  assert.match(markdown, /Affected pages: 2/);
  assert.match(markdown, /Evidence gaps: 1/);
  assert.match(markdown, /- \*\*P1\*\* `indexability\.noindex`/);
  assert.match(markdown, /Affected URLs: 1/);
  assert.match(markdown, /### Crawl Index/);
  assert.match(markdown, /### Structured Data/);
  assert.match(markdown, /### Helpful Content/);
  assert.match(markdown, /\| Severity \| Rule \| Finding \| Affected URLs \| Evidence \| Sources \|/);
});
```

- [ ] **Step 4: Add developer action plan test**

Append:

```js
test("renders developer action plan with owner, rule, URLs, and acceptance criteria", () => {
  const markdown = generateMarkdownReport(polishedAuditFixture());

  assert.match(markdown, /## Developer Action Plan/);
  assert.match(markdown, /### Engineering/);
  assert.match(markdown, /### Content/);
  assert.match(markdown, /`indexability\.noindex`/);
  assert.match(markdown, /Affected URLs: https:\/\/example\.com\//);
  assert.match(markdown, /Acceptance criteria: The noindex finding no longer appears.; The page remains canonical and crawlable\./);
});
```

- [ ] **Step 5: Add source deduplication test**

Append:

```js
test("deduplicates source URLs in stable order", () => {
  const markdown = generateMarkdownReport(polishedAuditFixture());
  const sourcesSection = markdown.slice(markdown.indexOf("## Sources"));
  const sourceMatches = [...sourcesSection.matchAll(/https:\/\/developers\.google\.com\/search\/docs\/crawling-indexing\/robots-meta-tag/g)];

  assert.equal(sourceMatches.length, 1);
  assert.match(markdown, /- robots_meta: https:\/\/developers\.google\.com\/search\/docs\/crawling-indexing\/robots-meta-tag/);
  assert.match(markdown, /- structured_data_intro: https:\/\/developers\.google\.com\/search\/docs\/appearance\/structured-data\/intro-structured-data/);
});
```

- [ ] **Step 6: Run report tests to verify failure**

Run:

```bash
node --test packages/cli/test/report.test.mjs
```

Expected: FAIL because the current report still uses `## Priority Findings`, `## Implementation Tasks`, and table-first rendering instead of the polished section order.

## Task 2: Implement Core Polished Report Rendering

**Files:**
- Modify: `packages/cli/src/report.mjs`
- Modify: `packages/cli/test/report.test.mjs`

- [ ] **Step 1: Replace report helper prelude**

In `packages/cli/src/report.mjs`, replace the helper declarations above `appendRepositoryEvidence` with:

```js
const priorityRank = { P0: 0, P1: 1, P2: 2, P3: 3 };
const priorityLabels = ["P0", "P1", "P2", "P3"];
const maxTopPriorities = 5;

const escapeCell = (value) => String(value ?? "").replace(/\|/g, "\\|").replace(/\n+/g, " ");
const normalizeInline = (value) => escapeCell(value).replace(/\s+/g, " ").trim();
const formatMetric = (value, suffix = "") => (Number.isFinite(value) ? `${value}${suffix}` : "n/a");
const formatRepoValue = (value) => (value === null || value === undefined || value === "" ? "n/a" : String(value));
const formatBulletValue = (value) => normalizeInline(formatRepoValue(value));
const titleCaseDimension = (dimension) =>
  String(dimension || "uncategorized")
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
const severityValue = (severity) => priorityRank[severity] ?? 99;

const sortFindings = (findings = []) =>
  [...findings].sort((a, b) =>
    severityValue(a.severity) - severityValue(b.severity) ||
    String(a.ruleId || "").localeCompare(String(b.ruleId || "")) ||
    String(a.title || "").localeCompare(String(b.title || "")) ||
    String(a.affectedUrls?.[0] || "").localeCompare(String(b.affectedUrls?.[0] || "")),
  );

const unique = (values = []) => [...new Set(values.filter(Boolean))];
const affectedUrls = (findings = []) => unique(findings.flatMap((finding) => finding.affectedUrls || []));
const highestSeverity = (findings = []) => priorityLabels.find((severity) => findings.some((finding) => finding.severity === severity)) || "none";
const affectedUrlSummary = (urls = []) => {
  if (!urls.length) return "n/a";
  if (urls.length <= 3) return urls.map(normalizeInline).join(", ");
  return `${urls.slice(0, 3).map(normalizeInline).join(", ")} (+${urls.length - 3} more)`;
};
const evidenceSummary = (evidence = []) => evidence.length ? evidence.map(normalizeInline).join("; ") : "n/a";
const sourceSummary = (sources = []) => unique(sources).map(normalizeInline).join("; ") || "n/a";
```

- [ ] **Step 2: Add context and measurement helpers**

Add below the prelude:

```js
const hasMeasuredVisibility = (integrations = {}) =>
  Boolean(integrations.searchConsole?.rows?.length || integrations.serp?.rows?.length || integrations.aiAnswers?.rows?.length);

const hasImportedPerformance = (integrations = {}) => Boolean(integrations.lighthouse);

const evidenceTypeFor = (audit) => {
  const parts = [];
  if (audit.repo) parts.push("source-repository audit");
  if (hasMeasuredVisibility(audit.integrations)) parts.push("includes measured visibility imports");
  if (hasImportedPerformance(audit.integrations)) parts.push("includes imported performance evidence");
  if (!parts.length) parts.push("readiness-only audit");
  return parts.join("; ");
};

const crawlScopeFor = (run = {}) => {
  const crawl = run.crawl || {};
  if (!crawl.mode && crawl.maxPages === undefined && crawl.maxDepth === undefined) return "n/a";
  const mode = crawl.mode || "n/a";
  const pages = crawl.maxPages === undefined ? "n/a" : crawl.maxPages;
  const depth = crawl.maxDepth === undefined ? "n/a" : crawl.maxDepth;
  return `${mode}, max ${pages} pages, depth ${depth}`;
};

const appendHeader = (lines, audit) => {
  lines.push(
    "# GEO/SEO Audit Report",
    "",
    `Target: ${audit.run?.target || "unknown"}`,
    `Generated: ${audit.run?.endedAt || new Date().toISOString()}`,
    `Audit mode: ${audit.run?.mode || "n/a"}`,
    `Crawl scope: ${crawlScopeFor(audit.run)}`,
    `Evidence type: ${evidenceTypeFor(audit)}`,
  );
};

const appendExecutiveSummary = (lines, audit, findings) => {
  const pageCount = (audit.pages || []).length;
  const sourceFindingCount = audit.repo?.sourceFindings?.length || 0;
  const evidenceGapCount = audit.evidenceGaps?.length || 0;
  const scoredDimensions = Object.keys(audit.scores || {}).length;
  const affectedPageCount = affectedUrls(findings).length;

  lines.push(
    "",
    "## Executive Summary",
    "",
    findings.length
      ? `Found ${findings.length} deterministic finding${findings.length === 1 ? "" : "s"} across ${scoredDimensions} scored dimension${scoredDimensions === 1 ? "" : "s"}.`
      : "No deterministic findings were detected in the collected evidence.",
    `Highest severity: ${highestSeverity(findings)}`,
    `Audited pages: ${pageCount}`,
    `Affected pages: ${affectedPageCount}`,
    `Repository source findings: ${sourceFindingCount}`,
    `Evidence gaps: ${evidenceGapCount}`,
    hasMeasuredVisibility(audit.integrations)
      ? "Measured visibility imports are present and are reported separately from readiness findings."
      : "This report evaluates SEO/GEO readiness. It does not measure rankings, SERP positions, or AI-answer visibility unless imported evidence is present.",
  );
};
```

- [ ] **Step 3: Add top-priority and dimension renderers**

Add:

```js
const appendTopPriorities = (lines, findings) => {
  lines.push("", "## Top Priorities", "");
  const priorities = findings.slice(0, maxTopPriorities);
  if (!priorities.length) {
    lines.push("No priority findings.");
    return;
  }

  for (const finding of priorities) {
    const urls = finding.affectedUrls || [];
    lines.push(
      `- **${normalizeInline(finding.severity)}** \`${normalizeInline(finding.ruleId)}\` - ${normalizeInline(finding.title)}`,
      `  - Affected URLs: ${urls.length}`,
      `  - Impact: ${normalizeInline(finding.impact)}`,
      `  - Next action: ${normalizeInline(finding.recommendation)}`,
    );
  }
};

const appendFindingsByDimension = (lines, findings) => {
  lines.push("", "## Findings By Dimension", "");
  if (!findings.length) {
    lines.push("No deterministic findings.");
    return;
  }

  const groups = new Map();
  for (const finding of findings) {
    const key = finding.dimension || "uncategorized";
    groups.set(key, [...(groups.get(key) || []), finding]);
  }

  for (const [dimension, group] of [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    lines.push("", `### ${titleCaseDimension(dimension)}`, "");
    lines.push("| Severity | Rule | Finding | Affected URLs | Evidence | Sources |");
    lines.push("|---|---|---|---|---|---|");
    for (const finding of sortFindings(group)) {
      lines.push(
        `| ${normalizeInline(finding.severity)} | ${normalizeInline(finding.ruleId)} | ${normalizeInline(finding.title)} | ${affectedUrlSummary(finding.affectedUrls || [])} | ${evidenceSummary(finding.evidence || [])} | ${sourceSummary(finding.sources || [])} |`,
      );
    }
  }
};
```

- [ ] **Step 4: Add developer action plan renderer**

Add:

```js
const appendDeveloperActionPlan = (lines, findings) => {
  lines.push("", "## Developer Action Plan", "");
  const taskFindings = findings.filter((finding) => finding.implementationTask);
  if (!taskFindings.length) {
    lines.push("No implementation tasks recorded.");
    return;
  }

  const byOwner = new Map();
  for (const finding of taskFindings) {
    const task = finding.implementationTask;
    const owner = task.owner || finding.owner || "Unassigned";
    byOwner.set(owner, [...(byOwner.get(owner) || []), finding]);
  }

  for (const [owner, ownerFindings] of [...byOwner.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`### ${normalizeInline(owner)}`, "");
    for (const finding of sortFindings(ownerFindings)) {
      const task = finding.implementationTask;
      lines.push(
        `- **${normalizeInline(finding.severity)}** \`${normalizeInline(finding.ruleId)}\` (${normalizeInline(task.effort || finding.effort || "n/a")})`,
        `  - Task: ${normalizeInline(task.summary || finding.recommendation)}`,
        `  - Affected URLs: ${affectedUrlSummary(finding.affectedUrls || [])}`,
        `  - Acceptance criteria: ${normalizeInline((task.acceptanceCriteria || []).join("; ") || "n/a")}`,
      );
    }
    lines.push("");
  }
};
```

- [ ] **Step 5: Replace generateMarkdownReport body**

Replace `generateMarkdownReport` with:

```js
export const generateMarkdownReport = (audit) => {
  const findings = sortFindings(audit.findings || []);
  const lines = [];

  appendHeader(lines, audit);
  appendExecutiveSummary(lines, audit, findings);
  appendTopPriorities(lines, findings);
  appendFindingsByDimension(lines, findings);

  lines.push("", "## Scores", "");
  const scoreEntries = Object.entries(audit.scores || {});
  if (scoreEntries.length) {
    lines.push("| Dimension | Score | Findings |");
    lines.push("|---|---:|---|");
    for (const [dimension, score] of scoreEntries.sort(([a], [b]) => a.localeCompare(b))) {
      lines.push(`| ${normalizeInline(dimension)} | ${score.score} | ${normalizeInline((score.findings || []).join(", "))} |`);
    }
  } else {
    lines.push("No scored findings.");
  }

  appendDeveloperActionPlan(lines, findings);
  appendRepositoryEvidence(lines, audit.repo);
  appendImportedMeasurements(lines, audit.integrations || {});
  appendEvidenceGaps(lines, audit.evidenceGaps || []);
  appendSources(lines, audit.sources || []);

  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
};
```

- [ ] **Step 6: Temporarily keep existing imported/gap/source functions unresolved**

Do not run the full suite yet. `appendImportedMeasurements`, `appendEvidenceGaps`, and `appendSources` are intentionally added in Task 4. Run the targeted report test to verify the current failure mode:

```bash
node --test packages/cli/test/report.test.mjs
```

Expected: FAIL with `ReferenceError: appendImportedMeasurements is not defined`.

## Task 3: Improve Repository Evidence And Source Findings

**Files:**
- Modify: `packages/cli/src/report.mjs`
- Modify: `packages/cli/test/report.test.mjs`

- [ ] **Step 1: Add source-finding separation test**

In `packages/cli/test/report.test.mjs`, append:

```js
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
```

- [ ] **Step 2: Replace appendRepositoryEvidence**

In `packages/cli/src/report.mjs`, replace the existing `appendRepositoryEvidence` function with:

```js
const appendRepositoryEvidence = (lines, repo) => {
  if (!repo) return;

  lines.push("", "## Repository Audit Evidence", "");
  lines.push(`- Path: ${formatBulletValue(repo.path)}`);
  lines.push(`- Framework: ${formatBulletValue(repo.detectedFramework)}`);
  lines.push(`- Package manager: ${formatBulletValue(repo.packageManager)}`);
  lines.push(`- Static dir: ${formatBulletValue(repo.staticDirRelative || repo.staticDir)}`);
  lines.push(`- Preview command: ${formatBulletValue(repo.previewCommand)}`);
  lines.push(`- Preview URL: ${formatBulletValue(repo.previewUrl)}`);
  if (repo.buildCommand) lines.push(`- Build command: ${formatBulletValue(repo.buildCommand)}`);
  if (repo.build) {
    const exit = repo.build.exitCode === undefined || repo.build.exitCode === null ? "n/a" : repo.build.exitCode;
    const duration = repo.build.durationMs === undefined ? "n/a" : `${repo.build.durationMs} ms`;
    lines.push(`- Build executed: ${repo.build.executed ? "yes" : "no"}`);
    lines.push(`- Build result: exit ${formatBulletValue(exit)} in ${formatBulletValue(duration)}`);
  }
  if (repo.routeList) lines.push(`- Route list: ${formatBulletValue(repo.routeList)}`);
  lines.push(`- Route sources: ${repo.routeSources?.length || 0}`);
  lines.push(`- Framework manifests: ${repo.frameworkManifests?.length || 0}`);
  lines.push(`- Repository source findings: ${repo.sourceFindings?.length || 0}`);

  lines.push("", "### Repository Routes", "");
  if (repo.routeSources?.length) {
    lines.push("| Type | Route | Source |");
    lines.push("|---|---|---|");
    for (const route of repo.routeSources.slice(0, 20)) {
      lines.push(`| ${formatBulletValue(route.type)} | ${formatBulletValue(route.route || route.path)} | ${formatBulletValue(route.path)} |`);
    }
    if (repo.routeSources.length > 20) lines.push(`| n/a | ${repo.routeSources.length - 20} additional routes omitted from report | n/a |`);
  } else {
    lines.push("No repository routes recorded.");
  }

  lines.push("", "### Framework Route Manifests", "");
  if (repo.frameworkManifests?.length) {
    lines.push("| Type | Routes | Path |");
    lines.push("|---|---:|---|");
    for (const manifest of repo.frameworkManifests) {
      lines.push(`| ${formatBulletValue(manifest.type)} | ${(manifest.routes || []).length} | ${formatBulletValue(manifest.path)} |`);
    }
  } else {
    lines.push("No framework route manifests recorded.");
  }

  lines.push("", "### Repository Source Findings", "");
  if (repo.sourceFindings?.length) {
    lines.push("| Severity | Source Finding | Message | Evidence | Recommendation |");
    lines.push("|---|---|---|---|---|");
    for (const finding of repo.sourceFindings) {
      lines.push(
        `| ${formatBulletValue(finding.severity)} | ${formatBulletValue(finding.id)} | ${formatBulletValue(finding.message)} | ${formatBulletValue(finding.evidence)} | ${formatBulletValue(finding.recommendation)} |`,
      );
    }
  } else {
    lines.push("No repository source findings recorded.");
  }
};
```

- [ ] **Step 3: Run report tests to verify remaining helper failures**

Run:

```bash
node --test packages/cli/test/report.test.mjs
```

Expected: FAIL with unresolved imported measurement, evidence gap, or source helper references from Task 2.

## Task 4: Improve Imported Measurements, Evidence Gaps, And Sources

**Files:**
- Modify: `packages/cli/src/report.mjs`
- Modify: `packages/cli/test/report.test.mjs`

- [ ] **Step 1: Add imported measurements test**

In `packages/cli/test/report.test.mjs`, append:

```js
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
```

- [ ] **Step 2: Add evidence gap guidance test**

Append:

```js
test("explains evidence gaps without turning them into findings", () => {
  const markdown = generateMarkdownReport(polishedAuditFixture());

  assert.match(markdown, /## Evidence Gaps/);
  assert.match(markdown, /ranking\.integrations_missing: Measured rankings require Search Console, SERP, or AI answer evidence\./);
  assert.match(markdown, /How to close common gaps:/);
  assert.match(markdown, /Add `--search-console`, `--serp`, or `--ai-answers` to report observed visibility\./);
  assert.doesNotMatch(markdown, /\| P\d \| ranking\.integrations_missing/);
});
```

- [ ] **Step 3: Add helper implementations**

In `packages/cli/src/report.mjs`, add these functions above `generateMarkdownReport`:

```js
const rowCount = (integration) => integration?.rows?.length || 0;

const appendImportedMeasurements = (lines, integrations = {}) => {
  lines.push("", "## Imported Measurements", "");
  let wrote = false;

  if (integrations.searchConsole) {
    lines.push(`- Search Console: ${rowCount(integrations.searchConsole)} row${rowCount(integrations.searchConsole) === 1 ? "" : "s"} of observed query/page performance.`);
    wrote = true;
  }
  if (integrations.serp) {
    lines.push(`- SERP export: ${rowCount(integrations.serp)} row${rowCount(integrations.serp) === 1 ? "" : "s"} of observed search-result evidence.`);
    wrote = true;
  }
  if (integrations.aiAnswers) {
    lines.push(`- AI-answer export: ${rowCount(integrations.aiAnswers)} row${rowCount(integrations.aiAnswers) === 1 ? "" : "s"} of supplied AI-answer evidence.`);
    wrote = true;
  }
  if (integrations.lighthouse) {
    const lighthouse = integrations.lighthouse;
    const metrics = lighthouse.metrics || {};
    lines.push(
      `- Lighthouse: ${formatMetric(lighthouse.performanceScore, "/100")} performance score${lighthouse.formFactor ? ` (${normalizeInline(lighthouse.formFactor)})` : ""}; LCP ${formatMetric(metrics.lcpMs, " ms")}; CLS ${formatMetric(metrics.cls)}; TBT ${formatMetric(metrics.tbtMs, " ms")}.`,
    );
    wrote = true;
  }

  if (!wrote) {
    lines.push("No imported measurements. Ranking, SERP, AI-answer, and Lighthouse measurements are reported only when supplied as evidence imports.");
  }
};

const appendEvidenceGaps = (lines, evidenceGaps = []) => {
  lines.push("", "## Evidence Gaps", "");
  if (evidenceGaps.length) {
    for (const gap of evidenceGaps) lines.push(`- ${normalizeInline(gap.id)}: ${normalizeInline(gap.message)}`);
  } else {
    lines.push("No evidence gaps recorded.");
  }

  lines.push("", "How to close common gaps:");
  lines.push("- Add `--search-console`, `--serp`, or `--ai-answers` to report observed visibility.");
  lines.push("- Add `--lighthouse` to include imported performance measurements.");
  lines.push("- Increase crawl scope with `--mode full`, `--max-pages`, a sitemap, or a URL list when coverage is too narrow.");
  lines.push("- Use explicit rendering only for trusted targets when raw/rendered parity evidence is needed.");
};

const appendSources = (lines, sources = []) => {
  lines.push("", "## Sources", "");
  const seen = new Set();
  const uniqueSources = [];
  for (const source of sources) {
    if (!source?.url || seen.has(source.url)) continue;
    seen.add(source.url);
    uniqueSources.push(source);
  }

  if (uniqueSources.length) {
    for (const source of uniqueSources) lines.push(`- ${normalizeInline(source.id)}: ${normalizeInline(source.url)}`);
  } else {
    lines.push("No sources recorded.");
  }
};
```

- [ ] **Step 4: Run report tests**

Run:

```bash
node --test packages/cli/test/report.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit report code and targeted tests**

Run:

```bash
git add packages/cli/src/report.mjs packages/cli/test/report.test.mjs
git commit -m "feat: polish markdown audit report"
```

## Task 5: Add Repo Markdown Golden Coverage

**Files:**
- Modify: `packages/cli/test/golden-fixtures.test.mjs`
- Create: `examples/golden/repo-framework-report.md`
- Modify: `scripts/validate-skill.mjs`

- [ ] **Step 1: Add repo Markdown golden test**

In `packages/cli/test/golden-fixtures.test.mjs`, inside `framework repo audit golden summary matches fixtures`, after the `assert.deepEqual(...)` block and before the `finally`, add:

```js
    const nextMarkdown = normalizeMarkdownForGolden(generateMarkdownReport(nextAudit), nextFixture.repoPath);
    const expectedNextMarkdown = fs.readFileSync("examples/golden/repo-framework-report.md", "utf8");
    assert.equal(nextMarkdown, expectedNextMarkdown);
```

- [ ] **Step 2: Run golden fixture test to verify failure**

Run:

```bash
node --test packages/cli/test/golden-fixtures.test.mjs
```

Expected: FAIL because `examples/golden/repo-framework-report.md` does not exist.

- [ ] **Step 3: Generate the initial repo Markdown golden**

Run this command to create the expected report from the current implementation:

```bash
node --input-type=module <<'EOF'
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { runRepoAudit } from "./packages/cli/src/repo-audit.mjs";
import { generateMarkdownReport } from "./packages/cli/src/report.mjs";
import { normalizeMarkdownForGolden } from "./packages/cli/test/helpers/golden.mjs";

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-next-report-"));
const repoPath = path.join(tempRoot, "next-basic");
fs.cpSync(path.resolve("examples/fixture-repos/next-basic"), repoPath, { recursive: true });
try {
  const audit = await runRepoAudit({
    repoPath,
    buildCommand: "npm run build",
    staticDir: "out",
    maxBuildMs: 5000,
  });
  const markdown = normalizeMarkdownForGolden(generateMarkdownReport(audit), repoPath);
  fs.writeFileSync("examples/golden/repo-framework-report.md", markdown);
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
EOF
```

- [ ] **Step 4: Add validation required file**

In `scripts/validate-skill.mjs`, add this entry near other `examples/golden` files:

```js
  "examples/golden/repo-framework-report.md",
```

- [ ] **Step 5: Run golden fixture test**

Run:

```bash
node --test packages/cli/test/golden-fixtures.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit repo golden coverage**

Run:

```bash
git add packages/cli/test/golden-fixtures.test.mjs examples/golden/repo-framework-report.md scripts/validate-skill.mjs
git commit -m "test: cover repo markdown report"
```

## Task 6: Update Known-Issues Golden Markdown

**Files:**
- Modify: `examples/golden/known-issues-report.md`

- [ ] **Step 1: Run known-issues golden test to inspect failure**

Run:

```bash
node --test packages/cli/test/golden-fixtures.test.mjs
```

Expected: FAIL with a diff for `known-issues-report.md` because the report structure changed.

- [ ] **Step 2: Regenerate known-issues Markdown golden**

Run:

```bash
node --input-type=module <<'EOF'
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { runAudit } from "./packages/cli/src/audit.mjs";
import { generateMarkdownReport } from "./packages/cli/src/report.mjs";
import { normalizeMarkdownForGolden } from "./packages/cli/test/helpers/golden.mjs";

const rootDir = path.resolve("examples/fixture-sites/known-issues");
const contentTypeFor = (filePath) => {
  if (filePath.endsWith(".xml")) return "application/xml";
  if (filePath.endsWith(".txt")) return "text/plain";
  return "text/html";
};

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, "http://127.0.0.1").pathname;
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
  const filePath = path.join(rootDir, relativePath);

  if (!filePath.startsWith(rootDir) || !fs.existsSync(filePath)) {
    response.statusCode = 404;
    response.setHeader("content-type", "text/html");
    response.end("<title>Missing</title><h1>Missing</h1>");
    return;
  }

  response.setHeader("content-type", contentTypeFor(filePath));
  const body = fs.readFileSync(filePath, "utf8");
  const origin = `http://${request.headers.host}`;
  response.end(filePath.endsWith("sitemap.xml") ? body.replaceAll("http://fixture.test", origin) : body);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const origin = `http://127.0.0.1:${port}`;
try {
  const audit = await runAudit({
    target: `${origin}/`,
    sitemap: `${origin}/sitemap.xml`,
    respectRobots: true,
    crawl: { mode: "full", maxPages: 12, maxDepth: 1 },
  });
  const markdown = normalizeMarkdownForGolden(generateMarkdownReport(audit), origin);
  fs.writeFileSync("examples/golden/known-issues-report.md", markdown);
} finally {
  await new Promise((resolve) => server.close(resolve));
}
EOF
```

- [ ] **Step 3: Run golden fixture test**

Run:

```bash
node --test packages/cli/test/golden-fixtures.test.mjs
```

Expected: PASS.

- [ ] **Step 4: Commit known-issues golden update**

Run:

```bash
git add examples/golden/known-issues-report.md
git commit -m "test: update polished report golden"
```

## Task 7: Update Skill Template And Docs

**Files:**
- Modify: `skill/geo-seo-audit/templates/audit-report.md`
- Modify: `skill/geo-seo-audit/SKILL.md`
- Modify: `README.md`
- Modify: `docs/prd-deterministic-audit-cli.md`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Replace skill audit report template**

Replace `skill/geo-seo-audit/templates/audit-report.md` with:

```md
# GEO/SEO Audit Report

Target: {{target}}
Date: {{date}}
Auditor: {{auditor}}
Audit mode: {{audit_mode}}
Evidence type: {{evidence_type}}

## Executive Summary

{{summary}}

State whether this audit is readiness-only or includes measured visibility evidence. Do not claim rankings, SERP positions, or AI-answer visibility unless the CLI output includes supplied Search Console, SERP, or AI-answer evidence.

## Top Priorities

- **{{priority}}** `{{rule_id}}` - {{finding}}
  - Affected URLs: {{affected_url_count}}
  - Impact: {{impact}}
  - Next action: {{recommendation}}

## Findings By Dimension

### {{dimension}}

| Severity | Rule | Finding | Affected URLs | Evidence | Sources |
|---|---|---|---|---|---|
| {{severity}} | {{rule_id}} | {{finding}} | {{affected_urls}} | {{evidence_paths}} | {{source_urls}} |

## Developer Action Plan

### {{owner}}

- **{{priority}}** `{{rule_id}}` ({{effort}})
  - Task: {{task}}
  - Affected URLs: {{affected_urls}}
  - Acceptance criteria: {{acceptance_criteria}}

## Repository Audit Evidence

{{repository_evidence}}

### Repository Source Findings

{{repository_source_findings}}

## Imported Measurements

{{imported_measurements}}

## Evidence Gaps

{{evidence_gaps}}

## Sources

- {{source_id}}: {{source_url}}
```

- [ ] **Step 2: Update SKILL report instruction wording**

In `skill/geo-seo-audit/SKILL.md`, replace:

```md
5. Produce a prioritized audit using templates/audit-report.md.
```

with:

```md
5. Produce a prioritized audit using templates/audit-report.md. Mirror the CLI Markdown report structure: executive summary, top priorities, findings by dimension, developer action plan, repository evidence, imported measurements, evidence gaps, and sources.
```

- [ ] **Step 3: Update README report description**

In `README.md`, after the paragraph beginning `The current audit command collects`, add:

```md
Markdown reports are structured for both developer handoff and client-readable review: executive summary, top priorities, findings by dimension, developer action plan, repository audit evidence, imported measurements, evidence gaps, and sources. Repository source findings stay separate from rendered page/site findings.
```

- [ ] **Step 4: Update PRD current baseline**

In `docs/prd-deterministic-audit-cli.md`, in the Current baseline paragraph under section 1, append:

```md
Markdown reports are now organized around executive summary, top priorities, findings by dimension, developer action plan, repository evidence, imported measurements, evidence gaps, and sources.
```

- [ ] **Step 5: Add changelog entry**

In `CHANGELOG.md`, under `## Unreleased - 2026-05-18`, add:

```md
- Polished CLI Markdown reports and the skill report template so audit output separates priorities, dimensions, developer tasks, repository evidence, imported measurements, evidence gaps, and sources.
```

- [ ] **Step 6: Run documentation grep**

Run:

```bash
rg -n "Top Priorities|Findings By Dimension|Developer Action Plan|Repository Audit Evidence|Imported Measurements|readiness" README.md docs/prd-deterministic-audit-cli.md skill/geo-seo-audit/SKILL.md skill/geo-seo-audit/templates/audit-report.md CHANGELOG.md
```

Expected: output includes the new template headings and documentation wording.

- [ ] **Step 7: Commit docs and template updates**

Run:

```bash
git add skill/geo-seo-audit/templates/audit-report.md skill/geo-seo-audit/SKILL.md README.md docs/prd-deterministic-audit-cli.md CHANGELOG.md
git commit -m "docs: align report polish guidance"
```

## Task 8: Final Verification And Review

**Files:**
- Read-only verification across the repository.

- [ ] **Step 1: Run focused report tests**

Run:

```bash
node --test packages/cli/test/report.test.mjs packages/cli/test/golden-fixtures.test.mjs
```

Expected: PASS.

- [ ] **Step 2: Run full test suite**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 3: Run validation**

Run:

```bash
npm run validate
```

Expected: PASS with `"ok": true`.

- [ ] **Step 4: Run diff check**

Run:

```bash
git diff --check
```

Expected: no output.

- [ ] **Step 5: Inspect report output headings**

Run:

```bash
rg -n "## Executive Summary|## Top Priorities|## Findings By Dimension|## Developer Action Plan|## Repository Audit Evidence|## Imported Measurements|## Evidence Gaps|## Sources" examples/golden/known-issues-report.md examples/golden/repo-framework-report.md
```

Expected: both golden Markdown files contain the relevant report headings. `repo-framework-report.md` includes `## Repository Audit Evidence`.

- [ ] **Step 6: Inspect git status**

Run:

```bash
git status --short --branch
```

Expected: clean branch with committed work.

- [ ] **Step 7: Request final code review**

Use `superpowers:requesting-code-review` or a final review subagent if executing with `superpowers:subagent-driven-development`.

Review checklist:

- report changes are presentation-only
- no rule/crawl/repo/scoring behavior changed
- readiness-versus-measured-visibility language is explicit
- repo source findings remain separate from page/site findings
- golden changes are intentional
- full verification passed

## Completion Checklist

- [ ] `generateMarkdownReport(audit)` remains the public report API.
- [ ] CLI Markdown reports use the approved section order.
- [ ] Executive summary includes readiness-versus-measured-visibility language.
- [ ] Top priorities appear before detailed findings.
- [ ] Findings are grouped by dimension.
- [ ] Developer action plan includes owner, effort, rule ID, affected URLs, and acceptance criteria.
- [ ] Repository source findings are visually separate from page/site findings.
- [ ] Imported measurements are separate from deterministic readiness findings.
- [ ] Evidence gaps include next-evidence guidance.
- [ ] Sources are deduplicated and stable.
- [ ] Skill audit template mirrors CLI report structure.
- [ ] README, PRD, `SKILL.md`, and changelog language are aligned.
- [ ] `npm test`, `npm run validate`, and `git diff --check` pass.
