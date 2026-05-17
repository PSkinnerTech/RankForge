const escapeCell = (value) => String(value ?? "").replace(/\|/g, "\\|").replace(/\n+/g, " ");

const priorityRank = { P0: 0, P1: 1, P2: 2, P3: 3 };

const formatSources = (sources = []) => sources.join(", ");

const formatMetric = (value, suffix = "") => (Number.isFinite(value) ? `${value}${suffix}` : "n/a");

export const generateMarkdownReport = (audit) => {
  const findings = [...(audit.findings || [])].sort(
    (a, b) => (priorityRank[a.severity] ?? 9) - (priorityRank[b.severity] ?? 9),
  );

  const lines = [
    "# GEO/SEO Audit Report",
    "",
    `Target: ${audit.run?.target || "unknown"}`,
    `Generated: ${audit.run?.endedAt || new Date().toISOString()}`,
    "",
    "## Executive Summary",
    "",
    findings.length
      ? `Found ${findings.length} deterministic finding${findings.length === 1 ? "" : "s"} across ${Object.keys(audit.scores || {}).length} scored dimension${Object.keys(audit.scores || {}).length === 1 ? "" : "s"}.`
      : "No deterministic findings were detected in the collected evidence.",
    "",
    "## Priority Findings",
    "",
  ];

  if (findings.length) {
    lines.push("| Priority | Rule | Finding | Impact | Recommendation | Sources |");
    lines.push("|---|---|---|---|---|---|");
    for (const finding of findings) {
      lines.push(
        `| ${escapeCell(finding.severity)} | ${escapeCell(finding.ruleId)} | ${escapeCell(finding.title)} | ${escapeCell(finding.impact)} | ${escapeCell(finding.recommendation)} | ${escapeCell(formatSources(finding.sources))} |`,
      );
    }
  } else {
    lines.push("No priority findings.");
  }

  lines.push("", "## Scores", "");
  const scoreEntries = Object.entries(audit.scores || {});
  if (scoreEntries.length) {
    lines.push("| Dimension | Score | Findings |");
    lines.push("|---|---:|---|");
    for (const [dimension, score] of scoreEntries) {
      lines.push(`| ${escapeCell(dimension)} | ${score.score} | ${escapeCell((score.findings || []).join(", "))} |`);
    }
  } else {
    lines.push("No scored findings.");
  }

  lines.push("", "## Implementation Tasks", "");
  const taskFindings = findings.filter((finding) => finding.implementationTask);
  if (taskFindings.length) {
    lines.push("| Priority | Rule | Owner | Effort | Task | Acceptance Criteria |");
    lines.push("|---|---|---|---|---|---|");
    for (const finding of taskFindings) {
      const task = finding.implementationTask;
      lines.push(
        `| ${escapeCell(finding.severity)} | ${escapeCell(finding.ruleId)} | ${escapeCell(task.owner || finding.owner)} | ${escapeCell(task.effort || finding.effort)} | ${escapeCell(task.summary || finding.recommendation)} | ${escapeCell((task.acceptanceCriteria || []).join("; "))} |`,
      );
    }
  } else {
    lines.push("No implementation tasks recorded.");
  }

  lines.push("", "## Imported Evidence", "");
  if (audit.integrations?.lighthouse) {
    const lighthouse = audit.integrations.lighthouse;
    const metrics = lighthouse.metrics || {};
    lines.push(
      `- Lighthouse: ${formatMetric(lighthouse.performanceScore, "/100")} performance score${lighthouse.formFactor ? ` (${lighthouse.formFactor})` : ""}; LCP ${formatMetric(metrics.lcpMs, " ms")}; CLS ${formatMetric(metrics.cls)}; TBT ${formatMetric(metrics.tbtMs, " ms")}.`,
    );
  } else {
    lines.push("No imported performance evidence.");
  }

  lines.push("", "## Evidence Gaps", "");
  if (audit.evidenceGaps?.length) {
    for (const gap of audit.evidenceGaps) lines.push(`- ${gap.id}: ${gap.message}`);
  } else {
    lines.push("No evidence gaps recorded.");
  }

  lines.push("", "## Sources", "");
  if (audit.sources?.length) {
    for (const source of audit.sources) lines.push(`- ${source.id}: ${source.url}`);
  } else {
    lines.push("No sources recorded.");
  }

  return `${lines.join("\n")}\n`;
};
