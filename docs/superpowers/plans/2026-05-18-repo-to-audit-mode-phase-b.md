# Repo-To-Audit Mode Phase B Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `detect-repo` and `audit-repo` CLI commands so the deterministic GEO/SEO auditor can inspect source repositories, audit static output or explicit preview servers, and emit repo evidence alongside existing page/site evidence.

**Architecture:** Keep repo-to-audit as a thin orchestration layer over the existing deterministic audit engine. Split repository detection, static route discovery, preview process management, and repo audit composition into focused modules. The first release avoids automatic dependency installation and automatic framework command execution; it supports static directories and explicit preview commands, while reporting framework/package-manager signals for later automation.

**Tech Stack:** Node.js 20+, ESM modules, built-in `node:test`, built-in `child_process`, built-in `fs/path/os`, existing CLI/audit modules, no new runtime dependencies.

---

## Scope

This plan implements Phase B from `docs/superpowers/specs/2026-05-18-release-stabilization-and-repo-audit-design.md`.

Included:

- `detect-repo <path>` command.
- `audit-repo <path>` command.
- Static-output repo audits through discovered HTML files.
- Explicit preview-server repo audits through `--preview-command` and `--preview-url`.
- Repo evidence section on audit output.
- Initial repo source findings for missing static/preview audit path and preview startup failures.
- Fixture repositories for static output and preview-server workflows.
- Tests for detection, route discovery, preview cleanup, CLI behavior, and backward compatibility.
- README and skill wrapper documentation updates.

Excluded:

- Automatic dependency installation.
- Automatic execution of detected framework build/preview commands.
- Search Console API, SERP API, or AI-answer probing.
- Full source-code parsing for metadata components.
- Authenticated page flows.
- Enterprise monorepo crawling.

## Product Decisions For This Phase

- First fixture path: generic static output plus generic npm preview fixture using only Node built-ins.
- Framework detection: detect and report Vite, Next.js, Astro, SvelteKit, Remix, and generic static signals, but do not auto-run their scripts.
- Command execution default: require explicit `--preview-command` when using preview-server audit path.
- Module boundaries:
  - `repo-detect.mjs`: repository/package/framework/static-output detection.
  - `repo-routes.mjs`: static HTML route discovery.
  - `repo-process.mjs`: bounded command execution, preview startup wait, cleanup.
  - `repo-audit.mjs`: combine detection, static/preview audit path, and existing `runAudit`.

## File Structure

- Create `packages/cli/src/repo-detect.mjs`: inspect repository path and return deterministic repo metadata.
- Create `packages/cli/src/repo-routes.mjs`: discover HTML files in a static output directory and map them to audit targets.
- Create `packages/cli/src/repo-process.mjs`: start preview commands, wait for `previewUrl`, terminate process groups.
- Create `packages/cli/src/repo-audit.mjs`: compose repo detection, source findings, and `runRepoAudit`.
- Modify `packages/cli/src/audit.mjs`: allow internal `urlListEntries` arrays.
- Modify `packages/cli/src/cli.mjs`: parse and route `detect-repo` and `audit-repo`.
- Modify `packages/cli/src/audit-output-schema.mjs`: document optional `repo` property.
- Modify `packages/cli/src/report.mjs`: add repository evidence to Markdown reports when present.
- Modify `scripts/validate-skill.mjs`: require new source and fixture files.
- Modify `README.md`: document repo commands.
- Modify `skill/geo-seo-audit/SKILL.md`: explain when to use repo-to-audit.
- Create `packages/cli/test/repo-detect.test.mjs`.
- Create `packages/cli/test/repo-routes.test.mjs`.
- Create `packages/cli/test/repo-process.test.mjs`.
- Create `packages/cli/test/repo-audit.test.mjs`.
- Modify `packages/cli/test/cli.test.mjs`.
- Modify `packages/cli/test/audit-output-schema.test.mjs`.
- Modify `packages/cli/test/report.test.mjs`.
- Create `examples/fixture-repos/static-basic/dist/index.html`.
- Create `examples/fixture-repos/static-basic/dist/about/index.html`.
- Create `examples/fixture-repos/static-basic/dist/robots.txt`.
- Create `examples/fixture-repos/static-basic/dist/sitemap.xml`.
- Create `examples/fixture-repos/npm-preview/package.json`.
- Create `examples/fixture-repos/npm-preview/server.mjs`.
- Create `examples/fixture-repos/npm-preview/site/index.html`.
- Create `examples/fixture-repos/npm-preview/site/about.html`.
- Create `examples/golden/repo-static-summary.json`.

## Data Shapes

### Repo Detection Result

```js
{
  path: "/absolute/repo",
  packageManager: "npm",
  detectedFramework: "vite",
  confidence: "high",
  buildCommand: "npm run build",
  previewCommand: "npm run preview",
  staticDir: "/absolute/repo/dist",
  staticDirRelative: "dist",
  routeSources: [
    { type: "static_html", path: "/absolute/repo/dist/index.html", route: "/" }
  ],
  notes: []
}
```

### Repo Output Section

```js
{
  path: "/absolute/repo",
  detectedFramework: "generic-static",
  packageManager: "npm",
  buildCommand: null,
  previewCommand: "node server.mjs 4173",
  previewUrl: "http://127.0.0.1:4173",
  staticDir: "/absolute/repo/dist",
  staticDirRelative: "dist",
  routeSources: [],
  sourceFindings: [],
  notes: ["Audited explicit preview server."]
}
```

### Repo Source Finding

```js
{
  id: "repo.audit_path_missing",
  severity: "P1",
  message: "Repo audit requires either a static output directory or an explicit preview command and preview URL.",
  evidence: ["$.repo.staticDir", "$.repo.previewCommand", "$.repo.previewUrl"],
  recommendation: "Pass --static-dir for prebuilt HTML output or pass --preview-command with --preview-url.",
  confidence: "high"
}
```

## Task 1: Repo Detection

**Files:**
- Create: `packages/cli/src/repo-detect.mjs`
- Create: `packages/cli/test/repo-detect.test.mjs`
- Create fixture files under `examples/fixture-repos/static-basic/` and `examples/fixture-repos/npm-preview/`

- [ ] **Step 1: Create fixture repositories**

Create `examples/fixture-repos/static-basic/dist/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Static Basic Home</title>
    <meta name="description" content="Static fixture homepage for repo audits.">
    <link rel="canonical" href="https://example.test/">
  </head>
  <body>
    <h1>Static Basic Home</h1>
    <p>This static fixture explains a deterministic source repository audit workflow.</p>
    <a href="/about/">About</a>
  </body>
</html>
```

Create `examples/fixture-repos/static-basic/dist/about/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <title>About Static Basic</title>
    <meta name="description" content="About page for static repo audit fixture.">
    <link rel="canonical" href="https://example.test/about/">
  </head>
  <body>
    <h1>About Static Basic</h1>
    <p>The about page gives the fixture enough internal structure for route discovery.</p>
  </body>
</html>
```

Create `examples/fixture-repos/static-basic/dist/robots.txt`:

```text
User-agent: *
Allow: /
Sitemap: https://example.test/sitemap.xml
```

Create `examples/fixture-repos/static-basic/dist/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.test/</loc></url>
  <url><loc>https://example.test/about/</loc></url>
</urlset>
```

Create `examples/fixture-repos/npm-preview/package.json`:

```json
{
  "name": "openclaw-preview-fixture",
  "private": true,
  "type": "module",
  "scripts": {
    "preview": "node server.mjs"
  }
}
```

Create `examples/fixture-repos/npm-preview/server.mjs`:

```js
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const port = Number(process.argv[2] || process.env.PORT || 4173);
const root = path.join(process.cwd(), "site");

const fileFor = (urlPath) => {
  if (urlPath === "/") return path.join(root, "index.html");
  return path.join(root, urlPath.replace(/^\//, ""));
};

const server = http.createServer((request, response) => {
  const filePath = fileFor(new URL(request.url, `http://127.0.0.1:${port}`).pathname);
  if (!filePath.startsWith(root) || !fs.existsSync(filePath)) {
    response.writeHead(404, { "content-type": "text/plain" });
    response.end("not found");
    return;
  }
  response.writeHead(200, { "content-type": "text/html" });
  response.end(fs.readFileSync(filePath, "utf8"));
});

server.listen(port, "127.0.0.1");
```

Create `examples/fixture-repos/npm-preview/site/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Preview Fixture Home</title>
    <meta name="description" content="Preview fixture homepage for repo audits.">
  </head>
  <body>
    <h1>Preview Fixture Home</h1>
    <p>This page is served by an explicit preview command during repo audit tests.</p>
    <a href="/about.html">About</a>
  </body>
</html>
```

Create `examples/fixture-repos/npm-preview/site/about.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Preview Fixture About</title>
    <meta name="description" content="Preview fixture about page for repo audits.">
  </head>
  <body>
    <h1>Preview Fixture About</h1>
    <p>This about page proves preview crawls can discover linked routes.</p>
  </body>
</html>
```

- [ ] **Step 2: Write failing repo detection tests**

Create `packages/cli/test/repo-detect.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { detectRepo } from "../src/repo-detect.mjs";

const fixture = (name) => path.resolve("examples/fixture-repos", name);

test("detects static output repositories", () => {
  const result = detectRepo(fixture("static-basic"));

  assert.equal(result.detectedFramework, "generic-static");
  assert.equal(result.confidence, "medium");
  assert.equal(result.staticDirRelative, "dist");
  assert.ok(result.staticDir.endsWith(path.join("static-basic", "dist")));
  assert.equal(result.packageManager, null);
  assert.equal(result.buildCommand, null);
  assert.equal(result.previewCommand, null);
  assert.ok(result.routeSources.some((route) => route.route === "/"));
});

test("detects npm preview repositories", () => {
  const result = detectRepo(fixture("npm-preview"));

  assert.equal(result.packageManager, "npm");
  assert.equal(result.detectedFramework, "generic-node");
  assert.equal(result.confidence, "medium");
  assert.equal(result.previewCommand, "npm run preview");
  assert.equal(result.buildCommand, null);
  assert.equal(result.staticDir, null);
});

test("detects declared framework signals without executing scripts", () => {
  const result = detectRepo(path.resolve("examples/fixture-repos/npm-preview"), {
    packageJson: {
      scripts: { build: "vite build", preview: "vite preview" },
      dependencies: { vite: "^5.0.0" },
    },
  });

  assert.equal(result.detectedFramework, "vite");
  assert.equal(result.confidence, "high");
  assert.equal(result.buildCommand, "npm run build");
  assert.equal(result.previewCommand, "npm run preview");
});
```

- [ ] **Step 3: Run tests to verify failure**

Run:

```bash
node --test packages/cli/test/repo-detect.test.mjs
```

Expected: fails because `packages/cli/src/repo-detect.mjs` does not exist.

- [ ] **Step 4: Implement `repo-detect.mjs`**

Create `packages/cli/src/repo-detect.mjs`:

```js
import fs from "node:fs";
import path from "node:path";

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

const exists = (filePath) => fs.existsSync(filePath);

const packageManagerFor = (repoPath) => {
  if (exists(path.join(repoPath, "pnpm-lock.yaml"))) return "pnpm";
  if (exists(path.join(repoPath, "yarn.lock"))) return "yarn";
  if (exists(path.join(repoPath, "package-lock.json"))) return "npm";
  if (exists(path.join(repoPath, "package.json"))) return "npm";
  return null;
};

const scriptCommand = (packageManager, script) => (packageManager && script ? `${packageManager} run ${script}` : null);

const hasDependency = (packageJson, name) =>
  Boolean(packageJson?.dependencies?.[name] || packageJson?.devDependencies?.[name]);

const frameworkFor = (repoPath, packageJson) => {
  if (hasDependency(packageJson, "next") || exists(path.join(repoPath, "next.config.js"))) return ["next", "high"];
  if (hasDependency(packageJson, "astro") || exists(path.join(repoPath, "astro.config.mjs"))) return ["astro", "high"];
  if (hasDependency(packageJson, "@sveltejs/kit") || exists(path.join(repoPath, "svelte.config.js"))) {
    return ["sveltekit", "high"];
  }
  if (hasDependency(packageJson, "@remix-run/node") || exists(path.join(repoPath, "remix.config.js"))) return ["remix", "high"];
  if (hasDependency(packageJson, "vite") || exists(path.join(repoPath, "vite.config.js"))) return ["vite", "high"];
  if (packageJson) return ["generic-node", "medium"];
  return ["generic-static", "medium"];
};

const staticDirCandidates = ["dist", "build", "out", "public"];

const findStaticDir = (repoPath) => {
  for (const candidate of staticDirCandidates) {
    const absolute = path.join(repoPath, candidate);
    if (exists(path.join(absolute, "index.html"))) {
      return { absolute, relative: candidate };
    }
  }
  return { absolute: null, relative: null };
};

const collectStaticRoutes = (staticDir) => {
  if (!staticDir) return [];
  const routes = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(absolute);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
      const relative = path.relative(staticDir, absolute);
      const route =
        relative === "index.html"
          ? "/"
          : `/${relative.replace(/\\/g, "/").replace(/\/index\.html$/, "/").replace(/\.html$/, ".html")}`;
      routes.push({ type: "static_html", path: absolute, route });
    }
  };
  visit(staticDir);
  return routes.sort((a, b) => a.path.localeCompare(b.path));
};

export const detectRepo = (repoPath, options = {}) => {
  const absolutePath = path.resolve(repoPath || ".");
  const packageJsonPath = path.join(absolutePath, "package.json");
  const packageJson = options.packageJson || (exists(packageJsonPath) ? readJson(packageJsonPath) : null);
  const packageManager = packageManagerFor(absolutePath);
  const [detectedFramework, confidence] = frameworkFor(absolutePath, packageJson);
  const staticDir = findStaticDir(absolutePath);

  return {
    path: absolutePath,
    packageManager,
    detectedFramework,
    confidence,
    buildCommand: scriptCommand(packageManager, packageJson?.scripts?.build ? "build" : null),
    previewCommand: scriptCommand(packageManager, packageJson?.scripts?.preview ? "preview" : null),
    staticDir: staticDir.absolute,
    staticDirRelative: staticDir.relative,
    routeSources: collectStaticRoutes(staticDir.absolute),
    notes: [],
  };
};
```

- [ ] **Step 5: Run detection tests**

Run:

```bash
node --test packages/cli/test/repo-detect.test.mjs
```

Expected: all tests pass.

- [ ] **Step 6: Commit Task 1**

Run:

```bash
git add packages/cli/src/repo-detect.mjs packages/cli/test/repo-detect.test.mjs examples/fixture-repos
git commit -m "feat: add repo detection"
```

## Task 2: Static Route Discovery And Internal URL Lists

**Files:**
- Create: `packages/cli/src/repo-routes.mjs`
- Create: `packages/cli/test/repo-routes.test.mjs`
- Modify: `packages/cli/src/audit.mjs`
- Modify: `packages/cli/test/audit.test.mjs`

- [ ] **Step 1: Write failing route discovery tests**

Create `packages/cli/test/repo-routes.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { discoverStaticRoutes } from "../src/repo-routes.mjs";

test("discovers static HTML files in deterministic order", () => {
  const routes = discoverStaticRoutes(path.resolve("examples/fixture-repos/static-basic/dist"));

  assert.deepEqual(
    routes.map((route) => route.route),
    ["/", "/about/"],
  );
  assert.ok(routes.every((route) => route.path.endsWith(".html")));
});

test("rejects missing static directories", () => {
  assert.throws(
    () => discoverStaticRoutes(path.resolve("examples/fixture-repos/static-basic/missing")),
    /Static directory does not exist/,
  );
});
```

- [ ] **Step 2: Add failing audit internal URL-list test**

Append to `packages/cli/test/audit.test.mjs`:

```js
test("audits internal URL list entries without a URL-list file", async () => {
  const index = path.resolve("examples/fixture-repos/static-basic/dist/index.html");
  const about = path.resolve("examples/fixture-repos/static-basic/dist/about/index.html");
  const audit = await runAudit({
    target: index,
    urlListEntries: [index, about],
  });

  assert.equal(audit.pages.length, 2);
  assert.ok(audit.pages.some((page) => page.finalUrl.endsWith("index.html")));
  assert.ok(audit.pages.some((page) => page.finalUrl.endsWith(path.join("about", "index.html"))));
});
```

- [ ] **Step 3: Run tests to verify failure**

Run:

```bash
node --test packages/cli/test/repo-routes.test.mjs packages/cli/test/audit.test.mjs
```

Expected: fails because `repo-routes.mjs` and `urlListEntries` support do not exist.

- [ ] **Step 4: Implement `repo-routes.mjs`**

Create `packages/cli/src/repo-routes.mjs`:

```js
import fs from "node:fs";
import path from "node:path";

const routeFor = (staticDir, filePath) => {
  const relative = path.relative(staticDir, filePath).replace(/\\/g, "/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.replace(/\/index\.html$/, "/")}`;
  return `/${relative.replace(/\.html$/, ".html")}`;
};

export const discoverStaticRoutes = (staticDir) => {
  const root = path.resolve(staticDir);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    throw new Error(`Static directory does not exist: ${root}`);
  }

  const routes = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const filePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(filePath);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
      routes.push({
        type: "static_html",
        route: routeFor(root, filePath),
        path: filePath,
      });
    }
  };

  visit(root);
  return routes.sort((a, b) => a.route.localeCompare(b.route));
};
```

- [ ] **Step 5: Add `urlListEntries` support to `audit.mjs`**

In `packages/cli/src/audit.mjs`, update `readUrlList`:

```js
const readUrlList = (config) => {
  if (Array.isArray(config.urlListEntries)) {
    return config.urlListEntries.map((entry) => String(entry));
  }
  if (!config.urlList) return [];
  const baseDir = path.dirname(config.urlList);
  const limits = resolveLimits(config.limits);
  return readTextFileLimited(config.urlList, {
    security: config.security,
    allowRestricted: true,
    limits,
    maxBytes: limits.maxFileBytes,
  })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      if (isHttpUrl(line)) return line;
      if (isHttpUrl(config.target)) return new URL(line, config.target).href;
      return path.resolve(baseDir, line);
    });
};
```

In `runAudit`, add this immediately before `const crawlResult`:

```js
const hasUrlList = config.urlList || Array.isArray(config.urlListEntries);
```

Then change:

```js
const crawlResult = config.urlList
  ? await collectUrlList(config)
```

to:

```js
const crawlResult = hasUrlList
  ? await collectUrlList(config)
```

In the `site.notes` block, change:

```js
notes: config.urlList
```

to:

```js
notes: hasUrlList
```

- [ ] **Step 6: Run route and audit tests**

Run:

```bash
node --test packages/cli/test/repo-routes.test.mjs packages/cli/test/audit.test.mjs
```

Expected: all tests pass.

- [ ] **Step 7: Commit Task 2**

Run:

```bash
git add packages/cli/src/repo-routes.mjs packages/cli/test/repo-routes.test.mjs packages/cli/src/audit.mjs packages/cli/test/audit.test.mjs
git commit -m "feat: add static repo route discovery"
```

## Task 3: Preview Process Management

**Files:**
- Create: `packages/cli/src/repo-process.mjs`
- Create: `packages/cli/test/repo-process.test.mjs`

- [ ] **Step 1: Write failing process tests**

Create `packages/cli/test/repo-process.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import net from "node:net";
import { once } from "node:events";
import { startPreview, stopPreview, waitForHttp } from "../src/repo-process.mjs";

const freePort = async () => {
  const server = net.createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address();
  server.close();
  await once(server, "close");
  return port;
};

test("starts preview command, waits for HTTP, and stops process", async () => {
  const port = await freePort();
  const preview = await startPreview({
    command: `node server.mjs ${port}`,
    cwd: "examples/fixture-repos/npm-preview",
    previewUrl: `http://127.0.0.1:${port}`,
    timeoutMs: 5000,
  });

  assert.equal(preview.url, `http://127.0.0.1:${port}`);
  const response = await fetch(preview.url);
  assert.equal(response.status, 200);

  await stopPreview(preview);
  await assert.rejects(() => waitForHttp(preview.url, { timeoutMs: 250 }), /Preview server did not become reachable/);
});

test("reports preview startup timeout", async () => {
  const port = await freePort();
  await assert.rejects(
    () =>
      startPreview({
        command: "node -e \"setTimeout(() => {}, 5000)\"",
        cwd: ".",
        previewUrl: `http://127.0.0.1:${port}`,
        timeoutMs: 250,
      }),
    /Preview server did not become reachable/,
  );
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
node --test packages/cli/test/repo-process.test.mjs
```

Expected: fails because `repo-process.mjs` does not exist.

- [ ] **Step 3: Implement `repo-process.mjs`**

Create `packages/cli/src/repo-process.mjs`:

```js
import { spawn } from "node:child_process";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitForHttp = async (url, options = {}) => {
  const timeoutMs = options.timeoutMs ?? 30000;
  const started = Date.now();
  let lastError = null;

  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.status < 500) return response;
    } catch (error) {
      lastError = error;
    }
    await sleep(100);
  }

  const suffix = lastError ? ` Last error: ${lastError.message}` : "";
  throw new Error(`Preview server did not become reachable at ${url}.${suffix}`);
};

export const startPreview = async ({ command, cwd, previewUrl, timeoutMs = 30000 }) => {
  if (!command) throw new Error("--preview-command is required for preview repo audits.");
  if (!previewUrl) throw new Error("--preview-url is required for preview repo audits.");

  const child = spawn(command, {
    cwd,
    shell: true,
    detached: process.platform !== "win32",
    stdio: ["ignore", "pipe", "pipe"],
  });

  const stdout = [];
  const stderr = [];
  child.stdout?.on("data", (chunk) => stdout.push(String(chunk)));
  child.stderr?.on("data", (chunk) => stderr.push(String(chunk)));

  const preview = { child, url: previewUrl, stdout, stderr };

  try {
    await waitForHttp(previewUrl, { timeoutMs });
    return preview;
  } catch (error) {
    await stopPreview(preview);
    throw error;
  }
};

export const stopPreview = async (preview) => {
  const child = preview?.child;
  if (!child || child.killed) return;

  const kill = (signal) => {
    if (!child.pid || child.exitCode !== null) return;
    try {
      if (process.platform === "win32") child.kill(signal);
      else process.kill(-child.pid, signal);
    } catch (error) {
      if (error.code !== "ESRCH") throw error;
    }
  };

  kill("SIGTERM");
  await sleep(100);
  kill("SIGKILL");
};
```

- [ ] **Step 4: Run process tests**

Run:

```bash
node --test packages/cli/test/repo-process.test.mjs
```

Expected: all tests pass.

- [ ] **Step 5: Commit Task 3**

Run:

```bash
git add packages/cli/src/repo-process.mjs packages/cli/test/repo-process.test.mjs
git commit -m "feat: add repo preview process management"
```

## Task 4: Repo Audit Orchestration

**Files:**
- Create: `packages/cli/src/repo-audit.mjs`
- Create: `packages/cli/test/repo-audit.test.mjs`
- Create: `examples/golden/repo-static-summary.json`
- Modify: `packages/cli/src/audit-output-schema.mjs`
- Modify: `packages/cli/test/audit-output-schema.test.mjs`
- Modify: `packages/cli/src/report.mjs`
- Modify: `packages/cli/test/report.test.mjs`

- [ ] **Step 1: Write failing repo audit tests**

Create `packages/cli/test/repo-audit.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import net from "node:net";
import { once } from "node:events";
import os from "node:os";
import path from "node:path";
import { runRepoAudit } from "../src/repo-audit.mjs";
import { waitForHttp } from "../src/repo-process.mjs";

const freePort = async () => {
  const server = net.createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address();
  server.close();
  await once(server, "close");
  return port;
};

test("audits static output repositories", async () => {
  const audit = await runRepoAudit({
    repoPath: "examples/fixture-repos/static-basic",
    staticDir: "dist",
  });

  assert.equal(audit.repo.detectedFramework, "generic-static");
  assert.equal(audit.repo.staticDirRelative, "dist");
  assert.equal(audit.pages.length, 2);
  assert.ok(audit.repo.routeSources.some((route) => route.route === "/about/"));
  assert.deepEqual(audit.repo.sourceFindings, []);
});

test("audits explicit preview repositories and cleans up preview server", async () => {
  const port = await freePort();
  const previewUrl = `http://127.0.0.1:${port}`;
  const audit = await runRepoAudit({
    repoPath: "examples/fixture-repos/npm-preview",
    previewCommand: `node server.mjs ${port}`,
    previewUrl,
    crawl: { mode: "full", maxPages: 2, maxDepth: 1 },
  });

  assert.equal(audit.repo.previewUrl, previewUrl);
  assert.equal(audit.repo.previewCommand, `node server.mjs ${port}`);
  assert.equal(audit.pages.length, 2);

  await assert.rejects(() => waitForHttp(previewUrl, { timeoutMs: 250 }), /Preview server did not become reachable/);
});

test("reports missing explicit static directories", async () => {
  const audit = await runRepoAudit({
    repoPath: "examples/fixture-repos/static-basic",
    staticDir: "missing",
  });

  assert.equal(audit.pages.length, 0);
  assert.equal(audit.repo.sourceFindings[0].id, "repo.static_dir_missing");
});

test("reports static directories without HTML routes", async () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-empty-static-"));
  fs.mkdirSync(path.join(repoPath, "dist"));

  const audit = await runRepoAudit({
    repoPath,
    staticDir: "dist",
  });

  assert.equal(audit.pages.length, 0);
  assert.equal(audit.repo.sourceFindings[0].id, "repo.static_routes_missing");
});

test("reports preview startup failure as repo source evidence", async () => {
  const port = await freePort();
  const previewUrl = `http://127.0.0.1:${port}`;
  const audit = await runRepoAudit({
    repoPath: "examples/fixture-repos/npm-preview",
    previewCommand: "node -e \"setTimeout(() => {}, 5000)\"",
    previewUrl,
    maxPreviewMs: 250,
  });

  assert.equal(audit.pages.length, 0);
  assert.equal(audit.repo.previewUrl, previewUrl);
  assert.equal(audit.repo.sourceFindings[0].id, "repo.preview_unreachable");
});

test("reports missing repo audit path", async () => {
  const audit = await runRepoAudit({
    repoPath: path.resolve("examples/fixture-repos/npm-preview"),
  });

  assert.equal(audit.pages.length, 0);
  assert.equal(audit.repo.sourceFindings[0].id, "repo.audit_path_missing");
});

const repoGoldenSummary = (audit) => ({
  repo: {
    detectedFramework: audit.repo.detectedFramework,
    packageManager: audit.repo.packageManager,
    staticDirRelative: audit.repo.staticDirRelative,
    routeSources: audit.repo.routeSources.map((route) => ({ type: route.type, route: route.route })),
  },
  pageCount: audit.pages.length,
  pageTitles: audit.pages.map((page) => page.evidence.title),
  sourceFindingIds: audit.repo.sourceFindings.map((finding) => finding.id),
  evidenceGapIds: audit.evidenceGaps.map((gap) => gap.id),
});

test("static repo evidence matches golden summary", async () => {
  const audit = await runRepoAudit({
    repoPath: "examples/fixture-repos/static-basic",
    staticDir: "dist",
  });
  const expected = JSON.parse(fs.readFileSync("examples/golden/repo-static-summary.json", "utf8"));

  assert.deepEqual(repoGoldenSummary(audit), expected);
});
```

Create `examples/golden/repo-static-summary.json`:

```json
{
  "repo": {
    "detectedFramework": "generic-static",
    "packageManager": null,
    "staticDirRelative": "dist",
    "routeSources": [
      { "type": "static_html", "route": "/" },
      { "type": "static_html", "route": "/about/" }
    ]
  },
  "pageCount": 2,
  "pageTitles": ["Static Basic Home", "About Static Basic"],
  "sourceFindingIds": [],
  "evidenceGapIds": ["ranking.integrations_missing"]
}
```

- [ ] **Step 2: Add output schema test for optional repo section**

Append to `packages/cli/test/audit-output-schema.test.mjs`:

```js
test("accepts optional repo evidence section", () => {
  const audit = {
    schemaVersion: "1.0.0",
    toolVersion: "0.2.0",
    run: {},
    site: {},
    pages: [],
    integrations: {},
    scores: {},
    findings: [],
    evidenceGaps: [],
    sources: [],
    repo: {
      path: "/repo",
      detectedFramework: "generic-static",
      sourceFindings: [],
    },
  };

  assert.deepEqual(validateAuditOutput(audit), { ok: true, errors: [] });
});
```

- [ ] **Step 3: Run tests to verify failure**

Run:

```bash
node --test packages/cli/test/repo-audit.test.mjs packages/cli/test/audit-output-schema.test.mjs
```

Expected: fails because `repo-audit.mjs` does not exist and schema docs do not expose `repo`.

- [ ] **Step 4: Implement `repo-audit.mjs`**

Create `packages/cli/src/repo-audit.mjs`:

```js
import fs from "node:fs";
import path from "node:path";
import { runAudit } from "./audit.mjs";
import { detectRepo } from "./repo-detect.mjs";
import { startPreview, stopPreview } from "./repo-process.mjs";
import { discoverStaticRoutes } from "./repo-routes.mjs";

const emptyAudit = (repo, sourceFindings) => ({
  schemaVersion: "1.0.0",
  toolVersion: "0.2.0",
  run: {
    id: `repo-audit-${Date.now()}`,
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    target: repo.path,
    mode: "repo",
  },
  site: { origin: null, robots: null, sitemaps: [], skipped: [], notes: ["No page audit path was available."] },
  pages: [],
  integrations: {},
  scores: {},
  findings: [],
  evidenceGaps: [],
  sources: [],
  repo: { ...repo, sourceFindings },
});

const missingPathFinding = () => ({
  id: "repo.audit_path_missing",
  severity: "P1",
  message: "Repo audit requires either a static output directory or an explicit preview command and preview URL.",
  evidence: ["$.repo.staticDir", "$.repo.previewCommand", "$.repo.previewUrl"],
  recommendation: "Pass --static-dir for prebuilt HTML output or pass --preview-command with --preview-url.",
  confidence: "high",
});

const staticDirMissingFinding = (staticDir) => ({
  id: "repo.static_dir_missing",
  severity: "P1",
  message: `Static output directory does not exist: ${staticDir}.`,
  evidence: ["$.repo.staticDir"],
  recommendation: "Run the site build first or pass --static-dir with an existing static HTML output directory.",
  confidence: "high",
});

const staticRoutesMissingFinding = (staticDir) => ({
  id: "repo.static_routes_missing",
  severity: "P1",
  message: `Static output directory contains no HTML routes: ${staticDir}.`,
  evidence: ["$.repo.staticDir", "$.repo.routeSources"],
  recommendation: "Build the site to HTML output or pass a static directory that contains at least one .html file.",
  confidence: "high",
});

const previewUnreachableFinding = (previewUrl, error) => ({
  id: "repo.preview_unreachable",
  severity: "P1",
  message: `Preview server did not become reachable at ${previewUrl}.`,
  evidence: ["$.repo.previewCommand", "$.repo.previewUrl"],
  recommendation: "Confirm the preview command starts a local HTTP server and that --preview-url matches its bound host and port.",
  confidence: "high",
  details: error.message,
});

const repoSection = (detection, overrides = {}) => ({
  path: detection.path,
  detectedFramework: detection.detectedFramework,
  packageManager: detection.packageManager,
  buildCommand: overrides.buildCommand ?? detection.buildCommand,
  previewCommand: overrides.previewCommand ?? detection.previewCommand,
  previewUrl: overrides.previewUrl ?? null,
  staticDir: overrides.staticDir ?? detection.staticDir,
  staticDirRelative: overrides.staticDirRelative ?? detection.staticDirRelative,
  routeSources: overrides.routeSources ?? detection.routeSources,
  sourceFindings: overrides.sourceFindings ?? [],
  notes: overrides.notes ?? detection.notes,
});

export const runRepoAudit = async (options = {}) => {
  const repoPath = path.resolve(options.repoPath || ".");
  const detection = detectRepo(repoPath);
  const staticDir = options.staticDir ? path.resolve(repoPath, options.staticDir) : detection.staticDir;

  if (options.staticDir && (!fs.existsSync(staticDir) || !fs.statSync(staticDir).isDirectory())) {
    const finding = staticDirMissingFinding(staticDir);
    const repo = repoSection(detection, {
      staticDir,
      staticDirRelative: options.staticDir,
      sourceFindings: [finding],
    });
    return emptyAudit(repo, [finding]);
  }

  if (staticDir) {
    const routes = discoverStaticRoutes(staticDir);
    if (!routes.length) {
      const finding = staticRoutesMissingFinding(staticDir);
      const repo = repoSection(detection, {
        staticDir,
        staticDirRelative: path.relative(repoPath, staticDir),
        routeSources: [],
        sourceFindings: [finding],
      });
      return emptyAudit(repo, [finding]);
    }

    const audit = await runAudit({
      ...options,
      target: routes[0]?.path,
      urlListEntries: routes.map((route) => route.path),
      crawl: { ...(options.crawl || {}), mode: "single" },
    });
    audit.repo = repoSection(detection, {
      staticDir,
      staticDirRelative: path.relative(repoPath, staticDir),
      routeSources: routes,
      sourceFindings: [],
      notes: ["Audited static output directory."],
    });
    return audit;
  }

  if (options.previewCommand && options.previewUrl) {
    let preview;
    try {
      preview = await startPreview({
        command: options.previewCommand,
        cwd: repoPath,
        previewUrl: options.previewUrl,
        timeoutMs: options.maxPreviewMs,
      });
    } catch (error) {
      const finding = previewUnreachableFinding(options.previewUrl, error);
      const repo = repoSection(detection, {
        previewCommand: options.previewCommand,
        previewUrl: options.previewUrl,
        sourceFindings: [finding],
      });
      return emptyAudit(repo, [finding]);
    }

    try {
      const audit = await runAudit({
        ...options,
        target: options.previewUrl,
        crawl: options.crawl || { mode: "full", maxPages: 25, maxDepth: 2 },
      });
      audit.repo = repoSection(detection, {
        previewCommand: options.previewCommand,
        previewUrl: options.previewUrl,
        sourceFindings: [],
        notes: ["Audited explicit preview server."],
      });
      return audit;
    } finally {
      await stopPreview(preview);
    }
  }

  const repo = repoSection(detection);
  return emptyAudit(repo, [missingPathFinding()]);
};
```

- [ ] **Step 5: Add repo evidence to Markdown reports**

Append to `packages/cli/test/report.test.mjs`:

```js
test("includes repo evidence in Markdown reports", () => {
  const markdown = generateMarkdownReport({
    run: { target: "/repo" },
    findings: [],
    scores: {},
    integrations: {},
    evidenceGaps: [],
    sources: [],
    repo: {
      path: "/repo",
      detectedFramework: "generic-static",
      packageManager: null,
      staticDirRelative: "dist",
      previewCommand: null,
      previewUrl: null,
      routeSources: [
        { type: "static_html", route: "/" },
        { type: "static_html", route: "/about/" },
      ],
      sourceFindings: [
        {
          id: "repo.static_dir_missing",
          severity: "P1",
          message: "Static output directory does not exist: /repo/missing.",
          recommendation: "Run the site build first.",
        },
      ],
    },
  });

  assert.match(markdown, /## Repository Evidence/);
  assert.match(markdown, /Framework: generic-static/);
  assert.match(markdown, /Static dir: dist/);
  assert.match(markdown, /repo\.static_dir_missing/);
});
```

In `packages/cli/src/report.mjs`, add helper functions near the existing format helpers:

```js
const formatMaybe = (value) => (value === null || value === undefined || value === "" ? "n/a" : String(value));

const formatRepoRoutes = (routes = []) => {
  if (!routes.length) return ["No repository route sources recorded."];
  return routes.slice(0, 25).map((route) => `- ${route.route} (${route.type})`);
};
```

Before the `Imported Evidence` section, add:

```js
  if (audit.repo) {
    lines.push("", "## Repository Evidence", "");
    lines.push(`- Path: ${formatMaybe(audit.repo.path)}`);
    lines.push(`- Framework: ${formatMaybe(audit.repo.detectedFramework)}`);
    lines.push(`- Package manager: ${formatMaybe(audit.repo.packageManager)}`);
    lines.push(`- Static dir: ${formatMaybe(audit.repo.staticDirRelative || audit.repo.staticDir)}`);
    lines.push(`- Preview command: ${formatMaybe(audit.repo.previewCommand)}`);
    lines.push(`- Preview URL: ${formatMaybe(audit.repo.previewUrl)}`);
    lines.push("", "Repository routes:");
    lines.push(...formatRepoRoutes(audit.repo.routeSources));
    lines.push("", "Repository source findings:");
    if (audit.repo.sourceFindings?.length) {
      for (const finding of audit.repo.sourceFindings) {
        lines.push(`- ${finding.severity} ${finding.id}: ${finding.message} Recommendation: ${finding.recommendation}`);
      }
    } else {
      lines.push("No repository source findings recorded.");
    }
  }
```

- [ ] **Step 6: Update output schema object**

In `packages/cli/src/audit-output-schema.mjs`, add to `properties`:

```js
    repo: { type: "object" },
```

Do not add `repo` to `requiredTopLevelFields`; older audit outputs remain valid.

- [ ] **Step 7: Run repo audit and report tests**

Run:

```bash
node --test packages/cli/test/repo-audit.test.mjs packages/cli/test/audit-output-schema.test.mjs packages/cli/test/report.test.mjs
```

Expected: all tests pass.

- [ ] **Step 8: Commit Task 4**

Run:

```bash
git add packages/cli/src/repo-audit.mjs packages/cli/test/repo-audit.test.mjs packages/cli/src/audit-output-schema.mjs packages/cli/test/audit-output-schema.test.mjs packages/cli/src/report.mjs packages/cli/test/report.test.mjs examples/golden/repo-static-summary.json
git commit -m "feat: add repo audit orchestration"
```

## Task 5: CLI Commands

**Files:**
- Modify: `packages/cli/src/cli.mjs`
- Modify: `packages/cli/test/cli.test.mjs`

- [ ] **Step 1: Add failing CLI tests**

Append to `packages/cli/test/cli.test.mjs`:

```js
test("detects repository audit metadata", async () => {
  const result = await capture(["detect-repo", "examples/fixture-repos/static-basic"]);

  assert.equal(result.exitCode, 0);
  const body = JSON.parse(result.stdout);
  assert.equal(body.detectedFramework, "generic-static");
  assert.equal(body.staticDirRelative, "dist");
});

test("audits static repository output from CLI", async () => {
  const result = await capture(["audit-repo", "examples/fixture-repos/static-basic", "--static-dir", "dist"]);

  assert.equal(result.exitCode, 0);
  const body = JSON.parse(result.stdout);
  assert.equal(body.repo.detectedFramework, "generic-static");
  assert.equal(body.pages.length, 2);
});
```

- [ ] **Step 2: Run CLI tests to verify failure**

Run:

```bash
node --test packages/cli/test/cli.test.mjs
```

Expected: fails because commands are not wired.

- [ ] **Step 3: Wire help and imports**

In `packages/cli/src/cli.mjs`, add imports:

```js
import { detectRepo } from "./repo-detect.mjs";
import { runRepoAudit } from "./repo-audit.mjs";
```

Add commands to help:

```text
  detect-repo <path>             Inspect source repository audit metadata
  audit-repo <path>              Audit static output or explicit preview server from a source repo
```

Add repo options to help:

```text
Repo audit options:
  --static-dir <dir>             Audit prebuilt static HTML output relative to repo path
  --preview-command <command>    Start an explicit local preview server command
  --preview-url <url>            URL to wait for and audit after preview startup
  --max-preview-ms <n>           Maximum time to wait for preview startup
```

- [ ] **Step 4: Add repo option parsing**

In `packages/cli/src/cli.mjs`, add:

```js
const repoOptionsWithValues = new Set([
  "--static-dir",
  "--preview-command",
  "--preview-url",
  "--max-preview-ms",
  "--mode",
  "--max-pages",
  "--max-depth",
  "--security",
  "--out",
  "--markdown",
]);

const splitRepoArgs = (args) => {
  const options = [];
  let repoPath = null;

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (repoOptionsWithValues.has(arg)) {
      options.push(arg);
      if (index + 1 < args.length) options.push(args[++index]);
      continue;
    }
    if (arg.startsWith("--")) {
      options.push(arg);
      continue;
    }
    if (!repoPath) repoPath = arg;
    else options.push(arg);
  }

  return { repoPath, options };
};

const mergeRepoConfig = (repoPath, options) => ({
  repoPath,
  staticDir: optionValue(options, "--static-dir"),
  previewCommand: optionValue(options, "--preview-command"),
  previewUrl: optionValue(options, "--preview-url"),
  maxPreviewMs: numberOption(options, "--max-preview-ms", 30000),
  crawl: {
    mode: optionValue(options, "--mode") || "full",
    maxPages: numberOption(options, "--max-pages", 25),
    maxDepth: numberOption(options, "--max-depth", 2),
  },
  security: {
    mode: optionValue(options, "--security") || "local",
  },
});
```

- [ ] **Step 5: Add command handlers**

Before unknown-command handling in `runCli`, add:

```js
  if (command === "detect-repo") {
    const [repoPath = "."] = rest;
    try {
      writeJson(io, detectRepo(repoPath));
      return 0;
    } catch (error) {
      io.stderr.write(`${error.message}\n`);
      return 1;
    }
  }

  if (command === "audit-repo") {
    const { repoPath, options } = splitRepoArgs(rest);
    if (!repoPath) {
      io.stderr.write("audit-repo requires a repository path.\n");
      return 1;
    }
    try {
      const output = await runRepoAudit(mergeRepoConfig(repoPath, options));
      const outPath = optionValue(options, "--out");
      const markdownPath = optionValue(options, "--markdown");
      if (outPath) fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);
      if (markdownPath) fs.writeFileSync(markdownPath, generateMarkdownReport(output));
      if (outPath || markdownPath) {
        writeJson(io, { ok: true, out: outPath || null, markdown: markdownPath || null });
      } else {
        writeJson(io, output);
      }
      return output.repo?.sourceFindings?.length ? 2 : 0;
    } catch (error) {
      io.stderr.write(`${error.message}\n`);
      return 1;
    }
  }
```

- [ ] **Step 6: Run CLI tests**

Run:

```bash
node --test packages/cli/test/cli.test.mjs
```

Expected: all tests pass.

- [ ] **Step 7: Commit Task 5**

Run:

```bash
git add packages/cli/src/cli.mjs packages/cli/test/cli.test.mjs
git commit -m "feat: add repo audit CLI commands"
```

## Task 6: Docs, Skill Wrapper, Validation

**Files:**
- Modify: `README.md`
- Modify: `skill/geo-seo-audit/SKILL.md`
- Modify: `scripts/validate-skill.mjs`

- [ ] **Step 1: Update README CLI examples**

In `README.md`, add repo command examples near existing CLI examples:

```markdown
npm run cli -- detect-repo .
npm run cli -- audit-repo . --static-dir dist --out repo-audit.json --markdown repo-audit.md
npm run cli -- audit-repo . --preview-command "npm run preview -- --host 127.0.0.1" --preview-url http://127.0.0.1:4173 --max-pages 25
```

Add this paragraph near the CLI behavior description:

```markdown
`audit-repo` is intended for source repository audits. In the first repo-to-audit release, static output directories and explicit preview commands are supported. Framework and package-manager signals are reported by `detect-repo`, but the CLI does not automatically install dependencies or run inferred framework scripts.
```

- [ ] **Step 2: Update skill wrapper workflow**

In `skill/geo-seo-audit/SKILL.md`, add to the CLI evidence collection list:

```markdown
   - For source repositories, run `openclaw-geo-seo-audit detect-repo <path>` first.
   - If static output already exists, run `openclaw-geo-seo-audit audit-repo <path> --static-dir <dir> --out audit-results.json --markdown audit-report.md`.
   - If the app must run locally, require an explicit preview command and URL: `openclaw-geo-seo-audit audit-repo <path> --preview-command "<command>" --preview-url <url> --out audit-results.json --markdown audit-report.md`.
   - Do not ask the CLI to install dependencies or run inferred framework commands unless the user explicitly approves those commands in a future release that supports them.
```

- [ ] **Step 3: Update validation script required files**

In `scripts/validate-skill.mjs`, add required entries for:

```js
"packages/cli/src/repo-audit.mjs",
"packages/cli/src/repo-detect.mjs",
"packages/cli/src/repo-process.mjs",
"packages/cli/src/repo-routes.mjs",
"packages/cli/test/repo-audit.test.mjs",
"packages/cli/test/repo-detect.test.mjs",
"packages/cli/test/repo-process.test.mjs",
"packages/cli/test/repo-routes.test.mjs",
"examples/fixture-repos/static-basic/dist/index.html",
"examples/fixture-repos/static-basic/dist/about/index.html",
"examples/fixture-repos/static-basic/dist/robots.txt",
"examples/fixture-repos/static-basic/dist/sitemap.xml",
"examples/fixture-repos/npm-preview/package.json",
"examples/fixture-repos/npm-preview/server.mjs",
"examples/fixture-repos/npm-preview/site/index.html",
"examples/fixture-repos/npm-preview/site/about.html",
"examples/golden/repo-static-summary.json",
```

- [ ] **Step 4: Run documentation and validation checks**

Run:

```bash
rg -n "audit-repo|detect-repo|preview-command|static-dir" README.md skill/geo-seo-audit/SKILL.md
npm run validate
git diff --check -- README.md skill/geo-seo-audit/SKILL.md scripts/validate-skill.mjs
```

Expected: repo command wording is present, validation reports `"ok": true`, and diff check passes.

- [ ] **Step 5: Commit Task 6**

Run:

```bash
git add README.md skill/geo-seo-audit/SKILL.md scripts/validate-skill.mjs
git commit -m "docs: document repo audit mode"
```

## Task 7: Full Verification

**Files:**
- No file edits expected.

- [ ] **Step 1: Run focused repo tests**

Run:

```bash
node --test packages/cli/test/repo-detect.test.mjs packages/cli/test/repo-routes.test.mjs packages/cli/test/repo-process.test.mjs packages/cli/test/repo-audit.test.mjs
```

Expected: all repo tests pass.

- [ ] **Step 2: Run full test suite**

Run:

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 3: Run validation**

Run:

```bash
npm run validate
```

Expected: output includes `"ok": true`.

- [ ] **Step 4: Run package dry run**

Run:

```bash
npm pack --dry-run --workspace packages/cli
```

Expected: package includes new repo source modules and excludes docs, fixtures, and golden outputs.

- [ ] **Step 5: Run CLI smoke tests**

Run:

```bash
npm run cli -- detect-repo examples/fixture-repos/static-basic
npm run cli -- audit-repo examples/fixture-repos/static-basic --static-dir dist --out /tmp/openclaw-repo-audit.json --markdown /tmp/openclaw-repo-audit.md
node -e "const fs=require('fs'); const a=JSON.parse(fs.readFileSync('/tmp/openclaw-repo-audit.json','utf8')); if (!a.repo || a.pages.length !== 2) process.exit(1); console.log(a.repo.detectedFramework, a.pages.length)"
```

Expected: detect output includes `generic-static`, audit output writes JSON and Markdown, and Node check prints `generic-static 2`.

- [ ] **Step 6: Confirm clean working tree**

Run:

```bash
git status --short --branch
git status --porcelain=v1 --untracked-files=all
```

Expected: no uncommitted or untracked files.

## Final Review Checklist

- `detect-repo` never runs repository scripts.
- `audit-repo` runs a preview command only when explicitly supplied.
- Preview processes are terminated after success and failure.
- Static audits work without a local server.
- Existing `audit`, `snapshot`, `validate-config`, and `explain-rule` commands still pass tests.
- Repo evidence is additive and does not break existing audit output validation.
- Documentation says readiness by default and avoids measured ranking claims without supplied evidence.
