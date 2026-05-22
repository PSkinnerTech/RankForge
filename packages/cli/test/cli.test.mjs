import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { runCli } from "../src/cli.mjs";
import { waitForHttp } from "../src/repo-process.mjs";

const capture = async (args) => {
  const writes = [];
  const errors = [];
  const exitCode = await runCli(args, {
    stdout: { write: (value) => writes.push(String(value)) },
    stderr: { write: (value) => errors.push(String(value)) },
  });
  return { exitCode, stdout: writes.join(""), stderr: errors.join("") };
};

const freePort = async () =>
  new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close((error) => (error ? reject(error) : resolve(port)));
    });
  });

test("prints version", async () => {
  const result = await capture(["--version"]);
  assert.equal(result.exitCode, 0);
  assert.equal(result.stdout.trim(), "rankforge 0.3.0");
});

test("prints help", async () => {
  const result = await capture(["--help"]);
  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /rankforge <command>/);
  assert.match(result.stdout, /validate-config/);
  assert.match(result.stdout, /explain-rule/);
  assert.match(result.stdout, /detect-repo/);
  assert.match(result.stdout, /audit-repo/);
  assert.match(result.stdout, /detect-repo \[path\]/);
  assert.match(result.stdout, /defaults to current directory/);
  assert.match(result.stdout, /--config <file>/);
  assert.match(result.stdout, /--static-dir <dir>/);
  assert.match(result.stdout, /--build-command <command>/);
  assert.match(result.stdout, /--max-build-ms <n>/);
  assert.match(result.stdout, /--preview-command <command>/);
  assert.match(result.stdout, /--preview-url <url>/);
  assert.match(result.stdout, /--max-preview-ms <n>/);
  assert.match(result.stdout, /--route-list <file>/);
  assert.match(result.stdout, /--mode full\|sample\|single/);
  assert.match(result.stdout, /--max-pages <n>/);
  assert.match(result.stdout, /--max-depth <n>/);
  assert.match(result.stdout, /--security local\|restricted/);
  assert.match(result.stdout, /--fail-on <severity>/);
  assert.match(result.stdout, /--html <file>/);
});

test("explains a known rule as JSON", async () => {
  const result = await capture(["explain-rule", "indexability.noindex"]);
  assert.equal(result.exitCode, 0);
  const body = JSON.parse(result.stdout);
  assert.equal(body.id, "indexability.noindex");
  assert.equal(body.dimension, "crawl_index");
  assert.ok(body.sources.length > 0);
});

test("explains deterministic rule depth rules as JSON", async () => {
  for (const ruleId of [
    "structured_data.visible_content_mismatch",
    "geo.entity_clarity_gap",
    "policy.duplicate_content_cluster",
  ]) {
    const result = await capture(["explain-rule", ruleId]);
    assert.equal(result.exitCode, 0);
    const body = JSON.parse(result.stdout);
    assert.equal(body.id, ruleId);
    assert.ok(body.sources.length > 0);
  }
});

test("returns a non-zero exit for unknown commands", async () => {
  const result = await capture(["unknown-command"]);
  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /Unknown command/);
});

test("runs audit from a config file with config-relative paths", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-config-"));
  const html = path.join(dir, "index.html");
  const config = path.join(dir, "audit.config.json");
  fs.writeFileSync(html, "<title>Config Target</title><meta name='description' content='Config'><h1>Config Target</h1><p>Enough content.</p>");
  fs.writeFileSync(config, JSON.stringify({ target: "index.html", crawl: { mode: "single" } }));

  const result = await capture(["audit", "--config", config]);
  assert.equal(result.exitCode, 0);
  const audit = JSON.parse(result.stdout);
  assert.equal(audit.pages[0].evidence.title, "Config Target");
  assert.match(audit.run.configHash, /^[a-f0-9]{64}$/);
});

test("lets positional audit target override config target", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-config-override-"));
  const configTarget = path.join(dir, "config.html");
  const overrideTarget = path.join(dir, "override.html");
  const config = path.join(dir, "audit.config.json");
  fs.writeFileSync(configTarget, "<title>Config Target</title><meta name='description' content='Config'><h1>Config Target</h1><p>Enough content.</p>");
  fs.writeFileSync(overrideTarget, "<title>Override Target</title><meta name='description' content='Override'><h1>Override Target</h1><p>Enough content.</p>");
  fs.writeFileSync(config, JSON.stringify({ target: "config.html", crawl: { mode: "single" } }));

  const result = await capture(["audit", overrideTarget, "--config", config]);
  assert.equal(result.exitCode, 0);
  const audit = JSON.parse(result.stdout);
  assert.equal(audit.run.target, overrideTarget);
  assert.equal(audit.pages[0].evidence.title, "Override Target");
});

test("returns CI failure code when findings meet fail-on threshold", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-fail-on-"));
  const html = path.join(dir, "bad.html");
  fs.writeFileSync(html, "<html><head><meta name='robots' content='noindex'></head><body><h1>Bad</h1><p>Short.</p></body></html>");

  const result = await capture(["audit", html, "--fail-on", "P1"]);
  assert.equal(result.exitCode, 2);
  const audit = JSON.parse(result.stdout);
  assert.ok(audit.findings.some((finding) => finding.severity === "P1"));
});

test("does not fail CI when findings are below fail-on threshold", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-no-fail-on-"));
  const html = path.join(dir, "minor.html");
  fs.writeFileSync(html, "<html><head><title>Minor</title><meta name='description' content='Minor'></head><body><h1>Minor</h1><p>Short.</p></body></html>");

  const result = await capture(["audit", html, "--fail-on", "P0"]);
  assert.equal(result.exitCode, 0);
});

test("audit writes an HTML report", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-html-cli-"));
  const page = path.join(dir, "index.html");
  const out = path.join(dir, "audit.json");
  const html = path.join(dir, "audit.html");
  fs.writeFileSync(
    page,
    "<html><head><title>HTML Output</title><meta name='description' content='HTML output'></head><body><h1>HTML Output</h1><p>Substantial content for a deterministic report.</p></body></html>",
  );

  const result = await capture(["audit", page, "--out", out, "--html", html]);

  assert.equal(result.exitCode, 0);
  assert.deepEqual(JSON.parse(result.stdout), { ok: true, out, html });
  assert.equal(JSON.parse(fs.readFileSync(out, "utf8")).pages[0].evidence.title, "HTML Output");
  assert.match(fs.readFileSync(html, "utf8"), /^<!doctype html>/);
  assert.match(fs.readFileSync(html, "utf8"), /GEO\/SEO Audit Report/);
});

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

test("audit-repo missing repo path returns helpful error", async () => {
  const result = await capture(["audit-repo"]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /audit-repo requires a repository path/);
});

test("audit-repo with missing static dir returns source finding failure code", async () => {
  const result = await capture(["audit-repo", "examples/fixture-repos/static-basic", "--static-dir", "missing"]);

  assert.equal(result.exitCode, 2);
  const body = JSON.parse(result.stdout);
  assert.equal(body.repo.sourceFindings[0].id, "repo.static_dir_missing");
});

test("audit-repo writes JSON, Markdown, and HTML reports", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-repo-cli-"));
  const out = path.join(dir, "audit.json");
  const markdown = path.join(dir, "audit.md");
  const html = path.join(dir, "audit.html");

  const result = await capture([
    "audit-repo",
    "examples/fixture-repos/static-basic",
    "--static-dir",
    "dist",
    "--out",
    out,
    "--markdown",
    markdown,
    "--html",
    html,
  ]);

  assert.equal(result.exitCode, 0);
  assert.deepEqual(JSON.parse(result.stdout), { ok: true, out, markdown, html });
  assert.equal(JSON.parse(fs.readFileSync(out, "utf8")).repo.detectedFramework, "generic-static");
  assert.match(fs.readFileSync(markdown, "utf8"), /GEO\/SEO Audit Report/);
  assert.match(fs.readFileSync(html, "utf8"), /^<!doctype html>/);
  assert.match(fs.readFileSync(html, "utf8"), /Repository Audit Evidence/);
});

test("audit-repo rejects missing out path", async () => {
  const result = await capture(["audit-repo", "examples/fixture-repos/static-basic", "--static-dir", "dist", "--out"]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--out requires a file path/);
});

test("audit-repo rejects missing markdown path", async () => {
  const result = await capture(["audit-repo", "examples/fixture-repos/static-basic", "--static-dir", "dist", "--markdown"]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--markdown requires a file path/);
});

test("audit rejects missing html path", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-html-missing-"));
  const page = path.join(dir, "index.html");
  fs.writeFileSync(page, "<title>Missing HTML path</title><h1>Missing HTML path</h1>");

  const result = await capture(["audit", page, "--html"]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--html requires a file path/);
});

test("audit-repo rejects missing html path", async () => {
  const result = await capture(["audit-repo", "examples/fixture-repos/static-basic", "--static-dir", "dist", "--html"]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--html requires a file path/);
});

test("audit-repo rejects option token as out path", async () => {
  const result = await capture([
    "audit-repo",
    "examples/fixture-repos/static-basic",
    "--static-dir",
    "dist",
    "--out",
    "--markdown",
    path.join(os.tmpdir(), "audit.md"),
  ]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--out requires a file path/);
});

test("audit-repo rejects invalid numeric options", async () => {
  const result = await capture([
    "audit-repo",
    "examples/fixture-repos/static-basic",
    "--static-dir",
    "dist",
    "--max-pages",
    "not-a-number",
  ]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--max-pages must be a number/);
});

test("audit-repo rejects missing numeric option values", async () => {
  const result = await capture(["audit-repo", "examples/fixture-repos/static-basic", "--static-dir", "dist", "--max-pages"]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--max-pages requires a value/);
});

test("audit-repo rejects option token as numeric option value", async () => {
  const result = await capture([
    "audit-repo",
    "examples/fixture-repos/static-basic",
    "--static-dir",
    "dist",
    "--max-pages",
    "--out",
    path.join(os.tmpdir(), "audit.json"),
  ]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--max-pages requires a value/);
});

test("audit-repo accepts valid numeric option values", async () => {
  const result = await capture([
    "audit-repo",
    "examples/fixture-repos/static-basic",
    "--static-dir",
    "dist",
    "--max-pages",
    "2",
  ]);

  assert.equal(result.exitCode, 0);
  const body = JSON.parse(result.stdout);
  assert.equal(body.pages.length, 2);
});

test("audit-repo rejects option token as static dir value", async () => {
  const result = await capture([
    "audit-repo",
    "examples/fixture-repos/static-basic",
    "--static-dir",
    "--out",
    path.join(os.tmpdir(), "audit.json"),
  ]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--static-dir requires a value/);
});

test("audit-repo rejects option token as mode value", async () => {
  const result = await capture([
    "audit-repo",
    "examples/fixture-repos/static-basic",
    "--static-dir",
    "dist",
    "--mode",
    "--max-pages",
    "2",
  ]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--mode requires a value/);
});

test("audit-repo rejects option token as security value", async () => {
  const result = await capture([
    "audit-repo",
    "examples/fixture-repos/static-basic",
    "--static-dir",
    "dist",
    "--security",
    "--out",
    path.join(os.tmpdir(), "audit.json"),
  ]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--security requires a value/);
});

test("audit-repo rejects invalid mode values", async () => {
  const result = await capture(["audit-repo", "examples/fixture-repos/static-basic", "--static-dir", "dist", "--mode", "bogus"]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--mode must be one of: full, sample, single/);
});

test("audit-repo rejects invalid security values", async () => {
  const result = await capture(["audit-repo", "examples/fixture-repos/static-basic", "--static-dir", "dist", "--security", "bogus"]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--security must be one of: local, restricted/);
});

test("audit-repo accepts valid enum option values", async () => {
  const result = await capture([
    "audit-repo",
    "examples/fixture-repos/static-basic",
    "--static-dir",
    "dist",
    "--mode",
    "single",
    "--security",
    "local",
  ]);

  assert.equal(result.exitCode, 0);
  const body = JSON.parse(result.stdout);
  assert.equal(body.repo.detectedFramework, "generic-static");
});

test("audit-repo rejects max-pages below minimum", async () => {
  const result = await capture(["audit-repo", "examples/fixture-repos/static-basic", "--static-dir", "dist", "--max-pages", "0"]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--max-pages must be a positive integer/);
});

test("audit-repo rejects fractional max-pages", async () => {
  const result = await capture(["audit-repo", "examples/fixture-repos/static-basic", "--static-dir", "dist", "--max-pages", "1.5"]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--max-pages must be a positive integer/);
});

test("audit-repo rejects max-depth below minimum", async () => {
  const result = await capture(["audit-repo", "examples/fixture-repos/static-basic", "--static-dir", "dist", "--max-depth", "-1"]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--max-depth must be a non-negative integer/);
});

test("audit-repo rejects max-preview-ms below minimum", async () => {
  const result = await capture(["audit-repo", "examples/fixture-repos/static-basic", "--static-dir", "dist", "--max-preview-ms", "0"]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--max-preview-ms must be a positive integer/);
});

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

test("audit-repo rejects invalid fail-on before running build command", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-repo-invalid-fail-on-"));
  const marker = path.join(dir, "build-marker");
  const buildCommand = `node -e "require('node:fs').writeFileSync(process.argv[1], 'ran')" ${JSON.stringify(marker)}`;

  const result = await capture([
    "audit-repo",
    "examples/fixture-repos/vite-basic",
    "--build-command",
    buildCommand,
    "--static-dir",
    "dist",
    "--fail-on",
    "PX",
  ]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--fail-on must be one of: P0, P1, P2, P3/);
  assert.equal(fs.existsSync(marker), false);
});

test("audit-repo rejects invalid fail-on before starting preview command", async () => {
  const port = await freePort();
  const previewUrl = `http://127.0.0.1:${port}`;

  const result = await capture([
    "audit-repo",
    "examples/fixture-repos/npm-preview",
    "--preview-command",
    `node server.mjs ${port}`,
    "--preview-url",
    previewUrl,
    "--fail-on",
    "PX",
  ]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--fail-on must be one of: P0, P1, P2, P3/);
  await assert.rejects(waitForHttp(previewUrl, { timeoutMs: 250 }), /Preview server did not become reachable/);
});

test("audit-repo rejects missing fail-on before running build command", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-repo-missing-fail-on-"));
  const marker = path.join(dir, "build-marker");
  const buildCommand = `node -e "require('node:fs').writeFileSync(process.argv[1], 'ran')" ${JSON.stringify(marker)}`;

  const result = await capture([
    "audit-repo",
    "examples/fixture-repos/vite-basic",
    "--build-command",
    buildCommand,
    "--static-dir",
    "dist",
    "--fail-on",
  ]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--fail-on requires a value/);
  assert.equal(fs.existsSync(marker), false);
});

test("audit-repo rejects missing build command value", async () => {
  const result = await capture(["audit-repo", "examples/fixture-repos/vite-basic", "--build-command"]);

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--build-command requires a value/);
});
