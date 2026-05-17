import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { crawlSite } from "../src/crawl.mjs";

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

test("crawls same-origin links within page and depth limits", async () => {
  await withServer((request, response) => {
    response.setHeader("content-type", "text/html");
    if (request.url === "/about") {
      response.end("<title>About</title><meta name='description' content='About'><h1>About</h1><p>About page content.</p>");
      return;
    }
    if (request.url === "/external") {
      response.end("<title>External path</title><h1>External path</h1>");
      return;
    }
    response.end(`
      <title>Home</title>
      <meta name="description" content="Home">
      <h1>Home</h1>
      <a href="/about">About</a>
      <a href="/external">External path</a>
      <a href="https://other.example/">Other origin</a>
    `);
  }, async (origin) => {
    const result = await crawlSite({ target: `${origin}/`, maxPages: 2, maxDepth: 1 });
    assert.equal(result.pages.length, 2);
    assert.deepEqual(
      result.pages.map((page) => new URL(page.finalUrl).pathname),
      ["/", "/about"],
    );
    assert.ok(result.skipped.some((item) => item.reason === "cross_origin"));
  });
});

test("skips robots-disallowed URLs when robots enforcement is enabled", async () => {
  await withServer((request, response) => {
    if (request.url === "/robots.txt") {
      response.setHeader("content-type", "text/plain");
      response.end("User-agent: *\nDisallow: /blocked\n");
      return;
    }
    response.setHeader("content-type", "text/html");
    if (request.url === "/allowed") {
      response.end("<title>Allowed</title><meta name='description' content='Allowed'><h1>Allowed</h1><p>Allowed page content.</p>");
      return;
    }
    if (request.url === "/blocked") {
      response.end("<title>Blocked</title><h1>Blocked</h1>");
      return;
    }
    response.end(`
      <title>Home</title>
      <meta name="description" content="Home">
      <h1>Home</h1>
      <a href="/allowed">Allowed</a>
      <a href="/blocked">Blocked</a>
    `);
  }, async (origin) => {
    const result = await crawlSite({
      target: `${origin}/`,
      crawl: { mode: "full", maxPages: 5, maxDepth: 1 },
      respectRobots: true,
    });
    assert.deepEqual(
      result.pages.map((page) => new URL(page.finalUrl).pathname),
      ["/", "/allowed"],
    );
    assert.ok(result.skipped.some((item) => item.url.endsWith("/blocked") && item.reason === "robots_blocked"));
    assert.equal(result.robots.status, 200);
  });
});

test("seeds crawl queue with sitemap URLs", async () => {
  let serverPort;
  await withServer((request, response) => {
    if (request.url === "/sitemap.xml") {
      response.setHeader("content-type", "application/xml");
      response.end(`
        <urlset>
          <url><loc>http://127.0.0.1:${serverPort}/from-sitemap</loc></url>
        </urlset>
      `);
      return;
    }
    response.setHeader("content-type", "text/html");
    if (request.url === "/from-sitemap") {
      response.end("<title>Sitemap Page</title><meta name='description' content='Sitemap'><h1>Sitemap Page</h1><p>Enough content.</p>");
      return;
    }
    response.end("<title>Home</title><meta name='description' content='Home'><h1>Home</h1><p>Home content.</p>");
  }, async (origin) => {
    serverPort = new URL(origin).port;
    const result = await crawlSite({
      target: `${origin}/`,
      sitemap: `${origin}/sitemap.xml`,
      crawl: { mode: "full", maxPages: 3, maxDepth: 0 },
    });
    assert.ok(result.pages.some((page) => new URL(page.finalUrl).pathname === "/from-sitemap"));
    assert.equal(result.sitemaps[0].url, `${origin}/sitemap.xml`);
  });
});

test("applies include and exclude crawl filters to discovered URLs", async () => {
  await withServer((request, response) => {
    response.setHeader("content-type", "text/html");
    if (request.url === "/docs/a") {
      response.end("<title>Docs A</title><meta name='description' content='Docs'><h1>Docs A</h1><p>Docs content.</p>");
      return;
    }
    if (request.url === "/docs/private") {
      response.end("<title>Private</title><h1>Private</h1>");
      return;
    }
    if (request.url === "/blog/a") {
      response.end("<title>Blog A</title><h1>Blog A</h1>");
      return;
    }
    response.end(`
      <title>Home</title>
      <meta name="description" content="Home">
      <h1>Home</h1>
      <a href="/docs/a">Docs A</a>
      <a href="/docs/private">Private docs</a>
      <a href="/blog/a">Blog A</a>
    `);
  }, async (origin) => {
    const result = await crawlSite({
      target: `${origin}/`,
      crawl: { mode: "full", maxPages: 5, maxDepth: 1, include: ["/docs"], exclude: ["/private"] },
    });
    assert.deepEqual(
      result.pages.map((page) => new URL(page.finalUrl).pathname),
      ["/", "/docs/a"],
    );
    assert.ok(result.skipped.some((item) => item.url.endsWith("/docs/private") && item.reason === "excluded"));
    assert.ok(result.skipped.some((item) => item.url.endsWith("/blog/a") && item.reason === "not_included"));
  });
});
