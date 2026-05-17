# Deterministic GEO/SEO Audit CLI Milestone 5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add bounded same-origin crawling so `audit` can inspect more than one linked page.

**Architecture:** Add `crawl.mjs` as a small breadth-first crawler built on `collectSnapshot`. It follows same-origin links from collected page evidence, honors max pages and depth, and records skipped URLs. `runAudit` uses the crawler when the target is an HTTP URL and crawl mode is not `single`.

**Tech Stack:** Node.js 20+, ESM modules, built-in `node:test`, local HTTP server tests, no runtime dependencies.

---

## Scope

This plan adds:

- `crawlSite(config)` for HTTP targets.
- Same-origin link following.
- `maxPages` and `maxDepth` limits.
- Skipped URL reasons.
- Audit integration for `crawl.mode: "full"` or `"sample"`.

This plan does not implement browser rendering, robots enforcement, sitemap-seeded crawling, auth, or retry/backoff.

## Files

- Create: `packages/cli/src/crawl.mjs`
- Create: `packages/cli/test/crawl.test.mjs`
- Modify: `packages/cli/src/audit.mjs`
- Modify: `packages/cli/src/cli.mjs`
- Modify: `scripts/validate-skill.mjs`

## Task 1: Add Failing Crawl Tests

- [ ] **Step 1: Create local HTTP server tests**

Create `packages/cli/test/crawl.test.mjs` with a local server:

- `/` returns a homepage with links to `/about`, `/external`, and `https://other.example/`.
- `/about` returns a valid page.
- `/external` can exist but is not reached when `maxPages` is 2.

Assert:

- `crawlSite({ target, maxPages: 2, maxDepth: 1 })` returns 2 pages.
- Pages include homepage and `/about`.
- Skipped URLs include the cross-origin URL.

- [ ] **Step 2: Extend audit tests**

Add an audit test proving `runAudit({ target, crawl: { mode: "full", maxPages: 2, maxDepth: 1 } })` returns 2 pages for the local server.

- [ ] **Step 3: Run tests to verify failure**

Run:

```bash
npm test
```

Expected: crawl tests fail because `crawl.mjs` does not exist and audit still snapshots one page.

## Task 2: Implement `crawl.mjs`

- [ ] **Step 1: Add crawler**

Export `crawlSite(config)`:

- Only crawl HTTP targets.
- Start from `config.target`.
- Use breadth-first queue.
- Normalize URLs.
- Follow only same-origin links.
- Respect `maxPages` and `maxDepth`.
- Record skipped URLs with reasons.

- [ ] **Step 2: Run tests**

Run:

```bash
npm test
```

Expected: crawl tests pass; audit multi-page test may still fail.

## Task 3: Wire Crawler Into Audit and CLI Options

- [ ] **Step 1: Update `runAudit`**

Use `crawlSite(config)` when:

- target is HTTP URL
- `config.crawl.mode` is `full` or `sample`

Otherwise collect a single snapshot.

- [ ] **Step 2: Update CLI option parsing**

Support:

- `--mode full|sample|single`
- `--max-pages <n>`
- `--max-depth <n>`

- [ ] **Step 3: Run verification**

Run:

```bash
npm test
npm run validate
```

Expected:

- Tests pass.
- Validation passes.

## Self-Review

Spec coverage:

- Bounded multi-page crawling is covered.
- Same-origin restriction is covered.
- Robots, sitemap-seeded discovery, and browser rendering are intentionally deferred.

Placeholder scan:

- No placeholders.

Type consistency:

- Crawler API is `crawlSite(config)`.
