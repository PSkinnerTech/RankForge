import { getRule } from "./rules.mjs";
import { validateStructuredData } from "./structured-data.mjs";

const severityImpact = {
  P0: 60,
  P1: 40,
  P2: 20,
  P3: 10,
};

const ownerFor = (dimension) => {
  if (
    dimension === "structured_data" ||
    dimension === "technical" ||
    dimension === "crawl_index" ||
    dimension === "performance"
  ) {
    return "Engineering";
  }
  if (dimension === "helpful_content" || dimension === "geo_readiness" || dimension === "entity_clarity") {
    return "Content";
  }
  return "SEO";
};

const effortFor = (severity) => (severity === "P0" || severity === "P1" ? "M" : "S");

const noindexPattern = /(?:^|,|\s)noindex(?:,|\s|$)/i;

const headerValue = (headers, name) => {
  const wanted = name.toLowerCase();
  for (const [key, value] of Object.entries(headers || {})) {
    if (key.toLowerCase() === wanted) return String(value);
  }
  return "";
};

const isHomepageLike = (snapshot) => {
  try {
    const parsed = new URL(snapshot.finalUrl);
    return parsed.pathname === "/" || /\/index\.html?$/i.test(parsed.pathname);
  } catch {
    return /(?:^|\/)index\.html?$/i.test(snapshot.finalUrl || "");
  }
};

const structuredDataTypes = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(structuredDataTypes);
  if (typeof value !== "object") return [];

  const types = [];
  if (value["@type"]) {
    if (Array.isArray(value["@type"])) types.push(...value["@type"].map(String));
    else types.push(String(value["@type"]));
  }
  if (value["@graph"]) types.push(...structuredDataTypes(value["@graph"]));
  return types;
};

const hasStructuredDataType = (evidence, type) =>
  (evidence.structuredData || []).some((item) => structuredDataTypes(item.data).includes(type));

const hasAboutOrContactLink = (evidence) =>
  (evidence.links || []).some((link) => {
    const haystack = `${link.href || ""} ${link.text || ""}`.toLowerCase();
    return haystack.includes("about") || haystack.includes("contact");
  });

const createFinding = (ruleId, snapshot, evidence, pageIndex, impact = null) => {
  const rule = getRule(ruleId);
  if (!rule) throw new Error(`Unknown rule: ${ruleId}`);

  return {
    ruleId: rule.id,
    title: rule.title,
    severity: rule.defaultSeverity,
    dimension: rule.dimension,
    affectedUrls: [snapshot.finalUrl],
    evidence,
    impact: impact || rule.title,
    recommendation: rule.recommendation,
    owner: ownerFor(rule.dimension),
    effort: effortFor(rule.defaultSeverity),
    confidence: "high",
    sources: rule.sources,
    pageIndex,
  };
};

export const evaluatePage = (snapshot, pageIndex = 0) => {
  const findings = [];
  const evidence = snapshot.evidence || {};
  const visibleTextCharacters = evidence.counts?.visibleTextCharacters || 0;

  if (Number.isInteger(snapshot.status) && snapshot.status >= 400) {
    findings.push(
      createFinding(
        "technical.http_error",
        snapshot,
        [`$.pages[${pageIndex}].status`],
        pageIndex,
        "Important pages with HTTP errors may be ineligible for indexing or unusable for visitors.",
      ),
    );
  }

  if (snapshot.sourceType === "url" && /^http:\/\//i.test(snapshot.finalUrl)) {
    findings.push(
      createFinding(
        "technical.https_missing",
        snapshot,
        [`$.pages[${pageIndex}].finalUrl`],
        pageIndex,
        "Important pages should be available over HTTPS.",
      ),
    );
  }

  if (snapshot.sourceType === "url" && !evidence.canonical && !noindexPattern.test(evidence.robots || "")) {
    findings.push(
      createFinding(
        "indexability.canonical_missing",
        snapshot,
        [`$.pages[${pageIndex}].evidence.canonical`],
        pageIndex,
        "Canonical signals help consolidate duplicate or alternate URL signals.",
      ),
    );
  }

  if (snapshot.render?.status === "rendered" && snapshot.render.textDeltaCharacters > 300) {
    findings.push(
      createFinding(
        "technical.raw_rendered_mismatch",
        snapshot,
        [`$.pages[${pageIndex}].evidence.counts.visibleTextCharacters`, `$.pages[${pageIndex}].render.textDeltaCharacters`],
        pageIndex,
        "Large raw and rendered text differences can indicate JavaScript SEO risk.",
      ),
    );
  }

  if (noindexPattern.test(evidence.robots || "")) {
    findings.push(
      createFinding(
        "indexability.noindex",
        snapshot,
        [`$.pages[${pageIndex}].evidence.robots`],
        pageIndex,
        "Pages with noindex are not eligible to appear in Google Search results.",
      ),
    );
  }

  if (noindexPattern.test(headerValue(snapshot.headers, "x-robots-tag"))) {
    findings.push(
      createFinding(
        "indexability.x_robots_noindex",
        snapshot,
        [`$.pages[${pageIndex}].headers.x-robots-tag`],
        pageIndex,
        "X-Robots-Tag noindex prevents indexing even when page HTML appears indexable.",
      ),
    );
  }

  if (!evidence.title) {
    findings.push(
      createFinding(
        "appearance.title_missing",
        snapshot,
        [`$.pages[${pageIndex}].evidence.title`],
        pageIndex,
        "Missing titles limit control over search result title links.",
      ),
    );
  }

  if (!evidence.description) {
    findings.push(
      createFinding(
        "appearance.meta_description_missing",
        snapshot,
        [`$.pages[${pageIndex}].evidence.description`],
        pageIndex,
        "Missing descriptions reduce the page's ability to provide useful snippet text.",
      ),
    );
  }

  if (!Array.isArray(evidence.h1) || evidence.h1.length === 0) {
    findings.push(
      createFinding(
        "appearance.h1_missing",
        snapshot,
        [`$.pages[${pageIndex}].evidence.h1`],
        pageIndex,
        "A missing primary heading makes page purpose less explicit for users and crawlers.",
      ),
    );
  }

  if ((evidence.images || []).some((image) => image.alt === null || image.alt === "")) {
    findings.push(
      createFinding(
        "appearance.image_alt_missing",
        snapshot,
        [`$.pages[${pageIndex}].evidence.images`],
        pageIndex,
        "Images without alt text provide weaker context for accessibility and image search.",
      ),
    );
  }

  if ((evidence.structuredData || []).some((item) => item.parseError)) {
    findings.push(
      createFinding(
        "structured_data.invalid_jsonld",
        snapshot,
        [`$.pages[${pageIndex}].evidence.structuredData`],
        pageIndex,
        "Invalid JSON-LD cannot be parsed reliably for structured data eligibility.",
      ),
    );
  }

  for (const issue of validateStructuredData(evidence.structuredData || [])) {
    findings.push(
      createFinding(
        "structured_data.required_property_missing",
        snapshot,
        [`$.pages[${pageIndex}].evidence.structuredData[${issue.blockIndex}]`],
        pageIndex,
        `${issue.type} structured data is missing required properties: ${issue.missing.join(", ")}.`,
      ),
    );
  }

  if (visibleTextCharacters > 0 && visibleTextCharacters < 300) {
    findings.push(
      createFinding(
        "content.thin_content",
        snapshot,
        [`$.pages[${pageIndex}].evidence.counts.visibleTextCharacters`],
        pageIndex,
        "Thin pages are less likely to satisfy visitor tasks or support AI/search answerability.",
      ),
    );
  }

  if (visibleTextCharacters >= 500 && (evidence.headings || []).length < 2) {
    findings.push(
      createFinding(
        "content.answerability_gap",
        snapshot,
        [`$.pages[${pageIndex}].evidence.headings`, `$.pages[${pageIndex}].evidence.counts.visibleTextCharacters`],
        pageIndex,
        "Substantial pages need clear answerable sections to support users and generative search features.",
      ),
    );
  }

  if (
    isHomepageLike(snapshot) &&
    !hasStructuredDataType(evidence, "Organization") &&
    !hasStructuredDataType(evidence, "LocalBusiness")
  ) {
    findings.push(
      createFinding(
        "structured_data.organization_missing",
        snapshot,
        [`$.pages[${pageIndex}].evidence.structuredData`],
        pageIndex,
        "Homepage-like pages should make organization identity clear where visible content supports it.",
      ),
    );
  }

  if (isHomepageLike(snapshot) && !hasAboutOrContactLink(evidence)) {
    findings.push(
      createFinding(
        "entity.about_contact_missing",
        snapshot,
        [`$.pages[${pageIndex}].evidence.links`],
        pageIndex,
        "Homepage-like pages should expose crawlable about or contact paths for entity trust signals.",
      ),
    );
  }

  return findings;
};

export const scoreFindings = (findings) => {
  const scores = {};

  for (const finding of findings) {
    const score = scores[finding.dimension] || {
      score: 100,
      findings: [],
      p0: 0,
      p1: 0,
      p2: 0,
      p3: 0,
    };

    score.findings.push(finding.ruleId);
    score[finding.severity.toLowerCase()] += 1;
    score.score = Math.max(0, score.score - severityImpact[finding.severity]);
    scores[finding.dimension] = score;
  }

  return scores;
};
