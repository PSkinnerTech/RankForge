import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { discoverStaticRoutes } from "../src/repo-routes.mjs";

test("discovers static HTML files in deterministic order", () => {
  const root = path.resolve("examples/fixture-repos/static-basic/dist");
  const routes = discoverStaticRoutes(root);

  assert.deepEqual(routes, [
    { type: "static_html", route: "/", path: path.join(root, "index.html") },
    { type: "static_html", route: "/about/", path: path.join(root, "about", "index.html") },
  ]);
  assert.ok(routes.every((route) => path.isAbsolute(route.path)));
});

test("rejects missing static directories", () => {
  assert.throws(
    () => discoverStaticRoutes(path.resolve("examples/fixture-repos/static-basic/missing")),
    /Static directory does not exist or is not a directory/,
  );
});

test("rejects static paths that are not directories", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-static-routes-"));
  const file = path.join(root, "index.html");
  fs.writeFileSync(file, "<h1>Home</h1>");

  assert.throws(() => discoverStaticRoutes(file), /Static directory does not exist or is not a directory/);
});

test("converts non-index HTML files to extension routes", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-static-routes-"));
  fs.writeFileSync(path.join(root, "about.html"), "<h1>About</h1>");

  assert.deepEqual(discoverStaticRoutes(root), [
    { type: "static_html", route: "/about.html", path: path.join(root, "about.html") },
  ]);
});
