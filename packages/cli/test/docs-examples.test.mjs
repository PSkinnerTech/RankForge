import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { validateAuditConfig } from "../src/config-schema.mjs";

const extractJsonBlockAfterHeading = (markdown, heading) => {
  const headingIndex = markdown.indexOf(heading);
  assert.notEqual(headingIndex, -1, `missing heading: ${heading}`);

  const afterHeading = markdown.slice(headingIndex + heading.length);
  const match = afterHeading.match(/```json\n([\s\S]*?)\n```/);
  assert.ok(match, `missing JSON block after heading: ${heading}`);

  return JSON.parse(match[1]);
};

test("repo route-list docs describe static HTML and SPA mapped route workflows", () => {
  const docs = fs.readFileSync("docs/repo-audit-route-lists.md", "utf8");

  assert.match(docs, /# Repository Route Lists/);
  assert.match(docs, /\/pricing\/ index\.html/);
  assert.match(docs, /rankforge audit-repo \. --build-command "npm run build" --static-dir dist --route-list routes\.txt/);
  assert.match(docs, /single-page application/);
  assert.match(docs, /does not infer client router source files/);
});

test("repo route-list config example is valid audit config", () => {
  const docs = fs.readFileSync("docs/repo-audit-route-lists.md", "utf8");
  const config = extractJsonBlockAfterHeading(docs, "## Config File Example");

  assert.equal(config.target, ".");
  assert.deepEqual(config.repo, {
    buildCommand: "npm run build",
    staticDir: "dist",
    routeList: "routes.txt",
  });
  assert.deepEqual(validateAuditConfig(config), { ok: true, errors: [] });
});

test("GitHub Actions repo audit example uploads JSON Markdown and HTML artifacts", () => {
  const workflow = fs.readFileSync("docs/examples/github-actions-rankforge-repo-audit.yml", "utf8");

  assert.match(workflow, /name: RankForge Repo Audit/);
  assert.match(workflow, /actions\/checkout@v6/);
  assert.match(workflow, /actions\/setup-node@v6/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run build/);
  assert.match(workflow, /npx --yes rankforge audit-repo \. --static-dir dist --fail-on P1 --out rankforge-audit\.json --markdown rankforge-audit\.md --html rankforge-audit\.html/);
  assert.match(workflow, /actions\/upload-artifact@v6/);
  assert.match(workflow, /rankforge-audit\.json/);
  assert.match(workflow, /rankforge-audit\.md/);
  assert.match(workflow, /rankforge-audit\.html/);
  assert.match(workflow, /steps\.rankforge\.outcome == 'failure'/);
});
