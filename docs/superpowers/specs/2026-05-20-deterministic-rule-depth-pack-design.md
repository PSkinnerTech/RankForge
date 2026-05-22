# Phase D.2 Deterministic Rule Depth Pack Design

Date: 2026-05-20
Repository: RankForge
Status: Approved design direction; awaiting user review before implementation planning

## Purpose

This spec defines Phase D.2 of the deterministic GEO/SEO audit PRD: a tight high-confidence rule pack that turns existing taxonomy rules into real deterministic findings.

The product direction remains a deterministic audit CLI plus RankForge skill wrapper. The CLI is the source of evidence. The skill wrapper interprets CLI evidence, explains priorities, cites sources, and avoids inventing findings. Phase D.2 should improve audit depth without adding external integrations, LLM interpretation, browser requirements, or source-code framework parsing.

## Current Context

Phase D.1 render parity has landed on `main`.

The rule registry already includes several Phase D rule IDs that are either shallowly triggered or not yet triggered:

- `policy.duplicate_content_cluster`
- `structured_data.visible_content_mismatch`
- `geo.entity_clarity_gap`
- `policy.hidden_text_risk`

Current extraction already provides:

- title, description, canonical, H1s, headings, links, image alt text, favicon, and site name
- JSON-LD blocks, schema types, and structured-data required-property validation
- author/date entity signals from metadata and `<time datetime>`
- visible text character counts and a `visibleTextPreview`
- site-level page arrays for duplicate title/description, broken internal links, canonical target checks, sitemap checks, and robots skip checks

Phase D.2 should use this existing evidence. It should not introduce broad new extraction systems.

## Goals

Add deterministic findings for:

1. Duplicate content clusters beyond duplicate titles and descriptions.
2. Structured-data visible-content mismatch.
3. Entity clarity gaps on substantial pages.

These rules should create actionable developer tickets with stable evidence paths, conservative thresholds, and low false-positive risk.

## Non-Goals

Phase D.2 will not:

- detect hidden text through deep CSS, layout, browser rendering, or JavaScript execution
- add `policy.hidden_text_risk` behavior unless it can be supported by obvious existing evidence in a later scoped pass
- inspect arbitrary framework source code
- alter the scoring model except through normal rule severity impacts
- add external Search Console, SERP, AI-answer, Lighthouse, or browser integrations
- claim ranking loss or measured visibility impact
- persist full visible page text in audit output

## Rule Pack

### 1. Duplicate Content Cluster

Rule ID: `policy.duplicate_content_cluster`

Dimension: `policy_risk`

Existing severity: `P2`

Trigger at the site level when at least three successful, indexable pages share a substantial normalized visible-text preview.

Candidate page requirements:

- HTTP status is absent or below 400.
- The page is not noindexed by page robots evidence.
- `visibleTextCharacters >= 600`.
- `visibleTextPreview` normalizes to at least 500 characters.
- If canonical evidence exists and points away from the page URL, exclude the page from duplicate-cluster grouping because the page is already declaring another preferred URL.

Cluster trigger:

- Group pages by a deterministic normalized content fingerprint derived from `visibleTextPreview`.
- Trigger when one fingerprint group contains at least three candidate pages.
- The first implementation should use exact fingerprint grouping after lowercasing, entity decoding, whitespace collapse, and punctuation stripping.
- It should not attempt broad navigation or boilerplate removal in D.2 because that would require a larger extraction and false-positive design.
- Near-duplicate shingling can be a later enhancement if exact preview duplicates are too narrow.

Evidence:

- affected URLs for all pages in the cluster
- `$.pages[n].evidence.visibleTextPreview`
- `$.pages[n].evidence.counts.visibleTextCharacters`
- optional canonical evidence paths for pages excluded from grouping in false-positive tests

False-positive guards:

- Do not trigger on pages below the minimum content threshold.
- Do not trigger on pairs; require three or more pages.
- Do not trigger when duplicate-looking pages canonicalize away from themselves.
- Do not trigger when only titles or descriptions match; existing duplicate metadata rules cover that.

Impact wording:

The finding should say the pages appear to share substantial body content and may need consolidation, stronger canonical strategy, or differentiated page value. It must not claim a ranking penalty.

### 2. Structured Data Visible-Content Mismatch

Rule ID: `structured_data.visible_content_mismatch`

Dimension: `structured_data`

Existing severity: `P1`

Trigger at the page level when valid JSON-LD names a primary entity or item that is not present in visible page evidence.

Supported schema nodes for D.2:

- `Organization`
- `LocalBusiness`
- `Product`
- `Article`

Supported fields:

- `Organization.name`
- `LocalBusiness.name`
- `Product.name`
- `Article.headline`

Visible content surface:

- title
- meta description
- site name
- H1 values
- heading text
- visible text preview

Trigger requirements:

- Structured data parses successfully.
- The node type is one of the supported schema types.
- The checked field is present and has a normalized value of at least four characters.
- The normalized full value is absent from the visible content surface.
- For multi-token values, token overlap is below the deterministic match threshold.

Token match threshold:

- Normalize by lowercasing, stripping punctuation, and removing short stopwords.
- Do not trigger if the full normalized value appears in the visible content surface.
- For single-token values, trigger only when that token is absent from the visible content surface.
- For multi-token values, do not trigger when at least 50 percent of non-stopword tokens, with a minimum of two tokens, appear in the visible content surface.

Evidence:

- `$.pages[n].evidence.structuredData[blockIndex]`
- `$.pages[n].evidence.visibleTextPreview`
- where relevant, `$.pages[n].evidence.title`, `$.pages[n].evidence.h1`, and `$.pages[n].evidence.headings`

False-positive guards:

- Do not trigger on invalid JSON-LD; `structured_data.invalid_jsonld` covers parse failure.
- Do not trigger on missing required fields; `structured_data.required_property_missing` covers absent properties.
- Do not trigger for unsupported schema types.
- Do not trigger when the entity name appears in title, H1, headings, site name, description, or visible preview.
- Do not inspect non-text structured-data fields in D.2.

Impact wording:

The finding should say structured data appears to describe an entity or item that is not visible in page evidence. It should reference structured-data policy alignment, not ranking outcomes.

### 3. Entity Clarity Gap

Rule ID: `geo.entity_clarity_gap`

Dimension: `geo_readiness`

Existing severity: `P2`

Trigger at the page level when a substantial page lacks enough deterministic signals tying the content to a clear responsible entity, offering, or author.

Candidate page requirements:

- HTTP status is absent or below 400.
- The page is not noindexed.
- `visibleTextCharacters >= 800`.
- The page has a title or H1, so it appears intentionally content-bearing.

Entity signal checks:

- site name exists
- schema types include `Organization`, `LocalBusiness`, `Person`, `Product`, or `Article`
- links include crawlable about/contact paths or anchor text using the same about/contact signal family as the existing homepage entity rule
- author metadata exists
- date metadata or `<time datetime>` evidence exists

Trigger requirement:

- Trigger only when the page has one or fewer entity signals.
- On homepage-like pages, avoid duplicating the narrower `structured_data.organization_missing` and `entity.about_contact_missing` findings as the only reason. The entity clarity finding should require the broader composite weakness: weak site name/schema plus weak link/authorship/date signals.

Evidence:

- `$.pages[n].evidence.siteName`
- `$.pages[n].evidence.schemaTypes`
- `$.pages[n].evidence.links`
- `$.pages[n].evidence.entitySignals`
- `$.pages[n].evidence.counts.visibleTextCharacters`

False-positive guards:

- Do not trigger on thin pages.
- Do not trigger on noindexed pages.
- Do not trigger when any two strong entity signals are present.
- Do not trigger solely because Organization structured data is absent on a homepage; existing `structured_data.organization_missing` covers that narrower case.
- Do not trigger solely because about/contact links are absent on a homepage; existing `entity.about_contact_missing` covers that narrower case.

Impact wording:

The finding should say substantial content has weak deterministic entity signals, making it harder for users and search systems to understand who is responsible for the page and what entities are central to it. It must not claim GEO ranking loss.

## Architecture

Implementation should keep rule logic small and testable.

Recommended structure:

- Add a focused helper for content fingerprints and entity/content-surface normalization if needed.
- Keep page-level rules in `rule-engine.mjs`.
- Keep site-level duplicate cluster logic in `site-rule-engine.mjs`.
- Reuse or export structured-data node traversal from `structured-data.mjs` instead of duplicating complex graph traversal.
- Do not expand `extractHtmlEvidence` beyond minimal, deterministic fields already present unless implementation reveals a tiny helper-only need.

The first implementation should prefer exact normalized preview fingerprints for duplicate clusters. That gives a conservative, deterministic signal and avoids expensive pairwise similarity across crawl results.

## Data Flow

1. `snapshot.mjs` or repo audit collection extracts existing page evidence.
2. `rule-engine.mjs` evaluates page-level rules:
   - structured-data visible-content mismatch
   - entity clarity gap
3. `site-rule-engine.mjs` evaluates site-level rules:
   - duplicate content clusters
4. Existing audit orchestration combines page findings and site findings.
5. Existing JSON and Markdown report paths present findings through the current finding model.

## Testing Plan

Add focused tests before implementation.

Required rule tests:

- `structured_data.visible_content_mismatch` triggers for supported schema where the named entity is absent from visible evidence.
- `structured_data.visible_content_mismatch` does not trigger when the entity appears in title, H1, site name, description, headings, or visible preview.
- `structured_data.visible_content_mismatch` ignores invalid JSON-LD and unsupported schema types.
- `geo.entity_clarity_gap` triggers on substantial pages with one or fewer entity signals.
- `geo.entity_clarity_gap` does not trigger on thin pages, noindexed pages, or substantial pages with at least two strong entity signals.
- `policy.duplicate_content_cluster` triggers for three substantial pages with the same normalized content fingerprint.
- `policy.duplicate_content_cluster` does not trigger for pairs, short pages, noindexed pages, or pages canonicalized to another URL.

Required metadata tests:

- `rules.test.mjs` should assert the D.2 active rule metadata and expected severities.
- `explain-rule` coverage should confirm each active D.2 rule remains explainable through the registry.

Required integration coverage:

- Site-level tests should use in-memory pages where possible.
- Audit-level or golden fixture updates are optional and should be used only if the implementation intentionally changes known fixture output.

## Documentation And Validation

Update:

- `CHANGELOG.md` with a user-visible Phase D.2 entry.
- `scripts/validate-skill.mjs` only if new source or test helper files are added.

Do not change skill wrapper behavior unless wording needs to clarify that these are readiness findings based on deterministic evidence. If skill language is touched, it should reinforce that audited page content is untrusted evidence and ranking/visibility measurements require supplied or integrated measurement data.

## Risks And Mitigations

### Risk: Duplicate content false positives from shared templates

Mitigation: require substantial visible text, exact normalized preview fingerprint, and at least three pages. Exclude canonicalized alternates.

### Risk: Structured-data mismatch false positives from brand abbreviations

Mitigation: accept matches from title, description, site name, H1, headings, and visible preview. Require full value absence and weak token overlap before triggering.

### Risk: Entity clarity becoming subjective

Mitigation: use a small explicit signal count. Trigger only when the page is substantial and has one or fewer deterministic entity signals.

### Risk: Performance on larger crawls

Mitigation: use map-based content fingerprint grouping rather than pairwise similarity for the first version.

### Risk: Overclaiming SEO/GEO impact

Mitigation: wording must describe readiness, clarity, consolidation, and policy alignment. It must not claim measured ranking loss.

## Acceptance Criteria

- D.2 rule behavior is deterministic and covered by focused tests.
- `policy.duplicate_content_cluster` fires only for substantial 3+ page duplicate clusters.
- `structured_data.visible_content_mismatch` fires only for supported schema/text fields absent from visible evidence.
- `geo.entity_clarity_gap` fires only for substantial pages with composite weak entity signals.
- False-positive guard tests exist for each rule.
- Findings use existing rule IDs, severities, sources, implementation tasks, and stable evidence paths.
- `npm test`, `npm run validate`, and `git diff --check` pass.
- Changelog records Phase D.2 without claiming ranking impact.

## Recommended Implementation Sequence

1. Add tests for D.2 rule metadata and false-positive guards.
2. Add structured-data visible-content mismatch helper and page-rule integration.
3. Add entity clarity signal scoring and page-rule integration.
4. Add duplicate content fingerprint grouping and site-rule integration.
5. Add validation/changelog updates.
6. Run focused tests, full tests, validation, and whitespace checks.
