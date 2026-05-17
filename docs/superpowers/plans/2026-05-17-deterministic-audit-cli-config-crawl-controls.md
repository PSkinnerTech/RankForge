# Deterministic GEO/SEO Audit CLI Config and Crawl Controls Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Close PRD gaps around config-driven audits, URL-list sampling, include/exclude crawl controls, run metadata, and validation of referenced evidence files.

**Architecture:** Keep the CLI dependency-free. Read config JSON, merge CLI options as overrides, resolve config-relative file paths, and reuse existing snapshot/crawl modules. Add URL-list collection as deterministic sampling evidence. Add include/exclude filters to the crawler so users can bound audits by URL pattern.

**Tech Stack:** Node.js 20+, ESM modules, built-in `node:test`, built-in `crypto`, built-in filesystem APIs.

## Tasks

### Task 1: Tests

- [x] Add CLI tests for `audit --config <file>` using config target and CLI overrides.
- [x] Add audit tests for `urlList` collecting multiple supplied URLs.
- [x] Add crawler tests for include/exclude URL pattern filtering.
- [x] Add config validation tests for missing referenced integration and URL-list files.
- [x] Add audit metadata assertions for config hash and crawl limits.

### Task 2: Config Loading and Path Resolution

- [x] Add helpers that merge config-file values with CLI option overrides.
- [x] Resolve config-relative paths for `urlList` and integration file paths.
- [x] Support `audit --config <file>` with no positional target when the config contains `target`.

### Task 3: URL List and Crawl Filters

- [x] Add `urlList` support to audit config schema.
- [x] Collect URL-list snapshots deterministically when supplied.
- [x] Apply include/exclude regex filters in the crawler and record skipped URLs.

### Task 4: Run Metadata and Docs

- [x] Add deterministic config hash and crawl limits to audit run metadata.
- [x] Update README/SKILL for `--config` and `--url-list`.
- [x] Keep validation script current.

## Verification

Run:

```bash
npm test
npm run validate
npm run cli -- audit --config examples/audit.config.json --mode single
npm pack --dry-run --workspace packages/cli
```
