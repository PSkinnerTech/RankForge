# Release Stabilization And Repo-To-Audit Mode Design

Date: 2026-05-18
Repository: RankForge
Status: Phase A complete; Phase B repo-to-audit mode ready for implementation planning

## Purpose

RankForge should become a deterministic CLI and skill wrapper that can audit a website from a live URL, local app, static HTML output, or source repository. The core product must determine how well the website is designed for SEO and GEO readiness without overclaiming actual rankings.

The approved sequence is:

1. Refresh the PRD into a current v1/v1.5 completion spec.
2. Make repo-to-audit mode a first-class next product target after release stabilization.
3. Push and merge the existing guardrail layer after final review.
4. Complete release hygiene: changelog, version notes, package readiness, and publish checklist.
5. Design and implement repo-to-audit mode.
6. Expand deterministic rule coverage for current registry-only and weakly covered rules.
7. Add external integrations after the deterministic core is stable.

## Ideal Completion State

The finished product is a deterministic CLI that can audit a website from either a URL, local running app, static build output, or source repo, then emit stable JSON and Markdown evidence showing how well the site is prepared for SEO and GEO visibility.

By default, the tool reports readiness. It must not claim measured rankings, SERP positions, or AI answer visibility unless real ranking evidence is supplied through Search Console, SERP exports, AI-answer exports, or future approved APIs.

The skill wrapper is not the source of technical discovery. It runs the CLI, reads the JSON output, cites rule/source evidence, labels evidence gaps, and writes the human-facing audit report.

## Current State Summary

The repository already contains a working deterministic CLI package and skill wrapper:

- CLI package: `rankforge@0.2.0`.
- Commands: `audit`, `snapshot`, `validate-config`, and `explain-rule`.
- Evidence collection for local HTML, live URLs, URL lists, bounded crawls, sitemap seeds, robots enforcement, and optional rendering hooks.
- JSON and Markdown output.
- Config schema, output schema, deterministic rule registry, page rules, site rules, scoring, and implementation tasks.
- Ranking evidence importers for Search Console CSV, SERP JSON, and AI-answer JSON.
- Lighthouse JSON import for performance evidence.
- Restricted security mode for untrusted audits.
- Golden fixtures, validation script, CI workflow, and release workflow.

Fresh verification before this spec:

- `npm test`: 74 tests passed.
- `npm run validate`: validation passed with 56 required files, 90 source pages, 41 framework citations, 26 source-map entries, and 34 rules.
- `npm audit --omit=dev`: 0 vulnerabilities.
- `npm pack --dry-run --workspace packages/cli`: CLI package dry run succeeded.

## Phase A: Release Stabilization

Phase A prepares the current CLI and skill wrapper for a clean beta release before adding repo-to-audit mode.

### Goals

- Make documentation match the implemented product.
- Merge or publish the `guardrail-layer` work intentionally.
- Ensure release metadata is accurate for `0.2.0`.
- Preserve the current green verification state.
- Leave no stale PRD decisions that imply unresolved architecture choices already settled in code.

### Work Items

1. Update `docs/prd-deterministic-audit-cli.md`.
   - Change status from draft to current implementation baseline plus v1.5 roadmap.
   - Mark resolved decisions explicitly.
   - Add repo-to-audit mode as the next product capability.
   - Distinguish shipped v0.2 behavior from remaining v1.5 and later work.

2. Update release hygiene.
   - Add a `0.2.0` changelog entry.
   - Confirm package metadata and package contents.
   - Confirm release checklist still matches CI and npm publishing.
   - Document that raw source corpus is a repo asset and not part of the CLI package.

3. Finalize guardrail branch.
   - Review the `guardrail-layer` commit.
   - Push the branch.
   - Merge to `main` through the preferred repository workflow.
   - Re-run verification on the merged result.

4. Publish readiness checkpoint.
   - Run `npm ci`.
   - Run `npm audit --omit=dev`.
   - Run `npm test`.
   - Run `npm run validate`.
   - Run `npm pack --dry-run --workspace packages/cli`.
   - Optionally run the release workflow in dry-run mode.

### Acceptance Criteria

- PRD describes the product as it exists today and the next planned mode.
- Changelog contains a complete `0.2.0` entry.
- Guardrail work is available on the remote and merged or ready for review.
- All verification commands pass.
- Working tree is clean.

## Phase B: Repo-To-Audit Mode

Phase B makes the product audit websites from source repositories, not only already-running URLs or static files.

### Problem

Many users want to know whether a website is built correctly for SEO and GEO before it is deployed. The current CLI can audit a running local app or static HTML, but it does not yet inspect a source repo, infer how to run it, build it, discover generated routes, and connect source-level findings to rendered-page findings.

### Core User Flow

```bash
rankforge audit-repo .
```

Expected behavior:

1. Inspect the repository.
2. Detect supported framework/build signals.
3. Decide whether to use static output, preview server, or explicit user-supplied commands.
4. Build or run the app with bounded, non-interactive commands.
5. Discover crawlable routes from generated output, sitemap, framework conventions, or supplied route list.
6. Audit the rendered site with the existing CLI engine.
7. Add source-level evidence for metadata, robots/sitemap generators, structured-data modules, and route definitions where practical.
8. Emit one unified JSON/Markdown audit with clear evidence paths.

### Supported Initial Scope

The first repo-to-audit mode should prioritize deterministic, common web app paths:

- Static HTML directories.
- npm workspaces and package scripts.
- Vite, Next.js, Astro, SvelteKit, Remix, and generic static exports where signals are obvious.
- User-supplied commands for build and preview when auto-detection is uncertain.
- Localhost audit after preview server startup.

The first version should not try to support every hosting platform, CMS, monorepo topology, private dependency workflow, or authenticated page flow.

### Proposed CLI Additions

```bash
rankforge audit-repo <path>
rankforge detect-repo <path>
```

Important options:

```bash
--config audit.config.json
--build-command "npm run build"
--preview-command "npm run preview -- --host 127.0.0.1"
--preview-url http://127.0.0.1:4173
--static-dir dist
--route-list routes.txt
--install never|if-needed|always
--max-build-ms 120000
--max-preview-ms 30000
--mode full|sample|single
--max-pages 100
--security local|restricted
```

### Data Model Additions

Audit output should add a `repo` section:

```json
{
  "repo": {
    "path": ".",
    "detectedFramework": "vite",
    "packageManager": "npm",
    "buildCommand": "npm run build",
    "previewCommand": "npm run preview -- --host 127.0.0.1",
    "previewUrl": "http://127.0.0.1:4173",
    "staticDir": "dist",
    "routeSources": [],
    "sourceFindings": [],
    "notes": []
  }
}
```

Source-level evidence must remain separate from rendered-page evidence. A finding should state whether it came from source inspection, rendered output, or both.

### Repo-Level Findings

Initial repo-level findings should focus on deterministic signals:

- Missing or unreachable generated sitemap.
- Missing or unreachable generated robots.txt.
- Framework metadata APIs not used on important routes when detectable.
- Static export exists but canonical URLs point to the wrong origin.
- Structured-data helper exists but rendered pages omit schema.
- Route files exist but are not discoverable from sitemap or internal links.
- Build or preview command unavailable.
- Preview server did not become reachable within configured timeout.

### Safety And Guardrails

Repo-to-audit mode executes local commands, so it must be explicit and bounded.

- Default to non-destructive commands only.
- Prefer existing lockfile/package manager.
- Do not run arbitrary install/build commands in restricted mode.
- Require explicit commands when auto-detection is ambiguous.
- Enforce build and preview timeouts.
- Kill preview servers after audit completion.
- Capture stdout/stderr summaries without storing secrets.
- Avoid reading large or sensitive files unless explicitly configured.

### Acceptance Criteria

- `detect-repo` reports framework, package manager, likely build/preview commands, static output candidates, and confidence.
- `audit-repo` can audit at least one fixture repo through a local preview server.
- `audit-repo` can audit at least one static-output fixture.
- Output includes both `repo` evidence and existing page/site evidence.
- Preview server cleanup is verified by tests.
- Existing `audit` behavior remains backward-compatible.

## Phase C: Deterministic Rule Depth

After repo-to-audit mode lands, expand rule coverage with priority on rules already present in the registry but not fully implemented as triggers.

Priority areas:

- Entity clarity beyond about/contact links.
- Hidden text and policy risk indicators.
- Duplicate content clusters beyond duplicate metadata.
- Structured-data visible-content mismatch.
- Rendered primary-content missing.
- Internal linking and topic relationship checks.
- More nuanced answerability and helpful-content heuristics.

## Phase D: External Integrations

External integrations should come after the deterministic core is stable.

Recommended order:

1. Search Console API support.
2. Compliant SERP provider adapter.
3. Configured AI-answer visibility probes.
4. Optional Lighthouse execution, if package and runtime tradeoffs are acceptable.

Each integration must keep measured visibility separate from readiness scoring.

## Testing Strategy

Phase A:

- Existing unit tests.
- Validation script.
- npm audit.
- npm package dry run.
- Release workflow dry run when credentials and repository settings allow it.

Phase B:

- Fixture static site repository.
- Fixture Vite or equivalent preview repository.
- Repo detection tests.
- Preview startup and cleanup tests.
- Timeout and failure-path tests.
- Golden output tests for repo evidence.

Phase C:

- Rule-level unit tests.
- Known-issues fixture expansions.
- Golden output updates.

Phase D:

- Parser contract tests.
- Mocked API adapter tests.
- Evidence-gap behavior tests when credentials or exports are missing.

## Open Questions For Implementation Planning

These are narrow planning questions, not unresolved product direction:

1. Which framework fixture should be used first for repo-to-audit mode: Vite, Next.js, or Astro?
2. Should `audit-repo` default to auto-detection only, or require explicit `--build-command` and `--preview-command` for the first release?
3. Should repo-to-audit mode live in `packages/cli/src/repo-audit.mjs` or split detection, process management, and route discovery into separate modules from the start?

## Non-Goals

- No promise of ranking improvement.
- No Google scraping without compliant APIs or supplied exports.
- No automatic code remediation.
- No exhaustive enterprise crawling in the first repo-to-audit release.
- No secret scanning replacement.
- No unrestricted execution of arbitrary repository scripts.
