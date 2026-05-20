import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
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

test("returns absolute route source paths for relative repository paths", () => {
  const result = detectRepo("examples/fixture-repos/static-basic");

  assert.ok(result.routeSources.length > 0);
  assert.ok(result.routeSources.every((route) => path.isAbsolute(route.path)));
});

test("converts static HTML files to exact route source objects", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-repo-detect-"));
  const distDir = path.join(repoRoot, "dist");
  const aboutDir = path.join(distDir, "about");

  fs.mkdirSync(aboutDir, { recursive: true });
  fs.writeFileSync(path.join(distDir, "index.html"), "<h1>Home</h1>");
  fs.writeFileSync(path.join(aboutDir, "index.html"), "<h1>About</h1>");
  fs.writeFileSync(path.join(distDir, "contact.html"), "<h1>Contact</h1>");

  const result = detectRepo(repoRoot);

  assert.deepEqual(result.routeSources, [
    {
      type: "static_html",
      path: path.join(distDir, "index.html"),
      route: "/",
    },
    {
      type: "static_html",
      path: path.join(distDir, "about", "index.html"),
      route: "/about/",
    },
    {
      type: "static_html",
      path: path.join(distDir, "contact.html"),
      route: "/contact.html",
    },
  ]);
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
