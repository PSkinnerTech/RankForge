# Deterministic GEO/SEO Audit CLI Remaining PRD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the remaining practical PRD scope after the committed CLI foundation.

**Architecture:** Extend the existing dependency-light CLI with deterministic crawl controls, optional renderer hooks, site-level rule evaluation, ranking evidence importers, package metadata, and CI. Keep browser rendering optional through dynamic Playwright loading so tests and basic usage do not require browser downloads.

**Tech Stack:** Node.js 20+, ESM modules, built-in `node:test`, built-in `fetch`, optional Playwright peer/optional dependency, GitHub Actions.

---

## Tasks

### Task 1: Robots Enforcement and Sitemap-Seeding

- Add tests for robots-disallowed URLs being skipped.
- Add tests for sitemap URLs being seeded into crawl queue.
- Implement `fetchRobots`, `fetchSitemapUrls`, and crawler integration.
- Wire CLI options `--sitemap` and `--respect-robots`.

### Task 2: Optional Rendering Hooks

- Add tests for injected renderer output.
- Implement `render.mjs` with dependency-injected renderer and dynamic Playwright fallback.
- Add rendered evidence, rendered hash, and raw/rendered text delta to snapshots.
- Add raw/rendered mismatch findings.

### Task 3: Site-Level Rules

- Add tests for duplicate titles, duplicate meta descriptions, broken internal links, canonical target errors, and non-canonical sitemap URLs.
- Implement `site-rule-engine.mjs`.
- Merge page-level and site-level findings in `runAudit`.

### Task 4: Ranking Evidence Imports

- Add tests for Search Console CSV, SERP JSON, and AI answer JSON imports.
- Implement import parsers.
- Wire CLI options `--search-console`, `--serp`, and `--ai-answers`.
- Remove ranking evidence gap when ranking evidence is supplied.

### Task 5: Packaging and CI

- Add package export/files metadata.
- Add GitHub Actions workflow for `npm test` and `npm run validate`.
- Update README/SKILL documentation.
- Run full verification and commit.

## Verification

Run:

```bash
npm test
npm run validate
npm run cli -- audit examples/fixture-site/index.html --out /tmp/openclaw-audit.json --markdown /tmp/openclaw-audit.md
git status --short
```
