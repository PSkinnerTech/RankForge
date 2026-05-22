# Track 1 Post-Release Stabilization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring RankForge documentation, release checks, and CI workflow metadata into alignment with the published `rankforge@0.3.0` release.

**Architecture:** This is a stabilization track: no CLI runtime behavior changes, no schema changes, and no report rendering changes. The work updates product documentation, release documentation, user-facing known-limits language, and GitHub Actions runtime versions while preserving Node 20 as the package's minimum supported runtime.

**Tech Stack:** Markdown documentation, GitHub Actions YAML, npm CLI, Node.js test suite.

---

## File Structure

- Modify `docs/prd-deterministic-audit-cli.md`: replace release-candidate language with published package language, fix "An RankForge" grammar, and add a concise published-baseline/known-limits update.
- Modify `docs/release-checklist.md`: document npm registry verification, actual publish flow, post-publish registry smoke test, and future trusted-publishing direction.
- Modify `README.md`: add a compact Known Limits section for users installing from npm.
- Modify `.github/workflows/ci.yml`: upgrade GitHub Actions from Node-20-runtime actions to Node-24-runtime action majors while keeping `node-version: 20`.
- Modify `.github/workflows/release.yml`: same action runtime upgrade and release-check wording alignment.

Do not modify CLI source files in this track. Do not change `packages/cli/package.json` version.

---

### Task 1: Update PRD Published-State Language

**Files:**
- Modify: `docs/prd-deterministic-audit-cli.md`

- [ ] **Step 1: Run the current-state wording check**

Run:

```bash
rg -n "release candidate|before publishing|An RankForge|Current CLI package" docs/prd-deterministic-audit-cli.md
```

Expected before implementation: matches for `release candidate`, `An RankForge`, and `Current CLI package`.

- [ ] **Step 2: Update the PRD header**

Replace the header block at the top of `docs/prd-deterministic-audit-cli.md` with:

```markdown
# Product Requirements Document: Deterministic GEO/SEO Audit CLI + Skill Wrapper

Status: Published 0.3.0 baseline plus first five post-release roadmap
Date: 2026-05-22
Repository: RankForge
Current CLI package: rankforge@0.3.0 (published on npm)
Primary users: technical SEOs, growth teams, content strategists, frontend engineers, agency auditors, and AI agents running RankForge skills
```

- [ ] **Step 3: Fix the summary grammar and baseline wording**

In section `1. Summary`, replace:

```markdown
2. An RankForge skill wrapper that runs the CLI, consumes the evidence, and produces a cited human audit report.
```

with:

```markdown
2. A RankForge skill wrapper that runs the CLI, consumes the evidence, and produces a cited human audit report.
```

Replace the `### Current baseline` paragraphs with:

```markdown
### Current baseline

As of the published `rankforge@0.3.0` release, the repository contains a working deterministic CLI and RankForge skill wrapper. The CLI can audit local HTML, live URLs, URL lists, sitemap-seeded crawls, bounded same-origin crawls, static output repositories, and explicit preview-server repositories. It emits JSON, Markdown, and standalone HTML reports, imports supplied ranking/performance evidence, evaluates deterministic page and site rules, includes repo evidence for source-repository audits, and includes restricted-mode guardrails for untrusted targets.

The latest completed product target is developer-focused repo audit completion: repository audits now support explicit build commands, route lists, repo config, CI threshold failures, and deterministic source-level findings without overclaiming rankings. The next roadmap target is the first five post-release tracks: stabilization, developer repo audit maturity, report usefulness polish, public docs/examples, and release automation.
```

- [ ] **Step 4: Update the Problem section release wording**

In section `2. Problem`, replace:

```markdown
The current repository contains a working deterministic CLI, an RankForge skill wrapper, a Google Search Central citation corpus, report templates, fixtures, golden-output tests, release workflows, and initial source-repository audit mode.
```

with:

```markdown
The current repository contains a published deterministic CLI, a RankForge skill wrapper, a Google Search Central citation corpus, report templates, fixtures, golden-output tests, release workflows, and initial source-repository audit mode.
```

Replace the current gap:

```markdown
- Release documentation and changelog entries must stay aligned with the implemented `0.3.0` release candidate before publishing the next package version.
```

with:

```markdown
- Release documentation, PRD language, and checklist steps must stay aligned with the published `0.3.0` package before the next implementation phase begins.
```

- [ ] **Step 5: Add published-state known limits after Non-Goals**

After section `4. Non-Goals`, add:

```markdown
## 4.1 Published-State Known Limits

The published `rankforge@0.3.0` package is a readiness auditor, not a ranking measurement platform. It reports deterministic SEO/GEO readiness from fetched pages, generated static output, repository evidence, and supplied imports. Rankings, SERP positions, Search Console performance, AI-answer visibility, and Lighthouse performance measurements are reported only when the user supplies those evidence files.

Repository audits require explicit build or preview commands when command execution is needed. RankForge does not install dependencies, infer and execute framework commands, modify audited source code, or claim that a passed audit guarantees search or generative-engine performance.
```

- [ ] **Step 6: Verify the PRD wording**

Run:

```bash
rg -n "release candidate|before publishing|An RankForge" docs/prd-deterministic-audit-cli.md
rg -n "published `rankforge@0.3.0`|Published-State Known Limits|first five post-release tracks" docs/prd-deterministic-audit-cli.md
git diff --check -- docs/prd-deterministic-audit-cli.md
```

Expected:

- First command exits with no matches.
- Second command finds the new published-state language.
- `git diff --check` exits 0.

- [ ] **Step 7: Commit the PRD update**

Run:

```bash
git add docs/prd-deterministic-audit-cli.md
git commit -m "docs: update PRD for published RankForge release"
```

---

### Task 2: Update Release Checklist For Published npm Flow

**Files:**
- Modify: `docs/release-checklist.md`

- [ ] **Step 1: Run the current release-check wording check**

Run:

```bash
rg -n "NPM_TOKEN|dry_run|Post-Merge|npm view rankforge|registry install|trusted publishing|browser" docs/release-checklist.md
```

Expected before implementation: matches for `NPM_TOKEN`, `dry_run`, and `Post-Merge`; no registry-install or trusted-publishing guidance.

- [ ] **Step 2: Add registry state to Documentation Alignment**

In `## Documentation Alignment`, after:

```markdown
- Confirm the root `package.json` has `private: true` so accidental root publishes are blocked.
```

add:

````markdown
- Confirm npm registry metadata points at the intended package and repository:

```bash
npm view rankforge version dist-tags.latest homepage bugs.url repository.url
```
````

- [ ] **Step 3: Replace the GitHub Release Workflow section**

Replace the existing `## GitHub Release Workflow` section with:

````markdown
## Publish Flow

The currently verified manual publish path is:

```bash
npm publish --workspace packages/cli --access public
```

For accounts protected by npm web authentication, the npm CLI may print an authentication URL. Complete the browser security-key or passkey challenge, return to the terminal, and let the publish finish.

For token-based publishing, use a granular npm access token with package read/write access and the npm-required two-factor bypass setting. Do not use a broad long-lived token when a narrower token is sufficient. Do not print tokens in logs.

## Post-Publish Registry Smoke

After publishing, verify the registry and install the package in a clean temporary project:

```bash
npm view rankforge version dist-tags.latest homepage bugs.url repository.url

tmpdir="$(mktemp -d)"
mkdir "$tmpdir/project"
cd "$tmpdir/project"
npm init -y
npm install --ignore-scripts rankforge@0.3.0
npx rankforge --version
npx rankforge --help
npx rankforge explain-rule indexability.noindex
```

Expected result:

- `npm view` reports the released version as `latest`.
- The temporary install succeeds without repository-local files.
- `npx rankforge --version` prints the released version.
- `npx rankforge explain-rule indexability.noindex` prints JSON for that rule.

## GitHub Release Workflow

- Use `.github/workflows/release.yml` for verification and optional token-backed publish attempts.
- Run with `dry_run: "true"` first.
- Publishing with the workflow currently requires the `NPM_TOKEN` repository secret.
- The preferred future direction is npm trusted publishing with provenance if it can be configured without weakening package publishing security.
- Run with `dry_run: "false"` only after tests, validation, package dry run, version, changelog, and registry expectations are correct.
````

- [ ] **Step 4: Verify release checklist wording**

Run:

```bash
rg -n "npm view rankforge version|Post-Publish Registry Smoke|trusted publishing|npm publish --workspace packages/cli --access public|rankforge@0.3.0" docs/release-checklist.md
git diff --check -- docs/release-checklist.md
```

Expected: all required phrases are present and diff check exits 0.

- [ ] **Step 5: Commit the release checklist update**

Run:

```bash
git add docs/release-checklist.md
git commit -m "docs: document npm release verification"
```

---

### Task 3: Add User-Facing Known Limits To README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Check current README limit language**

Run:

```bash
rg -n "Known Limits|does not claim measured rankings|does not install|readiness" README.md
```

Expected before implementation: readiness language exists, but no `Known Limits` section.

- [ ] **Step 2: Add the Known Limits section**

In `README.md`, after the paragraph:

```markdown
By default, the product reports SEO/GEO readiness. It does not claim measured rankings, SERP positions, or AI answer visibility unless Search Console, SERP, or AI answer evidence is supplied.
```

add:

```markdown
## Known Limits

- RankForge reports SEO/GEO readiness, not guaranteed rankings or guaranteed AI-answer visibility.
- Search Console, SERP, AI-answer, and Lighthouse measurements are reported only from supplied evidence files.
- Repository audits run explicit build or preview commands only when the user supplies those commands.
- RankForge does not install dependencies, modify audited source code, or execute inferred framework commands.
- Audit output is a deterministic evidence snapshot. Human review is still needed for business priority, brand nuance, and legal or regulated-content decisions.
```

- [ ] **Step 3: Verify README known limits**

Run:

```bash
rg -n "Known Limits|RankForge reports SEO/GEO readiness|does not install dependencies|deterministic evidence snapshot" README.md
git diff --check -- README.md
```

Expected: all required phrases are present and diff check exits 0.

- [ ] **Step 4: Commit the README update**

Run:

```bash
git add README.md
git commit -m "docs: add RankForge known limits"
```

---

### Task 4: Upgrade GitHub Actions Runtime Majors

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `.github/workflows/release.yml`

- [ ] **Step 1: Confirm current action versions**

Run:

```bash
rg -n "actions/checkout@|actions/setup-node@|node-version:" .github/workflows
```

Expected before implementation: both workflows use pinned v4 action SHAs with comments and `node-version: 20`.

- [ ] **Step 2: Update CI workflow actions**

In `.github/workflows/ci.yml`, replace:

```yaml
      - uses: actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5 # v4
      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4
```

with:

```yaml
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
```

Keep:

```yaml
          node-version: 20
```

- [ ] **Step 3: Update release workflow actions**

In `.github/workflows/release.yml`, replace:

```yaml
      - uses: actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5 # v4
      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4
```

with:

```yaml
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
```

Keep:

```yaml
          node-version: 20
```

- [ ] **Step 4: Verify workflow action versions**

Run:

```bash
rg -n "actions/checkout@v6|actions/setup-node@v6|node-version: 20" .github/workflows
rg -n "actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5|actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020|# v4" .github/workflows
git diff --check -- .github/workflows/ci.yml .github/workflows/release.yml
```

Expected:

- First command finds both workflows and the retained Node 20 test runtime.
- Second command exits with no matches.
- Diff check exits 0.

- [ ] **Step 5: Commit workflow updates**

Run:

```bash
git add .github/workflows/ci.yml .github/workflows/release.yml
git commit -m "ci: update GitHub Actions runtime majors"
```

---

### Task 5: Run Track 1 Verification And Push

**Files:**
- Verify all modified files from Tasks 1-4.

- [ ] **Step 1: Run documentation and workflow sanity checks**

Run:

```bash
rg -n "release candidate|before publishing|An RankForge" docs/prd-deterministic-audit-cli.md
rg -n "Known Limits|Post-Publish Registry Smoke|Published-State Known Limits|actions/checkout@v6|actions/setup-node@v6" README.md docs/prd-deterministic-audit-cli.md docs/release-checklist.md .github/workflows
git diff --check
```

Expected:

- First command exits with no matches.
- Second command finds all expected stabilization markers.
- Diff check exits 0.

- [ ] **Step 2: Run package and validation checks**

Run:

```bash
npm audit --omit=dev
npm test
npm run validate
npm pack --dry-run --workspace packages/cli
```

Expected:

- `npm audit --omit=dev` reports `found 0 vulnerabilities`.
- `npm test` reports all tests passing.
- `npm run validate` reports `"ok": true`.
- `npm pack --dry-run --workspace packages/cli` lists only intended CLI package files.

- [ ] **Step 3: Run published registry check**

Run:

```bash
npm view rankforge version dist-tags.latest homepage bugs.url repository.url
```

Expected:

- version is `0.3.0`
- latest dist-tag is `0.3.0`
- homepage and repository URL point to `https://github.com/PSkinnerTech/RankForge`

- [ ] **Step 4: Confirm final local state**

Run:

```bash
git status --short --branch
git log --oneline -6
```

Expected:

- working tree is clean
- branch is ahead of `origin/main` by the new Track 1 commits plus any existing unpushed planning commits

- [ ] **Step 5: Push and verify CI**

Run:

```bash
git push origin main
gh run list --repo PSkinnerTech/RankForge --branch main --limit 3
```

If the newest CI run is in progress, run:

```bash
gh run watch <run-id> --repo PSkinnerTech/RankForge --exit-status
```

Expected:

- push succeeds
- CI completes successfully with `npm ci`, `npm audit --omit=dev`, `npm test`, and `npm run validate`

- [ ] **Step 6: Report completion**

Report:

- commit hashes created for Track 1
- verification commands and pass/fail results
- GitHub Actions CI result
- any release checklist or npm publishing caveats that remain for Track 5
