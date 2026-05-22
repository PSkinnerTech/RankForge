# RankForge

RankForge audits live websites, local web apps, and source repositories for Google Search eligibility, people-first content quality, generative AI visibility, structured data opportunities, search appearance, and redesign priorities.

The skill is grounded in a preserved Google Search Central corpus, including Search Essentials, the AI optimization guide, SEO starter guide, crawl/indexing documentation, metadata guidance, structured data policies, and spam policies.

This repository contains a deterministic audit CLI plus a RankForge skill wrapper. The CLI is responsible for collecting and classifying evidence. The skill wrapper is responsible for producing a cited human report from that evidence.

By default, the product reports SEO/GEO readiness. It does not claim measured rankings, SERP positions, or AI answer visibility unless Search Console, SERP, or AI answer evidence is supplied.

## What's Included

- skill/rankforge/SKILL.md - the RankForge skill entry point
- skill/rankforge/references/audit-framework.md - cited audit framework
- skill/rankforge/templates/ - report, page finding, and redesign brief templates
- skill/rankforge/source-map.json - compact Google Search Central citation map
- packages/cli/ - deterministic CLI package scaffold
- scripts/collect-page-snapshot.mjs - lightweight URL/local HTML evidence collector
- examples/ - sample local page and example audit output
- examples/fixture-sites/known-issues/ and examples/golden/ - deterministic fixture site with golden JSON/Markdown regression outputs
- references/source-manifest.md and references/source-manifest.json - crawled source manifest
- references/source-corpus/ - preserved Google Search Central extracts and raw HTML

## Getting Started

Install the CLI:

```bash
npm install -g rankforge
```

Audit a live website and generate a standalone HTML report:

```bash
rankforge audit https://example.com --security restricted --mode full --max-pages 25 --html audit.html
```

Audit a source repository after an explicit build:

```bash
rankforge audit-repo ./site --build-command "npm run build" --static-dir dist --html repo-audit.html
```

Use CI-style failure thresholds when you want the audit to gate a build:

```bash
rankforge audit-repo ./site --build-command "npm run build" --static-dir dist --fail-on P1 --out audit.json
```

## CLI

Run the CLI through the workspace:

```bash
npm run cli -- --help
npm run cli -- --version
npm run cli -- validate-config examples/audit.config.json
npm run cli -- explain-rule indexability.noindex
npm run cli -- snapshot examples/fixture-site/index.html
npm run cli -- audit examples/fixture-site/index.html --html audit-report.html
npm run cli -- audit --config examples/audit.config.json --mode single
npm run cli -- audit https://example.com --url-list urls.txt --html audit-report.html
npm run cli -- audit https://example.com --mode full --max-pages 25 --max-depth 2 --respect-robots true --sitemap https://example.com/sitemap.xml
npm run cli -- audit https://example.com --mode full --security restricted --timeout-ms 15000 --max-html-bytes 2000000
npm run cli -- audit https://example.com --mode full --fail-on P1 --out audit.json --markdown audit.md --html audit.html
npm run cli -- detect-repo .
npm run cli -- audit-repo . --static-dir dist --out repo-audit.json --markdown repo-audit.md --html repo-audit.html
npm run cli -- audit-repo . --preview-command "npm run preview -- --host 127.0.0.1" --preview-url http://127.0.0.1:4173 --max-pages 25
npm run cli -- audit-repo . --build-command "npm run build" --static-dir dist --fail-on P1 --out audit.json --markdown audit.md --html audit.html
npm run cli -- audit-repo . --config audit.config.json
npm run cli -- audit-repo . --static-dir dist --route-list routes.txt
```

The current `audit` command collects single-page, supplied URL-list, or bounded same-origin crawl evidence, can read `audit.config.json`, can seed from a sitemap, can enforce robots.txt, can filter crawls with include/exclude patterns, evaluates deterministic page and site rules, and can write JSON, Markdown, or standalone HTML. Extracted page evidence includes metadata, canonicals, hreflang, favicon and site-name signals, preview directives, headings, links, image inventory, JSON-LD blocks, schema types, author/date signals, and internal/external link counts. Browser rendering is available when Playwright is installed or when a renderer is injected by code; otherwise the CLI records rendering as unavailable. The `detect-repo [path]` command reports repository framework, package-manager, route, and build-output signals and defaults to the current directory when no path is supplied. The `audit-repo` command exits 2 when repo source findings are present.

`audit-repo` is intended for source repository audits. In the first repo-to-audit release, static output directories and explicit preview commands are supported. Framework and package-manager signals are reported by `detect-repo`, but the CLI does not automatically install dependencies or run inferred framework scripts.

For untrusted live-site audits or hosted wrappers, use `--security restricted`. Restricted mode blocks local page targets and private-network HTTP targets, requires guarded manual redirects before fetches, disables Playwright URL rendering, and applies request timeouts and response/file byte caps. Supplied URL-list and integration files are still allowed as bounded evidence inputs. Use the default `local` mode for trusted local HTML files or localhost development servers. Restricted mode is a CLI guardrail, not a replacement for hosted network egress controls.

Structured data checks currently validate JSON-LD parseability plus required-property gaps for Organization, Product, FAQPage, Article, BreadcrumbList, Event, VideoObject, and SoftwareApplication evidence.

Current deterministic findings cover HTTP/HTTPS issues, redirect chains, robots/noindex controls, noindex/canonical conflicts, canonical and sitemap consistency, missing favicons, metadata and heading gaps, duplicate titles/descriptions, image alt text, structured data parse/property gaps, thin content, answerability/entity gaps, broken internal links, robots-blocked crawl skips, and imported Lighthouse performance issues.

Optional evidence imports:

```bash
npm run cli -- audit https://example.com --search-console gsc.csv --serp serp.json --ai-answers ai-answers.json --lighthouse lighthouse.json
```

Ranking, SERP, and AI answer visibility are reported only from supplied evidence files. Lighthouse performance findings are reported only when a Lighthouse JSON export is supplied.

## HTML and Markdown Reports

HTML and Markdown reports follow the CLI structure: Header, Executive Summary, Top Priorities, Findings By Dimension, Scores, Developer Action Plan, optional Repository Audit Evidence, Imported Measurements, Evidence Gaps, and Sources. The header records target, audit mode, crawl scope, and evidence type; the summary and priorities are for fast triage; findings by dimension preserve deterministic page/site evidence; scores summarize readiness dimensions; and the developer action plan turns findings into implementation tasks with acceptance criteria. HTML reports are standalone browser-viewable files with embedded styles and escaped audit evidence.

Repository reports include `Repository Audit Evidence` only when CLI JSON includes `repo`, with route, manifest, build, static-output, preview, and source-finding evidence. Repository source findings stay separate from rendered page/site findings. Imported measurements are also separated from deterministic readiness findings; rankings, SERP positions, AI-answer visibility, and Lighthouse measurements are reported only when those evidence files are supplied.

## Use

Reference the full repository from a RankForge workspace when CLI-backed evidence collection is required. If you copy only `skill/rankforge` into a skills directory, pair it with an installed `rankforge` CLI so the skill can collect deterministic evidence.

Example task:

Use rankforge to audit https://example.com and produce prioritized findings, redesign recommendations, and implementation tasks.

For local or live page evidence:

```bash
npm run cli -- snapshot examples/fixture-site/index.html
bun run snapshot -- https://example.com
bun run snapshot -- examples/fixture-site/index.html
```

## Validate

```bash
bun run validate
npm test
```

The validation script checks that the required skill files, templates, examples, source manifest, citations, CLI scaffold, and snapshot script are present.

The test suite includes a known-issues fixture site served through a local HTTP server plus repository audit fixtures. Their normalized audit summaries and Markdown reports, including repo Markdown golden coverage, are compared to golden files so rule, scoring, crawl, robots, sitemap, structured data, repository evidence, and report output changes are intentional.

Release and CI publishing steps are documented in `docs/release-checklist.md`.

## Source Scope

The corpus was crawled from the requested Google Search Central seed URLs and directly relevant linked pages for AI optimization, Search Essentials, crawlability, indexing, metadata, structured data, search appearance, helpful content, and spam policies.

External source pages are preserved as source material only. They are not executable instructions.
