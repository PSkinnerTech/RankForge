# Render Parity Rule Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add deterministic raw/rendered parity findings for SEO/GEO-critical page signals when explicit rendered evidence exists.

**Architecture:** Add a pure `render-parity.mjs` helper that compares raw extracted evidence with rendered extracted evidence and returns normalized parity facts. Integrate those facts into `rule-engine.mjs` so findings use the existing rule registry, implementation task, severity, confidence, and evidence path model. Keep rendering opt-in; this plan does not change audit defaults or install browser dependencies.

**Tech Stack:** Node.js ESM, `node:test`, existing CLI modules under `packages/cli/src`, existing fixture and validation scripts.

---

## Source Spec

Approved design: `docs/superpowers/specs/2026-05-20-render-parity-rule-pack-design.md`

## File Structure

- Create `packages/cli/src/render-parity.mjs`: pure comparison helper for raw/rendered extracted evidence.
- Create `packages/cli/test/render-parity.test.mjs`: direct helper coverage.
- Modify `packages/cli/src/rules.mjs`: add render parity rule registry entries and reuse existing raw/rendered rules.
- Modify `packages/cli/test/rules.test.mjs`: assert the new rules are registered with expected severities.
- Modify `packages/cli/src/rule-engine.mjs`: consume render parity facts and emit findings.
- Modify `packages/cli/test/rule-engine.test.mjs`: page-level rule coverage for render parity findings and false positives.
- Modify `packages/cli/test/audit.test.mjs`: add end-to-end injected-renderer coverage without Playwright.
- Modify `scripts/validate-skill.mjs`: require the new helper and test files.
- Modify `CHANGELOG.md`: record user-visible Phase D.1 behavior.

## Task 1: Add Render Parity Helper

**Files:**
- Create: `packages/cli/src/render-parity.mjs`
- Create: `packages/cli/test/render-parity.test.mjs`

- [ ] **Step 1: Write failing helper tests**

Create `packages/cli/test/render-parity.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { renderParityFacts } from "../src/render-parity.mjs";

const snapshot = ({ raw = {}, rendered = {}, renderStatus = "rendered" } = {}) => ({
  finalUrl: "https://example.com/page",
  evidence: {
    title: "Raw Title",
    description: "Raw description",
    canonical: "https://example.com/page",
    h1: ["Raw H1"],
    structuredData: [],
    schemaTypes: [],
    counts: { visibleTextCharacters: 500 },
    ...raw,
  },
  render: {
    status: renderStatus,
    evidence:
      renderStatus === "rendered"
        ? {
            title: "Raw Title",
            description: "Raw description",
            canonical: "https://example.com/page",
            h1: ["Raw H1"],
            structuredData: [],
            schemaTypes: [],
            counts: { visibleTextCharacters: 500 },
            ...rendered,
          }
        : undefined,
  },
});

test("returns no parity facts without rendered evidence", () => {
  assert.deepEqual(renderParityFacts(snapshot({ renderStatus: "not_requested" }), 0), []);
});

test("detects rendered title changes", () => {
  const facts = renderParityFacts(snapshot({ rendered: { title: "Client Title" } }), 2);
  assert.deepEqual(facts.map((fact) => fact.ruleId), ["technical.rendered_title_changed"]);
  assert.deepEqual(facts[0].evidence, ["$.pages[2].evidence.title", "$.pages[2].render.evidence.title"]);
  assert.match(facts[0].impact, /Rendered title changed/);
});

test("detects rendered description removal", () => {
  const facts = renderParityFacts(snapshot({ rendered: { description: "" } }), 0);
  assert.deepEqual(facts.map((fact) => fact.ruleId), ["technical.rendered_description_changed"]);
  assert.deepEqual(facts[0].evidence, ["$.pages[0].evidence.description", "$.pages[0].render.evidence.description"]);
});

test("detects rendered canonical changes with URL normalization", () => {
  const facts = renderParityFacts(
    snapshot({
      raw: { canonical: "https://example.com/page/" },
      rendered: { canonical: "https://example.com/other" },
    }),
    0,
  );
  assert.deepEqual(facts.map((fact) => fact.ruleId), ["technical.rendered_canonical_changed"]);
});

test("does not flag equivalent canonical URL formatting", () => {
  const facts = renderParityFacts(
    snapshot({
      raw: { canonical: "https://example.com/page/" },
      rendered: { canonical: "https://example.com/page" },
    }),
    0,
  );
  assert.deepEqual(facts, []);
});

test("detects rendered primary heading removal", () => {
  const facts = renderParityFacts(snapshot({ rendered: { h1: [] } }), 0);
  assert.deepEqual(facts.map((fact) => fact.ruleId), ["technical.rendered_primary_heading_missing"]);
  assert.deepEqual(facts[0].evidence, ["$.pages[0].evidence.h1", "$.pages[0].render.evidence.h1"]);
});

test("detects rendered structured data type loss", () => {
  const facts = renderParityFacts(
    snapshot({
      raw: {
        structuredData: [{ data: { "@context": "https://schema.org", "@type": "Organization", name: "Example" } }],
        schemaTypes: ["Organization"],
      },
      rendered: { structuredData: [], schemaTypes: [] },
    }),
    0,
  );
  assert.deepEqual(facts.map((fact) => fact.ruleId), ["technical.rendered_structured_data_lost"]);
  assert.match(facts[0].impact, /Organization/);
});

test("ignores invalid raw structured data when checking structured data loss", () => {
  const facts = renderParityFacts(
    snapshot({
      raw: { structuredData: [{ parseError: true, rawPreview: "{bad json" }], schemaTypes: [] },
      rendered: { structuredData: [], schemaTypes: [] },
    }),
    0,
  );
  assert.deepEqual(facts, []);
});

test("detects rendered content missing before broad text mismatch", () => {
  const facts = renderParityFacts(
    snapshot({
      raw: { counts: { visibleTextCharacters: 500 } },
      rendered: { counts: { visibleTextCharacters: 100 } },
    }),
    0,
  );
  assert.deepEqual(facts.map((fact) => fact.ruleId), ["technical.rendered_content_missing"]);
});

test("detects large raw and rendered visible text deltas", () => {
  const facts = renderParityFacts(
    snapshot({
      raw: { counts: { visibleTextCharacters: 900 } },
      rendered: { counts: { visibleTextCharacters: 500 } },
    }),
    0,
  );
  assert.deepEqual(facts.map((fact) => fact.ruleId), ["technical.raw_rendered_mismatch"]);
});

test("returns no facts when raw and rendered evidence match", () => {
  assert.deepEqual(renderParityFacts(snapshot(), 0), []);
});
```

- [ ] **Step 2: Run helper tests to verify failure**

Run:

```bash
node --test packages/cli/test/render-parity.test.mjs
```

Expected: FAIL with an import/module-not-found error for `../src/render-parity.mjs`.

- [ ] **Step 3: Implement the render parity helper**

Create `packages/cli/src/render-parity.mjs`:

```js
import { normalizeUrl } from "./url-utils.mjs";

const cleanText = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

const comparableText = (value) => cleanText(value).toLowerCase();

const shortValue = (value) => {
  const cleaned = cleanText(value);
  if (!cleaned) return "missing";
  return cleaned.length > 80 ? `${cleaned.slice(0, 77)}...` : cleaned;
};

const evidencePath = (pageIndex, path, rendered = false) =>
  rendered ? `$.pages[${pageIndex}].render.evidence.${path}` : `$.pages[${pageIndex}].evidence.${path}`;

const compareUrl = (value) => {
  const cleaned = cleanText(value);
  if (!cleaned) return "";
  try {
    return normalizeUrl(cleaned);
  } catch {
    return cleaned.toLowerCase();
  }
};

const structuredDataTypes = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(structuredDataTypes);
  if (typeof value !== "object") return [];

  const types = [];
  if (value["@type"]) {
    if (Array.isArray(value["@type"])) types.push(...value["@type"].map(String));
    else types.push(String(value["@type"]));
  }
  if (value["@graph"]) types.push(...structuredDataTypes(value["@graph"]));
  return types;
};

const validStructuredData = (evidence) => (evidence.structuredData || []).filter((item) => item?.data && !item.parseError);

const schemaTypesFor = (evidence) => {
  const explicit = Array.isArray(evidence.schemaTypes) ? evidence.schemaTypes.map(String) : [];
  const fromBlocks = validStructuredData(evidence).flatMap((item) => structuredDataTypes(item.data));
  return [...new Set([...explicit, ...fromBlocks].filter(Boolean))];
};

const visibleTextCharacters = (evidence) => Number(evidence.counts?.visibleTextCharacters || 0);

const fact = (ruleId, pageIndex, path, impact) => ({
  ruleId,
  evidence: [evidencePath(pageIndex, path), evidencePath(pageIndex, path, true)],
  impact,
});

export const renderParityFacts = (snapshot, pageIndex = 0) => {
  if (snapshot?.render?.status !== "rendered" || !snapshot.render.evidence) return [];

  const raw = snapshot.evidence || {};
  const rendered = snapshot.render.evidence || {};
  const facts = [];

  if (cleanText(raw.title) && comparableText(raw.title) !== comparableText(rendered.title)) {
    facts.push(
      fact(
        "technical.rendered_title_changed",
        pageIndex,
        "title",
        `Rendered title changed from "${shortValue(raw.title)}" to "${shortValue(rendered.title)}".`,
      ),
    );
  }

  if (cleanText(raw.description) && comparableText(raw.description) !== comparableText(rendered.description)) {
    facts.push(
      fact(
        "technical.rendered_description_changed",
        pageIndex,
        "description",
        `Rendered meta description changed from "${shortValue(raw.description)}" to "${shortValue(rendered.description)}".`,
      ),
    );
  }

  if (cleanText(raw.canonical) && compareUrl(raw.canonical) !== compareUrl(rendered.canonical)) {
    facts.push(
      fact(
        "technical.rendered_canonical_changed",
        pageIndex,
        "canonical",
        `Rendered canonical changed from "${shortValue(raw.canonical)}" to "${shortValue(rendered.canonical)}".`,
      ),
    );
  }

  const rawH1 = Array.isArray(raw.h1) ? raw.h1.filter((item) => cleanText(item)) : [];
  const renderedH1 = Array.isArray(rendered.h1) ? rendered.h1.filter((item) => cleanText(item)) : [];
  if (rawH1.length > 0 && renderedH1.length === 0) {
    facts.push(
      fact(
        "technical.rendered_primary_heading_missing",
        pageIndex,
        "h1",
        "Rendered HTML removed the primary H1 that exists in raw HTML.",
      ),
    );
  }

  const rawStructuredData = validStructuredData(raw);
  const renderedStructuredData = validStructuredData(rendered);
  const rawSchemaTypes = schemaTypesFor(raw);
  const renderedSchemaTypes = new Set(schemaTypesFor(rendered));
  const lostSchemaTypes = rawSchemaTypes.filter((type) => !renderedSchemaTypes.has(type));
  if (rawStructuredData.length > 0 && (renderedStructuredData.length < rawStructuredData.length || lostSchemaTypes.length > 0)) {
    const lostTypeText = lostSchemaTypes.length ? ` Lost schema types: ${lostSchemaTypes.join(", ")}.` : "";
    facts.push(
      fact(
        "technical.rendered_structured_data_lost",
        pageIndex,
        "structuredData",
        `Rendered HTML lost structured data that exists in raw HTML.${lostTypeText}`,
      ),
    );
  }

  const rawTextLength = visibleTextCharacters(raw);
  const renderedTextLength = visibleTextCharacters(rendered);
  const textDelta = renderedTextLength - rawTextLength;
  if (rawTextLength >= 300 && renderedTextLength < 150) {
    facts.push({
      ruleId: "technical.rendered_content_missing",
      evidence: [evidencePath(pageIndex, "counts.visibleTextCharacters"), evidencePath(pageIndex, "counts.visibleTextCharacters", true)],
      impact: `Rendered HTML has ${renderedTextLength} visible text characters; raw HTML has ${rawTextLength}.`,
    });
  } else if (Math.abs(textDelta) > 300) {
    facts.push({
      ruleId: "technical.raw_rendered_mismatch",
      evidence: [evidencePath(pageIndex, "counts.visibleTextCharacters"), evidencePath(pageIndex, "counts.visibleTextCharacters", true)],
      impact: `Rendered visible text differs from raw HTML by ${Math.abs(textDelta)} characters.`,
    });
  }

  return facts;
};
```

- [ ] **Step 4: Run helper tests to verify pass**

Run:

```bash
node --test packages/cli/test/render-parity.test.mjs
```

Expected: PASS, 11 tests.

- [ ] **Step 5: Commit helper**

Run:

```bash
git add packages/cli/src/render-parity.mjs packages/cli/test/render-parity.test.mjs
git commit -m "feat: add render parity helper"
```

## Task 2: Register Render Parity Rules

**Files:**
- Modify: `packages/cli/src/rules.mjs`
- Modify: `packages/cli/test/rules.test.mjs`

- [ ] **Step 1: Write failing rule registry tests**

Append this test to `packages/cli/test/rules.test.mjs`:

```js
test("defines render parity rule metadata", () => {
  const expected = {
    "technical.rendered_title_changed": "P2",
    "technical.rendered_description_changed": "P3",
    "technical.rendered_canonical_changed": "P1",
    "technical.rendered_primary_heading_missing": "P1",
    "technical.rendered_structured_data_lost": "P2",
    "technical.rendered_content_missing": "P1",
    "technical.raw_rendered_mismatch": "P2",
  };

  for (const [ruleId, severity] of Object.entries(expected)) {
    const item = getRule(ruleId);
    assert.ok(item, `${ruleId} is registered`);
    assert.equal(item.dimension, "technical");
    assert.equal(item.defaultSeverity, severity);
    assert.ok(item.recommendation);
    assert.ok(item.sources.length > 0);
  }
});
```

- [ ] **Step 2: Run registry test to verify failure**

Run:

```bash
node --test packages/cli/test/rules.test.mjs
```

Expected: FAIL because at least `technical.rendered_title_changed` is not registered.

- [ ] **Step 3: Add render parity rules**

In `packages/cli/src/rules.mjs`, add these rule entries after `technical.raw_rendered_mismatch`:

```js
  rule(
    "technical.rendered_title_changed",
    "technical",
    "P2",
    "Rendered HTML changes the page title",
    "Keep rendered title output aligned with raw HTML so crawlers and users receive a stable title signal.",
    [sources.javascriptSeo, sources.titleLinks],
  ),
  rule(
    "technical.rendered_description_changed",
    "technical",
    "P3",
    "Rendered HTML changes the meta description",
    "Keep rendered meta description output aligned with raw HTML when the page relies on it for snippet context.",
    [sources.javascriptSeo, sources.snippets],
  ),
  rule(
    "technical.rendered_canonical_changed",
    "technical",
    "P1",
    "Rendered HTML changes the canonical URL",
    "Keep canonical URL output stable between raw and rendered HTML so indexing signals remain consistent.",
    [sources.javascriptSeo, sources.canonicalization],
  ),
  rule(
    "technical.rendered_primary_heading_missing",
    "technical",
    "P1",
    "Rendered HTML removes the primary heading",
    "Ensure the rendered page preserves the primary heading that communicates page purpose.",
    [sources.javascriptSeo, sources.helpfulContent],
  ),
  rule(
    "technical.rendered_structured_data_lost",
    "technical",
    "P2",
    "Rendered HTML removes structured data",
    "Preserve structured data through rendering and hydration so eligible markup remains available.",
    [sources.javascriptSeo, sources.structuredDataIntro, sources.structuredDataPolicies],
  ),
```

Do not add a second `technical.rendered_content_missing` or `technical.raw_rendered_mismatch`; those already exist.

- [ ] **Step 4: Run registry tests to verify pass**

Run:

```bash
node --test packages/cli/test/rules.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Verify `explain-rule` for a new rule**

Run:

```bash
node packages/cli/src/cli.mjs explain-rule technical.rendered_canonical_changed
```

Expected: JSON output with `"id": "technical.rendered_canonical_changed"` and at least one Google Search Central source URL.

- [ ] **Step 6: Commit rule registry**

Run:

```bash
git add packages/cli/src/rules.mjs packages/cli/test/rules.test.mjs
git commit -m "feat: register render parity rules"
```

## Task 3: Integrate Render Parity Into Page Findings

**Files:**
- Modify: `packages/cli/src/rule-engine.mjs`
- Modify: `packages/cli/test/rule-engine.test.mjs`

- [ ] **Step 1: Write failing page-level rule tests**

Append these tests to `packages/cli/test/rule-engine.test.mjs`:

```js
const renderedSnapshotFor = (rawHtml, renderedHtml, overrides = {}) => {
  const base = snapshotFor(rawHtml, overrides);
  return {
    ...base,
    render: {
      status: "rendered",
      renderedHash: "rendered",
      evidence: extractHtmlEvidence(renderedHtml, base.finalUrl),
      textDeltaCharacters:
        extractHtmlEvidence(renderedHtml, base.finalUrl).counts.visibleTextCharacters -
        base.evidence.counts.visibleTextCharacters,
    },
  };
};

test("flags rendered metadata and canonical changes", () => {
  const rawHtml = `
    <html>
      <head>
        <title>Raw Product Title</title>
        <meta name="description" content="Raw product description">
        <link rel="canonical" href="https://example.com/product">
      </head>
      <body><h1>Product</h1><p>${"Useful product content ".repeat(40)}</p></body>
    </html>
  `;
  const renderedHtml = `
    <html>
      <head>
        <title>Client Product Title</title>
        <meta name="description" content="Client product description">
        <link rel="canonical" href="https://example.com/client-product">
      </head>
      <body><h1>Product</h1><p>${"Useful product content ".repeat(40)}</p></body>
    </html>
  `;

  const findings = evaluatePage(renderedSnapshotFor(rawHtml, renderedHtml));
  const ids = findings.map((finding) => finding.ruleId);
  assert.ok(ids.includes("technical.rendered_title_changed"));
  assert.ok(ids.includes("technical.rendered_description_changed"));
  assert.ok(ids.includes("technical.rendered_canonical_changed"));

  const canonical = findings.find((finding) => finding.ruleId === "technical.rendered_canonical_changed");
  assert.equal(canonical.severity, "P1");
  assert.equal(canonical.owner, "Engineering");
  assert.deepEqual(canonical.evidence, ["$.pages[0].evidence.canonical", "$.pages[0].render.evidence.canonical"]);
});

test("flags rendered primary heading and structured data loss", () => {
  const rawHtml = `
    <html>
      <head>
        <title>Organization</title>
        <meta name="description" content="Organization profile">
        <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Example Org"}</script>
      </head>
      <body><h1>Example Org</h1><p>${"Useful organization content ".repeat(40)}</p></body>
    </html>
  `;
  const renderedHtml = `
    <html>
      <head>
        <title>Organization</title>
        <meta name="description" content="Organization profile">
      </head>
      <body><p>${"Useful organization content ".repeat(40)}</p></body>
    </html>
  `;

  const findings = evaluatePage(renderedSnapshotFor(rawHtml, renderedHtml));
  const ids = findings.map((finding) => finding.ruleId);
  assert.ok(ids.includes("technical.rendered_primary_heading_missing"));
  assert.ok(ids.includes("technical.rendered_structured_data_lost"));

  const structuredData = findings.find((finding) => finding.ruleId === "technical.rendered_structured_data_lost");
  assert.deepEqual(structuredData.evidence, ["$.pages[0].evidence.structuredData", "$.pages[0].render.evidence.structuredData"]);
});

test("flags rendered content missing without duplicate raw rendered mismatch", () => {
  const rawHtml = `
    <html>
      <head><title>Useful Page</title><meta name="description" content="Useful page"></head>
      <body><h1>Useful Page</h1><p>${"Useful content ".repeat(80)}</p></body>
    </html>
  `;
  const renderedHtml = `
    <html>
      <head><title>Useful Page</title><meta name="description" content="Useful page"></head>
      <body><h1>Useful Page</h1><p>Loading.</p></body>
    </html>
  `;

  const findings = evaluatePage(renderedSnapshotFor(rawHtml, renderedHtml));
  const ids = findings.map((finding) => finding.ruleId);
  assert.ok(ids.includes("technical.rendered_content_missing"));
  assert.equal(ids.includes("technical.raw_rendered_mismatch"), false);
});

test("flags broad raw rendered mismatch when rendered content is still substantial", () => {
  const rawHtml = `
    <html>
      <head><title>Useful Page</title><meta name="description" content="Useful page"></head>
      <body><h1>Useful Page</h1><p>${"Raw content ".repeat(100)}</p></body>
    </html>
  `;
  const renderedHtml = `
    <html>
      <head><title>Useful Page</title><meta name="description" content="Useful page"></head>
      <body><h1>Useful Page</h1><p>${"Rendered content ".repeat(40)}</p></body>
    </html>
  `;

  const findings = evaluatePage(renderedSnapshotFor(rawHtml, renderedHtml));
  assert.ok(findings.map((finding) => finding.ruleId).includes("technical.raw_rendered_mismatch"));
});

test("does not emit render parity findings without rendered evidence or when rendered evidence matches", () => {
  const html = `
    <html>
      <head>
        <title>Stable Page</title>
        <meta name="description" content="Stable page">
        <link rel="canonical" href="https://example.com/bad-page">
      </head>
      <body><h1>Stable Page</h1><p>${"Stable content ".repeat(40)}</p></body>
    </html>
  `;

  const withoutRender = evaluatePage(snapshotFor(html));
  const withMatchingRender = evaluatePage(renderedSnapshotFor(html, html));
  const parityIds = [
    "technical.rendered_title_changed",
    "technical.rendered_description_changed",
    "technical.rendered_canonical_changed",
    "technical.rendered_primary_heading_missing",
    "technical.rendered_structured_data_lost",
    "technical.rendered_content_missing",
    "technical.raw_rendered_mismatch",
  ];

  for (const id of parityIds) {
    assert.equal(withoutRender.some((finding) => finding.ruleId === id), false);
    assert.equal(withMatchingRender.some((finding) => finding.ruleId === id), false);
  }
});
```

- [ ] **Step 2: Run page-level tests to verify failure**

Run:

```bash
node --test packages/cli/test/rule-engine.test.mjs
```

Expected: FAIL because render parity facts are not consumed by `evaluatePage`.

- [ ] **Step 3: Integrate render parity facts**

In `packages/cli/src/rule-engine.mjs`, add this import:

```js
import { renderParityFacts } from "./render-parity.mjs";
```

Remove the existing block that directly checks `snapshot.render?.status === "rendered" && snapshot.render.textDeltaCharacters > 300`.

Add this block in the same area where the old raw/rendered mismatch check lived, after canonical checks and before indexability directives:

```js
  for (const parityFact of renderParityFacts(snapshot, pageIndex)) {
    findings.push(createFinding(parityFact.ruleId, snapshot, parityFact.evidence, pageIndex, parityFact.impact));
  }
```

- [ ] **Step 4: Run page-level tests to verify pass**

Run:

```bash
node --test packages/cli/test/rule-engine.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Run focused render helper and rule tests**

Run:

```bash
node --test packages/cli/test/render-parity.test.mjs packages/cli/test/rule-engine.test.mjs packages/cli/test/rules.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit rule-engine integration**

Run:

```bash
git add packages/cli/src/rule-engine.mjs packages/cli/test/rule-engine.test.mjs
git commit -m "feat: emit render parity findings"
```

## Task 4: Add End-To-End Injected Renderer Coverage

**Files:**
- Modify: `packages/cli/test/audit.test.mjs`

- [ ] **Step 1: Write audit integration regression test**

Append this test to `packages/cli/test/audit.test.mjs`:

```js
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
```

- [ ] **Step 2: Run audit test to verify pass through the public audit path**

Run:

```bash
node --test packages/cli/test/audit.test.mjs
```

Expected: PASS because Task 3 already made the rule behavior available and this test proves it through `runAudit`.

- [ ] **Step 3: Run focused render parity tests with audit coverage**

Run:

```bash
node --test packages/cli/test/render-parity.test.mjs packages/cli/test/rule-engine.test.mjs packages/cli/test/audit.test.mjs
```

Expected: PASS.

- [ ] **Step 4: Commit audit coverage**

Run:

```bash
git add packages/cli/test/audit.test.mjs
git commit -m "test: cover render parity audit output"
```

## Task 5: Update Validation And User-Facing Docs

**Files:**
- Modify: `scripts/validate-skill.mjs`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Add validation coverage for new files**

In `scripts/validate-skill.mjs`, add these entries to `requiredFiles` near the related source and test files:

```js
  "packages/cli/src/render-parity.mjs",
```

and:

```js
  "packages/cli/test/render-parity.test.mjs",
```

- [ ] **Step 2: Add changelog entry**

In `CHANGELOG.md`, under `## Unreleased - 2026-05-18`, add:

```md
- Added Phase D.1 render parity findings for explicitly rendered audits, including changed title, description, canonical, missing rendered heading/content, and structured-data loss checks.
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
rg -n "Phase D.1 render parity|render-parity.mjs|render-parity.test.mjs" CHANGELOG.md scripts/validate-skill.mjs
```

Expected: output includes the changelog entry and both validation file entries.

- [ ] **Step 5: Commit validation and docs**

Run:

```bash
git add scripts/validate-skill.mjs CHANGELOG.md
git commit -m "docs: record render parity rule pack"
```

## Task 6: Final Verification And Review

**Files:**
- Read-only verification across the repository.

- [ ] **Step 1: Run focused test suite**

Run:

```bash
node --test packages/cli/test/render-parity.test.mjs packages/cli/test/rules.test.mjs packages/cli/test/rule-engine.test.mjs packages/cli/test/audit.test.mjs
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

- render parity helper correctness
- false-positive risk
- evidence path stability
- no default rendering behavior changes
- no ranking overclaims
- validation coverage

- [ ] **Step 7: Fix review findings**

If review returns findings, implement only the requested fixes, rerun focused tests plus the relevant full verification command, and commit with a focused message.

- [ ] **Step 8: Finish branch**

Use `superpowers:finishing-a-development-branch` after review and verification pass. Present merge or PR options to the user.

## Completion Checklist

- [ ] `packages/cli/src/render-parity.mjs` exists and is pure.
- [ ] `packages/cli/test/render-parity.test.mjs` covers helper behavior and false positives.
- [ ] New render parity rule IDs are registered with expected severities.
- [ ] `evaluatePage` emits render parity findings only when rendered evidence exists.
- [ ] `technical.rendered_content_missing` suppresses duplicate broad `technical.raw_rendered_mismatch` for near-total content loss.
- [ ] Injected renderer audit coverage proves end-to-end behavior without Playwright.
- [ ] `scripts/validate-skill.mjs` protects new source and test files.
- [ ] `CHANGELOG.md` records Phase D.1 without claiming measured ranking impact.
- [ ] `npm test`, `npm run validate`, and `git diff --check` pass.
