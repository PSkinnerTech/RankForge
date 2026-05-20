import test from "node:test";
import assert from "node:assert/strict";
import { renderParityFacts } from "../src/render-parity.mjs";

const baseEvidence = () => ({
  title: "Example title",
  description: "Example description",
  canonical: "https://example.com/page/",
  h1: ["Primary heading"],
  structuredData: [
    { data: { "@type": "Organization", name: "Example" } },
  ],
  schemaTypes: ["Organization"],
  counts: {
    visibleTextCharacters: 400,
  },
});

const snapshot = ({ renderStatus = "rendered", evidence = baseEvidence(), renderEvidence = baseEvidence() } = {}) => ({
  evidence,
  render: {
    status: renderStatus,
    evidence: renderEvidence,
  },
});

test("returns no facts when rendering was not requested", () => {
  assert.deepEqual(renderParityFacts(snapshot({ renderStatus: "not_requested" }), 0), []);
});

test("returns no facts when rendered evidence is absent", () => {
  assert.deepEqual(renderParityFacts({
    evidence: baseEvidence(),
    render: {
      status: "rendered",
    },
  }), []);
});

test("detects rendered title changes", () => {
  const facts = renderParityFacts(snapshot({
    renderEvidence: {
      ...baseEvidence(),
      title: "Different title",
    },
  }), 2);

  assert.equal(facts[0].ruleId, "technical.rendered_title_changed");
  assert.deepEqual(facts[0].evidence, [
    "$.pages[2].evidence.title",
    "$.pages[2].render.evidence.title",
  ]);
});

test("detects rendered title removal", () => {
  const facts = renderParityFacts(snapshot({
    renderEvidence: {
      ...baseEvidence(),
      title: "",
    },
  }));

  assert.equal(facts[0].ruleId, "technical.rendered_title_changed");
});

test("detects rendered description removal", () => {
  const facts = renderParityFacts(snapshot({
    renderEvidence: {
      ...baseEvidence(),
      description: null,
    },
  }));

  assert.equal(facts[0].ruleId, "technical.rendered_description_changed");
});

test("detects rendered canonical changes while treating equivalent formatting as equal", () => {
  assert.deepEqual(renderParityFacts(snapshot({
    evidence: {
      ...baseEvidence(),
      canonical: "https://example.com/page/",
    },
    renderEvidence: {
      ...baseEvidence(),
      canonical: "https://example.com/page",
    },
  })), []);

  const facts = renderParityFacts(snapshot({
    renderEvidence: {
      ...baseEvidence(),
      canonical: "https://example.com/other",
    },
  }));

  assert.equal(facts[0].ruleId, "technical.rendered_canonical_changed");
});

test("detects rendered canonical removal", () => {
  const facts = renderParityFacts(snapshot({
    renderEvidence: {
      ...baseEvidence(),
      canonical: "",
    },
  }));

  assert.equal(facts[0].ruleId, "technical.rendered_canonical_changed");
});

test("detects rendered primary heading removal", () => {
  const facts = renderParityFacts(snapshot({
    renderEvidence: {
      ...baseEvidence(),
      h1: [],
    },
  }), 1);

  assert.equal(facts[0].ruleId, "technical.rendered_primary_heading_missing");
  assert.deepEqual(facts[0].evidence, [
    "$.pages[1].evidence.h1",
    "$.pages[1].render.evidence.h1",
  ]);
});

test("detects rendered structured data type loss", () => {
  const facts = renderParityFacts(snapshot({
    renderEvidence: {
      ...baseEvidence(),
      structuredData: [],
      schemaTypes: [],
    },
  }));

  assert.equal(facts[0].ruleId, "technical.rendered_structured_data_lost");
  assert.match(facts[0].impact, /Organization/);
});

test("ignores invalid raw structured data when checking structured data loss", () => {
  const facts = renderParityFacts(snapshot({
    evidence: {
      ...baseEvidence(),
      structuredData: [
        { parseError: true, rawPreview: "{bad json}" },
      ],
      schemaTypes: [],
    },
    renderEvidence: {
      ...baseEvidence(),
      structuredData: [],
      schemaTypes: [],
    },
  }));

  assert.deepEqual(facts, []);
});

test("detects rendered content missing before broad text mismatch", () => {
  const facts = renderParityFacts(snapshot({
    renderEvidence: {
      ...baseEvidence(),
      counts: {
        visibleTextCharacters: 120,
      },
    },
  }));

  assert.deepEqual(facts.map((fact) => fact.ruleId), ["technical.rendered_content_missing"]);
});

test("detects broad raw/rendered visible text deltas when not nearly missing", () => {
  const facts = renderParityFacts(snapshot({
    evidence: {
      ...baseEvidence(),
      counts: {
        visibleTextCharacters: 700,
      },
    },
    renderEvidence: {
      ...baseEvidence(),
      counts: {
        visibleTextCharacters: 350,
      },
    },
  }));

  assert.equal(facts.at(-1).ruleId, "technical.raw_rendered_mismatch");
});

test("returns no facts when raw and rendered evidence match", () => {
  assert.deepEqual(renderParityFacts(snapshot()), []);
});
