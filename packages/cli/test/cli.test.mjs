import test from "node:test";
import assert from "node:assert/strict";
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
