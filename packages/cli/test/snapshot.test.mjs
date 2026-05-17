import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { collectSnapshot } from "../src/snapshot.mjs";

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

test("collects local HTML page evidence", async () => {
  const snapshot = await collectSnapshot("examples/fixture-site/index.html");
  assert.equal(snapshot.sourceType, "file");
  assert.equal(snapshot.status, null);
  assert.equal(snapshot.render.status, "not_requested");
  assert.match(snapshot.rawHash, /^[a-f0-9]{64}$/);
  assert.equal(snapshot.evidence.title, "AI Tutoring Platform for Mastery Learning | Example Learn");
  assert.equal(snapshot.evidence.canonical, "https://example.test/");
  assert.deepEqual(snapshot.evidence.h1, ["AI tutoring platform for mastery learning"]);
  assert.equal(snapshot.evidence.links.length, 4);
  assert.equal(snapshot.evidence.images.length, 1);
  assert.equal(snapshot.evidence.structuredData[0].data["@type"], "Organization");
});

test("collects rendered evidence with an injected renderer", async () => {
  const snapshot = await collectSnapshot("examples/fixture-site/index.html", {
    render: "always",
    renderer: async () => `<!doctype html><title>Rendered</title><h1>Rendered heading</h1><p>${"Rendered text ".repeat(40)}</p>`,
  });

  assert.equal(snapshot.render.status, "rendered");
  assert.match(snapshot.render.renderedHash, /^[a-f0-9]{64}$/);
  assert.equal(snapshot.render.evidence.title, "Rendered");
  assert.equal(snapshot.render.evidence.h1[0], "Rendered heading");
  assert.ok(snapshot.render.textDeltaCharacters > 0);
});

test("restricted security mode blocks local file targets", async () => {
  await assert.rejects(
    () =>
      collectSnapshot("examples/fixture-site/index.html", {
        security: { mode: "restricted" },
      }),
    /Local file targets are disabled/,
  );
});

test("restricted security mode blocks private network URL targets", async () => {
  await withServer((request, response) => {
    response.setHeader("content-type", "text/html");
    response.end("<title>Private</title><h1>Private</h1>");
  }, async (origin) => {
    await assert.rejects(
      () =>
        collectSnapshot(`${origin}/`, {
          security: { mode: "restricted" },
        }),
      /private network target/,
    );
  });
});

test("limited snapshots reject responses above the configured HTML byte cap", async () => {
  await withServer((request, response) => {
    response.setHeader("content-type", "text/html");
    response.end("<title>Large</title><h1>Large</h1>");
  }, async (origin) => {
    await assert.rejects(
      () =>
        collectSnapshot(`${origin}/`, {
          limits: { maxHtmlBytes: 10 },
        }),
      /exceeds.*10 bytes/,
    );
  });
});

test("snapshot body reads time out when a response stalls after headers", async () => {
  await withServer((request, response) => {
    response.setHeader("content-type", "text/html");
    response.write("<title>Slow</title>");
    setTimeout(() => response.end("<h1>Slow</h1>"), 200);
  }, async (origin) => {
    await assert.rejects(
      () =>
        collectSnapshot(`${origin}/`, {
          limits: { timeoutMs: 50, maxHtmlBytes: 1000 },
        }),
      /Timed out reading response body/,
    );
  });
});
