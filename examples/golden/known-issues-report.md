# GEO/SEO Audit Report

Target: http://fixture.test/
Generated: <generated>
Audit mode: full
Crawl scope: full, max 12 pages, depth 1
Evidence type: readiness-only audit

## Executive Summary

Found 17 deterministic findings across 5 scored dimensions.
Highest severity: P1
Audited pages: 9
Affected pages: 10
Repository source findings: 0
Evidence gaps: 1

This report evaluates SEO/GEO readiness. It does not measure rankings, SERP positions, or AI-answer visibility unless imported evidence is present.

## Top Priorities

- **P1** `crawl.robots_blocked` - robots.txt blocks an important page or resource
  - Affected URLs: 1
  - Impact: robots.txt blocks a URL discovered during crawl evidence collection.
  - Next action: Update robots.txt rules so important pages and resources needed for rendering can be crawled.
- **P1** `structured_data.invalid_jsonld` - JSON-LD structured data is invalid
  - Affected URLs: 1
  - Impact: Invalid JSON-LD cannot be parsed reliably for structured data eligibility.
  - Next action: Fix JSON-LD syntax so structured data can be parsed reliably.
- **P1** `technical.https_missing` - Page is not available over HTTPS
  - Affected URLs: 1
  - Impact: Important pages should be available over HTTPS.
  - Next action: Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL.
- **P1** `technical.https_missing` - Page is not available over HTTPS
  - Affected URLs: 1
  - Impact: Important pages should be available over HTTPS.
  - Next action: Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL.
- **P1** `technical.https_missing` - Page is not available over HTTPS
  - Affected URLs: 1
  - Impact: Important pages should be available over HTTPS.
  - Next action: Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL.

## Findings By Dimension

### Crawl Index

| Severity | Rule | Finding | Affected URLs | Evidence | Sources |
|---|---|---|---|---|---|
| P1 | crawl.robots_blocked | robots.txt blocks an important page or resource | http://fixture.test/blocked.html | $.site.skipped | https://developers.google.com/search/docs/crawling-indexing/robots/intro; https://developers.google.com/search/docs/essentials/technical |
| P2 | indexability.noncanonical_in_sitemap | Sitemap includes non-canonical URLs | http://fixture.test/canonical-alt.html | $.pages[8].evidence.canonical | https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview; https://developers.google.com/search/docs/crawling-indexing/canonicalization |

### Helpful Content

| Severity | Rule | Finding | Affected URLs | Evidence | Sources |
|---|---|---|---|---|---|
| P2 | content.thin_content | Page has limited useful main content | http://fixture.test/thin.html | $.pages[6].evidence.counts.visibleTextCharacters | https://developers.google.com/search/docs/fundamentals/creating-helpful-content |

### Search Appearance

| Severity | Rule | Finding | Affected URLs | Evidence | Sources |
|---|---|---|---|---|---|
| P2 | appearance.title_duplicate | Multiple pages use the same title | http://fixture.test/duplicate-a.html; http://fixture.test/duplicate-b.html | $.pages[4].evidence.title; $.pages[5].evidence.title | https://developers.google.com/search/docs/appearance/title-link |
| P3 | appearance.image_alt_missing | Important image is missing alt text | http://fixture.test/bad-json.html | $.pages[7].evidence.images | https://developers.google.com/search/docs/appearance/google-images |
| P3 | appearance.meta_description_duplicate | Multiple pages use the same meta description | http://fixture.test/duplicate-a.html; http://fixture.test/duplicate-b.html | $.pages[4].evidence.description; $.pages[5].evidence.description | https://developers.google.com/search/docs/appearance/snippet |

### Structured Data

| Severity | Rule | Finding | Affected URLs | Evidence | Sources |
|---|---|---|---|---|---|
| P1 | structured_data.invalid_jsonld | JSON-LD structured data is invalid | http://fixture.test/bad-json.html | $.pages[7].evidence.structuredData | https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data |
| P2 | structured_data.required_property_missing | Structured data is missing required properties | http://fixture.test/product.html | $.pages[3].evidence.structuredData[0] | https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data; https://developers.google.com/search/docs/appearance/structured-data/sd-policies |

### Technical

| Severity | Rule | Finding | Affected URLs | Evidence | Sources |
|---|---|---|---|---|---|
| P1 | technical.https_missing | Page is not available over HTTPS | http://fixture.test/ | $.pages[0].finalUrl | https://developers.google.com/search/docs/essentials |
| P1 | technical.https_missing | Page is not available over HTTPS | http://fixture.test/about.html | $.pages[1].finalUrl | https://developers.google.com/search/docs/essentials |
| P1 | technical.https_missing | Page is not available over HTTPS | http://fixture.test/bad-json.html | $.pages[7].finalUrl | https://developers.google.com/search/docs/essentials |
| P1 | technical.https_missing | Page is not available over HTTPS | http://fixture.test/canonical-alt.html | $.pages[8].finalUrl | https://developers.google.com/search/docs/essentials |
| P1 | technical.https_missing | Page is not available over HTTPS | http://fixture.test/contact.html | $.pages[2].finalUrl | https://developers.google.com/search/docs/essentials |
| P1 | technical.https_missing | Page is not available over HTTPS | http://fixture.test/duplicate-a.html | $.pages[4].finalUrl | https://developers.google.com/search/docs/essentials |
| P1 | technical.https_missing | Page is not available over HTTPS | http://fixture.test/duplicate-b.html | $.pages[5].finalUrl | https://developers.google.com/search/docs/essentials |
| P1 | technical.https_missing | Page is not available over HTTPS | http://fixture.test/product.html | $.pages[3].finalUrl | https://developers.google.com/search/docs/essentials |
| P1 | technical.https_missing | Page is not available over HTTPS | http://fixture.test/thin.html | $.pages[6].finalUrl | https://developers.google.com/search/docs/essentials |

## Scores

| Dimension | Score | Findings |
|---|---:|---|
| crawl_index | 40 | crawl.robots_blocked; indexability.noncanonical_in_sitemap |
| helpful_content | 80 | content.thin_content |
| search_appearance | 60 | appearance.image_alt_missing; appearance.title_duplicate; appearance.meta_description_duplicate |
| structured_data | 40 | structured_data.required_property_missing; structured_data.invalid_jsonld |
| technical | 0 | technical.https_missing; technical.https_missing; technical.https_missing; technical.https_missing; technical.https_missing; technical.https_missing; technical.https_missing; technical.https_missing; technical.https_missing |

## Developer Action Plan

### Engineering

- **P1** `crawl.robots_blocked` - Effort: M - Update robots.txt rules so important pages and resources needed for rendering can be crawled.
  - Affected URLs: http://fixture.test/blocked.html
  - Acceptance criteria: The crawl.robots_blocked finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.
- **P1** `structured_data.invalid_jsonld` - Effort: M - Fix JSON-LD syntax so structured data can be parsed reliably.
  - Affected URLs: http://fixture.test/bad-json.html
  - Acceptance criteria: The structured_data.invalid_jsonld finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.
- **P1** `technical.https_missing` - Effort: M - Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL.
  - Affected URLs: http://fixture.test/
  - Acceptance criteria: The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.
- **P1** `technical.https_missing` - Effort: M - Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL.
  - Affected URLs: http://fixture.test/about.html
  - Acceptance criteria: The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.
- **P1** `technical.https_missing` - Effort: M - Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL.
  - Affected URLs: http://fixture.test/bad-json.html
  - Acceptance criteria: The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.
- **P1** `technical.https_missing` - Effort: M - Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL.
  - Affected URLs: http://fixture.test/canonical-alt.html
  - Acceptance criteria: The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.
- **P1** `technical.https_missing` - Effort: M - Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL.
  - Affected URLs: http://fixture.test/contact.html
  - Acceptance criteria: The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.
- **P1** `technical.https_missing` - Effort: M - Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL.
  - Affected URLs: http://fixture.test/duplicate-a.html
  - Acceptance criteria: The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.
- **P1** `technical.https_missing` - Effort: M - Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL.
  - Affected URLs: http://fixture.test/duplicate-b.html
  - Acceptance criteria: The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.
- **P1** `technical.https_missing` - Effort: M - Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL.
  - Affected URLs: http://fixture.test/product.html
  - Acceptance criteria: The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.
- **P1** `technical.https_missing` - Effort: M - Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL.
  - Affected URLs: http://fixture.test/thin.html
  - Acceptance criteria: The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.
- **P2** `indexability.noncanonical_in_sitemap` - Effort: S - List only canonical, indexable URLs in sitemaps.
  - Affected URLs: http://fixture.test/canonical-alt.html
  - Acceptance criteria: The indexability.noncanonical_in_sitemap finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.
- **P2** `structured_data.required_property_missing` - Effort: S - Add the required properties for supported schema types when the page's visible content supports the markup.
  - Affected URLs: http://fixture.test/product.html
  - Acceptance criteria: The structured_data.required_property_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.

### SEO

- **P2** `appearance.title_duplicate` - Effort: S - Write unique titles that distinguish page purpose and topic.
  - Affected URLs: http://fixture.test/duplicate-a.html; http://fixture.test/duplicate-b.html
  - Acceptance criteria: The appearance.title_duplicate finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.
- **P3** `appearance.image_alt_missing` - Effort: S - Add descriptive alt text for meaningful images.
  - Affected URLs: http://fixture.test/bad-json.html
  - Acceptance criteria: The appearance.image_alt_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.
- **P3** `appearance.meta_description_duplicate` - Effort: S - Write unique descriptions that summarize each page's specific purpose.
  - Affected URLs: http://fixture.test/duplicate-a.html; http://fixture.test/duplicate-b.html
  - Acceptance criteria: The appearance.meta_description_duplicate finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.

### Content

- **P2** `content.thin_content` - Effort: S - Expand visible content to satisfy the visitor's task with original, helpful information.
  - Affected URLs: http://fixture.test/thin.html
  - Acceptance criteria: The content.thin_content finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance.

## Imported Measurements

No imported measurements. Ranking, SERP, AI-answer, and Lighthouse measurements are reported only when supplied as evidence imports.

## Evidence Gaps

- ranking.integrations_missing: Measured rankings, SERP positions, and AI answer visibility require Search Console, SERP, or AI answer evidence.

How to close common gaps:
- Add `--search-console`, `--serp`, or `--ai-answers` to report observed visibility.
- Add `--lighthouse` to report imported performance evidence.
- Increase crawl scope when important templates or page types are missing.
- Use trusted rendering when important content depends on client-side JavaScript.
