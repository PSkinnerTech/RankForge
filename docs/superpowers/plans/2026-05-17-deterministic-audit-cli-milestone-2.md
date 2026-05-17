# Deterministic GEO/SEO Audit CLI Milestone 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add deterministic crawl and snapshot evidence collection for URLs and local HTML files.

**Architecture:** Add small focused modules under `packages/cli/src`: URL helpers, HTML extraction, robots parsing, sitemap parsing, fetch/snapshot collection, and bounded crawling. The CLI `snapshot` command outputs single-page evidence; the CLI `audit` command emits a minimal versioned audit JSON with site evidence and page snapshots, leaving rule evaluation for the next milestone.

**Tech Stack:** Node.js 20+, ESM modules, built-in `node:test`, built-in `fetch`, no runtime dependencies.

---

## Scope

This plan implements PRD Milestone 2:

- URL normalization.
- Raw fetch with status, headers, and redirects.
- Local HTML snapshots.
- robots.txt fetch and simple rule parsing.
- sitemap discovery and parsing.
- Link extraction.
- Single-page `snapshot` command.
- Minimal `audit` command that returns versioned evidence JSON without findings.

Browser rendering is intentionally deferred to a later optional Playwright task so Milestone 2 remains dependency-free and deterministic.

## Files

- Create: `packages/cli/src/url-utils.mjs`
- Create: `packages/cli/src/html-extract.mjs`
- Create: `packages/cli/src/robots.mjs`
- Create: `packages/cli/src/sitemap.mjs`
- Create: `packages/cli/src/snapshot.mjs`
- Create: `packages/cli/src/audit.mjs`
- Modify: `packages/cli/src/cli.mjs`
- Create: `packages/cli/test/url-utils.test.mjs`
- Create: `packages/cli/test/html-extract.test.mjs`
- Create: `packages/cli/test/robots.test.mjs`
- Create: `packages/cli/test/sitemap.test.mjs`
- Create: `packages/cli/test/snapshot.test.mjs`
- Create: `packages/cli/test/audit.test.mjs`
- Modify: `scripts/validate-skill.mjs`

## Task 1: Add Failing Evidence Module Tests

- [ ] **Step 1: Write URL helper tests**

Create `packages/cli/test/url-utils.test.mjs` asserting:

- `normalizeUrl("https://example.com/a#x")` removes hashes.
- `normalizeUrl("https://example.com/a/")` removes trailing slash except origin.
- `sameOrigin("https://example.com/a", "https://example.com/b")` is true.
- `sameOrigin("https://example.com/a", "https://other.test/b")` is false.

- [ ] **Step 2: Write HTML extraction tests**

Create `packages/cli/test/html-extract.test.mjs` asserting extraction of title, description, robots, canonical, headings, links, images, JSON-LD, invalid JSON-LD parse errors, visible text length, and visible text preview.

- [ ] **Step 3: Write robots parser tests**

Create `packages/cli/test/robots.test.mjs` asserting:

- `parseRobotsTxt` groups user agents.
- `isAllowedByRobots(parsed, "/private/page", "OpenClawBot")` returns false when `Disallow: /private`.
- `isAllowedByRobots(parsed, "/public/page", "OpenClawBot")` returns true.

- [ ] **Step 4: Write sitemap parser tests**

Create `packages/cli/test/sitemap.test.mjs` asserting `parseSitemap` returns URL locations from both `urlset` and `sitemapindex` XML.

- [ ] **Step 5: Write snapshot tests**

Create `packages/cli/test/snapshot.test.mjs` asserting `collectSnapshot("examples/fixture-site/index.html")` returns local file evidence with title, canonical, H1, links, images, structured data, and raw snapshot hash.

- [ ] **Step 6: Write audit tests**

Create `packages/cli/test/audit.test.mjs` asserting `runAudit({ target: "examples/fixture-site/index.html" })` returns schema version, tool version, one page, empty findings, and source metadata.

- [ ] **Step 7: Run tests to verify they fail**

Run:

```bash
npm test
```

Expected: new tests fail because modules do not exist.

## Task 2: Implement URL and HTML Extraction Modules

- [ ] **Step 1: Implement `url-utils.mjs`**

Create focused helpers:

- `normalizeUrl(value)`
- `isHttpUrl(value)`
- `sameOrigin(a, b)`
- `resolveUrl(href, base)`

- [ ] **Step 2: Implement `html-extract.mjs`**

Create:

- `cleanText(value)`
- `extractHtmlEvidence(html, baseUrl)`

The extractor must return metadata, headings, links, images, structured data parse results, counts, and visible text preview.

- [ ] **Step 3: Run tests**

Run:

```bash
npm test
```

Expected: URL and HTML extraction tests pass; robots/sitemap/snapshot/audit tests still fail.

## Task 3: Implement robots.txt and Sitemap Modules

- [ ] **Step 1: Implement `robots.mjs`**

Create:

- `parseRobotsTxt(text)`
- `isAllowedByRobots(parsed, pathOrUrl, userAgent = "OpenClawBot")`

Use simple longest-prefix behavior for `Allow` and `Disallow`.

- [ ] **Step 2: Implement `sitemap.mjs`**

Create:

- `parseSitemap(xml)`

Return:

```js
{
  type: "urlset" | "sitemapindex" | "unknown",
  urls: [],
  sitemaps: []
}
```

- [ ] **Step 3: Run tests**

Run:

```bash
npm test
```

Expected: URL, HTML, robots, and sitemap tests pass; snapshot/audit tests still fail.

## Task 4: Implement Snapshot and Minimal Audit Commands

- [ ] **Step 1: Implement `snapshot.mjs`**

Create:

- `collectSnapshot(target, options = {})`

For HTTP URLs, fetch raw HTML with manual redirect capture up to five redirects. For local files, read from disk. Always return source type, final URL, status, headers, redirect chain, raw SHA-256 hash, extracted HTML evidence, and render status set to `"not_requested"`.

- [ ] **Step 2: Implement `audit.mjs`**

Create:

- `runAudit(config)`

For Milestone 2, collect one snapshot for the target and return versioned audit output with empty findings, empty scores, and a ranking evidence gap.

- [ ] **Step 3: Wire CLI commands**

Update `cli.mjs` so:

- `snapshot <target>` prints snapshot JSON.
- `audit <target>` prints audit JSON.
- `audit <target> --out file.json` writes the audit JSON to a file and prints a small success JSON.

- [ ] **Step 4: Run tests**

Run:

```bash
npm test
```

Expected: all tests pass.

## Task 5: Update Validation

- [ ] **Step 1: Add required file checks**

Update `scripts/validate-skill.mjs` to require the new Milestone 2 modules.

- [ ] **Step 2: Run final verification**

Run:

```bash
npm test
npm run validate
npm run cli -- snapshot examples/fixture-site/index.html
npm run cli -- audit examples/fixture-site/index.html
```

Expected:

- Tests pass.
- Validation passes.
- Snapshot prints page evidence.
- Audit prints versioned JSON with one page and no findings.

## Self-Review

Spec coverage:

- PRD Milestone 2 URL normalization is covered.
- Raw/local snapshot collection is covered.
- robots and sitemap parsing are covered.
- Bounded multi-page crawling is not implemented in this slice; the minimal `audit` command collects a single page and establishes output shape.
- Browser rendering is deferred intentionally because the project has no dependencies yet.

Placeholder scan:

- No task depends on undefined future modules.

Type consistency:

- Snapshot API is `collectSnapshot(target, options = {})`.
- Audit API is `runAudit(config)`.
