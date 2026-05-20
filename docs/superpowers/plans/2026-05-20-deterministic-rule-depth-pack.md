# Phase D.2 Deterministic Rule Depth Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Activate three high-confidence deterministic Phase D.2 findings: structured-data visible-content mismatch, entity clarity gap, and duplicate content clusters.

**Architecture:** Add a small pure helper module for normalization, structured-data visible-content comparison, entity-signal scoring, and duplicate-content fingerprinting. Keep page-level finding emission in `rule-engine.mjs` and site-level cluster emission in `site-rule-engine.mjs` so the existing finding model, scoring, and report paths stay intact.

**Tech Stack:** Node.js ESM, `node:test`, existing CLI modules under `packages/cli/src`, current JSON/Markdown audit output model.

---

## Source Spec

Approved design: `docs/superpowers/specs/2026-05-20-deterministic-rule-depth-pack-design.md`

## File Structure

- Modify `packages/cli/src/structured-data.mjs`: export reusable structured-data node traversal helpers.
- Create `packages/cli/src/rule-depth.mjs`: pure helper functions for D.2 facts.
- Modify `packages/cli/src/rule-engine.mjs`: emit page-level D.2 findings from helper facts.
- Modify `packages/cli/src/site-rule-engine.mjs`: emit duplicate-content cluster findings from helper facts.
- Modify `packages/cli/test/rules.test.mjs`: assert active D.2 rule metadata.
- Modify `packages/cli/test/cli.test.mjs`: assert `explain-rule` works for D.2 rule IDs.
- Create `packages/cli/test/rule-depth.test.mjs`: direct helper tests.
- Modify `packages/cli/test/rule-engine.test.mjs`: page-level integration tests and false-positive guards.
- Modify `packages/cli/test/site-rule-engine.test.mjs`: site-level duplicate cluster tests and false-positive guards.
- Modify `scripts/validate-skill.mjs`: require the new helper and helper test.
- Modify `CHANGELOG.md`: record Phase D.2 behavior.

## Task 1: Add D.2 Metadata And CLI Registry Coverage

**Files:**
- Modify: `packages/cli/test/rules.test.mjs`
- Modify: `packages/cli/test/cli.test.mjs`

- [ ] **Step 1: Add D.2 rule metadata assertions**

In `packages/cli/test/rules.test.mjs`, add this test after the existing render parity metadata test:

```js
test("defines deterministic rule depth metadata", () => {
  const severities = Object.fromEntries(rules.map((rule) => [rule.id, rule.defaultSeverity]));

  assert.equal(severities["structured_data.visible_content_mismatch"], "P1");
  assert.equal(severities["geo.entity_clarity_gap"], "P2");
  assert.equal(severities["policy.duplicate_content_cluster"], "P2");
});
```

- [ ] **Step 2: Add explain-rule coverage for D.2 rules**

In `packages/cli/test/cli.test.mjs`, add this test after `explains a known rule as JSON`:

```js
test("explains deterministic rule depth rules as JSON", async () => {
  for (const ruleId of [
    "structured_data.visible_content_mismatch",
    "geo.entity_clarity_gap",
    "policy.duplicate_content_cluster",
  ]) {
    const result = await capture(["explain-rule", ruleId]);
    assert.equal(result.exitCode, 0);
    const body = JSON.parse(result.stdout);
    assert.equal(body.id, ruleId);
    assert.ok(body.sources.length > 0);
  }
});
```

- [ ] **Step 3: Run metadata and CLI tests**

Run:

```bash
node --test packages/cli/test/rules.test.mjs packages/cli/test/cli.test.mjs
```

Expected: PASS. The rule IDs already exist in the registry.

- [ ] **Step 4: Commit metadata coverage**

Run:

```bash
git add packages/cli/test/rules.test.mjs packages/cli/test/cli.test.mjs
git commit -m "test: cover rule depth metadata"
```

## Task 2: Add Pure Rule Depth Helper

**Files:**
- Modify: `packages/cli/src/structured-data.mjs`
- Create: `packages/cli/src/rule-depth.mjs`
- Create: `packages/cli/test/rule-depth.test.mjs`

- [ ] **Step 1: Export structured-data traversal helpers**

In `packages/cli/src/structured-data.mjs`, change:

```js
const typeNames = (value) => {
```

to:

```js
export const structuredDataTypeNames = (value) => {
```

Change:

```js
const nodesFrom = (value) => {
```

to:

```js
export const structuredDataNodes = (value) => {
```

Then update the recursive calls in that function:

```js
if (Array.isArray(value)) return value.flatMap(structuredDataNodes);
if (value["@graph"]) nodes.push(...structuredDataNodes(value["@graph"]));
```

Finally update `validateStructuredData` to use the exported names:

```js
for (const [nodeIndex, node] of structuredDataNodes(block.data).entries()) {
  for (const type of structuredDataTypeNames(node["@type"])) {
```

- [ ] **Step 2: Write helper tests**

Create `packages/cli/test/rule-depth.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { extractHtmlEvidence } from "../src/html-extract.mjs";
import {
  contentFingerprint,
  duplicateContentClusterFacts,
  entityClarityFacts,
  structuredDataVisibleContentFacts,
} from "../src/rule-depth.mjs";

const page = (url, html, overrides = {}) => ({
  finalUrl: url,
  status: 200,
  evidence: extractHtmlEvidence(html, url),
  ...overrides,
});

const longCopy = (phrase = "Useful evidence driven content") => `${phrase} `.repeat(80);

test("creates stable content fingerprints from visible text previews", () => {
  const one = "Example, BODY! Content. ".repeat(40);
  const two = "example body content ".repeat(40);

  assert.equal(
    contentFingerprint(one),
    contentFingerprint(two),
  );
  assert.equal(contentFingerprint("Short"), "");
});

test("detects structured data values absent from visible content", () => {
  const facts = structuredDataVisibleContentFacts(
    page("https://example.com/product", `
      <html>
        <head>
          <title>Services</title>
          <meta name="description" content="Services overview">
          <script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hidden Enterprise Platform","offers":{"price":"99","priceCurrency":"USD"}}</script>
        </head>
        <body><h1>Services</h1><p>${longCopy("Consulting and implementation support")}</p></body>
      </html>
    `),
    0,
  );

  assert.equal(facts.length, 1);
  assert.equal(facts[0].ruleId, "structured_data.visible_content_mismatch");
  assert.deepEqual(facts[0].evidence, [
    "$.pages[0].evidence.structuredData[0]",
    "$.pages[0].evidence.visibleTextPreview",
    "$.pages[0].evidence.title",
    "$.pages[0].evidence.h1",
    "$.pages[0].evidence.headings",
  ]);
});

test("does not flag structured data values visible in page evidence", () => {
  const facts = structuredDataVisibleContentFacts(
    page("https://example.com/product", `
      <html>
        <head>
          <title>Hidden Enterprise Platform</title>
          <meta name="description" content="Hidden Enterprise Platform overview">
          <script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hidden Enterprise Platform","offers":{"price":"99","priceCurrency":"USD"}}</script>
        </head>
        <body><h1>Hidden Enterprise Platform</h1><p>${longCopy("Hidden Enterprise Platform")}</p></body>
      </html>
    `),
    0,
  );

  assert.deepEqual(facts, []);
});

test("ignores invalid and unsupported structured data for visible content mismatch", () => {
  const invalidFacts = structuredDataVisibleContentFacts(
    page("https://example.com/bad", `
      <html>
        <head><script type="application/ld+json">{bad json}</script></head>
        <body><h1>Bad</h1><p>${longCopy()}</p></body>
      </html>
    `),
    0,
  );
  assert.deepEqual(invalidFacts, []);

  const unsupportedFacts = structuredDataVisibleContentFacts(
    page("https://example.com/faq", `
      <html>
        <head><script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","name":"Hidden FAQ"}</script></head>
        <body><h1>FAQ</h1><p>${longCopy()}</p></body>
      </html>
    `),
    0,
  );
  assert.deepEqual(unsupportedFacts, []);
});

test("detects entity clarity gaps on substantial pages with weak signals", () => {
  const facts = entityClarityFacts(
    page("https://example.com/services", `
      <html>
        <head><title>Services</title><meta name="description" content="Services"></head>
        <body><h1>Services</h1><p>${longCopy("Implementation service details")}</p></body>
      </html>
    `),
    0,
  );

  assert.equal(facts.length, 1);
  assert.equal(facts[0].ruleId, "geo.entity_clarity_gap");
});

test("does not flag entity clarity when two strong signals exist", () => {
  const facts = entityClarityFacts(
    page("https://example.com/services", `
      <html>
        <head>
          <title>Services</title>
          <meta name="description" content="Services">
          <meta property="og:site_name" content="Example Co">
          <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Example Co","url":"https://example.com"}</script>
        </head>
        <body><h1>Services</h1><p>${longCopy("Implementation service details")}</p></body>
      </html>
    `),
    0,
  );

  assert.deepEqual(facts, []);
});

test("does not flag entity clarity on thin or noindexed pages", () => {
  assert.deepEqual(entityClarityFacts(page("https://example.com/thin", "<title>Thin</title><h1>Thin</h1><p>Short.</p>"), 0), []);
  assert.deepEqual(
    entityClarityFacts(
      page("https://example.com/private", `
        <html>
          <head><title>Private</title><meta name="robots" content="noindex"></head>
          <body><h1>Private</h1><p>${longCopy()}</p></body>
        </html>
      `),
      0,
    ),
    [],
  );
});

test("detects duplicate content clusters for substantial pages", () => {
  const copy = longCopy("Shared service detail");
  const facts = duplicateContentClusterFacts([
    page("https://example.com/a", `<title>Alpha Page</title><h1>Alpha Page</h1><p>${copy}</p>`),
    page("https://example.com/b", `<title>Bravo Page</title><h1>Bravo Page</h1><p>${copy}</p>`),
    page("https://example.com/c", `<title>Charlie Page</title><h1>Charlie Page</h1><p>${copy}</p>`),
  ]);

  assert.equal(facts.length, 1);
  assert.equal(facts[0].ruleId, "policy.duplicate_content_cluster");
  assert.deepEqual(facts[0].affectedUrls, [
    "https://example.com/a",
    "https://example.com/b",
    "https://example.com/c",
  ]);
});

test("does not flag duplicate content pairs, short pages, noindexed pages, or canonical alternates", () => {
  const copy = longCopy("Shared service detail");
  assert.deepEqual(duplicateContentClusterFacts([
    page("https://example.com/a", `<title>Alpha Page</title><h1>Alpha Page</h1><p>${copy}</p>`),
    page("https://example.com/b", `<title>Bravo Page</title><h1>Bravo Page</h1><p>${copy}</p>`),
  ]), []);

  assert.deepEqual(duplicateContentClusterFacts([
    page("https://example.com/a", "<title>Alpha Page</title><h1>Alpha Page</h1><p>Short duplicate.</p>"),
    page("https://example.com/b", "<title>Bravo Page</title><h1>Bravo Page</h1><p>Short duplicate.</p>"),
    page("https://example.com/c", "<title>Charlie Page</title><h1>Charlie Page</h1><p>Short duplicate.</p>"),
  ]), []);

  assert.deepEqual(duplicateContentClusterFacts([
    page("https://example.com/a", `<title>Alpha Page</title><meta name="robots" content="noindex"><h1>Alpha Page</h1><p>${copy}</p>`),
    page("https://example.com/b", `<title>Bravo Page</title><meta name="robots" content="noindex"><h1>Bravo Page</h1><p>${copy}</p>`),
    page("https://example.com/c", `<title>Charlie Page</title><meta name="robots" content="noindex"><h1>Charlie Page</h1><p>${copy}</p>`),
  ]), []);

  assert.deepEqual(duplicateContentClusterFacts([
    page("https://example.com/a", `<title>Alpha Page</title><link rel="canonical" href="https://example.com/root"><h1>Alpha Page</h1><p>${copy}</p>`),
    page("https://example.com/b", `<title>Bravo Page</title><link rel="canonical" href="https://example.com/root"><h1>Bravo Page</h1><p>${copy}</p>`),
    page("https://example.com/c", `<title>Charlie Page</title><link rel="canonical" href="https://example.com/root"><h1>Charlie Page</h1><p>${copy}</p>`),
  ]), []);
});
```

- [ ] **Step 3: Run helper tests to verify failure**

Run:

```bash
node --test packages/cli/test/rule-depth.test.mjs
```

Expected: FAIL with an import/module-not-found error for `../src/rule-depth.mjs`.

- [ ] **Step 4: Implement the helper module**

Create `packages/cli/src/rule-depth.mjs`:

```js
import { cleanText } from "./html-extract.mjs";
import { structuredDataNodes, structuredDataTypeNames } from "./structured-data.mjs";
import { normalizeUrl } from "./url-utils.mjs";

const noindexPattern = /(?:^|,|\s)noindex(?:,|\s|$)/i;
const entitySchemaTypes = new Set(["Organization", "LocalBusiness", "Person", "Product", "Article"]);
const supportedStructuredDataFields = {
  Organization: "name",
  LocalBusiness: "name",
  Product: "name",
  Article: "headline",
};
const stopwords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "by",
  "for",
  "from",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

const evidencePath = (pageIndex, path) => `$.pages[${pageIndex}].evidence.${path}`;

const normalizeText = (value) =>
  cleanText(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokensFor = (value) =>
  normalizeText(value)
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopwords.has(token));

const isNoindexed = (evidence = {}) => noindexPattern.test(evidence.robots || "");

const isSuccessfulPage = (page) => !Number.isInteger(page.status) || page.status < 400;

const sameCanonical = (page) => {
  const canonical = page.evidence?.canonical;
  if (!canonical) return true;
  try {
    return normalizeUrl(canonical) === normalizeUrl(page.finalUrl);
  } catch {
    return canonical === page.finalUrl;
  }
};

const visibleContentSurface = (evidence = {}) =>
  normalizeText([
    evidence.title,
    evidence.description,
    evidence.siteName,
    ...(Array.isArray(evidence.h1) ? evidence.h1 : []),
    ...(Array.isArray(evidence.headings) ? evidence.headings.map((heading) => heading.text) : []),
    evidence.visibleTextPreview,
  ].filter(Boolean).join(" "));

const valueAppearsInSurface = (value, surface) => {
  const normalizedValue = normalizeText(value);
  if (normalizedValue.length < 4) return true;
  if (surface.includes(normalizedValue)) return true;

  const tokens = tokensFor(normalizedValue);
  if (tokens.length === 0) return true;
  const matched = tokens.filter((token) => surface.includes(token)).length;
  if (tokens.length === 1) return matched === 1;
  return matched >= Math.max(2, Math.ceil(tokens.length * 0.5));
};

export const contentFingerprint = (value) => {
  const normalized = normalizeText(value);
  return normalized.length >= 500 ? normalized : "";
};

const pageContentForFingerprint = (evidence = {}) => {
  let text = ` ${normalizeText(evidence.visibleTextPreview || "")} `;
  const labels = [
    evidence.title,
    ...(Array.isArray(evidence.h1) ? evidence.h1 : []),
  ].map(normalizeText).filter((label) => label.length > 2);

  for (const label of labels) {
    text = text.split(` ${label} `).join(" ");
  }

  return text.replace(/\s+/g, " ").trim();
};

export const structuredDataVisibleContentFacts = (page, pageIndex = 0) => {
  const evidence = page.evidence || {};
  const surface = visibleContentSurface(evidence);
  const facts = [];

  for (const [blockIndex, block] of (evidence.structuredData || []).entries()) {
    if (!block?.data || block.parseError) continue;

    for (const node of structuredDataNodes(block.data)) {
      for (const type of structuredDataTypeNames(node["@type"])) {
        const property = supportedStructuredDataFields[type];
        if (!property) continue;

        const value = node[property];
        if (Array.isArray(value) || typeof value === "object") continue;
        const cleaned = cleanText(value);
        if (cleaned.length < 4 || valueAppearsInSurface(cleaned, surface)) continue;

        facts.push({
          ruleId: "structured_data.visible_content_mismatch",
          evidence: [
            evidencePath(pageIndex, `structuredData[${blockIndex}]`),
            evidencePath(pageIndex, "visibleTextPreview"),
            evidencePath(pageIndex, "title"),
            evidencePath(pageIndex, "h1"),
            evidencePath(pageIndex, "headings"),
          ],
          impact: `${type} structured data names "${cleaned}", but that value is not visible in page evidence.`,
        });
      }
    }
  }

  return facts;
};

const hasAboutOrContactLink = (evidence = {}) =>
  (evidence.links || []).some((link) => {
    const haystack = `${link.href || ""} ${link.text || ""}`.toLowerCase();
    return haystack.includes("about") || haystack.includes("contact");
  });

const entitySignalCount = (evidence = {}) => {
  let count = 0;
  if (cleanText(evidence.siteName)) count += 1;
  if ((evidence.schemaTypes || []).some((type) => entitySchemaTypes.has(type))) count += 1;
  if (hasAboutOrContactLink(evidence)) count += 1;
  if ((evidence.entitySignals?.authors || []).length > 0) count += 1;
  if ((evidence.entitySignals?.dates || []).length > 0) count += 1;
  return count;
};

export const entityClarityFacts = (page, pageIndex = 0) => {
  const evidence = page.evidence || {};
  const visibleTextCharacters = evidence.counts?.visibleTextCharacters || 0;
  const hasPurposeSignal = cleanText(evidence.title) || (evidence.h1 || []).some((item) => cleanText(item));

  if (!isSuccessfulPage(page) || isNoindexed(evidence) || visibleTextCharacters < 800 || !hasPurposeSignal) return [];
  const signalCount = entitySignalCount(evidence);
  if (signalCount > 1) return [];

  return [{
    ruleId: "geo.entity_clarity_gap",
    evidence: [
      evidencePath(pageIndex, "siteName"),
      evidencePath(pageIndex, "schemaTypes"),
      evidencePath(pageIndex, "links"),
      evidencePath(pageIndex, "entitySignals"),
      evidencePath(pageIndex, "counts.visibleTextCharacters"),
    ],
    impact: `Substantial page content has only ${signalCount} deterministic entity signal(s).`,
  }];
};

export const duplicateContentClusterFacts = (pages = []) => {
  const groups = new Map();

  for (const [index, page] of pages.entries()) {
    const evidence = page.evidence || {};
    if (!isSuccessfulPage(page) || isNoindexed(evidence) || !sameCanonical(page)) continue;
    if ((evidence.counts?.visibleTextCharacters || 0) < 600) continue;

    const fingerprint = contentFingerprint(pageContentForFingerprint(evidence));
    if (!fingerprint) continue;

    const group = groups.get(fingerprint) || [];
    group.push({ page, index });
    groups.set(fingerprint, group);
  }

  return [...groups.values()]
    .filter((group) => group.length >= 3)
    .map((group) => ({
      ruleId: "policy.duplicate_content_cluster",
      affectedUrls: group.map(({ page }) => page.finalUrl),
      evidence: group.flatMap(({ index }) => [
        evidencePath(index, "visibleTextPreview"),
        evidencePath(index, "counts.visibleTextCharacters"),
      ]),
      impact: `${group.length} pages share the same substantial normalized visible text preview.`,
    }));
};
```

- [ ] **Step 5: Run helper tests**

Run:

```bash
node --test packages/cli/test/rule-depth.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit helper**

Run:

```bash
git add packages/cli/src/structured-data.mjs packages/cli/src/rule-depth.mjs packages/cli/test/rule-depth.test.mjs
git commit -m "feat: add deterministic rule depth helpers"
```

## Task 3: Emit Page-Level D.2 Findings

**Files:**
- Modify: `packages/cli/src/rule-engine.mjs`
- Modify: `packages/cli/test/rule-engine.test.mjs`

- [ ] **Step 1: Add page-level rule-engine tests**

In `packages/cli/test/rule-engine.test.mjs`, add these tests after `flags structured data required property gaps`:

```js
test("flags structured data visible content mismatches", () => {
  const findings = evaluatePage(
    snapshotFor(`
      <html>
        <head>
          <title>Consulting Services</title>
          <meta name="description" content="Implementation support">
          <script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hidden Enterprise Platform","offers":{"price":"99","priceCurrency":"USD"}}</script>
        </head>
        <body>
          <h1>Consulting Services</h1>
          <p>${"Implementation support for operational teams. ".repeat(40)}</p>
        </body>
      </html>
    `),
  );

  const finding = findings.find((item) => item.ruleId === "structured_data.visible_content_mismatch");
  assert.ok(finding);
  assert.equal(finding.severity, "P1");
  assert.deepEqual(finding.evidence.slice(0, 2), [
    "$.pages[0].evidence.structuredData[0]",
    "$.pages[0].evidence.visibleTextPreview",
  ]);
});

test("does not flag structured data values visible in page evidence", () => {
  const findings = evaluatePage(
    snapshotFor(`
      <html>
        <head>
          <title>Hidden Enterprise Platform</title>
          <meta name="description" content="Hidden Enterprise Platform implementation">
          <script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hidden Enterprise Platform","offers":{"price":"99","priceCurrency":"USD"}}</script>
        </head>
        <body>
          <h1>Hidden Enterprise Platform</h1>
          <p>${"Hidden Enterprise Platform implementation support. ".repeat(40)}</p>
        </body>
      </html>
    `),
  );

  assert.equal(findings.some((item) => item.ruleId === "structured_data.visible_content_mismatch"), false);
});

test("flags entity clarity gaps on substantial pages with weak entity signals", () => {
  const findings = evaluatePage(
    snapshotFor(`
      <html>
        <head><title>Implementation Services</title><meta name="description" content="Implementation services"></head>
        <body>
          <h1>Implementation Services</h1>
          <p>${"Detailed service scope, process, delivery model, and customer outcomes. ".repeat(45)}</p>
        </body>
      </html>
    `, {
      finalUrl: "https://example.com/services",
    }),
  );

  const finding = findings.find((item) => item.ruleId === "geo.entity_clarity_gap");
  assert.ok(finding);
  assert.equal(finding.severity, "P2");
});

test("does not flag entity clarity gaps when two strong signals exist", () => {
  const findings = evaluatePage(
    snapshotFor(`
      <html>
        <head>
          <title>Implementation Services</title>
          <meta name="description" content="Implementation services">
          <meta property="og:site_name" content="Example Co">
          <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Example Co","url":"https://example.com"}</script>
        </head>
        <body>
          <h1>Implementation Services</h1>
          <p>${"Detailed service scope, process, delivery model, and customer outcomes. ".repeat(45)}</p>
        </body>
      </html>
    `, {
      finalUrl: "https://example.com/services",
    }),
  );

  assert.equal(findings.some((item) => item.ruleId === "geo.entity_clarity_gap"), false);
});
```

- [ ] **Step 2: Run page-level tests to verify failure**

Run:

```bash
node --test packages/cli/test/rule-engine.test.mjs
```

Expected: FAIL because `evaluatePage` does not yet consume D.2 helper facts.

- [ ] **Step 3: Import D.2 helper facts in rule engine**

In `packages/cli/src/rule-engine.mjs`, add this import:

```js
import { entityClarityFacts, structuredDataVisibleContentFacts } from "./rule-depth.mjs";
```

- [ ] **Step 4: Emit page-level D.2 findings**

In `packages/cli/src/rule-engine.mjs`, after the `validateStructuredData` loop and before the thin-content check, add:

```js
  for (const depthFact of [
    ...structuredDataVisibleContentFacts(snapshot, pageIndex),
    ...entityClarityFacts(snapshot, pageIndex),
  ]) {
    findings.push(
      createFinding(depthFact.ruleId, snapshot, depthFact.evidence, pageIndex, depthFact.impact),
    );
  }
```

- [ ] **Step 5: Run page-level tests**

Run:

```bash
node --test packages/cli/test/rule-engine.test.mjs packages/cli/test/rule-depth.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit page-level integration**

Run:

```bash
git add packages/cli/src/rule-engine.mjs packages/cli/test/rule-engine.test.mjs
git commit -m "feat: emit page rule depth findings"
```

## Task 4: Emit Site-Level Duplicate Content Cluster Findings

**Files:**
- Modify: `packages/cli/src/site-rule-engine.mjs`
- Modify: `packages/cli/test/site-rule-engine.test.mjs`

- [ ] **Step 1: Add duplicate content site-rule tests**

In `packages/cli/test/site-rule-engine.test.mjs`, add this helper after `page`:

```js
const longCopy = (phrase = "Shared content") => `${phrase} `.repeat(80);
```

Then add these tests after `detects duplicate titles and descriptions`:

```js
test("detects duplicate content clusters beyond duplicate metadata", () => {
  const copy = longCopy("Detailed repeated service description");
  const findings = evaluateSite([
    page("https://example.com/a", `<title>Alpha Page</title><meta name='description' content='A'><h1>Alpha Page</h1><p>${copy}</p>`),
    page("https://example.com/b", `<title>Bravo Page</title><meta name='description' content='B'><h1>Bravo Page</h1><p>${copy}</p>`),
    page("https://example.com/c", `<title>Charlie Page</title><meta name='description' content='C'><h1>Charlie Page</h1><p>${copy}</p>`),
  ]);

  const finding = findings.find((item) => item.ruleId === "policy.duplicate_content_cluster");
  assert.ok(finding);
  assert.equal(finding.severity, "P2");
  assert.deepEqual(finding.affectedUrls, [
    "https://example.com/a",
    "https://example.com/b",
    "https://example.com/c",
  ]);
});

test("does not flag duplicate content cluster false positives", () => {
  const copy = longCopy("Detailed repeated service description");

  assert.equal(evaluateSite([
    page("https://example.com/a", `<title>Alpha Page</title><h1>Alpha Page</h1><p>${copy}</p>`),
    page("https://example.com/b", `<title>Bravo Page</title><h1>Bravo Page</h1><p>${copy}</p>`),
  ]).some((finding) => finding.ruleId === "policy.duplicate_content_cluster"), false);

  assert.equal(evaluateSite([
    page("https://example.com/a", "<title>Alpha Page</title><h1>Alpha Page</h1><p>Short duplicate.</p>"),
    page("https://example.com/b", "<title>Bravo Page</title><h1>Bravo Page</h1><p>Short duplicate.</p>"),
    page("https://example.com/c", "<title>Charlie Page</title><h1>Charlie Page</h1><p>Short duplicate.</p>"),
  ]).some((finding) => finding.ruleId === "policy.duplicate_content_cluster"), false);

  assert.equal(evaluateSite([
    page("https://example.com/a", `<title>Alpha Page</title><meta name='robots' content='noindex'><h1>Alpha Page</h1><p>${copy}</p>`),
    page("https://example.com/b", `<title>Bravo Page</title><meta name='robots' content='noindex'><h1>Bravo Page</h1><p>${copy}</p>`),
    page("https://example.com/c", `<title>Charlie Page</title><meta name='robots' content='noindex'><h1>Charlie Page</h1><p>${copy}</p>`),
  ]).some((finding) => finding.ruleId === "policy.duplicate_content_cluster"), false);

  assert.equal(evaluateSite([
    page("https://example.com/a", `<title>Alpha Page</title><link rel='canonical' href='https://example.com/root'><h1>Alpha Page</h1><p>${copy}</p>`),
    page("https://example.com/b", `<title>Bravo Page</title><link rel='canonical' href='https://example.com/root'><h1>Bravo Page</h1><p>${copy}</p>`),
    page("https://example.com/c", `<title>Charlie Page</title><link rel='canonical' href='https://example.com/root'><h1>Charlie Page</h1><p>${copy}</p>`),
  ]).some((finding) => finding.ruleId === "policy.duplicate_content_cluster"), false);
});
```

- [ ] **Step 2: Run site-rule tests to verify failure**

Run:

```bash
node --test packages/cli/test/site-rule-engine.test.mjs
```

Expected: FAIL because `evaluateSite` does not yet emit duplicate content cluster facts.

- [ ] **Step 3: Import duplicate cluster helper in site rule engine**

In `packages/cli/src/site-rule-engine.mjs`, add:

```js
import { duplicateContentClusterFacts } from "./rule-depth.mjs";
```

- [ ] **Step 4: Emit duplicate cluster findings**

In `packages/cli/src/site-rule-engine.mjs`, before `return findings;`, add:

```js
  for (const clusterFact of duplicateContentClusterFacts(pages)) {
    findings.push(
      finding(
        clusterFact.ruleId,
        clusterFact.affectedUrls,
        clusterFact.evidence,
        clusterFact.impact,
      ),
    );
  }
```

- [ ] **Step 5: Run site-level tests**

Run:

```bash
node --test packages/cli/test/site-rule-engine.test.mjs packages/cli/test/rule-depth.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit site-level integration**

Run:

```bash
git add packages/cli/src/site-rule-engine.mjs packages/cli/test/site-rule-engine.test.mjs
git commit -m "feat: detect duplicate content clusters"
```

## Task 5: Add Audit Regression Coverage

**Files:**
- Modify: `packages/cli/test/audit.test.mjs`

- [ ] **Step 1: Add end-to-end D.2 audit test**

In `packages/cli/test/audit.test.mjs`, add this test after the render parity audit test:

```js
test("includes deterministic rule depth findings in audit output", async () => {
  await withServer((request, response) => {
    response.setHeader("content-type", "text/html");
    const copy = "Detailed repeated service description with operational evidence and implementation context. ".repeat(25);
    if (request.url === "/a") {
      response.end(`<title>Alpha Page</title><meta name="description" content="A"><h1>Alpha Page</h1><p>${copy}</p><a href="/b">B</a><a href="/c">C</a>`);
      return;
    }
    if (request.url === "/b") {
      response.end(`<title>Bravo Page</title><meta name="description" content="B"><h1>Bravo Page</h1><p>${copy}</p>`);
      return;
    }
    if (request.url === "/c") {
      response.end(`<title>Charlie Page</title><meta name="description" content="C"><h1>Charlie Page</h1><p>${copy}</p>`);
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
        </body>
      </html>
    `);
  }, async (origin) => {
    const audit = await runAudit({
      target: `${origin}/`,
      crawl: { mode: "full", maxPages: 4, maxDepth: 2 },
    });

    const ids = audit.findings.map((finding) => finding.ruleId);
    assert.ok(ids.includes("structured_data.visible_content_mismatch"));
    assert.ok(ids.includes("geo.entity_clarity_gap"));
    assert.ok(ids.includes("policy.duplicate_content_cluster"));
  });
});
```

- [ ] **Step 2: Run audit regression**

Run:

```bash
node --test packages/cli/test/audit.test.mjs
```

Expected: PASS after Tasks 3 and 4.

- [ ] **Step 3: Commit audit coverage**

Run:

```bash
git add packages/cli/test/audit.test.mjs
git commit -m "test: cover rule depth audit output"
```

## Task 6: Update Validation And Changelog

**Files:**
- Modify: `scripts/validate-skill.mjs`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Add validation coverage for new files**

In `scripts/validate-skill.mjs`, add this entry near the other CLI source files:

```js
  "packages/cli/src/rule-depth.mjs",
```

Add this entry near the other CLI test files:

```js
  "packages/cli/test/rule-depth.test.mjs",
```

- [ ] **Step 2: Add changelog entry**

In `CHANGELOG.md`, under `## Unreleased - 2026-05-18`, add:

```md
- Added Phase D.2 deterministic rule-depth findings for duplicate content clusters, structured-data visible-content mismatches, and entity clarity gaps.
```

- [ ] **Step 3: Run validation**

Run:

```bash
npm run validate
```

Expected: PASS with `"ok": true` and `requiredFiles` increased by 2 compared with the current baseline.

- [ ] **Step 4: Run changelog grep**

Run:

```bash
rg -n "Phase D.2 deterministic rule-depth|rule-depth.mjs|rule-depth.test.mjs" CHANGELOG.md scripts/validate-skill.mjs
```

Expected: output includes the changelog entry and both validation file entries.

- [ ] **Step 5: Commit validation and docs**

Run:

```bash
git add scripts/validate-skill.mjs CHANGELOG.md
git commit -m "docs: record deterministic rule depth pack"
```

## Task 7: Final Verification And Review

**Files:**
- Read-only verification across the repository.

- [ ] **Step 1: Run focused test suite**

Run:

```bash
node --test packages/cli/test/rule-depth.test.mjs packages/cli/test/rules.test.mjs packages/cli/test/cli.test.mjs packages/cli/test/rule-engine.test.mjs packages/cli/test/site-rule-engine.test.mjs packages/cli/test/audit.test.mjs
```

Expected: PASS.

- [ ] **Step 2: Run full test suite**

Run:

```bash
npm test
```

Expected: PASS with zero failures.

- [ ] **Step 3: Run skill validation**

Run:

```bash
npm run validate
```

Expected: PASS with `"ok": true`.

- [ ] **Step 4: Run whitespace diff check**

Run:

```bash
git diff --check
```

Expected: no output and exit code 0.

- [ ] **Step 5: Inspect working tree**

Run:

```bash
git status --short --branch
```

Expected: clean working tree on the implementation branch.

- [ ] **Step 6: Request final code review**

Use `superpowers:requesting-code-review` after verification passes. The review request should ask for:

- structured-data visible-content false-positive risk
- duplicate content cluster threshold correctness
- entity clarity signal count subjectivity
- evidence path stability
- no ranking overclaims
- no default extraction or rendering behavior changes

- [ ] **Step 7: Fix review findings**

If review returns findings, implement only the requested fixes, rerun focused tests plus the relevant full verification command, and commit with a focused message.

- [ ] **Step 8: Finish branch**

Use `superpowers:finishing-a-development-branch` after review and verification pass. Present merge or PR options to the user.

## Completion Checklist

- [ ] `packages/cli/src/rule-depth.mjs` exists and is pure.
- [ ] `structured_data.visible_content_mismatch` emits only for supported schema values absent from visible evidence.
- [ ] `geo.entity_clarity_gap` emits only for substantial pages with one or fewer deterministic entity signals.
- [ ] `policy.duplicate_content_cluster` emits only for substantial 3+ page duplicate clusters.
- [ ] False-positive guard tests exist for each D.2 finding.
- [ ] D.2 rule IDs remain explainable through `explain-rule`.
- [ ] `scripts/validate-skill.mjs` protects new source and test files.
- [ ] `CHANGELOG.md` records Phase D.2 without claiming measured ranking impact.
- [ ] `npm test`, `npm run validate`, and `git diff --check` pass.
