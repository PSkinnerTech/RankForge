import test from "node:test";
import assert from "node:assert/strict";
import { normalizeUrl, resolveUrl, sameOrigin } from "../src/url-utils.mjs";

test("normalizes hashes and trailing slashes", () => {
  assert.equal(normalizeUrl("https://example.com/a/#section"), "https://example.com/a");
  assert.equal(normalizeUrl("https://example.com/"), "https://example.com/");
});

test("compares origins", () => {
  assert.equal(sameOrigin("https://example.com/a", "https://example.com/b"), true);
  assert.equal(sameOrigin("https://example.com/a", "https://other.test/b"), false);
});

test("resolves relative links against a base URL", () => {
  assert.equal(resolveUrl("/about", "https://example.com/docs/page"), "https://example.com/about");
});
