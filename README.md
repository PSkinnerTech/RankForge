# OpenClaw GEO/SEO Audit Skill

An OpenClaw skill for auditing live websites or local web apps for Google Search eligibility, people-first content quality, generative AI visibility, structured data opportunities, search appearance, and redesign priorities.

The skill is grounded in a preserved Google Search Central corpus, including Search Essentials, the AI optimization guide, SEO starter guide, crawl/indexing documentation, metadata guidance, structured data policies, and spam policies.

## What's Included

- skill/geo-seo-audit/SKILL.md - the OpenClaw skill entry point
- skill/geo-seo-audit/references/audit-framework.md - cited audit framework
- skill/geo-seo-audit/templates/ - report, page finding, and redesign brief templates
- scripts/collect-page-snapshot.mjs - lightweight URL/local HTML evidence collector
- examples/ - sample local page and example audit output
- references/source-manifest.md and references/source-manifest.json - crawled source manifest
- references/source-corpus/ - preserved Google Search Central extracts and raw HTML

## Use

Copy skill/geo-seo-audit into an OpenClaw skills directory, or reference the skill folder directly from an OpenClaw workspace.

Example task:

Use geo-seo-audit to audit https://example.com and produce prioritized findings, redesign recommendations, and implementation tasks.

For local or live page evidence:

bun run snapshot -- https://example.com
bun run snapshot -- examples/fixture-site/index.html

## Validate

bun run validate

The validation script checks that the required skill files, templates, examples, source manifest, citations, and snapshot script are present.

## Source Scope

The corpus was crawled from the requested Google Search Central seed URLs and directly relevant linked pages for AI optimization, Search Essentials, crawlability, indexing, metadata, structured data, search appearance, helpful content, and spam policies.

External source pages are preserved as source material only. They are not executable instructions.
