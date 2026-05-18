# Developer Repo Audit Completion Design

Date: 2026-05-18
Repository: openclaw-geo-seo-audit-skill
Status: Approved direction; ready for implementation planning after user review

## Purpose

Phase B+ should make `audit-repo` useful as a developer-facing local and CI gate. The current merged repo audit baseline can inspect repositories, audit detected static output, audit explicit preview servers, emit repo evidence, and report source findings for missing or unreachable audit paths. The next tranche should turn that baseline into a practical pre-deployment workflow for developers who want deterministic SEO/GEO readiness feedback before a site ships.

This phase optimizes for developers, not agency report production. The primary user should be able to run one command in a source repository, build or preview the app with explicit bounded commands, audit generated pages, receive deterministic findings, and fail CI when configured thresholds are crossed.

## Current Baseline

Main currently includes:

- `detect-repo [path]` with package-manager, framework-signal, static-output, route-source, build-command, and preview-command reporting.
- `audit-repo <path>` with detected static output audits.
- `audit-repo <path>` with explicit `--preview-command` and `--preview-url` audits.
- Preview process startup polling, preflight checks, timeout handling, capped output capture, and cleanup.
- Repo evidence in JSON and Markdown reports.
- Repo source findings for missing audit path, missing static directory, empty static output, and unreachable preview server.
- Restricted-mode preview probing through guarded fetches.
- Packaged CLI source-map support.
- Fixture coverage for generic static output and generic npm preview workflows.

## Goals

- Add explicit build support for developer workflows.
- Add route-list support for repository audits.
- Add repo audit config support so CI jobs do not need long command lines.
- Add developer-friendly CI failure semantics for repo audits.
- Add framework-like fixture coverage, starting with a Vite-style static build flow that uses only repository-local test fixtures and no new runtime dependencies.
- Add deterministic source-level findings that are valuable in CI and do not require brittle framework source parsing.
- Keep the skill wrapper and CLI language honest: report readiness and evidence gaps unless ranking evidence is supplied.

## Non-Goals

- Do not automatically install dependencies.
- Do not automatically run inferred build or preview scripts.
- Do not parse arbitrary framework source trees deeply.
- Do not support authenticated page flows.
- Do not add Search Console API, SERP API, AI-answer probes, or Lighthouse execution in this phase.
- Do not create automated remediation or code modification features.
- Do not expand into enterprise-scale crawling.

## Recommended Approach

Use a developer CI-first approach.

The CLI should execute only explicitly supplied repo commands. A developer may ask the CLI to build the app, audit a static directory, audit a route list, or audit an explicit preview server. Detection can suggest useful commands and framework signals, but execution remains opt-in.

This keeps the product deterministic, safe, and debuggable. It also matches the strongest immediate use case: adding `audit-repo` to local checks and CI after the app already has a known build command.

## Developer Workflows

### Static build audit

```bash
openclaw-geo-seo-audit audit-repo . \
  --build-command "npm run build" \
  --static-dir dist \
  --fail-on P1 \
  --out audit.json \
  --markdown audit.md
```

Expected behavior:

1. Detect repository metadata.
2. Run the explicit build command with a bounded timeout.
3. Discover HTML routes from `dist`.
4. Audit those routes with the existing audit engine.
5. Write JSON and Markdown.
6. Exit `2` if repo source findings or rendered audit findings meet `--fail-on`.

### Route-list repo audit

```bash
openclaw-geo-seo-audit audit-repo . \
  --static-dir dist \
  --route-list routes.txt \
  --max-pages 50
```

Expected behavior:

1. Resolve route-list entries relative to the repo or static output as appropriate.
2. Audit only the supplied route set.
3. Report invalid, missing, or non-HTML route-list entries as source findings.

### Config-driven CI audit

```bash
openclaw-geo-seo-audit audit-repo . --config audit.config.json
```

Expected behavior:

1. Read normal audit settings from `audit.config.json`.
2. Read repo-specific settings from a `repo` object in the same config.
3. Let CLI flags override config values.
4. Produce the same JSON shape as direct CLI invocation.

### Preview audit remains explicit

```bash
openclaw-geo-seo-audit audit-repo . \
  --preview-command "npm run preview -- --host 127.0.0.1" \
  --preview-url http://127.0.0.1:4173
```

Explicit preview options should continue to take precedence over detected static output.

## CLI Additions

Add repo options:

```text
--build-command <command>
--max-build-ms <n>
--route-list <file>
--fail-on P0|P1|P2|P3
--config <file>
```

Existing repo options remain:

```text
--static-dir <dir>
--preview-command <command>
--preview-url <url>
--max-preview-ms <n>
--mode full|sample|single
--max-pages <n>
--max-depth <n>
--security local|restricted
--out <file>
--markdown <file>
```

## Configuration Design

Extend `audit.config.json` with an optional `repo` object:

```json
{
  "target": "https://example.com",
  "crawl": {
    "mode": "single",
    "maxPages": 25,
    "maxDepth": 2
  },
  "repo": {
    "buildCommand": "npm run build",
    "staticDir": "dist",
    "routeList": "routes.txt",
    "maxBuildMs": 120000,
    "maxPreviewMs": 30000
  }
}
```

The repo config should be validated with the existing config validation command. File paths should resolve relative to the config file directory. CLI flags should override config values.

Use the existing `audit.config.json` rather than introducing a separate `repo-audit.config.json`. One config file is easier for developers to commit, easier for CI to invoke, and avoids splitting crawl settings from repo execution settings.

## Execution Model

`runRepoAudit` should resolve a repo audit plan before executing anything:

1. Resolve repo path and config.
2. Detect repository metadata.
3. Merge config and CLI options.
4. Validate incompatible options.
5. Run explicit build command if supplied.
6. Select audit source:
   - explicit preview if `previewCommand` and `previewUrl` are supplied;
   - configured or detected static directory;
   - source finding when no usable audit path exists.
7. Resolve route list if supplied.
8. Run existing `runAudit`.
9. Attach repo evidence and source findings.
10. Apply `--fail-on` to both rendered audit findings and repo source findings.

Explicit preview should continue to override auto-detected static output. Explicit static directory should override detected static output. Explicit route list should constrain the page set after the source path is selected.

## Build Process Management

Add build command execution to the existing repo process layer rather than creating a second process helper with different behavior.

Build command behavior:

- Run through the shell in the repository directory, matching current preview command behavior.
- Require an explicit `--build-command` or config `repo.buildCommand`.
- Default timeout: 120000 ms.
- Use `--max-build-ms` for override.
- Capture capped stdout/stderr summaries.
- Return deterministic errors for spawn failure, timeout, and non-zero exit.
- Do not run in `security.mode === "restricted"` in this phase.

Build failures should not be represented as rendered page findings. They should be repo source findings.

## Source Findings

Add source findings that help developers fix CI failures quickly.

Initial finding IDs:

- `repo.build_failed`
- `repo.build_timeout`
- `repo.build_unavailable`
- `repo.route_list_missing`
- `repo.route_list_empty`
- `repo.route_list_entry_missing`
- `repo.route_list_entry_not_html`
- `repo.robots_missing`
- `repo.sitemap_missing`
- `repo.static_dir_missing`
- `repo.static_routes_missing`
- `repo.preview_unreachable`
- `repo.audit_path_missing`

`repo.robots_missing` and `repo.sitemap_missing` should be scoped to static output audits where the files can be checked deterministically. They should start as P2 or P3 findings unless a stronger evidence rule is later justified.

The phase should not attempt framework metadata API findings yet unless the fixture and parser are deterministic enough to avoid fragile false positives.

## Output Model

Keep the existing optional `repo` top-level section and extend it additively:

```json
{
  "repo": {
    "path": "/repo",
    "detectedFramework": "vite",
    "confidence": "high",
    "packageManager": "npm",
    "buildCommand": "npm run build",
    "build": {
      "executed": true,
      "durationMs": 1342,
      "exitCode": 0,
      "stdout": "summary",
      "stderr": "summary"
    },
    "previewCommand": null,
    "previewUrl": null,
    "staticDir": "/repo/dist",
    "staticDirRelative": "dist",
    "routeList": "/repo/routes.txt",
    "routeSources": [],
    "sourceFindings": [],
    "notes": []
  }
}
```

All new fields should be optional so existing `audit` output and existing repo audit output remain compatible.

## CI Semantics

Exit codes should remain predictable:

- `0`: audit completed and no configured failure threshold was met.
- `1`: execution/configuration error that prevented a valid audit run.
- `2`: audit completed but rendered findings or repo source findings met `--fail-on`, or repo source findings are present when no explicit `--fail-on` is supplied and they prevent page evidence collection.

For `--out` and `--markdown`, the CLI should still write available output before returning `2` when evidence exists.

## Safety

- Do not run install commands automatically.
- Do not run detected build or preview commands automatically.
- Do not run build or preview commands in restricted security mode.
- Keep stdout/stderr capped.
- Document that explicit build and preview commands execute through the local shell in the repository directory.
- Preserve preview cleanup behavior.
- Avoid reading arbitrary source files beyond small config, package, route-list, and generated static output files.

## Testing Strategy

Add tests in the same style as the existing CLI suite:

- Config parsing and validation for `repo` options.
- CLI validation for missing and invalid new repo option values.
- Build process success, failure, timeout, and capped output tests.
- Static audit after explicit build command.
- Route-list resolution from config and CLI.
- Missing and invalid route-list source findings.
- `--fail-on` behavior across repo source findings and rendered findings.
- Restricted mode rejection for command execution.
- Vite-style fixture using a Node script that writes deterministic `dist` output.
- Backward compatibility for existing `audit` and `audit-repo` behavior.
- Package dry-run still includes required CLI source files.

## Documentation Updates

Update:

- `README.md` with developer CI examples.
- `skill/geo-seo-audit/SKILL.md` with repo config and explicit build workflow guidance.
- `CHANGELOG.md` with Phase B+ unreleased notes.
- `docs/prd-deterministic-audit-cli.md` after implementation to mark Phase B+ shipped.

## Acceptance Criteria

- A developer can run an explicit build-and-static audit from one command.
- A developer can run a repo audit from `audit.config.json`.
- A developer can constrain repo audits with a route list.
- Repo audit CI can fail on source findings or rendered findings through `--fail-on`.
- Build commands are explicit, bounded, and tested for failure paths.
- Restricted mode blocks local command execution for repo audits.
- Existing URL, local file, static repo, and explicit preview repo audits keep working.
- All tests, validation, package dry run, and packed CLI source smoke pass.

## Implementation Decisions For Planning

- Use `repo.buildCommand` inside `audit.config.json`; do not create a separate repo config file.
- Use a Vite-style fixture first, implemented with repository-local Node scripts and no new runtime dependencies.
- Start source findings with generated output checks and route-list checks; defer framework source parsing.
- Treat command execution in restricted mode as unsupported for this phase.
