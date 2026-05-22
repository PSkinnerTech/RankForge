# RankForge Rename Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the product, CLI, skill wrapper, package metadata, docs, examples, and GitHub repository to RankForge.

**Architecture:** Keep the existing CLI and skill architecture intact while changing identity strings, package names, binary names, schema namespaces, user agents, and repository metadata. Preserve deterministic audit behavior and report structure.

**Tech Stack:** Node.js ESM CLI, npm workspaces, GitHub CLI, shell search checks, Node test runner.

---

### Task 1: Lock Rename Expectations In Tests

**Files:**
- Modify: `packages/cli/test/cli.test.mjs`
- Modify: `packages/cli/test/robots.test.mjs`
- Modify: `scripts/validate-skill.mjs`

- [ ] **Step 1: Update assertions to expect RankForge**

Change CLI version expectations to `rankforge 0.3.0`, robot user-agent tests to `RankForgeBot`, and skill validation to require `skill/rankforge/SKILL.md` with frontmatter `name: rankforge`.

- [ ] **Step 2: Run targeted tests to verify they fail**

Run:

```bash
node --test packages/cli/test/cli.test.mjs packages/cli/test/robots.test.mjs
npm run validate
```

Expected: version and validation checks fail until implementation files are renamed.

### Task 2: Rename Product, Package, CLI, Skill, and Schemas

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `packages/cli/package.json`
- Modify: `packages/cli/src/cli.mjs`
- Modify: `packages/cli/src/audit.mjs`
- Modify: `packages/cli/src/audit-output-schema.mjs`
- Modify: `packages/cli/src/config-schema.mjs`
- Modify: `packages/cli/src/crawl.mjs`
- Modify: `packages/cli/src/render.mjs`
- Modify: `packages/cli/src/robots.mjs`
- Modify: `packages/cli/src/snapshot.mjs`
- Move: `skill/rankforge/` to `skill/rankforge/`

- [ ] **Step 1: Rename package and binary**

Set workspace package name to `rankforge-workspace`, CLI package name to `rankforge`, and CLI bin key to `rankforge`.

- [ ] **Step 2: Rename skill wrapper**

Move the skill folder to `skill/rankforge`, change frontmatter to `name: rankforge`, and update validation paths.

- [ ] **Step 3: Rename schemas and user agents**

Use `https://rankforge.dev/schemas/...`, `RankForgeBot`, and `RankForge GEO SEO audit ...` user agents.

### Task 3: Remove Legacy Brand References From Docs and Fixtures

**Files:**
- Modify: all tracked markdown, YAML, JSON, HTML, JS, and lock files containing the legacy brand string.

- [ ] **Step 1: Replace active and historical references**

Change remaining legacy product, package, repository, skill, fixture, and temp-prefix names to RankForge/rankforge equivalents.

- [ ] **Step 2: Verify no tracked text references remain**

Run:

```bash
rg -n -i "legacy-brand-token"
```

Expected: no matches after substituting the actual legacy token during execution.

### Task 4: Verify, Commit, Rename GitHub Repo, and Push

**Files:**
- All modified files.

- [ ] **Step 1: Run verification**

Run:

```bash
npm install --package-lock-only
npm test
npm run validate
npm pack --workspace packages/cli --pack-destination /tmp --json
git diff --check
```

Expected: all pass, packed CLI is named `rankforge`.

- [ ] **Step 2: Commit and rename remote repository**

Commit as `Rename project to RankForge`, run the GitHub repository rename, update `origin` to the new URL, and push `main`.

- [ ] **Step 3: Confirm clean final state**

Run:

```bash
git status --short --branch
gh repo view --json nameWithOwner,url
```

Expected: `main` aligned with `origin/main`, GitHub repo named `PSkinnerTech/RankForge`.
