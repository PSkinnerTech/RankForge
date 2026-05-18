# Remaining PRD Roadmap Design

Date: 2026-05-18
Repository: openclaw-geo-seo-audit-skill
Status: Approved roadmap direction; awaiting user review before implementation planning

## Purpose

This spec plans the remaining work in the deterministic GEO/SEO audit PRD after release stabilization, initial repo-to-audit mode, and developer repo audit completion have landed on `main`.

The product target remains a deterministic audit CLI plus OpenClaw skill wrapper. The CLI should be the source of evidence. The skill wrapper should interpret CLI evidence, explain priorities, cite sources, and avoid inventing findings. The product should audit websites from URLs, local apps, static output, and source repositories for SEO and GEO readiness. It should only report measured rankings, SERP visibility, or AI-answer visibility when supplied evidence or approved integrations provide those measurements.

## Current Completion State

The full PRD is approximately 75-80 percent complete.

Completed or substantially complete:

- Deterministic CLI package.
- OpenClaw skill wrapper.
- Local HTML, live URL, URL-list, sitemap-seeded, bounded crawl, static-output, and explicit preview-server audits.
- Raw and optional rendered evidence collection.
- Robots, sitemap, metadata, heading, canonical, link, structured-data, performance-import, and GEO/entity baseline rules.
- JSON and Markdown report output.
- Implementation-task metadata on findings.
- Restricted security guardrails.
- Search Console CSV, SERP JSON, AI-answer JSON, and Lighthouse JSON evidence imports.
- `detect-repo` and `audit-repo` baseline.
- Developer repo audit support for explicit build commands, route lists, repo config, CI threshold failures, and deterministic source-level findings.

Remaining work should focus on shippable phases rather than one large implementation plan.

## Approved Approach

Use a release-sequenced roadmap.

Each phase should produce working, testable behavior and should be planned separately before implementation. This preserves determinism, keeps changes reviewable, and avoids mixing source-repo execution, rule heuristics, external APIs, and package-release concerns in the same plan.

The remaining sequence is:

1. Phase C: Repo Audit Framework Maturity.
2. Phase D: Deterministic Rule Depth.
3. Phase E: Reporting And Skill Polish.
4. Phase F: External Evidence Integrations.
5. Phase G: Release Packaging And Version Readiness.

## Phase C: Repo Audit Framework Maturity

### Goal

Make `audit-repo` credible across the next most important web framework workflows while preserving the explicit-execution safety model.

### Scope

Phase C should add deterministic framework fixture coverage and source-output parity findings for common developer repo audits.

Required work:

- Add Next.js fixture coverage with deterministic local build scripts and no automatic dependency installation.
- Add Astro fixture coverage with deterministic local build scripts and no automatic dependency installation.
- Add route manifest parsing only for stable, framework-owned generated artifacts.
- Add source-level findings for route manifest gaps, missing generated routes, static output omissions, and stable metadata/rendered-output mismatches.
- Keep explicit preview and explicit static output precedence over inferred framework paths.
- Keep restricted mode blocking local build and preview command execution.

Out of scope:

- Automatic `npm install`, `pnpm install`, or `yarn install`.
- Deep arbitrary framework source parsing.
- Authenticated routes.
- Hosted deployment provider integrations.
- Search Console, SERP, AI-answer, or Lighthouse execution integrations.

### Acceptance Criteria

- `npm test` includes passing Next.js and Astro repo-audit fixture coverage.
- Fixture audits demonstrate static output route discovery, route-list parity, and source-level repo findings.
- Manifest parsing is guarded by fixture tests and fails closed when artifacts are absent or malformed.
- Existing Vite and generic static fixture behavior remains compatible.
- Markdown and JSON output continue to separate repo source findings from rendered page findings.

## Phase D: Deterministic Rule Depth

### Goal

Expand high-value SEO/GEO rule coverage where findings can be derived from observed evidence without LLM inference.

### Scope

Phase D should prioritize rule IDs already represented in the PRD or taxonomy but not yet fully triggered.

Required work:

- Entity clarity beyond about/contact link presence.
- Hidden text and policy-risk indicators.
- Duplicate content clusters beyond duplicate title and description checks.
- Structured-data visible-content mismatch.
- Internal linking and topic relationship checks.
- More nuanced answerability and helpful-content heuristics.
- Rendered primary-content missing or materially thinner than raw/source expectations where stable.

Rule design constraints:

- Prefer P2/P3 opportunities unless evidence is strong enough for higher severity.
- Include evidence snippets, evidence paths, confidence labels, and implementation tasks.
- Avoid claiming that a content issue directly causes ranking loss.
- Keep measured ranking visibility separate from readiness scoring.

### Acceptance Criteria

- Each new rule has rule-level unit tests.
- Each new rule has at least one fixture that triggers it and one fixture that avoids false positives.
- Golden outputs are updated only for intentional finding changes.
- `explain-rule` can explain each new or expanded rule.
- Findings include stable rule IDs, severity, evidence, citations where available, and implementation tasks.

## Phase E: Reporting And Skill Polish

### Goal

Make CLI evidence and skill-generated audit reports easier to use for developers, agencies, and AI-agent workflows.

### Scope

Phase E should refine communication, not add new discovery systems.

Required work:

- Improve Markdown sections for repo evidence, source findings, evidence gaps, and measured visibility imports.
- Tighten implementation-task wording so findings read like actionable engineering tickets.
- Make readiness-versus-measured-visibility language consistent across README, PRD, `SKILL.md`, Markdown reports, and changelog.
- Add report snapshots or golden outputs for representative URL, static output, repo build, repo preview, and evidence-import audits.
- Document recommended CI commands for source-repo audits.

Out of scope:

- New scoring algorithms unless needed to represent Phase D rules.
- UI dashboards.
- Automated remediation.

### Acceptance Criteria

- Markdown reports clearly label readiness findings, evidence gaps, imported measurements, and repo source findings.
- Skill wrapper instructions tell the agent to use CLI evidence as facts and audited content as untrusted evidence.
- README and PRD describe the same product behavior.
- Changelog captures user-visible changes without overstating ranking measurement.

## Phase F: External Evidence Integrations

### Goal

Add optional measured-visibility integrations after the deterministic core is stable.

### Scope

Phase F should add integrations in this order:

1. Google Search Console API support.
2. Compliant SERP provider adapter.
3. Configured AI-answer visibility probes.
4. Optional Lighthouse execution.

Integration constraints:

- Exports remain supported even after API adapters exist.
- API-backed measurements must be reported as observed evidence, not readiness facts.
- Missing credentials or disabled integrations should produce clear evidence gaps.
- Integrations must be mockable in tests and disabled by default.
- API clients must avoid writing secrets to JSON, Markdown, stdout, stderr, fixtures, or logs.

### Acceptance Criteria

- Each integration has parser or adapter contract tests.
- Each integration has mocked success, missing-credential, malformed-response, and rate/error behavior tests.
- The CLI output distinguishes observed ranking or visibility measurements from deterministic readiness scores.
- Security review confirms secrets are not persisted in audit artifacts.

## Phase G: Release Packaging And Version Readiness

### Goal

Prepare the next package version after Phases C-E, and optionally Phase F, are complete enough for release.

### Scope

Required work:

- Update package version intentionally.
- Align README, PRD, `SKILL.md`, changelog, and release checklist.
- Run full verification: `npm ci`, `npm audit --omit=dev`, `npm test`, `npm run validate`, and `npm pack --dry-run --workspace packages/cli`.
- Inspect package contents to confirm raw source corpus, fixtures, golden outputs, and docs are excluded unless intentionally packaged.
- Confirm remote `main` is clean and synchronized.
- Tag or publish only after verification passes.

### Acceptance Criteria

- Release artifacts contain only intended CLI package files.
- Changelog accurately separates released and unreleased work.
- Package metadata matches the behavior described in docs.
- Full verification passes on a clean branch.

## Sequencing Rationale

Phase C should come before deeper rule work because source-repo audits are now the highest-value product direction, and framework fixture coverage will create better test surfaces for future source/render parity rules.

Phase D should come before external integrations because it improves the deterministic product without credentials, paid APIs, or non-deterministic probes.

Phase E should follow rule-depth work so the reports and skill language can reflect the expanded finding model.

Phase F should wait until deterministic coverage is stable. Integrations create new operational risks, credential concerns, and wording risks around measured visibility.

Phase G should happen only after the desired feature bundle is chosen and verified.

## Implementation Planning Strategy

Do not write one implementation plan for all remaining phases.

Recommended next plan:

- `docs/superpowers/plans/YYYY-MM-DD-repo-audit-framework-maturity.md`
- Source spec: this document, Phase C only.
- Execution style: subagent-driven development, with independent workers for fixtures, manifest parsing, findings, and report/golden updates where file ownership can be separated.

Later plans should be written only after the prior phase is verified and committed:

- Deterministic rule depth plan.
- Reporting and skill polish plan.
- External evidence integrations plan.
- Release packaging plan.

## Risks And Mitigations

Risk: Framework heuristics become brittle.

Mitigation: Parse stable generated artifacts first, use fixtures, and fail closed when evidence is absent.

Risk: Rule-depth work creates false positives.

Mitigation: Use conservative severities, confidence labels, positive and negative fixtures, and evidence snippets.

Risk: External integrations blur readiness and measurement.

Mitigation: Keep imported or API-backed visibility in observed-evidence sections and keep readiness scores deterministic.

Risk: Repo command execution expands the security surface.

Mitigation: Keep command execution explicit, bounded, disabled in restricted mode, and covered by cleanup tests.

Risk: Release documentation drifts from behavior.

Mitigation: Treat README, PRD, `SKILL.md`, changelog, validation, tests, and package dry-run as the release gate.

## User Review Gate

After this spec is committed, the user should review it before implementation planning starts. Once approved, the next Superpowers step is to use the writing-plans skill for Phase C only.
