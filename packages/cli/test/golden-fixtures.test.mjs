import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { runAudit } from "../src/audit.mjs";
import { generateMarkdownReport } from "../src/report.mjs";
import { normalizeAuditForGolden, normalizeMarkdownForGolden } from "./helpers/golden.mjs";

const rootDir = path.resolve("examples/fixture-sites/known-issues");

const contentTypeFor = (filePath) => {
  if (filePath.endsWith(".xml")) return "application/xml";
  if (filePath.endsWith(".txt")) return "text/plain";
  return "text/html";
};

const withFixtureServer = async (fn) => {
  const server = http.createServer((request, response) => {
    const pathname = new URL(request.url, "http://127.0.0.1").pathname;
    const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
    const filePath = path.join(rootDir, relativePath);

    if (!filePath.startsWith(rootDir) || !fs.existsSync(filePath)) {
      response.statusCode = 404;
      response.setHeader("content-type", "text/html");
      response.end("<title>Missing</title><h1>Missing</h1>");
      return;
    }

    response.setHeader("content-type", contentTypeFor(filePath));
    const body = fs.readFileSync(filePath, "utf8");
    const origin = `http://${request.headers.host}`;
    response.end(filePath.endsWith("sitemap.xml") ? body.replaceAll("http://fixture.test", origin) : body);
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    return await fn(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
};

test("known-issues fixture audit matches golden JSON and Markdown", async () => {
  await withFixtureServer(async (origin) => {
    const audit = await runAudit({
      target: `${origin}/`,
      sitemap: `${origin}/sitemap.xml`,
      respectRobots: true,
      crawl: { mode: "full", maxPages: 12, maxDepth: 1 },
    });

    const summary = normalizeAuditForGolden(audit, origin);
    const markdown = normalizeMarkdownForGolden(generateMarkdownReport(audit), origin);

    const expectedSummary = JSON.parse(fs.readFileSync("examples/golden/known-issues-summary.json", "utf8"));
    const expectedMarkdown = fs.readFileSync("examples/golden/known-issues-report.md", "utf8");

    assert.deepEqual(summary, expectedSummary);
    assert.equal(markdown, expectedMarkdown);
  });
});
