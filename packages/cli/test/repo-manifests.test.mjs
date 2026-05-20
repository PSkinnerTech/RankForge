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
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-next-manifest-"));
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

test("does not treat Astro fixture-only metadata as a framework route manifest", () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-astro-unowned-manifest-"));
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

  assert.deepEqual(result.frameworkManifests, []);
  assert.deepEqual(result.sourceFindings, []);
});

test("matches extensionless manifest routes to generated html files", () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-extensionless-route-"));
  const staticDir = path.join(repoPath, "out");
  const manifestDir = path.join(repoPath, ".next");
  writeHtml(path.join(staticDir, "index.html"), "Home");
  writeHtml(path.join(staticDir, "about.html"), "About");
  fs.mkdirSync(manifestDir, { recursive: true });
  fs.writeFileSync(
    path.join(manifestDir, "prerender-manifest.json"),
    JSON.stringify({ routes: { "/": {}, "/about": {} } }),
  );

  const result = analyzeFrameworkRouteManifests({
    repoPath,
    staticDir,
    detectedFramework: "next",
    staticRoutes: [
      { type: "static_html", route: "/", path: path.join(staticDir, "index.html") },
      { type: "static_html", route: "/about.html", path: path.join(staticDir, "about.html") }
    ]
  });

  assert.deepEqual(result.frameworkManifests, [
    {
      type: "next_prerender_manifest",
      path: path.join(manifestDir, "prerender-manifest.json"),
      routes: ["/", "/about/"]
    }
  ]);
  assert.deepEqual(result.sourceFindings, []);
});

test("reports generated static routes that are not listed in a framework manifest", () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-unlisted-route-"));
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

test("ignores valid Next.js manifest files with unrecognized route schema", () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-next-unknown-schema-"));
  const staticDir = path.join(repoPath, "out");
  const manifestDir = path.join(repoPath, ".next");
  writeHtml(path.join(staticDir, "index.html"), "Home");
  writeHtml(path.join(staticDir, "extra", "index.html"), "Extra");
  fs.mkdirSync(manifestDir, { recursive: true });
  fs.writeFileSync(path.join(manifestDir, "prerender-manifest.json"), JSON.stringify({ notRoutes: {} }));

  const result = analyzeFrameworkRouteManifests({
    repoPath,
    staticDir,
    detectedFramework: "next",
    staticRoutes: [
      { type: "static_html", route: "/", path: path.join(staticDir, "index.html") },
      { type: "static_html", route: "/extra/", path: path.join(staticDir, "extra", "index.html") }
    ]
  });

  assert.deepEqual(result.frameworkManifests, []);
  assert.deepEqual(result.sourceFindings, []);
});

test("keeps manifest route file checks inside the static directory", () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-contained-manifest-route-"));
  const staticDir = path.join(repoPath, "out");
  const manifestDir = path.join(repoPath, ".next");
  writeHtml(path.join(repoPath, "outside", "index.html"), "Outside");
  fs.mkdirSync(manifestDir, { recursive: true });
  fs.writeFileSync(path.join(manifestDir, "prerender-manifest.json"), JSON.stringify({ routes: { "/../outside/": {} } }));

  const result = analyzeFrameworkRouteManifests({
    repoPath,
    staticDir,
    detectedFramework: "next",
    staticRoutes: []
  });

  assert.deepEqual(
    result.sourceFindings.map((finding) => finding.id),
    ["repo.manifest_route_missing"],
  );
  assert.equal(result.sourceFindings[0].evidence, "/../outside/");
  assert.ok(!JSON.stringify(result).includes(path.join(repoPath, "outside")));
});

test("checks manifest route presence against generated HTML files", () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-missing-file-route-"));
  const staticDir = path.join(repoPath, "out");
  const manifestDir = path.join(repoPath, ".next");
  writeHtml(path.join(staticDir, "index.html"), "Home");
  fs.mkdirSync(manifestDir, { recursive: true });
  fs.writeFileSync(
    path.join(manifestDir, "prerender-manifest.json"),
    JSON.stringify({ routes: { "/": {}, "/missing/": {} } }),
  );

  const result = analyzeFrameworkRouteManifests({
    repoPath,
    staticDir,
    detectedFramework: "next",
    staticRoutes: [
      { type: "static_html", route: "/", path: path.join(staticDir, "index.html") },
      { type: "static_html", route: "/missing/", path: path.join(staticDir, "missing", "index.html") }
    ]
  });

  assert.deepEqual(
    result.sourceFindings.map((finding) => finding.id),
    ["repo.manifest_route_missing"],
  );
  assert.equal(result.sourceFindings[0].evidence, "/missing/");
});

test("ignores absent framework manifests", () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-no-manifest-"));
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
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-bad-manifest-"));
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
