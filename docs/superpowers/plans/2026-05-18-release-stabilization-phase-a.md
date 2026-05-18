# Release Stabilization Phase A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stabilize the current deterministic GEO/SEO audit CLI and skill wrapper for a clean `0.2.0` beta release before starting repo-to-audit mode.

**Architecture:** This is a release-readiness tranche, not a runtime behavior tranche. Keep runtime code unchanged unless verification exposes a concrete defect. Refresh the PRD and release docs to match the implemented CLI, then push the existing `guardrail-layer` branch through the repository review workflow with full verification evidence.

**Tech Stack:** Markdown documentation, npm workspace CLI package, Node.js 20+, built-in `node:test`, GitHub Actions, GitHub CLI.

---

## Scope

This plan implements Phase A from `docs/superpowers/specs/2026-05-18-release-stabilization-and-repo-audit-design.md`.

Included:

- Refresh `docs/prd-deterministic-audit-cli.md` so it describes the implemented `0.2.0` baseline and the approved v1.5 repo-to-audit roadmap.
- Add a complete `0.2.0` changelog entry.
- Tighten release checklist language around documentation, package contents, guardrails, and post-merge verification.
- Review, verify, push, and open a PR for the current `guardrail-layer` branch.

Excluded:

- Implementing `audit-repo` or `detect-repo`.
- Expanding rule triggers.
- Adding API-backed Search Console, SERP, or AI-answer integrations.
- Publishing to npm before the release checklist has been executed.

## File Structure

- Modify `docs/prd-deterministic-audit-cli.md`: product baseline, shipped capabilities, resolved decisions, and roadmap.
- Modify `CHANGELOG.md`: add `0.2.0` release notes.
- Modify `docs/release-checklist.md`: add documentation alignment and post-merge verification requirements.
- No runtime source files should change in this phase unless a verification failure identifies a release-blocking bug.

## Task 1: Refresh PRD Status And Current Baseline

**Files:**
- Modify: `docs/prd-deterministic-audit-cli.md`

- [ ] **Step 1: Update the PRD title block**

Replace the current title block:

```markdown
Status: Draft for review  
Date: 2026-05-17  
Repository: openclaw-geo-seo-audit-skill  
Primary users: technical SEOs, growth teams, content strategists, frontend engineers, agency auditors, and AI agents running OpenClaw skills
```

with:

```markdown
Status: Current implementation baseline plus v1.5 roadmap  
Date: 2026-05-18  
Repository: openclaw-geo-seo-audit-skill  
Current CLI package: openclaw-geo-seo-audit@0.2.0  
Primary users: technical SEOs, growth teams, content strategists, frontend engineers, agency auditors, and AI agents running OpenClaw skills
```

- [ ] **Step 2: Add implementation baseline after Section 1**

Insert this section immediately after the two-paragraph summary in `## 1. Summary`:

```markdown
### Current baseline

As of `openclaw-geo-seo-audit@0.2.0`, the repository contains a working deterministic CLI and OpenClaw skill wrapper. The CLI can audit local HTML, live URLs, URL lists, sitemap-seeded crawls, and bounded same-origin crawls. It emits JSON and Markdown, imports supplied ranking/performance evidence, evaluates deterministic page and site rules, and includes restricted-mode guardrails for untrusted targets.

The next approved product target is v1.5 repo-to-audit mode: the CLI should inspect a website source repository, detect how to build or preview it, audit the generated site through the existing evidence engine, and add source-level findings where deterministic.
```

- [ ] **Step 3: Replace outdated current gaps**

In `## 2. Problem`, replace the `Current gaps:` list with:

```markdown
Current remaining gaps:

- The CLI audits live URLs, local files, localhost apps, URL lists, and bounded crawls, but it does not yet treat a source repository as a first-class audit target.
- The PRD, changelog, and release docs need to reflect the implemented `0.2.0` baseline before release.
- Some rule IDs exist in the taxonomy before full trigger coverage, especially deeper entity clarity, hidden text risk, duplicate content clusters, and structured-data visible-content mismatch.
- Ranking and GEO visibility measurement still depends on supplied exports. API-backed Search Console, SERP provider, and AI-answer probes are future integrations.
- The product needs a repo-to-audit mode that can safely build or preview common web apps, crawl the generated site, and connect source-level evidence to rendered output.
```

- [ ] **Step 4: Add repo-to-audit to the goals section**

In `## 3. Goals`, add this bullet after `Support live URLs and local web apps.`:

```markdown
- Support website source repositories through a dedicated repo-to-audit mode that can detect framework/build signals, run bounded local build or preview commands, crawl the generated site, and report source-level evidence.
```

- [ ] **Step 5: Add repo-to-audit architecture subsection**

In `## 8. Architecture`, after `### 8.2 Skill Wrapper Layer`, add:

```markdown
### 8.3 Repo-To-Audit Layer

The repo-to-audit layer is the approved v1.5 extension. It should inspect a website source repository, detect supported framework and package-manager signals, choose a static-output or preview-server path, run bounded commands, and feed the generated site into the existing CLI audit engine.

This layer should add a `repo` evidence section to the JSON output. Source-level evidence must remain separate from rendered-page evidence so reports can distinguish build/configuration problems from observed website output.
```

- [ ] **Step 6: Add planned repo commands**

After `### 9.4 Explain Rule`, add:

````markdown
### 9.5 Detect Repo

```bash
openclaw-geo-seo-audit detect-repo .
```

Planned behavior:

- Inspect a repository path.
- Report detected framework, package manager, likely build command, likely preview command, static output candidates, route sources, and confidence.
- Avoid executing repository scripts.

### 9.6 Audit Repo

```bash
openclaw-geo-seo-audit audit-repo .
```

Planned behavior:

- Inspect a repository path.
- Use explicit commands when supplied.
- Use conservative auto-detection only when framework signals are clear.
- Build or preview the app within configured timeouts.
- Crawl generated output with the existing audit engine.
- Emit existing page/site evidence plus a `repo` evidence section.
````

- [ ] **Step 7: Replace open decisions with resolved decisions and planning questions**

Replace all of `## 21. Open Decisions` with:

```markdown
## 21. Resolved Decisions And Remaining Planning Questions

Resolved for `0.2.0`:

- The CLI lives as a separate npm workspace package under `packages/cli`.
- Playwright remains optional through peer dependency and dynamic import.
- The CLI reports readiness by default and requires supplied evidence for measured rankings or AI answer visibility.
- The default audit mode remains conservative; users opt into broader crawls with `--mode full` or `--mode sample`.
- JSON output is versioned with `schemaVersion: "1.0.0"`.
- Raw Google source corpus remains a repository asset. The CLI package ships source code and compact citation behavior, not the full raw corpus.
- CI severity gating is configured with explicit `--fail-on P0|P1|P2|P3`.

Planning questions for repo-to-audit mode:

- Which fixture framework should be implemented first: Vite, Next.js, or Astro?
- Should the first `audit-repo` release require explicit build and preview commands, or allow high-confidence auto-detected commands?
- Should repo-to-audit internals start as one module or split detection, process management, route discovery, and source evidence into separate modules?
```

- [ ] **Step 8: Update recommended V1 scope**

In `## 23. Recommended V1 Scope`, add this paragraph before `V1 should defer:`:

```markdown
The approved v1.5 scope adds repo-to-audit mode after `0.2.0` release stabilization. Repo-to-audit mode should be treated as a focused extension of the current CLI rather than a replacement for URL, local app, static file, or URL-list audits.
```

- [ ] **Step 9: Run PRD scans**

Run:

```bash
rg -n "Draft for review|Current gaps:|does not yet perform end-to-end website audits|Open Decisions" docs/prd-deterministic-audit-cli.md
```

Expected output: no matches.

Run:

```bash
rg -n "repo-to-audit|audit-repo|detect-repo|0\\.2\\.0" docs/prd-deterministic-audit-cli.md
```

Expected output: matches in the title block, baseline, architecture, command, decision, and v1.5 scope sections.

## Task 2: Update Release Hygiene Documentation

**Files:**
- Modify: `CHANGELOG.md`
- Modify: `docs/release-checklist.md`

- [ ] **Step 1: Add `0.2.0` changelog entry**

Insert this section above `## 0.1.0 - 2026-05-16` in `CHANGELOG.md`:

```markdown
## 0.2.0 - 2026-05-18

- Added the deterministic `openclaw-geo-seo-audit` CLI package with `audit`, `snapshot`, `validate-config`, and `explain-rule` commands.
- Added config-driven audits, URL-list sampling, bounded same-origin crawling, sitemap seeding, robots enforcement, include/exclude crawl filters, and JSON/Markdown outputs.
- Added deterministic page and site rules for technical eligibility, crawl/index controls, search appearance, structured data, content answerability, entity signals, performance imports, and ranking-evidence gaps.
- Added optional evidence imports for Search Console CSV, SERP JSON, AI-answer JSON, and Lighthouse JSON.
- Added restricted security mode with network/file guardrails, request timeouts, response/file byte caps, manual redirect enforcement, and disabled browser rendering for restricted URL targets.
- Added implementation-task metadata to findings and CI severity threshold support with `--fail-on`.
- Added fixture-site and golden-output regression coverage plus GitHub CI and release workflow scaffolding.
- Updated the OpenClaw skill wrapper to use the CLI as the deterministic evidence source and to avoid unsupported ranking claims.
```

- [ ] **Step 2: Add documentation alignment to release checklist**

In `docs/release-checklist.md`, insert this section after the opening paragraph:

```markdown
## Documentation Alignment

Before publishing:

- Confirm `docs/prd-deterministic-audit-cli.md` describes the current CLI package version and the next roadmap target.
- Confirm `CHANGELOG.md` contains the package version being released.
- Confirm `README.md` and `skill/geo-seo-audit/SKILL.md` describe readiness versus measured rankings accurately.
- Confirm raw source corpus files remain repository assets and are not included in the CLI package dry run.
```

- [ ] **Step 3: Add post-merge verification to release checklist**

In `docs/release-checklist.md`, insert this section before `## GitHub Release Workflow`:

```markdown
## Post-Merge Verification

After merging release-stabilization work to `main`, run:

```bash
git checkout main
git pull --ff-only origin main
npm ci
npm audit --omit=dev
npm test
npm run validate
npm pack --dry-run --workspace packages/cli
git status --short --branch
```

Expected result:

- Audit reports `found 0 vulnerabilities`.
- Tests pass.
- Validation reports `ok: true`.
- Package dry run lists only intended CLI package files.
- Git status shows a clean `main` branch.
```

- [ ] **Step 4: Run release doc scans**

Run:

```bash
rg -n "0\\.2\\.0|Documentation Alignment|Post-Merge Verification|restricted security mode|--fail-on" CHANGELOG.md docs/release-checklist.md
```

Expected output: matches in both files.

Run:

```bash
rg -n "TB[D]|TO[D]O|placeholde[r]|FIXM[E]" CHANGELOG.md docs/release-checklist.md docs/prd-deterministic-audit-cli.md || true
```

Expected output: no matches.

- [ ] **Step 5: Check doc formatting**

Run:

```bash
git diff --check -- docs/prd-deterministic-audit-cli.md CHANGELOG.md docs/release-checklist.md
```

Expected output: no output and exit code `0`.

- [ ] **Step 6: Commit documentation updates**

Run:

```bash
git status --short
git add docs/prd-deterministic-audit-cli.md CHANGELOG.md docs/release-checklist.md
git commit -m "docs: refresh release stabilization baseline"
```

Expected output: commit succeeds and includes only those three files.

## Task 3: Run Release Verification

**Files:**
- No file edits expected.

- [ ] **Step 1: Confirm branch state**

Run:

```bash
git status --short --branch
git log --oneline origin/main..HEAD
```

Expected output:

- Status shows branch `guardrail-layer`.
- Status has no modified or untracked files.
- Log includes the guardrail commit, the design spec commit, and the release-stabilization documentation commit.

- [ ] **Step 2: Review branch diff**

Run:

```bash
git diff --stat origin/main...HEAD
git diff --name-only origin/main...HEAD
```

Expected output:

- Runtime changes are limited to the existing guardrail layer.
- New documentation changes are limited to the approved spec, plan, PRD, changelog, and release checklist.

- [ ] **Step 3: Run dependency install from lockfile**

Run:

```bash
npm ci
```

Expected output: dependencies install from `package-lock.json` without lockfile changes.

- [ ] **Step 4: Run security audit**

Run:

```bash
npm audit --omit=dev
```

Expected output:

```text
found 0 vulnerabilities
```

- [ ] **Step 5: Run tests**

Run:

```bash
npm test
```

Expected output:

```text
tests 74
pass 74
fail 0
```

- [ ] **Step 6: Run skill validation**

Run:

```bash
npm run validate
```

Expected output contains:

```json
{
  "ok": true
}
```

The full output should also report required files, source pages, citations, source-map entries, and rules.

- [ ] **Step 7: Run package dry run**

Run:

```bash
npm pack --dry-run --workspace packages/cli
```

Expected output:

- Package name is `openclaw-geo-seo-audit`.
- Package version is `0.2.0`.
- Tarball contents include `packages/cli/src` files and `packages/cli/package.json`.
- Tarball contents do not include `references/source-corpus`, `examples/golden`, or docs.

- [ ] **Step 8: Confirm clean working tree**

Run:

```bash
git status --porcelain=v1 --untracked-files=all
```

Expected output: no output.

## Task 4: Push Guardrail Branch And Open PR

**Files:**
- No file edits expected.

- [ ] **Step 1: Verify GitHub CLI authentication**

Run:

```bash
gh --version
gh auth status
```

Expected output:

- `gh --version` prints an installed GitHub CLI version.
- `gh auth status` reports an authenticated session for `github.com`.

If `gh auth status` fails, stop this task and report the authentication blocker. Do not use browser-based manual PR creation from the plan executor.

- [ ] **Step 2: Push branch**

Run:

```bash
git push -u origin guardrail-layer
```

Expected output:

- Branch is pushed or reports everything up to date.
- Local branch tracks `origin/guardrail-layer`.

- [ ] **Step 3: Create PR**

Run:

```bash
gh pr create \
  --base main \
  --head guardrail-layer \
  --title "Stabilize GEO SEO audit CLI guardrails" \
  --body $'## Summary\n\n- Adds the audit guardrail layer for restricted-mode safety and bounded evidence reads.\n- Documents the approved release stabilization and repo-to-audit roadmap.\n- Refreshes the PRD, changelog, and release checklist for the 0.2.0 beta baseline.\n\n## Validation\n\n- npm ci\n- npm audit --omit=dev\n- npm test\n- npm run validate\n- npm pack --dry-run --workspace packages/cli\n\n## Notes\n\n- This PR keeps ranking claims limited to supplied evidence.\n- Repo-to-audit mode is documented as the next phase and is not implemented in this release-stabilization tranche.'
```

Expected output: GitHub prints the created PR URL.

- [ ] **Step 4: Capture PR status**

Run:

```bash
gh pr status
```

Expected output: PR appears under current branch or created pull requests.

## Task 5: Merge And Main-Branch Verification

**Files:**
- No file edits expected.

- [ ] **Step 1: Confirm PR checks**

Run:

```bash
gh pr checks --watch
```

Expected output: all required checks pass.

If checks fail, stop this task, copy the failing check name and failure summary, and do not merge.

- [ ] **Step 2: Merge PR**

Run:

```bash
gh pr merge guardrail-layer --squash --delete-branch
```

Expected output: PR is merged and remote branch is deleted.

- [ ] **Step 3: Update local main**

Run:

```bash
git checkout main
git pull --ff-only origin main
```

Expected output: local `main` fast-forwards to the merged commit.

- [ ] **Step 4: Run post-merge verification**

Run:

```bash
npm ci
npm audit --omit=dev
npm test
npm run validate
npm pack --dry-run --workspace packages/cli
```

Expected output:

- `npm audit --omit=dev` reports `found 0 vulnerabilities`.
- `npm test` reports all tests passing.
- `npm run validate` reports `"ok": true`.
- `npm pack --dry-run --workspace packages/cli` lists the intended `0.2.0` package contents.

- [ ] **Step 5: Confirm clean main**

Run:

```bash
git status --short --branch
git status --porcelain=v1 --untracked-files=all
```

Expected output:

- Branch line shows `main...origin/main`.
- Porcelain status returns no output.

## Task 6: Phase A Completion Note

**Files:**
- Modify: `docs/superpowers/specs/2026-05-18-release-stabilization-and-repo-audit-design.md`

- [ ] **Step 1: Update spec status**

After Phase A is merged and verified on `main`, change the spec status line from:

```markdown
Status: Approved direction, ready for implementation planning
```

to:

```markdown
Status: Phase A complete; Phase B repo-to-audit mode ready for implementation planning
```

- [ ] **Step 2: Run spec scan**

Run:

```bash
rg -n "Phase A complete|Phase B repo-to-audit mode ready" docs/superpowers/specs/2026-05-18-release-stabilization-and-repo-audit-design.md
git diff --check -- docs/superpowers/specs/2026-05-18-release-stabilization-and-repo-audit-design.md
```

Expected output:

- `rg` finds the updated status line.
- `git diff --check` prints no output and exits `0`.

- [ ] **Step 3: Commit completion note**

Run:

```bash
git add docs/superpowers/specs/2026-05-18-release-stabilization-and-repo-audit-design.md
git commit -m "docs: mark release stabilization complete"
git push origin main
```

Expected output: commit and push succeed on `main`.

## Final Verification Checklist

Run:

```bash
git status --short --branch
git status --porcelain=v1 --untracked-files=all
npm audit --omit=dev
npm test
npm run validate
npm pack --dry-run --workspace packages/cli
```

Expected result:

- Working tree has no uncommitted or untracked files.
- Branch is clean against its upstream.
- Audit reports `found 0 vulnerabilities`.
- Tests pass.
- Validation reports `ok: true`.
- Package dry run lists only intended CLI package files.

## Handoff To Phase B

After Phase A is complete, write a separate implementation plan for repo-to-audit mode using `docs/superpowers/specs/2026-05-18-release-stabilization-and-repo-audit-design.md` as the source spec.

That Phase B plan should decide:

- First fixture framework.
- Explicit-command versus auto-detection default.
- Module boundaries for repo detection, process management, route discovery, source evidence, and unified output.
