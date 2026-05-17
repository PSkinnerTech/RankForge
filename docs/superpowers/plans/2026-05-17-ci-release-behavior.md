# CI Release Behavior Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add CI-oriented severity threshold exits, audit output validation, and a release checklist.

**Architecture:** Keep validation dependency-free by adding a small `validateAuditOutput` function beside the existing output schema object. Extend CLI audit handling with `--fail-on P0|P1|P2|P3`, preserving JSON/Markdown writes while returning a non-zero CI exit when findings meet or exceed the threshold.

**Tech Stack:** Node.js 20+, ESM modules, built-in `node:test`, GitHub Actions/npm release workflow.

---

## Tasks

### Task 1: RED Tests

- [x] Add tests for `validateAuditOutput` accepting a minimal valid audit and rejecting missing top-level fields.
- [x] Add CLI tests proving `audit --fail-on P1` returns a CI failure code when a P1 finding exists.
- [x] Add CLI tests proving `audit --fail-on P0` does not fail when only lower-priority findings exist.

### Task 2: Implement CI Exit Behavior

- [x] Add `--fail-on <severity>` to CLI help and option parsing.
- [x] Return exit code `2` after successful audit execution when findings meet or exceed the configured threshold.
- [x] Include `failedThreshold` in success JSON when `--out` or `--markdown` is used.

### Task 3: Implement Output Validation

- [x] Add `validateAuditOutput(audit)` to `packages/cli/src/audit-output-schema.mjs`.
- [x] Keep checks focused on required top-level fields and finding field presence.

### Task 4: Release Checklist

- [x] Add `docs/release-checklist.md` with verification, changelog/version, dry-run, token, and publish steps.
- [x] Mention the checklist in README.

### Task 5: Verification

- [x] Run `npm test`.
- [x] Run `npm run validate`.
- [x] Run `npm pack --dry-run --workspace packages/cli`.
- [x] Commit the tranche.
