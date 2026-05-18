import fs from "node:fs";
import path from "node:path";
import { runAudit } from "./audit.mjs";
import { detectRepo } from "./repo-detect.mjs";
import { startPreview, stopPreview } from "./repo-process.mjs";
import { discoverStaticRoutes } from "./repo-routes.mjs";

const toolVersion = "0.2.0";

const sourceFinding = ({ id, severity = "P1", message, evidence, recommendation, confidence = "high", details }) => ({
  id,
  severity,
  message,
  evidence,
  recommendation,
  confidence,
  ...(details ? { details } : {}),
});

const relativePath = (repoPath, targetPath) => {
  if (!targetPath) return null;
  const relative = path.relative(repoPath, targetPath);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative) ? relative || "." : targetPath;
};

const previewErrorDetails = (error) => ({
  message: error?.message || "Preview server did not become reachable.",
  stdout: error?.preview?.stdout?.join("").trim() || undefined,
  stderr: error?.preview?.stderr?.join("").trim() || undefined,
});

const repoEvidence = (detected, overrides = {}) => ({
  path: detected.repoRoot,
  detectedFramework: detected.detectedFramework,
  confidence: detected.confidence,
  packageManager: detected.packageManager,
  buildCommand: detected.buildCommand,
  previewCommand: detected.previewCommand,
  staticDir: detected.staticDir,
  staticDirRelative: detected.staticDirRelative,
  routeSources: detected.routeSources || [],
  sourceFindings: [],
  notes: [],
  ...overrides,
});

const emptyAudit = (detected, repoOverrides = {}) => {
  const now = new Date().toISOString();

  return {
    schemaVersion: "1.0.0",
    toolVersion,
    run: {
      id: `repo-audit-${Date.now()}`,
      startedAt: now,
      endedAt: now,
      target: repoOverrides.previewUrl || repoOverrides.staticDir || detected.repoRoot,
      mode: "repo",
    },
    site: {
      origin: null,
      robots: null,
      sitemaps: [],
      skipped: [],
      notes: ["No page audit evidence was collected."],
    },
    pages: [],
    integrations: {},
    scores: {},
    findings: [],
    evidenceGaps: [],
    sources: [],
    repo: repoEvidence(detected, repoOverrides),
  };
};

export const runRepoAudit = async (options = {}) => {
  const repoPath = path.resolve(options.repoPath || ".");
  const detected = detectRepo(repoPath);

  if (options.staticDir) {
    const staticDir = path.resolve(repoPath, options.staticDir);
    const staticDirRelative = relativePath(repoPath, staticDir);
    const staticRepoFields = {
      staticDir,
      staticDirRelative,
      routeSources: [],
      sourceFindings: [],
      notes: [],
    };

    if (!fs.existsSync(staticDir) || !fs.statSync(staticDir).isDirectory()) {
      return emptyAudit(detected, {
        ...staticRepoFields,
        sourceFindings: [
          sourceFinding({
            id: "repo.static_dir_missing",
            message: "Configured static output directory does not exist or is not a directory.",
            evidence: staticDir,
            recommendation: "Run the repository build or pass an existing static output directory.",
          }),
        ],
      });
    }

    const routes = discoverStaticRoutes(staticDir);
    if (!routes.length) {
      return emptyAudit(detected, {
        ...staticRepoFields,
        sourceFindings: [
          sourceFinding({
            id: "repo.static_routes_missing",
            message: "Static output directory does not contain HTML routes.",
            evidence: staticDir,
            recommendation: "Build static HTML output before running a repository audit.",
          }),
        ],
      });
    }

    const audit = await runAudit({
      ...options,
      target: routes[0].path,
      urlListEntries: routes.map((route) => route.path),
      crawl: { ...(options.crawl || {}), mode: "single" },
    });

    audit.repo = repoEvidence(detected, {
      staticDir,
      staticDirRelative,
      routeSources: routes,
      sourceFindings: [],
      notes: ["Audited static output directory."],
    });
    return audit;
  }

  if (options.previewCommand && options.previewUrl) {
    let preview;
    try {
      preview = await startPreview({
        command: options.previewCommand,
        cwd: repoPath,
        previewUrl: options.previewUrl,
        timeoutMs: options.maxPreviewMs,
      });
    } catch (error) {
      return emptyAudit(detected, {
        previewCommand: options.previewCommand,
        previewUrl: options.previewUrl,
        sourceFindings: [
          sourceFinding({
            id: "repo.preview_unreachable",
            message: "Preview server did not become reachable for repository audit.",
            evidence: options.previewUrl,
            recommendation: "Verify the preview command starts a server at the configured preview URL.",
            details: previewErrorDetails(error),
          }),
        ],
      });
    }

    try {
      const audit = await runAudit({
        ...options,
        target: options.previewUrl,
        crawl: {
          mode: "full",
          maxPages: options.maxPages ?? 25,
          maxDepth: options.maxDepth ?? 2,
          ...(options.crawl || {}),
        },
      });

      audit.repo = repoEvidence(detected, {
        previewCommand: options.previewCommand,
        previewUrl: options.previewUrl,
        sourceFindings: [],
        notes: ["Audited explicit preview server."],
      });
      return audit;
    } finally {
      await stopPreview(preview);
    }
  }

  return emptyAudit(detected, {
    sourceFindings: [
      sourceFinding({
        id: "repo.audit_path_missing",
        severity: "P2",
        message: "Repository audit needs either a static output directory or an explicit preview command and URL.",
        evidence: detected.repoRoot,
        recommendation: "Pass staticDir, or pass both previewCommand and previewUrl.",
        confidence: "high",
      }),
    ],
  });
};
