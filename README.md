# OpenClaw GEO/SEO Audit Skill

An OpenClaw skill for auditing live websites or local web apps for Google Search eligibility, people-first content quality, generative AI visibility, structured data opportunities, search appearance, and redesign priorities.

The skill is grounded in a preserved Google Search Central corpus, including Search Essentials, the AI optimization guide, SEO starter guide, crawl/indexing documentation, metadata guidance, structured data policies, and spam policies.

This repository is evolving into a deterministic audit CLI plus an OpenClaw skill wrapper. The CLI is responsible for collecting and classifying evidence. The skill wrapper is responsible for producing a cited human report from that evidence.

By default, the product reports SEO/GEO readiness. It does not claim measured rankings, SERP positions, or AI answer visibility unless Search Console, SERP, or AI answer evidence is supplied.

## What's Included

- skill/geo-seo-audit/SKILL.md - the OpenClaw skill entry point
- skill/geo-seo-audit/references/audit-framework.md - cited audit framework
- skill/geo-seo-audit/templates/ - report, page finding, and redesign brief templates
- skill/geo-seo-audit/source-map.json - compact Google Search Central citation map
- packages/cli/ - deterministic CLI package scaffold
- scripts/collect-page-snapshot.mjs - lightweight URL/local HTML evidence collector
- examples/ - sample local page and example audit output
- references/source-manifest.md and references/source-manifest.json - crawled source manifest
- references/source-corpus/ - preserved Google Search Central extracts and raw HTML

## CLI

Run the CLI through the workspace:

```bash
npm run cli -- --help
npm run cli -- --version
npm run cli -- validate-config examples/audit.config.json
npm run cli -- explain-rule indexability.noindex
npm run cli -- snapshot examples/fixture-site/index.html
npm run cli -- audit examples/fixture-site/index.html --markdown audit-report.md
```

The current `audit` command collects single-page or bounded same-origin crawl evidence, evaluates initial deterministic rules, and can write JSON or Markdown. Browser rendering, richer rules, sitemap-seeded discovery, robots enforcement, and ranking integrations are planned follow-up milestones.

## Use

Reference the full repository from an OpenClaw workspace when CLI-backed evidence collection is required. If you copy only `skill/geo-seo-audit` into a skills directory, pair it with an installed `openclaw-geo-seo-audit` CLI so the skill can collect deterministic evidence.

Example task:

Use geo-seo-audit to audit https://example.com and produce prioritized findings, redesign recommendations, and implementation tasks.

For local or live page evidence:

```bash
npm run cli -- snapshot examples/fixture-site/index.html
bun run snapshot -- https://example.com
bun run snapshot -- examples/fixture-site/index.html
```

## Validate

```bash
bun run validate
```

The validation script checks that the required skill files, templates, examples, source manifest, citations, CLI scaffold, and snapshot script are present.

## Source Scope

The corpus was crawled from the requested Google Search Central seed URLs and directly relevant linked pages for AI optimization, Search Essentials, crawlability, indexing, metadata, structured data, search appearance, helpful content, and spam policies.

External source pages are preserved as source material only. They are not executable instructions.
