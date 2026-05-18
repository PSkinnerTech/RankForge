import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { crawlSite } from "./crawl.mjs";
import { readTextFileLimited, resolveLimits } from "./io-guards.mjs";
import { readIntegrations } from "./integrations.mjs";
import { evaluatePerformance } from "./performance.mjs";
import { evaluatePage, scoreFindings } from "./rule-engine.mjs";
import { evaluateSite } from "./site-rule-engine.mjs";
import { collectSnapshot } from "./snapshot.mjs";
import { isHttpUrl } from "./url-utils.mjs";

const toolVersion = "0.2.0";

const readSourceMap = () => {
  try {
    const file = new URL("../../../skill/geo-seo-audit/source-map.json", import.meta.url);
    const sourceMap = JSON.parse(fs.readFileSync(file, "utf8"));
    return Object.entries(sourceMap).map(([id, url]) => ({ id, url }));
  } catch {
    return [];
  }
};

const originFor = (target) => {
  try {
    return new URL(target).origin;
  } catch {
    return null;
  }
};

const stableValue = (value) => {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return typeof value === "function" ? undefined : value;

  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, stableValue(value[key])])
      .filter(([, item]) => item !== undefined),
  );
};

const configHash = (config) => crypto.createHash("sha256").update(JSON.stringify(stableValue(config))).digest("hex");

const crawlSettings = (config) => ({
  mode: config.crawl?.mode || "single",
  maxPages: config.crawl?.maxPages ?? config.maxPages ?? null,
  maxDepth: config.crawl?.maxDepth ?? config.maxDepth ?? null,
});

const readUrlList = (config) => {
  const normalizeEntries = (entries, baseDir) =>
    entries
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        if (isHttpUrl(line)) return line;
        if (path.isAbsolute(line) && fs.existsSync(line)) return line;
        if (isHttpUrl(config.target)) return new URL(line, config.target).href;
        if (path.isAbsolute(line)) return line;
        return path.resolve(baseDir, line);
      });

  if (Array.isArray(config.urlListEntries)) {
    return normalizeEntries(
      config.urlListEntries.map((entry) => String(entry)),
      process.cwd(),
    );
  }
  if (!config.urlList) return [];
  const baseDir = path.dirname(config.urlList);
  const limits = resolveLimits(config.limits);
  return normalizeEntries(
    readTextFileLimited(config.urlList, {
      security: config.security,
      allowRestricted: true,
      limits,
      maxBytes: limits.maxFileBytes,
    }).split(/\r?\n/),
    baseDir,
  );
};

const collectUrlList = async (config) => {
  const maxPages = config.crawl?.maxPages ?? config.maxPages ?? 50;
  const urls = readUrlList(config).slice(0, maxPages);
  const pages = [];

  for (const url of urls) {
    pages.push(
      await collectSnapshot(url, {
        render: config.render?.mode,
        renderer: config.renderer,
        security: config.security,
        limits: config.limits,
      }),
    );
  }

  return { pages, skipped: [], robots: null, sitemaps: [] };
};

export const runAudit = async (config) => {
  if (!config?.target) throw new Error("target is required");

  const startedAt = new Date().toISOString();
  const settings = crawlSettings(config);
  const shouldCrawl = isHttpUrl(config.target) && (settings.mode === "full" || settings.mode === "sample");
  const hasUrlList = config.urlList || Array.isArray(config.urlListEntries);
  const crawlResult = hasUrlList
    ? await collectUrlList(config)
    : shouldCrawl
      ? await crawlSite(config)
      : {
          pages: [
            await collectSnapshot(config.target, {
              render: config.render?.mode,
              renderer: config.renderer,
              security: config.security,
              limits: config.limits,
            }),
          ],
          skipped: [],
          robots: null,
          sitemaps: [],
        };
  const endedAt = new Date().toISOString();
  const pages = crawlResult.pages;
  const sitemapUrls = (crawlResult.sitemaps || []).flatMap((sitemap) => sitemap.parsed?.urls || []);
  const integrations = readIntegrations(config.integrations, { security: config.security, limits: config.limits });
  const hasRankingEvidence = Boolean(
    integrations.searchConsole?.rows?.length || integrations.serp?.rows?.length || integrations.aiAnswers?.rows?.length,
  );
  const findings = [
    ...pages.flatMap((item, index) => evaluatePage(item, index)),
    ...evaluateSite(pages, {
      crawled: shouldCrawl,
      origin: originFor(pages[0]?.finalUrl || config.target),
      sitemapUrls,
      sitemaps: crawlResult.sitemaps,
      skipped: crawlResult.skipped,
    }),
    ...evaluatePerformance(integrations.lighthouse),
  ];

  return {
    schemaVersion: "1.0.0",
    toolVersion,
    run: {
      id: `audit-${Date.now()}`,
      startedAt,
      endedAt,
      target: config.target,
      configHash: configHash(config),
      mode: settings.mode,
      crawl: settings,
      render: config.render || { mode: "never" },
      security: config.security || { mode: "local" },
      limits: config.limits || {},
      userAgent: "OpenClaw GEO SEO audit snapshot",
      environment: {
        node: process.version,
        platform: process.platform,
      },
    },
    site: {
      origin: originFor(pages[0]?.finalUrl || config.target),
      robots: crawlResult.robots,
      sitemaps: crawlResult.sitemaps,
      skipped: crawlResult.skipped,
      notes: hasUrlList
        ? ["Audit output contains supplied URL-list evidence."]
        : shouldCrawl
          ? ["Audit output contains bounded same-origin crawl evidence."]
          : ["Audit output contains single-page snapshot evidence."],
    },
    pages,
    integrations,
    scores: scoreFindings(findings),
    findings,
    evidenceGaps: hasRankingEvidence
      ? []
      : [
          {
            id: "ranking.integrations_missing",
            message:
              "Measured rankings, SERP positions, and AI answer visibility require Search Console, SERP, or AI answer evidence.",
          },
        ],
    sources: readSourceMap(),
  };
};
