# Deterministic GEO/SEO Audit CLI Implementation Tasks Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add PRD-required implementation task metadata to deterministic findings and surface those tasks in Markdown reports.

**Architecture:** Keep findings backward-compatible while adding an `implementationTask` object derived from rule metadata, owner, and effort. Use a shared helper so page-level, site-level, and integration-level findings stay consistent.

## Tasks

- [x] Add tests proving page, site, and performance findings include `implementationTask`.
- [x] Add report tests proving Markdown includes an Implementation Tasks section.
- [x] Add shared implementation-task helper.
- [x] Wire page-level, site-level, and performance findings to the helper.
- [x] Update validation metadata if a new source module is added.

## Verification

Run:

```bash
npm test
npm run validate
npm pack --dry-run --workspace packages/cli
```
