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
