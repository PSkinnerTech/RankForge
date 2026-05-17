import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readAiAnswers, readSearchConsoleCsv, readSerpExport } from "../src/integrations.mjs";

test("reads Search Console CSV exports", () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "gsc-")), "gsc.csv");
  fs.writeFileSync(file, "Query,Page,Clicks,Impressions,CTR,Position\nai tutor,https://example.com,10,100,10%,4.2\n");
  const result = readSearchConsoleCsv(file);
  assert.equal(result.rows[0].query, "ai tutor");
  assert.equal(result.rows[0].clicks, 10);
  assert.equal(result.rows[0].position, 4.2);
});

test("restricted mode allows supplied integration files as bounded evidence inputs", () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "gsc-restricted-")), "gsc.csv");
  fs.writeFileSync(file, "Query,Page,Clicks,Impressions,CTR,Position\nai tutor,https://example.com,10,100,10%,4.2\n");
  const result = readSearchConsoleCsv(file, { security: { mode: "restricted" } });
  assert.equal(result.rows[0].query, "ai tutor");
});

test("reads SERP JSON exports", () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "serp-")), "serp.json");
  fs.writeFileSync(file, JSON.stringify([{ query: "ai tutor", url: "https://example.com", position: 2 }]));
  const result = readSerpExport(file);
  assert.equal(result.rows[0].query, "ai tutor");
  assert.equal(result.rows[0].position, 2);
});

test("reads AI answer JSON exports", () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "ai-answers-")), "answers.json");
  fs.writeFileSync(file, JSON.stringify([{ prompt: "best ai tutor", citedUrls: ["https://example.com"] }]));
  const result = readAiAnswers(file);
  assert.equal(result.rows[0].prompt, "best ai tutor");
  assert.deepEqual(result.rows[0].citedUrls, ["https://example.com"]);
});
