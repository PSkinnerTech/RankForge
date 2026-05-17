import { readTextFileLimited, resolveLimits } from "./io-guards.mjs";
import { readLighthouseReport } from "./performance.mjs";

const parseCsvLine = (line) => {
  const cells = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index++) {
    const char = line[index];
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (char === "," && !quoted) {
      cells.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current);
  return cells;
};

const number = (value) => {
  const parsed = Number(String(value || "").replace("%", ""));
  return Number.isFinite(parsed) ? parsed : null;
};

export const readSearchConsoleCsv = (filePath, options = {}) => {
  const limits = resolveLimits(options.limits);
  const [headerLine, ...lines] = readTextFileLimited(filePath, {
    security: options.security,
    allowRestricted: true,
    limits,
    maxBytes: limits.maxIntegrationBytes,
  })
    .trim()
    .split(/\r?\n/);
  const headers = parseCsvLine(headerLine).map((header) => header.trim().toLowerCase());
  const rows = lines.filter(Boolean).map((line) => {
    const cells = parseCsvLine(line);
    const row = Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
    return {
      query: row.query || "",
      page: row.page || "",
      clicks: number(row.clicks),
      impressions: number(row.impressions),
      ctr: number(row.ctr),
      position: number(row.position),
    };
  });
  return { type: "search_console_csv", source: filePath, rows };
};

const readJsonRows = (filePath, type, options = {}) => {
  const limits = resolveLimits(options.limits);
  const parsed = JSON.parse(
    readTextFileLimited(filePath, {
      security: options.security,
      allowRestricted: true,
      limits,
      maxBytes: limits.maxIntegrationBytes,
    }),
  );
  return { type, source: filePath, rows: Array.isArray(parsed) ? parsed : parsed.rows || [] };
};

export const readSerpExport = (filePath, options = {}) => readJsonRows(filePath, "serp_export", options);

export const readAiAnswers = (filePath, options = {}) => readJsonRows(filePath, "ai_answer_export", options);

export const readIntegrations = (integrations = {}, options = {}) => ({
  searchConsole: integrations.searchConsole ? readSearchConsoleCsv(integrations.searchConsole, options) : null,
  serp: integrations.serp ? readSerpExport(integrations.serp, options) : null,
  aiAnswers: integrations.aiAnswers ? readAiAnswers(integrations.aiAnswers, options) : null,
  lighthouse: integrations.lighthouse ? readLighthouseReport(integrations.lighthouse, options) : null,
});
