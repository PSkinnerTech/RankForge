# Deterministic GEO/SEO Audit CLI Performance, Schema, and Release Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add deterministic performance evidence import, richer structured-data validation, and release automation metadata.

**Architecture:** Keep heavy external tools optional. Accept Lighthouse JSON as evidence now, expose dynamic Lighthouse execution later through optional dependencies, and convert measurable performance issues into deterministic findings. Validate JSON-LD required properties for the initially supported Google rich-result/entity types using a small local validator.

**Tech Stack:** Node.js 20+, ESM modules, built-in `node:test`, local JSON imports, GitHub Actions.

---

## Tasks

### Task 1: Performance Evidence

- [x] Add tests for reading Lighthouse JSON.
- [x] Add performance findings for poor Lighthouse score, poor LCP, and poor CLS.
- [x] Wire `--lighthouse <file>` into integrations.

### Task 2: Structured Data Validation

- [x] Add tests for required property gaps in Organization, BreadcrumbList, Article, Product, FAQPage, Event, VideoObject, and SoftwareApplication.
- [x] Add `structured_data.required_property_missing` findings.

### Task 3: Report and Docs

- [x] Add performance and rich-result wording to README/SKILL.
- [x] Include performance integration evidence in audit output.

### Task 4: Release Automation

- [x] Add `.github/workflows/release.yml` with manual npm publish scaffolding.
- [x] Keep publishing gated by `NPM_TOKEN`.

## Verification

Run:

```bash
npm test
npm run validate
npm pack --dry-run --workspace packages/cli
```
