import fs from "node:fs";

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

export const readSearchConsoleCsv = (filePath) => {
  const [headerLine, ...lines] = fs.readFileSync(filePath, "utf8").trim().split(/\r?\n/);
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

const readJsonRows = (filePath, type) => {
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return { type, source: filePath, rows: Array.isArray(parsed) ? parsed : parsed.rows || [] };
};

export const readSerpExport = (filePath) => readJsonRows(filePath, "serp_export");

export const readAiAnswers = (filePath) => readJsonRows(filePath, "ai_answer_export");

export const readIntegrations = (integrations = {}) => ({
  searchConsole: integrations.searchConsole ? readSearchConsoleCsv(integrations.searchConsole) : null,
  serp: integrations.serp ? readSerpExport(integrations.serp) : null,
  aiAnswers: integrations.aiAnswers ? readAiAnswers(integrations.aiAnswers) : null,
});
