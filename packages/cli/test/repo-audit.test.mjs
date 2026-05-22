import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { once } from "node:events";
import { runRepoAudit } from "../src/repo-audit.mjs";
import { waitForHttp } from "../src/repo-process.mjs";

const fixture = (name) => path.resolve("examples/fixture-repos", name);

const copyFixtureRepo = (name) => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), `rankforge-${name}-`));
  const repoPath = path.join(tempRoot, name);
  fs.cpSync(fixture(name), repoPath, { recursive: true });
  return { repoPath, tempRoot };
};

const freePort = async () => {
  const server = net.createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address();
  server.close();
  await once(server, "close");
  return port;
};

const repoStaticSummary = (audit) => ({
  repo: {
    detectedFramework: audit.repo.detectedFramework,
    packageManager: audit.repo.packageManager,
    staticDirRelative: audit.repo.staticDirRelative,
    routeSources: audit.repo.routeSources.map(({ type, route }) => ({ type, route })),
  },
  pageCount: audit.pages.length,
  pageTitles: audit.pages.map((page) => page.evidence.title),
  sourceFindingIds: audit.repo.sourceFindings.map((finding) => finding.id),
  evidenceGapIds: audit.evidenceGaps.map((gap) => gap.id),
});

test("static output audit records repo evidence and audits discovered routes", async () => {
  const audit = await runRepoAudit({
    repoPath: fixture("static-basic"),
    staticDir: path.join(fixture("static-basic"), "dist"),
  });

  assert.equal(audit.repo.detectedFramework, "generic-static");
  assert.equal(audit.repo.staticDirRelative, "dist");
  assert.equal(audit.pages.length, 2);
  assert.ok(audit.repo.routeSources.some((route) => route.route === "/about/"));
  assert.deepEqual(audit.repo.sourceFindings, []);
});

test("static output audit uses detected static dir when none is configured", async () => {
  const audit = await runRepoAudit({ repoPath: fixture("static-basic") });

  assert.equal(audit.repo.detectedFramework, "generic-static");
  assert.equal(audit.repo.staticDirRelative, "dist");
  assert.equal(audit.pages.length, 2);
  assert.ok(audit.repo.routeSources.some((route) => route.route === "/about/"));
  assert.deepEqual(audit.repo.sourceFindings, []);
});

test("explicit preview audit takes precedence over detected static output", async () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-repo-preview-precedence-"));
  fs.mkdirSync(path.join(repoPath, "dist"), { recursive: true });
  fs.mkdirSync(path.join(repoPath, "site"), { recursive: true });
  fs.writeFileSync(
    path.join(repoPath, "dist", "index.html"),
    "<title>Static Output</title><meta name='description' content='Static'><h1>Static Output</h1><p>Static output content.</p>",
  );
  fs.writeFileSync(
    path.join(repoPath, "site", "index.html"),
    "<title>Preview Server</title><meta name='description' content='Preview'><h1>Preview Server</h1><p>Preview server content.</p>",
  );
  fs.copyFileSync(path.join(fixture("npm-preview"), "server.mjs"), path.join(repoPath, "server.mjs"));
  const port = await freePort();
  const previewUrl = `http://127.0.0.1:${port}`;

  const audit = await runRepoAudit({
    repoPath,
    buildCommand: "node -e \"console.log('built preview')\"",
    staticDir: "dist",
    previewCommand: `node server.mjs ${port}`,
    previewUrl,
  });

  assert.equal(audit.repo.previewUrl, previewUrl);
  assert.equal(audit.repo.build.executed, true);
  assert.equal(audit.repo.build.exitCode, 0);
  assert.equal(audit.pages[0].evidence.title, "Preview Server");
  await assert.rejects(() => waitForHttp(previewUrl, { timeoutMs: 250 }), /Preview server did not become reachable/);
});

test("explicit preview audit starts and stops fixture server", async () => {
  const port = await freePort();
  const previewUrl = `http://127.0.0.1:${port}`;

  const audit = await runRepoAudit({
    repoPath: fixture("npm-preview"),
    previewCommand: `node server.mjs ${port}`,
    previewUrl,
  });

  assert.equal(audit.pages.length, 2);
  assert.equal(audit.repo.previewCommand, `node server.mjs ${port}`);
  assert.equal(audit.repo.previewUrl, previewUrl);
  await assert.rejects(() => waitForHttp(previewUrl, { timeoutMs: 250 }), /Preview server did not become reachable/);
});

test("explicit preview audit preserves full crawl mode with partial crawl options", async () => {
  const port = await freePort();
  const previewUrl = `http://127.0.0.1:${port}`;

  const audit = await runRepoAudit({
    repoPath: fixture("npm-preview"),
    previewCommand: `node server.mjs ${port}`,
    previewUrl,
    crawl: { maxPages: 2 },
  });

  assert.equal(audit.run.mode, "full");
  assert.equal(audit.run.crawl.maxPages, 2);
});

test("explicit preview audit honors top-level maxPages when crawl maxPages is absent", async () => {
  const port = await freePort();
  const previewUrl = `http://127.0.0.1:${port}`;

  const audit = await runRepoAudit({
    repoPath: fixture("npm-preview"),
    previewCommand: `node server.mjs ${port}`,
    previewUrl,
    maxPages: 7,
  });

  assert.equal(audit.run.mode, "full");
  assert.equal(audit.run.crawl.maxPages, 7);
});

test("missing explicit static dir returns repo source finding", async () => {
  const audit = await runRepoAudit({
    repoPath: fixture("static-basic"),
    staticDir: path.join(fixture("static-basic"), "missing"),
  });

  assert.equal(audit.pages.length, 0);
  assert.equal(audit.repo.sourceFindings[0].id, "repo.static_dir_missing");
});

test("static dir with no HTML routes returns repo source finding", async () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-repo-audit-"));
  const staticDir = path.join(repoPath, "dist");
  fs.mkdirSync(staticDir, { recursive: true });
  fs.writeFileSync(path.join(staticDir, "robots.txt"), "User-agent: *\nAllow: /\n");

  const audit = await runRepoAudit({ repoPath, staticDir });

  assert.equal(audit.pages.length, 0);
  assert.equal(audit.repo.sourceFindings[0].id, "repo.static_routes_missing");
});

test("preview startup failure returns repo source finding", async () => {
  const port = await freePort();
  const previewUrl = `http://127.0.0.1:${port}`;

  const audit = await runRepoAudit({
    repoPath: fixture("npm-preview"),
    previewCommand: "node -e \"setTimeout(() => {}, 5000)\"",
    previewUrl,
    maxPreviewMs: 250,
  });

  assert.equal(audit.pages.length, 0);
  assert.equal(audit.repo.previewUrl, previewUrl);
  assert.equal(audit.repo.sourceFindings[0].id, "repo.preview_unreachable");
});

test("missing audit path on npm preview repo returns repo source finding", async () => {
  const audit = await runRepoAudit({ repoPath: fixture("npm-preview") });

  assert.equal(audit.pages.length, 0);
  assert.equal(audit.repo.sourceFindings[0].id, "repo.audit_path_missing");
});

test("static repo golden summary matches fixture", async () => {
  const audit = await runRepoAudit({
    repoPath: fixture("static-basic"),
    staticDir: path.join(fixture("static-basic"), "dist"),
  });
  const expected = JSON.parse(fs.readFileSync("examples/golden/repo-static-summary.json", "utf8"));

  assert.deepEqual(repoStaticSummary(audit), expected);
});

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

test("Next.js static build audit records framework manifest evidence and route parity findings", async () => {
  const { repoPath, tempRoot } = copyFixtureRepo("next-basic");

  try {
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
        routes: ["/", "/about/", "/missing/"],
      },
    ]);
    assert.ok(audit.repo.sourceFindings.some((finding) => finding.id === "repo.manifest_route_missing"));
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("Astro static build audit records framework detection without fixture-only manifest evidence", async () => {
  const { repoPath, tempRoot } = copyFixtureRepo("astro-basic");

  try {
    const audit = await runRepoAudit({
      repoPath,
      buildCommand: "npm run build",
      staticDir: "dist",
      maxBuildMs: 5000,
    });

    assert.equal(audit.repo.detectedFramework, "astro");
    assert.equal(audit.repo.staticDirRelative, "dist");
    assert.equal(audit.pages.length, 2);
    assert.deepEqual(audit.repo.frameworkManifests, []);
    assert.ok(!audit.repo.sourceFindings.some((finding) => finding.id === "repo.manifest_route_missing"));
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
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

test("repo audit normalizes absolute route-list entries under static dir", async () => {
  const repoPath = fixture("vite-basic");
  const routeList = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-routes-")), "routes.txt");
  fs.rmSync(path.join(repoPath, "dist"), { recursive: true, force: true });
  fs.writeFileSync(
    routeList,
    [
      path.join(repoPath, "dist", "index.html"),
      path.join(repoPath, "dist", "about", "index.html"),
    ].join("\n"),
  );

  const audit = await runRepoAudit({
    repoPath,
    buildCommand: "npm run build",
    staticDir: "dist",
    routeList,
  });

  assert.deepEqual(
    audit.repo.routeSources.map((route) => route.route),
    ["/", "/about/"],
  );
  assert.equal(audit.pages.length, 2);
});

test("repo audit rejects absolute route-list entries outside static dir without exposing machine paths as routes", async () => {
  const repoPath = fixture("vite-basic");
  const routeListDir = fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-routes-"));
  const externalPath = path.join(routeListDir, "external.html");
  const routeList = path.join(routeListDir, "routes.txt");
  fs.writeFileSync(externalPath, "<title>External</title><h1>External</h1>");
  fs.writeFileSync(routeList, `${externalPath}\n`);

  const audit = await runRepoAudit({
    repoPath,
    buildCommand: "npm run build",
    staticDir: "dist",
    routeList,
  });

  assert.equal(audit.pages.length, 0);
  assert.equal(audit.repo.sourceFindings[0].id, "repo.route_list_entry_outside_static_dir");
  assert.ok(!audit.repo.routeSources.some((source) => source.route === externalPath));
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

test("repo audit reports missing route-list files before full static route traversal", async () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-missing-route-list-"));
  const staticDir = path.join(repoPath, "site-output");
  const blockedDir = path.join(staticDir, "blocked");
  fs.mkdirSync(blockedDir, { recursive: true });
  fs.writeFileSync(
    path.join(staticDir, "index.html"),
    "<title>Home</title><meta name='description' content='Home'><h1>Home</h1><p>Enough generated content.</p>",
  );
  fs.chmodSync(blockedDir, 0);

  try {
    const audit = await runRepoAudit({
      repoPath,
      staticDir,
      routeList: path.join(repoPath, "missing-routes.txt"),
    });

    assert.equal(audit.pages.length, 0);
    assert.equal(audit.repo.sourceFindings[0].id, "repo.route_list_missing");
  } finally {
    fs.chmodSync(blockedDir, 0o700);
    fs.rmSync(repoPath, { recursive: true, force: true });
  }
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

test("repo audit reports existing relative route-list entries with non-HTML extensions as not HTML", async () => {
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "rankforge-route-list-not-html-"));
  const staticDir = path.join(repoPath, "dist");
  const routeList = path.join(repoPath, "routes.txt");
  fs.mkdirSync(staticDir, { recursive: true });
  fs.writeFileSync(
    path.join(staticDir, "index.html"),
    "<title>Home</title><meta name='description' content='Home'><h1>Home</h1><p>Enough generated content.</p>",
  );
  fs.writeFileSync(path.join(staticDir, "feed.xml"), "<feed></feed>");
  fs.writeFileSync(routeList, "feed.xml\n");

  const audit = await runRepoAudit({ repoPath, staticDir, routeList });

  assert.equal(audit.pages.length, 0);
  assert.equal(audit.repo.sourceFindings[0].id, "repo.route_list_entry_not_html");
});

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
