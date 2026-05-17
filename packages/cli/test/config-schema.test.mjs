import test from "node:test";
import assert from "node:assert/strict";
import { validateAuditConfig } from "../src/config-schema.mjs";

test("accepts a minimal URL target config", () => {
  const result = validateAuditConfig({ target: "https://example.com" });
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test("rejects missing target", () => {
  const result = validateAuditConfig({});
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /target is required/);
});

test("rejects invalid crawl mode", () => {
  const result = validateAuditConfig({
    target: "https://example.com",
    crawl: { mode: "everything" },
  });
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /crawl.mode/);
});
