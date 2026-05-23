# RankForge GEO/SEO Audit Report

Target: http://fixture.test/out/index.html
Generated: <generated>
Audit mode: single
Crawl scope: single, max n/a pages, depth n/a
Evidence type: source-repository audit

## Executive Summary

Found 5 deterministic findings across 3 scored dimensions.
Highest severity: P2
Audited pages: 2
Affected pages: 2
Repository source findings: 1
Evidence gaps: 1

This report evaluates SEO/GEO readiness. It does not measure rankings, SERP positions, or AI-answer visibility unless imported evidence is present.

## Top Priorities

- **P2** `content.thin_content` - Page has limited useful main content
  - Affected URLs: 1
  - Impact: Thin pages are less likely to satisfy visitor tasks or support AI/search answerability.
  - Next action: Expand visible content to satisfy the visitor's task with original, helpful information.
- **P2** `content.thin_content` - Page has limited useful main content
  - Affected URLs: 1
  - Impact: Thin pages are less likely to satisfy visitor tasks or support AI/search answerability.
  - Next action: Expand visible content to satisfy the visitor's task with original, helpful information.
- **P2** `entity.about_contact_missing` - Organization identity or contact details are missing
  - Affected URLs: 1
  - Impact: Homepage-like pages should expose crawlable about or contact paths for entity trust signals.
  - Next action: Make organization identity, contact, and trust details easy to find on crawlable pages.
- **P2** `structured_data.organization_missing` - Organization structured data is missing or unclear
  - Affected URLs: 1
  - Impact: Homepage-like pages should make organization identity clear where visible content supports it.
  - Next action: Add Organization structured data where visible business identity supports it.
- **P2** `structured_data.organization_missing` - Organization structured data is missing or unclear
  - Affected URLs: 1
  - Impact: Homepage-like pages should make organization identity clear where visible content supports it.
  - Next action: Add Organization structured data where visible business identity supports it.

## Findings By Dimension

### Entity Clarity

| Severity | Rule | Finding | Affected URLs | Evidence | Sources |
|---|---|---|---|---|---|
| P2 | entity.about_contact_missing | Organization identity or contact details are missing | http://fixture.test/out/about/index.html | $.pages[1].evidence.links | https://developers.google.com/search/docs/essentials; https://developers.google.com/search/docs/appearance/structured-data/organization |

### Helpful Content

| Severity | Rule | Finding | Affected URLs | Evidence | Sources |
|---|---|---|---|---|---|
| P2 | content.thin_content | Page has limited useful main content | http://fixture.test/out/about/index.html | $.pages[1].evidence.counts.visibleTextCharacters | https://developers.google.com/search/docs/fundamentals/creating-helpful-content |
| P2 | content.thin_content | Page has limited useful main content | http://fixture.test/out/index.html | $.pages[0].evidence.counts.visibleTextCharacters | https://developers.google.com/search/docs/fundamentals/creating-helpful-content |

### Structured Data

| Severity | Rule | Finding | Affected URLs | Evidence | Sources |
|---|---|---|---|---|---|
| P2 | structured_data.organization_missing | Organization structured data is missing or unclear | http://fixture.test/out/about/index.html | $.pages[1].evidence.structuredData | https://developers.google.com/search/docs/appearance/structured-data/organization; https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data |
| P2 | structured_data.organization_missing | Organization structured data is missing or unclear | http://fixture.test/out/index.html | $.pages[0].evidence.structuredData | https://developers.google.com/search/docs/appearance/structured-data/organization; https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data |

## Scores

| Dimension | Score | Findings |
|---|---:|---|
| entity_clarity | 80 | entity.about_contact_missing |
| helpful_content | 60 | content.thin_content; content.thin_content |
| structured_data | 60 | structured_data.organization_missing; structured_data.organization_missing |

## Developer Action Plan

### Content

- **P2** `content.thin_content` - Effort: S - Expand visible content to satisfy the visitor's task with original, helpful information.
  - Affected URLs: http://fixture.test/out/about/index.html
  - Acceptance criteria: The content.thin_content finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.
- **P2** `content.thin_content` - Effort: S - Expand visible content to satisfy the visitor's task with original, helpful information.
  - Affected URLs: http://fixture.test/out/index.html
  - Acceptance criteria: The content.thin_content finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.
- **P2** `entity.about_contact_missing` - Effort: S - Make organization identity, contact, and trust details easy to find on crawlable pages.
  - Affected URLs: http://fixture.test/out/about/index.html
  - Acceptance criteria: The entity.about_contact_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.

### Engineering

- **P2** `structured_data.organization_missing` - Effort: S - Add Organization structured data where visible business identity supports it.
  - Affected URLs: http://fixture.test/out/about/index.html
  - Acceptance criteria: The structured_data.organization_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.
- **P2** `structured_data.organization_missing` - Effort: S - Add Organization structured data where visible business identity supports it.
  - Affected URLs: http://fixture.test/out/index.html
  - Acceptance criteria: The structured_data.organization_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.

## Repository Audit Evidence

- Path: http://fixture.test
- Framework: next
- Package manager: npm
- Repo audit mode: static output
- Static dir: out
- Preview command: n/a
- Preview URL: n/a
- Build command: npm run build
- Build executed: yes
- Build result: exit 0 in <duration> ms
- Route list: n/a
- Route sources: 2
- Framework manifests: 1
- Repository source findings: 1

### Repository Routes

| Type | Route | Source |
|---|---|---|
| static_html | / | http://fixture.test/out/index.html |
| static_html | /about/ | http://fixture.test/out/about/index.html |

### Framework Route Manifests

| Type | Routes | Path |
|---|---:|---|
| next_prerender_manifest | 3 | http://fixture.test/.next/prerender-manifest.json |

### Repository Source Findings

| Severity | Source Finding | Message | Evidence | Inspect Next | Next Action | Acceptance Check |
|---|---|---|---|---|---|---|
| P1 | repo.manifest_route_missing | Framework route manifest lists a route that is missing from static output. | /missing/ | framework route manifest; generated static output; framework route configuration | Update the framework build/export configuration so every manifest route is emitted to static output, or remove stale route metadata. | Rerun RankForge and confirm repo.manifest_route_missing is absent. |

## Imported Measurements

No imported measurements. Ranking, SERP, AI-answer, and Lighthouse measurements are reported only when supplied as evidence imports.

## Evidence Gaps

- ranking.integrations_missing: Measured rankings, SERP positions, and AI answer visibility require Search Console, SERP, or AI answer evidence.

How to close common gaps:
- Add `--search-console`, `--serp`, or `--ai-answers` to report observed visibility.
- Add `--lighthouse` to report imported performance evidence.
- Increase crawl scope when important templates or page types are missing.
- Use trusted rendering when important content depends on client-side JavaScript.
