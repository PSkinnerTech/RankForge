import fs from "node:fs";

const requiredFiles = [
  "README.md",
  "LICENSE",
  "CHANGELOG.md",
  "package.json",
  "skill/geo-seo-audit/SKILL.md",
  "skill/geo-seo-audit/agents/openai.yaml",
  "skill/geo-seo-audit/references/audit-framework.md",
  "skill/geo-seo-audit/templates/audit-report.md",
  "skill/geo-seo-audit/templates/page-finding.md",
  "skill/geo-seo-audit/templates/redesign-brief.md",
  "examples/fixture-site/index.html",
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

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, requiredFiles: requiredFiles.length, sourcePages: manifest.pages.length, frameworkGoogleCitations: googleUrlCount }, null, 2));
