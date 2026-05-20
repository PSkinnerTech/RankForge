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

test("defines render parity rule metadata", () => {
  const expected = {
    "technical.rendered_title_changed": "P2",
    "technical.rendered_description_changed": "P3",
    "technical.rendered_canonical_changed": "P1",
    "technical.rendered_primary_heading_missing": "P1",
    "technical.rendered_structured_data_lost": "P2",
    "technical.rendered_content_missing": "P1",
    "technical.raw_rendered_mismatch": "P2",
  };

  for (const [ruleId, severity] of Object.entries(expected)) {
    const item = getRule(ruleId);
    assert.ok(item, `${ruleId} is registered`);
    assert.equal(item.dimension, "technical");
    assert.equal(item.defaultSeverity, severity);
    assert.ok(item.recommendation);
    assert.ok(item.sources.length > 0);
  }
});
