import fs from "node:fs";
import { runAudit } from "./audit.mjs";
import { readAuditConfig, validateAuditConfig } from "./config-schema.mjs";
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
  --mode full|sample|single      Crawl mode
  --max-pages <n>                Maximum pages to crawl
  --max-depth <n>                Maximum crawl depth
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
      const config = readAuditConfig(filePath);
      writeJson(io, validateAuditConfig(config));
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
    const [target, ...options] = rest;
    if (!target) {
      io.stderr.write("audit requires a target URL or file path.\n");
      return 1;
    }

    try {
      const mode = optionValue(options, "--mode");
      const maxPages = optionValue(options, "--max-pages");
      const maxDepth = optionValue(options, "--max-depth");
      const output = await runAudit({
        target,
        crawl: {
          mode: mode || "single",
          maxPages: maxPages ? Number(maxPages) : undefined,
          maxDepth: maxDepth ? Number(maxDepth) : undefined,
        },
      });
      const outIndex = options.indexOf("--out");
      const markdownIndex = options.indexOf("--markdown");
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
        writeJson(io, result);
        return 0;
      }

      writeJson(io, output);
      return 0;
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
