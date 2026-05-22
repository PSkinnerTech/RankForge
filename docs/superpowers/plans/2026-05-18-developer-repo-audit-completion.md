# Developer Repo Audit Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `audit-repo` a developer-focused local and CI audit workflow with explicit build support, route lists, repo config, fail-on semantics, and deterministic source findings.

**Architecture:** Keep repo audit as a thin orchestration layer over the existing audit engine. Add bounded command execution to `repo-process.mjs`, keep build/preview/source findings in `repo-audit.mjs`, extend config parsing through `audit.config.json`, and expose new flags through the existing CLI parser. Do not auto-install dependencies or auto-run detected scripts.

**Tech Stack:** Node.js 20+, ESM modules, built-in `node:test`, built-in `child_process`, `fs`, `path`, existing CLI/audit/config modules, no new runtime dependencies.

---

## Scope Check

This plan implements the approved spec at `docs/superpowers/specs/2026-05-18-developer-repo-audit-completion-design.md`.

This is one subsystem: developer repo audits. It can be implemented as one plan because each task builds on the existing `audit-repo` path and produces working, testable CLI behavior.

Excluded from this plan:

- Automatic dependency installation.
- Automatic execution of detected build or preview commands.
- Deep framework source parsing.
- Search Console API, SERP API, AI-answer probes, Lighthouse execution.
- Automated remediation.

## File Structure

- Modify `packages/cli/src/repo-process.mjs`: add reusable bounded command execution for build commands while preserving preview behavior.
- Modify `packages/cli/test/repo-process.test.mjs`: add build command success/failure/timeout/restricted/capped-output tests.
- Create `examples/fixture-repos/vite-basic/`: Vite-style fixture with a deterministic local Node build script that writes `dist`.
- Modify `packages/cli/src/config-schema.mjs`: add optional `repo` config object validation and config-relative path resolution.
- Modify `packages/cli/test/config-schema.test.mjs`: cover `repo` validation and path resolution.
- Modify `packages/cli/src/repo-audit.mjs`: merge repo options, run explicit build commands, route-list resolution, static output checks, source findings, and repo output extensions.
- Modify `packages/cli/test/repo-audit.test.mjs`: cover build/static audit, route lists, source findings, restricted command rejection, and backward compatibility.
- Modify `packages/cli/src/cli.mjs`: expose new repo options, `--config`, `--build-command`, `--max-build-ms`, `--route-list`, and `--fail-on`.
- Modify `packages/cli/test/cli.test.mjs`: cover CLI parsing, validation, config-driven repo audit, fail-on, and report output behavior.
- Do not modify `packages/cli/src/audit-output-schema.mjs`; current schema allows additive `repo` metadata.
- Modify `packages/cli/src/report.mjs`: include build and route-list evidence in Markdown repo section.
- Modify `README.md`, `skill/rankforge/SKILL.md`, `CHANGELOG.md`, `docs/prd-deterministic-audit-cli.md`, and `scripts/validate-skill.mjs`.

## Task 1: Add Bounded Build Command Execution

**Files:**
- Modify: `packages/cli/src/repo-process.mjs`
- Modify: `packages/cli/test/repo-process.test.mjs`

- [ ] **Step 1: Write failing build command tests**

Append these tests to `packages/cli/test/repo-process.test.mjs`:

```js
test("runs build command and captures bounded output", async () => {
  const marker = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-build-")), "built");

  const result = await runCommand({
    command: `node -e "require('node:fs').writeFileSync('${marker}', 'built'); console.log('build ok')"`,
    cwd: ".",
    timeoutMs: 5000,
    label: "Build",
  });

  assert.equal(result.exitCode, 0);
  assert.equal(fs.readFileSync(marker, "utf8"), "built");
  assert.match(result.stdout.join(""), /build ok/);
  assert.equal(result.timedOut, false);
});

test("reports non-zero build command exits with stderr", async () => {
  await assert.rejects(
    () =>
      runCommand({
        command: "node -e \"console.error('build failed'); process.exit(7)\"",
        cwd: ".",
        timeoutMs: 5000,
        label: "Build",
      }),
    (error) => {
      assert.match(error.message, /Build command exited with code 7/);
      assert.match(error.commandResult.stderr.join(""), /build failed/);
      return true;
    },
  );
});

test("reports build command timeout and stops process", async () => {
  await assert.rejects(
    () =>
      runCommand({
        command: "node -e \"setTimeout(() => {}, 5000)\"",
        cwd: ".",
        timeoutMs: 100,
        label: "Build",
      }),
    (error) => {
      assert.match(error.message, /Build command timed out after 100 ms/);
      assert.equal(error.commandResult.timedOut, true);
      return true;
    },
  );
});

test("restricted mode blocks build command before spawning", async () => {
  const marker = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-build-restricted-")), "spawned");

  await assert.rejects(
    () =>
      runCommand({
        command: `node -e "require('node:fs').writeFileSync('${marker}', 'spawned')"`,
        cwd: ".",
        timeoutMs: 5000,
        label: "Build",
        security: { mode: "restricted" },
      }),
    /Restricted security mode disables local command execution for repo audits/,
  );
  assert.equal(fs.existsSync(marker), false);
});
```

Update the import at the top:

```js
import { runCommand, startPreview, stopPreview, waitForHttp } from "../src/repo-process.mjs";
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
node --test packages/cli/test/repo-process.test.mjs
```

Expected: fails with an import error for `runCommand`.

- [ ] **Step 3: Implement reusable `runCommand`**

In `packages/cli/src/repo-process.mjs`, add this helper after `earlyExitError`:

```js
const commandExecutionDisabledError = () =>
  new Error("Restricted security mode disables local command execution for repo audits.");

const commandError = (message, commandResult) => {
  const error = new Error(message);
  error.commandResult = commandResult;
  return error;
};

export const runCommand = async ({ command, cwd, timeoutMs = 120000, label = "Command", security }) => {
  if (!command) {
    throw new Error(`${label} command is required.`);
  }
  if (security?.mode === "restricted") {
    throw commandExecutionDisabledError();
  }

  const child = spawn(command, {
    cwd,
    shell: true,
    detached: process.platform !== "win32",
    stdio: ["ignore", "pipe", "pipe"],
  });

  const startedAt = Date.now();
  const commandResult = {
    command,
    stdout: [],
    stderr: [],
    exitCode: null,
    signal: null,
    durationMs: 0,
    timedOut: false,
  };

  child.stdout?.on("data", (chunk) => appendCappedChunk(commandResult.stdout, chunk));
  child.stderr?.on("data", (chunk) => appendCappedChunk(commandResult.stderr, chunk));

  let timeout;
  const timeoutPromise = new Promise((_, reject) => {
    timeout = setTimeout(async () => {
      commandResult.timedOut = true;
      try {
        await stopPreview({ child });
      } catch {
        // Keep the timeout error as the actionable failure.
      }
      commandResult.durationMs = Date.now() - startedAt;
      reject(commandError(`${label} command timed out after ${timeoutMs} ms.`, commandResult));
    }, timeoutMs);
  });

  const exitPromise = new Promise((resolve, reject) => {
    child.once("error", (error) => {
      commandResult.durationMs = Date.now() - startedAt;
      reject(commandError(`${label} command failed to start: ${error.message}`, commandResult));
    });
    child.once("close", (code, signal) => {
      commandResult.exitCode = code;
      commandResult.signal = signal;
      commandResult.durationMs = Date.now() - startedAt;
      if (code === 0) {
        resolve(commandResult);
        return;
      }
      reject(
        commandError(
          `${label} command exited with ${code === null ? `signal ${signal}` : `code ${code}`}.`,
          commandResult,
        ),
      );
    });
  });

  try {
    return await Promise.race([exitPromise, timeoutPromise]);
  } finally {
    clearTimeout(timeout);
  }
};
```

- [ ] **Step 4: Run process tests**

Run:

```bash
node --test packages/cli/test/repo-process.test.mjs
```

Expected: all repo process tests pass.

- [ ] **Step 5: Commit Task 1**

```bash
git add packages/cli/src/repo-process.mjs packages/cli/test/repo-process.test.mjs
git commit -m "feat: add repo build process runner"
```

## Task 2: Add Vite-Style Build Fixture

**Files:**
- Create: `examples/fixture-repos/vite-basic/package.json`
- Create: `examples/fixture-repos/vite-basic/build.mjs`
- Create: `examples/fixture-repos/vite-basic/src/index.html`
- Create: `examples/fixture-repos/vite-basic/src/about.html`
- Create: `examples/fixture-repos/vite-basic/routes.txt`
- Modify: `scripts/validate-skill.mjs`

- [ ] **Step 1: Create fixture files**

Create `examples/fixture-repos/vite-basic/package.json`:

```json
{
  "name": "rankforge-vite-basic-fixture",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node build.mjs",
    "preview": "node ../npm-preview/server.mjs"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

Create `examples/fixture-repos/vite-basic/build.mjs`:

```js
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "src");
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, "about"), { recursive: true });
fs.copyFileSync(path.join(src, "index.html"), path.join(dist, "index.html"));
fs.copyFileSync(path.join(src, "about.html"), path.join(dist, "about", "index.html"));
fs.writeFileSync(path.join(dist, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: https://example.test/sitemap.xml\n");
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.test/</loc></url><url><loc>https://example.test/about/</loc></url></urlset>\n',
);
console.log("vite fixture build complete");
```

Create `examples/fixture-repos/vite-basic/src/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Vite Fixture Home</title>
    <meta name="description" content="Developer fixture homepage for repo build audits.">
    <link rel="canonical" href="https://example.test/">
  </head>
  <body>
    <h1>Vite Fixture Home</h1>
    <p>This fixture simulates a developer build workflow for deterministic repo audits.</p>
    <a href="/about/">About</a>
  </body>
</html>
```

Create `examples/fixture-repos/vite-basic/src/about.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Vite Fixture About</title>
    <meta name="description" content="About page for developer repo audit build fixture.">
    <link rel="canonical" href="https://example.test/about/">
  </head>
  <body>
    <h1>Vite Fixture About</h1>
    <p>This page proves the build output can include nested static routes.</p>
  </body>
</html>
```

Create `examples/fixture-repos/vite-basic/routes.txt`:

```text
/
/about/
```

- [ ] **Step 2: Add fixture validation**

In `scripts/validate-skill.mjs`, add these required files to the existing required file list:

```js
"examples/fixture-repos/vite-basic/package.json",
"examples/fixture-repos/vite-basic/build.mjs",
"examples/fixture-repos/vite-basic/src/index.html",
"examples/fixture-repos/vite-basic/src/about.html",
"examples/fixture-repos/vite-basic/routes.txt",
```

- [ ] **Step 3: Verify fixture build**

Run:

```bash
cd examples/fixture-repos/vite-basic
npm run build
cd ../../..
test -f examples/fixture-repos/vite-basic/dist/index.html
test -f examples/fixture-repos/vite-basic/dist/about/index.html
```

Expected: `npm run build` prints `vite fixture build complete`; both `test -f` commands exit 0.

- [ ] **Step 4: Run validation**

Run:

```bash
npm run validate
```

Expected: validation reports `"ok": true`.

- [ ] **Step 5: Commit Task 2**

```bash
git add examples/fixture-repos/vite-basic scripts/validate-skill.mjs
git commit -m "test: add developer repo build fixture"
```

## Task 3: Add Repo Config Schema And Path Resolution

**Files:**
- Modify: `packages/cli/src/config-schema.mjs`
- Modify: `packages/cli/test/config-schema.test.mjs`

- [ ] **Step 1: Write failing config tests**

Append these tests to `packages/cli/test/config-schema.test.mjs`:

```js
test("accepts valid repo audit config", () => {
  const result = validateAuditConfig({
    target: "https://example.com",
    repo: {
      buildCommand: "npm run build",
      staticDir: "dist",
      routeList: "routes.txt",
      maxBuildMs: 120000,
      maxPreviewMs: 30000,
    },
  });

  assert.equal(result.ok, true);
});

test("rejects invalid repo audit config values", () => {
  const result = validateAuditConfig({
    target: "https://example.com",
    repo: {
      buildCommand: 42,
      routeList: 42,
      maxBuildMs: 0,
      maxPreviewMs: 1.5,
    },
  });

  assert.equal(result.ok, false);
  assert.ok(result.errors.includes("repo.buildCommand must be a string"));
  assert.ok(result.errors.includes("repo.routeList must be a string"));
  assert.ok(result.errors.includes("repo.maxBuildMs must be a positive integer"));
  assert.ok(result.errors.includes("repo.maxPreviewMs must be a positive integer"));
});

test("resolves repo config paths relative to config file", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-repo-config-"));
  fs.mkdirSync(path.join(dir, "dist"));
  fs.writeFileSync(path.join(dir, "routes.txt"), "/\n");

  const resolved = resolveAuditConfigPaths(
    {
      target: "https://example.com",
      repo: {
        staticDir: "dist",
        routeList: "routes.txt",
      },
    },
    dir,
  );

  assert.equal(resolved.repo.staticDir, path.join(dir, "dist"));
  assert.equal(resolved.repo.routeList, path.join(dir, "routes.txt"));
});
```

If `fs`, `os`, or `path` are not already imported in `config-schema.test.mjs`, add:

```js
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
```

- [ ] **Step 2: Run config tests to verify failure**

Run:

```bash
node --test packages/cli/test/config-schema.test.mjs
```

Expected: fails because `repo` validation and path resolution do not exist.

- [ ] **Step 3: Add `repo` schema and path resolution**

In `packages/cli/src/config-schema.mjs`, add `repo` to `auditConfigSchema.properties`:

```js
    repo: {
      type: "object",
      additionalProperties: true,
      properties: {
        buildCommand: { type: "string" },
        previewCommand: { type: "string" },
        previewUrl: { type: "string" },
        staticDir: { type: "string" },
        routeList: { type: "string" },
        maxBuildMs: { type: "integer", minimum: 1 },
        maxPreviewMs: { type: "integer", minimum: 1 },
      },
    },
```

Update `resolveAuditConfigPaths` to include repo paths:

```js
    repo: config.repo
      ? {
          ...config.repo,
          staticDir: resolveMaybePath(config.repo.staticDir, baseDir),
          routeList: resolveMaybePath(config.repo.routeList, baseDir),
        }
      : config.repo,
```

Add repo validation inside `validateAuditConfig`:

```js
  if (config.repo !== undefined) {
    if (!isObject(config.repo)) {
      errors.push("repo must be an object");
    } else {
      for (const key of ["buildCommand", "previewCommand", "previewUrl", "staticDir", "routeList"]) {
        if (config.repo[key] !== undefined && typeof config.repo[key] !== "string") {
          errors.push(`repo.${key} must be a string`);
        }
      }
      validatePositiveInteger(errors, "repo.maxBuildMs", config.repo.maxBuildMs);
      validatePositiveInteger(errors, "repo.maxPreviewMs", config.repo.maxPreviewMs);
    }
  }
```

In the `options.checkFiles` block, add:

```js
    validateExistingFile(errors, "repo.routeList", config.repo?.routeList, options.baseDir);
```

Do not require `repo.staticDir` to exist during config validation because it may be created by `repo.buildCommand`.

- [ ] **Step 4: Run config tests**

Run:

```bash
node --test packages/cli/test/config-schema.test.mjs
```

Expected: all config-schema tests pass.

- [ ] **Step 5: Commit Task 3**

```bash
git add packages/cli/src/config-schema.mjs packages/cli/test/config-schema.test.mjs
git commit -m "feat: add repo audit config schema"
```

## Task 4: Add Build Execution To Repo Audit Orchestration

**Files:**
- Modify: `packages/cli/src/repo-audit.mjs`
- Modify: `packages/cli/test/repo-audit.test.mjs`

- [ ] **Step 1: Write failing build audit tests**

Append these tests to `packages/cli/test/repo-audit.test.mjs`:

```js
test("repo audit runs explicit build command before static output audit", async () => {
  const repoPath = fixture("vite-basic");
  fs.rmSync(path.join(repoPath, "dist"), { recursive: true, force: true });

  const audit = await runRepoAudit({
    repoPath,
    buildCommand: "npm run build",
    staticDir: "dist",
    maxBuildMs: 5000,
  });

  assert.equal(audit.repo.detectedFramework, "vite");
  assert.equal(audit.repo.buildCommand, "npm run build");
  assert.equal(audit.repo.build.executed, true);
  assert.equal(audit.repo.build.exitCode, 0);
  assert.equal(audit.repo.staticDirRelative, "dist");
  assert.equal(audit.pages.length, 2);
  assert.ok(audit.pages.some((page) => page.evidence.title === "Vite Fixture Home"));
});

test("repo audit reports build failures as source findings", async () => {
  const audit = await runRepoAudit({
    repoPath: fixture("vite-basic"),
    buildCommand: "node -e \"console.error('compile failed'); process.exit(7)\"",
    staticDir: "dist",
    maxBuildMs: 5000,
  });

  assert.equal(audit.pages.length, 0);
  assert.equal(audit.repo.sourceFindings[0].id, "repo.build_failed");
  assert.match(audit.repo.sourceFindings[0].details.stderr, /compile failed/);
});

test("repo audit blocks command execution in restricted mode", async () => {
  const audit = await runRepoAudit({
    repoPath: fixture("vite-basic"),
    buildCommand: "npm run build",
    staticDir: "dist",
    security: { mode: "restricted" },
  });

  assert.equal(audit.pages.length, 0);
  assert.equal(audit.repo.sourceFindings[0].id, "repo.build_unavailable");
});
```

- [ ] **Step 2: Run repo audit tests to verify failure**

Run:

```bash
node --test packages/cli/test/repo-audit.test.mjs
```

Expected: fails because `runRepoAudit` ignores `buildCommand`.

- [ ] **Step 3: Import `runCommand` and add build error helpers**

In `packages/cli/src/repo-audit.mjs`, change the import:

```js
import { runCommand, startPreview, stopPreview } from "./repo-process.mjs";
```

Add helpers near `previewErrorDetails`:

```js
const commandText = (chunks) => chunks?.join("").trim() || undefined;

const buildErrorDetails = (error) => ({
  message: error?.message || "Build command failed.",
  stdout: commandText(error?.commandResult?.stdout),
  stderr: commandText(error?.commandResult?.stderr),
  exitCode: error?.commandResult?.exitCode ?? undefined,
  signal: error?.commandResult?.signal ?? undefined,
  timedOut: error?.commandResult?.timedOut || undefined,
  durationMs: error?.commandResult?.durationMs,
});

const buildFindingFor = (error, command) => {
  const timedOut = Boolean(error?.commandResult?.timedOut);
  const restricted = /Restricted security mode disables local command execution/.test(error?.message || "");
  return sourceFinding({
    id: restricted ? "repo.build_unavailable" : timedOut ? "repo.build_timeout" : "repo.build_failed",
    message: restricted
      ? "Build command execution is disabled in restricted security mode."
      : timedOut
        ? "Build command timed out before repository audit could collect page evidence."
        : "Build command failed before repository audit could collect page evidence.",
    evidence: command,
    recommendation: restricted
      ? "Use local security mode for trusted repository builds, or audit prebuilt static output."
      : "Run the build command locally, fix the failure, and rerun the repository audit.",
    details: buildErrorDetails(error),
  });
};
```

- [ ] **Step 4: Run build before audit source selection**

Inside `runRepoAudit`, after `const detected = detectRepo(repoPath);`, add:

```js
  let build = null;
  if (options.buildCommand) {
    try {
      const result = await runCommand({
        command: options.buildCommand,
        cwd: repoPath,
        timeoutMs: options.maxBuildMs ?? 120000,
        label: "Build",
        security: options.security,
      });
      build = {
        executed: true,
        durationMs: result.durationMs,
        exitCode: result.exitCode,
        stdout: commandText(result.stdout),
        stderr: commandText(result.stderr),
      };
    } catch (error) {
      return emptyAudit(detected, {
        buildCommand: options.buildCommand,
        build: {
          executed: true,
          durationMs: error?.commandResult?.durationMs,
          exitCode: error?.commandResult?.exitCode ?? null,
          stdout: commandText(error?.commandResult?.stdout),
          stderr: commandText(error?.commandResult?.stderr),
          timedOut: error?.commandResult?.timedOut || undefined,
        },
        sourceFindings: [buildFindingFor(error, options.buildCommand)],
      });
    }
  }
```

When assigning `audit.repo` for static and preview success paths, include:

```js
      buildCommand: options.buildCommand || detected.buildCommand,
      build,
```

When returning missing static/output source findings after a successful build, include `buildCommand` and `build` in repo overrides.

- [ ] **Step 5: Run repo audit tests**

Run:

```bash
node --test packages/cli/test/repo-audit.test.mjs
```

Expected: all repo audit tests pass.

- [ ] **Step 6: Commit Task 4**

```bash
git add packages/cli/src/repo-audit.mjs packages/cli/test/repo-audit.test.mjs
git commit -m "feat: run explicit repo build commands"
```

## Task 5: Add Route-List Support For Repo Audits

**Files:**
- Modify: `packages/cli/src/repo-audit.mjs`
- Modify: `packages/cli/test/repo-audit.test.mjs`

- [ ] **Step 1: Write failing route-list tests**

Append these tests to `packages/cli/test/repo-audit.test.mjs`:

```js
test("repo audit constrains static routes with route list", async () => {
  const audit = await runRepoAudit({
    repoPath: fixture("vite-basic"),
    buildCommand: "npm run build",
    staticDir: "dist",
    routeList: path.join(fixture("vite-basic"), "routes.txt"),
  });

  assert.deepEqual(
    audit.repo.routeSources.map((route) => route.route),
    ["/", "/about/"],
  );
  assert.equal(audit.pages.length, 2);
});

test("repo audit reports missing route-list files", async () => {
  const audit = await runRepoAudit({
    repoPath: fixture("vite-basic"),
    staticDir: "dist",
    routeList: path.join(fixture("vite-basic"), "missing-routes.txt"),
  });

  assert.equal(audit.pages.length, 0);
  assert.equal(audit.repo.sourceFindings[0].id, "repo.route_list_missing");
});

test("repo audit reports missing route-list entries", async () => {
  const repoPath = fixture("vite-basic");
  const routeList = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-routes-")), "routes.txt");
  fs.writeFileSync(routeList, "/missing/\n");

  const audit = await runRepoAudit({
    repoPath,
    buildCommand: "npm run build",
    staticDir: "dist",
    routeList,
  });

  assert.equal(audit.pages.length, 0);
  assert.equal(audit.repo.sourceFindings[0].id, "repo.route_list_entry_missing");
});
```

- [ ] **Step 2: Run repo audit tests to verify failure**

Run:

```bash
node --test packages/cli/test/repo-audit.test.mjs
```

Expected: fails because `runRepoAudit` ignores `routeList`.

- [ ] **Step 3: Add route-list helpers**

In `packages/cli/src/repo-audit.mjs`, add helpers before `emptyAudit`:

```js
const htmlPathForRoute = (staticDir, route) => {
  const cleanRoute = route.trim();
  if (!cleanRoute || cleanRoute.startsWith("#")) return null;
  if (path.isAbsolute(cleanRoute) && fs.existsSync(cleanRoute)) return cleanRoute;
  const normalized = cleanRoute.startsWith("/") ? cleanRoute.slice(1) : cleanRoute;
  if (!normalized || normalized.endsWith("/")) return path.join(staticDir, normalized, "index.html");
  if (normalized.endsWith(".html")) return path.join(staticDir, normalized);
  return path.join(staticDir, normalized, "index.html");
};

const routeForEntry = (entry) => {
  const clean = entry.trim();
  if (!clean || clean.startsWith("#")) return null;
  if (path.isAbsolute(clean)) return clean;
  return clean.startsWith("/") ? clean : `/${clean}`;
};

const readRouteListRoutes = (routeListPath, staticDir) => {
  if (!fs.existsSync(routeListPath) || !fs.statSync(routeListPath).isFile()) {
    return {
      routes: [],
      sourceFindings: [
        sourceFinding({
          id: "repo.route_list_missing",
          message: "Configured route list file does not exist.",
          evidence: routeListPath,
          recommendation: "Create the route list file or remove the route-list option.",
        }),
      ],
    };
  }

  const entries = fs.readFileSync(routeListPath, "utf8").split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith("#"));
  if (!entries.length) {
    return {
      routes: [],
      sourceFindings: [
        sourceFinding({
          id: "repo.route_list_empty",
          message: "Configured route list does not contain any routes.",
          evidence: routeListPath,
          recommendation: "Add at least one route to audit.",
        }),
      ],
    };
  }

  const routes = [];
  const sourceFindings = [];
  for (const entry of entries) {
    const filePath = htmlPathForRoute(staticDir, entry);
    const route = routeForEntry(entry);
    if (!filePath || !fs.existsSync(filePath)) {
      sourceFindings.push(
        sourceFinding({
          id: "repo.route_list_entry_missing",
          message: "Route list entry does not resolve to a generated HTML file.",
          evidence: entry,
          recommendation: "Build the route or remove it from the route list.",
        }),
      );
      continue;
    }
    if (!filePath.endsWith(".html")) {
      sourceFindings.push(
        sourceFinding({
          id: "repo.route_list_entry_not_html",
          message: "Route list entry does not resolve to an HTML file.",
          evidence: entry,
          recommendation: "Route-list entries must point to generated HTML pages.",
        }),
      );
      continue;
    }
    routes.push({ type: "route_list", route, path: filePath });
  }

  return { routes, sourceFindings };
};
```

- [ ] **Step 4: Use route list in static audit branch**

In the static audit branch, replace:

```js
    const routes = discoverStaticRoutes(staticDir);
```

with:

```js
    const routeList = options.routeList ? path.resolve(repoPath, options.routeList) : null;
    const routeListResult = routeList ? readRouteListRoutes(routeList, staticDir) : null;
    const routes = routeListResult ? routeListResult.routes : discoverStaticRoutes(staticDir);
    const routeSourceFindings = routeListResult?.sourceFindings || [];
```

Before the existing `if (!routes.length)` block, add:

```js
    if (routeSourceFindings.length) {
      return emptyAudit(detected, {
        ...staticRepoFields,
        buildCommand: options.buildCommand || detected.buildCommand,
        build,
        routeList,
        sourceFindings: routeSourceFindings,
      });
    }
```

In successful `audit.repo`, add:

```js
      routeList,
```

- [ ] **Step 5: Run repo audit tests**

Run:

```bash
node --test packages/cli/test/repo-audit.test.mjs
```

Expected: all repo audit tests pass.

- [ ] **Step 6: Commit Task 5**

```bash
git add packages/cli/src/repo-audit.mjs packages/cli/test/repo-audit.test.mjs
git commit -m "feat: add repo route-list audits"
```

## Task 6: Add CLI Options, Config Merge, And Repo Fail-On

**Files:**
- Modify: `packages/cli/src/cli.mjs`
- Modify: `packages/cli/test/cli.test.mjs`

- [ ] **Step 1: Write failing CLI tests**

Append these tests to `packages/cli/test/cli.test.mjs`:

```js
test("audit-repo runs build command from CLI", async () => {
  const result = await capture([
    "audit-repo",
    "examples/fixture-repos/vite-basic",
    "--build-command",
    "npm run build",
    "--static-dir",
    "dist",
  ]);

  assert.equal(result.exitCode, 0);
  const body = JSON.parse(result.stdout);
  assert.equal(body.repo.build.executed, true);
  assert.equal(body.pages.length, 2);
});

test("audit-repo reads repo options from config file", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-repo-config-cli-"));
  const config = path.join(dir, "audit.config.json");
  fs.writeFileSync(
    config,
    JSON.stringify({
      target: "https://example.com",
      crawl: { mode: "single", maxPages: 1 },
      repo: {
        buildCommand: "npm run build",
        staticDir: path.resolve("examples/fixture-repos/vite-basic/dist"),
        maxBuildMs: 5000,
      },
    }),
  );

  const result = await capture(["audit-repo", "examples/fixture-repos/vite-basic", "--config", config]);

  assert.equal(result.exitCode, 0);
  const body = JSON.parse(result.stdout);
  assert.equal(body.run.crawl.maxPages, 1);
  assert.equal(body.repo.buildCommand, "npm run build");
});

test("audit-repo fail-on returns CI failure for rendered findings", async () => {
  const result = await capture([
    "audit-repo",
    "examples/fixture-repos/static-basic",
    "--static-dir",
    "dist",
    "--fail-on",
    "P2",
  ]);

  assert.equal(result.exitCode, 2);
  const body = JSON.parse(result.stdout);
  assert.ok(body.findings.some((finding) => finding.severity === "P2" || finding.severity === "P1"));
});

test("audit-repo rejects missing build command value", async () => {
  const result = await capture(["audit-repo", "examples/fixture-repos/vite-basic", "--build-command"]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--build-command requires a value/);
});
```

- [ ] **Step 2: Run CLI tests to verify failure**

Run:

```bash
node --test packages/cli/test/cli.test.mjs
```

Expected: fails because new repo CLI options are not parsed.

- [ ] **Step 3: Update help and repo option set**

In `packages/cli/src/cli.mjs`, add to the repo audit help:

```text
  --config <file>                Read repo audit options from an audit.config.json file
  --build-command <command>      Run an explicit local build command before auditing static output
  --max-build-ms <n>             Maximum time to wait for build command completion
  --route-list <file>            Audit generated routes listed one per line
  --fail-on <severity>           Return exit code 2 when repo or page findings meet P0, P1, P2, or P3 threshold
```

Add options to `repoOptionsWithValues`:

```js
  "--config",
  "--build-command",
  "--max-build-ms",
  "--route-list",
  "--fail-on",
```

- [ ] **Step 4: Add repo config merge helper**

Replace `mergeRepoConfig` with:

```js
const mergeRepoConfig = (repoPath, options) => {
  const configPath = repoOptionValue(options, "--config");
  const baseDir = configPath ? path.dirname(path.resolve(configPath)) : process.cwd();
  const fileConfig = configPath ? resolveAuditConfigPaths(readAuditConfig(configPath), baseDir) : {};
  const repoConfig = fileConfig.repo || {};
  const securityMode = repoEnumOption(options, "--security", fileConfig.security?.mode || "local", ["local", "restricted"]);

  const merged = {
    ...fileConfig,
    repoPath,
    staticDir: repoOptionValue(options, "--static-dir", repoConfig.staticDir),
    routeList: repoOptionValue(options, "--route-list", repoConfig.routeList),
    buildCommand: repoOptionValue(options, "--build-command", repoConfig.buildCommand),
    previewCommand: repoOptionValue(options, "--preview-command", repoConfig.previewCommand),
    previewUrl: repoOptionValue(options, "--preview-url", repoConfig.previewUrl),
    maxBuildMs: repoNumberOption(options, "--max-build-ms", repoConfig.maxBuildMs ?? 120000, {
      minimum: 1,
      minimumDescription: "positive integer",
    }),
    maxPreviewMs: repoNumberOption(options, "--max-preview-ms", repoConfig.maxPreviewMs ?? 30000, {
      minimum: 1,
      minimumDescription: "positive integer",
    }),
    crawl: {
      ...(fileConfig.crawl || {}),
      mode: repoEnumOption(options, "--mode", fileConfig.crawl?.mode || "full", ["full", "sample", "single"]),
      maxPages: repoNumberOption(options, "--max-pages", fileConfig.crawl?.maxPages ?? 25, {
        minimum: 1,
        minimumDescription: "positive integer",
      }),
      maxDepth: repoNumberOption(options, "--max-depth", fileConfig.crawl?.maxDepth ?? 2, {
        minimum: 0,
        minimumDescription: "non-negative integer",
      }),
    },
    security: {
      ...(fileConfig.security || {}),
      mode: securityMode,
    },
  };

  if (configPath) {
    const validation = validateAuditConfig(fileConfig, { baseDir, checkFiles: true });
    if (!validation.ok) throw new Error(validation.errors.join("\n"));
  }

  return merged;
};
```

- [ ] **Step 5: Apply repo fail-on in `audit-repo` command**

Inside the `audit-repo` command block, after `const output = await runRepoAudit(...)`, add:

```js
      const failOn = repoOptionValue(options, "--fail-on");
      if (failOn && !(failOn in severityRank)) throw new Error("--fail-on must be one of: P0, P1, P2, P3");
      const failedThreshold =
        failsThreshold(output.findings, failOn) || failsThreshold(output.repo?.sourceFindings || [], failOn);
```

Change the result-writing block to:

```js
      if (outPath || markdownPath) {
        const result = { ok: true, out: outPath || null, markdown: markdownPath || null };
        if (failedThreshold) result.failedThreshold = failOn;
        writeJson(io, result);
      } else {
        writeJson(io, output);
      }
      return failedThreshold || output.repo?.sourceFindings?.length ? 2 : 0;
```

- [ ] **Step 6: Run CLI tests**

Run:

```bash
node --test packages/cli/test/cli.test.mjs
```

Expected: all CLI tests pass.

- [ ] **Step 7: Commit Task 6**

```bash
git add packages/cli/src/cli.mjs packages/cli/test/cli.test.mjs
git commit -m "feat: add developer repo audit CLI options"
```

## Task 7: Add Static Output Source Findings For Robots And Sitemap

**Files:**
- Modify: `packages/cli/src/repo-audit.mjs`
- Modify: `packages/cli/test/repo-audit.test.mjs`

- [ ] **Step 1: Write failing robots and sitemap finding test**

Append this test to `packages/cli/test/repo-audit.test.mjs`:

```js
test("static repo audit reports missing generated robots and sitemap files", async () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-static-source-findings-"));
  const staticDir = path.join(repoPath, "dist");
  fs.mkdirSync(staticDir, { recursive: true });
  fs.writeFileSync(
    path.join(staticDir, "index.html"),
    "<title>No Files</title><meta name='description' content='No files'><h1>No Files</h1><p>Enough generated content.</p>",
  );

  const audit = await runRepoAudit({ repoPath, staticDir });
  const ids = audit.repo.sourceFindings.map((finding) => finding.id);

  assert.ok(ids.includes("repo.robots_missing"));
  assert.ok(ids.includes("repo.sitemap_missing"));
  assert.equal(audit.pages.length, 1);
});
```

- [ ] **Step 2: Run repo audit tests to verify failure**

Run:

```bash
node --test packages/cli/test/repo-audit.test.mjs
```

Expected: fails because static audit success currently has no robots/sitemap source findings.

- [ ] **Step 3: Add generated output checks**

In `packages/cli/src/repo-audit.mjs`, add:

```js
const generatedOutputFindings = (staticDir) => {
  const findings = [];
  if (!fs.existsSync(path.join(staticDir, "robots.txt"))) {
    findings.push(
      sourceFinding({
        id: "repo.robots_missing",
        severity: "P3",
        message: "Static output does not include robots.txt.",
        evidence: path.join(staticDir, "robots.txt"),
        recommendation: "Generate robots.txt in static output when the deployed site should expose crawler directives.",
        confidence: "medium",
      }),
    );
  }
  if (!fs.existsSync(path.join(staticDir, "sitemap.xml"))) {
    findings.push(
      sourceFinding({
        id: "repo.sitemap_missing",
        severity: "P3",
        message: "Static output does not include sitemap.xml.",
        evidence: path.join(staticDir, "sitemap.xml"),
        recommendation: "Generate sitemap.xml in static output so important URLs can be discovered consistently.",
        confidence: "medium",
      }),
    );
  }
  return findings;
};
```

In the static success branch, before calling `runAudit`, add:

```js
    const outputSourceFindings = generatedOutputFindings(staticDir);
```

Set successful repo source findings to:

```js
      sourceFindings: outputSourceFindings,
```

- [ ] **Step 4: Run repo audit tests**

Run:

```bash
node --test packages/cli/test/repo-audit.test.mjs
```

Expected: all repo audit tests pass.

- [ ] **Step 5: Commit Task 7**

```bash
git add packages/cli/src/repo-audit.mjs packages/cli/test/repo-audit.test.mjs
git commit -m "feat: add static output source findings"
```

## Task 8: Update Reports, Docs, Changelog, And Validation

**Files:**
- Modify: `packages/cli/src/report.mjs`
- Modify: `packages/cli/test/report.test.mjs`
- Modify: `README.md`
- Modify: `skill/rankforge/SKILL.md`
- Modify: `CHANGELOG.md`
- Modify: `docs/prd-deterministic-audit-cli.md`
- Modify: `scripts/validate-skill.mjs`

- [ ] **Step 1: Write failing report test**

In `packages/cli/test/report.test.mjs`, add a repo audit object with build evidence:

```js
test("includes repository build evidence when present", () => {
  const markdown = generateMarkdownReport({
    schemaVersion: "1.0.0",
    toolVersion: "0.2.0",
    run: { id: "run", startedAt: "now", endedAt: "now", target: "repo", mode: "repo" },
    site: { notes: [] },
    pages: [],
    integrations: {},
    scores: {},
    findings: [],
    evidenceGaps: [],
    sources: [],
    repo: {
      path: "/repo",
      detectedFramework: "vite",
      buildCommand: "npm run build",
      build: { executed: true, exitCode: 0, durationMs: 1234 },
      staticDirRelative: "dist",
      routeList: "/repo/routes.txt",
      routeSources: [],
      sourceFindings: [],
      notes: [],
    },
  });

  assert.match(markdown, /Build command: npm run build/);
  assert.match(markdown, /Build exit code: 0/);
  assert.match(markdown, /Route list: \/repo\/routes.txt/);
});
```

- [ ] **Step 2: Run report tests to verify failure**

Run:

```bash
node --test packages/cli/test/report.test.mjs
```

Expected: fails because report output does not include build or route-list evidence.

- [ ] **Step 3: Update Markdown repo section**

In `packages/cli/src/report.mjs`, extend the existing repo section with:

```js
    if (audit.repo.buildCommand) lines.push(`- Build command: ${audit.repo.buildCommand}`);
    if (audit.repo.build) {
      lines.push(`- Build executed: ${audit.repo.build.executed ? "yes" : "no"}`);
      if (audit.repo.build.exitCode !== undefined && audit.repo.build.exitCode !== null) {
        lines.push(`- Build exit code: ${audit.repo.build.exitCode}`);
      }
      if (audit.repo.build.durationMs !== undefined) lines.push(`- Build duration: ${audit.repo.build.durationMs} ms`);
    }
    if (audit.repo.routeList) lines.push(`- Route list: ${audit.repo.routeList}`);
```

- [ ] **Step 4: Update docs**

Add these examples to `README.md` under CLI examples:

```bash
npm run cli -- audit-repo . --build-command "npm run build" --static-dir dist --fail-on P1 --out audit.json --markdown audit.md
npm run cli -- audit-repo . --config audit.config.json
npm run cli -- audit-repo . --static-dir dist --route-list routes.txt
```

Add this guidance to `skill/rankforge/SKILL.md` in the repo workflow section:

```markdown
   - For developer repo audits, prefer explicit build commands: `rankforge audit-repo <path> --build-command "<command>" --static-dir <dir> --out audit-results.json --markdown audit-report.md`.
   - Use `--fail-on P0|P1|P2|P3` only when the user wants CI-style failure semantics.
   - Do not suggest automatic dependency installation or inferred command execution.
```

Add an `Unreleased` bullet to `CHANGELOG.md`:

```markdown
- Added developer-focused repo audit planning for explicit build commands, route lists, config-driven CI audits, and repo source findings.
```

Update `docs/prd-deterministic-audit-cli.md` only after implementation is complete:

```markdown
- Developer repo audit mode now supports explicit build commands, route lists, repo config, and CI threshold failures.
```

- [ ] **Step 5: Update validation requirements**

In `scripts/validate-skill.mjs`, require the new plan and fixture files:

```js
"docs/superpowers/plans/2026-05-18-developer-repo-audit-completion.md",
"docs/superpowers/specs/2026-05-18-developer-repo-audit-completion-design.md",
```

Keep fixture requirements added in Task 2.

- [ ] **Step 6: Run report and validation tests**

Run:

```bash
node --test packages/cli/test/report.test.mjs
npm run validate
```

Expected: report tests pass and validation reports `"ok": true`.

- [ ] **Step 7: Commit Task 8**

```bash
git add packages/cli/src/report.mjs packages/cli/test/report.test.mjs README.md skill/rankforge/SKILL.md CHANGELOG.md docs/prd-deterministic-audit-cli.md scripts/validate-skill.mjs
git commit -m "docs: document developer repo audit workflow"
```

## Task 9: Final Verification And Package Smoke

**Files:**
- No planned source modifications unless verification exposes a concrete defect.

- [ ] **Step 1: Run focused repo tests**

Run:

```bash
node --test packages/cli/test/repo-process.test.mjs packages/cli/test/repo-audit.test.mjs packages/cli/test/cli.test.mjs packages/cli/test/config-schema.test.mjs packages/cli/test/report.test.mjs
```

Expected: all focused tests pass.

- [ ] **Step 2: Run full test suite**

Run:

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 3: Run validation and security/package checks**

Run:

```bash
npm audit --omit=dev
npm run validate
npm pack --dry-run --workspace packages/cli
```

Expected:

- `npm audit --omit=dev` reports `found 0 vulnerabilities`.
- Validation reports `"ok": true`.
- Package dry run includes CLI source files and does not include fixtures, golden outputs, docs, or raw source corpus.

- [ ] **Step 4: Run packed CLI smoke**

Run:

```bash
tmpdir=$(mktemp -d)
npm pack --json --workspace packages/cli --pack-destination "$tmpdir" > "$tmpdir/pack.json"
tar -xf "$tmpdir"/*.tgz -C "$tmpdir"
node "$tmpdir/package/src/index.mjs" audit examples/fixture-site/index.html > "$tmpdir/audit.json"
node -e "const fs=require('fs'); const a=JSON.parse(fs.readFileSync(process.argv[1],'utf8')); if (!a.sources?.length) process.exit(1); console.log('sources', a.sources.length);" "$tmpdir/audit.json"
```

Expected: prints `sources 26`.

- [ ] **Step 5: Run developer repo audit smoke**

Run:

```bash
rm -f /tmp/rankforge-dev-repo-audit.json /tmp/rankforge-dev-repo-audit.md
npm run cli -- audit-repo examples/fixture-repos/vite-basic --build-command "npm run build" --static-dir dist --out /tmp/rankforge-dev-repo-audit.json --markdown /tmp/rankforge-dev-repo-audit.md
node -e "const fs=require('fs'); const a=JSON.parse(fs.readFileSync('/tmp/rankforge-dev-repo-audit.json','utf8')); if (!a.repo?.build?.executed || a.pages.length !== 2) process.exit(1); console.log(a.repo.detectedFramework, a.pages.length);"
```

Expected: prints `vite 2`.

- [ ] **Step 6: Check git status**

Run:

```bash
git status --short --branch
```

Expected: clean working tree on the implementation branch.

- [ ] **Step 7: Handle verification regressions with TDD**

If verification exposes a concrete bug, write a failing regression test first, fix it, rerun verification, and commit:

```bash
git add <changed-files>
git commit -m "fix: stabilize developer repo audit workflow"
```

## Plan Self-Review

Spec coverage:

- Explicit build support: Task 1, Task 4, Task 6.
- Route-list support: Task 5, Task 6.
- Repo config support: Task 3, Task 6.
- CI fail-on semantics: Task 6, Task 9.
- Vite-style fixture: Task 2.
- Source findings: Task 4, Task 5, Task 7.
- Restricted command rejection: Task 1, Task 4.
- Docs and changelog: Task 8.
- Final verification: Task 9.

Deferred-work scan:

- No deferred-work markers remain in the plan.

Type consistency:

- `buildCommand`, `maxBuildMs`, `routeList`, `build`, and `sourceFindings` names match the approved design.
- `runCommand` is introduced in Task 1 before being consumed by `runRepoAudit` in Task 4.
- `repo` config is introduced in Task 3 before CLI config merge in Task 6.
