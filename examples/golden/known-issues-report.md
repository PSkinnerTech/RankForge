# GEO/SEO Audit Report

Target: http://fixture.test/
Generated: <generated>

## Executive Summary

Found 17 deterministic findings across 5 scored dimensions.

## Priority Findings

| Priority | Rule | Finding | Impact | Recommendation | Sources |
|---|---|---|---|---|---|
| P1 | technical.https_missing | Page is not available over HTTPS | Important pages should be available over HTTPS. | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | https://developers.google.com/search/docs/essentials |
| P1 | technical.https_missing | Page is not available over HTTPS | Important pages should be available over HTTPS. | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | https://developers.google.com/search/docs/essentials |
| P1 | technical.https_missing | Page is not available over HTTPS | Important pages should be available over HTTPS. | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | https://developers.google.com/search/docs/essentials |
| P1 | technical.https_missing | Page is not available over HTTPS | Important pages should be available over HTTPS. | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | https://developers.google.com/search/docs/essentials |
| P1 | technical.https_missing | Page is not available over HTTPS | Important pages should be available over HTTPS. | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | https://developers.google.com/search/docs/essentials |
| P1 | technical.https_missing | Page is not available over HTTPS | Important pages should be available over HTTPS. | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | https://developers.google.com/search/docs/essentials |
| P1 | technical.https_missing | Page is not available over HTTPS | Important pages should be available over HTTPS. | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | https://developers.google.com/search/docs/essentials |
| P1 | technical.https_missing | Page is not available over HTTPS | Important pages should be available over HTTPS. | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | https://developers.google.com/search/docs/essentials |
| P1 | structured_data.invalid_jsonld | JSON-LD structured data is invalid | Invalid JSON-LD cannot be parsed reliably for structured data eligibility. | Fix JSON-LD syntax so structured data can be parsed reliably. | https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data |
| P1 | technical.https_missing | Page is not available over HTTPS | Important pages should be available over HTTPS. | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | https://developers.google.com/search/docs/essentials |
| P1 | crawl.robots_blocked | robots.txt blocks an important page or resource | robots.txt blocks a URL discovered during crawl evidence collection. | Update robots.txt rules so important pages and resources needed for rendering can be crawled. | https://developers.google.com/search/docs/crawling-indexing/robots/intro, https://developers.google.com/search/docs/essentials/technical |
| P2 | structured_data.required_property_missing | Structured data is missing required properties | Product structured data is missing required properties: offers. | Add the required properties for supported schema types when the page's visible content supports the markup. | https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data, https://developers.google.com/search/docs/appearance/structured-data/sd-policies |
| P2 | content.thin_content | Page has limited useful main content | Thin pages are less likely to satisfy visitor tasks or support AI/search answerability. | Expand visible content to satisfy the visitor's task with original, helpful information. | https://developers.google.com/search/docs/fundamentals/creating-helpful-content |
| P2 | appearance.title_duplicate | Multiple pages use the same title | Duplicate titles make it harder to distinguish page purpose in search results. | Write unique titles that distinguish page purpose and topic. | https://developers.google.com/search/docs/appearance/title-link |
| P2 | indexability.noncanonical_in_sitemap | Sitemap includes non-canonical URLs | Sitemaps should list canonical URLs rather than alternates or duplicates. | List only canonical, indexable URLs in sitemaps. | https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview, https://developers.google.com/search/docs/crawling-indexing/canonicalization |
| P3 | appearance.image_alt_missing | Important image is missing alt text | Images without alt text provide weaker context for accessibility and image search. | Add descriptive alt text for meaningful images. | https://developers.google.com/search/docs/appearance/google-images |
| P3 | appearance.meta_description_duplicate | Multiple pages use the same meta description | Duplicate meta descriptions reduce page-specific snippet clarity. | Write unique descriptions that summarize each page's specific purpose. | https://developers.google.com/search/docs/appearance/snippet |

## Scores

| Dimension | Score | Findings |
|---|---:|---|
| technical | 0 | technical.https_missing, technical.https_missing, technical.https_missing, technical.https_missing, technical.https_missing, technical.https_missing, technical.https_missing, technical.https_missing, technical.https_missing |
| structured_data | 40 | structured_data.required_property_missing, structured_data.invalid_jsonld |
| helpful_content | 80 | content.thin_content |
| search_appearance | 60 | appearance.image_alt_missing, appearance.title_duplicate, appearance.meta_description_duplicate |
| crawl_index | 40 | crawl.robots_blocked, indexability.noncanonical_in_sitemap |

## Implementation Tasks

| Priority | Rule | Owner | Effort | Task | Acceptance Criteria |
|---|---|---|---|---|---|
| P1 | technical.https_missing | Engineering | M | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance. |
| P1 | technical.https_missing | Engineering | M | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance. |
| P1 | technical.https_missing | Engineering | M | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance. |
| P1 | technical.https_missing | Engineering | M | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance. |
| P1 | technical.https_missing | Engineering | M | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance. |
| P1 | technical.https_missing | Engineering | M | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance. |
| P1 | technical.https_missing | Engineering | M | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance. |
| P1 | technical.https_missing | Engineering | M | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance. |
| P1 | structured_data.invalid_jsonld | Engineering | M | Fix JSON-LD syntax so structured data can be parsed reliably. | The structured_data.invalid_jsonld finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance. |
| P1 | technical.https_missing | Engineering | M | Serve important pages over HTTPS and redirect HTTP variants to the HTTPS canonical URL. | The technical.https_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance. |
| P1 | crawl.robots_blocked | Engineering | M | Update robots.txt rules so important pages and resources needed for rendering can be crawled. | The crawl.robots_blocked finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance. |
| P2 | structured_data.required_property_missing | Engineering | S | Add the required properties for supported schema types when the page's visible content supports the markup. | The structured_data.required_property_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance. |
| P2 | content.thin_content | Content | S | Expand visible content to satisfy the visitor's task with original, helpful information. | The content.thin_content finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance. |
| P2 | appearance.title_duplicate | SEO | S | Write unique titles that distinguish page purpose and topic. | The appearance.title_duplicate finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance. |
| P2 | indexability.noncanonical_in_sitemap | Engineering | S | List only canonical, indexable URLs in sitemaps. | The indexability.noncanonical_in_sitemap finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance. |
| P3 | appearance.image_alt_missing | SEO | S | Add descriptive alt text for meaningful images. | The appearance.image_alt_missing finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance. |
| P3 | appearance.meta_description_duplicate | SEO | S | Write unique descriptions that summarize each page's specific purpose. | The appearance.meta_description_duplicate finding is no longer triggered for the affected evidence.; Updated evidence remains crawlable, visible, and aligned with the cited guidance. |

## Imported Evidence

No imported performance evidence.

## Evidence Gaps

- ranking.integrations_missing: Measured rankings, SERP positions, and AI answer visibility require Search Console, SERP, or AI answer evidence.
