import test from "node:test";
import assert from "node:assert/strict";
import { validateStructuredData } from "../src/structured-data.mjs";

test("validates required properties for supported schema types", () => {
  const issues = validateStructuredData([
    { data: { "@type": "Organization", "url": "https://example.com" } },
    { data: { "@type": "Product", "name": "Widget" } },
    { data: { "@type": "FAQPage", "mainEntity": [] } },
    { data: { "@type": "Article", "headline": "News" } },
    { data: { "@type": "BreadcrumbList" } },
    { data: { "@type": "Event", "name": "Launch" } },
    { data: { "@type": "VideoObject", "name": "Demo" } },
    { data: { "@type": "SoftwareApplication", "name": "App" } },
  ]);

  assert.ok(issues.some((issue) => issue.type === "Organization" && issue.missing.includes("name")));
  assert.ok(issues.some((issue) => issue.type === "Product" && issue.missing.includes("offers")));
  assert.ok(issues.some((issue) => issue.type === "FAQPage" && issue.missing.includes("mainEntity")));
  assert.ok(issues.some((issue) => issue.type === "Article" && issue.missing.includes("datePublished")));
  assert.ok(issues.some((issue) => issue.type === "BreadcrumbList" && issue.missing.includes("itemListElement")));
  assert.ok(issues.some((issue) => issue.type === "Event" && issue.missing.includes("startDate")));
  assert.ok(issues.some((issue) => issue.type === "VideoObject" && issue.missing.includes("thumbnailUrl")));
  assert.ok(issues.some((issue) => issue.type === "SoftwareApplication" && issue.missing.includes("applicationCategory")));
});

test("accepts complete minimal Organization schema", () => {
  const issues = validateStructuredData([
    { data: { "@type": "Organization", "name": "Example", "url": "https://example.com" } },
  ]);
  assert.deepEqual(issues, []);
});
