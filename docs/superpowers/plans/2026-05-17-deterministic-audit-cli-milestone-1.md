# Deterministic GEO/SEO Audit CLI Milestone 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the package, schema, rule taxonomy, and skill-wrapper foundation for the deterministic GEO/SEO audit CLI.

**Architecture:** Keep the existing skill package intact while adding a focused `packages/cli` Node ESM CLI package. The CLI exposes deterministic commands for version, config validation, rule explanation, and schema inspection; later milestones add crawling, snapshots, rules, and reports. The skill wrapper is updated to call the CLI and consume structured evidence instead of relying on ad hoc manual inspection.

**Tech Stack:** Node.js 20+, ESM modules, built-in `node:test`, JSON Schema-style schema objects, no runtime dependencies in Milestone 1.

---

## Scope

This plan implements PRD Milestone 1 only:

- Self-contained skill wrapper references.
- CLI package scaffold.
- Audit config schema.
- Audit output schema.
- Initial rule taxonomy with at least 25 rule IDs.
- Compact source citation map.
- README and validation updates.

Later plans will implement crawling, rendering, deterministic audit rules, GEO heuristics, reporting, and optional ranking evidence integrations.

## Files

- Modify: `package.json`
- Modify: `README.md`
- Modify: `scripts/validate-skill.mjs`
- Modify: `skill/geo-seo-audit/SKILL.md`
- Create: `packages/cli/package.json`
- Create: `packages/cli/src/index.mjs`
- Create: `packages/cli/src/cli.mjs`
- Create: `packages/cli/src/config-schema.mjs`
- Create: `packages/cli/src/audit-output-schema.mjs`
- Create: `packages/cli/src/rules.mjs`
- Create: `packages/cli/test/cli.test.mjs`
- Create: `packages/cli/test/config-schema.test.mjs`
- Create: `packages/cli/test/rules.test.mjs`
- Create: `skill/geo-seo-audit/source-map.json`
- Create: `examples/audit.config.json`

## Task 1: Add Failing CLI Contract Tests

**Files:**
- Create: `packages/cli/test/cli.test.mjs`
- Create: `packages/cli/test/config-schema.test.mjs`
- Create: `packages/cli/test/rules.test.mjs`

- [ ] **Step 1: Write failing CLI behavior tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { runCli } from "../src/cli.mjs";

const capture = async (args) => {
  const writes = [];
  const errors = [];
  const exitCode = await runCli(args, {
    stdout: { write: (value) => writes.push(String(value)) },
    stderr: { write: (value) => errors.push(String(value)) },
  });
  return { exitCode, stdout: writes.join(""), stderr: errors.join("") };
};

test("prints version", async () => {
  const result = await capture(["--version"]);
  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /openclaw-geo-seo-audit/);
});

test("prints help", async () => {
  const result = await capture(["--help"]);
  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /validate-config/);
  assert.match(result.stdout, /explain-rule/);
});

test("explains a known rule as JSON", async () => {
  const result = await capture(["explain-rule", "indexability.noindex"]);
  assert.equal(result.exitCode, 0);
  const body = JSON.parse(result.stdout);
  assert.equal(body.id, "indexability.noindex");
  assert.equal(body.dimension, "crawl_index");
  assert.ok(body.sources.length > 0);
});

test("returns a non-zero exit for unknown commands", async () => {
  const result = await capture(["unknown-command"]);
  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /Unknown command/);
});
```

- [ ] **Step 2: Write failing config validation tests**

```js
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
```

- [ ] **Step 3: Write failing rule taxonomy tests**

```js
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
```

- [ ] **Step 4: Run tests to verify they fail**

Run:

```bash
npm test --workspace packages/cli
```

Expected: failure because `packages/cli` and source modules do not exist yet.

## Task 2: Implement CLI Package Scaffold

**Files:**
- Create: `packages/cli/package.json`
- Create: `packages/cli/src/index.mjs`
- Create: `packages/cli/src/cli.mjs`
- Modify: `package.json`

- [ ] **Step 1: Add CLI package metadata**

Create `packages/cli/package.json`:

```json
{
  "name": "openclaw-geo-seo-audit",
  "version": "0.2.0",
  "private": false,
  "type": "module",
  "bin": {
    "openclaw-geo-seo-audit": "./src/index.mjs"
  },
  "scripts": {
    "test": "node --test test/*.test.mjs"
  },
  "engines": {
    "node": ">=20"
  }
}
```

- [ ] **Step 2: Add workspace scripts to root package**

Modify root `package.json` so it includes:

```json
{
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "crawl:google": "node scripts/crawl-google-corpus.mjs",
    "snapshot": "node scripts/collect-page-snapshot.mjs",
    "validate": "node scripts/validate-skill.mjs",
    "test": "node --test packages/cli/test/*.test.mjs",
    "cli": "node packages/cli/src/index.mjs"
  }
}
```

- [ ] **Step 3: Add CLI entrypoint**

Create `packages/cli/src/index.mjs`:

```js
#!/usr/bin/env node
import { runCli } from "./cli.mjs";

const exitCode = await runCli(process.argv.slice(2), {
  stdout: process.stdout,
  stderr: process.stderr,
});

process.exitCode = exitCode;
```

- [ ] **Step 4: Add minimal command router**

Create `packages/cli/src/cli.mjs` with `runCli(args, io)` supporting `--version`, `--help`, `validate-config`, and `explain-rule`.

- [ ] **Step 5: Run CLI behavior tests**

Run:

```bash
npm test --workspace packages/cli
```

Expected: CLI behavior tests still fail until config and rule modules exist.

## Task 3: Implement Config Schema and Audit Output Schema

**Files:**
- Create: `packages/cli/src/config-schema.mjs`
- Create: `packages/cli/src/audit-output-schema.mjs`
- Create: `examples/audit.config.json`

- [ ] **Step 1: Add config schema and validator**

Create `packages/cli/src/config-schema.mjs` exporting:

- `auditConfigSchema`
- `validateAuditConfig(config)`
- `readAuditConfig(filePath)`

Validation must enforce:

- `target` is required.
- `target` must be a URL, local path, or localhost URL string.
- `crawl.mode`, when present, is one of `full`, `sample`, or `single`.
- `crawl.maxPages`, when present, is a positive integer.
- `crawl.maxDepth`, when present, is a non-negative integer.
- `render.mode`, when present, is one of `auto`, `always`, or `never`.
- include/exclude lists, when present, are arrays of valid regex strings.

- [ ] **Step 2: Add audit output schema**

Create `packages/cli/src/audit-output-schema.mjs` exporting `auditOutputSchema` with top-level required keys:

- `schemaVersion`
- `toolVersion`
- `run`
- `site`
- `pages`
- `integrations`
- `scores`
- `findings`
- `evidenceGaps`
- `sources`

- [ ] **Step 3: Add example config**

Create `examples/audit.config.json` using the example from the PRD with `target`, `brand`, `audience`, `targetQueries`, `crawl`, and `render`.

- [ ] **Step 4: Wire validate-config command**

Update `packages/cli/src/cli.mjs` so:

```bash
openclaw-geo-seo-audit validate-config examples/audit.config.json
```

prints JSON:

```json
{
  "ok": true,
  "errors": []
}
```

- [ ] **Step 5: Run config tests**

Run:

```bash
npm test --workspace packages/cli
```

Expected: config tests pass; rule tests still fail until Task 4.

## Task 4: Implement Rule Taxonomy and Source Map

**Files:**
- Create: `packages/cli/src/rules.mjs`
- Create: `skill/geo-seo-audit/source-map.json`

- [ ] **Step 1: Add compact source citation map**

Create `skill/geo-seo-audit/source-map.json` with canonical Google Search Central source IDs such as:

```json
{
  "search_essentials": "https://developers.google.com/search/docs/essentials",
  "technical_requirements": "https://developers.google.com/search/docs/essentials/technical",
  "robots_meta": "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag",
  "robots_txt": "https://developers.google.com/search/docs/crawling-indexing/robots/intro",
  "canonicalization": "https://developers.google.com/search/docs/crawling-indexing/canonicalization",
  "sitemaps": "https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview",
  "javascript_seo": "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics",
  "helpful_content": "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
  "ai_optimization": "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
  "structured_data_intro": "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
  "structured_data_policies": "https://developers.google.com/search/docs/appearance/structured-data/sd-policies",
  "title_links": "https://developers.google.com/search/docs/appearance/title-link",
  "snippets": "https://developers.google.com/search/docs/appearance/snippet",
  "google_images": "https://developers.google.com/search/docs/appearance/google-images",
  "site_names": "https://developers.google.com/search/docs/appearance/site-names",
  "spam_policies": "https://developers.google.com/search/docs/essentials/spam-policies"
}
```

- [ ] **Step 2: Add initial rule definitions**

Create `packages/cli/src/rules.mjs` exporting `rules` and `getRule(id)` with at least these IDs:

- `technical.http_error`
- `technical.redirect_chain`
- `technical.https_missing`
- `technical.rendered_content_missing`
- `technical.raw_rendered_mismatch`
- `crawl.robots_blocked`
- `crawl.sitemap_missing`
- `crawl.broken_internal_link`
- `indexability.noindex`
- `indexability.x_robots_noindex`
- `indexability.canonical_missing`
- `indexability.canonical_target_error`
- `indexability.noindex_canonical_conflict`
- `indexability.noncanonical_in_sitemap`
- `appearance.title_missing`
- `appearance.title_duplicate`
- `appearance.meta_description_missing`
- `appearance.h1_missing`
- `appearance.image_alt_missing`
- `appearance.favicon_missing`
- `structured_data.invalid_jsonld`
- `structured_data.visible_content_mismatch`
- `structured_data.organization_missing`
- `content.thin_content`
- `content.answerability_gap`
- `entity.about_contact_missing`
- `geo.entity_clarity_gap`
- `policy.hidden_text_risk`
- `policy.duplicate_content_cluster`

- [ ] **Step 3: Wire explain-rule command**

Update `packages/cli/src/cli.mjs` so `explain-rule <id>` prints the full rule as JSON and unknown rules return exit code `1`.

- [ ] **Step 4: Run rule tests**

Run:

```bash
npm test --workspace packages/cli
```

Expected: all CLI package tests pass.

## Task 5: Update Skill Wrapper and README

**Files:**
- Modify: `skill/geo-seo-audit/SKILL.md`
- Modify: `README.md`

- [ ] **Step 1: Update skill workflow**

Revise `skill/geo-seo-audit/SKILL.md` so it states:

- Run `openclaw-geo-seo-audit audit <target>` when available.
- Use CLI JSON as the default evidence source.
- Do not invent findings not present in CLI JSON or supplied exports.
- Use `source-map.json` and `references/audit-framework.md` for citations.
- Clearly separate readiness from ranking measurement.

- [ ] **Step 2: Update README**

Revise `README.md` so it explains:

- The repo is evolving into a deterministic CLI plus skill wrapper.
- v1 readiness audits do not claim measured rankings without integrations.
- CLI commands include `--help`, `validate-config`, and `explain-rule`.
- The skill folder must be paired with the CLI or installed from the full package.

- [ ] **Step 3: Run tests and validation**

Run:

```bash
npm test
npm run validate
```

Expected: both commands exit `0`.

## Task 6: Strengthen Validation

**Files:**
- Modify: `scripts/validate-skill.mjs`

- [ ] **Step 1: Add required file checks**

Update `requiredFiles` to include:

- `docs/prd-deterministic-audit-cli.md`
- `packages/cli/package.json`
- `packages/cli/src/index.mjs`
- `packages/cli/src/cli.mjs`
- `packages/cli/src/config-schema.mjs`
- `packages/cli/src/audit-output-schema.mjs`
- `packages/cli/src/rules.mjs`
- `skill/geo-seo-audit/source-map.json`
- `examples/audit.config.json`

- [ ] **Step 2: Validate rule count**

Import or parse `packages/cli/src/rules.mjs` and fail validation if fewer than 25 rules exist.

- [ ] **Step 3: Validate source map**

Parse `skill/geo-seo-audit/source-map.json` and fail validation if it lacks `ai_optimization`, `robots_meta`, `structured_data_intro`, and `helpful_content`.

- [ ] **Step 4: Run final verification**

Run:

```bash
npm test
npm run validate
git status --short
```

Expected:

- `npm test` exits `0`.
- `npm run validate` exits `0`.
- `git status --short` shows only intentional changes for Milestone 1.

## Self-Review

Spec coverage:

- PRD Milestone 1 package structure is covered by Tasks 2 and 6.
- Config schema is covered by Task 3.
- Audit output schema is covered by Task 3.
- Rule taxonomy is covered by Task 4.
- Compact source citation map is covered by Task 4.
- Skill wrapper and README updates are covered by Task 5.
- Validation coverage is covered by Task 6.

Known gaps intentionally deferred:

- Crawling, rendering, snapshots, deterministic audit execution, reporting, and ranking integrations are PRD Milestones 2-6 and require separate plans.

Placeholder scan:

- No implementation step uses TBD, TODO, or undefined hand-waving as acceptance criteria.

Type consistency:

- CLI entrypoint is `runCli(args, io)`.
- Config validator is `validateAuditConfig(config)`.
- Rule API is `rules` and `getRule(id)`.
