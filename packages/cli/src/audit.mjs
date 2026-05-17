import fs from "node:fs";
import { crawlSite } from "./crawl.mjs";
import { evaluatePage, scoreFindings } from "./rule-engine.mjs";
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
  const shouldCrawl =
    isHttpUrl(config.target) && (config.crawl?.mode === "full" || config.crawl?.mode === "sample");
  const crawlResult = shouldCrawl ? await crawlSite(config) : { pages: [await collectSnapshot(config.target)], skipped: [] };
  const endedAt = new Date().toISOString();
  const pages = crawlResult.pages;
  const findings = pages.flatMap((item, index) => evaluatePage(item, index));

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
      robots: null,
      sitemaps: [],
      skipped: crawlResult.skipped,
      notes: shouldCrawl
        ? ["Audit output contains bounded same-origin crawl evidence."]
        : ["Audit output contains single-page snapshot evidence."],
    },
    pages,
    integrations: {
      searchConsole: null,
      serp: null,
      aiAnswers: null,
    },
    scores: scoreFindings(findings),
    findings,
    evidenceGaps: [
      {
        id: "ranking.integrations_missing",
        message:
          "Measured rankings, SERP positions, and AI answer visibility require Search Console, SERP, or AI answer evidence.",
      },
    ],
    sources: readSourceMap(),
  };
};
