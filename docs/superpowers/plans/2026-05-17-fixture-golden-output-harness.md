# Fixture Golden Output Harness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add fixture-site and golden-output regression coverage so deterministic audit behavior is protected before more rule expansion.

**Architecture:** Add a multi-page fixture site under `examples/fixture-sites/known-issues/`, a test-only golden normalizer under `packages/cli/test/helpers/`, and golden JSON/Markdown files under `examples/golden/`. The test runs the real audit against a local HTTP server, normalizes dynamic values such as host, timestamps, hashes, and config hash, then compares the stable summary and Markdown report against committed golden files.

**Tech Stack:** Node.js 20+, ESM modules, built-in `node:test`, local HTTP server fixtures, no runtime dependencies.

---

## Files

- Create: `packages/cli/test/golden-fixtures.test.mjs`
- Create: `packages/cli/test/helpers/golden.mjs`
- Create: `examples/fixture-sites/known-issues/index.html`
- Create: `examples/fixture-sites/known-issues/about.html`
- Create: `examples/fixture-sites/known-issues/contact.html`
- Create: `examples/fixture-sites/known-issues/product.html`
- Create: `examples/fixture-sites/known-issues/duplicate-a.html`
- Create: `examples/fixture-sites/known-issues/duplicate-b.html`
- Create: `examples/fixture-sites/known-issues/thin.html`
- Create: `examples/fixture-sites/known-issues/bad-json.html`
- Create: `examples/fixture-sites/known-issues/canonical-alt.html`
- Create: `examples/fixture-sites/known-issues/robots.txt`
- Create: `examples/fixture-sites/known-issues/sitemap.xml`
- Create: `examples/golden/known-issues-summary.json`
- Create: `examples/golden/known-issues-report.md`
- Modify: `scripts/validate-skill.mjs`
- Modify: `README.md`

## Tasks

### Task 1: RED Golden Fixture Test

- [x] Add a test that serves `examples/fixture-sites/known-issues` through a local HTTP server.
- [x] Run `runAudit` with full crawl, sitemap, and robots enforcement.
- [x] Normalize dynamic audit output and Markdown.
- [x] Compare to `examples/golden/known-issues-summary.json` and `examples/golden/known-issues-report.md`.
- [x] Run `npm test` and verify failure because helper/fixtures/goldens are missing.

### Task 2: Fixture Site and Golden Normalizer

- [x] Add the known-issues fixture site with deterministic pages covering healthy homepage, Product schema gap, duplicate metadata, thin content, invalid JSON-LD, missing image alt, non-canonical sitemap URL, and robots-disallowed URL skipping.
- [x] Add `normalizeAuditForGolden(audit, origin)` and `normalizeMarkdownForGolden(markdown, origin)`.
- [x] Generate expected summary and Markdown content from the current deterministic behavior.

### Task 3: Validation and Docs

- [x] Require the fixture/golden files in `scripts/validate-skill.mjs`.
- [x] Document golden fixture coverage in `README.md`.

### Task 4: Verification

- [x] Run `npm test`.
- [x] Run `npm run validate`.
- [x] Run `npm pack --dry-run --workspace packages/cli`.
- [x] Commit the tranche.
