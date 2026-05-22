# Repo Audit Framework Maturity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand `audit-repo` from the current Vite/generic baseline into deterministic Next.js and Astro framework fixture coverage with stable route manifest evidence and source-level route parity findings.

**Architecture:** Keep framework-specific route evidence isolated in a new manifest module instead of growing `repo-audit.mjs`. Fixture builds stay dependency-free and explicit. Repo source findings remain separate from page findings, and manifest-derived evidence is reported under repo evidence.

**Tech Stack:** Node.js 20+, ESM modules, built-in `node:test`, fixture repositories under `examples/fixture-repos`, no new runtime dependencies.

---

## Scope

This plan implements Phase C from `docs/superpowers/specs/2026-05-18-remaining-prd-roadmap-design.md`.

Included:

- Next.js fixture repository using deterministic local scripts.
- Astro fixture repository using deterministic local scripts.
- Framework route manifest parser for stable generated JSON artifacts.
- Source-level findings for manifest routes missing generated HTML and generated static routes missing from a manifest.
- Markdown report coverage for framework manifest evidence.
- Changelog and PRD status updates for the Phase C work.

Not included:

- Automatic dependency installation.
- Running inferred framework commands.
- Deep framework source parsing.
- Authenticated route flows.
- Search Console API, SERP API, AI-answer probes, or Lighthouse execution.
- Package publish or version bump.

## File Structure

- Create `packages/cli/src/repo-findings.mjs`: shared source-finding helpers for repo audit modules.
- Create `packages/cli/src/repo-manifests.mjs`: framework manifest discovery, parsing, route normalization, and route parity analysis.
- Modify `packages/cli/src/repo-audit.mjs`: import shared source finding helpers, run manifest analysis for static-output audits, include `frameworkManifests` in repo evidence.
- Modify `packages/cli/src/report.mjs`: print framework route manifest evidence.
- Modify `packages/cli/test/repo-detect.test.mjs`: assert Next.js and Astro fixture detection.
- Create `packages/cli/test/repo-manifests.test.mjs`: direct tests for manifest parsing and source findings.
- Modify `packages/cli/test/repo-audit.test.mjs`: assert Next.js and Astro repo audits integrate manifest evidence.
- Modify `packages/cli/test/report.test.mjs`: assert Markdown report includes framework manifest evidence.
- Create `examples/fixture-repos/next-basic/*`: dependency-free Next.js-like static export fixture.
- Create `examples/fixture-repos/astro-basic/*`: dependency-free Astro-like static output fixture.
- Create `examples/golden/repo-framework-summary.json`: stable summary for framework fixture audits.
- Modify `packages/cli/test/golden-fixtures.test.mjs`: assert framework repo summary.
- Modify `CHANGELOG.md`: record the Phase C unreleased user-visible change.
- Modify `docs/prd-deterministic-audit-cli.md`: move Next.js and Astro fixture coverage from remaining work to delivered Phase C work after implementation.

---

## Task 1: Add Next.js And Astro Fixture Repositories

**Files:**

- Modify: `packages/cli/test/repo-detect.test.mjs`
- Create: `examples/fixture-repos/next-basic/package.json`
- Create: `examples/fixture-repos/next-basic/build.mjs`
- Create: `examples/fixture-repos/next-basic/routes.txt`
- Create: `examples/fixture-repos/next-basic/src/index.html`
- Create: `examples/fixture-repos/next-basic/src/about.html`
- Create: `examples/fixture-repos/astro-basic/package.json`
- Create: `examples/fixture-repos/astro-basic/build.mjs`
- Create: `examples/fixture-repos/astro-basic/routes.txt`
- Create: `examples/fixture-repos/astro-basic/src/index.html`
- Create: `examples/fixture-repos/astro-basic/src/services.html`

- [ ] **Step 1: Write the failing fixture detection test**

Add this test to `packages/cli/test/repo-detect.test.mjs` after the existing framework-signal test:

```js
test("detects Next.js and Astro fixture repositories without executing scripts", () => {
  const next = detectRepo(fixture("next-basic"));
  assert.equal(next.packageManager, "npm");
  assert.equal(next.detectedFramework, "next");
  assert.equal(next.confidence, "high");
  assert.equal(next.buildCommand, "npm run build");
  assert.equal(next.previewCommand, null);
  assert.equal(next.staticDir, null);

  const astro = detectRepo(fixture("astro-basic"));
  assert.equal(astro.packageManager, "npm");
  assert.equal(astro.detectedFramework, "astro");
  assert.equal(astro.confidence, "high");
  assert.equal(astro.buildCommand, "npm run build");
  assert.equal(astro.previewCommand, null);
  assert.equal(astro.staticDir, null);
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
node --test packages/cli/test/repo-detect.test.mjs
```

Expected: FAIL because `examples/fixture-repos/next-basic` and `examples/fixture-repos/astro-basic` do not exist yet.

- [ ] **Step 3: Create the Next.js fixture package**

Create `examples/fixture-repos/next-basic/package.json`:

```json
{
  "name": "rankforge-next-basic-fixture",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node build.mjs"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

Create `examples/fixture-repos/next-basic/src/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Next Fixture Home</title>
    <meta name="description" content="Home page for the deterministic Next.js fixture.">
    <link rel="canonical" href="https://example.test/">
  </head>
  <body>
    <main>
      <h1>Next Fixture Home</h1>
      <p>This deterministic fixture represents a static Next.js export route for repo audit tests.</p>
      <a href="/about/">About</a>
    </main>
  </body>
</html>
```

Create `examples/fixture-repos/next-basic/src/about.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Next Fixture About</title>
    <meta name="description" content="About page for the deterministic Next.js fixture.">
    <link rel="canonical" href="https://example.test/about/">
  </head>
  <body>
    <main>
      <h1>Next Fixture About</h1>
      <p>The about route gives the audit a second generated page and an internal-link target.</p>
      <a href="/">Home</a>
    </main>
  </body>
</html>
```

Create `examples/fixture-repos/next-basic/routes.txt`:

```text
/
/about/
```

Create `examples/fixture-repos/next-basic/build.mjs`:

```js
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "src");
const out = path.join(root, "out");
const nextDir = path.join(root, ".next");

fs.rmSync(out, { recursive: true, force: true });
fs.rmSync(nextDir, { recursive: true, force: true });
fs.mkdirSync(path.join(out, "about"), { recursive: true });
fs.mkdirSync(nextDir, { recursive: true });

fs.copyFileSync(path.join(src, "index.html"), path.join(out, "index.html"));
fs.copyFileSync(path.join(src, "about.html"), path.join(out, "about", "index.html"));
fs.writeFileSync(path.join(out, "robots.txt"), "User-agent: *\nAllow: /\n");
fs.writeFileSync(
  path.join(out, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.test/</loc></url><url><loc>https://example.test/about/</loc></url></urlset>\n',
);
fs.writeFileSync(
  path.join(nextDir, "prerender-manifest.json"),
  `${JSON.stringify(
    {
      version: 4,
      routes: {
        "/": { initialRevalidateSeconds: false, srcRoute: null, dataRoute: null },
        "/about/": { initialRevalidateSeconds: false, srcRoute: null, dataRoute: null },
        "/missing/": { initialRevalidateSeconds: false, srcRoute: null, dataRoute: null }
      },
      dynamicRoutes: {},
      notFoundRoutes: [],
      preview: { previewModeId: "fixture", previewModeSigningKey: "fixture", previewModeEncryptionKey: "fixture" }
    },
    null,
    2,
  )}\n`,
);

console.log("next fixture build complete");
```

- [ ] **Step 4: Create the Astro fixture package**

Create `examples/fixture-repos/astro-basic/package.json`:

```json
{
  "name": "rankforge-astro-basic-fixture",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node build.mjs"
  },
  "dependencies": {
    "astro": "^5.0.0"
  }
}
```

Create `examples/fixture-repos/astro-basic/src/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Astro Fixture Home</title>
    <meta name="description" content="Home page for the deterministic Astro fixture.">
    <link rel="canonical" href="https://example.test/">
  </head>
  <body>
    <main>
      <h1>Astro Fixture Home</h1>
      <p>This deterministic fixture represents an Astro static output route for repo audit tests.</p>
      <a href="/services/">Services</a>
    </main>
  </body>
</html>
```

Create `examples/fixture-repos/astro-basic/src/services.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Astro Fixture Services</title>
    <meta name="description" content="Services page for the deterministic Astro fixture.">
    <link rel="canonical" href="https://example.test/services/">
  </head>
  <body>
    <main>
      <h1>Astro Fixture Services</h1>
      <p>The services route gives the Astro fixture a second generated static page.</p>
      <a href="/">Home</a>
    </main>
  </body>
</html>
```

Create `examples/fixture-repos/astro-basic/routes.txt`:

```text
/
/services/
```

Create `examples/fixture-repos/astro-basic/build.mjs`:

```js
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "src");
const dist = path.join(root, "dist");
const astroDir = path.join(root, ".astro");

fs.rmSync(dist, { recursive: true, force: true });
fs.rmSync(astroDir, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, "services"), { recursive: true });
fs.mkdirSync(astroDir, { recursive: true });

fs.copyFileSync(path.join(src, "index.html"), path.join(dist, "index.html"));
fs.copyFileSync(path.join(src, "services.html"), path.join(dist, "services", "index.html"));
fs.writeFileSync(path.join(dist, "robots.txt"), "User-agent: *\nAllow: /\n");
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.test/</loc></url><url><loc>https://example.test/services/</loc></url></urlset>\n',
);
fs.writeFileSync(
  path.join(astroDir, "manifest.json"),
  `${JSON.stringify(
    {
      routes: [
        { route: "/", type: "page" },
        { route: "/services/", type: "page" }
      ],
      assets: []
    },
    null,
    2,
  )}\n`,
);

console.log("astro fixture build complete");
```

- [ ] **Step 5: Re-run detection test and verify it passes**

Run:

```bash
node --test packages/cli/test/repo-detect.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit Task 1**

Run:

```bash
git add packages/cli/test/repo-detect.test.mjs examples/fixture-repos/next-basic examples/fixture-repos/astro-basic
git commit -m "test: add framework repo fixtures"
```

---

## Task 2: Add Framework Route Manifest Parser

**Files:**

- Create: `packages/cli/test/repo-manifests.test.mjs`
- Create: `packages/cli/src/repo-findings.mjs`
- Create: `packages/cli/src/repo-manifests.mjs`
- Modify: `scripts/validate-skill.mjs`

- [ ] **Step 1: Write failing manifest parser tests**

Create `packages/cli/test/repo-manifests.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { analyzeFrameworkRouteManifests } from "../src/repo-manifests.mjs";

const writeHtml = (file, title) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `<!doctype html><title>${title}</title><h1>${title}</h1><p>Generated fixture content.</p>`);
};

test("reads Next.js prerender manifest and reports missing generated routes", () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-next-manifest-"));
  const staticDir = path.join(repoPath, "out");
  const manifestDir = path.join(repoPath, ".next");
  writeHtml(path.join(staticDir, "index.html"), "Home");
  writeHtml(path.join(staticDir, "about", "index.html"), "About");
  fs.mkdirSync(manifestDir, { recursive: true });
  fs.writeFileSync(
    path.join(manifestDir, "prerender-manifest.json"),
    JSON.stringify({
      routes: {
        "/": {},
        "/about/": {},
        "/missing/": {}
      }
    }),
  );

  const result = analyzeFrameworkRouteManifests({
    repoPath,
    staticDir,
    detectedFramework: "next",
    staticRoutes: [
      { type: "static_html", route: "/", path: path.join(staticDir, "index.html") },
      { type: "static_html", route: "/about/", path: path.join(staticDir, "about", "index.html") }
    ]
  });

  assert.deepEqual(result.frameworkManifests, [
    {
      type: "next_prerender_manifest",
      path: path.join(manifestDir, "prerender-manifest.json"),
      routes: ["/", "/about/", "/missing/"]
    }
  ]);
  assert.deepEqual(
    result.sourceFindings.map((finding) => finding.id),
    ["repo.manifest_route_missing"],
  );
  assert.equal(result.sourceFindings[0].evidence, "/missing/");
});

test("reads Astro manifest routes when present", () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-astro-manifest-"));
  const staticDir = path.join(repoPath, "dist");
  const manifestDir = path.join(repoPath, ".astro");
  writeHtml(path.join(staticDir, "index.html"), "Home");
  writeHtml(path.join(staticDir, "services", "index.html"), "Services");
  fs.mkdirSync(manifestDir, { recursive: true });
  fs.writeFileSync(
    path.join(manifestDir, "manifest.json"),
    JSON.stringify({
      routes: [
        { route: "/", type: "page" },
        { route: "/services/", type: "page" }
      ]
    }),
  );

  const result = analyzeFrameworkRouteManifests({
    repoPath,
    staticDir,
    detectedFramework: "astro",
    staticRoutes: [
      { type: "static_html", route: "/", path: path.join(staticDir, "index.html") },
      { type: "static_html", route: "/services/", path: path.join(staticDir, "services", "index.html") }
    ]
  });

  assert.deepEqual(result.frameworkManifests, [
    {
      type: "astro_manifest",
      path: path.join(manifestDir, "manifest.json"),
      routes: ["/", "/services/"]
    }
  ]);
  assert.deepEqual(result.sourceFindings, []);
});

test("reports generated static routes that are not listed in a framework manifest", () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-unlisted-route-"));
  const staticDir = path.join(repoPath, "out");
  const manifestDir = path.join(repoPath, ".next");
  writeHtml(path.join(staticDir, "index.html"), "Home");
  writeHtml(path.join(staticDir, "extra", "index.html"), "Extra");
  fs.mkdirSync(manifestDir, { recursive: true });
  fs.writeFileSync(path.join(manifestDir, "prerender-manifest.json"), JSON.stringify({ routes: { "/": {} } }));

  const result = analyzeFrameworkRouteManifests({
    repoPath,
    staticDir,
    detectedFramework: "next",
    staticRoutes: [
      { type: "static_html", route: "/", path: path.join(staticDir, "index.html") },
      { type: "static_html", route: "/extra/", path: path.join(staticDir, "extra", "index.html") }
    ]
  });

  assert.deepEqual(
    result.sourceFindings.map((finding) => finding.id),
    ["repo.static_route_unlisted"],
  );
  assert.equal(result.sourceFindings[0].evidence, "/extra/");
});

test("ignores absent framework manifests", () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-no-manifest-"));
  const staticDir = path.join(repoPath, "out");
  writeHtml(path.join(staticDir, "index.html"), "Home");

  const result = analyzeFrameworkRouteManifests({
    repoPath,
    staticDir,
    detectedFramework: "next",
    staticRoutes: [{ type: "static_html", route: "/", path: path.join(staticDir, "index.html") }]
  });

  assert.deepEqual(result.frameworkManifests, []);
  assert.deepEqual(result.sourceFindings, []);
});

test("fails closed on malformed manifest JSON", () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-bad-manifest-"));
  const staticDir = path.join(repoPath, "out");
  const manifestDir = path.join(repoPath, ".next");
  writeHtml(path.join(staticDir, "index.html"), "Home");
  fs.mkdirSync(manifestDir, { recursive: true });
  fs.writeFileSync(path.join(manifestDir, "prerender-manifest.json"), "{bad json");

  const result = analyzeFrameworkRouteManifests({
    repoPath,
    staticDir,
    detectedFramework: "next",
    staticRoutes: [{ type: "static_html", route: "/", path: path.join(staticDir, "index.html") }]
  });

  assert.deepEqual(result.frameworkManifests, []);
  assert.equal(result.sourceFindings[0].id, "repo.route_manifest_invalid");
});
```

- [ ] **Step 2: Run the parser tests and verify they fail**

Run:

```bash
node --test packages/cli/test/repo-manifests.test.mjs
```

Expected: FAIL because `packages/cli/src/repo-manifests.mjs` does not exist.

- [ ] **Step 3: Create shared repo source-finding helpers**

Create `packages/cli/src/repo-findings.mjs`:

```js
export const sourceFinding = ({ id, severity = "P1", message, evidence, recommendation, confidence = "high", details }) => ({
  id,
  severity,
  message,
  evidence,
  recommendation,
  confidence,
  ...(details ? { details } : {}),
});
```

- [ ] **Step 4: Create the framework manifest parser**

Create `packages/cli/src/repo-manifests.mjs`:

```js
import fs from "node:fs";
import path from "node:path";
import { sourceFinding } from "./repo-findings.mjs";

const ordinalCompare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);

const normalizeRoute = (route) => {
  if (typeof route !== "string") return null;
  const clean = route.trim();
  if (!clean || clean.startsWith("#")) return null;
  const withSlash = clean.startsWith("/") ? clean : `/${clean}`;
  if (withSlash === "/") return "/";
  if (path.posix.extname(withSlash)) return withSlash;
  return withSlash.endsWith("/") ? withSlash : `${withSlash}/`;
};

const htmlPathForRoute = (staticDir, route) => {
  if (route === "/") return path.join(staticDir, "index.html");
  const normalized = route.startsWith("/") ? route.slice(1) : route;
  if (normalized.endsWith(".html")) return path.join(staticDir, normalized);
  return path.join(staticDir, normalized, "index.html");
};

const readJsonFile = (filePath) => {
  try {
    return { ok: true, value: JSON.parse(fs.readFileSync(filePath, "utf8")) };
  } catch (error) {
    return { ok: false, error };
  }
};

const uniqueSortedRoutes = (routes) =>
  [...new Set(routes.map(normalizeRoute).filter(Boolean))].sort((left, right) => ordinalCompare(left, right));

const nextPrerenderRoutes = (json) => uniqueSortedRoutes(Object.keys(json?.routes || {}));

const astroRoutes = (json) => {
  const rawRoutes = Array.isArray(json?.routes) ? json.routes : Array.isArray(json?.manifest?.routes) ? json.manifest.routes : [];
  return uniqueSortedRoutes(
    rawRoutes.map((entry) => {
      if (typeof entry === "string") return entry;
      return entry?.route || entry?.pathname || entry?.pattern;
    }),
  );
};

const manifestConfigFor = (detectedFramework) => {
  if (detectedFramework === "next") {
    return [
      {
        type: "next_prerender_manifest",
        relativePath: path.join(".next", "prerender-manifest.json"),
        routesFor: nextPrerenderRoutes,
      },
    ];
  }
  if (detectedFramework === "astro") {
    return [
      {
        type: "astro_manifest",
        relativePath: path.join(".astro", "manifest.json"),
        routesFor: astroRoutes,
      },
    ];
  }
  return [];
};

const invalidManifestFinding = (manifestPath, error) =>
  sourceFinding({
    id: "repo.route_manifest_invalid",
    severity: "P2",
    message: "Framework route manifest could not be parsed.",
    evidence: manifestPath,
    recommendation: "Regenerate the framework build artifacts and rerun the repository audit.",
    confidence: "high",
    details: { message: error?.message || "Invalid JSON" },
  });

const manifestRouteMissingFinding = (route) =>
  sourceFinding({
    id: "repo.manifest_route_missing",
    severity: "P2",
    message: "Framework route manifest lists a route that is missing generated HTML output.",
    evidence: route,
    recommendation: "Ensure the framework build emits static HTML for this route or remove it from the prerendered route manifest.",
    confidence: "high",
  });

const staticRouteUnlistedFinding = (route) =>
  sourceFinding({
    id: "repo.static_route_unlisted",
    severity: "P3",
    message: "Static output contains a generated HTML route that is not listed in the framework route manifest.",
    evidence: route,
    recommendation: "Confirm the route is intentionally generated and discoverable through sitemap or internal links.",
    confidence: "medium",
  });

export const analyzeFrameworkRouteManifests = ({ repoPath, staticDir, detectedFramework, staticRoutes = [] }) => {
  const configs = manifestConfigFor(detectedFramework);
  const frameworkManifests = [];
  const sourceFindings = [];

  for (const config of configs) {
    const manifestPath = path.join(repoPath, config.relativePath);
    if (!fs.existsSync(manifestPath)) continue;

    const parsed = readJsonFile(manifestPath);
    if (!parsed.ok) {
      sourceFindings.push(invalidManifestFinding(manifestPath, parsed.error));
      continue;
    }

    const routes = config.routesFor(parsed.value);
    frameworkManifests.push({ type: config.type, path: manifestPath, routes });

    const manifestRouteSet = new Set(routes);
    const staticRouteSet = new Set(staticRoutes.map((route) => normalizeRoute(route.route)).filter(Boolean));

    for (const route of routes) {
      const htmlPath = htmlPathForRoute(staticDir, route);
      if (!fs.existsSync(htmlPath) || !fs.statSync(htmlPath).isFile()) {
        sourceFindings.push(manifestRouteMissingFinding(route));
      }
    }

    for (const route of [...staticRouteSet].sort((left, right) => ordinalCompare(left, right))) {
      if (!manifestRouteSet.has(route)) sourceFindings.push(staticRouteUnlistedFinding(route));
    }
  }

  return { frameworkManifests, sourceFindings };
};
```

- [ ] **Step 5: Add new source files to the validation required-file list**

Open `scripts/validate-skill.mjs` and add these two entries to the required files array:

```js
"packages/cli/src/repo-findings.mjs",
"packages/cli/src/repo-manifests.mjs",
```

- [ ] **Step 6: Re-run parser tests and validation**

Run:

```bash
node --test packages/cli/test/repo-manifests.test.mjs
npm run validate
```

Expected: both commands PASS.

- [ ] **Step 7: Commit Task 2**

Run:

```bash
git add packages/cli/src/repo-findings.mjs packages/cli/src/repo-manifests.mjs packages/cli/test/repo-manifests.test.mjs scripts/validate-skill.mjs
git commit -m "feat: parse framework route manifests"
```

---

## Task 3: Integrate Manifest Evidence Into Repo Audits

**Files:**

- Modify: `packages/cli/src/repo-audit.mjs`
- Modify: `packages/cli/test/repo-audit.test.mjs`

- [ ] **Step 1: Write failing repo-audit integration tests**

Add these tests to `packages/cli/test/repo-audit.test.mjs` after the Vite build audit test:

```js
test("Next.js static build audit records framework manifest evidence and route parity findings", async () => {
  const repoPath = fixture("next-basic");
  fs.rmSync(path.join(repoPath, "out"), { recursive: true, force: true });
  fs.rmSync(path.join(repoPath, ".next"), { recursive: true, force: true });

  const audit = await runRepoAudit({
    repoPath,
    buildCommand: "npm run build",
    staticDir: "out",
    maxBuildMs: 5000,
  });

  assert.equal(audit.repo.detectedFramework, "next");
  assert.equal(audit.repo.staticDirRelative, "out");
  assert.equal(audit.pages.length, 2);
  assert.deepEqual(audit.repo.frameworkManifests, [
    {
      type: "next_prerender_manifest",
      path: path.join(repoPath, ".next", "prerender-manifest.json"),
      routes: ["/", "/about/", "/missing/"]
    }
  ]);
  assert.ok(audit.repo.sourceFindings.some((finding) => finding.id === "repo.manifest_route_missing"));
});

test("Astro static build audit records framework manifest evidence", async () => {
  const repoPath = fixture("astro-basic");
  fs.rmSync(path.join(repoPath, "dist"), { recursive: true, force: true });
  fs.rmSync(path.join(repoPath, ".astro"), { recursive: true, force: true });

  const audit = await runRepoAudit({
    repoPath,
    buildCommand: "npm run build",
    staticDir: "dist",
    maxBuildMs: 5000,
  });

  assert.equal(audit.repo.detectedFramework, "astro");
  assert.equal(audit.repo.staticDirRelative, "dist");
  assert.equal(audit.pages.length, 2);
  assert.deepEqual(audit.repo.frameworkManifests, [
    {
      type: "astro_manifest",
      path: path.join(repoPath, ".astro", "manifest.json"),
      routes: ["/", "/services/"]
    }
  ]);
  assert.ok(!audit.repo.sourceFindings.some((finding) => finding.id === "repo.manifest_route_missing"));
});
```

- [ ] **Step 2: Run integration tests and verify they fail**

Run:

```bash
node --test packages/cli/test/repo-audit.test.mjs
```

Expected: FAIL because `audit.repo.frameworkManifests` is not populated yet.

- [ ] **Step 3: Update repo-audit imports**

In `packages/cli/src/repo-audit.mjs`, replace the local `sourceFinding` helper import area with these imports:

```js
import { sourceFinding } from "./repo-findings.mjs";
import { analyzeFrameworkRouteManifests } from "./repo-manifests.mjs";
```

Then remove the local `const sourceFinding = ...` declaration from `repo-audit.mjs`.

- [ ] **Step 4: Add default manifest evidence to repo evidence**

In `repoEvidence`, add `frameworkManifests: []` before `sourceFindings: []`:

```js
const repoEvidence = (detected, overrides = {}) => ({
  path: detected.repoRoot,
  detectedFramework: detected.detectedFramework,
  confidence: detected.confidence,
  packageManager: detected.packageManager,
  buildCommand: detected.buildCommand,
  previewCommand: detected.previewCommand,
  staticDir: detected.staticDir,
  staticDirRelative: detected.staticDirRelative,
  routeSources: detected.routeSources || [],
  frameworkManifests: [],
  sourceFindings: [],
  notes: [],
  ...overrides,
});
```

- [ ] **Step 5: Analyze all static routes before route-list narrowing**

In the static-output branch of `runRepoAudit`, replace:

```js
const routes = routeListResult ? routeListResult.routes : discoverStaticRoutes(staticDir);
```

with:

```js
const staticRoutes = discoverStaticRoutes(staticDir);
const routes = routeListResult ? routeListResult.routes : staticRoutes;
```

- [ ] **Step 6: Add manifest analysis to successful static audits**

In the static-output branch, replace:

```js
const outputSourceFindings = generatedOutputFindings(staticDir);
```

with:

```js
const manifestAnalysis = analyzeFrameworkRouteManifests({
  repoPath,
  staticDir,
  detectedFramework: detected.detectedFramework,
  staticRoutes,
});
const outputSourceFindings = [...generatedOutputFindings(staticDir), ...manifestAnalysis.sourceFindings];
```

Then add `frameworkManifests` to the `repoEvidence` override:

```js
frameworkManifests: manifestAnalysis.frameworkManifests,
sourceFindings: outputSourceFindings,
```

- [ ] **Step 7: Re-run focused repo-audit tests**

Run:

```bash
node --test packages/cli/test/repo-audit.test.mjs
```

Expected: PASS.

- [ ] **Step 8: Commit Task 3**

Run:

```bash
git add packages/cli/src/repo-audit.mjs packages/cli/test/repo-audit.test.mjs
git commit -m "feat: include framework manifest evidence in repo audits"
```

---

## Task 4: Add Report Coverage For Framework Manifests

**Files:**

- Modify: `packages/cli/src/report.mjs`
- Modify: `packages/cli/test/report.test.mjs`

- [ ] **Step 1: Write failing Markdown report test**

Add this test to `packages/cli/test/report.test.mjs`:

```js
test("includes framework manifest evidence when present", () => {
  const markdown = generateMarkdownReport({
    run: { target: "repo" },
    findings: [],
    scores: {},
    integrations: {},
    evidenceGaps: [],
    sources: [],
    repo: {
      path: "/repo",
      detectedFramework: "next",
      packageManager: "npm",
      staticDirRelative: "out",
      routeSources: [{ type: "static_html", route: "/", path: "/repo/out/index.html" }],
      frameworkManifests: [
        {
          type: "next_prerender_manifest",
          path: "/repo/.next/prerender-manifest.json",
          routes: ["/", "/about/", "/missing/"]
        }
      ],
      sourceFindings: []
    },
  });

  assert.match(markdown, /Framework route manifests:/);
  assert.match(markdown, /next_prerender_manifest: 3 routes/);
  assert.match(markdown, /\/repo\/\.next\/prerender-manifest\.json/);
});
```

- [ ] **Step 2: Run report tests and verify failure**

Run:

```bash
node --test packages/cli/test/report.test.mjs
```

Expected: FAIL because Markdown does not print framework manifest evidence yet.

- [ ] **Step 3: Update Markdown report generation**

In `packages/cli/src/report.mjs`, after the `Repository routes:` block and before `Repository source findings:`, add:

```js
  lines.push("", "Framework route manifests:");
  if (repo.frameworkManifests?.length) {
    for (const manifest of repo.frameworkManifests) {
      lines.push(
        `- ${formatBulletValue(manifest.type)}: ${formatBulletValue((manifest.routes || []).length)} routes from ${formatBulletValue(manifest.path)}`,
      );
    }
  } else {
    lines.push("- None recorded.");
  }
```

- [ ] **Step 4: Re-run report tests**

Run:

```bash
node --test packages/cli/test/report.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit Task 4**

Run:

```bash
git add packages/cli/src/report.mjs packages/cli/test/report.test.mjs
git commit -m "feat: report framework manifest evidence"
```

---

## Task 5: Add Golden Summary Coverage For Framework Repo Audits

**Files:**

- Modify: `packages/cli/test/golden-fixtures.test.mjs`
- Create: `examples/golden/repo-framework-summary.json`

- [ ] **Step 1: Write failing golden summary test**

In `packages/cli/test/golden-fixtures.test.mjs`, add these imports:

```js
import { runRepoAudit } from "../src/repo-audit.mjs";
```

Add this helper near the existing helpers:

```js
const frameworkRepoSummary = (audit) => ({
  framework: audit.repo.detectedFramework,
  staticDirRelative: audit.repo.staticDirRelative,
  pageTitles: audit.pages.map((page) => page.evidence.title),
  frameworkManifests: audit.repo.frameworkManifests.map((manifest) => ({
    type: manifest.type,
    routes: manifest.routes,
  })),
  sourceFindingIds: audit.repo.sourceFindings.map((finding) => finding.id),
});
```

Add this test:

```js
test("framework repo audit golden summary matches fixtures", async () => {
  const nextRepo = path.resolve("examples/fixture-repos/next-basic");
  const astroRepo = path.resolve("examples/fixture-repos/astro-basic");
  const nextAudit = await runRepoAudit({
    repoPath: nextRepo,
    buildCommand: "npm run build",
    staticDir: "out",
    maxBuildMs: 5000,
  });
  const astroAudit = await runRepoAudit({
    repoPath: astroRepo,
    buildCommand: "npm run build",
    staticDir: "dist",
    maxBuildMs: 5000,
  });
  const expected = JSON.parse(fs.readFileSync("examples/golden/repo-framework-summary.json", "utf8"));

  assert.deepEqual(
    {
      next: frameworkRepoSummary(nextAudit),
      astro: frameworkRepoSummary(astroAudit),
    },
    expected,
  );
});
```

- [ ] **Step 2: Run golden test and verify failure**

Run:

```bash
node --test packages/cli/test/golden-fixtures.test.mjs
```

Expected: FAIL because `examples/golden/repo-framework-summary.json` does not exist.

- [ ] **Step 3: Add framework golden summary**

Create `examples/golden/repo-framework-summary.json`:

```json
{
  "next": {
    "framework": "next",
    "staticDirRelative": "out",
    "pageTitles": [
      "Next Fixture Home",
      "Next Fixture About"
    ],
    "frameworkManifests": [
      {
        "type": "next_prerender_manifest",
        "routes": [
          "/",
          "/about/",
          "/missing/"
        ]
      }
    ],
    "sourceFindingIds": [
      "repo.manifest_route_missing"
    ]
  },
  "astro": {
    "framework": "astro",
    "staticDirRelative": "dist",
    "pageTitles": [
      "Astro Fixture Home",
      "Astro Fixture Services"
    ],
    "frameworkManifests": [
      {
        "type": "astro_manifest",
        "routes": [
          "/",
          "/services/"
        ]
      }
    ],
    "sourceFindingIds": []
  }
}
```

- [ ] **Step 4: Re-run golden test**

Run:

```bash
node --test packages/cli/test/golden-fixtures.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit Task 5**

Run:

```bash
git add packages/cli/test/golden-fixtures.test.mjs examples/golden/repo-framework-summary.json
git commit -m "test: add framework repo golden summary"
```

---

## Task 6: Update Docs And Changelog

**Files:**

- Modify: `CHANGELOG.md`
- Modify: `docs/prd-deterministic-audit-cli.md`

- [ ] **Step 1: Update changelog**

In `CHANGELOG.md`, under the current `Unreleased` section, add:

```md
- Added Phase C repo audit framework maturity coverage with deterministic Next.js and Astro fixtures, framework route manifest evidence, and source-level route parity findings for manifest/static-output mismatches.
```

- [ ] **Step 2: Update PRD delivered/remaining status**

In `docs/prd-deterministic-audit-cli.md`, under `Delivered developer-focused repo audit completion work:`, add:

```md
- Phase C framework maturity coverage for deterministic Next.js and Astro fixture audits.
- Framework route manifest evidence for stable generated artifacts.
- Source-level route parity findings for manifest routes missing generated HTML and generated HTML routes absent from framework route manifests.
```

Under `Remaining developer-focused repo audit work:`, replace:

```md
- Next.js and Astro fixture coverage.
- Deeper deterministic source-level findings for framework metadata usage and rendered/source mismatches where stable.
- Optional framework-specific route manifest parsing when it can be done without brittle heuristics.
```

with:

```md
- Deeper deterministic source-level findings for framework metadata usage and rendered/source mismatches where stable framework artifacts expose metadata expectations.
- Additional framework-specific route manifest parsing only when stable generated artifacts are identified and covered by fixtures.
```

- [ ] **Step 3: Check docs wording**

Run:

```bash
rg -n "Next.js and Astro fixture coverage|Optional framework-specific route manifest parsing|Phase C framework maturity" docs/prd-deterministic-audit-cli.md CHANGELOG.md
```

Expected: output includes the new delivered Phase C language and does not include the old standalone `Next.js and Astro fixture coverage` remaining-work bullet.

- [ ] **Step 4: Commit Task 6**

Run:

```bash
git add CHANGELOG.md docs/prd-deterministic-audit-cli.md
git commit -m "docs: record framework repo audit maturity"
```

---

## Task 7: Full Verification And Final Cleanup

**Files:**

- Validate working tree and all changed behavior.

- [ ] **Step 1: Run focused repo test suite**

Run:

```bash
node --test packages/cli/test/repo-detect.test.mjs packages/cli/test/repo-manifests.test.mjs packages/cli/test/repo-audit.test.mjs packages/cli/test/report.test.mjs packages/cli/test/golden-fixtures.test.mjs
```

Expected: PASS.

- [ ] **Step 2: Run full test suite**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 3: Run skill validation**

Run:

```bash
npm run validate
```

Expected: PASS with `"ok": true`.

- [ ] **Step 4: Run diff hygiene check**

Run:

```bash
git diff --check
```

Expected: no output and exit code 0.

- [ ] **Step 5: Inspect final status**

Run:

```bash
git status --short --branch
```

Expected: branch shows only the expected ahead count and no uncommitted files.

- [ ] **Step 6: Commit any verification-only documentation correction**

If Step 1 through Step 4 expose a documentation wording mismatch only, make the smallest docs correction, then run:

```bash
git add CHANGELOG.md docs/prd-deterministic-audit-cli.md
git commit -m "docs: clarify framework audit status"
```

Skip this step when no correction is needed.

---

## Completion Checklist

- [ ] Next.js fixture detection passes without executing scripts.
- [ ] Astro fixture detection passes without executing scripts.
- [ ] Next.js and Astro fixture builds are dependency-free local Node scripts.
- [ ] Framework manifest parser has direct unit coverage.
- [ ] Repo audit output includes `repo.frameworkManifests`.
- [ ] Repo source findings include manifest/static parity findings.
- [ ] Markdown report includes framework manifest evidence.
- [ ] Golden summary covers Next.js and Astro framework repo audits.
- [ ] PRD and changelog reflect Phase C implementation.
- [ ] `npm test` passes.
- [ ] `npm run validate` passes.
- [ ] `git diff --check` passes.
- [ ] Working tree is clean.
