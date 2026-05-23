import test from "node:test";
import assert from "node:assert/strict";
import { validateAuditOutput } from "../src/audit-output-schema.mjs";

test("accepts minimal valid audit output", () => {
  const result = validateAuditOutput({
    schemaVersion: "1.0.0",
    toolVersion: "0.3.0",
    run: {},
    site: {},
    pages: [],
    integrations: {},
    scores: {},
    findings: [],
    evidenceGaps: [],
    sources: [],
  });
  assert.deepEqual(result, { ok: true, errors: [] });
});

test("rejects missing top-level audit output fields", () => {
  const result = validateAuditOutput({ schemaVersion: "1.0.0", findings: [] });
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /toolVersion is required/);
  assert.match(result.errors.join("\n"), /pages is required/);
});

test("rejects findings missing required fields", () => {
  const result = validateAuditOutput({
    schemaVersion: "1.0.0",
    toolVersion: "0.3.0",
    run: {},
    site: {},
    pages: [],
    integrations: {},
    scores: {},
    findings: [{ ruleId: "indexability.noindex" }],
    evidenceGaps: [],
    sources: [],
  });
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /findings\[0\]\.severity is required/);
});

test("accepts optional repo evidence section", () => {
  const audit = {
    schemaVersion: "1.0.0",
    toolVersion: "0.3.0",
    run: {},
    site: {},
    pages: [],
    integrations: {},
    scores: {},
    findings: [],
    evidenceGaps: [],
    sources: [],
    repo: {
      path: "/repo",
      detectedFramework: "generic-static",
      sourceFindings: [],
    },
  };

  assert.deepEqual(validateAuditOutput(audit), { ok: true, errors: [] });
});

test("accepts optional repo source finding guidance fields", () => {
  const audit = {
    schemaVersion: "1.0.0",
    toolVersion: "0.3.0",
    run: {},
    site: {},
    pages: [],
    integrations: {},
    scores: {},
    findings: [],
    evidenceGaps: [],
    sources: [],
    repo: {
      path: "/repo",
      detectedFramework: "vite",
      sourceFindings: [
        {
          id: "repo.static_dir_missing",
          severity: "P1",
          message: "Configured static output directory does not exist or is not a directory.",
          evidence: "dist",
          recommendation: "Run the repository build or pass an existing static output directory.",
          confidence: "high",
          inspectNext: ["configured static output directory", "build command", "audit.config.json"],
          developerAction: "Run the explicit build command and confirm the configured static directory exists.",
          acceptanceCriteria: ["Rerun RankForge and confirm repo.static_dir_missing is absent."],
        },
      ],
    },
  };

  assert.deepEqual(validateAuditOutput(audit), { ok: true, errors: [] });
});

test("rejects optional repo evidence section when it is not an object", () => {
  const result = validateAuditOutput({
    schemaVersion: "1.0.0",
    toolVersion: "0.3.0",
    run: {},
    site: {},
    pages: [],
    integrations: {},
    scores: {},
    findings: [],
    evidenceGaps: [],
    sources: [],
    repo: [],
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /repo must be an object/);
});
