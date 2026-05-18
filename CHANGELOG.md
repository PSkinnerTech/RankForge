# Changelog

## 0.2.0 - 2026-05-18

- Added the deterministic `openclaw-geo-seo-audit` CLI package with `audit`, `snapshot`, `validate-config`, and `explain-rule` commands.
- Added config-driven audits, URL-list sampling, bounded same-origin crawling, sitemap seeding, robots enforcement, include/exclude crawl filters, and JSON/Markdown outputs.
- Added deterministic page and site rules for technical eligibility, crawl/index controls, search appearance, structured data, content answerability, entity signals, performance imports, and ranking-evidence gaps.
- Added optional evidence imports for Search Console CSV, SERP JSON, AI-answer JSON, and Lighthouse JSON.
- Added restricted security mode with network/file guardrails, request timeouts, response/file byte caps, manual redirect enforcement, and disabled browser rendering for restricted URL targets.
- Added implementation-task metadata to findings and CI severity threshold support with `--fail-on`.
- Added fixture-site and golden-output regression coverage plus GitHub CI and release workflow scaffolding.
- Updated the OpenClaw skill wrapper to use the CLI as the deterministic evidence source and to avoid unsupported ranking claims.

## 0.1.0 - 2026-05-16

- Initial public OpenClaw skill for GEO/SEO website audits.
- Added Google Search Central source corpus manifest and preserved page extracts.
- Added audit framework, report templates, page finding templates, redesign brief template, example fixture, and example audit output.
- Added deterministic page snapshot and skill validation scripts.
