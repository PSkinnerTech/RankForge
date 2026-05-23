import test from "node:test";
import assert from "node:assert/strict";
import { guidanceForSourceFinding, sourceFinding } from "../src/repo-findings.mjs";

const supportedIds = [
  "repo.build_failed",
  "repo.build_timeout",
  "repo.build_unavailable",
  "repo.static_dir_missing",
  "repo.static_route_unlisted",
  "repo.static_routes_missing",
  "repo.route_manifest_invalid",
  "repo.route_list_missing",
  "repo.route_list_empty",
  "repo.route_list_entry_missing",
  "repo.route_list_entry_not_html",
  "repo.route_list_entry_outside_static_dir",
  "repo.preview_unreachable",
  "repo.robots_missing",
  "repo.sitemap_missing",
  "repo.manifest_route_missing",
  "repo.audit_path_missing",
];

test("repo source finding guidance exists for supported finding IDs", () => {
  for (const id of supportedIds) {
    const guidance = guidanceForSourceFinding(id);
    assert.ok(guidance.inspectNext.length > 0, `${id} should include inspect-next targets`);
    assert.ok(guidance.developerAction, `${id} should include a developer action`);
    assert.ok(guidance.acceptanceCriteria.length > 0, `${id} should include acceptance criteria`);
  }
});

test("sourceFinding attaches additive developer guidance by default", () => {
  const finding = sourceFinding({
    id: "repo.static_dir_missing",
    message: "Configured static output directory does not exist or is not a directory.",
    evidence: "dist",
    recommendation: "Run the repository build or pass an existing static output directory.",
  });

  assert.equal(finding.id, "repo.static_dir_missing");
  assert.deepEqual(finding.inspectNext, ["configured static output directory", "build command", "audit.config.json"]);
  assert.match(finding.developerAction, /Run the explicit build command/);
  assert.ok(finding.acceptanceCriteria.some((item) => item.includes("repo.static_dir_missing")));
});

test("build unavailable guidance matches restricted command execution", () => {
  const finding = sourceFinding({
    id: "repo.build_unavailable",
    message: "Build command execution is disabled in restricted security mode.",
    evidence: "npm run build",
    recommendation: "Use local security mode for trusted repository builds, or audit prebuilt static output.",
  });

  assert.deepEqual(finding.inspectNext, ["security mode", "build command", "prebuilt static output"]);
  assert.match(finding.developerAction, /local security mode/);
  assert.match(finding.developerAction, /prebuilt static output/);
});

test("manifest route guidance points to framework route output", () => {
  const finding = sourceFinding({
    id: "repo.manifest_route_missing",
    message: "Framework route manifest includes a route missing from generated static output.",
    evidence: "/missing/",
    recommendation: "Update the framework export or route manifest so generated routes match.",
  });

  assert.deepEqual(finding.inspectNext, [
    "framework route manifest",
    "generated static output",
    "framework route configuration",
  ]);
  assert.match(finding.developerAction, /framework build\/export configuration/);
  assert.doesNotMatch(finding.developerAction, /HTML head links/);
});

test("sourceFinding allows call sites to override developer guidance", () => {
  const finding = sourceFinding({
    id: "repo.audit_path_missing",
    message: "Repository audit needs an audit path.",
    evidence: "/repo",
    recommendation: "Pass a static directory or preview server.",
    inspectNext: ["custom file"],
    developerAction: "Choose the custom audit path.",
    acceptanceCriteria: ["The custom audit path is used."],
  });

  assert.deepEqual(finding.inspectNext, ["custom file"]);
  assert.equal(finding.developerAction, "Choose the custom audit path.");
  assert.deepEqual(finding.acceptanceCriteria, ["The custom audit path is used."]);
});

test("sourceFinding returns fresh guidance arrays", () => {
  const firstFinding = sourceFinding({
    id: "repo.static_dir_missing",
    message: "Configured static output directory does not exist or is not a directory.",
    evidence: "dist",
    recommendation: "Run the repository build or pass an existing static output directory.",
  });
  firstFinding.inspectNext.push("mutated target");

  const secondFinding = sourceFinding({
    id: "repo.static_dir_missing",
    message: "Configured static output directory does not exist or is not a directory.",
    evidence: "dist",
    recommendation: "Run the repository build or pass an existing static output directory.",
  });

  assert.ok(!secondFinding.inspectNext.includes("mutated target"));
});

test("guidanceForSourceFinding returns fresh guidance arrays", () => {
  const firstGuidance = guidanceForSourceFinding("repo.static_dir_missing");
  firstGuidance.inspectNext.push("mutated target");
  firstGuidance.acceptanceCriteria.push("mutated criteria");

  const secondGuidance = guidanceForSourceFinding("repo.static_dir_missing");

  assert.ok(!secondGuidance.inspectNext.includes("mutated target"));
  assert.ok(!secondGuidance.acceptanceCriteria.includes("mutated criteria"));
});
