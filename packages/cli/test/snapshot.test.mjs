import test from "node:test";
import assert from "node:assert/strict";
import { collectSnapshot } from "../src/snapshot.mjs";

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
