import { implementationTaskFor } from "./finding-task.mjs";
import { getRule } from "./rules.mjs";
import { isHttpUrl, normalizeUrl, sameOrigin } from "./url-utils.mjs";

const ownerFor = (dimension) => {
  if (dimension === "crawl_index" || dimension === "technical" || dimension === "structured_data") return "Engineering";
  return "SEO";
};

const effortFor = (severity) => (severity === "P1" ? "M" : "S");

const finding = (ruleId, affectedUrls, evidence, impact) => {
  const rule = getRule(ruleId);
  const owner = ownerFor(rule.dimension);
  const effort = effortFor(rule.defaultSeverity);
  return {
    ruleId: rule.id,
    title: rule.title,
    severity: rule.defaultSeverity,
    dimension: rule.dimension,
    affectedUrls,
    evidence,
    impact,
    recommendation: rule.recommendation,
    implementationTask: implementationTaskFor(rule, owner, effort),
    owner,
    effort,
    confidence: "high",
    sources: rule.sources,
  };
};

const groupBy = (pages, selector) => {
  const groups = new Map();
  for (const [index, page] of pages.entries()) {
    const key = selector(page);
    if (!key) continue;
    const normalized = String(key).trim().toLowerCase();
    if (!normalized) continue;
    const group = groups.get(normalized) || [];
    group.push({ page, index });
    groups.set(normalized, group);
  }
  return [...groups.values()].filter((group) => group.length > 1);
};

const pageMap = (pages) => {
  const map = new Map();
  for (const page of pages) {
    try {
      map.set(normalizeUrl(page.finalUrl), page);
    } catch {
      map.set(page.finalUrl, page);
    }
  }
  return map;
};

const safeNormalize = (value) => {
  try {
    return normalizeUrl(value);
  } catch {
    return value;
  }
};

export const evaluateSite = (pages, context = {}) => {
  const findings = [];
  const byUrl = pageMap(pages);

  for (const group of groupBy(pages, (page) => page.evidence?.title)) {
    findings.push(
      finding(
        "appearance.title_duplicate",
        group.map(({ page }) => page.finalUrl),
        group.map(({ index }) => `$.pages[${index}].evidence.title`),
        "Duplicate titles make it harder to distinguish page purpose in search results.",
      ),
    );
  }

  for (const group of groupBy(pages, (page) => page.evidence?.description)) {
    findings.push(
      finding(
        "appearance.meta_description_duplicate",
        group.map(({ page }) => page.finalUrl),
        group.map(({ index }) => `$.pages[${index}].evidence.description`),
        "Duplicate meta descriptions reduce page-specific snippet clarity.",
      ),
    );
  }

  for (const [index, page] of pages.entries()) {
    if (!isHttpUrl(page.finalUrl)) continue;

    for (const link of page.evidence?.links || []) {
      if (!link.href || !isHttpUrl(link.href) || !sameOrigin(page.finalUrl, link.href)) continue;
      const linked = byUrl.get(safeNormalize(link.href));
      if (linked && Number.isInteger(linked.status) && linked.status >= 400) {
        findings.push(
          finding(
            "crawl.broken_internal_link",
            [page.finalUrl, linked.finalUrl],
            [`$.pages[${index}].evidence.links`, `$.pages[${pages.indexOf(linked)}].status`],
            "Internal links to unavailable pages waste crawl paths and create a poor user experience.",
          ),
        );
      }
    }

    const canonical = page.evidence?.canonical;
    if (canonical) {
      const canonicalPage = byUrl.get(normalizeUrl(canonical));
      if (canonicalPage && Number.isInteger(canonicalPage.status) && canonicalPage.status >= 400) {
        findings.push(
          finding(
            "indexability.canonical_target_error",
            [page.finalUrl, canonicalPage.finalUrl],
            [`$.pages[${index}].evidence.canonical`, `$.pages[${pages.indexOf(canonicalPage)}].status`],
            "Canonical signals should point to successful, indexable preferred URLs.",
          ),
        );
      }

      if (
        context.sitemapUrls?.includes(safeNormalize(page.finalUrl)) &&
        safeNormalize(canonical) !== safeNormalize(page.finalUrl)
      ) {
        findings.push(
          finding(
            "indexability.noncanonical_in_sitemap",
            [page.finalUrl],
            [`$.pages[${index}].evidence.canonical`],
            "Sitemaps should list canonical URLs rather than alternates or duplicates.",
          ),
        );
      }
    }
  }

  return findings;
};
