import fs from "node:fs";
import { getRule } from "./rules.mjs";

const numericAuditValue = (audits, id) => {
  const value = audits?.[id]?.numericValue;
  return Number.isFinite(value) ? value : null;
};

const scoreToPercent = (score) => {
  if (!Number.isFinite(score)) return null;
  return Math.round(score * 100);
};

const lighthouseUrl = (evidence) => evidence.finalUrl || evidence.requestedUrl || evidence.source || "Lighthouse report";

const effortFor = (severity) => (severity === "P0" || severity === "P1" ? "M" : "S");

const createPerformanceFinding = (ruleId, lighthouse, evidence, impact) => {
  const rule = getRule(ruleId);
  if (!rule) throw new Error(`Unknown rule: ${ruleId}`);

  return {
    ruleId: rule.id,
    title: rule.title,
    severity: rule.defaultSeverity,
    dimension: rule.dimension,
    affectedUrls: [lighthouseUrl(lighthouse)],
    evidence,
    impact,
    recommendation: rule.recommendation,
    owner: "Engineering",
    effort: effortFor(rule.defaultSeverity),
    confidence: "high",
    sources: rule.sources,
  };
};

export const readLighthouseReport = (filePath) => {
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const performanceScore = scoreToPercent(parsed.categories?.performance?.score);

  return {
    type: "lighthouse",
    source: filePath,
    lighthouseVersion: parsed.lighthouseVersion || null,
    requestedUrl: parsed.requestedUrl || null,
    finalUrl: parsed.finalDisplayedUrl || parsed.finalUrl || null,
    formFactor: parsed.configSettings?.formFactor || null,
    performanceScore,
    metrics: {
      lcpMs: numericAuditValue(parsed.audits, "largest-contentful-paint"),
      cls: numericAuditValue(parsed.audits, "cumulative-layout-shift"),
      tbtMs: numericAuditValue(parsed.audits, "total-blocking-time"),
    },
  };
};

export const evaluatePerformance = (lighthouse) => {
  if (!lighthouse) return [];

  const findings = [];
  const score = lighthouse.performanceScore;
  const lcpMs = lighthouse.metrics?.lcpMs;
  const cls = lighthouse.metrics?.cls;

  if (Number.isFinite(score) && score < 50) {
    findings.push(
      createPerformanceFinding(
        "performance.lighthouse_poor",
        lighthouse,
        ["$.integrations.lighthouse.performanceScore"],
        `Imported Lighthouse performance score is ${score}/100.`,
      ),
    );
  }

  if (Number.isFinite(lcpMs) && lcpMs > 2500) {
    findings.push(
      createPerformanceFinding(
        "performance.lcp_poor",
        lighthouse,
        ["$.integrations.lighthouse.metrics.lcpMs"],
        `Largest Contentful Paint is ${Math.round(lcpMs)} ms in the imported Lighthouse report.`,
      ),
    );
  }

  if (Number.isFinite(cls) && cls > 0.1) {
    findings.push(
      createPerformanceFinding(
        "performance.cls_poor",
        lighthouse,
        ["$.integrations.lighthouse.metrics.cls"],
        `Cumulative Layout Shift is ${cls} in the imported Lighthouse report.`,
      ),
    );
  }

  return findings;
};
