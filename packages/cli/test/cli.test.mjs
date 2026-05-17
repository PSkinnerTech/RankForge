import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { runCli } from "../src/cli.mjs";

const capture = async (args) => {
  const writes = [];
  const errors = [];
  const exitCode = await runCli(args, {
    stdout: { write: (value) => writes.push(String(value)) },
    stderr: { write: (value) => errors.push(String(value)) },
  });
  return { exitCode, stdout: writes.join(""), stderr: errors.join("") };
};

test("prints version", async () => {
  const result = await capture(["--version"]);
  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /openclaw-geo-seo-audit/);
});

test("prints help", async () => {
  const result = await capture(["--help"]);
  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /validate-config/);
  assert.match(result.stdout, /explain-rule/);
});

test("explains a known rule as JSON", async () => {
  const result = await capture(["explain-rule", "indexability.noindex"]);
  assert.equal(result.exitCode, 0);
  const body = JSON.parse(result.stdout);
  assert.equal(body.id, "indexability.noindex");
  assert.equal(body.dimension, "crawl_index");
  assert.ok(body.sources.length > 0);
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
