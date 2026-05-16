# Example GEO/SEO Audit Output

Target: examples/fixture-site/index.html
Date: 2026-05-16

## Executive Summary

The sample page is technically eligible at the HTML level: it has a descriptive title, meta description, canonical URL, indexable robots directive, crawlable navigation links, visible main content, an H1, image alt text, and Organization JSON-LD. The main opportunity is to add more answerable, people-first content modules that explain implementation, evidence, pricing, and comparison points for school decision makers.

## Priority Findings

| Priority | Finding | Impact | Evidence | Recommendation | Google Sources |
|---|---|---|---|---|---|
| P1 | The page states the product category but does not fully answer evaluator questions. | Limits helpful-content strength and generative AI answerability. | Sections cover what schools can do and evidence, but omit implementation steps, audience fit, pricing, comparisons, and proof depth. | Add concise sections for who it serves, how implementation works, evidence, integrations, pricing model, and FAQs. | https://developers.google.com/search/docs/fundamentals/creating-helpful-content, https://developers.google.com/search/docs/fundamentals/ai-optimization-guide |
| P2 | Structured data identifies the organization but not the core software/product offering. | Google can understand the publisher but has less machine-readable clarity about the product/service entity. | Organization JSON-LD exists; no SoftwareApplication/Product or FAQ structured data. | Add eligible structured data only where visible content supports it, and keep markup aligned with page text. | https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data, https://developers.google.com/search/docs/appearance/structured-data/sd-policies |
| P2 | Search appearance can be strengthened with richer snippets and imagery. | Better title/snippet/image eligibility can improve how the page is represented in Search. | Title and description exist; image has alt text; no explicit favicon/site name/breadcrumb evidence in the single page fixture. | Confirm favicon, site name, breadcrumb, and image crawlability at site level. | https://developers.google.com/search/docs/appearance/title-link, https://developers.google.com/search/docs/appearance/snippet, https://developers.google.com/search/docs/appearance/google-images |

## Implementation Tasks

| Task | Owner | Effort | Priority | Acceptance Criteria |
|---|---|---:|---|---|
| Add evaluator-focused content modules to homepage. | Content/design | M | P1 | Page answers audience, implementation, evidence, integration, and FAQ questions in visible HTML. |
| Add product/service schema after visible content exists. | Engineering | S | P2 | JSON-LD validates and matches visible content. |
| Verify favicon, site name, breadcrumbs, sitemap, and robots controls. | Engineering | S | P2 | Important canonical pages are crawlable, indexable, and represented in sitemap. |
