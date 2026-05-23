import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("repo route-list docs describe static HTML and SPA mapped route workflows", () => {
  const docs = fs.readFileSync("docs/repo-audit-route-lists.md", "utf8");

  assert.match(docs, /# Repository Route Lists/);
  assert.match(docs, /\/pricing\/ index\.html/);
  assert.match(docs, /rankforge audit-repo \. --build-command "npm run build" --static-dir dist --route-list routes\.txt/);
  assert.match(docs, /single-page application/);
  assert.match(docs, /does not infer client router source files/);
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
