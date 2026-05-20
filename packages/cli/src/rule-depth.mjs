import { cleanText } from "./html-extract.mjs";
import { structuredDataNodes, structuredDataTypeNames } from "./structured-data.mjs";
import { normalizeUrl } from "./url-utils.mjs";

const noindexPattern = /(?:^|,|\s)noindex(?:,|\s|$)/i;
const entitySchemaTypes = new Set(["Organization", "LocalBusiness", "Person", "Product", "Article"]);
const supportedStructuredDataFields = {
  Organization: "name",
  LocalBusiness: "name",
  Product: "name",
  Article: "headline",
};
const stopwords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "by",
  "for",
  "from",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

const evidencePath = (pageIndex, path) => `$.pages[${pageIndex}].evidence.${path}`;

const normalizeText = (value) =>
  cleanText(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokensFor = (value) =>
  normalizeText(value)
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopwords.has(token));

const isNoindexed = (evidence = {}) => noindexPattern.test(evidence.robots || "");

const isSuccessfulPage = (page) => !Number.isInteger(page.status) || page.status < 400;

const sameCanonical = (page) => {
  const canonical = page.evidence?.canonical;
  if (!canonical) return true;
  try {
    return normalizeUrl(canonical) === normalizeUrl(page.finalUrl);
  } catch {
    return canonical === page.finalUrl;
  }
};

const visibleContentSurface = (evidence = {}) =>
  normalizeText([
    evidence.title,
    evidence.description,
    evidence.siteName,
    ...(Array.isArray(evidence.h1) ? evidence.h1 : []),
    ...(Array.isArray(evidence.headings) ? evidence.headings.map((heading) => heading.text) : []),
    evidence.visibleTextPreview,
  ].filter(Boolean).join(" "));

const valueAppearsInSurface = (value, surface) => {
  const normalizedValue = normalizeText(value);
  if (normalizedValue.length < 4) return true;
  const paddedSurface = ` ${surface} `;
  if (paddedSurface.includes(` ${normalizedValue} `)) return true;

  const tokens = tokensFor(normalizedValue);
  if (tokens.length === 0) return true;
  const surfaceTokens = new Set(tokensFor(surface));
  const matched = tokens.filter((token) => surfaceTokens.has(token)).length;
  if (tokens.length === 1) return matched === 1;
  return matched >= Math.max(2, Math.ceil(tokens.length * 0.5));
};

export const contentFingerprint = (value) => {
  const normalized = normalizeText(value);
  return normalized.length >= 500 ? normalized : "";
};

const pageContentForFingerprint = (evidence = {}) => {
  let text = ` ${normalizeText(evidence.visibleTextPreview || "")} `;
  const labels = [
    evidence.title,
    ...(Array.isArray(evidence.h1) ? evidence.h1 : []),
  ].map(normalizeText).filter((label) => label.length > 2);

  for (const label of labels) {
    text = text.split(` ${label} `).join(" ");
  }

  return text.replace(/\s+/g, " ").trim();
};

export const structuredDataVisibleContentFacts = (page, pageIndex = 0) => {
  const evidence = page.evidence || {};
  const surface = visibleContentSurface(evidence);
  const facts = [];

  for (const [blockIndex, block] of (evidence.structuredData || []).entries()) {
    if (!block?.data || block.parseError) continue;

    for (const node of structuredDataNodes(block.data)) {
      for (const type of structuredDataTypeNames(node["@type"])) {
        const property = supportedStructuredDataFields[type];
        if (!property) continue;

        const value = node[property];
        if (Array.isArray(value) || typeof value === "object") continue;
        const cleaned = cleanText(value);
        if (cleaned.length < 4 || valueAppearsInSurface(cleaned, surface)) continue;

        facts.push({
          ruleId: "structured_data.visible_content_mismatch",
          evidence: [
            evidencePath(pageIndex, `structuredData[${blockIndex}]`),
            evidencePath(pageIndex, "visibleTextPreview"),
            evidencePath(pageIndex, "title"),
            evidencePath(pageIndex, "h1"),
            evidencePath(pageIndex, "headings"),
          ],
          impact: `${type} structured data names "${cleaned}", but that value is not visible in page evidence.`,
        });
      }
    }
  }

  return facts;
};

const hasAboutOrContactLink = (evidence = {}) =>
  (evidence.links || []).some((link) => {
    const haystack = `${link.href || ""} ${link.text || ""}`.toLowerCase();
    return haystack.includes("about") || haystack.includes("contact");
  });

const entitySignalCount = (evidence = {}) => {
  let count = 0;
  if (cleanText(evidence.siteName)) count += 1;
  if ((evidence.schemaTypes || []).some((type) => entitySchemaTypes.has(type))) count += 1;
  if (hasAboutOrContactLink(evidence)) count += 1;
  if ((evidence.entitySignals?.authors || []).length > 0) count += 1;
  if ((evidence.entitySignals?.dates || []).length > 0) count += 1;
  return count;
};

export const entityClarityFacts = (page, pageIndex = 0) => {
  const evidence = page.evidence || {};
  const visibleTextCharacters = evidence.counts?.visibleTextCharacters || 0;
  const hasPurposeSignal = cleanText(evidence.title) || (evidence.h1 || []).some((item) => cleanText(item));

  if (!isSuccessfulPage(page) || isNoindexed(evidence) || visibleTextCharacters < 800 || !hasPurposeSignal) return [];
  const signalCount = entitySignalCount(evidence);
  if (signalCount > 1) return [];

  return [{
    ruleId: "geo.entity_clarity_gap",
    evidence: [
      evidencePath(pageIndex, "siteName"),
      evidencePath(pageIndex, "schemaTypes"),
      evidencePath(pageIndex, "links"),
      evidencePath(pageIndex, "entitySignals"),
      evidencePath(pageIndex, "counts.visibleTextCharacters"),
    ],
    impact: `Substantial page content has only ${signalCount} deterministic entity signal(s).`,
  }];
};

export const duplicateContentClusterFacts = (pages = []) => {
  const groups = new Map();

  for (const [index, page] of pages.entries()) {
    const evidence = page.evidence || {};
    if (!isSuccessfulPage(page) || isNoindexed(evidence) || !sameCanonical(page)) continue;
    if ((evidence.counts?.visibleTextCharacters || 0) < 600) continue;

    const fingerprint = contentFingerprint(pageContentForFingerprint(evidence));
    if (!fingerprint) continue;

    const group = groups.get(fingerprint) || [];
    group.push({ page, index });
    groups.set(fingerprint, group);
  }

  return [...groups.values()]
    .filter((group) => group.length >= 3)
    .map((group) => ({
      ruleId: "policy.duplicate_content_cluster",
      affectedUrls: group.map(({ page }) => page.finalUrl),
      evidence: group.flatMap(({ index }) => [
        evidencePath(index, "visibleTextPreview"),
        evidencePath(index, "counts.visibleTextCharacters"),
      ]),
      impact: `${group.length} pages share the same substantial normalized visible text preview.`,
    }));
};
