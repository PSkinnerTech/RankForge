import fs from "node:fs";

const requiredFiles = [
  "README.md",
  "LICENSE",
  "CHANGELOG.md",
  "package.json",
  "docs/prd-deterministic-audit-cli.md",
  "docs/release-checklist.md",
  "docs/superpowers/plans/2026-05-18-developer-repo-audit-completion.md",
  "docs/superpowers/plans/2026-05-18-repo-audit-framework-maturity.md",
  "docs/superpowers/specs/2026-05-18-developer-repo-audit-completion-design.md",
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
  "packages/cli/src/render-parity.mjs",
  "packages/cli/src/robots.mjs",
  "packages/cli/src/sitemap.mjs",
  "packages/cli/src/snapshot.mjs",
  "packages/cli/src/audit.mjs",
  "packages/cli/src/crawl.mjs",
  "packages/cli/src/repo-audit.mjs",
  "packages/cli/src/repo-detect.mjs",
  "packages/cli/src/repo-findings.mjs",
  "packages/cli/src/repo-manifests.mjs",
  "packages/cli/src/repo-process.mjs",
  "packages/cli/src/repo-routes.mjs",
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
  "packages/cli/test/render-parity.test.mjs",
  "packages/cli/test/repo-audit.test.mjs",
  "packages/cli/test/repo-detect.test.mjs",
  "packages/cli/test/repo-manifests.test.mjs",
  "packages/cli/test/repo-process.test.mjs",
  "packages/cli/test/repo-routes.test.mjs",
  "examples/fixture-repos/static-basic/dist/index.html",
  "examples/fixture-repos/static-basic/dist/about/index.html",
  "examples/fixture-repos/static-basic/dist/robots.txt",
  "examples/fixture-repos/static-basic/dist/sitemap.xml",
  "examples/fixture-repos/npm-preview/package.json",
  "examples/fixture-repos/npm-preview/server.mjs",
  "examples/fixture-repos/npm-preview/site/index.html",
  "examples/fixture-repos/npm-preview/site/about.html",
  "examples/fixture-repos/vite-basic/package.json",
  "examples/fixture-repos/vite-basic/build.mjs",
  "examples/fixture-repos/vite-basic/src/index.html",
  "examples/fixture-repos/vite-basic/src/about.html",
  "examples/fixture-repos/vite-basic/routes.txt",
  "examples/fixture-repos/next-basic/package.json",
  "examples/fixture-repos/next-basic/build.mjs",
  "examples/fixture-repos/next-basic/routes.txt",
  "examples/fixture-repos/next-basic/src/index.html",
  "examples/fixture-repos/next-basic/src/about.html",
  "examples/fixture-repos/astro-basic/package.json",
  "examples/fixture-repos/astro-basic/build.mjs",
  "examples/fixture-repos/astro-basic/routes.txt",
  "examples/fixture-repos/astro-basic/src/index.html",
  "examples/fixture-repos/astro-basic/src/services.html",
  "examples/golden/repo-framework-summary.json",
  "examples/golden/repo-static-summary.json",
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
