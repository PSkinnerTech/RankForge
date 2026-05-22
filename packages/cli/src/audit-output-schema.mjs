export const auditOutputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://rankforge.dev/schemas/rankforge-output.schema.json",
  title: "RankForge Output",
  type: "object",
  required: [
    "schemaVersion",
    "toolVersion",
    "run",
    "site",
    "pages",
    "integrations",
    "scores",
    "findings",
    "evidenceGaps",
    "sources",
  ],
  additionalProperties: true,
  properties: {
    schemaVersion: { type: "string" },
    toolVersion: { type: "string" },
    run: { type: "object" },
    site: { type: "object" },
    pages: { type: "array" },
    integrations: { type: "object" },
    scores: { type: "object" },
    findings: { type: "array" },
    evidenceGaps: { type: "array" },
    sources: { type: "array" },
    repo: { type: "object" },
  },
};

const requiredTopLevelFields = [
  "schemaVersion",
  "toolVersion",
  "run",
  "site",
  "pages",
  "integrations",
  "scores",
  "findings",
  "evidenceGaps",
  "sources",
];

const requiredFindingFields = [
  "ruleId",
  "title",
  "severity",
  "dimension",
  "affectedUrls",
  "evidence",
  "impact",
  "recommendation",
  "owner",
  "effort",
  "confidence",
  "sources",
];

export const validateAuditOutput = (audit) => {
  const errors = [];

  if (!audit || typeof audit !== "object" || Array.isArray(audit)) {
    return { ok: false, errors: ["audit output must be an object"] };
  }

  for (const field of requiredTopLevelFields) {
    if (!(field in audit)) errors.push(`${field} is required`);
  }

  if ("pages" in audit && !Array.isArray(audit.pages)) errors.push("pages must be an array");
  if ("repo" in audit && (!audit.repo || typeof audit.repo !== "object" || Array.isArray(audit.repo))) {
    errors.push("repo must be an object");
  }
  if ("findings" in audit && !Array.isArray(audit.findings)) {
    errors.push("findings must be an array");
  } else {
    for (const [index, finding] of (audit.findings || []).entries()) {
      for (const field of requiredFindingFields) {
        if (!(field in finding)) errors.push(`findings[${index}].${field} is required`);
      }
    }
  }

  return { ok: errors.length === 0, errors };
};
