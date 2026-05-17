import fs from "node:fs";
import path from "node:path";
import { runAudit } from "./audit.mjs";
import { readAuditConfig, resolveAuditConfigPaths, validateAuditConfig } from "./config-schema.mjs";
import { generateMarkdownReport } from "./report.mjs";
import { getRule } from "./rules.mjs";
import { collectSnapshot } from "./snapshot.mjs";

const version = "openclaw-geo-seo-audit 0.2.0";

const help = `Usage: openclaw-geo-seo-audit <command> [options]

Commands:
  audit <target>                 Run a deterministic GEO/SEO readiness audit
  snapshot <target>              Capture single-page audit evidence
  validate-config <file>         Validate an audit.config.json file
  explain-rule <rule-id>         Print rule metadata and citations as JSON

Audit options:
  --config <file>                Read audit options from an audit.config.json file
  --mode full|sample|single      Crawl mode
  --max-pages <n>                Maximum pages to crawl
  --max-depth <n>                Maximum crawl depth
  --sitemap <url>                Seed crawl with a sitemap URL
  --url-list <file>              Audit URLs listed one per line
  --respect-robots true|false    Skip robots-disallowed URLs when true
  --render auto|always|never     Render pages when Playwright or a renderer is available
  --search-console <file>        Import Google Search Console CSV evidence
  --serp <file>                  Import SERP JSON evidence
  --ai-answers <file>            Import AI answer JSON evidence
  --lighthouse <file>            Import Lighthouse JSON performance evidence
  --fail-on <severity>           Return exit code 2 when findings include P0, P1, P2, or P3 threshold
  --out <file>                   Write audit JSON
  --markdown <file>              Write Markdown report
  --help                         Show this help
  --version                      Show CLI version
`;

const writeJson = (io, value) => {
  io.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
};

const optionValue = (options, name) => {
  const index = options.indexOf(name);
  return index === -1 ? null : options[index + 1] || null;
};

const auditOptionsWithValues = new Set([
  "--config",
  "--mode",
  "--max-pages",
  "--max-depth",
  "--sitemap",
  "--url-list",
  "--respect-robots",
  "--render",
  "--search-console",
  "--serp",
  "--ai-answers",
  "--lighthouse",
  "--fail-on",
  "--out",
  "--markdown",
]);

const severityRank = { P0: 0, P1: 1, P2: 2, P3: 3 };

const failsThreshold = (findings, threshold) => {
  if (!threshold) return false;
  if (!(threshold in severityRank)) throw new Error("--fail-on must be one of: P0, P1, P2, P3");
  return (findings || []).some((finding) => severityRank[finding.severity] <= severityRank[threshold]);
};

const splitAuditArgs = (args) => {
  const options = [];
  let target = null;

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (auditOptionsWithValues.has(arg)) {
      options.push(arg);
      if (index + 1 < args.length) options.push(args[++index]);
      continue;
    }
    if (arg.startsWith("--")) {
      options.push(arg);
      continue;
    }
    if (!target) target = arg;
    else options.push(arg);
  }

  return { target, options };
};

const numberOption = (options, name, fallback) => {
  const value = optionValue(options, name);
  return value ? Number(value) : fallback;
};

const mergeAuditConfig = (target, options) => {
  const configPath = optionValue(options, "--config");
  const baseDir = configPath ? path.dirname(path.resolve(configPath)) : process.cwd();
  const fileConfig = configPath ? resolveAuditConfigPaths(readAuditConfig(configPath), baseDir) : {};
  const merged = {
    ...fileConfig,
    target: target || fileConfig.target,
  };

  const mode = optionValue(options, "--mode");
  const maxPages = optionValue(options, "--max-pages");
  const maxDepth = optionValue(options, "--max-depth");
  const sitemap = optionValue(options, "--sitemap");
  const urlList = optionValue(options, "--url-list");
  const respectRobots = optionValue(options, "--respect-robots");
  const render = optionValue(options, "--render");
  const searchConsole = optionValue(options, "--search-console");
  const serp = optionValue(options, "--serp");
  const aiAnswers = optionValue(options, "--ai-answers");
  const lighthouse = optionValue(options, "--lighthouse");

  merged.crawl = {
    ...(fileConfig.crawl || {}),
    mode: mode || fileConfig.crawl?.mode || "single",
    maxPages: numberOption(options, "--max-pages", fileConfig.crawl?.maxPages),
    maxDepth: numberOption(options, "--max-depth", fileConfig.crawl?.maxDepth),
  };
  if (maxPages === null && fileConfig.crawl?.maxPages === undefined) delete merged.crawl.maxPages;
  if (maxDepth === null && fileConfig.crawl?.maxDepth === undefined) delete merged.crawl.maxDepth;

  merged.render = {
    ...(fileConfig.render || {}),
    mode: render || fileConfig.render?.mode || "never",
  };

  merged.integrations = {
    ...(fileConfig.integrations || {}),
    searchConsole: searchConsole || fileConfig.integrations?.searchConsole || null,
    serp: serp || fileConfig.integrations?.serp || null,
    aiAnswers: aiAnswers || fileConfig.integrations?.aiAnswers || null,
    lighthouse: lighthouse || fileConfig.integrations?.lighthouse || null,
  };

  if (sitemap) merged.sitemap = sitemap;
  if (urlList) merged.urlList = urlList;
  if (respectRobots === "true") merged.respectRobots = true;
  if (respectRobots === "false") merged.respectRobots = false;

  const validation = validateAuditConfig(merged, { baseDir, checkFiles: Boolean(configPath) });
  if (!validation.ok) throw new Error(validation.errors.join("\n"));

  return merged;
};

export const runCli = async (args, io = { stdout: process.stdout, stderr: process.stderr }) => {
  const [command, ...rest] = args;

  if (!command || command === "--help" || command === "-h") {
    io.stdout.write(help);
    return 0;
  }

  if (command === "--version" || command === "-v") {
    io.stdout.write(`${version}\n`);
    return 0;
  }

  if (command === "validate-config") {
    const [filePath] = rest;
    if (!filePath) {
      io.stderr.write("validate-config requires a config file path.\n");
      return 1;
    }

    try {
      const baseDir = path.dirname(path.resolve(filePath));
      const config = resolveAuditConfigPaths(readAuditConfig(filePath), baseDir);
      writeJson(io, validateAuditConfig(config, { baseDir, checkFiles: true }));
      return 0;
    } catch (error) {
      writeJson(io, { ok: false, errors: [error.message] });
      return 1;
    }
  }

  if (command === "snapshot") {
    const [target] = rest;
    if (!target) {
      io.stderr.write("snapshot requires a target URL or file path.\n");
      return 1;
    }

    try {
      writeJson(io, await collectSnapshot(target));
      return 0;
    } catch (error) {
      io.stderr.write(`${error.message}\n`);
      return 1;
    }
  }

  if (command === "audit") {
    const { target, options } = splitAuditArgs(rest);
    const configPath = optionValue(options, "--config");
    if (!target && !configPath) {
      io.stderr.write("audit requires a target URL or file path.\n");
      return 1;
    }

    try {
      const output = await runAudit(mergeAuditConfig(target, options));
      const outIndex = options.indexOf("--out");
      const markdownIndex = options.indexOf("--markdown");
      const failOn = optionValue(options, "--fail-on");
      const failedThreshold = failsThreshold(output.findings, failOn);
      const result = { ok: true };

      if (outIndex !== -1) {
        const outPath = options[outIndex + 1];
        if (!outPath) {
          io.stderr.write("--out requires a file path.\n");
          return 1;
        }
        fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);
        result.out = outPath;
      }

      if (markdownIndex !== -1) {
        const markdownPath = options[markdownIndex + 1];
        if (!markdownPath) {
          io.stderr.write("--markdown requires a file path.\n");
          return 1;
        }
        fs.writeFileSync(markdownPath, generateMarkdownReport(output));
        result.markdown = markdownPath;
      }

      if (outIndex !== -1 || markdownIndex !== -1) {
        if (failedThreshold) result.failedThreshold = failOn;
        writeJson(io, result);
        return failedThreshold ? 2 : 0;
      }

      writeJson(io, output);
      return failedThreshold ? 2 : 0;
    } catch (error) {
      io.stderr.write(`${error.message}\n`);
      return 1;
    }
  }

  if (command === "explain-rule") {
    const [ruleId] = rest;
    if (!ruleId) {
      io.stderr.write("explain-rule requires a rule ID.\n");
      return 1;
    }

    const rule = getRule(ruleId);
    if (!rule) {
      io.stderr.write(`Unknown rule: ${ruleId}\n`);
      return 1;
    }

    writeJson(io, rule);
    return 0;
  }

  io.stderr.write(`Unknown command: ${command}\n`);
  return 1;
};
