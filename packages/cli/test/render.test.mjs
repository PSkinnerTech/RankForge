import test from "node:test";
import assert from "node:assert/strict";
import { renderHtml } from "../src/render.mjs";

test("closes launched browser when Playwright navigation fails", async () => {
  let closed = false;

  const result = await renderHtml("https://example.test/", {
    launcher: {
      launch: async () => ({
        newPage: async () => ({
          goto: async () => {
            throw new Error("navigation failed");
          },
        }),
        close: async () => {
          closed = true;
        },
      }),
    },
  });

  assert.deepEqual(result, { status: "unavailable", reason: "navigation failed" });
  assert.equal(closed, true);
});

test("restricted security mode disables browser rendering for URL targets", async () => {
  const result = await renderHtml("https://example.test/", {
    security: { mode: "restricted" },
    launcher: {
      launch: async () => {
        throw new Error("launcher should not be called");
      },
    },
  });

  assert.equal(result.status, "unavailable");
  assert.match(result.reason, /Restricted security mode disables browser rendering/);
});

test("restricted security mode disables injected renderer for URL targets", async () => {
  const result = await renderHtml("https://example.test/", {
    security: { mode: "restricted" },
    renderer: async () => {
      throw new Error("renderer should not be called");
    },
  });

  assert.equal(result.status, "unavailable");
  assert.match(result.reason, /Restricted security mode disables browser rendering/);
});
