# Track 2 Developer Repo Audit Maturity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mature `rankforge audit-repo` for developer repository audits by adding deterministic SPA route-list mapping, source-finding guidance, clearer repo reports, and a copy-paste CI artifact workflow.

**Architecture:** Keep repository source findings separate from rendered page/site findings. Extend route-list parsing additively with explicit route-to-generated-HTML mappings instead of inferring client routes. Attach source-finding guidance at source-finding creation time, then render that guidance in Markdown and HTML reports.

**Tech Stack:** Node.js 20+, ESM modules, built-in `node:test`, RankForge CLI package under `packages/cli`, Markdown docs, GitHub Actions YAML examples.

---

## Source Spec

Approved design:

- `docs/superpowers/specs/2026-05-22-track-2-developer-repo-audit-maturity-design.md`

## File Structure

- Create `examples/fixture-repos/vite-spa/`: dependency-free Vite-signaled SPA fixture with one generated HTML shell and route-list mappings.
- Modify `packages/cli/src/repo-audit.mjs`: parse one-column and two-column route-list entries, keep mapped paths bounded to static output, expose mapped route source types.
- Modify `packages/cli/src/repo-findings.mjs`: attach additive `inspectNext`, `developerAction`, and `acceptanceCriteria` fields to known repo source findings.
- Modify `packages/cli/src/report.mjs`: show repo audit mode and source-finding guidance in Markdown and HTML repository evidence sections.
- Modify `packages/cli/test/repo-audit.test.mjs`: cover SPA mapped route lists and mapped-entry guardrails.
- Create `packages/cli/test/repo-findings.test.mjs`: cover source-finding guidance for all supported repo source finding IDs.
- Modify `packages/cli/test/report.test.mjs`: cover Markdown and HTML report guidance columns and escaping.
- Create `docs/repo-audit-route-lists.md`: user-facing route-list workflow documentation.
- Create `docs/examples/github-actions-rankforge-repo-audit.yml`: docs-only GitHub Actions artifact example.
- Create `packages/cli/test/docs-examples.test.mjs`: deterministic docs/example sanity checks.
- Modify `README.md`, `docs/prd-deterministic-audit-cli.md`, and `CHANGELOG.md`: concise links and Track 2 alignment.
- Update `examples/golden/repo-framework-report.md` only if the report output changes intentionally.

---

### Task 1: Add Deterministic SPA Route-List Mapping

**Files:**
- Create: `examples/fixture-repos/vite-spa/package.json`
- Create: `examples/fixture-repos/vite-spa/build.mjs`
- Create: `examples/fixture-repos/vite-spa/routes.txt`
- Create: `examples/fixture-repos/vite-spa/src/index.html`
- Modify: `packages/cli/src/repo-audit.mjs`
- Modify: `packages/cli/test/repo-audit.test.mjs`

- [ ] **Step 1: Add failing tests for mapped SPA route-list entries**

Add these tests to `packages/cli/test/repo-audit.test.mjs` after the existing `"repo audit constrains static routes with route list"` test:

```js
test("repo audit maps SPA route-list routes to an explicit generated HTML shell", async () => {
  const { repoPath, tempRoot } = copyFixtureRepo("vite-spa");

  try {
    const audit = await runRepoAudit({
      repoPath,
      buildCommand: "npm run build",
      staticDir: "dist",
      routeList: "routes.txt",
      maxBuildMs: 5000,
    });

    assert.equal(audit.repo.detectedFramework, "vite");
    assert.equal(audit.repo.staticDirRelative, "dist");
    assert.deepEqual(
      audit.repo.routeSources.map((route) => ({
        type: route.type,
        route: route.route,
        path: path.relative(repoPath, route.path),
      })),
      [
        { type: "route_list_mapped", route: "/", path: path.join("dist", "index.html") },
        { type: "route_list_mapped", route: "/pricing/", path: path.join("dist", "index.html") },
        { type: "route_list_mapped", route: "/docs/", path: path.join("dist", "index.html") },
      ],
    );
    assert.equal(audit.pages.length, 3);
    assert.ok(audit.pages.every((page) => page.evidence.title === "Vite SPA Shell"));
    assert.deepEqual(audit.repo.sourceFindings, []);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("repo audit reports missing mapped SPA route-list generated files", async () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-spa-missing-mapped-file-"));
  const staticDir = path.join(repoPath, "dist");
  const routeList = path.join(repoPath, "routes.txt");
  fs.mkdirSync(staticDir, { recursive: true });
  fs.writeFileSync(
    path.join(staticDir, "index.html"),
    "<title>SPA Shell</title><meta name='description' content='SPA'><h1>SPA Shell</h1><p>Enough generated content.</p>",
  );
  fs.writeFileSync(routeList, "/pricing/ missing.html\n");

  try {
    const audit = await runRepoAudit({ repoPath, staticDir, routeList });

    assert.equal(audit.pages.length, 0);
    assert.equal(audit.repo.sourceFindings[0].id, "repo.route_list_entry_missing");
    assert.equal(audit.repo.sourceFindings[0].evidence, "/pricing/ missing.html");
  } finally {
    fs.rmSync(repoPath, { recursive: true, force: true });
  }
});

test("repo audit rejects mapped SPA route-list generated files outside static output", async () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-spa-outside-static-"));
  const staticDir = path.join(repoPath, "dist");
  const outsideDir = path.join(repoPath, "outside");
  const routeList = path.join(repoPath, "routes.txt");
  fs.mkdirSync(staticDir, { recursive: true });
  fs.mkdirSync(outsideDir, { recursive: true });
  fs.writeFileSync(path.join(staticDir, "index.html"), "<title>SPA Shell</title><h1>SPA Shell</h1>");
  fs.writeFileSync(path.join(outsideDir, "external.html"), "<title>External</title><h1>External</h1>");
  fs.writeFileSync(routeList, `/pricing/ ${path.join(outsideDir, "external.html")}\n`);

  try {
    const audit = await runRepoAudit({ repoPath, staticDir, routeList });

    assert.equal(audit.pages.length, 0);
    assert.equal(audit.repo.sourceFindings[0].id, "repo.route_list_entry_outside_static_dir");
    assert.deepEqual(audit.repo.routeSources, []);
  } finally {
    fs.rmSync(repoPath, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
node --test packages/cli/test/repo-audit.test.mjs
```

Expected: FAIL because `examples/fixture-repos/vite-spa` does not exist and two-column route-list mappings are not implemented.

- [ ] **Step 3: Add the Vite SPA fixture files**

Create `examples/fixture-repos/vite-spa/package.json`:

```json
{
  "name": "rankforge-vite-spa-fixture",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node build.mjs"
  },
  "devDependencies": {
    "vite": "5.0.0"
  }
}
```

Create `examples/fixture-repos/vite-spa/src/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Vite SPA Shell</title>
    <meta name="description" content="Deterministic Vite SPA shell fixture for RankForge route-list audits.">
    <link rel="canonical" href="https://example.com/">
  </head>
  <body>
    <main>
      <h1>Vite SPA Shell</h1>
      <p>This static shell represents a Vite single-page application where client routes use the same generated HTML entry point.</p>
      <nav aria-label="Primary">
        <a href="/">Home</a>
        <a href="/pricing/">Pricing</a>
        <a href="/docs/">Docs</a>
      </nav>
    </main>
  </body>
</html>
```

Create `examples/fixture-repos/vite-spa/routes.txt`:

```text
# route generated-html
/ index.html
/pricing/ index.html
/docs/ index.html
```

Create `examples/fixture-repos/vite-spa/build.mjs`:

```js
import fs from "node:fs";
import path from "node:path";

const root = new URL(".", import.meta.url).pathname;
const src = path.join(root, "src");
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.copyFileSync(path.join(src, "index.html"), path.join(dist, "index.html"));
fs.writeFileSync(path.join(dist, "robots.txt"), "User-agent: *\nAllow: /\n");
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    "  <url><loc>https://example.com/</loc></url>",
    "  <url><loc>https://example.com/pricing/</loc></url>",
    "  <url><loc>https://example.com/docs/</loc></url>",
    "</urlset>",
    "",
  ].join("\n"),
);
```

- [ ] **Step 4: Implement two-column route-list mapping**

In `packages/cli/src/repo-audit.mjs`, replace the existing `htmlPathForRoute`, `routeForStaticFile`, `routeForEntry`, and `readRouteListRoutes` block with this implementation:

```js
const htmlPathForRoute = (staticDir, route) => {
  const cleanRoute = route.trim();
  if (!cleanRoute || cleanRoute.startsWith("#")) return null;
  if (path.isAbsolute(cleanRoute) && fs.existsSync(cleanRoute) && fs.statSync(cleanRoute).isFile()) return cleanRoute;
  const normalized = cleanRoute.startsWith("/") ? cleanRoute.slice(1) : cleanRoute;
  if (!normalized || normalized.endsWith("/")) return path.join(staticDir, normalized, "index.html");
  if (normalized.endsWith(".html")) return path.join(staticDir, normalized);
  if (path.extname(normalized)) return path.join(staticDir, normalized);
  return path.join(staticDir, normalized, "index.html");
};

const isPathInside = (baseDir, targetPath) => {
  const relative = path.relative(baseDir, targetPath);
  return relative === "" || (relative && !relative.startsWith("..") && !path.isAbsolute(relative));
};

const routeForStaticFile = (staticDir, filePath) => {
  if (!isPathInside(staticDir, filePath)) return null;
  const relative = path.relative(staticDir, filePath);
  if (!relative) return null;

  const parsed = path.parse(relative);
  const routePath = relative.split(path.sep).join("/");
  if (routePath === "index.html") return "/";
  if (parsed.base === "index.html") return `/${parsed.dir.split(path.sep).join("/")}/`;
  return `/${routePath}`;
};

const routeForMappedEntry = (routeEntry) => {
  const clean = routeEntry.trim();
  if (!clean || clean.startsWith("#")) return null;
  return clean.startsWith("/") ? clean : `/${clean}`;
};

const routeForEntry = (entry, staticDir, filePath) => {
  const clean = entry.trim();
  if (!clean || clean.startsWith("#")) return null;
  if (path.isAbsolute(clean)) return routeForStaticFile(staticDir, filePath);
  return clean.startsWith("/") ? clean : `/${clean}`;
};

const parseRouteListEntry = (line) => {
  const clean = line.trim();
  const [routeEntry, htmlEntry, ...extra] = clean.split(/\s+/);
  if (routeEntry && htmlEntry && extra.length === 0) {
    return { raw: clean, routeEntry, htmlEntry, mapped: true };
  }
  return { raw: clean, routeEntry: clean, htmlEntry: clean, mapped: false };
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

  const entries = fs
    .readFileSync(routeListPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("#"));
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
    const parsed = parseRouteListEntry(entry);
    const filePath = htmlPathForRoute(staticDir, parsed.htmlEntry);
    const route = parsed.mapped ? routeForMappedEntry(parsed.routeEntry) : filePath ? routeForEntry(parsed.routeEntry, staticDir, filePath) : null;
    if (filePath && !isPathInside(staticDir, filePath)) {
      sourceFindings.push(
        sourceFinding({
          id: "repo.route_list_entry_outside_static_dir",
          message: "Route list entry resolves outside the configured static output directory.",
          evidence: parsed.raw,
          recommendation: "Use routes or HTML files generated under the configured static output directory.",
        }),
      );
      continue;
    }
    if (!filePath || !fs.existsSync(filePath)) {
      sourceFindings.push(
        sourceFinding({
          id: "repo.route_list_entry_missing",
          message: "Route list entry does not resolve to a generated HTML file.",
          evidence: parsed.raw,
          recommendation: "Build the route or remove it from the route list.",
        }),
      );
      continue;
    }
    if (!route) {
      sourceFindings.push(
        sourceFinding({
          id: "repo.route_list_entry_outside_static_dir",
          message: "Route list entry resolves outside the configured static output directory.",
          evidence: parsed.raw,
          recommendation: "Use routes or HTML files generated under the configured static output directory.",
        }),
      );
      continue;
    }
    if (!filePath.endsWith(".html")) {
      sourceFindings.push(
        sourceFinding({
          id: "repo.route_list_entry_not_html",
          message: "Route list entry does not resolve to an HTML file.",
          evidence: parsed.raw,
          recommendation: "Route-list entries must point to generated HTML pages.",
        }),
      );
      continue;
    }
    routes.push({ type: parsed.mapped ? "route_list_mapped" : "route_list", route, path: filePath });
  }

  return { routes, sourceFindings };
};
```

- [ ] **Step 5: Run focused repo audit tests**

Run:

```bash
node --test packages/cli/test/repo-audit.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit Task 1**

Run:

```bash
git add examples/fixture-repos/vite-spa packages/cli/src/repo-audit.mjs packages/cli/test/repo-audit.test.mjs
git commit -m "feat: support mapped route lists for SPA repo audits"
```

---

### Task 2: Add Source-Finding Developer Guidance

**Files:**
- Modify: `packages/cli/src/repo-findings.mjs`
- Create: `packages/cli/test/repo-findings.test.mjs`
- Modify: `packages/cli/test/audit-output-schema.test.mjs`

- [ ] **Step 1: Write failing source-finding guidance tests**

Create `packages/cli/test/repo-findings.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { guidanceForSourceFinding, sourceFinding } from "../src/repo-findings.mjs";

const supportedIds = [
  "repo.build_failed",
  "repo.build_timeout",
  "repo.build_unavailable",
  "repo.static_dir_missing",
  "repo.static_routes_missing",
  "repo.route_list_missing",
  "repo.route_list_empty",
  "repo.route_list_entry_missing",
  "repo.route_list_entry_not_html",
  "repo.route_list_entry_outside_static_dir",
  "repo.preview_unreachable",
  "repo.robots_missing",
  "repo.sitemap_missing",
  "repo.manifest_route_missing",
  "repo.audit_path_missing",
];

test("repo source finding guidance exists for supported finding IDs", () => {
  for (const id of supportedIds) {
    const guidance = guidanceForSourceFinding(id);
    assert.ok(guidance.inspectNext.length > 0, `${id} should include inspect-next targets`);
    assert.ok(guidance.developerAction, `${id} should include a developer action`);
    assert.ok(guidance.acceptanceCriteria.length > 0, `${id} should include acceptance criteria`);
  }
});

test("sourceFinding attaches additive developer guidance by default", () => {
  const finding = sourceFinding({
    id: "repo.static_dir_missing",
    message: "Configured static output directory does not exist or is not a directory.",
    evidence: "dist",
    recommendation: "Run the repository build or pass an existing static output directory.",
  });

  assert.equal(finding.id, "repo.static_dir_missing");
  assert.deepEqual(finding.inspectNext, ["configured static output directory", "build command", "audit.config.json"]);
  assert.match(finding.developerAction, /Run the explicit build command/);
  assert.ok(finding.acceptanceCriteria.some((item) => item.includes("repo.static_dir_missing")));
});

test("sourceFinding allows call sites to override developer guidance", () => {
  const finding = sourceFinding({
    id: "repo.audit_path_missing",
    message: "Repository audit needs an audit path.",
    evidence: "/repo",
    recommendation: "Pass a static directory or preview server.",
    inspectNext: ["custom file"],
    developerAction: "Choose the custom audit path.",
    acceptanceCriteria: ["The custom audit path is used."],
  });

  assert.deepEqual(finding.inspectNext, ["custom file"]);
  assert.equal(finding.developerAction, "Choose the custom audit path.");
  assert.deepEqual(finding.acceptanceCriteria, ["The custom audit path is used."]);
});
```

Add this test to `packages/cli/test/audit-output-schema.test.mjs` after `"accepts optional repo evidence section"`:

```js
test("accepts optional repo source finding guidance fields", () => {
  const audit = {
    schemaVersion: "1.0.0",
    toolVersion: "0.3.0",
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
      detectedFramework: "vite",
      sourceFindings: [
        {
          id: "repo.static_dir_missing",
          severity: "P1",
          message: "Configured static output directory does not exist or is not a directory.",
          evidence: "dist",
          recommendation: "Run the repository build or pass an existing static output directory.",
          confidence: "high",
          inspectNext: ["configured static output directory", "build command", "audit.config.json"],
          developerAction: "Run the explicit build command and confirm the configured static directory exists.",
          acceptanceCriteria: ["Rerun RankForge and confirm repo.static_dir_missing is absent."],
        },
      ],
    },
  };

  assert.deepEqual(validateAuditOutput(audit), { ok: true, errors: [] });
});
```

- [ ] **Step 2: Run focused tests and verify they fail**

Run:

```bash
node --test packages/cli/test/repo-findings.test.mjs packages/cli/test/audit-output-schema.test.mjs
```

Expected: FAIL because `guidanceForSourceFinding` is not exported and guidance fields are not attached.

- [ ] **Step 3: Replace `repo-findings.mjs` with guided source findings**

Replace the full contents of `packages/cli/src/repo-findings.mjs` with:

```js
const guidanceById = {
  "repo.build_failed": {
    inspectNext: ["package.json build script", "build stderr", "build stdout"],
    developerAction: "Run the explicit build command locally, fix the failing build output, and rerun RankForge.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.build_failed is absent."],
  },
  "repo.build_timeout": {
    inspectNext: ["package.json build script", "build timeout setting", "build stdout"],
    developerAction: "Confirm the build can complete locally or increase repo.maxBuildMs for a trusted repository.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.build_timeout is absent."],
  },
  "repo.build_unavailable": {
    inspectNext: ["security.mode", "prebuilt static output", "audit.config.json"],
    developerAction: "Use local security mode for trusted builds or audit an already-built static directory.",
    acceptanceCriteria: ["Rerun RankForge with allowed evidence collection and confirm repo.build_unavailable is absent."],
  },
  "repo.static_dir_missing": {
    inspectNext: ["configured static output directory", "build command", "audit.config.json"],
    developerAction: "Run the explicit build command and confirm the configured static output directory exists.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.static_dir_missing is absent."],
  },
  "repo.static_routes_missing": {
    inspectNext: ["configured static output directory", "generated index.html", "build output"],
    developerAction: "Generate at least one HTML route in the configured static output directory before auditing.",
    acceptanceCriteria: ["Rerun RankForge and confirm at least one repository route source is recorded."],
  },
  "repo.route_list_missing": {
    inspectNext: ["route-list file path", "audit.config.json", "CLI --route-list value"],
    developerAction: "Create the configured route-list file or remove the route-list option.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.route_list_missing is absent."],
  },
  "repo.route_list_empty": {
    inspectNext: ["route-list file"],
    developerAction: "Add at least one route entry to the configured route-list file.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.route_list_empty is absent."],
  },
  "repo.route_list_entry_missing": {
    inspectNext: ["route-list entry", "generated HTML output", "build output"],
    developerAction: "Generate the mapped HTML file or remove the missing route-list entry.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.route_list_entry_missing is absent."],
  },
  "repo.route_list_entry_not_html": {
    inspectNext: ["route-list entry", "generated output file extension"],
    developerAction: "Point the route-list entry to generated HTML evidence.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.route_list_entry_not_html is absent."],
  },
  "repo.route_list_entry_outside_static_dir": {
    inspectNext: ["route-list entry", "configured static output directory"],
    developerAction: "Keep mapped route-list HTML files inside the configured static output directory.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.route_list_entry_outside_static_dir is absent."],
  },
  "repo.preview_unreachable": {
    inspectNext: ["preview command", "preview URL", "preview stderr"],
    developerAction: "Start the preview command locally and verify the configured preview URL responds.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.preview_unreachable is absent."],
  },
  "repo.robots_missing": {
    inspectNext: ["generated robots.txt", "static output directory", "framework metadata config"],
    developerAction: "Generate robots.txt in static output when the deployed site should expose crawler directives.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.robots_missing is absent or intentionally accepted."],
  },
  "repo.sitemap_missing": {
    inspectNext: ["generated sitemap.xml", "static output directory", "framework sitemap config"],
    developerAction: "Generate sitemap.xml in static output so important URLs can be discovered consistently.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.sitemap_missing is absent or intentionally accepted."],
  },
  "repo.manifest_route_missing": {
    inspectNext: ["framework route manifest", "generated static output", "route-list file"],
    developerAction: "Regenerate static output or update the route list so framework-declared routes have generated HTML evidence.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.manifest_route_missing is absent."],
  },
  "repo.audit_path_missing": {
    inspectNext: ["static output directory", "preview command", "preview URL", "audit.config.json"],
    developerAction: "Pass a static output directory or an explicit preview command and URL.",
    acceptanceCriteria: ["Rerun RankForge and confirm page evidence is collected."],
  },
};

const normalizeList = (value) => (Array.isArray(value) ? value.filter(Boolean).map(String) : []);

export const guidanceForSourceFinding = (id) => {
  const guidance = guidanceById[id] || {};
  return {
    inspectNext: normalizeList(guidance.inspectNext),
    developerAction: guidance.developerAction || null,
    acceptanceCriteria: normalizeList(guidance.acceptanceCriteria),
  };
};

export const sourceFinding = ({
  id,
  severity = "P1",
  message,
  evidence,
  recommendation,
  confidence = "high",
  details,
  inspectNext,
  developerAction,
  acceptanceCriteria,
}) => {
  const guidance = guidanceForSourceFinding(id);
  const nextInspectNext = normalizeList(inspectNext ?? guidance.inspectNext);
  const nextDeveloperAction = developerAction ?? guidance.developerAction;
  const nextAcceptanceCriteria = normalizeList(acceptanceCriteria ?? guidance.acceptanceCriteria);

  return {
    id,
    severity,
    message,
    evidence,
    recommendation,
    confidence,
    ...(details ? { details } : {}),
    ...(nextInspectNext.length ? { inspectNext: nextInspectNext } : {}),
    ...(nextDeveloperAction ? { developerAction: nextDeveloperAction } : {}),
    ...(nextAcceptanceCriteria.length ? { acceptanceCriteria: nextAcceptanceCriteria } : {}),
  };
};
```

- [ ] **Step 4: Run focused guidance/schema tests**

Run:

```bash
node --test packages/cli/test/repo-findings.test.mjs packages/cli/test/audit-output-schema.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Run repo audit tests to catch guidance side effects**

Run:

```bash
node --test packages/cli/test/repo-audit.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit Task 2**

Run:

```bash
git add packages/cli/src/repo-findings.mjs packages/cli/test/repo-findings.test.mjs packages/cli/test/audit-output-schema.test.mjs
git commit -m "feat: add repo source finding guidance"
```

---

### Task 3: Surface Repo Guidance In Markdown And HTML Reports

**Files:**
- Modify: `packages/cli/src/report.mjs`
- Modify: `packages/cli/test/report.test.mjs`
- Modify: `examples/golden/repo-framework-report.md`

- [ ] **Step 1: Write failing report assertions**

In `packages/cli/test/report.test.mjs`, update the `"includes repository evidence when audit repo evidence exists"` source finding fixture to include guidance fields:

```js
          inspectNext: ["dist", "build command", "audit.config.json"],
          developerAction: "Run the explicit build command and confirm the configured static output directory exists.",
          acceptanceCriteria: ["Rerun RankForge and confirm repo.static_dir_missing is absent."],
```

In that same test, add these assertions:

```js
  assert.match(markdown, /Repo audit mode: static output/);
  assert.match(markdown, /\| Severity \| Source Finding \| Message \| Evidence \| Inspect Next \| Next Action \| Acceptance Check \|/);
  assert.match(markdown, /dist; build command; audit\.config\.json/);
  assert.match(markdown, /Run the explicit build command and confirm the configured static output directory exists\./);
  assert.match(markdown, /Rerun RankForge and confirm repo\.static_dir_missing is absent\./);
```

In `"keeps repository source findings separate from page findings"`, replace the old source-finding header assertion with:

```js
  assert.match(markdown, /\| Severity \| Source Finding \| Message \| Evidence \| Inspect Next \| Next Action \| Acceptance Check \|/);
```

Add this test after `"keeps repository source findings separate from page findings"`:

```js
test("renders repository source finding guidance in escaped HTML reports", () => {
  const html = generateHtmlReport({
    run: { target: "repo", mode: "repo" },
    findings: [],
    scores: {},
    integrations: {},
    evidenceGaps: [],
    sources: [],
    repo: {
      path: "/repo",
      detectedFramework: "vite",
      packageManager: "npm",
      staticDirRelative: "dist",
      routeList: "/repo/routes.txt",
      routeSources: [{ type: "route_list_mapped", route: "/pricing/", path: "/repo/dist/index.html" }],
      frameworkManifests: [],
      sourceFindings: [
        {
          id: "repo.route_list_entry_missing",
          severity: "P1",
          message: "Route list entry does not resolve to a generated HTML file.",
          evidence: "/bad/ <unsafe>",
          recommendation: "Build the route or remove it from the route list.",
          confidence: "high",
          inspectNext: ["route-list entry", "generated HTML output"],
          developerAction: "Generate the mapped HTML file or remove the missing route-list entry.",
          acceptanceCriteria: ["Rerun RankForge and confirm repo.route_list_entry_missing is absent."],
        },
      ],
    },
  });

  assert.match(html, /Repo audit mode/);
  assert.match(html, /route-list static output/);
  assert.match(html, /Inspect Next/);
  assert.match(html, /route-list entry; generated HTML output/);
  assert.match(html, /Generate the mapped HTML file or remove the missing route-list entry\./);
  assert.match(html, /\/bad\/ &lt;unsafe&gt;/);
  assert.doesNotMatch(html, /\/bad\/ <unsafe>/);
});
```

- [ ] **Step 2: Run report tests and verify they fail**

Run:

```bash
node --test packages/cli/test/report.test.mjs
```

Expected: FAIL because report output does not render repo audit mode or source-finding guidance columns.

- [ ] **Step 3: Add report helper functions**

In `packages/cli/src/report.mjs`, add these helpers after `buildResult`:

```js
const repoAuditMode = (repo) => {
  if (!repo) return "n/a";
  if (repo.previewUrl) return "preview server";
  if (repo.routeList) return "route-list static output";
  if (repo.staticDir || repo.staticDirRelative) return "static output";
  return "no usable audit path";
};

const sourceFindingInspectNext = (finding) => formatList(finding.inspectNext || []);

const sourceFindingAction = (finding) => normalizeInline(finding.developerAction ?? finding.recommendation);

const sourceFindingAcceptance = (finding) => formatList(finding.acceptanceCriteria || []);

const htmlSourceFindingInspectNext = (finding) => htmlListText(finding.inspectNext || []);

const htmlSourceFindingAction = (finding) => escapeHtml(finding.developerAction ?? finding.recommendation);

const htmlSourceFindingAcceptance = (finding) => htmlListText(finding.acceptanceCriteria || []);
```

- [ ] **Step 4: Add repo audit mode to Markdown repository facts**

In `appendRepositoryEvidence`, after:

```js
  lines.push(`- Package manager: ${escapeInline(repo.packageManager)}`);
```

add:

```js
  lines.push(`- Repo audit mode: ${escapeInline(repoAuditMode(repo))}`);
```

- [ ] **Step 5: Update Markdown source-finding table columns**

In `appendRepositoryEvidence`, replace:

```js
  lines.push("", "### Repository Source Findings", "");
  lines.push("| Severity | Source Finding | Message | Evidence | Recommendation |");
  lines.push("|---|---|---|---|---|");
  for (const finding of sourceFindings) {
    lines.push(
      `| ${escapeCell(finding.severity)} | ${escapeCell(finding.id)} | ${escapeCell(finding.message)} | ${escapeCell(finding.evidence)} | ${escapeCell(finding.recommendation)} |`,
    );
  }
```

with:

```js
  lines.push("", "### Repository Source Findings", "");
  lines.push("| Severity | Source Finding | Message | Evidence | Inspect Next | Next Action | Acceptance Check |");
  lines.push("|---|---|---|---|---|---|---|");
  for (const finding of sourceFindings) {
    lines.push(
      `| ${escapeCell(finding.severity)} | ${escapeCell(finding.id)} | ${escapeCell(finding.message)} | ${escapeCell(finding.evidence)} | ${sourceFindingInspectNext(finding)} | ${escapeCell(sourceFindingAction(finding))} | ${sourceFindingAcceptance(finding)} |`,
    );
  }
```

- [ ] **Step 6: Add repo audit mode to HTML facts**

In `htmlRepositoryEvidence`, add this fact after `["Package manager", repo.packageManager],`:

```js
    ["Repo audit mode", repoAuditMode(repo)],
```

- [ ] **Step 7: Update HTML source-finding table columns**

In `htmlRepositoryEvidence`, replace the `sourceFindingRows` mapping with:

```js
  const sourceFindingRows = sourceFindings.map((finding) => [
    htmlSeverity(finding.severity),
    `<span class="rule-id">${escapeHtml(finding.id)}</span>`,
    escapeHtml(finding.message),
    escapeHtml(finding.evidence),
    htmlSourceFindingInspectNext(finding),
    htmlSourceFindingAction(finding),
    htmlSourceFindingAcceptance(finding),
  ]);
```

Then replace:

```js
${htmlTable(["Severity", "Source Finding", "Message", "Evidence", "Recommendation"], sourceFindingRows, "No repository source findings recorded.")}`,
```

with:

```js
${htmlTable(["Severity", "Source Finding", "Message", "Evidence", "Inspect Next", "Next Action", "Acceptance Check"], sourceFindingRows, "No repository source findings recorded.")}`,
```

- [ ] **Step 8: Run focused report tests**

Run:

```bash
node --test packages/cli/test/report.test.mjs
```

Expected: PASS.

- [ ] **Step 9: Regenerate repo framework Markdown golden**

Run this script from the repository root:

```bash
node --input-type=module <<'NODE'
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { runRepoAudit } from "./packages/cli/src/repo-audit.mjs";
import { generateMarkdownReport } from "./packages/cli/src/report.mjs";
import { normalizeMarkdownForGolden } from "./packages/cli/test/helpers/golden.mjs";

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-next-golden-"));
const repoPath = path.join(tempRoot, "next-basic");
fs.cpSync(path.resolve("examples/fixture-repos/next-basic"), repoPath, { recursive: true });

try {
  const audit = await runRepoAudit({
    repoPath,
    buildCommand: "npm run build",
    staticDir: "out",
    maxBuildMs: 5000,
  });
  const markdown = normalizeMarkdownForGolden(generateMarkdownReport(audit), repoPath);
  fs.writeFileSync("examples/golden/repo-framework-report.md", markdown);
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
NODE
```

- [ ] **Step 10: Run golden fixture tests**

Run:

```bash
node --test packages/cli/test/golden-fixtures.test.mjs
```

Expected: PASS.

- [ ] **Step 11: Commit Task 3**

Run:

```bash
git add packages/cli/src/report.mjs packages/cli/test/report.test.mjs examples/golden/repo-framework-report.md
git commit -m "feat: surface repo source finding guidance in reports"
```

---

### Task 4: Add Route-List Docs And GitHub Actions Artifact Example

**Files:**
- Create: `docs/repo-audit-route-lists.md`
- Create: `docs/examples/github-actions-rankforge-repo-audit.yml`
- Create: `packages/cli/test/docs-examples.test.mjs`
- Modify: `README.md`

- [ ] **Step 1: Write failing docs/example sanity tests**

Create `packages/cli/test/docs-examples.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("repo route-list docs describe static HTML and SPA mapped route workflows", () => {
  const docs = fs.readFileSync("docs/repo-audit-route-lists.md", "utf8");

  assert.match(docs, /# Repository Route Lists/);
  assert.match(docs, /\/pricing\/ index\.html/);
  assert.match(docs, /rankforge audit-repo \. --build-command "npm run build" --static-dir dist --route-list routes\.txt/);
  assert.match(docs, /single-page application/);
  assert.match(docs, /does not infer client router source files/);
});

test("GitHub Actions repo audit example uploads JSON Markdown and HTML artifacts", () => {
  const workflow = fs.readFileSync("docs/examples/github-actions-rankforge-repo-audit.yml", "utf8");

  assert.match(workflow, /name: RankForge Repo Audit/);
  assert.match(workflow, /actions\/checkout@v6/);
  assert.match(workflow, /actions\/setup-node@v6/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run build/);
  assert.match(workflow, /npx --yes rankforge audit-repo \. --static-dir dist --fail-on P1 --out rankforge-audit\.json --markdown rankforge-audit\.md --html rankforge-audit\.html/);
  assert.match(workflow, /actions\/upload-artifact@v6/);
  assert.match(workflow, /rankforge-audit\.json/);
  assert.match(workflow, /rankforge-audit\.md/);
  assert.match(workflow, /rankforge-audit\.html/);
  assert.match(workflow, /steps\.rankforge\.outcome == 'failure'/);
});
```

- [ ] **Step 2: Run docs/example tests and verify they fail**

Run:

```bash
node --test packages/cli/test/docs-examples.test.mjs
```

Expected: FAIL because the docs and example workflow files do not exist.

- [ ] **Step 3: Add route-list workflow docs**

Create `docs/repo-audit-route-lists.md`:

````markdown
# Repository Route Lists

RankForge uses route lists when a repository audit should inspect a declared set of generated routes instead of every HTML file discovered in static output.

Route lists are useful when:

- the build emits many generated HTML pages and CI should audit a smaller representative set
- a single-page application emits one static HTML shell but has several intended client routes
- a team wants the audited route inventory to be version-controlled

RankForge does not infer client router source files. For SPA and client-route coverage, the route list is the deterministic contract.

## Static HTML Routes

For multi-page static output, write one route per line:

```text
/
/about/
/contact.html
```

Run:

```bash
rankforge audit-repo . --build-command "npm run build" --static-dir dist --route-list routes.txt --out rankforge-audit.json --markdown rankforge-audit.md --html rankforge-audit.html
```

Each entry resolves to generated HTML under the static output directory:

- `/` resolves to `dist/index.html`
- `/about/` resolves to `dist/about/index.html`
- `/contact.html` resolves to `dist/contact.html`

## SPA Mapped Routes

For a single-page application, map each intended route to the generated HTML shell:

```text
# route generated-html
/ index.html
/pricing/ index.html
/docs/ index.html
```

Run:

```bash
rankforge audit-repo . --build-command "npm run build" --static-dir dist --route-list routes.txt --out rankforge-audit.json --markdown rankforge-audit.md --html rankforge-audit.html
```

This tells RankForge that `/pricing/` and `/docs/` are intentional client routes while the deterministic HTML evidence comes from `dist/index.html`.

Mapped generated HTML paths must stay inside the configured static output directory. RankForge reports repository source findings for missing files, non-HTML files, and mapped paths outside the static output directory.

## Config File Example

```json
{
  "target": "https://example.com",
  "crawl": {
    "mode": "single",
    "maxPages": 10
  },
  "repo": {
    "buildCommand": "npm run build",
    "staticDir": "dist",
    "routeList": "routes.txt"
  }
}
```

Run:

```bash
rankforge audit-repo . --config audit.config.json --fail-on P1 --out rankforge-audit.json --markdown rankforge-audit.md --html rankforge-audit.html
```

CLI flags override config values.

## Preview Server Alternative

If important route evidence only exists after a local server handles history fallback, audit an explicit preview server instead:

```bash
rankforge audit-repo . --preview-command "npm run preview -- --host 127.0.0.1" --preview-url http://127.0.0.1:4173 --max-pages 25 --out rankforge-audit.json --markdown rankforge-audit.md --html rankforge-audit.html
```

Build and preview commands are never inferred or installed by RankForge. They run only when explicitly supplied.
````

- [ ] **Step 4: Add the docs-only GitHub Actions example**

Create directory `docs/examples` if it does not exist.

Create `docs/examples/github-actions-rankforge-repo-audit.yml`:

```yaml
name: RankForge Repo Audit

on:
  pull_request:
  workflow_dispatch:

jobs:
  rankforge:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - name: Run RankForge repo audit
        id: rankforge
        continue-on-error: true
        run: npx --yes rankforge audit-repo . --static-dir dist --fail-on P1 --out rankforge-audit.json --markdown rankforge-audit.md --html rankforge-audit.html
      - name: Upload RankForge reports
        if: always()
        uses: actions/upload-artifact@v6
        with:
          name: rankforge-audit
          path: |
            rankforge-audit.json
            rankforge-audit.md
            rankforge-audit.html
          if-no-files-found: error
      - name: Fail if RankForge threshold failed
        if: steps.rankforge.outcome == 'failure'
        run: exit 1
```

- [ ] **Step 5: Add concise README links**

In `README.md`, after the CI-style failure threshold example in Getting Started, add:

````markdown
For Vite/SPAs or any repository where generated HTML does not directly list every client route, use a route list:

```bash
rankforge audit-repo ./site --build-command "npm run build" --static-dir dist --route-list routes.txt --out audit.json --markdown audit.md --html audit.html
```

See `docs/repo-audit-route-lists.md` for static route lists, SPA mapped routes, and the GitHub Actions artifact example.
````

- [ ] **Step 6: Run docs/example tests**

Run:

```bash
node --test packages/cli/test/docs-examples.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit Task 4**

Run:

```bash
git add README.md docs/repo-audit-route-lists.md docs/examples/github-actions-rankforge-repo-audit.yml packages/cli/test/docs-examples.test.mjs
git commit -m "docs: document repo route lists and CI artifacts"
```

---

### Task 5: Final Alignment, Validation, And Changelog

**Files:**
- Modify: `CHANGELOG.md`
- Modify: `docs/prd-deterministic-audit-cli.md`
- Modify: `docs/superpowers/specs/2026-05-22-track-2-developer-repo-audit-maturity-design.md`

- [ ] **Step 1: Update changelog**

Under `## Unreleased` in `CHANGELOG.md`, add:

```markdown
- Added explicit route-to-HTML route-list mappings for SPA repository audits, with deterministic Vite SPA fixture coverage.
- Added repo source-finding developer guidance, including inspect-next targets, next actions, and rerun acceptance checks.
- Improved Markdown and HTML repository evidence reports so source findings show the next artifact to inspect.
- Added route-list documentation and a copy-paste GitHub Actions example that uploads JSON, Markdown, and HTML RankForge reports.
```

- [ ] **Step 2: Update PRD published baseline and roadmap notes**

In `docs/prd-deterministic-audit-cli.md`, in the current baseline paragraph that starts with `As of the published rankforge@0.3.0 release`, add this sentence at the end of the paragraph:

```markdown
Post-release Track 2 adds clearer developer repo-audit maturity around Vite/SPAs, mapped route lists, source-finding remediation guidance, and CI artifact examples.
```

In the `Current remaining gaps:` list, replace:

```markdown
- The CLI can audit static output and explicit preview-server repositories with explicit build commands, route-list parity, and repo config files; remaining repo-audit work focuses on broader framework fixture coverage and deeper deterministic source-level findings.
```

with:

```markdown
- The CLI can audit static output and explicit preview-server repositories with explicit build commands, route-list parity, repo config files, mapped SPA route lists, and source-finding remediation guidance; remaining repo-audit work focuses on additional high-confidence framework signals and later CI output formats such as SARIF or JUnit.
```

- [ ] **Step 3: Mark the Track 2 spec as implemented**

In `docs/superpowers/specs/2026-05-22-track-2-developer-repo-audit-maturity-design.md`, change:

```markdown
Status: Draft design for user review before implementation planning
```

to:

```markdown
Status: Implemented after approved implementation planning
```

- [ ] **Step 4: Run focused tests**

Run:

```bash
node --test packages/cli/test/repo-audit.test.mjs packages/cli/test/repo-findings.test.mjs packages/cli/test/report.test.mjs packages/cli/test/docs-examples.test.mjs packages/cli/test/golden-fixtures.test.mjs packages/cli/test/audit-output-schema.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Run full validation**

Run:

```bash
npm test
npm run validate
git diff --check
```

Expected: all commands PASS.

- [ ] **Step 6: Inspect changed files**

Run:

```bash
git status --short
git diff --stat
```

Expected: only Track 2 files are changed. There should be no untracked files outside:

- `examples/fixture-repos/vite-spa/`
- `packages/cli/src/`
- `packages/cli/test/`
- `examples/golden/`
- `docs/`
- `README.md`
- `CHANGELOG.md`

- [ ] **Step 7: Commit final alignment**

Run:

```bash
git add CHANGELOG.md docs/prd-deterministic-audit-cli.md docs/superpowers/specs/2026-05-22-track-2-developer-repo-audit-maturity-design.md
git commit -m "docs: record track 2 repo audit maturity"
```

---

## Final Verification Before Completion

- [ ] Run:

```bash
npm test
npm run validate
git status --short --branch
```

- [ ] Expected:

```text
npm test exits 0
npm run validate exits 0
git status shows the branch ahead with no uncommitted changes
```

- [ ] Summarize:

```text
Track 2 complete: SPA route-list mapping, source-finding guidance, report guidance, route-list docs, CI artifact example, changelog/PRD alignment, and full validation.
```
