import fs from "node:fs";
import path from "node:path";
import { runAudit } from "./audit.mjs";
import { readAuditConfig, resolveAuditConfigPaths, validateAuditConfig } from "./config-schema.mjs";
import { generateHtmlReport, generateMarkdownReport } from "./report.mjs";
import { runRepoAudit } from "./repo-audit.mjs";
import { detectRepo } from "./repo-detect.mjs";
import { getRule } from "./rules.mjs";
import { collectSnapshot } from "./snapshot.mjs";

const version = "rankforge 0.3.0";

const help = `Usage: rankforge <command> [options]

Commands:
  audit <target>                 Run a deterministic GEO/SEO readiness audit
  snapshot <target>              Capture single-page audit evidence
  detect-repo [path]             Inspect source repository audit metadata; defaults to current directory
  audit-repo <path>              Audit static output or explicit preview server from a source repo
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
  --security local|restricted    Apply local CLI or restricted wrapper network/file policy
  --timeout-ms <n>               Per-request timeout in milliseconds
  --max-html-bytes <n>           Maximum HTML bytes to read per page
  --max-text-bytes <n>           Maximum robots/sitemap text bytes to read
  --max-file-bytes <n>           Maximum URL-list file bytes to read
  --max-integration-bytes <n>    Maximum imported evidence file bytes to read
  --fail-on <severity>           Return exit code 2 when findings include P0, P1, P2, or P3 threshold
  --out <file>                   Write audit JSON
  --markdown <file>              Write Markdown report
  --html <file>                  Write standalone HTML report
  --help                         Show this help
  --version                      Show CLI version

Repo audit options:
  --config <file>                Read repo audit options from an audit.config.json file
  --static-dir <dir>             Audit prebuilt static HTML output relative to repo path
  --build-command <command>      Run an explicit local build command before auditing static output
  --max-build-ms <n>             Maximum time to wait for build command completion
  --preview-command <command>    Start an explicit local preview server command
  --preview-url <url>            URL to wait for and audit after preview startup
  --max-preview-ms <n>           Maximum time to wait for preview startup
  --route-list <file>            Audit generated routes listed one per line
  --mode full|sample|single      Crawl mode for preview audits
  --max-pages <n>                Maximum pages to crawl for preview audits
  --max-depth <n>                Maximum crawl depth for preview audits
  --security local|restricted    Apply local CLI or restricted wrapper network/file policy
  --fail-on <severity>           Return exit code 2 when repo or page findings meet P0, P1, P2, or P3 threshold
  --out <file>                   Write repository audit JSON
  --markdown <file>              Write repository audit Markdown report
  --html <file>                  Write repository audit HTML report
`;

const writeJson = (io, value) => {
  io.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
};

const optionValue = (options, name) => {
  const index = options.indexOf(name);
  return index === -1 ? null : options[index + 1] || null;
};

const outputFileOption = (options, name) => {
  const index = options.indexOf(name);
  if (index === -1) return null;
  const value = options[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a file path.`);
  return value;
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
  "--security",
  "--timeout-ms",
  "--max-html-bytes",
  "--max-text-bytes",
  "--max-file-bytes",
  "--max-integration-bytes",
  "--fail-on",
  "--out",
  "--markdown",
  "--html",
]);

const repoOptionsWithValues = new Set([
  "--config",
  "--static-dir",
  "--build-command",
  "--max-build-ms",
  "--preview-command",
  "--preview-url",
  "--max-preview-ms",
  "--route-list",
  "--mode",
  "--max-pages",
  "--max-depth",
  "--security",
  "--fail-on",
  "--out",
  "--markdown",
  "--html",
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

const splitRepoArgs = (args) => {
  const options = [];
  let repoPath = null;

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (repoOptionsWithValues.has(arg)) {
      options.push(arg);
      if (index + 1 < args.length && !args[index + 1].startsWith("--")) options.push(args[++index]);
      continue;
    }
    if (arg.startsWith("--")) {
      options.push(arg);
      continue;
    }
    if (!repoPath) repoPath = arg;
    else options.push(arg);
  }

  return { repoPath, options };
};

const numberOption = (options, name, fallback) => {
  const value = optionValue(options, name);
  return value ? Number(value) : fallback;
};

const repoOptionValue = (options, name, fallback = null, errorMessage = `${name} requires a value.`) => {
  const index = options.indexOf(name);
  if (index === -1) return fallback;
  const value = options[index + 1];
  if (!value || value.startsWith("--")) throw new Error(errorMessage);
  return value;
};

const repoEnumOption = (options, name, fallback, allowedValues) => {
  const value = repoOptionValue(options, name, fallback);
  if (!allowedValues.includes(value)) throw new Error(`${name} must be one of: ${allowedValues.join(", ")}`);
  return value;
};

const repoNumberOption = (options, name, fallback, { minimum, minimumDescription }) => {
  const index = options.indexOf(name);
  if (index === -1) return fallback;
  const value = repoOptionValue(options, name);
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`${name} must be a number.`);
  if (!Number.isInteger(number) || number < minimum) {
    throw new Error(`${name} must be a ${minimumDescription}.`);
  }
  return number;
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
  const security = optionValue(options, "--security");
  const timeoutMs = optionValue(options, "--timeout-ms");
  const maxHtmlBytes = optionValue(options, "--max-html-bytes");
  const maxTextBytes = optionValue(options, "--max-text-bytes");
  const maxFileBytes = optionValue(options, "--max-file-bytes");
  const maxIntegrationBytes = optionValue(options, "--max-integration-bytes");

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

  merged.security = {
    ...(fileConfig.security || {}),
    mode: security || fileConfig.security?.mode || "local",
  };

  merged.limits = {
    ...(fileConfig.limits || {}),
    timeoutMs: numberOption(options, "--timeout-ms", fileConfig.limits?.timeoutMs),
    maxHtmlBytes: numberOption(options, "--max-html-bytes", fileConfig.limits?.maxHtmlBytes),
    maxTextBytes: numberOption(options, "--max-text-bytes", fileConfig.limits?.maxTextBytes),
    maxFileBytes: numberOption(options, "--max-file-bytes", fileConfig.limits?.maxFileBytes),
    maxIntegrationBytes: numberOption(options, "--max-integration-bytes", fileConfig.limits?.maxIntegrationBytes),
  };
  if (timeoutMs === null && fileConfig.limits?.timeoutMs === undefined) delete merged.limits.timeoutMs;
  if (maxHtmlBytes === null && fileConfig.limits?.maxHtmlBytes === undefined) delete merged.limits.maxHtmlBytes;
  if (maxTextBytes === null && fileConfig.limits?.maxTextBytes === undefined) delete merged.limits.maxTextBytes;
  if (maxFileBytes === null && fileConfig.limits?.maxFileBytes === undefined) delete merged.limits.maxFileBytes;
  if (maxIntegrationBytes === null && fileConfig.limits?.maxIntegrationBytes === undefined) {
    delete merged.limits.maxIntegrationBytes;
  }

  if (sitemap) merged.sitemap = sitemap;
  if (urlList) merged.urlList = urlList;
  if (respectRobots === "true") merged.respectRobots = true;
  if (respectRobots === "false") merged.respectRobots = false;

  const validation = validateAuditConfig(merged, { baseDir, checkFiles: Boolean(configPath) });
  if (!validation.ok) throw new Error(validation.errors.join("\n"));

  return merged;
};

const mergeRepoConfig = (repoPath, options) => {
  const configPath = repoOptionValue(options, "--config");
  const baseDir = configPath ? path.dirname(path.resolve(configPath)) : process.cwd();
  const fileConfig = configPath ? resolveAuditConfigPaths(readAuditConfig(configPath), baseDir) : {};
  const repoConfig = fileConfig.repo && typeof fileConfig.repo === "object" && !Array.isArray(fileConfig.repo) ? fileConfig.repo : {};
  const securityMode = repoEnumOption(options, "--security", fileConfig.security?.mode || "local", ["local", "restricted"]);

  const merged = {
    ...fileConfig,
    repoPath,
    staticDir: repoOptionValue(options, "--static-dir", repoConfig.staticDir),
    routeList: repoOptionValue(options, "--route-list", repoConfig.routeList),
    buildCommand: repoOptionValue(options, "--build-command", repoConfig.buildCommand),
    previewCommand: repoOptionValue(options, "--preview-command", repoConfig.previewCommand),
    previewUrl: repoOptionValue(options, "--preview-url", repoConfig.previewUrl),
    maxBuildMs: repoNumberOption(options, "--max-build-ms", repoConfig.maxBuildMs ?? 120000, {
      minimum: 1,
      minimumDescription: "positive integer",
    }),
    maxPreviewMs: repoNumberOption(options, "--max-preview-ms", repoConfig.maxPreviewMs ?? 30000, {
      minimum: 1,
      minimumDescription: "positive integer",
    }),
    crawl: {
      ...(fileConfig.crawl || {}),
      mode: repoEnumOption(options, "--mode", fileConfig.crawl?.mode || "full", ["full", "sample", "single"]),
      maxPages: repoNumberOption(options, "--max-pages", fileConfig.crawl?.maxPages ?? 25, {
        minimum: 1,
        minimumDescription: "positive integer",
      }),
      maxDepth: repoNumberOption(options, "--max-depth", fileConfig.crawl?.maxDepth ?? 2, {
        minimum: 0,
        minimumDescription: "non-negative integer",
      }),
    },
    security: {
      ...(fileConfig.security || {}),
      mode: securityMode,
    },
  };

  if (configPath) {
    const validation = validateAuditConfig(fileConfig, { baseDir, checkFiles: true });
    if (!validation.ok) throw new Error(validation.errors.join("\n"));
  }

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
      const outPath = outputFileOption(options, "--out");
      const markdownPath = outputFileOption(options, "--markdown");
      const htmlPath = outputFileOption(options, "--html");
      const failOn = optionValue(options, "--fail-on");
      const failedThreshold = failsThreshold(output.findings, failOn);
      const result = { ok: true };

      if (outPath) {
        fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);
        result.out = outPath;
      }

      if (markdownPath) {
        fs.writeFileSync(markdownPath, generateMarkdownReport(output));
        result.markdown = markdownPath;
      }

      if (htmlPath) {
        fs.writeFileSync(htmlPath, generateHtmlReport(output));
        result.html = htmlPath;
      }

      if (outPath || markdownPath || htmlPath) {
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

  if (command === "detect-repo") {
    const [repoPath = "."] = rest;
    try {
      writeJson(io, detectRepo(repoPath));
      return 0;
    } catch (error) {
      io.stderr.write(`${error.message}\n`);
      return 1;
    }
  }

  if (command === "audit-repo") {
    const { repoPath, options } = splitRepoArgs(rest);
    if (!repoPath) {
      io.stderr.write("audit-repo requires a repository path.\n");
      return 1;
    }

    try {
      const outRequested = options.includes("--out");
      const markdownRequested = options.includes("--markdown");
      const htmlRequested = options.includes("--html");
      const outPath = outRequested ? repoOptionValue(options, "--out", null, "--out requires a file path.") : null;
      const markdownPath = markdownRequested
        ? repoOptionValue(options, "--markdown", null, "--markdown requires a file path.")
        : null;
      const htmlPath = htmlRequested ? repoOptionValue(options, "--html", null, "--html requires a file path.") : null;
      const failOn = repoOptionValue(options, "--fail-on");
      if (failOn && !(failOn in severityRank)) throw new Error("--fail-on must be one of: P0, P1, P2, P3");

      const output = await runRepoAudit(mergeRepoConfig(repoPath, options));
      const failedThreshold =
        failsThreshold(output.findings, failOn) || failsThreshold(output.repo?.sourceFindings || [], failOn);

      if (outPath) fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);
      if (markdownPath) fs.writeFileSync(markdownPath, generateMarkdownReport(output));
      if (htmlPath) fs.writeFileSync(htmlPath, generateHtmlReport(output));
      if (outPath || markdownPath || htmlPath) {
        const result = { ok: true };
        if (outRequested) result.out = outPath;
        if (markdownRequested) result.markdown = markdownPath;
        if (htmlRequested) result.html = htmlPath;
        if (failedThreshold) result.failedThreshold = failOn;
        writeJson(io, result);
      } else {
        writeJson(io, output);
      }
      return failedThreshold || output.repo?.sourceFindings?.length ? 2 : 0;
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
