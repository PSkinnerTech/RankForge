# Expanded HTML Evidence Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand page evidence extraction with deterministic metadata, link, schema, and entity signals needed by later rule expansion.

**Architecture:** Extend the existing dependency-free `html-extract.mjs` parser instead of adding a DOM library. Keep outputs simple JSON primitives and arrays so audit snapshots remain stable and easy to consume.

**Tech Stack:** Node.js 20+, ESM modules, built-in `node:test`, no runtime dependencies.

---

## Tasks

### Task 1: RED Evidence Tests

- [x] Add tests for hreflang, favicon, site name, preview directives, schema types, internal/external link counts, author signals, and date signals.
- [x] Run `node --test packages/cli/test/html-extract.test.mjs` and verify the new assertions fail.

### Task 2: Implement Extraction

- [x] Extend link/meta helpers in `packages/cli/src/html-extract.mjs`.
- [x] Extract `hreflang`, `favicon`, `siteName`, `previewDirectives`, `schemaTypes`, `entitySignals.authors`, `entitySignals.dates`, and internal/external link counts.
- [x] Keep existing extraction output backward-compatible.

### Task 3: Docs and Verification

- [x] Update README evidence description.
- [x] Run `npm test`.
- [x] Run `npm run validate`.
- [x] Run `npm pack --dry-run --workspace packages/cli`.
- [x] Commit the tranche.
