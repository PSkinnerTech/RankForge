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
  const repoPath = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-repo-audit-"));
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
