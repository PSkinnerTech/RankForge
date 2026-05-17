import fs from "node:fs";
import { crawlSite } from "./crawl.mjs";
import { readIntegrations } from "./integrations.mjs";
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

export const runAudit = async (config) => {
  if (!config?.target) throw new Error("target is required");

  const startedAt = new Date().toISOString();
  const shouldCrawl = isHttpUrl(config.target) && (config.crawl?.mode === "full" || config.crawl?.mode === "sample");
  const crawlResult = shouldCrawl
    ? await crawlSite(config)
    : { pages: [await collectSnapshot(config.target, { render: config.render?.mode, renderer: config.renderer })], skipped: [], robots: null, sitemaps: [] };
  const endedAt = new Date().toISOString();
  const pages = crawlResult.pages;
  const sitemapUrls = (crawlResult.sitemaps || []).flatMap((sitemap) => sitemap.parsed?.urls || []);
  const integrations = readIntegrations(config.integrations);
  const hasRankingEvidence = Boolean(
    integrations.searchConsole?.rows?.length || integrations.serp?.rows?.length || integrations.aiAnswers?.rows?.length,
  );
  const findings = [
    ...pages.flatMap((item, index) => evaluatePage(item, index)),
    ...evaluateSite(pages, { sitemapUrls }),
  ];

  return {
    schemaVersion: "1.0.0",
    toolVersion,
    run: {
      id: `audit-${Date.now()}`,
      startedAt,
      endedAt,
      target: config.target,
      mode: config.crawl?.mode || "single",
      render: config.render || { mode: "never" },
      userAgent: "OpenClaw GEO SEO audit snapshot",
    },
    site: {
      origin: originFor(pages[0]?.finalUrl || config.target),
      robots: crawlResult.robots,
      sitemaps: crawlResult.sitemaps,
      skipped: crawlResult.skipped,
      notes: shouldCrawl
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
