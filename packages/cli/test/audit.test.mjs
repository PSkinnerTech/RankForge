import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { runAudit } from "../src/audit.mjs";

const withServer = async (handler, fn) => {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    return await fn(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
};

test("returns minimal versioned audit output for a local HTML target", async () => {
  const audit = await runAudit({ target: "examples/fixture-site/index.html" });
  assert.equal(audit.schemaVersion, "1.0.0");
  assert.equal(audit.toolVersion, "0.2.0");
  assert.equal(audit.pages.length, 1);
  assert.deepEqual(audit.findings, []);
  assert.ok(audit.sources.length > 0);
  assert.equal(audit.evidenceGaps[0].id, "ranking.integrations_missing");
});

test("includes deterministic findings in audit output", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-audit-"));
  const file = path.join(dir, "bad.html");
  fs.writeFileSync(
    file,
    `<html><head><meta name="robots" content="noindex"></head><body><img src="/x.png"><p>Short.</p></body></html>`,
  );

  const audit = await runAudit({ target: file });
  const ids = audit.findings.map((finding) => finding.ruleId);
  assert.ok(ids.includes("indexability.noindex"));
  assert.ok(ids.includes("appearance.title_missing"));
  assert.ok(ids.includes("appearance.h1_missing"));
  assert.ok(ids.includes("content.thin_content"));
  assert.ok(audit.scores.crawl_index.score < 100);
});

test("uses crawler for full HTTP audits", async () => {
  await withServer((request, response) => {
    response.setHeader("content-type", "text/html");
    if (request.url === "/about") {
      response.end("<title>About</title><meta name='description' content='About'><h1>About</h1><p>About page content.</p>");
      return;
    }
    response.end(`
      <title>Home</title>
      <meta name="description" content="Home">
      <h1>Home</h1>
      <a href="/about">About</a>
    `);
  }, async (origin) => {
    const audit = await runAudit({ target: `${origin}/`, crawl: { mode: "full", maxPages: 2, maxDepth: 1 } });
    assert.equal(audit.pages.length, 2);
    assert.deepEqual(
      audit.pages.map((page) => new URL(page.finalUrl).pathname),
      ["/", "/about"],
    );
  });
});

test("includes supplied ranking evidence and removes ranking evidence gap", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-integrations-"));
  const html = path.join(dir, "index.html");
  const gsc = path.join(dir, "gsc.csv");
  fs.writeFileSync(html, "<title>Home</title><meta name='description' content='Home'><h1>Home</h1><p>Enough content for audit evidence.</p>");
  fs.writeFileSync(gsc, "Query,Page,Clicks,Impressions,CTR,Position\nai tutor,https://example.com,10,100,10%,4.2\n");

  const audit = await runAudit({ target: html, integrations: { searchConsole: gsc } });
  assert.equal(audit.integrations.searchConsole.rows[0].query, "ai tutor");
  assert.equal(audit.evidenceGaps.some((gap) => gap.id === "ranking.integrations_missing"), false);
});

test("includes Lighthouse performance evidence and findings", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-performance-"));
  const html = path.join(dir, "index.html");
  const lighthouse = path.join(dir, "lighthouse.json");
  fs.writeFileSync(html, "<title>Home</title><meta name='description' content='Home'><h1>Home</h1><p>Enough content for audit evidence.</p>");
  fs.writeFileSync(
    lighthouse,
    JSON.stringify({
      lighthouseVersion: "12.0.0",
      categories: { performance: { score: 0.3 } },
      audits: {
        "largest-contentful-paint": { numericValue: 4300 },
        "cumulative-layout-shift": { numericValue: 0.3 },
      },
    }),
  );

  const audit = await runAudit({ target: html, integrations: { lighthouse } });
  assert.equal(audit.integrations.lighthouse.performanceScore, 30);
  const ids = audit.findings.map((finding) => finding.ruleId);
  assert.ok(ids.includes("performance.lighthouse_poor"));
  assert.ok(ids.includes("performance.lcp_poor"));
  assert.ok(ids.includes("performance.cls_poor"));
});
