const priorityRank = { P0: 0, P1: 1, P2: 2, P3: 3 };

const normalizeInline = (value, fallback = "n/a") => {
  if (value === null || value === undefined || value === "") return fallback;
  const normalized = String(value).replace(/\s+/g, " ").trim();
  return normalized || fallback;
};

const escapeInline = (value, fallback = "n/a") => normalizeInline(value, fallback).replace(/\|/g, "\\|");

const escapeCell = (value, fallback = "n/a") => escapeInline(value, fallback);

const plural = (count, singular, pluralValue = `${singular}s`) => `${count} ${count === 1 ? singular : pluralValue}`;

const rowCount = (integration) => (Array.isArray(integration?.rows) ? integration.rows.length : 0);

const valuePresent = (value) => value !== null && value !== undefined && value !== "";

const sourceUrl = (source) => (typeof source === "string" ? source : source?.url);

const sourceId = (source) => (typeof source === "string" ? source : source?.id);

const dedupeBy = (items, keyFn) => {
  const seen = new Set();
  const deduped = [];

  for (const item of items || []) {
    const key = keyFn(item);
    if (!valuePresent(key) || seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  return deduped;
};

const dedupeSources = (sources = []) => dedupeBy(sources, sourceUrl);

const formatSourceList = (sources = []) =>
  dedupeSources(sources)
    .map((source) => sourceUrl(source))
    .filter(valuePresent)
    .map((url) => escapeCell(url))
    .join("; ") || "n/a";

const formatList = (values = []) =>
  (Array.isArray(values) ? values : [values])
    .filter(valuePresent)
    .map((value) => escapeCell(value))
    .join("; ") || "n/a";

const escapeHtml = (value, fallback = "n/a") =>
  normalizeInline(value, fallback)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const htmlListText = (values = []) =>
  (Array.isArray(values) ? values : [values])
    .filter(valuePresent)
    .map((value) => escapeHtml(value))
    .join("; ") || "n/a";

const htmlAffectedUrls = (urls = []) => {
  const affectedUrls = (Array.isArray(urls) ? urls : [urls]).filter(valuePresent);
  if (!affectedUrls.length) return "n/a";

  const visibleUrls = affectedUrls.slice(0, 3).map((url) => escapeHtml(url));
  const omittedCount = affectedUrls.length - visibleUrls.length;
  if (omittedCount > 0) visibleUrls.push(`(+${omittedCount} more)`);

  return visibleUrls.join("; ");
};

const htmlSources = (sources = []) =>
  dedupeSources(sources)
    .map((source) => sourceUrl(source))
    .filter(valuePresent)
    .map((url) => {
      const escapedUrl = escapeHtml(url);
      return /^https?:\/\//i.test(url) ? `<a href="${escapedUrl}">${escapedUrl}</a>` : escapedUrl;
    })
    .join("; ") || "n/a";

const htmlRows = (rows) => rows.join("\n");

const formatAffectedUrls = (urls = []) => {
  const affectedUrls = (Array.isArray(urls) ? urls : [urls]).filter(valuePresent);
  if (!affectedUrls.length) return "n/a";

  const visibleUrls = affectedUrls.slice(0, 3).map((url) => escapeCell(url));
  const omittedCount = affectedUrls.length - visibleUrls.length;
  if (omittedCount > 0) visibleUrls.push(`(+${omittedCount} more)`);

  return visibleUrls.join("; ");
};

const findingRuleId = (finding) => normalizeInline(finding?.ruleId ?? finding?.id);

const firstAffectedUrl = (finding) => {
  const urls = Array.isArray(finding?.affectedUrls) ? finding.affectedUrls : [];
  return normalizeInline(urls[0], "");
};

const compareText = (left, right) => normalizeInline(left, "").localeCompare(normalizeInline(right, ""));

const compareFindings = (left, right) => {
  const severityDelta = (priorityRank[left?.severity] ?? 9) - (priorityRank[right?.severity] ?? 9);
  if (severityDelta !== 0) return severityDelta;

  const ruleDelta = compareText(findingRuleId(left), findingRuleId(right));
  if (ruleDelta !== 0) return ruleDelta;

  const titleDelta = compareText(left?.title, right?.title);
  if (titleDelta !== 0) return titleDelta;

  return compareText(firstAffectedUrl(left), firstAffectedUrl(right));
};

const sortedPageFindings = (audit) => [...(audit.findings || [])].sort(compareFindings);

const highestSeverity = (findings) => {
  const severity = findings
    .map((finding) => finding.severity)
    .filter((value) => Object.prototype.hasOwnProperty.call(priorityRank, value))
    .sort((left, right) => priorityRank[left] - priorityRank[right])[0];

  return severity || "n/a";
};

const titleizeDimension = (dimension) =>
  normalizeInline(dimension)
    .split(/[_\s-]+/)
    .map((word) => (word ? `${word[0].toUpperCase()}${word.slice(1)}` : word))
    .join(" ");

const hasMeasuredVisibility = (integrations = {}) =>
  rowCount(integrations.searchConsole) > 0 || rowCount(integrations.serp) > 0 || rowCount(integrations.aiAnswers) > 0;

const evidenceType = (audit) => {
  const labels = [];
  const integrations = audit.integrations || {};

  if (audit.repo) labels.push("source-repository audit");
  if (hasMeasuredVisibility(integrations)) labels.push("includes measured visibility imports");
  if (integrations.lighthouse) labels.push("includes imported performance evidence");

  return labels.length ? labels.join("; ") : "readiness-only audit";
};

const formatCrawlScope = (audit) => {
  const crawl = audit.run?.crawl ?? audit.crawl;
  if (!crawl) return "n/a";

  return `${escapeInline(crawl.mode)}, max ${escapeInline(crawl.maxPages)} pages, depth ${escapeInline(crawl.maxDepth)}`;
};

const formatMetric = (value, suffix = "") => (Number.isFinite(value) ? `${value}${suffix}` : "n/a");

const buildResult = (build) => {
  if (!build) return "n/a";

  const exitCode = valuePresent(build.exitCode) ? normalizeInline(build.exitCode) : "n/a";
  const duration = valuePresent(build.durationMs) ? `${normalizeInline(build.durationMs)} ms` : "n/a";
  return `exit ${exitCode} in ${duration}`;
};

const repoAuditMode = (repo) => {
  if (!repo) return "n/a";
  if (repo.previewUrl) return "preview server";
  if (repo.routeList) return "route-list static output";
  if (repo.staticDir || repo.staticDirRelative) return "static output";
  return "no usable audit path";
};

const sourceFindingInspectNext = (finding) => formatList(finding.inspectNext || []);
const sourceFindingActionValue = (finding) =>
  normalizeInline(finding.developerAction, "") || finding.recommendation;
const sourceFindingAction = (finding) => normalizeInline(sourceFindingActionValue(finding));
const sourceFindingAcceptance = (finding) => formatList(finding.acceptanceCriteria || []);
const htmlSourceFindingInspectNext = (finding) => htmlListText(finding.inspectNext || []);
const htmlSourceFindingAction = (finding) => escapeHtml(sourceFindingActionValue(finding));
const htmlSourceFindingAcceptance = (finding) => htmlListText(finding.acceptanceCriteria || []);

const appendHeader = (lines, audit) => {
  lines.push(
    "# RankForge GEO/SEO Audit Report",
    "",
    `Target: ${escapeInline(audit.run?.target ?? audit.target ?? "unknown")}`,
    `Generated: ${escapeInline(audit.run?.endedAt ?? new Date().toISOString())}`,
    `Audit mode: ${escapeInline(audit.run?.mode)}`,
    `Crawl scope: ${formatCrawlScope(audit)}`,
    `Evidence type: ${evidenceType(audit)}`,
  );
};

const appendExecutiveSummary = (lines, audit, findings) => {
  const scoredDimensionCount = Object.keys(audit.scores || {}).length;
  const auditedPageCount = Array.isArray(audit.pages) ? audit.pages.length : 0;
  const affectedPageCount = new Set(findings.flatMap((finding) => finding.affectedUrls || []).filter(valuePresent)).size;
  const sourceFindingCount = audit.repo?.sourceFindings?.length ?? 0;
  const evidenceGapCount = audit.evidenceGaps?.length ?? 0;
  const findingNoun = findings.length === 1 ? "finding" : "findings";
  const dimensionNoun = scoredDimensionCount === 1 ? "dimension" : "dimensions";
  const visibilityNote = hasMeasuredVisibility(audit.integrations || {})
    ? "Measured visibility imports are present and are reported separately from readiness findings."
    : "This report evaluates SEO/GEO readiness. It does not measure rankings, SERP positions, or AI-answer visibility unless imported evidence is present.";

  lines.push(
    "",
    "## Executive Summary",
    "",
    `Found ${findings.length} deterministic ${findingNoun} across ${scoredDimensionCount} scored ${dimensionNoun}.`,
    `Highest severity: ${highestSeverity(findings)}`,
    `Audited pages: ${auditedPageCount}`,
    `Affected pages: ${affectedPageCount}`,
    `Repository source findings: ${sourceFindingCount}`,
    `Evidence gaps: ${evidenceGapCount}`,
    "",
    visibilityNote,
  );
};

const appendTopPriorities = (lines, findings) => {
  lines.push("", "## Top Priorities", "");

  const priorities = findings.slice(0, 5);
  if (!priorities.length) {
    lines.push("No top priorities.");
    return;
  }

  for (const finding of priorities) {
    const task = finding.implementationTask || {};
    const nextAction = task.summary ?? finding.recommendation;
    const affectedCount = Array.isArray(finding.affectedUrls) ? finding.affectedUrls.filter(valuePresent).length : 0;

    lines.push(`- **${escapeInline(finding.severity)}** \`${escapeInline(findingRuleId(finding))}\` - ${escapeInline(finding.title)}`);
    lines.push(`  - Affected URLs: ${affectedCount}`);
    lines.push(`  - Impact: ${escapeInline(finding.impact)}`);
    lines.push(`  - Next action: ${escapeInline(nextAction)}`);
  }
};

const appendFindingsByDimension = (lines, findings) => {
  lines.push("", "## Findings By Dimension", "");

  if (!findings.length) {
    lines.push("No page findings.");
    return;
  }

  const groups = new Map();
  for (const finding of findings) {
    const dimension = normalizeInline(finding.dimension, "uncategorized");
    if (!groups.has(dimension)) groups.set(dimension, []);
    groups.get(dimension).push(finding);
  }

  for (const dimension of [...groups.keys()].sort(compareText)) {
    lines.push(`### ${titleizeDimension(dimension)}`, "");
    lines.push("| Severity | Rule | Finding | Affected URLs | Evidence | Sources |");
    lines.push("|---|---|---|---|---|---|");

    for (const finding of [...groups.get(dimension)].sort(compareFindings)) {
      lines.push(
        `| ${escapeCell(finding.severity)} | ${escapeCell(findingRuleId(finding))} | ${escapeCell(finding.title)} | ${formatAffectedUrls(finding.affectedUrls)} | ${formatList(finding.evidence)} | ${formatSourceList(finding.sources)} |`,
      );
    }

    lines.push("");
  }
};

const appendScores = (lines, audit) => {
  lines.push("", "## Scores", "");

  const scoreEntries = Object.entries(audit.scores || {}).sort(([left], [right]) => compareText(left, right));
  if (!scoreEntries.length) {
    lines.push("No scored dimensions.");
    return;
  }

  lines.push("| Dimension | Score | Findings |");
  lines.push("|---|---:|---|");
  for (const [dimension, score] of scoreEntries) {
    lines.push(`| ${escapeCell(dimension)} | ${escapeCell(score?.score)} | ${formatList(score?.findings || [])} |`);
  }
};

const actionOwner = (finding) => normalizeInline(finding.implementationTask?.owner ?? finding.owner, "Unassigned");

const actionEffort = (finding) => normalizeInline(finding.implementationTask?.effort ?? finding.effort);

const actionSummary = (finding) =>
  normalizeInline(finding.implementationTask?.summary ?? finding.recommendation ?? finding.title);

const acceptanceCriteria = (finding) => formatList(finding.implementationTask?.acceptanceCriteria || []);

const appendDeveloperActionPlan = (lines, findings) => {
  lines.push("", "## Developer Action Plan", "");

  if (!findings.length) {
    lines.push("No developer actions recorded.");
    return;
  }

  const groups = new Map();
  for (const finding of findings) {
    const owner = actionOwner(finding);
    if (!groups.has(owner)) groups.set(owner, []);
    groups.get(owner).push(finding);
  }

  for (const [owner, ownerFindings] of groups) {
    lines.push(`### ${escapeInline(owner)}`, "");

    for (const finding of ownerFindings) {
      lines.push(
        `- **${escapeInline(finding.severity)}** \`${escapeInline(findingRuleId(finding))}\` - Effort: ${escapeInline(actionEffort(finding))} - ${escapeInline(actionSummary(finding))}`,
      );
      lines.push(`  - Affected URLs: ${formatAffectedUrls(finding.affectedUrls)}`);
      lines.push(`  - Acceptance criteria: ${acceptanceCriteria(finding)}`);
    }

    lines.push("");
  }
};

const appendRepositoryEvidence = (lines, repo) => {
  if (!repo) return;

  const routes = repo.routeSources || [];
  const manifests = repo.frameworkManifests || [];
  const sourceFindings = repo.sourceFindings || [];

  lines.push("", "## Repository Audit Evidence", "");
  lines.push(`- Path: ${escapeInline(repo.path)}`);
  lines.push(`- Framework: ${escapeInline(repo.detectedFramework)}`);
  lines.push(`- Package manager: ${escapeInline(repo.packageManager)}`);
  lines.push(`- Repo audit mode: ${escapeInline(repoAuditMode(repo))}`);
  lines.push(`- Static dir: ${escapeInline(repo.staticDirRelative ?? repo.staticDir)}`);
  lines.push(`- Preview command: ${escapeInline(repo.previewCommand)}`);
  lines.push(`- Preview URL: ${escapeInline(repo.previewUrl)}`);
  if (repo.buildCommand) lines.push(`- Build command: ${escapeInline(repo.buildCommand)}`);
  lines.push(`- Build executed: ${repo.build ? (repo.build.executed ? "yes" : "no") : "n/a"}`);
  lines.push(`- Build result: ${buildResult(repo.build)}`);
  lines.push(`- Route list: ${escapeInline(repo.routeList)}`);
  lines.push(`- Route sources: ${routes.length}`);
  lines.push(`- Framework manifests: ${manifests.length}`);
  lines.push(`- Repository source findings: ${sourceFindings.length}`);

  lines.push("", "### Repository Routes", "");
  lines.push("| Type | Route | Source |");
  lines.push("|---|---|---|");
  for (const route of routes.slice(0, 20)) {
    lines.push(`| ${escapeCell(route.type)} | ${escapeCell(route.route ?? route.path)} | ${escapeCell(route.path ?? route.source)} |`);
  }
  if (routes.length > 20) lines.push(`| omitted | (+${routes.length - 20} more) | n/a |`);

  lines.push("", "### Framework Route Manifests", "");
  lines.push("| Type | Routes | Path |");
  lines.push("|---|---:|---|");
  for (const manifest of manifests) {
    const routesCount = Array.isArray(manifest.routes) ? manifest.routes.length : 0;
    lines.push(`| ${escapeCell(manifest.type)} | ${routesCount} | ${escapeCell(manifest.path)} |`);
  }

  lines.push("", "### Repository Source Findings", "");
  lines.push("| Severity | Source Finding | Message | Evidence | Inspect Next | Next Action | Acceptance Check |");
  lines.push("|---|---|---|---|---|---|---|");
  for (const finding of sourceFindings) {
    lines.push(
      `| ${escapeCell(finding.severity)} | ${escapeCell(finding.id)} | ${escapeCell(finding.message)} | ${escapeCell(finding.evidence)} | ${sourceFindingInspectNext(finding)} | ${escapeCell(sourceFindingAction(finding))} | ${sourceFindingAcceptance(finding)} |`,
    );
  }
};

const appendImportedMeasurements = (lines, integrations = {}) => {
  lines.push("", "## Imported Measurements", "");

  const hasMeasurements =
    integrations.searchConsole || integrations.serp || integrations.aiAnswers || integrations.lighthouse;

  if (!hasMeasurements) {
    lines.push(
      "No imported measurements. Ranking, SERP, AI-answer, and Lighthouse measurements are reported only when supplied as evidence imports.",
    );
    return;
  }

  lines.push(
    integrations.searchConsole
      ? `- Search Console: ${plural(rowCount(integrations.searchConsole), "row")} of observed query/page performance.`
      : "- Search Console: not supplied.",
  );
  lines.push(
    integrations.serp
      ? `- SERP export: ${plural(rowCount(integrations.serp), "row")} of observed search-result evidence.`
      : "- SERP export: not supplied.",
  );
  lines.push(
    integrations.aiAnswers
      ? `- AI-answer export: ${plural(rowCount(integrations.aiAnswers), "row")} of supplied AI-answer evidence.`
      : "- AI-answer export: not supplied.",
  );

  if (integrations.lighthouse) {
    const lighthouse = integrations.lighthouse;
    const metrics = lighthouse.metrics || {};
    const formFactor = lighthouse.formFactor ? ` (${escapeInline(lighthouse.formFactor)})` : "";
    lines.push(
      `Lighthouse: ${formatMetric(lighthouse.performanceScore, "/100")} performance score${formFactor}; LCP ${formatMetric(metrics.lcpMs, " ms")}; CLS ${formatMetric(metrics.cls)}; TBT ${formatMetric(metrics.tbtMs, " ms")}.`,
    );
  }
};

const appendEvidenceGaps = (lines, audit) => {
  lines.push("", "## Evidence Gaps", "");

  if (audit.evidenceGaps?.length) {
    for (const gap of audit.evidenceGaps) lines.push(`- ${escapeInline(gap.id)}: ${escapeInline(gap.message)}`);
  } else {
    lines.push("No evidence gaps recorded.");
  }

  lines.push(
    "",
    "How to close common gaps:",
    "- Add `--search-console`, `--serp`, or `--ai-answers` to report observed visibility.",
    "- Add `--lighthouse` to report imported performance evidence.",
    "- Increase crawl scope when important templates or page types are missing.",
    "- Use trusted rendering when important content depends on client-side JavaScript.",
  );
};

const appendSources = (lines, audit) => {
  lines.push("", "## Sources", "");

  const sources = dedupeSources(audit.sources || []);
  if (!sources.length) {
    lines.push("No sources recorded.");
    return;
  }

  for (const source of sources) {
    lines.push(`- ${escapeInline(sourceId(source))}: ${escapeInline(sourceUrl(source))}`);
  }
};

const reportStyles = `
:root {
  color-scheme: light;
  --bg: #f7f8fa;
  --panel: #ffffff;
  --text: #162033;
  --muted: #5d687a;
  --line: #dde3ec;
  --accent: #0f766e;
  --accent-soft: #e6f5f2;
  --danger: #b42318;
  --warning: #b54708;
  --info: #175cd3;
  --radius: 8px;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.5;
}
a { color: var(--info); overflow-wrap: anywhere; }
.report-shell { max-width: 1180px; margin: 0 auto; padding: 32px 20px 48px; }
.report-header {
  display: grid;
  gap: 16px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--panel);
  padding: 24px;
}
.eyebrow {
  margin: 0;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}
h1, h2, h3 { margin: 0; line-height: 1.2; letter-spacing: 0; }
h1 { font-size: clamp(2rem, 4vw, 3.4rem); }
h2 { font-size: 1.35rem; }
h3 { font-size: 1rem; }
.target { color: var(--muted); overflow-wrap: anywhere; }
.meta-grid, .summary-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
.meta-item, .summary-card {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fbfcfe;
  padding: 12px;
}
.meta-label, .summary-label {
  display: block;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}
.summary-value { display: block; margin-top: 4px; font-size: 1.45rem; font-weight: 800; }
.report-section {
  margin-top: 20px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--panel);
  padding: 22px;
}
.section-intro { color: var(--muted); margin: 8px 0 0; }
.priority-list, .action-list, .gap-list, .measurement-list, .source-list { padding-left: 1.2rem; }
.priority-list li, .action-list li, .gap-list li, .measurement-list li, .source-list li { margin: 10px 0; }
.priority-card {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 14px;
  margin-top: 12px;
}
.severity {
  display: inline-flex;
  align-items: center;
  min-width: 2.4rem;
  justify-content: center;
  border-radius: 999px;
  padding: 2px 8px;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 800;
}
.severity-P0, .severity-P1 { background: var(--danger); }
.severity-P2 { background: var(--warning); }
.severity-P3 { background: var(--info); }
.rule-id { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; color: var(--muted); }
.table-wrap { overflow-x: auto; margin-top: 12px; }
table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
th, td { border-bottom: 1px solid var(--line); padding: 10px 8px; text-align: left; vertical-align: top; }
th { color: var(--muted); font-size: 0.76rem; text-transform: uppercase; }
.empty-state { color: var(--muted); }
.repo-facts { margin: 12px 0 0; padding: 0; display: grid; gap: 8px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.repo-facts div { border: 1px solid var(--line); border-radius: var(--radius); padding: 10px; background: #fbfcfe; }
.repo-facts dt { color: var(--muted); font-size: 0.78rem; font-weight: 700; text-transform: uppercase; }
.repo-facts dd { margin: 4px 0 0; overflow-wrap: anywhere; }
`;

const htmlSection = (id, title, content, intro = "") => `
<section class="report-section" aria-labelledby="${id}-heading">
  <h2 id="${id}-heading">${escapeHtml(title)}</h2>
  ${intro ? `<p class="section-intro">${escapeHtml(intro)}</p>` : ""}
  ${content}
</section>`;

const htmlSeverity = (severity) => {
  const safeSeverity = escapeHtml(severity);
  return `<span class="severity severity-${safeSeverity}">${safeSeverity}</span>`;
};

const htmlTable = (headers, rows, emptyText) => {
  if (!rows.length) return `<p class="empty-state">${escapeHtml(emptyText)}</p>`;
  return `
<div class="table-wrap">
  <table>
    <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
    <tbody>
      ${htmlRows(rows.map((cells) => `<tr>${cells.map((cell) => `<td>${cell}</td>`).join("")}</tr>`))}
    </tbody>
  </table>
</div>`;
};

const htmlHeader = (audit) => {
  const target = audit.run?.target ?? audit.target ?? "unknown";
  return `
<header class="report-header">
  <div>
    <p class="eyebrow">RankForge GEO/SEO Audit Report</p>
    <h1>RankForge GEO/SEO Audit Report</h1>
    <p class="target">${escapeHtml(target)}</p>
  </div>
  <div class="meta-grid">
    <div class="meta-item"><span class="meta-label">Generated</span>${escapeHtml(audit.run?.endedAt ?? new Date().toISOString())}</div>
    <div class="meta-item"><span class="meta-label">Audit mode</span>${escapeHtml(audit.run?.mode)}</div>
    <div class="meta-item"><span class="meta-label">Crawl scope</span>${escapeHtml(formatCrawlScope(audit))}</div>
    <div class="meta-item"><span class="meta-label">Evidence type</span>${escapeHtml(evidenceType(audit))}</div>
  </div>
</header>`;
};

const htmlExecutiveSummary = (audit, findings) => {
  const scoredDimensionCount = Object.keys(audit.scores || {}).length;
  const auditedPageCount = Array.isArray(audit.pages) ? audit.pages.length : 0;
  const affectedPageCount = new Set(findings.flatMap((finding) => finding.affectedUrls || []).filter(valuePresent)).size;
  const sourceFindingCount = audit.repo?.sourceFindings?.length ?? 0;
  const evidenceGapCount = audit.evidenceGaps?.length ?? 0;
  const visibilityNote = hasMeasuredVisibility(audit.integrations || {})
    ? "Measured visibility imports are present and are reported separately from readiness findings."
    : "This report evaluates SEO/GEO readiness. It does not measure rankings, SERP positions, or AI-answer visibility unless imported evidence is present.";

  const cards = [
    ["Findings", findings.length],
    ["Highest severity", highestSeverity(findings)],
    ["Audited pages", auditedPageCount],
    ["Affected pages", affectedPageCount],
    ["Repo source findings", sourceFindingCount],
    ["Evidence gaps", evidenceGapCount],
    ["Scored dimensions", scoredDimensionCount],
  ];

  return htmlSection(
    "executive-summary",
    "Executive Summary",
    `
<div class="summary-grid">
  ${cards
    .map(
      ([label, value]) =>
        `<div class="summary-card"><span class="summary-label">${escapeHtml(label)}</span><span class="summary-value">${escapeHtml(value)}</span></div>`,
    )
    .join("")}
</div>
<p class="section-intro">${escapeHtml(visibilityNote)}</p>`,
  );
};

const htmlTopPriorities = (findings) => {
  const priorities = findings.slice(0, 5);
  if (!priorities.length) return htmlSection("top-priorities", "Top Priorities", `<p class="empty-state">No top priorities.</p>`);

  const cards = priorities
    .map((finding) => {
      const task = finding.implementationTask || {};
      const nextAction = task.summary ?? finding.recommendation;
      const affectedCount = Array.isArray(finding.affectedUrls) ? finding.affectedUrls.filter(valuePresent).length : 0;
      return `
<article class="priority-card">
  <h3>${htmlSeverity(finding.severity)} <span class="rule-id">${escapeHtml(findingRuleId(finding))}</span> - ${escapeHtml(finding.title)}</h3>
  <p><strong>Affected URLs:</strong> ${escapeHtml(affectedCount)}</p>
  <p><strong>Impact:</strong> ${escapeHtml(finding.impact)}</p>
  <p><strong>Next action:</strong> ${escapeHtml(nextAction)}</p>
</article>`;
    })
    .join("");

  return htmlSection("top-priorities", "Top Priorities", cards);
};

const htmlFindingsByDimension = (findings) => {
  if (!findings.length) return htmlSection("findings-by-dimension", "Findings By Dimension", `<p class="empty-state">No page findings.</p>`);

  const groups = new Map();
  for (const finding of findings) {
    const dimension = normalizeInline(finding.dimension, "uncategorized");
    if (!groups.has(dimension)) groups.set(dimension, []);
    groups.get(dimension).push(finding);
  }

  const content = [...groups.keys()]
    .sort(compareText)
    .map((dimension) => {
      const rows = [...groups.get(dimension)].sort(compareFindings).map((finding) => [
        htmlSeverity(finding.severity),
        `<span class="rule-id">${escapeHtml(findingRuleId(finding))}</span>`,
        escapeHtml(finding.title),
        htmlAffectedUrls(finding.affectedUrls),
        htmlListText(finding.evidence),
        htmlSources(finding.sources),
      ]);

      return `
<h3>${escapeHtml(titleizeDimension(dimension))}</h3>
${htmlTable(["Severity", "Rule", "Finding", "Affected URLs", "Evidence", "Sources"], rows, "No findings in this dimension.")}`;
    })
    .join("");

  return htmlSection("findings-by-dimension", "Findings By Dimension", content);
};

const htmlScores = (audit) => {
  const rows = Object.entries(audit.scores || {})
    .sort(([left], [right]) => compareText(left, right))
    .map(([dimension, score]) => [escapeHtml(dimension), escapeHtml(score?.score), htmlListText(score?.findings || [])]);

  return htmlSection("scores", "Scores", htmlTable(["Dimension", "Score", "Findings"], rows, "No scored dimensions."));
};

const htmlDeveloperActionPlan = (findings) => {
  if (!findings.length) {
    return htmlSection("developer-action-plan", "Developer Action Plan", `<p class="empty-state">No developer actions recorded.</p>`);
  }

  const groups = new Map();
  for (const finding of findings) {
    const owner = actionOwner(finding);
    if (!groups.has(owner)) groups.set(owner, []);
    groups.get(owner).push(finding);
  }

  const content = [...groups.entries()]
    .map(([owner, ownerFindings]) => {
      const items = ownerFindings
        .map(
          (finding) => `
<li>
  ${htmlSeverity(finding.severity)} <span class="rule-id">${escapeHtml(findingRuleId(finding))}</span>
  - Effort: ${escapeHtml(actionEffort(finding))} - ${escapeHtml(actionSummary(finding))}
  <br><strong>Affected URLs:</strong> ${htmlAffectedUrls(finding.affectedUrls)}
  <br><strong>Acceptance criteria:</strong> ${escapeHtml(acceptanceCriteria(finding))}
</li>`,
        )
        .join("");
      return `<h3>${escapeHtml(owner)}</h3><ul class="action-list">${items}</ul>`;
    })
    .join("");

  return htmlSection("developer-action-plan", "Developer Action Plan", content);
};

const htmlRepositoryEvidence = (repo) => {
  if (!repo) return "";

  const routes = repo.routeSources || [];
  const manifests = repo.frameworkManifests || [];
  const sourceFindings = repo.sourceFindings || [];
  const facts = [
    ["Path", repo.path],
    ["Framework", repo.detectedFramework],
    ["Package manager", repo.packageManager],
    ["Repo audit mode", repoAuditMode(repo)],
    ["Static dir", repo.staticDirRelative ?? repo.staticDir],
    ["Preview command", repo.previewCommand],
    ["Preview URL", repo.previewUrl],
    ["Build command", repo.buildCommand],
    ["Build executed", repo.build ? (repo.build.executed ? "yes" : "no") : "n/a"],
    ["Build result", buildResult(repo.build)],
    ["Route list", repo.routeList],
    ["Route sources", routes.length],
    ["Framework manifests", manifests.length],
    ["Repository source findings", sourceFindings.length],
  ];

  const routeRows = routes.slice(0, 20).map((route) => [
    escapeHtml(route.type),
    escapeHtml(route.route ?? route.path),
    escapeHtml(route.path ?? route.source),
  ]);
  if (routes.length > 20) routeRows.push(["omitted", escapeHtml(`(+${routes.length - 20} more)`), "n/a"]);

  const manifestRows = manifests.map((manifest) => [
    escapeHtml(manifest.type),
    escapeHtml(Array.isArray(manifest.routes) ? manifest.routes.length : 0),
    escapeHtml(manifest.path),
  ]);

  const sourceFindingRows = sourceFindings.map((finding) => [
    htmlSeverity(finding.severity),
    `<span class="rule-id">${escapeHtml(finding.id)}</span>`,
    escapeHtml(finding.message),
    escapeHtml(finding.evidence),
    htmlSourceFindingInspectNext(finding),
    htmlSourceFindingAction(finding),
    htmlSourceFindingAcceptance(finding),
  ]);

  return htmlSection(
    "repository-audit-evidence",
    "Repository Audit Evidence",
    `
<dl class="repo-facts">
  ${facts.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}
</dl>
<h3>Repository Routes</h3>
${htmlTable(["Type", "Route", "Source"], routeRows, "No repository routes recorded.")}
<h3>Framework Route Manifests</h3>
${htmlTable(["Type", "Routes", "Path"], manifestRows, "No framework route manifests recorded.")}
<h3>Repository Source Findings</h3>
${htmlTable(["Severity", "Source Finding", "Message", "Evidence", "Inspect Next", "Next Action", "Acceptance Check"], sourceFindingRows, "No repository source findings recorded.")}`,
  );
};

const htmlImportedMeasurements = (integrations = {}) => {
  const hasMeasurements =
    integrations.searchConsole || integrations.serp || integrations.aiAnswers || integrations.lighthouse;

  if (!hasMeasurements) {
    return htmlSection(
      "imported-measurements",
      "Imported Measurements",
      `<p class="empty-state">No imported measurements. Ranking, SERP, AI-answer, and Lighthouse measurements are reported only when supplied as evidence imports.</p>`,
    );
  }

  const items = [
    integrations.searchConsole
      ? `Search Console: ${plural(rowCount(integrations.searchConsole), "row")} of observed query/page performance.`
      : "Search Console: not supplied.",
    integrations.serp
      ? `SERP export: ${plural(rowCount(integrations.serp), "row")} of observed search-result evidence.`
      : "SERP export: not supplied.",
    integrations.aiAnswers
      ? `AI-answer export: ${plural(rowCount(integrations.aiAnswers), "row")} of supplied AI-answer evidence.`
      : "AI-answer export: not supplied.",
  ];

  if (integrations.lighthouse) {
    const lighthouse = integrations.lighthouse;
    const metrics = lighthouse.metrics || {};
    const formFactor = lighthouse.formFactor ? ` (${normalizeInline(lighthouse.formFactor)})` : "";
    items.push(
      `Lighthouse: ${formatMetric(lighthouse.performanceScore, "/100")} performance score${formFactor}; LCP ${formatMetric(metrics.lcpMs, " ms")}; CLS ${formatMetric(metrics.cls)}; TBT ${formatMetric(metrics.tbtMs, " ms")}.`,
    );
  }

  return htmlSection(
    "imported-measurements",
    "Imported Measurements",
    `<ul class="measurement-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`,
  );
};

const htmlEvidenceGaps = (audit) => {
  const gaps = audit.evidenceGaps?.length
    ? audit.evidenceGaps.map((gap) => `<li><span class="rule-id">${escapeHtml(gap.id)}</span>: ${escapeHtml(gap.message)}</li>`).join("")
    : "<li>No evidence gaps recorded.</li>";

  return htmlSection(
    "evidence-gaps",
    "Evidence Gaps",
    `
<ul class="gap-list">${gaps}</ul>
<p class="section-intro">How to close common gaps:</p>
<ul class="gap-list">
  <li>Add <span class="rule-id">--search-console</span>, <span class="rule-id">--serp</span>, or <span class="rule-id">--ai-answers</span> to report observed visibility.</li>
  <li>Add <span class="rule-id">--lighthouse</span> to report imported performance evidence.</li>
  <li>Increase crawl scope when important templates or page types are missing.</li>
  <li>Use trusted rendering when important content depends on client-side JavaScript.</li>
</ul>`,
  );
};

const htmlSourceList = (audit) => {
  const sources = dedupeSources(audit.sources || []);
  const content = sources.length
    ? `<ul class="source-list">${sources
        .map((source) => {
          const url = sourceUrl(source);
          const escapedUrl = escapeHtml(url);
          const linkedUrl = /^https?:\/\//i.test(url) ? `<a href="${escapedUrl}">${escapedUrl}</a>` : escapedUrl;
          return `<li><span class="rule-id">${escapeHtml(sourceId(source))}</span>: ${linkedUrl}</li>`;
        })
        .join("")}</ul>`
    : `<p class="empty-state">No sources recorded.</p>`;

  return htmlSection("sources", "Sources", content);
};

export const generateHtmlReport = (audit) => {
  const safeAudit = audit || {};
  const findings = sortedPageFindings(safeAudit);
  const target = safeAudit.run?.target ?? safeAudit.target ?? "unknown";
  const title = `RankForge GEO/SEO Audit Report - ${normalizeInline(target)}`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>${reportStyles}</style>
</head>
<body>
  <main class="report-shell">
    ${htmlHeader(safeAudit)}
    ${htmlExecutiveSummary(safeAudit, findings)}
    ${htmlTopPriorities(findings)}
    ${htmlFindingsByDimension(findings)}
    ${htmlScores(safeAudit)}
    ${htmlDeveloperActionPlan(findings)}
    ${htmlRepositoryEvidence(safeAudit.repo)}
    ${htmlImportedMeasurements(safeAudit.integrations || {})}
    ${htmlEvidenceGaps(safeAudit)}
    ${htmlSourceList(safeAudit)}
  </main>
</body>
</html>
`;
};

export const generateMarkdownReport = (audit) => {
  const safeAudit = audit || {};
  const findings = sortedPageFindings(safeAudit);
  const lines = [];

  appendHeader(lines, safeAudit);
  appendExecutiveSummary(lines, safeAudit, findings);
  appendTopPriorities(lines, findings);
  appendFindingsByDimension(lines, findings);
  appendScores(lines, safeAudit);
  appendDeveloperActionPlan(lines, findings);
  appendRepositoryEvidence(lines, safeAudit.repo);
  appendImportedMeasurements(lines, safeAudit.integrations || {});
  appendEvidenceGaps(lines, safeAudit);
  appendSources(lines, safeAudit);

  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n")}\n`;
};
