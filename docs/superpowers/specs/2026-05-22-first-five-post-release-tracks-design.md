# First Five Post-Release Tracks Design

Date: 2026-05-22
Repository: RankForge
Status: Draft design for user review before implementation planning

## Purpose

RankForge has crossed the first public release threshold: the repository is renamed, `rankforge@0.3.0` is published on npm, the GitHub release exists, HTML reports are available, and Superbuilders has been smoke-tested through both live URL and source-repository audits.

The next phase should avoid chasing integrations too early. The first five tracks should make the released product cleaner, more useful for developers, easier to adopt, and easier to release again. This design defines those tracks in the order they should be completed.

## Current Baseline

Main currently includes:

- published npm package `rankforge@0.3.0`
- GitHub release `v0.3.0`
- deterministic CLI commands for live URL, local page, config, URL-list, sitemap, crawl, repo detection, and repo audit workflows
- JSON, Markdown, and standalone HTML report outputs
- source-repository audit support for explicit builds, explicit previews, static outputs, route lists, repo config, source findings, and fail-on thresholds
- RankForge skill wrapper under `skill/rankforge`
- preserved Google Search Central citation corpus and source map
- CI, release checklist, golden fixtures, and packed CLI smoke coverage
- Superbuilders smoke outputs for `https://superbuilders.dev` and `superbuilders/sb-home`

The highest leverage next step is not new external data access. It is tightening the local-first developer workflow around the published CLI.

## Product Goal

Make RankForge feel like a credible, practical developer and SEO audit tool that a user can install, run, understand, and release-repeat without handholding.

## Track Sequence

### Track 1: Post-Release Stabilization

This track makes the repository accurately describe the current published state.

Scope:

- update PRD language from release-candidate wording to published `rankforge@0.3.0`
- document npm install and registry verification in release docs
- address the GitHub Actions Node 20 deprecation warning
- document the current npm publishing flow and future trusted publishing direction
- add concise known-limits language around readiness versus ranking guarantees

Exit criteria:

- docs no longer describe `0.3.0` as unpublished or release-candidate work
- CI is green after workflow updates
- a new maintainer can verify npm install, GitHub release, and registry state from docs
- readiness versus measured ranking language remains explicit

### Track 2: Developer Repo Audit Maturity

This track improves `rankforge audit-repo` for the strongest near-term use case: developers auditing source repositories before launch.

Scope:

- improve Vite and SPA static-output route guidance
- add a deterministic SPA fixture with user-supplied route-list coverage
- add framework-specific remediation hints for source findings
- improve repo report language so developers know which source file, build artifact, config, or generated output to inspect next
- add GitHub Actions CI examples that upload JSON, Markdown, and HTML reports

Exit criteria:

- Vite/SPA route behavior has fixture coverage
- route-list workflow is documented with copy-paste commands
- repo source findings include actionable next-inspection guidance
- CI example is validated enough to be trustworthy

### Track 3: Report Usefulness Polish

This track makes generated reports easier to act on while preserving deterministic evidence boundaries.

Scope:

- distinguish live URL audits from repo/build audits more clearly in Markdown and HTML
- improve top-priority language for fast triage
- add deterministic remediation task copy for common findings:
  - missing canonical
  - missing primary heading
  - missing meta description
  - missing generated sitemap
  - missing generated robots file
  - missing Organization structured data
- strengthen evidence-gap wording so missing measured evidence is understandable without sounding like a site defect

Exit criteria:

- HTML and Markdown reports are clearer for both developers and non-technical readers
- golden report fixtures reflect the new report language
- no report wording claims rankings, SERP positions, or AI-answer visibility without supplied evidence

### Track 4: Public Docs And Examples

This track turns the repository into a better onboarding surface.

Scope:

- reorganize README around install, live audit, repo audit, CI gate, and interpreting reports
- add `audit.config.json` documentation
- add "Which command should I run?" guidance
- add a Superbuilders example summary using the completed smoke test as a real-world proof point
- keep detailed development notes separate from user-facing getting-started docs

Exit criteria:

- a new user can install RankForge, run a live audit, run a repo audit, and understand the report sections without reading source code
- Superbuilders example demonstrates real output without implying endorsement or guaranteed ranking improvement
- docs remain concise enough that the README is not a dumping ground for every implementation detail

### Track 5: Release Automation

This track makes the next release less manual and less fragile.

Scope:

- add or refine GitHub Actions workflow for npm publishing
- evaluate npm provenance and trusted publishing for RankForge
- update the release checklist so tag, GitHub release, npm package, registry install, and CLI smoke checks are verified in one path
- decide whether versioning remains manual or moves to an npm-version based flow
- document rollback and republish constraints for npm releases

Exit criteria:

- maintainers have a repeatable release path that does not depend on memory
- next release has a clear preflight and post-publish verification sequence
- release automation does not weaken package publishing security

## Architecture And Boundaries

The five tracks should be implemented in sequence. Each track should produce a separately reviewable branch or commit series.

Recommended planning model:

1. Keep this document as the master roadmap spec.
2. Create one implementation plan per track, starting with Track 1.
3. Execute and verify a track before writing the next detailed implementation plan.
4. Update the roadmap only when the completed track changes later-track assumptions.

This avoids stale over-planning while preserving a clear product direction.

## Data Flow Considerations

RankForge must keep the same evidence discipline across all tracks:

- CLI output remains the source of deterministic facts.
- Reports and docs may explain evidence, but must not invent observed rankings or AI visibility.
- Repo audit improvements may connect source-level findings to generated output, but only when the evidence exists in repo detection, build output, route lists, static files, manifests, or audit results.
- CI examples should treat JSON, Markdown, and HTML reports as artifacts, not as mutable deployment inputs.

## Error Handling And Safety

The next tracks should keep these constraints intact:

- no automatic dependency installation or inferred command execution without explicit user command input
- restricted mode remains the recommended default for untrusted live URLs
- repo build and preview commands remain explicit
- report language distinguishes evidence gaps from defects
- release automation must not expose npm tokens or require secrets in logs
- npm publish automation should prefer trusted publishing or scoped granular tokens over broad long-lived tokens

## Testing Strategy

Track-level implementation plans should include focused verification:

- docs-only changes: `git diff --check`, relevant `rg` checks, and markdown/link sanity checks where practical
- CLI/report changes: targeted tests first, then full `npm test`
- validation-impacting changes: `npm run validate`
- release/package changes: `npm audit --omit=dev`, `npm pack`, installed tarball smoke, and registry install smoke when publishing
- CI workflow changes: local YAML review plus GitHub Actions run verification after push
- report copy changes: golden fixture updates with intentional diffs

## Risks

- Over-expanding Track 2 could turn repo audit maturity into a framework-integration project. Keep it focused on Vite/SPA route handling, source findings, and CI examples.
- Track 3 could drift into subjective copywriting. Keep report prose deterministic and evidence-bound.
- Track 4 could bloat the README. Keep longer references in docs files and link from the README.
- Track 5 could over-automate publishing before the npm security model is settled. Favor a secure documented manual step over unsafe automation.

## Non-Goals For These Five Tracks

These tracks will not add:

- Search Console API integration
- SERP provider integration
- automated AI-answer probes
- automatic Lighthouse execution
- hosted dashboard or SaaS workflow
- automatic code modifications to audited sites
- ranking guarantees or unsupported GEO measurement claims

Those integrations belong after the local-first CLI and repo-audit workflow feels sturdy.

## Completion Definition

The five-track phase is complete when:

- the repository accurately reflects the published state of RankForge
- `audit-repo` has stronger Vite/SPA and CI ergonomics
- reports are clearer and more actionable
- public docs let new users succeed without reading implementation code
- release automation and checklist coverage make the next npm release repeatable
- all changes preserve deterministic evidence boundaries and pass CI

## Next Step After Approval

After this spec is approved, create the Track 1 implementation plan first. Do not generate detailed plans for all five tracks at once unless the user explicitly asks for a full omnibus plan. The implementation details for later tracks should benefit from what Track 1 changes.
