import { normalizeUrl } from "./url-utils.mjs";

const pageEvidencePath = (pageIndex, path) => `$.pages[${pageIndex}].evidence.${path}`;
const renderEvidencePath = (pageIndex, path) => `$.pages[${pageIndex}].render.evidence.${path}`;

const cleanText = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

const cleanTextFolded = (value) => cleanText(value).toLowerCase();

const normalizeCanonical = (value) => {
  const cleaned = cleanText(value);
  if (!cleaned) return "";

  try {
    return normalizeUrl(cleaned);
  } catch {
    return cleaned.toLowerCase();
  }
};

const firstNormalized = (values) => {
  if (!Array.isArray(values)) return "";
  return cleanText(values[0]);
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

const validStructuredDataBlocks = (evidence) =>
  (Array.isArray(evidence?.structuredData) ? evidence.structuredData : []).filter((block) => !block?.parseError);

const schemaTypesFor = (evidence) => {
  const explicitTypes = Array.isArray(evidence?.schemaTypes) ? evidence.schemaTypes.map(String) : [];
  const blockTypes = validStructuredDataBlocks(evidence).flatMap((block) => structuredDataTypes(block?.data));
  return [...new Set([...explicitTypes, ...blockTypes].map(cleanText).filter(Boolean))];
};

const visibleTextCharacters = (evidence) => {
  const value = evidence?.counts?.visibleTextCharacters;
  return Number.isFinite(value) ? value : 0;
};

const makeFact = (ruleId, pageIndex, paths, impact) => ({
  ruleId,
  evidence: paths.flatMap((path) => [pageEvidencePath(pageIndex, path), renderEvidencePath(pageIndex, path)]),
  impact,
});

export const renderParityFacts = (snapshot, pageIndex = 0) => {
  if (snapshot?.render?.status !== "rendered" || !snapshot.render.evidence) return [];

  const raw = snapshot.evidence ?? {};
  const rendered = snapshot.render.evidence;
  const facts = [];

  const rawTitle = cleanTextFolded(raw.title);
  const renderedTitle = cleanTextFolded(rendered.title);
  if (rawTitle && renderedTitle && rawTitle !== renderedTitle) {
    facts.push(makeFact(
      "technical.rendered_title_changed",
      pageIndex,
      ["title"],
      "Rendered title differs from the raw HTML title.",
    ));
  }

  const rawDescription = cleanTextFolded(raw.description);
  const renderedDescription = cleanTextFolded(rendered.description);
  if (rawDescription && rawDescription !== renderedDescription) {
    facts.push(makeFact(
      "technical.rendered_description_changed",
      pageIndex,
      ["description"],
      "Rendered description differs from the raw HTML description.",
    ));
  }

  const rawCanonical = normalizeCanonical(raw.canonical);
  const renderedCanonical = normalizeCanonical(rendered.canonical);
  if (rawCanonical && renderedCanonical && rawCanonical !== renderedCanonical) {
    facts.push(makeFact(
      "technical.rendered_canonical_changed",
      pageIndex,
      ["canonical"],
      "Rendered canonical URL differs from the raw HTML canonical URL.",
    ));
  }

  const rawPrimaryHeading = firstNormalized(raw.h1);
  const renderedPrimaryHeading = firstNormalized(rendered.h1);
  if (rawPrimaryHeading && !renderedPrimaryHeading) {
    facts.push(makeFact(
      "technical.rendered_primary_heading_missing",
      pageIndex,
      ["h1"],
      "Rendered page is missing the primary heading found in raw HTML.",
    ));
  }

  const rawValidBlocks = validStructuredDataBlocks(raw);
  const renderedValidBlocks = validStructuredDataBlocks(rendered);
  const rawTypes = schemaTypesFor(raw);
  const renderedTypes = schemaTypesFor(rendered);
  const renderedTypeSet = new Set(renderedTypes);
  const lostTypes = rawTypes.filter((type) => !renderedTypeSet.has(type));
  if (rawValidBlocks.length > renderedValidBlocks.length || lostTypes.length > 0) {
    const lostLabel = lostTypes.length > 0 ? ` Lost schema types: ${lostTypes.join(", ")}.` : "";
    facts.push(makeFact(
      "technical.rendered_structured_data_lost",
      pageIndex,
      ["structuredData"],
      `Rendered page has less valid structured data than the raw HTML.${lostLabel}`,
    ));
  }

  const rawVisibleText = visibleTextCharacters(raw);
  const renderedVisibleText = visibleTextCharacters(rendered);
  if (rawVisibleText >= 300 && renderedVisibleText < 150) {
    facts.push(makeFact(
      "technical.rendered_content_missing",
      pageIndex,
      ["counts.visibleTextCharacters"],
      "Rendered page is missing most visible text found in raw HTML.",
    ));
  } else if (Math.abs(rawVisibleText - renderedVisibleText) > 300) {
    facts.push(makeFact(
      "technical.raw_rendered_mismatch",
      pageIndex,
      ["counts.visibleTextCharacters"],
      "Rendered visible text count differs substantially from raw HTML.",
    ));
  }

  return facts;
};
