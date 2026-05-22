# Developer Repo Audit Next Phase

## Goal

Make RankForge source-repository audits more actionable for developers before npm release follow-up work expands into hosted or external integrations.

## Current Baseline

- `detect-repo` identifies Vite, Next.js, Astro, package manager, and likely build or preview commands.
- `audit-repo` supports explicit build commands, explicit preview commands, static output audits, route lists, repo config, fail-on thresholds, and HTML/Markdown/JSON reports.
- Superbuilders smoke coverage confirms RankForge can audit both a live production URL and a cloned Vite source repository with explicit `npm run build` and `dist` output.

## Next Work Sequence

1. Add framework-specific remediation hints to repository source findings.
2. Improve static route evidence for Vite and SPA-style apps where `dist/index.html` represents client-routed pages.
3. Add clearer developer action tasks for missing generated `robots.txt`, missing generated `sitemap.xml`, missing canonical tags, and missing primary headings.
4. Add CI examples for GitHub Actions that upload JSON, Markdown, and HTML audit artifacts.
5. Add fixture coverage for an SPA with a route manifest or user-supplied route list to avoid over-reporting single-route output.
6. Add report copy that distinguishes production URL audits from source-repository audits when both are run for the same site.

## Acceptance Criteria

- Repo reports tell developers which source/build artifact to inspect next, not only which rendered page failed.
- CI users can copy one documented workflow and get JSON, Markdown, and HTML artifacts.
- SPA route coverage has at least one deterministic fixture and one documented recommended config.
- Live URL and repo audit results remain explicitly separate evidence types.
