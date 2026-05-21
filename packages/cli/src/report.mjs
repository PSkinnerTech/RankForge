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

const appendHeader = (lines, audit) => {
  lines.push(
    "# GEO/SEO Audit Report",
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
  lines.push("| Severity | Source Finding | Message | Evidence | Recommendation |");
  lines.push("|---|---|---|---|---|");
  for (const finding of sourceFindings) {
    lines.push(
      `| ${escapeCell(finding.severity)} | ${escapeCell(finding.id)} | ${escapeCell(finding.message)} | ${escapeCell(finding.evidence)} | ${escapeCell(finding.recommendation)} |`,
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
