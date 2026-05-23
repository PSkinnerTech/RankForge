# Changelog

## Unreleased

## 0.4.0 - 2026-05-22

- Added explicit route-to-HTML route-list mappings for SPA repository audits, with deterministic Vite SPA fixture coverage.
- Added repo source-finding developer guidance, including inspect-next targets, next actions, and rerun acceptance checks.
- Improved Markdown and HTML repository evidence reports so source findings show the next artifact to inspect.
- Added route-list documentation and a copy-paste GitHub Actions example that uploads JSON, Markdown, and HTML RankForge reports.
- Sanitized invalid route-list evidence so rejected mapped entries do not leak absolute local filesystem paths.

## 0.3.0 - 2026-05-22

- Renamed the project, repository, skill, package, and CLI identity to RankForge.
- Added standalone HTML audit reports with `--html <file>` for both `audit` and `audit-repo`, including escaped user-supplied evidence, summary cards, priorities, findings tables, developer actions, repository evidence, measurements, evidence gaps, and sources.
- Added a fresh Superbuilders smoke test pass covering `https://superbuilders.dev` and the `superbuilders/sb-home` source repository with RankForge-branded HTML report output.
- Added Phase D.2 deterministic rule-depth findings for duplicate content clusters, structured-data visible-content mismatches, and entity clarity gaps.
- Added Phase D.1 render parity findings for explicitly rendered audits, including changed title, description, canonical, missing rendered heading/content, and structured-data loss checks.
- Added Phase B repository audit mode so the CLI can inspect a source repository and audit either detected static output or an explicit preview server.
- Added `detect-repo [path]` to report repository metadata including package manager, framework signal, build command, preview command, static output directory, and discovered route sources.
- Added `audit-repo <path>` with `--static-dir`, `--preview-command`, `--preview-url`, preview startup timeout, crawl limits, security mode, JSON output, and Markdown output support.
- Added static output route discovery for HTML builds, including deterministic route normalization for root pages, nested `index.html` routes, and extension routes.
- Added repo-aware audit orchestration with optional `repo` evidence in JSON and Markdown reports, plus source findings for missing audit paths, missing static directories, empty static outputs, and unreachable preview servers.
- Added managed preview process handling with startup polling, preflight checks for already-running URLs, process-group shutdown, repeated-stop safety, early-exit errors, and capped stdout/stderr capture.
- Hardened preview probing so restricted security mode uses the same guarded fetch path as audits and rejects private-network preview URLs before spawning commands.
- Added packaged CLI source-map support so installed-package audits retain top-level source citations instead of silently emitting an empty `sources` array.
- Added release-gate coverage for packed CLI contents and an installed-style packed tarball smoke check that verifies source citations are present.
- Added repo fixture projects and golden summary coverage for static output audits and preview-server audits.
- Updated README, skill wrapper guidance, and skill validation so repository audit mode is documented while keeping ranking claims limited to supplied evidence.
- Added developer-focused repo audits with explicit `--build-command`, bounded build timeouts, captured build evidence, and build failure/timeout source findings.
- Added repo audit config support through `audit.config.json` `repo` settings, including config-relative static output and route-list paths.
- Added `--route-list` support so repository audits can constrain generated static routes and report missing, empty, non-HTML, or outside-static route-list entries deterministically.
- Added repo CI gating with `audit-repo --fail-on P0|P1|P2|P3`, including early option validation before build or preview side effects.
- Added static output source findings for missing generated `robots.txt` and `sitemap.xml`.
- Added Phase C repo audit framework maturity coverage with deterministic Next.js and Astro fixtures, stable Next.js route manifest evidence, and source-level route parity findings for manifest/static-output mismatches.
- Kept Astro framework coverage limited to detection and static-output audits until an explicit integration-generated route artifact is available.
- Hardened repo command guardrails so restricted mode blocks local build and preview command execution before spawning, and explicit preview options take precedence over static output so callers can audit live preview servers even when a stale `dist` directory exists.
- Polished CLI Markdown reports with repo Markdown golden coverage and aligned the skill report template, README, PRD, and skill guidance around the same priorities, dimensions, developer tasks, repository evidence, imported measurements, evidence gaps, and sources structure.
- Added a root package `private: true` guardrail to prevent accidental root package publishing.
- Added CLI package metadata, package-facing README, and MIT license files to improve packed package readiness.
- Expanded the test suite to cover repo detection, static route discovery, repo audit orchestration, preview lifecycle behavior, CLI validation, report/schema compatibility, packaging, and release-gate hardening.

## 0.2.0 - 2026-05-18

- Added the deterministic `rankforge` CLI package with `audit`, `snapshot`, `validate-config`, and `explain-rule` commands.
- Added config-driven audits, URL-list sampling, bounded same-origin crawling, sitemap seeding, robots enforcement, include/exclude crawl filters, and JSON/Markdown outputs.
- Added deterministic page and site rules for technical eligibility, crawl/index controls, search appearance, structured data, content answerability, entity signals, performance imports, and ranking-evidence gaps.
- Added optional evidence imports for Search Console CSV, SERP JSON, AI-answer JSON, and Lighthouse JSON.
- Added restricted security mode with network/file guardrails, request timeouts, response/file byte caps, manual redirect enforcement, and disabled browser rendering for restricted URL targets.
- Added implementation-task metadata to findings and CI severity threshold support with `--fail-on`.
- Added fixture-site and golden-output regression coverage plus GitHub CI and release workflow scaffolding.
- Updated the RankForge skill wrapper to use the CLI as the deterministic evidence source and to avoid unsupported ranking claims.

## 0.1.0 - 2026-05-16

- Initial public RankForge skill for GEO/SEO website audits.
- Added Google Search Central source corpus manifest and preserved page extracts.
- Added audit framework, report templates, page finding templates, redesign brief template, example fixture, and example audit output.
- Added deterministic page snapshot and skill validation scripts.
