import test from "node:test";
import assert from "node:assert/strict";
import { rules, getRule } from "../src/rules.mjs";

test("defines at least 25 initial deterministic rule IDs", () => {
  assert.ok(rules.length >= 25);
  assert.equal(new Set(rules.map((rule) => rule.id)).size, rules.length);
});

test("each rule has required metadata", () => {
  for (const rule of rules) {
    assert.match(rule.id, /^[a-z]+[a-z0-9_]*\.[a-z0-9_]+$/);
    assert.ok(rule.title);
    assert.ok(rule.dimension);
    assert.ok(["P0", "P1", "P2", "P3"].includes(rule.defaultSeverity));
    assert.ok(rule.recommendation);
    assert.ok(Array.isArray(rule.sources));
    assert.ok(rule.sources.length > 0);
  }
});

test("retrieves a rule by ID", () => {
  const rule = getRule("indexability.noindex");
  assert.equal(rule.id, "indexability.noindex");
});
