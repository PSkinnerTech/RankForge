# RankForge GEO/SEO Audit Report

Target: {{target}}
Generated: {{generated_at}}
Auditor: {{auditor}}
Audit mode: {{audit_mode}}
Crawl scope: {{crawl_scope}}
Evidence type: {{evidence_type}}

## Executive Summary

{{summary}}

- Deterministic findings: {{deterministic_finding_count}}
- Highest severity: {{highest_severity}}
- Audited pages: {{audited_page_count}}
- Affected pages: {{affected_page_count}}
- Repository source findings: {{repository_source_finding_count}}
- Evidence gaps: {{evidence_gap_count}}

This report evaluates SEO/GEO readiness. It does not measure rankings, SERP positions, or AI-answer visibility unless Search Console, SERP, or AI-answer evidence was supplied as an import.

## Top Priorities

- **{{priority}}** `{{rule_id}}` - {{finding_title}}
  - Affected URLs: {{affected_url_count}}
  - Impact: {{impact}}
  - Next action: {{recommendation}}

## Findings By Dimension

### {{dimension}}

| Severity | Rule | Finding | Affected URLs | Evidence | Sources |
|---|---|---|---|---|---|
| {{severity}} | {{rule_id}} | {{finding_title}} | {{affected_urls}} | {{evidence_paths}} | {{source_urls}} |

Keep this section limited to deterministic page and site findings. Repository source findings belong under Repository Audit Evidence.

## Scores

| Dimension | Score | Findings |
|---|---:|---|
| {{score_dimension}} | {{score}} | {{score_finding_ids}} |

## Developer Action Plan

### {{owner}}

- **{{priority}}** `{{rule_id}}` - Effort: {{effort}} - {{task_summary}}
  - Affected URLs: {{affected_urls}}
  - Acceptance criteria: {{acceptance_criteria}}

<!-- Optional section: include only when CLI JSON includes `repo`. If `repo` is absent, omit `## Repository Audit Evidence` and its repository routes, framework manifests, and repository source findings subsections. Do not invent or pad repository evidence. -->
## Repository Audit Evidence

{{repository_evidence_summary}}

- Path: {{repository_path}}
- Framework: {{detected_framework}}
- Package manager: {{package_manager}}
- Static dir: {{static_dir}}
- Preview command: {{preview_command}}
- Preview URL: {{preview_url}}
- Build command: {{build_command}}
- Build result: {{build_result}}
- Route list: {{route_list}}
- Route sources: {{route_source_count}}
- Framework manifests: {{framework_manifest_count}}
- Repository source findings: {{repository_source_finding_count}}

### Repository Routes

| Type | Route | Source |
|---|---|---|
| {{route_type}} | {{route}} | {{route_source}} |

### Framework Route Manifests

| Type | Routes | Path |
|---|---:|---|
| {{manifest_type}} | {{manifest_route_count}} | {{manifest_path}} |

### Repository Source Findings

| Severity | Source Finding | Message | Evidence | Recommendation |
|---|---|---|---|---|
| {{source_finding_severity}} | {{source_finding_id}} | {{source_finding_message}} | {{source_finding_evidence}} | {{source_finding_recommendation}} |

Repository source findings describe source, build, route-list, manifest, static-output, or preview evidence. Keep them separate from rendered page findings.

## Imported Measurements

{{imported_measurements_summary}}

| Import | Evidence supplied | Notes |
|---|---:|---|
| Search Console | {{search_console_supplied}} | {{search_console_notes}} |
| SERP export | {{serp_supplied}} | {{serp_notes}} |
| AI-answer export | {{ai_answers_supplied}} | {{ai_answers_notes}} |
| Lighthouse | {{lighthouse_supplied}} | {{lighthouse_notes}} |

Ranking, SERP, AI-answer, and Lighthouse measurements are reported only when supplied as evidence imports. Keep imported measurements separate from deterministic readiness findings.

## Evidence Gaps

- {{evidence_gap_id}}: {{evidence_gap_message}}

How to close common gaps:

- Add `--search-console`, `--serp`, or `--ai-answers` to report observed visibility.
- Add `--lighthouse` to report imported performance evidence.
- Increase crawl scope, add a sitemap, or provide a URL list when important templates or page types are missing.
- Use trusted rendering when important content depends on client-side JavaScript.

Do not turn evidence gaps into findings unless the CLI emitted them as findings.

## Sources

- {{source_id}}: {{source_url}}
