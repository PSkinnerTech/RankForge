# Deterministic GEO/SEO Audit CLI Milestone 4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add initial GEO/entity readiness heuristics and Markdown report generation.

**Architecture:** Extend the deterministic rule engine with conservative homepage/entity/content checks. Add a pure `report.mjs` generator that converts audit JSON into a concise Markdown audit report. Update the CLI `audit` command to optionally write Markdown with `--markdown`.

**Tech Stack:** Node.js 20+, ESM modules, built-in `node:test`, no runtime dependencies.

---

## Scope

This plan adds:

- `content.answerability_gap`
- `structured_data.organization_missing`
- `entity.about_contact_missing`
- Markdown report generation
- CLI `audit --markdown <file>` support

It does not add LLM-generated prose, Search Console/SERP integrations, browser rendering, or full schema.org validation.

## Files

- Modify: `packages/cli/src/rule-engine.mjs`
- Modify: `packages/cli/test/rule-engine.test.mjs`
- Create: `packages/cli/src/report.mjs`
- Create: `packages/cli/test/report.test.mjs`
- Modify: `packages/cli/src/cli.mjs`
- Modify: `README.md`
- Modify: `skill/rankforge/SKILL.md`
- Modify: `scripts/validate-skill.mjs`

## Task 1: Add Failing GEO and Report Tests

- [ ] **Step 1: Extend rule engine tests**

Add a test showing a homepage-like page with substantial text but no answer sections, no Organization schema, and no about/contact links triggers:

- `content.answerability_gap`
- `structured_data.organization_missing`
- `entity.about_contact_missing`

- [ ] **Step 2: Add report tests**

Create `packages/cli/test/report.test.mjs` asserting `generateMarkdownReport(audit)` includes:

- `# RankForge GEO/SEO Audit Report`
- target URL/path
- priority findings table
- finding rule IDs
- evidence gaps
- source URLs

- [ ] **Step 3: Run tests to verify failure**

Run:

```bash
npm test
```

Expected: GEO readiness test fails until rule engine is extended; report test fails until `report.mjs` exists.

## Task 2: Implement GEO/Entity Readiness Rules

- [ ] **Step 1: Add helper checks**

In `rule-engine.mjs`, add helpers for:

- Homepage-like URL or file.
- structured data type detection, including arrays and `@graph`.
- about/contact link detection.

- [ ] **Step 2: Add findings**

Trigger:

- `content.answerability_gap` when visible text is substantial but the page lacks enough section structure.
- `structured_data.organization_missing` on homepage-like pages without Organization structured data.
- `entity.about_contact_missing` on homepage-like pages without about/contact links.

- [ ] **Step 3: Run tests**

Run:

```bash
npm test
```

Expected: rule engine tests pass; report test still fails until report generator exists.

## Task 3: Add Markdown Report Generator

- [ ] **Step 1: Create `report.mjs`**

Export `generateMarkdownReport(audit)` with sections:

- Executive Summary
- Priority Findings
- Scores
- Evidence Gaps
- Sources

- [ ] **Step 2: Wire CLI `--markdown`**

Update `cli.mjs` so `audit <target> --markdown report.md` writes Markdown. If both `--out` and `--markdown` are supplied, write both and print success JSON.

- [ ] **Step 3: Update README and skill wording**

Update docs so the audit command is no longer described as future-only and the skill can ask for Markdown output.

- [ ] **Step 4: Run verification**

Run:

```bash
npm test
npm run validate
npm run cli -- audit examples/fixture-site/index.html --markdown /tmp/rankforge-example-audit.md
```

Expected:

- Tests pass.
- Validation passes.
- Markdown report file is written.

## Self-Review

Spec coverage:

- Initial GEO readiness and entity checks are covered.
- Report generation is covered.
- Full redesign brief generation remains the skill wrapper's responsibility.

Placeholder scan:

- No placeholders.

Type consistency:

- Report API is `generateMarkdownReport(audit)`.
