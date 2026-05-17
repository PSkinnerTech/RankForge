# High-Value Deterministic Rules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add high-value deterministic rule triggers that are already present in the taxonomy and supported by collected evidence.

**Architecture:** Extend existing page and site rule engines without changing rule metadata shape. Page-level rules consume snapshot evidence such as redirect chains, favicon, robots meta, and canonical. Site-level rules consume crawl context such as discovered sitemaps and skipped robots-blocked URLs.

**Tech Stack:** Node.js 20+, ESM modules, built-in `node:test`, no runtime dependencies.

---

## Tasks

### Task 1: RED Rule Tests

- [x] Add page-rule tests for long redirect chains, noindex/canonical conflict, and missing homepage favicon.
- [x] Add site-rule tests for missing sitemap and robots-blocked skipped URLs.
- [x] Run targeted tests and verify the new assertions fail.

### Task 2: Implement Page Rules

- [x] Trigger `technical.redirect_chain` when a URL snapshot has more than one redirect hop.
- [x] Trigger `indexability.noindex_canonical_conflict` when a page has noindex and a canonical.
- [x] Trigger `appearance.favicon_missing` on homepage-like URL pages without favicon evidence.

### Task 3: Implement Site Rules

- [x] Trigger `crawl.sitemap_missing` when a crawled HTTP audit has no discovered/supplied sitemap evidence.
- [x] Trigger `crawl.robots_blocked` from crawl skipped entries with `reason: "robots_blocked"`.

### Task 4: Verification

- [x] Update golden outputs if the known-issues fixture behavior changes.
- [x] Run `npm test`.
- [x] Run `npm run validate`.
- [x] Run `npm pack --dry-run --workspace packages/cli`.
- [x] Commit the tranche.
