import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { validateAuditConfig } from "../src/config-schema.mjs";

test("accepts a minimal URL target config", () => {
  const result = validateAuditConfig({ target: "https://example.com" });
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test("rejects missing target", () => {
  const result = validateAuditConfig({});
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /target is required/);
});

test("rejects invalid crawl mode", () => {
  const result = validateAuditConfig({
    target: "https://example.com",
    crawl: { mode: "everything" },
  });
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /crawl.mode/);
});

test("rejects unsafe crawl regex patterns", () => {
  const result = validateAuditConfig({
    target: "https://example.com",
    crawl: { include: ["(a+)+$"] },
  });
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /unsafe regular expression/);
});

test("rejects overlapping alternation crawl regex patterns", () => {
  const result = validateAuditConfig({
    target: "https://example.com",
    crawl: { exclude: ["^(a|aa)+$"] },
  });
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /overlapping alternation/);
});

test("rejects additional unsafe crawl regex forms", () => {
  const nestedOptional = validateAuditConfig({
    target: "https://example.com",
    crawl: { include: ["^([a-z]?)+$"] },
  });
  const nonCapturingOverlap = validateAuditConfig({
    target: "https://example.com",
    crawl: { include: ["^(?:a|aa)+$"] },
  });

  assert.equal(nestedOptional.ok, false);
  assert.match(nestedOptional.errors.join("\n"), /nested quantifiers/);
  assert.equal(nonCapturingOverlap.ok, false);
  assert.match(nonCapturingOverlap.errors.join("\n"), /overlapping alternation/);
});

test("rejects missing referenced files when file checks are enabled", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-config-validation-"));
  const result = validateAuditConfig(
    {
      target: "https://example.com",
      urlList: "urls.txt",
      integrations: {
        lighthouse: "missing-lighthouse.json",
      },
    },
    { baseDir: dir, checkFiles: true },
  );
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /urlList file does not exist/);
  assert.match(result.errors.join("\n"), /integrations\.lighthouse file does not exist/);
});
