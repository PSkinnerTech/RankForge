import test from "node:test";
import assert from "node:assert/strict";
import { validateAuditOutput } from "../src/audit-output-schema.mjs";

test("accepts minimal valid audit output", () => {
  const result = validateAuditOutput({
    schemaVersion: "1.0.0",
    toolVersion: "0.2.0",
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
    toolVersion: "0.2.0",
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
