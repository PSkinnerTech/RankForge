const fixtureOrigin = "http://fixture.test";

const scrubString = (value, origin) => String(value).split(origin).join(fixtureOrigin);

const scrubValue = (value, origin) => {
  if (typeof value === "string") return scrubString(value, origin);
  if (Array.isArray(value)) return value.map((item) => scrubValue(item, origin));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, scrubValue(item, origin)]));
};

const pathFor = (url, origin) => {
  const scrubbed = scrubString(url, origin);
  try {
    return new URL(scrubbed).pathname;
  } catch {
    return scrubbed;
  }
};

const pageSummary = (page, origin) => ({
  path: pathFor(page.finalUrl, origin),
  status: page.status,
  title: page.evidence?.title,
  description: page.evidence?.description,
  canonicalPath: page.evidence?.canonical ? pathFor(page.evidence.canonical, origin) : null,
  robots: page.evidence?.robots,
  h1: page.evidence?.h1 || [],
  structuredDataBlocks: page.evidence?.counts?.structuredData || 0,
  links: page.evidence?.counts?.links || 0,
  images: page.evidence?.counts?.images || 0,
});

const findingSummary = (finding, origin) => ({
  ruleId: finding.ruleId,
  severity: finding.severity,
  dimension: finding.dimension,
  affectedPaths: (finding.affectedUrls || []).map((url) => pathFor(url, origin)),
  evidence: finding.evidence || [],
  owner: finding.owner,
  effort: finding.effort,
  task: finding.implementationTask?.summary || finding.recommendation,
});

export const normalizeAuditForGolden = (audit, origin) => ({
  schemaVersion: audit.schemaVersion,
  toolVersion: audit.toolVersion,
  run: {
    target: scrubString(audit.run.target, origin),
    mode: audit.run.mode,
    crawl: audit.run.crawl,
    render: audit.run.render,
  },
  site: {
    origin: fixtureOrigin,
    notes: audit.site?.notes || [],
    skipped: (audit.site?.skipped || []).map((item) => ({
      url: scrubString(item.url, origin),
      reason: item.reason,
    })),
  },
  pages: (audit.pages || []).map((page) => pageSummary(page, origin)),
  findings: (audit.findings || []).map((finding) => findingSummary(finding, origin)),
  scores: scrubValue(audit.scores || {}, origin),
  evidenceGaps: (audit.evidenceGaps || []).map((gap) => gap.id),
});

export const normalizeMarkdownForGolden = (markdown, origin) => {
  const lines = scrubString(markdown, origin)
    .replace(/^Generated: .+$/m, "Generated: <generated>")
    .replace(/^- Build result: exit 0 in \d+ ms$/gm, "- Build result: exit 0 in <duration> ms")
    .split("\n");
  const sourcesIndex = lines.findIndex((line) => line === "## Sources");
  const kept = sourcesIndex === -1 ? lines : lines.slice(0, sourcesIndex);
  return `${kept.join("\n").trimEnd()}\n`;
};
