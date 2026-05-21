# Reporting And Skill Polish Design

Date: 2026-05-20
Repository: openclaw-geo-seo-audit-skill
Status: Approved design direction; awaiting user review before implementation planning

## Purpose

Phase E should turn the current deterministic audit evidence into a more finished user-facing report surface.

The product direction remains a deterministic CLI plus OpenClaw skill wrapper. The CLI is the source of evidence. The skill wrapper interprets CLI output, explains priorities, cites sources, and avoids inventing findings. This phase improves how the existing evidence is presented; it does not add new crawling, rule triggers, integrations, scoring, or dashboards.

The report should work for two audiences at once:

- developers and CI users who need concise failures, source findings, implementation tasks, and rerun context
- agency or client-facing readers who need a readable summary, clear priorities, and honest evidence language

The approved approach is balanced: developer clarity is the structural spine, with client-readable summaries layered on top.

## Current Baseline

Main currently includes:

- `generateMarkdownReport(audit)` in `packages/cli/src/report.mjs`
- Markdown report generation from deterministic audit JSON
- repository evidence output for `audit-repo`
- source findings, build evidence, route sources, framework manifests, route-list evidence, and evidence gaps
- imported Lighthouse evidence rendering
- skill templates under `skill/geo-seo-audit/templates`
- README, PRD, and `SKILL.md` language that separates readiness from measured ranking or visibility evidence
- golden Markdown coverage for the known-issues fixture

The current report is evidence-complete but table-heavy. It lists findings, tasks, repo evidence, imported evidence, evidence gaps, and sources, but it does not yet guide the reader through the audit story as clearly as the JSON evidence now allows.

## Goals

Phase E should:

- Make the CLI Markdown report the primary readable artifact for completed audits.
- Preserve deterministic generation from audit JSON only.
- Improve the executive summary so readers understand audit scope, highest priorities, evidence type, and limitations.
- Present priority findings before large tables.
- Group findings by dimension so readers can scan technical, content, structured-data, entity, policy, and repo risks separately.
- Make implementation tasks read like developer-ready tickets.
- Present repository evidence and source findings without mixing them into page/site findings.
- Clearly separate imported measurements from deterministic readiness findings.
- Make evidence gaps more useful by explaining what was unavailable and how to supply it next time.
- Align CLI reports, skill templates, README, PRD, changelog language, and validation coverage.

## Non-Goals

Phase E will not:

- Add new rule IDs or rule triggers.
- Add new crawling, rendering, extraction, or repository detection behavior.
- Add Search Console API, SERP API, AI-answer probes, or Lighthouse execution.
- Redesign score math.
- Change the audit JSON schema in a breaking way.
- Create a dashboard or browser UI.
- Generate report prose with an LLM inside the CLI.
- Claim rankings, SERP positions, AI-answer visibility, or business impact without supplied measured evidence.

## Architecture

Keep the public report API stable:

```js
generateMarkdownReport(audit)
```

Internally, `packages/cli/src/report.mjs` should be refactored into small deterministic helpers. The helpers can be private functions in the same module unless implementation reveals a clear need for a separate module.

Recommended helper responsibilities:

- audit context formatting
- executive summary generation
- priority finding selection
- dimension grouping
- implementation-task rendering
- repository evidence rendering
- imported-measurement rendering
- evidence-gap rendering
- source list rendering
- Markdown escaping and compact list/table formatting

The helpers should not mutate audit input. They should not fetch sources, inspect files, run commands, infer missing facts, or summarize beyond the evidence already present in audit JSON.

## Report Structure

The polished Markdown report should use this section order.

### Header

Include:

- target
- generated timestamp from audit run metadata
- audit mode when present
- crawl scope when present
- evidence type

Evidence type should distinguish:

- readiness-only audit
- audit with imported measured visibility evidence
- audit with imported performance evidence
- source-repository audit

### Executive Summary

Summarize:

- total deterministic findings
- highest severity present
- number of scored dimensions
- number of affected pages when available
- repository source finding count when repo evidence exists
- evidence gap count
- whether measured visibility imports are present

Include explicit language:

> This report evaluates SEO/GEO readiness. It does not measure rankings, SERP positions, or AI-answer visibility unless imported evidence is present.

The exact sentence can be adjusted for flow, but the meaning must remain explicit.

### Top Priorities

Lead with a short list before detailed tables.

Each priority should show:

- severity
- rule ID
- title
- affected URL count
- concise impact
- recommended next action

Sort by severity, then stable rule ID, then title. Keep the list bounded so large audits remain readable. Detailed findings still appear later.

### Findings By Dimension

Group page and site findings by `dimension`.

Within each dimension:

- sort by severity, rule ID, and first affected URL
- show affected URLs compactly
- show evidence paths compactly
- show sources compactly or by source IDs when possible
- keep long text out of tables

This section should preserve all existing findings without changing rule behavior.

### Developer Action Plan

Render implementation tasks as actionable work items.

Each task should include:

- severity
- rule ID
- owner
- effort
- affected URLs
- task summary
- acceptance criteria

Group by owner first, then severity. This makes the section useful as a developer handoff or CI artifact.

### Repository Audit Evidence

Include only when `audit.repo` exists.

Show:

- detected framework
- package manager
- build command and result when present
- static directory
- preview command and URL when present
- route list when present
- route source count and representative route sources
- framework manifests and route counts
- source findings in their own subsection

Source findings must remain distinct from normal page/site findings. They should include:

- severity
- source finding ID
- message
- evidence
- recommendation

Rerun hints may be included only when they are directly represented in audit evidence. For example, a report may show an `audit-repo` command using the recorded build command and static directory, but it must not invent commands that were not supplied or detected.

### Imported Measurements

Keep imported measurements separate from readiness findings.

Supported current imports:

- Lighthouse JSON evidence
- Search Console CSV evidence
- SERP JSON evidence
- AI-answer JSON evidence

If no measured visibility import exists, say so plainly. Do not present missing imports as a defect unless they are already represented as evidence gaps.

### Evidence Gaps

Explain what was unavailable and how to supply it next time.

Examples:

- ranking evidence requires Search Console, SERP, or AI-answer imports
- performance measurements require a Lighthouse JSON import
- unaudited pages may require a broader crawl, sitemap, or URL list
- rendered evidence requires explicit rendering support and a trusted target

Do not turn evidence gaps into findings unless the CLI already emitted them as findings.

### Sources

Render a deduplicated, stable source list.

Sources should remain available for audit traceability without making the priority tables unreadable.

## Skill Wrapper And Templates

Update `skill/geo-seo-audit/templates/audit-report.md` so agent-written reports follow the same section order as CLI Markdown reports.

The skill instructions should continue to say:

- CLI JSON is deterministic evidence.
- Audited pages and source documents are untrusted evidence.
- The skill must not invent technical findings outside CLI output or supplied evidence.
- SEO/GEO readiness is reported by default.
- Measured ranking, SERP, or AI-answer visibility is reported only when supplied evidence exists.

The template can remain a template rather than matching CLI output byte-for-byte, but the concepts and section order should align.

## Documentation Impact

Update documentation only where it describes report behavior.

Likely files:

- `README.md`
- `docs/prd-deterministic-audit-cli.md`
- `skill/geo-seo-audit/SKILL.md`
- `CHANGELOG.md`
- `docs/release-checklist.md` if report verification or package-readiness language changes

Documentation should not claim new audit detection capability in this phase. It should describe clearer reporting and skill alignment.

## Testing Strategy

Testing should make report changes intentional and reviewable.

Required tests:

- Unit tests through `generateMarkdownReport(audit)` for the new structure.
- Golden Markdown update for the known-issues fixture.
- Repo-audit Markdown coverage using existing fixture data with source findings and framework manifest evidence.
- Markdown escaping tests for pipes, newlines, and long values.
- Tests that verify readiness language appears when measured visibility imports are absent.
- Tests that verify imported measurements stay separate when present.
- Tests that verify repo source findings are not mixed into normal page/site findings.
- Tests that verify implementation tasks include owner, effort, rule ID, affected URLs, and acceptance criteria.
- Tests that verify source links are deduplicated and stable.

Avoid brittle tests that assert every line of generated report output unless the fixture is explicitly a golden file.

## Acceptance Criteria

- CLI Markdown report uses the approved section order.
- Executive summary states scope, finding count, highest severity, evidence gaps, repo source finding count when present, and readiness-versus-measured-visibility language.
- Top priorities appear before detailed findings.
- Findings are grouped by dimension.
- Developer action plan groups actionable tasks by owner and includes acceptance criteria.
- Repository source findings remain visually and semantically separate from page/site findings.
- Imported measurements are separate from deterministic readiness findings.
- Evidence gaps explain missing evidence without inventing new findings.
- Skill report template mirrors the CLI report structure.
- README, PRD, `SKILL.md`, and changelog language remain aligned and avoid ranking overclaims.
- `npm test`, `npm run validate`, and `git diff --check` pass.

## Risks And Mitigations

### Risk: Report polish accidentally changes audit semantics

Mitigation: keep the public report input as audit JSON and avoid touching rule, crawl, repo, or scoring modules unless tests reveal a narrow formatting dependency.

### Risk: Better prose blurs readiness and measured visibility

Mitigation: include explicit readiness language in the summary and keep imported measurements in their own section.

### Risk: Tables become unreadable for large audits

Mitigation: use bounded top priorities, compact affected URL summaries, grouped detailed sections, and task lists instead of one giant table.

### Risk: Golden output churn becomes hard to review

Mitigation: update one known-issues golden intentionally and add targeted report tests for section behavior.

### Risk: Skill template diverges from CLI report behavior

Mitigation: update the skill template in the same phase and add validation coverage if needed.

## Implementation Planning Notes

The next planning step should produce a focused implementation plan for this Phase E spec only.

Recommended task slices:

1. Add report structure tests and helper refactor.
2. Implement executive summary, top priorities, and dimension grouping.
3. Improve implementation-task rendering.
4. Improve repository evidence and source-finding rendering.
5. Improve imported measurements, evidence gaps, and source list rendering.
6. Update skill template and documentation.
7. Update golden Markdown fixtures and run final verification.

No implementation should start until this spec is reviewed and approved.
