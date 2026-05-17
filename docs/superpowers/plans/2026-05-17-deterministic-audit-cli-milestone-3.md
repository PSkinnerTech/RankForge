# Deterministic GEO/SEO Audit CLI Milestone 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert snapshot evidence into deterministic findings with rule IDs, severity, evidence paths, recommendations, and citations.

**Architecture:** Add a focused `rule-engine.mjs` that maps page evidence to rule-triggered findings using the taxonomy from `rules.mjs`. Keep rules conservative and deterministic. Update `runAudit` to evaluate collected pages and include scores based on triggered findings.

**Tech Stack:** Node.js 20+, ESM modules, built-in `node:test`, no runtime dependencies.

---

## Scope

This plan implements PRD Milestone 3 for initial deterministic rule evaluation:

- Rule registry already exists from Milestone 1.
- Add page-level deterministic checks.
- Add finding objects with stable rule IDs and source citations.
- Add simple dimension scoring.
- Keep fixture baseline clean for P0/P1 issues.

## Files

- Create: `packages/cli/src/rule-engine.mjs`
- Create: `packages/cli/test/rule-engine.test.mjs`
- Modify: `packages/cli/src/audit.mjs`
- Modify: `scripts/validate-skill.mjs`

## Task 1: Add Failing Rule Engine Tests

- [ ] **Step 1: Write rule engine tests**

Create `packages/cli/test/rule-engine.test.mjs` asserting:

- A noindex page triggers `indexability.noindex`.
- A missing title triggers `appearance.title_missing`.
- A missing meta description triggers `appearance.meta_description_missing`.
- A missing H1 triggers `appearance.h1_missing`.
- Invalid JSON-LD triggers `structured_data.invalid_jsonld`.
- Missing image alt triggers `appearance.image_alt_missing`.
- Thin visible text triggers `content.thin_content`.
- Findings include severity, dimension, affected URLs, evidence paths, recommendation, confidence, and sources.

- [ ] **Step 2: Extend audit test**

Modify `packages/cli/test/audit.test.mjs` to create a temporary bad HTML file, run `runAudit`, and assert its findings include deterministic rule IDs.

- [ ] **Step 3: Run tests to verify they fail**

Run:

```bash
npm test
```

Expected: new rule engine tests fail because `rule-engine.mjs` does not exist and audit still emits empty findings.

## Task 2: Implement Rule Engine

- [ ] **Step 1: Create `rule-engine.mjs`**

Export:

- `evaluatePage(snapshot, pageIndex = 0)`
- `scoreFindings(findings)`

Initial checks:

- `technical.http_error`
- `technical.https_missing`
- `indexability.noindex`
- `indexability.x_robots_noindex`
- `appearance.title_missing`
- `appearance.meta_description_missing`
- `appearance.h1_missing`
- `appearance.image_alt_missing`
- `structured_data.invalid_jsonld`
- `content.thin_content`

- [ ] **Step 2: Finding shape**

Every finding must include:

- `ruleId`
- `title`
- `severity`
- `dimension`
- `affectedUrls`
- `evidence`
- `impact`
- `recommendation`
- `owner`
- `effort`
- `confidence`
- `sources`

- [ ] **Step 3: Run tests**

Run:

```bash
npm test
```

Expected: rule engine tests pass; audit test still fails until `runAudit` uses the engine.

## Task 3: Wire Rule Engine Into Audit Output

- [ ] **Step 1: Update `audit.mjs`**

Run `evaluatePage` for each page and include flattened findings in the audit JSON.

- [ ] **Step 2: Add scores**

Use `scoreFindings(findings)` to produce simple dimension scores with:

- `score`
- `findings`
- `p0`
- `p1`
- `p2`
- `p3`

- [ ] **Step 3: Run verification**

Run:

```bash
npm test
npm run validate
npm run cli -- audit examples/fixture-site/index.html
```

Expected:

- Tests pass.
- Validation passes.
- Fixture audit has no P0/P1 findings.

## Self-Review

Spec coverage:

- PRD Milestone 3 rule registry use is covered.
- Severity model is covered.
- Evidence paths and citations are covered.
- Technical, indexability, appearance, structured data, and content rules are represented.
- Full canonical, sitemap, duplicate, and rich result validation remain future work.

Placeholder scan:

- No placeholder implementation steps remain.

Type consistency:

- Rule engine exports are `evaluatePage(snapshot, pageIndex = 0)` and `scoreFindings(findings)`.
