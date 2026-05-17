import fs from "node:fs";

const requiredFiles = [
  "README.md",
  "LICENSE",
  "CHANGELOG.md",
  "package.json",
  "docs/prd-deterministic-audit-cli.md",
  "packages/cli/package.json",
  "packages/cli/src/index.mjs",
  "packages/cli/src/cli.mjs",
  "packages/cli/src/config-schema.mjs",
  "packages/cli/src/audit-output-schema.mjs",
  "packages/cli/src/finding-task.mjs",
  "packages/cli/src/rules.mjs",
  "packages/cli/src/url-utils.mjs",
  "packages/cli/src/html-extract.mjs",
  "packages/cli/src/render.mjs",
  "packages/cli/src/robots.mjs",
  "packages/cli/src/sitemap.mjs",
  "packages/cli/src/snapshot.mjs",
  "packages/cli/src/audit.mjs",
  "packages/cli/src/crawl.mjs",
  "packages/cli/src/rule-engine.mjs",
  "packages/cli/src/site-rule-engine.mjs",
  "packages/cli/src/integrations.mjs",
  "packages/cli/src/performance.mjs",
  "packages/cli/src/report.mjs",
  "packages/cli/src/structured-data.mjs",
  ".github/workflows/ci.yml",
  ".github/workflows/release.yml",
  "skill/geo-seo-audit/SKILL.md",
  "skill/geo-seo-audit/agents/openai.yaml",
  "skill/geo-seo-audit/references/audit-framework.md",
  "skill/geo-seo-audit/source-map.json",
  "skill/geo-seo-audit/templates/audit-report.md",
  "skill/geo-seo-audit/templates/page-finding.md",
  "skill/geo-seo-audit/templates/redesign-brief.md",
  "examples/audit.config.json",
  "examples/fixture-site/index.html",
  "examples/fixture-sites/known-issues/index.html",
  "examples/fixture-sites/known-issues/about.html",
  "examples/fixture-sites/known-issues/contact.html",
  "examples/fixture-sites/known-issues/product.html",
  "examples/fixture-sites/known-issues/duplicate-a.html",
  "examples/fixture-sites/known-issues/duplicate-b.html",
  "examples/fixture-sites/known-issues/thin.html",
  "examples/fixture-sites/known-issues/bad-json.html",
  "examples/fixture-sites/known-issues/canonical-alt.html",
  "examples/fixture-sites/known-issues/robots.txt",
  "examples/fixture-sites/known-issues/sitemap.xml",
  "examples/golden/known-issues-summary.json",
  "examples/golden/known-issues-report.md",
  "examples/audits/example-audit.md",
  "references/source-manifest.json",
  "references/source-manifest.md",
  "scripts/collect-page-snapshot.mjs",
  "scripts/crawl-google-corpus.mjs",
];

const errors = [];
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) errors.push("Missing required file: " + file);
}

const skill = fs.readFileSync("skill/geo-seo-audit/SKILL.md", "utf8");
if (!/^---\nname: geo-seo-audit\n/m.test(skill)) errors.push("SKILL.md frontmatter is missing name.");
if (!/Google Search eligibility/.test(skill)) errors.push("SKILL.md description/body is too weak.");

const framework = fs.readFileSync("skill/geo-seo-audit/references/audit-framework.md", "utf8");
const googleUrlCount = (framework.match(/https:\/\/developers\.google\.com\/search\/docs\//g) || []).length;
if (googleUrlCount < 20) errors.push("Audit framework should include at least 20 Google Search Central citations.");

const manifest = JSON.parse(fs.readFileSync("references/source-manifest.json", "utf8"));
if (!Array.isArray(manifest.pages) || manifest.pages.length < 50) errors.push("Source manifest has too few pages.");
if (!manifest.pages.some((page) => page.url && page.url.includes("ai-optimization-guide"))) errors.push("AI optimization guide missing from manifest.");
if (!manifest.pages.some((page) => page.url && page.url.includes("robots-meta-tag"))) errors.push("Robots meta tag guidance missing from manifest.");
if (!manifest.pages.some((page) => page.url && page.url.includes("structured-data/intro-structured-data"))) errors.push("Structured data intro missing from manifest.");

const sourceMap = JSON.parse(fs.readFileSync("skill/geo-seo-audit/source-map.json", "utf8"));
for (const key of ["ai_optimization", "robots_meta", "structured_data_intro", "helpful_content"]) {
  if (!sourceMap[key]) errors.push(`source-map.json missing required source: ${key}`);
}

const { rules } = await import("../packages/cli/src/rules.mjs");
if (!Array.isArray(rules) || rules.length < 25) errors.push("CLI rule taxonomy must include at least 25 rules.");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      requiredFiles: requiredFiles.length,
      sourcePages: manifest.pages.length,
      frameworkGoogleCitations: googleUrlCount,
      sourceMapEntries: Object.keys(sourceMap).length,
      rules: rules.length,
    },
    null,
    2,
  ),
);
