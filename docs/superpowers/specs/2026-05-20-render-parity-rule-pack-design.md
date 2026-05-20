# Render Parity Rule Pack Design

Date: 2026-05-20
Repository: openclaw-geo-seo-audit-skill
Status: Approved design direction; awaiting user review before implementation planning

## Purpose

This spec defines Phase D.1 of the deterministic GEO/SEO audit PRD: a render parity rule pack for developer repo audits.

The product direction remains a deterministic audit CLI plus OpenClaw skill wrapper. The CLI is the source of evidence. The skill wrapper interprets CLI evidence, explains priorities, cites sources, and avoids inventing findings. This phase improves repo-audit depth by detecting when raw or generated HTML differs from rendered HTML in ways that create SEO/GEO readiness risk.

## User-Approved Direction

The approved direction is:

- Focus Phase D on developer repo audit depth.
- Use an output-first approach with repo context.
- Center the first rule cluster on raw/rendered parity and primary-content risk.
- Evaluate these rules only when render evidence already exists through explicit `--render auto|always` or an injected renderer.
- Add a small set of specific rules rather than one broad finding or a large rule explosion.
- Use a focused rule pack with a small helper module so comparison logic stays testable and does not bloat `rule-engine.mjs`.

## Current Baseline

Already implemented on `main`:

- `snapshot.mjs` can collect raw evidence and optional rendered evidence.
- Rendered evidence is stored under `snapshot.render` when rendering is requested and succeeds.
- `technical.raw_rendered_mismatch` exists, but currently only checks a large visible-text character delta.
- `technical.rendered_content_missing` exists in the rule registry but is not yet meaningfully triggered.
- Repo audits support explicit static-output and preview-server workflows.
- Next.js and Astro fixture repos exist for deterministic repo audit coverage.
- Findings already include rule IDs, severity, dimension, evidence paths, implementation tasks, confidence, sources, and page indexes.

## Goals

Add deterministic page-level findings that help developers identify SEO/GEO risks caused by JavaScript rendering, hydration, or client-only mutations.

The rule pack should identify:

- Rendered title changes or disappearance.
- Rendered meta description changes or disappearance.
- Rendered canonical URL changes or disappearance.
- Rendered primary heading disappearance.
- Rendered structured-data count or type loss.
- Material visible-text deltas with better evidence than the current broad check.

The findings should help answer: "If I audit this repo output before deployment, will crawlers and users see the same primary SEO/GEO signals after rendering?"

## Non-Goals

This phase will not:

- Enable rendering by default.
- Install Playwright or browser dependencies automatically.
- Parse framework source files deeply.
- Infer framework metadata exports from React, Next.js, Astro, or other source code.
- Add a new audit profile such as `--profile repo-depth`.
- Claim measured ranking impact.
- Replace external evidence integrations for Search Console, SERP visibility, AI-answer visibility, or Lighthouse execution.
- Change the output schema shape in a breaking way.

## Architecture

### Render Parity Helper

Add a focused helper module at `packages/cli/src/render-parity.mjs`.

Responsibilities:

- Accept a snapshot or raw/rendered evidence pair.
- Return normalized parity facts for values already extracted by `html-extract.mjs`.
- Compare raw and rendered values for:
  - title
  - meta description
  - canonical
  - H1 values
  - visible text character counts
  - structured data block count
  - structured data schema types
- Produce stable evidence path metadata for each detected difference.
- Avoid rule severity decisions; the rule engine owns finding creation.

The helper should be pure and unit-testable. It should not read files, run browsers, inspect frameworks, or mutate snapshots.

### Rule Engine Integration

`packages/cli/src/rule-engine.mjs` should call the helper only when:

- `snapshot.render?.status === "rendered"`
- `snapshot.render.evidence` exists

If rendering was not requested, failed, or was unavailable, no render parity rules should fire. Evidence gaps for unavailable rendering are out of scope for this phase because the user explicitly chose explicit render evidence only.

### Rule Registry

Add or activate a small rule set in `packages/cli/src/rules.mjs`.

Recommended rule IDs:

- `technical.rendered_title_changed`
- `technical.rendered_description_changed`
- `technical.rendered_canonical_changed`
- `technical.rendered_primary_heading_missing`
- `technical.rendered_structured_data_lost`
- `technical.raw_rendered_mismatch`
- `technical.rendered_content_missing`

`technical.raw_rendered_mismatch` already exists and should be enriched rather than duplicated. `technical.rendered_content_missing` already exists and should become meaningful when raw HTML has primary content but rendered evidence loses it.

Rule severities:

- `technical.rendered_canonical_changed`: `P1`
- `technical.rendered_primary_heading_missing`: `P1`
- `technical.rendered_content_missing`: existing `P1`
- `technical.rendered_structured_data_lost`: `P2`
- `technical.rendered_title_changed`: `P2`
- `technical.rendered_description_changed`: `P3`
- `technical.raw_rendered_mismatch`: existing `P2`

Severity should remain conservative. The rule text should describe eligibility and readiness risk, not ranking loss.

## Finding Behavior

Each finding should include:

- Stable rule ID.
- Existing severity/dimension model.
- Affected URL.
- Raw evidence path.
- Rendered evidence path.
- Impact text that names the specific changed signal.
- Existing implementation task format.
- Engineering owner.
- Confidence of `high` when raw and rendered evidence directly contradict each other.
- Existing Google Search Central citations through the rule registry.

Evidence should be path-oriented by default, for example:

- `$.pages[0].evidence.title`
- `$.pages[0].render.evidence.title`
- `$.pages[0].evidence.canonical`
- `$.pages[0].render.evidence.canonical`
- `$.pages[0].evidence.structuredData`
- `$.pages[0].render.evidence.structuredData`

Avoid embedding long page text in findings. If snippets are added, cap them tightly and normalize whitespace.

## Rule Trigger Details

### Rendered Title Changed

Trigger when raw title exists and rendered title is missing or materially different after trimming and whitespace normalization.

Do not trigger when both titles are absent; existing missing-title logic handles raw missing titles.

### Rendered Description Changed

Trigger when raw meta description exists and rendered description is missing or materially different after normalization.

This should be lower severity than title or canonical changes because descriptions influence snippet eligibility but are not guaranteed snippets.

### Rendered Canonical Changed

Trigger when raw canonical exists and rendered canonical is missing or normalizes to a different URL.

This should use URL normalization where possible. If URL normalization fails, compare normalized strings.

### Rendered Primary Heading Missing

Trigger when raw H1 evidence exists and rendered H1 evidence is empty.

Do not trigger for H1 copy changes unless the rendered H1 becomes empty. Fine-grained heading-copy changes can be a later Phase D.2 if needed.

### Rendered Structured Data Lost

Trigger when raw JSON-LD structured data exists and rendered evidence has fewer valid structured-data blocks or loses schema types that existed in raw evidence.

Do not trigger when raw structured data is invalid; `structured_data.invalid_jsonld` already handles parse failure.

### Rendered Content Missing

Use `technical.rendered_content_missing` when raw visible text indicates a meaningful page but rendered visible text drops below a low threshold.

Trigger:

- raw visible text characters >= 300
- rendered visible text characters < 150

### Raw/Rendered Mismatch

Keep `technical.raw_rendered_mismatch` as a broader P2 signal for large text deltas when content is not nearly missing.

Trigger:

- absolute visible-text delta > 300 characters
- and rendered content is not already below the `rendered_content_missing` threshold

This prevents duplicate broad findings when the stronger content-missing rule already explains the risk.

## Testing Strategy

### Unit Tests

Add direct tests for the render parity helper:

- no render evidence returns no parity facts
- title changed
- description removed
- canonical changed with URL normalization
- primary heading removed
- structured data type lost
- visible text nearly missing
- large text delta without near-total loss
- unchanged raw/rendered evidence returns no facts

### Rule Tests

Add `rule-engine` tests for each new or activated finding:

- one triggering snapshot
- one false-positive guard where raw and rendered evidence match
- evidence paths include both raw and rendered paths
- severity and owner match the registry/default model

### Fixture Tests

At least one repo or static fixture should exercise render parity through an injected renderer so tests do not require Playwright.

The fixture should make raw/generated HTML contain SEO/GEO-critical signals and have the injected renderer remove or alter them. This keeps CI deterministic and avoids browser installation assumptions.

### Golden Outputs

Update golden summaries only where intentional. Prefer focused rule tests over large golden churn.

### Validation

`npm test` and `npm run validate` must pass. If new files become required for the skill package or test coverage, update `scripts/validate-skill.mjs`.

## Reporting And Skill Impact

No new report section is required in this phase. Existing Markdown finding output should display the new rule findings.

The skill wrapper should not need behavioral changes for Phase D.1 unless implementation changes finding wording or evidence gaps. If skill language is touched, it should reinforce:

- render parity findings are readiness risks
- they are based on explicit rendered evidence
- they do not claim measured rankings

## Risks And Mitigations

### Risk: Noisy render differences

Mitigation: normalize whitespace, compare stable extracted fields, use conservative thresholds, and avoid firing on insignificant copy variation.

### Risk: Rendering becomes unexpectedly expensive

Mitigation: do not change default rendering behavior. Rules only evaluate when render evidence already exists.

### Risk: Duplicate findings

Mitigation: make `technical.rendered_content_missing` suppress the broad `technical.raw_rendered_mismatch` for near-total content loss.

### Risk: Framework-specific overreach

Mitigation: keep this phase output-first. Do not parse source files or infer framework metadata conventions.

### Risk: Ranking overclaims

Mitigation: keep wording about crawl/render consistency, search eligibility, and readiness. Do not claim ranking loss.

## Acceptance Criteria

- Render parity helper exists and has direct unit tests.
- Render parity findings fire only when rendered evidence exists.
- New or activated rule IDs are present in `rules.mjs` and work with `explain-rule`.
- Page-level rule tests cover each new or activated finding and at least one false-positive guard.
- Evidence paths point to both raw and rendered values.
- No default rendering behavior changes.
- Existing repo-audit, route-list, framework-manifest, and report behavior remains compatible.
- `npm test`, `npm run validate`, and `git diff --check` pass before implementation is considered complete.

## Implementation Planning Notes

The next planning step should produce a focused implementation plan for this Phase D.1 spec only.

Recommended task slices:

1. Add render parity helper and tests.
2. Add or activate rule registry entries.
3. Integrate parity facts into `rule-engine.mjs`.
4. Add fixture/injected-renderer coverage.
5. Update documentation/changelog only for user-visible behavior.
6. Run full verification and request review before merge.
