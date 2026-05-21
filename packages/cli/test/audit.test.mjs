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
  const audit = await runAudit({ target: "examples/fixture-site/index.html", crawl: { mode: "single", maxPages: 1, maxDepth: 0 } });
  assert.equal(audit.schemaVersion, "1.0.0");
  assert.equal(audit.toolVersion, "0.3.0");
  assert.match(audit.run.configHash, /^[a-f0-9]{64}$/);
  assert.deepEqual(audit.run.crawl, { mode: "single", maxPages: 1, maxDepth: 0 });
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
  const performanceFinding = audit.findings.find((finding) => finding.ruleId === "performance.lighthouse_poor");
  assert.equal(performanceFinding.implementationTask.owner, "Engineering");
  assert.ok(performanceFinding.implementationTask.acceptanceCriteria.length > 0);
});

test("collects supplied URL-list pages", async () => {
  await withServer((request, response) => {
    response.setHeader("content-type", "text/html");
    if (request.url === "/one") {
      response.end("<title>One</title><meta name='description' content='One'><h1>One</h1><p>Enough content.</p>");
      return;
    }
    if (request.url === "/two") {
      response.end("<title>Two</title><meta name='description' content='Two'><h1>Two</h1><p>Enough content.</p>");
      return;
    }
    response.end("<title>Home</title><meta name='description' content='Home'><h1>Home</h1><p>Enough content.</p>");
  }, async (origin) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-url-list-"));
    const urlList = path.join(dir, "urls.txt");
    fs.writeFileSync(urlList, "/one\n/two\n");

    const audit = await runAudit({ target: `${origin}/`, urlList, crawl: { mode: "single", maxPages: 5 } });
    assert.deepEqual(
      audit.pages.map((page) => new URL(page.finalUrl).pathname),
      ["/one", "/two"],
    );
  });
});

test("restricted mode allows supplied URL-list files as bounded evidence inputs", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-restricted-url-list-"));
  const urlList = path.join(dir, "urls.txt");
  fs.writeFileSync(urlList, "# intentionally empty\n");

  const audit = await runAudit({
    target: "https://example.com",
    urlList,
    security: { mode: "restricted" },
  });

  assert.equal(audit.pages.length, 0);
  assert.equal(audit.run.security.mode, "restricted");
});

test("audits internal URL list entries without a URL-list file", async () => {
  const index = path.resolve("examples/fixture-repos/static-basic/dist/index.html");
  const about = path.resolve("examples/fixture-repos/static-basic/dist/about/index.html");
  const audit = await runAudit({
    target: index,
    urlListEntries: [index, about],
  });

  assert.equal(audit.pages.length, 2);
  assert.ok(audit.pages.some((page) => page.finalUrl.endsWith("index.html")));
  assert.ok(audit.pages.some((page) => page.finalUrl.endsWith(path.join("about", "index.html"))));
});

test("normalizes internal URL list entries like URL-list file lines", async () => {
  await withServer((request, response) => {
    response.setHeader("content-type", "text/html");
    if (request.url === "/one") {
      response.end("<title>One</title><meta name='description' content='One'><h1>One</h1><p>Enough content.</p>");
      return;
    }
    if (request.url === "/two") {
      response.end("<title>Two</title><meta name='description' content='Two'><h1>Two</h1><p>Enough content.</p>");
      return;
    }
    response.statusCode = 404;
    response.end("<title>Missing</title><h1>Missing</h1>");
  }, async (origin) => {
    const audit = await runAudit({
      target: `${origin}/`,
      urlListEntries: ["/one", "# comment", "", "/two"],
    });

    assert.deepEqual(
      audit.pages.map((page) => new URL(page.finalUrl).pathname),
      ["/one", "/two"],
    );
  });
});

test("includes render parity findings when an injected renderer changes SEO signals", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "geo-seo-render-parity-"));
  const html = path.join(dir, "index.html");
  fs.writeFileSync(
    html,
    `
      <html>
        <head>
          <title>Raw Render Parity Title</title>
          <meta name="description" content="Raw render parity description">
          <link rel="canonical" href="https://example.com/render-parity">
          <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Render Parity Org"}</script>
        </head>
        <body>
          <h1>Render Parity Org</h1>
          <p>${"Useful render parity content ".repeat(60)}</p>
        </body>
      </html>
    `,
  );

  const audit = await runAudit({
    target: html,
    renderer: async () => `
      <html>
        <head>
          <title>Client Render Parity Title</title>
          <meta name="description" content="Client render parity description">
          <link rel="canonical" href="https://example.com/client-render-parity">
        </head>
        <body>
          <p>Loading.</p>
        </body>
      </html>
    `,
  });

  assert.equal(audit.pages[0].render.status, "rendered");
  const ids = audit.findings.map((finding) => finding.ruleId);
  assert.ok(ids.includes("technical.rendered_title_changed"));
  assert.ok(ids.includes("technical.rendered_description_changed"));
  assert.ok(ids.includes("technical.rendered_canonical_changed"));
  assert.ok(ids.includes("technical.rendered_primary_heading_missing"));
  assert.ok(ids.includes("technical.rendered_structured_data_lost"));
  assert.ok(ids.includes("technical.rendered_content_missing"));
});

test("includes deterministic rule depth findings in audit output", async () => {
  await withServer((request, response) => {
    response.setHeader("content-type", "text/html");
    const copy = "Detailed repeated service description with operational evidence and implementation context. ".repeat(8);
    if (request.url === "/a") {
      response.end(`<title>Shared Page</title><meta name="description" content="Shared duplicate page"><h1>Shared Page</h1><p>${copy}</p>`);
      return;
    }
    if (request.url === "/b") {
      response.end(`<title>Shared Page</title><meta name="description" content="Shared duplicate page"><h1>Shared Page</h1><p>${copy}</p>`);
      return;
    }
    if (request.url === "/c") {
      response.end(`<title>Shared Page</title><meta name="description" content="Shared duplicate page"><h1>Shared Page</h1><p>${copy}</p>`);
      return;
    }
    response.end(`
      <html>
        <head>
          <title>Consulting Services</title>
          <meta name="description" content="Implementation support">
          <script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hidden Enterprise Platform","offers":{"price":"99","priceCurrency":"USD"}}</script>
        </head>
        <body>
          <h1>Consulting Services</h1>
          <p>${"Implementation support for operational teams. ".repeat(45)}</p>
          <a href="/a">A</a>
          <a href="/b">B</a>
          <a href="/c">C</a>
        </body>
      </html>
    `);
  }, async (origin) => {
    const audit = await runAudit({
      target: `${origin}/`,
      crawl: { mode: "full", maxPages: 4, maxDepth: 1 },
    });

    const ids = audit.findings.map((finding) => finding.ruleId);
    assert.ok(ids.includes("structured_data.visible_content_mismatch"));
    assert.ok(ids.includes("geo.entity_clarity_gap"));
    assert.ok(ids.includes("policy.duplicate_content_cluster"));
  });
});
