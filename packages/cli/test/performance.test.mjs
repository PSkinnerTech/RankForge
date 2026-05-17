import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readLighthouseReport } from "../src/performance.mjs";

test("reads Lighthouse performance evidence", () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "lh-")), "lighthouse.json");
  fs.writeFileSync(
    file,
    JSON.stringify({
      lighthouseVersion: "12.0.0",
      requestedUrl: "https://example.com",
      finalDisplayedUrl: "https://example.com/",
      categories: { performance: { score: 0.42 } },
      audits: {
        "largest-contentful-paint": { numericValue: 4100 },
        "cumulative-layout-shift": { numericValue: 0.22 },
        "total-blocking-time": { numericValue: 500 },
      },
      configSettings: { formFactor: "mobile" },
    }),
  );

  const evidence = readLighthouseReport(file);
  assert.equal(evidence.type, "lighthouse");
  assert.equal(evidence.lighthouseVersion, "12.0.0");
  assert.equal(evidence.performanceScore, 42);
  assert.equal(evidence.metrics.lcpMs, 4100);
  assert.equal(evidence.metrics.cls, 0.22);
  assert.equal(evidence.metrics.tbtMs, 500);
  assert.equal(evidence.formFactor, "mobile");
});
