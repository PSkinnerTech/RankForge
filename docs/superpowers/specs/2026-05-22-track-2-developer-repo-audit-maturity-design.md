# Track 2 Developer Repo Audit Maturity Design

Date: 2026-05-22
Repository: RankForge
Status: Draft design for user review before implementation planning

## Purpose

Track 2 should make `rankforge audit-repo` feel practical for frontend developers who want to audit source repositories before launch or inside CI. RankForge already supports explicit builds, static output audits, preview-server audits, route lists, repo config, JSON/Markdown/HTML reports, and source findings. The next step is to make those capabilities clearer and more useful for common developer workflows, especially Vite and single-page app static-output audits.

The product goal is not deeper ranking measurement or broad framework integration. It is a tighter repo-audit experience where a developer can understand which routes were audited, what generated artifacts were inspected, which source/config/build files should be checked next, and how to preserve the resulting reports as CI artifacts.

## Current Baseline

Main currently includes:

- `detect-repo` framework, package-manager, build-command, preview-command, static-output, route-source, and route-manifest signals.
- `audit-repo` support for explicit build commands, explicit static directories, explicit preview servers, route lists, repo config, `--fail-on`, and JSON/Markdown/HTML outputs.
- Source findings for build failures, missing static output, missing routes, invalid route-list entries, preview failures, missing generated robots/sitemap files, and framework route-manifest mismatches.
- Deterministic fixtures for generic static output, npm preview, Vite static build, Next.js static export, and Astro static build.
- Report sections that separate rendered page findings from repository source findings.
- Published `rankforge@0.3.0`, release docs, and initial known-limits language.

The remaining maturity gaps are:

- Vite/SPA behavior is not documented enough for developers whose build emits one `index.html` and serves client-side routes through history fallback.
- Existing Vite route-list tests cover generated route HTML, but not a deterministic SPA fallback fixture where declared routes intentionally resolve to the same generated HTML shell.
- Source findings have recommendations, but reports do not consistently say which source file, build artifact, config file, or generated output to inspect next.
- CI examples exist as command snippets, but there is no validated copy-paste GitHub Actions example that uploads JSON, Markdown, and HTML reports.

## Goals

- Make Vite and SPA static-output route behavior explicit and test-covered.
- Preserve `--route-list` as the deterministic way to declare intended SPA/client routes.
- Improve source-finding remediation so developers know the next artifact to inspect.
- Improve repo report language without mixing source findings into page/site findings.
- Add a trustworthy GitHub Actions example that runs `audit-repo`, writes all supported report formats, and uploads them as artifacts.
- Keep all changes local-first, deterministic, and compatible with the published JSON model.

## Non-Goals

- Do not infer or execute framework commands automatically.
- Do not install dependencies in audited repositories.
- Do not parse arbitrary client router source files.
- Do not add Search Console, SERP, AI-answer, Lighthouse, or hosted-dashboard integrations.
- Do not add SARIF, JUnit, GitHub annotations, or issue creation in this track.
- Do not claim rankings, SERP position, AI-answer visibility, or business impact without supplied evidence imports.
- Do not make `README.md` carry every detail; longer workflow material belongs in focused docs or examples.

## Recommended Approach

Use a tight additive maturity pass:

1. Add deterministic SPA fixture coverage that models the common Vite static SPA case: one generated HTML shell plus a user-supplied route list of intended client routes.
2. Document the route-list workflow as the explicit contract for SPA/client routes.
3. Add a small source-finding guidance layer that maps known repo finding IDs to "inspect next" artifacts and developer-oriented remediation hints.
4. Surface that guidance in Markdown and HTML reports while keeping the JSON additions optional and backward-compatible.
5. Add a docs-only GitHub Actions example that a user can copy into their own repository and that local tests can sanity-check for expected commands and artifact outputs.

This approach improves the strongest near-term developer use case without pretending RankForge can infer every route or framework behavior from source code.

## Deliverables

### 1. Vite/SPA Route-List Fixture

Add a fixture that represents a Vite-style SPA static build:

- source route intent is declared in a route-list file such as `/`, `/pricing/`, and `/docs/`
- generated output contains a single `dist/index.html` HTML shell
- route-list auditing resolves each declared client route to deterministic audit evidence without crawling arbitrary JavaScript
- reports make it clear that the audited evidence came from the static SPA shell and the declared route list

The fixture should prove three behaviors:

- declared SPA routes can be audited deterministically through `--route-list`
- missing or unsafe route-list entries still produce source findings instead of silent omissions
- static route discovery alone is not treated as equivalent to a complete SPA route inventory

The implementation plan should decide whether this requires a new route-list resolution mode or a conservative extension to the existing static HTML resolution rules. The design requirement is that the behavior remains explicit and test-covered.

### 2. Route-List Developer Documentation

Add concise route-list documentation for repo audits:

- when route lists are needed
- how entries are interpreted
- how Vite/SPA fallback routes should be represented
- how route-list files interact with `--build-command`, `--static-dir`, and `--config`
- copy-paste local commands for JSON, Markdown, and HTML reports
- copy-paste CI commands with `--fail-on`

The docs should distinguish:

- multi-page static output where generated HTML files exist for each route
- SPA static output where intended client routes must be declared because generated HTML alone cannot prove route coverage
- explicit preview-server audits where RankForge can crawl served links instead of only generated files

### 3. Source-Finding Remediation Hints

Add deterministic remediation guidance for repo source findings. The guidance should be based only on known finding IDs and observed evidence, not on inferred source code behavior.

Each supported source finding should be able to expose:

- an `inspectNext` list such as `package.json`, `audit.config.json`, `dist/index.html`, `dist/robots.txt`, `dist/sitemap.xml`, route-list file, preview command, or framework manifest path
- a short developer action written as an implementation task
- an acceptance check that can be verified by rerunning RankForge

Initial high-confidence mappings should cover:

- `repo.build_failed`
- `repo.build_timeout`
- `repo.build_unavailable`
- `repo.static_dir_missing`
- `repo.static_routes_missing`
- `repo.route_list_missing`
- `repo.route_list_empty`
- `repo.route_list_entry_missing`
- `repo.route_list_entry_not_html`
- `repo.route_list_entry_outside_static_dir`
- `repo.preview_unreachable`
- `repo.robots_missing`
- `repo.sitemap_missing`
- `repo.manifest_route_missing`
- `repo.audit_path_missing`

These hints should be additive. Existing consumers that read only `id`, `severity`, `message`, `evidence`, and `recommendation` should continue to work.

### 4. Repo Report Developer Guidance

Update Markdown and HTML repo report sections so developers can answer four questions quickly:

- What repo mode ran: static output, route-list static output, preview server, or no usable audit path.
- Which routes or route declarations produced page evidence.
- Which generated files, config files, commands, or manifests should be inspected next.
- Which command reruns the audit after a fix.

The report should keep source findings in `Repository Source Findings`. It should not merge repo problems into page findings or scored page dimensions. The language should describe evidence and readiness only.

### 5. GitHub Actions Artifact Example

Add a copy-paste GitHub Actions example for projects that install RankForge from npm and run a repo audit after an explicit build. The workflow should:

- set up Node on a supported major version
- install project dependencies with the project's package manager
- run the user's explicit build command
- run `npx rankforge audit-repo . --static-dir dist --fail-on P1 --out rankforge-audit.json --markdown rankforge-audit.md --html rankforge-audit.html`
- upload JSON, Markdown, and HTML outputs as artifacts
- make the threshold behavior clear so a failing audit still leaves useful artifacts when possible

The example should live outside active CI unless intentionally wired in later. It should be validated by tests or script checks for syntax-sensitive essentials: workflow name, RankForge command, three output paths, and artifact upload step.

## Architecture And Boundaries

Track 2 should be implemented through small, additive changes:

- fixture files under `examples/fixture-repos/`
- focused repo-audit tests under `packages/cli/test/`
- optional source-finding guidance helpers near `packages/cli/src/repo-findings.mjs`
- report rendering updates in `packages/cli/src/report.mjs`
- documentation under `docs/` with only short links or examples added to `README.md`
- a docs/example workflow file that is not an active repository workflow

The JSON output model may grow optional fields on repo source findings, but existing fields and report section boundaries should not change incompatibly. Route-list changes must remain bounded to the configured static directory or explicit generated HTML evidence. RankForge should not read router source files or execute framework-specific discovery commands.

## Data Flow

The intended developer workflow is:

1. Developer chooses an explicit repo audit path.
2. RankForge detects repo metadata and merges CLI/config settings.
3. If supplied, RankForge runs the explicit build command.
4. RankForge selects static output or explicit preview-server auditing.
5. For static output, RankForge either discovers generated HTML routes or uses the supplied route list.
6. For SPA route-list audits, declared routes are treated as user-supplied audit intent and mapped to deterministic generated evidence.
7. RankForge runs the normal audit engine and attaches repo evidence.
8. Source findings receive optional developer guidance.
9. JSON, Markdown, and HTML reports preserve page findings, repo evidence, source findings, and evidence gaps as separate sections.

## Error Handling And Safety

- Route-list entries must not allow arbitrary filesystem traversal or report machine paths as routes.
- Invalid route-list entries should become repo source findings, not partial silent success.
- Build and preview command execution remains explicit and blocked in restricted mode.
- Report guidance must not claim that a missing generated artifact guarantees a ranking loss.
- CI docs should avoid committing secrets, tokens, or external service credentials.
- Example workflows should preserve artifacts even when the audit threshold fails, as long as report files were generated.

## Testing Strategy

The implementation plan should include:

- failing fixture tests for Vite/SPA route-list coverage before code changes
- focused route-list safety tests for missing, outside-static-dir, and non-HTML entries
- report tests proving source findings include inspect-next guidance in Markdown and HTML
- JSON schema tests if optional fields are added to source findings
- docs/example workflow sanity checks using deterministic text or YAML validation available in the repo
- golden fixture updates only when report output intentionally changes
- full `npm test`
- full `npm run validate`

## Acceptance Criteria

Track 2 is complete when:

- a deterministic SPA fixture proves route-list auditing for client-route intent
- route-list docs include copy-paste local and CI commands
- repo source findings expose actionable inspect-next guidance without breaking existing JSON consumers
- Markdown and HTML reports make the next developer inspection step clear for repo source findings
- a GitHub Actions example uploads JSON, Markdown, and HTML reports and documents threshold behavior
- CI passes after all changes
- all new language preserves readiness-versus-measurement boundaries

## Implementation Planning Notes

The implementation plan should be task-based and suitable for subagent-driven execution. A likely task split is:

1. SPA fixture and route-list behavior tests.
2. Source-finding guidance model and report rendering.
3. Route-list docs and GitHub Actions example.
4. Golden updates, validation, and changelog/PRD alignment.

The plan should keep tasks independent enough that each subagent can work from one focused slice and return a reviewable diff.

## Next Step After Approval

After this written spec is approved, create a Track 2 implementation plan with the `superpowers:writing-plans` workflow. Do not implement Track 2 code or docs before that implementation plan is written and approved for execution.
