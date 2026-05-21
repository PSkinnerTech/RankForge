# openclaw-geo-seo-audit

Deterministic GEO/SEO readiness audits for websites and source repositories.

The CLI inspects crawlability, indexability, search appearance, structured data, content answerability, entity clarity, optional performance imports, and repository audit evidence. It reports readiness by default. Measured ranking or AI-answer visibility requires supplied Search Console, SERP, or AI-answer evidence; Lighthouse exports can add performance measurements.

## Install

```bash
npm install -g openclaw-geo-seo-audit
```

Playwright is optional. Install it in projects where rendered page evidence is needed.

## Usage

```bash
openclaw-geo-seo-audit --help
openclaw-geo-seo-audit audit https://example.com --mode full --max-pages 25 --out audit.json --markdown audit.md
openclaw-geo-seo-audit audit-repo ./site --static-dir dist --fail-on P1 --out repo-audit.json --markdown repo-audit.md
openclaw-geo-seo-audit explain-rule indexability.noindex
```

Use `--security restricted` for untrusted live-site audits or hosted wrappers. Restricted mode applies guarded network and file access limits and disables local command execution.

## Outputs

The CLI emits versioned JSON and optional Markdown. Findings include stable rule IDs, severity, evidence paths, implementation-task guidance, and source citations where applicable.

Readiness scores are not ranking guarantees. Treat scores and findings as deterministic implementation evidence, then combine them with measured visibility data when available.
