import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { assertUrlAllowed, fetchWithGuards, readTextFileLimited } from "../src/io-guards.mjs";

test("restricted fetches must use manual redirects", async () => {
  await assert.rejects(
    () =>
      fetchWithGuards("https://example.com", {
        security: { mode: "restricted" },
        fetchOptions: { redirect: "follow" },
      }),
    /requires manual redirects/,
  );
});

test("restricted security mode blocks IPv4-mapped IPv6 private targets", async () => {
  await assert.rejects(
    () => assertUrlAllowed("http://[::ffff:127.0.0.1]/", { mode: "restricted" }),
    /private network target/,
  );
});

test("restricted security mode blocks the IPv6 link-local range", async () => {
  await assert.rejects(
    () => assertUrlAllowed("http://[fe90::1]/", { mode: "restricted" }),
    /private network target/,
  );
});

test("local evidence reads reject non-regular files", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-io-guards-"));
  assert.throws(() => readTextFileLimited(dir), /Only regular files can be read/);
});
