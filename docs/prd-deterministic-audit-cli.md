# Product Requirements Document: Deterministic GEO/SEO Audit CLI + Skill Wrapper

Status: Current implementation baseline plus developer repo-audit roadmap
Date: 2026-05-18
Repository: openclaw-geo-seo-audit-skill
Current CLI package: openclaw-geo-seo-audit@0.2.0; main includes unreleased repo audit mode
Primary users: technical SEOs, growth teams, content strategists, frontend engineers, agency auditors, and AI agents running OpenClaw skills

## 1. Summary

OpenClaw GEO/SEO Audit should evolve from a prompt-guided audit skill into a deterministic audit system with two clear layers:

1. A CLI that crawls, renders, analyzes, validates, scores, and emits structured evidence.
2. An OpenClaw skill wrapper that runs the CLI, consumes the evidence, and produces a cited human audit report.

The CLI is responsible for facts. The skill is responsible for interpretation, prioritization, citations, and communication. This separation prevents the agent from inventing technical findings and makes audits repeatable, testable, and useful in CI or local workflows.

The production direction remains a deterministic SEO/GEO readiness auditor. Actual ranking measurement requires optional evidence integrations such as Google Search Console, compliant SERP APIs, manually supplied query exports, or AI answer probes.

### Current baseline

As of `openclaw-geo-seo-audit@0.2.0` plus the merged repo-audit branch, the repository contains a working deterministic CLI and OpenClaw skill wrapper. The CLI can audit local HTML, live URLs, URL lists, sitemap-seeded crawls, bounded same-origin crawls, static output repositories, and explicit preview-server repositories. It emits JSON and Markdown, imports supplied ranking/performance evidence, evaluates deterministic page and site rules, includes repo evidence for source-repository audits, and includes restricted-mode guardrails for untrusted targets.

The latest completed product target is developer-focused repo audit completion: repository audits now support explicit build commands, route lists, repo config, CI threshold failures, and deterministic source-level findings without overclaiming rankings.

## 2. Problem

The current repository contains a working deterministic CLI, an OpenClaw skill wrapper, a Google Search Central citation corpus, report templates, fixtures, golden-output tests, release workflows, and initial source-repository audit mode. The remaining problem is no longer whether deterministic auditing exists; it is how to make developer repo audits practical enough for repeated local and CI use without overclaiming ranking or AI-answer measurement.

Current remaining gaps:

- The CLI can audit static output and explicit preview-server repositories with explicit build commands, route-list parity, and repo config files; remaining repo-audit work focuses on broader framework fixture coverage and deeper deterministic source-level findings.
- Release documentation and changelog entries must stay aligned with the implemented `0.2.0` baseline plus unreleased repo-audit work before publishing the next package version.
- Some rule IDs exist in the taxonomy before full trigger coverage, especially deeper entity clarity, hidden text risk, duplicate content clusters, and structured-data visible-content mismatch.
- Ranking and GEO visibility measurement still depends on supplied exports. API-backed Search Console, SERP provider, and AI-answer probes are future integrations.
- The product needs developer-optimized repo audit workflows that can safely build or preview common web apps, crawl generated output, connect source-level evidence to rendered output, and produce CI-friendly failure semantics.

Users need a tool that can inspect a site from discovery through report generation, identify concrete implementation issues, distinguish known evidence from uncertainty, and produce actionable tasks with cited rationale.

## 3. Goals

The product must:

- Provide a deterministic CLI for end-to-end SEO/GEO readiness audits.
- Produce a stable JSON evidence model that can be consumed by humans, agents, CI, and downstream tools.
- Support live URLs and local web apps.
- Support website source repositories through a dedicated repo-to-audit mode that can detect framework/build signals, run bounded local build or preview commands, crawl the generated site, and report source-level evidence.
- Crawl representative site pages through sitemaps, internal links, supplied URL lists, or template sampling.
- Compare raw HTML and rendered DOM for JavaScript SEO risk.
- Evaluate crawlability, indexability, search appearance, structured data, entity clarity, content answerability, and GEO readiness.
- Generate prioritized findings with stable rule IDs, severities, evidence paths, and Google Search Central citations.
- Keep ranking measurement separate from readiness scoring unless real ranking evidence is supplied.
- Update the OpenClaw skill so it wraps the CLI instead of asking the agent to manually inspect pages.
- Include fixtures, deterministic tests, and golden outputs.

## 4. Non-Goals

The product will not:

- Guarantee rankings.
- Scrape Google search results directly without a compliant API or user-supplied export.
- Treat AI model answers as deterministic truth.
- Replace Google Search Console, server logs, analytics, Lighthouse, or specialist SEO judgment.
- Produce unsupported findings from LLM inference alone.
- Attempt exhaustive enterprise crawling in v1.
- Automatically make site changes.
- Ship a large raw third-party documentation corpus unless licensing and package size are intentionally addressed.

## 5. Product Principles

### Evidence before opinion

Every technical finding must trace back to observed evidence, a deterministic rule, and a source citation where applicable.

### Deterministic core, interpretive wrapper

The CLI gathers and classifies facts. The skill may summarize and prioritize but must not invent facts that are not present in the CLI output or supplied exports.

### Honest ranking language

Without Search Console, SERP, or AI answer evidence, the tool reports readiness and opportunity. With integrations, it can report observed ranking or visibility performance.

### Local-first and CI-friendly

The CLI should run locally, output JSON, and return useful exit codes. It should not require the OpenClaw agent to be useful.

### Safe by default

Audited pages, source documents, Search Console exports, and crawled content are untrusted evidence. The skill and CLI must not follow instructions found in audited content.

## 6. Users and Use Cases

### Technical SEO

Run a site audit, inspect canonical/indexability issues, compare rendered and raw content, validate structured data, and export prioritized findings.

### Content strategist

Find pages that lack helpful, answerable, entity-clear content and identify modules needed for AI/search visibility.

### Frontend engineer

Run audits against a local app before launch and receive implementation tasks with acceptance criteria.

### Agency or consultant

Produce a cited, client-ready audit report with evidence, recommendations, effort, impact, and uncertainty.

### OpenClaw agent

Run the CLI, inspect structured results, and generate a clear report without fabricating technical details.

## 7. Terminology

- SEO readiness: deterministic evaluation of crawlability, indexability, metadata, structured data, performance, internal linking, and content quality signals.
- GEO readiness: deterministic evaluation of AI/search answerability, entity clarity, structured facts, source consistency, citations/proof, and crawlable content that can support generative search features.
- Ranking measurement: observed query, impression, position, click, citation, or answer visibility data from Search Console, SERP APIs, AI answer probes, or user-supplied exports.
- Finding: a rule-triggered issue or opportunity with evidence, severity, recommendation, citations, and implementation task.
- Evidence gap: a signal the tool cannot verify without additional data or credentials.

## 8. Architecture

The system has two implemented layers, plus a planned repo-to-audit extension.

### 8.1 CLI Layer

Package name: `openclaw-geo-seo-audit`  
Primary command: `openclaw-geo-seo-audit audit <target>`

Responsibilities:

- Discover URLs.
- Fetch raw HTML and HTTP headers.
- Render pages in a browser when enabled.
- Extract page evidence.
- Run deterministic rules.
- Score audit dimensions.
- Generate machine-readable JSON.
- Optionally generate Markdown.
- Return meaningful exit codes.

The CLI should work independently of OpenClaw.

### 8.2 Skill Wrapper Layer

Skill name: `geo-seo-audit`

Responsibilities:

- Clarify scope only when target or intent is missing.
- Run the CLI with appropriate options.
- Read the JSON output.
- Produce the final audit using templates.
- Cite the source URLs mapped by rule IDs.
- Separate evidence from recommendation.
- Label evidence gaps clearly.
- Refuse to infer technical facts not present in the CLI output or supplied data.

The skill should not be the source of deterministic analysis.

### 8.3 Repo-To-Audit Layer

The repo-to-audit layer is now an initial implemented extension. It inspects a website source repository, detects framework and package-manager signals, chooses a static-output or explicit preview-server path, runs bounded preview commands when supplied, and feeds generated or served pages into the existing CLI audit engine.

This layer adds a `repo` evidence section to the JSON output. Source-level evidence must remain separate from rendered-page evidence so reports can distinguish build/configuration problems from observed website output.

## 9. CLI Commands

### 9.1 Audit

```bash
openclaw-geo-seo-audit audit https://example.com
```

Required behavior:

- Crawl or inspect the target.
- Emit JSON to stdout by default or to `--out`.
- Include findings, evidence, summary scores, metadata, and evidence gaps.

Important options:

```bash
--config audit.config.json
--out audit-results.json
--markdown audit-report.md
--max-pages 100
--max-depth 3
--mode full|sample|single
--render auto|always|never
--respect-robots true|false
--include <pattern>
--exclude <pattern>
--sitemap <url>
--url-list urls.txt
--search-console gsc-export.csv
--serp serp-export.json
--ai-answers ai-answer-export.json
--lighthouse lighthouse-report.json
```

### 9.2 Snapshot

```bash
openclaw-geo-seo-audit snapshot https://example.com/page
```

Required behavior:

- Capture raw and rendered evidence for one page.
- Useful for debugging and fixture generation.

### 9.3 Validate Config

```bash
openclaw-geo-seo-audit validate-config audit.config.json
```

Required behavior:

- Validate configuration schema.
- Report invalid include/exclude patterns, invalid URLs, unsupported modes, and missing integration files.

### 9.4 Explain Rule

```bash
openclaw-geo-seo-audit explain-rule indexability.noindex_canonical_conflict
```

Required behavior:

- Print rule purpose, severity logic, evidence inputs, recommendation text, and source citations.

### 9.5 Detect Repo

```bash
openclaw-geo-seo-audit detect-repo .
```

Implemented behavior:

- Inspect a repository path.
- Report detected framework, package manager, likely build command, likely preview command, static output candidates, route sources, and confidence.
- Avoid executing repository scripts.

### 9.6 Audit Repo

```bash
openclaw-geo-seo-audit audit-repo .
```

Implemented behavior:

- Inspect a repository path.
- Use detected static output when available unless explicit preview options are supplied.
- Use explicit `--preview-command` and `--preview-url` when supplied.
- Wait for preview startup within configured timeouts and stop the preview process after the audit.
- Crawl generated output with the existing audit engine.
- Emit existing page/site evidence plus a `repo` evidence section.
- Emit repo source findings for missing audit paths, missing static directories, empty static outputs, and unreachable preview servers.
- Developer repo audit mode now supports explicit build commands, route lists, repo config, and CI threshold failures.

## 10. Configuration

Default file: `audit.config.json`

The config should support:

- Project name.
- Target URL.
- Brand/entity facts.
- Target audience.
- Target queries.
- Competitors.
- Conversion pages.
- Page templates.
- Include/exclude crawl patterns.
- Crawl limits.
- Rendering settings.
- Auth/session settings for local or staged apps.
- Integration file paths.
- Report preferences.

Example:

```json
{
  "project": "Example Learn",
  "target": "https://example.com",
  "brand": {
    "name": "Example Learn",
    "type": "SoftwareApplication",
    "sameAs": ["https://www.linkedin.com/company/example-learn"]
  },
  "audience": ["school administrators", "math curriculum leads"],
  "targetQueries": [
    "ai tutoring platform for schools",
    "mastery learning software"
  ],
  "competitors": ["https://competitor.example"],
  "crawl": {
    "mode": "sample",
    "maxPages": 100,
    "maxDepth": 3,
    "include": ["^https://example.com/"],
    "exclude": ["/login", "/cart"]
  },
  "render": {
    "mode": "auto",
    "viewports": ["mobile", "desktop"]
  }
}
```

## 11. Evidence Model

The CLI must emit a versioned JSON schema.

Top-level shape:

```json
{
  "schemaVersion": "1.0.0",
  "toolVersion": "0.2.0",
  "run": {},
  "site": {},
  "pages": [],
  "integrations": {},
  "scores": {},
  "findings": [],
  "evidenceGaps": [],
  "sources": []
}
```

### 11.1 Run Metadata

Required fields:

- run ID
- start and end timestamps
- target
- config hash
- CLI version
- operating mode
- crawl limits
- render settings
- user agent
- environment notes

### 11.2 Site Evidence

Required fields:

- origin
- robots.txt fetch status and parsed rules
- sitemap discovery and parsed sitemap URLs
- HTTPS status
- redirect behavior from common variants where practical
- favicon and site name signals where discoverable
- page type clusters

### 11.3 Page Evidence

Required fields:

- URL
- final URL
- status code
- redirect chain
- HTTP headers
- raw HTML snapshot hash
- rendered DOM snapshot hash when available
- mobile and desktop viewport evidence when available
- title
- meta description
- robots meta
- X-Robots-Tag
- canonical
- hreflang
- headings
- visible text metrics
- link inventory
- image inventory
- structured data blocks
- detected schema types
- internal/external link counts
- raw/rendered content differences
- Lighthouse or performance metrics when enabled

### 11.4 Findings

Required fields:

- stable rule ID
- title
- severity: P0, P1, P2, P3
- dimension
- affected URLs
- evidence paths
- impact
- recommendation
- implementationTask
- owner
- effort
- confidence
- source citations
- related evidence gaps

Example:

```json
{
  "ruleId": "indexability.noindex_canonical_conflict",
  "severity": "P1",
  "dimension": "crawl_index",
  "title": "Page is noindexed but canonicalized to an indexable URL",
  "affectedUrls": ["https://example.com/product"],
  "evidence": [
    "$.pages[12].robotsMeta",
    "$.pages[12].canonical"
  ],
  "impact": "Google may be unable to consolidate indexable canonical signals as intended.",
  "recommendation": "Decide whether this page should be indexed. If yes, remove noindex. If no, canonical and internal links should reflect the preferred indexable URL strategy.",
  "implementationTask": {
    "title": "Resolve noindex and canonical conflict",
    "owner": "Engineering",
    "effort": "M",
    "acceptanceCriteria": [
      "The page has a single intended indexing strategy.",
      "Canonical and robots directives no longer conflict."
    ]
  },
  "owner": "Engineering",
  "effort": "M",
  "confidence": "high",
  "sources": [
    "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag",
    "https://developers.google.com/search/docs/crawling-indexing/canonicalization"
  ]
}
```

## 12. Audit Dimensions and Requirements

### 12.1 Discovery and Crawl Coverage

The CLI must:

- Accept a single URL, sitemap URL, local HTML file, local dev server, or URL list.
- Discover internal links from crawlable anchors.
- Parse sitemap indexes and sitemap files.
- Respect crawl limits.
- Report skipped URLs and skip reasons.
- Detect duplicate URLs and canonical clusters.
- Provide coverage summary by page template or URL pattern when possible.

### 12.2 Technical Eligibility

The CLI must check:

- HTTP status.
- Redirect chains.
- HTTPS availability.
- Fetch failures.
- Mobile render availability.
- Rendered main content presence.
- Raw vs rendered content deltas.
- Crawlable anchor links.
- Broken internal links within crawl scope.
- Resource load failures that affect primary content where detectable.

### 12.3 Crawl and Index Controls

The CLI must check:

- robots.txt availability and relevant allow/disallow behavior.
- robots meta directives.
- X-Robots-Tag directives.
- noindex/index conflicts.
- canonical presence and validity.
- canonical target status.
- canonical target indexability.
- sitemap membership.
- duplicate title and meta description clusters.
- non-canonical URLs present in sitemaps.

### 12.4 Search Appearance

The CLI must check:

- Unique, descriptive titles.
- Missing or weak meta descriptions.
- H1 presence and duplication.
- Image alt text.
- favicon discoverability.
- site name signals.
- breadcrumb signals.
- preview control directives.
- snippet-supporting visible copy.

### 12.5 Structured Data

The CLI must:

- Extract JSON-LD.
- Report parse errors.
- Detect schema types.
- Detect obvious required property gaps for supported Google rich result types.
- Detect mismatch between structured data claims and visible page text where practical.
- Flag structured data on ineligible or unsupported page contexts.
- Map page types to schema opportunities.

Initial supported schema checks:

- Organization
- LocalBusiness
- BreadcrumbList
- Article
- Product
- SoftwareApplication
- FAQPage
- Event
- VideoObject

### 12.6 Helpful Content and GEO Readiness

The CLI must score or flag:

- Clear page purpose.
- Audience fit.
- Main topic clarity.
- Answerable sections.
- Definitions and summaries.
- Step-by-step or implementation details where relevant.
- Comparisons where relevant.
- FAQ-style content where relevant.
- Proof, evidence, examples, or citations.
- Author, reviewer, date, or business details where trust-sensitive.
- Thin or duplicative content.
- Excessive boilerplate.
- Keyword stuffing patterns.

These checks should be deterministic heuristics. The skill may explain nuance, but the CLI must expose the evidence and confidence.

### 12.7 Entity Clarity

The CLI must check:

- Organization identity consistency.
- About/contact signals.
- sameAs links.
- Product/service naming consistency.
- Location details where relevant.
- Author/date signals for editorial content.
- Internal links connecting entity pages to supporting pages.

### 12.8 Spam and Policy Risk

The CLI must flag deterministic risk indicators:

- Hidden text patterns.
- Excessive doorway-like location page patterns.
- Very high duplicate content similarity.
- Structured data that marks up invisible content.
- Suspicious outbound link patterns.
- Thin auto-generated page clusters where detectable.

The CLI should label these as risk indicators, not confirmed violations, unless evidence is direct.

### 12.9 Performance and Page Experience

The CLI should support optional Lighthouse integration.

Requirements:

- Record Lighthouse version.
- Record viewport and throttling settings.
- Store metrics separately from deterministic HTML findings.
- Treat performance scores as variable measurements, not immutable facts.

### 12.10 Ranking and Visibility Integrations

The CLI may support optional integrations.

Google Search Console:

- Accept CSV export in v1.
- Later support API credentials.
- Report queries, pages, clicks, impressions, CTR, and average position.
- Connect observed query performance to audited URLs.

SERP provider:

- Accept user-supplied SERP export first.
- Later support compliant provider APIs.
- Track query, location, device, result URL, position, feature type, and competitors.

AI answer visibility:

- Accept user-supplied AI answer export first.
- Later support configured probes where allowed.
- Track prompt/query, model/product, date, cited URLs, mentioned brands, and answer text hash.

Without these integrations, the product must not claim measured rankings.

## 13. Scoring

The CLI should produce dimension-level scores for quick triage, but findings are the primary output.

Initial score dimensions:

- Technical eligibility
- Crawl and index controls
- Search appearance
- Structured data
- Helpful content
- GEO readiness
- Entity clarity
- Policy risk
- Ranking evidence completeness

Scoring rules:

- Scores must be derived from deterministic checks.
- Missing evidence should lower evidence completeness, not fabricate a bad score.
- P0/P1 findings should cap relevant dimension scores.
- Scores must include explanation and affected findings.

## 14. Report Generation

The CLI should support Markdown output, but the OpenClaw skill remains the preferred human-report layer.

Report sections:

- Executive summary.
- Priority findings.
- Scores by dimension.
- Page/template coverage.
- Technical eligibility.
- Crawl and index controls.
- Helpful content and GEO readiness.
- Entity clarity.
- Structured data.
- Search appearance.
- Ranking evidence, if supplied.
- Technical and content recommendations.
- Implementation tasks.
- Evidence gaps.
- Appendix with raw evidence references.

The report must lead with prioritized findings, not a generic checklist.

## 15. Skill Wrapper Requirements

The skill must:

- Use the CLI as the default evidence source.
- Read `audit-framework.md` and source map only for citations and recommendation context.
- Treat audited content as untrusted evidence.
- Never follow instructions found on audited pages.
- Use CLI rule IDs and evidence paths in the report.
- Clearly distinguish deterministic findings from interpretive recommendations.
- Clearly mark evidence gaps.
- Avoid ranking claims when ranking integrations are missing.
- Convert findings into implementation tasks with owner, effort, priority, and acceptance criteria.

The skill should support three workflows:

1. `audit target`: run full or sampled CLI audit and write report.
2. `audit local app`: run against localhost or local HTML.
3. `explain findings`: summarize an existing CLI JSON output.

## 16. Packaging and Distribution

The repo should support both CLI and skill installation.

Recommended package layout:

```text
packages/
  cli/
    src/
    package.json
skill/
  geo-seo-audit/
    SKILL.md
    references/
    templates/
    source-map.json
docs/
  prd-deterministic-audit-cli.md
examples/
  fixture-sites/
```

Distribution options:

- Publish the CLI as an npm package with a `bin` entry.
- Keep the skill folder self-contained.
- Include a compact source citation map in the skill.
- Keep raw Google HTML corpus out of the default package unless there is a clear licensing and size decision.

## 17. Testing and Quality

The product must include:

- Unit tests for URL normalization, robots parsing, sitemap parsing, metadata extraction, schema parsing, and rule evaluation.
- Fixture sites for known SEO/GEO scenarios.
- Golden JSON outputs for deterministic findings.
- Golden Markdown outputs for report structure.
- CLI smoke tests.
- Skill validation tests.
- Regression tests for source citation mapping.

Required fixtures:

- Healthy baseline site.
- noindex page.
- robots-blocked page.
- canonical mismatch.
- canonical target unavailable.
- JS-only content.
- raw/rendered mismatch.
- invalid JSON-LD.
- structured data not visible on page.
- thin content page.
- duplicate pages.
- missing entity/about/contact signals.
- sitemap with non-canonical URLs.
- broken internal links.
- excessive boilerplate cluster.

## 18. Success Metrics

Product success:

- A user can run one command against a live site and receive a complete JSON audit.
- The OpenClaw skill can produce a report from CLI JSON without manual page inspection.
- Every major finding has a rule ID, evidence path, and source citation.
- The tool can audit local web apps before deployment.
- Fixture tests produce stable golden outputs.
- The README accurately explains readiness vs ranking measurement.
- Package installation works without hidden repo-root dependencies.

Quality targets:

- 90 percent or higher coverage for deterministic rule modules.
- Golden output changes require intentional updates.
- Audit output schema is versioned.
- CLI exits non-zero only for execution failures or configured severity thresholds.

## 19. Milestones

### Milestone 1: Product Restructure and Schema - Completed in `0.2.0`

Delivered:

- Self-contained skill layout.
- CLI package scaffold.
- Audit config schema.
- Audit evidence JSON schema.
- Rule taxonomy.
- Compact source citation map.
- Updated README.

### Milestone 2: Crawl and Snapshot Engine - Completed in `0.2.0`

Delivered:

- URL normalization.
- Raw fetch.
- HTTP header capture.
- Redirect chain capture.
- sitemap discovery and parsing.
- robots.txt fetch and parse.
- Link extraction.
- Optional Playwright rendering.
- Single-page snapshot command.

### Milestone 3: Deterministic Rule Engine - Completed in `0.2.0`

Delivered:

- Rule registry.
- Severity model.
- Evidence path mapping.
- Technical eligibility rules.
- Crawl/index rules.
- Search appearance rules.
- Structured data rules.
- Site-level duplicate metadata, canonical, sitemap, robots, and broken-link rules.

### Milestone 4: GEO and Entity Readiness - Initial baseline completed in `0.2.0`

Delivered:

- Helpful content heuristics.
- Answerability checks.
- Homepage organization-structured-data checks.
- About/contact entity-signal checks.
- Conservative policy-risk taxonomy.

Remaining rule-depth work:

- Entity clarity beyond about/contact links.
- Hidden text and policy risk indicators.
- Duplicate content clusters beyond duplicate metadata.
- Structured-data visible-content mismatch.
- Internal linking and topic relationship checks.
- More nuanced answerability and helpful-content heuristics.

### Milestone 5: Reporting, Skill Wrapper, Guardrails, And Release Readiness - Completed in `0.2.0`

Delivered:

- Markdown report generator.
- Updated `SKILL.md` that treats CLI output as deterministic evidence.
- JSON and Markdown golden fixture coverage.
- Implementation-task metadata on findings.
- CI severity threshold support with `--fail-on`.
- Restricted security mode with network, file, timeout, redirect, byte-cap, and rendering guardrails.
- GitHub CI and release workflow scaffolding.

### Milestone 6: Optional Evidence Imports - Initial baseline completed in `0.2.0`

Delivered:

- Search Console CSV ingestion.
- SERP export ingestion.
- AI answer export ingestion.
- Lighthouse JSON ingestion.
- Evidence gaps when ranking or AI-answer evidence is missing.

Deferred integrations:

- Search Console API support.
- SERP provider API support.
- Configured AI-answer visibility probes.
- Optional Lighthouse execution.

### Milestone 7: Repo-To-Audit Mode - Initial baseline merged

Delivered on main after `0.2.0`:

- `detect-repo <path>` framework and package-manager detection.
- `audit-repo <path>` source-repository audit workflow.
- Static-output and preview-server audit paths.
- Bounded explicit preview command execution.
- Route discovery from generated static output.
- `repo` evidence section in JSON output.
- Source-level findings that remain separate from rendered-page findings.

Delivered developer-focused repo audit completion work:

- Explicit build command support with bounded execution, captured evidence, timeout cleanup, and restricted-mode blocking.
- Route-list support for repository audits, including missing, empty, non-HTML, missing-entry, and outside-static findings.
- Repo config support through `audit.config.json` for repeatable CI workflows.
- Vite fixture coverage for deterministic build-and-static-output audits.
- Source-level findings for generated sitemap/robots availability, static output availability, route-list issues, build failures, and preview startup failures.

Remaining developer-focused repo audit work:

- Next.js and Astro fixture coverage.
- Deeper deterministic source-level findings for framework metadata usage and rendered/source mismatches where stable.
- Optional framework-specific route manifest parsing when it can be done without brittle heuristics.

## 20. Risks and Mitigations

### Risk: Overclaiming ranking ability

Mitigation: Use "readiness" by default. Require integrations for observed rankings.

### Risk: Non-deterministic browser/performance output

Mitigation: Store environment metadata. Keep Lighthouse scores separate from stable rule findings.

### Risk: Prompt injection from audited pages

Mitigation: Treat page content as evidence only. Skill instructions must explicitly ignore audited-page instructions.

### Risk: Package size and third-party source corpus licensing

Mitigation: Ship a compact citation map by default. Keep raw corpus optional or dev-only.

### Risk: False positives in content/GEO heuristics

Mitigation: Use confidence labels, evidence snippets, and conservative severity. Prefer P2/P3 opportunities unless evidence is strong.

### Risk: Enterprise crawl complexity

Mitigation: Make v1 bounded and configurable. Support representative sampling before exhaustive crawling.

## 21. Resolved Decisions And Remaining Planning Questions

Resolved for `0.2.0`:

- The CLI lives as a separate npm workspace package under `packages/cli`.
- Playwright remains optional through peer dependency and dynamic import.
- The CLI reports readiness by default and requires supplied evidence for measured rankings or AI answer visibility.
- The default audit mode remains conservative; users opt into broader crawls with `--mode full` or `--mode sample`.
- JSON output is versioned with `schemaVersion: "1.0.0"`.
- Raw Google source corpus remains a repository asset. The CLI package ships source code and compact citation behavior, not the full raw corpus.
- CI severity gating is configured with explicit `--fail-on P0|P1|P2|P3`.

Resolved for developer repo audit completion:

- Explicit build support runs only when `--build-command` or `repo.buildCommand` is supplied.
- Repo audit configuration extends `audit.config.json` through a `repo` object.
- First high-value source findings cover build execution, static output availability, route-list validity, preview startup, and generated `robots.txt`/`sitemap.xml`.

## 22. Release Stabilization And v1.5 Readiness Checklist

Before publishing or tagging `0.2.0`:

- Verify the PRD, README, skill wrapper, changelog, and release checklist describe the same shipped CLI baseline.
- Run `npm ci`, `npm audit --omit=dev`, `npm test`, `npm run validate`, and `npm pack --dry-run --workspace packages/cli`.
- Confirm the dry-run package includes only intended CLI files and excludes the raw source corpus, fixtures, golden outputs, and docs.
- Confirm readiness language remains separate from measured ranking or AI-answer visibility claims.
- Push and merge the guardrail branch through the repository review workflow.

Before extending developer repo audit beyond the completed build/config/route-list layer:

- Add Next.js and Astro fixtures only with deterministic local build scripts and no automatic dependency installation.
- Expand deterministic source-level findings only where source evidence can be parsed without brittle framework assumptions.
- Keep repo-to-audit implementation separate from external API integrations.

## 23. Implemented Baseline And v1.5 Scope

The implemented `0.2.0` baseline includes:

- Self-contained skill wrapper.
- Deterministic CLI.
- Single-site crawl up to configurable limits.
- Raw and rendered page evidence.
- robots.txt and sitemap parsing.
- Technical/indexability/search appearance rules.
- JSON-LD parsing and initial structured data checks.
- GEO/entity readiness heuristics.
- JSON and Markdown output.
- Fixture tests and golden outputs.

The merged repo-to-audit baseline adds source-repository audits after `0.2.0` release stabilization. Repo-to-audit mode remains a focused extension of the current CLI rather than a replacement for URL, local app, static file, or URL-list audits. The next phase should optimize this mode for developer local and CI workflows.

The roadmap still defers:

- Search Console API.
- SERP API.
- AI answer probing automation.
- Enterprise-scale crawling.
- Full schema.org validation.
- Automated remediation.

This scope creates a credible, useful audit product without overclaiming ranking measurement.
