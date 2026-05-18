import fs from "node:fs";
import path from "node:path";
import { runAudit } from "./audit.mjs";
import { detectRepo } from "./repo-detect.mjs";
import { runCommand, startPreview, stopPreview } from "./repo-process.mjs";
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

const commandText = (chunks) => chunks?.join("").trim() || undefined;

const buildErrorDetails = (error) => ({
  message: error?.message || "Build command failed.",
  stdout: commandText(error?.commandResult?.stdout),
  stderr: commandText(error?.commandResult?.stderr),
  exitCode: error?.commandResult?.exitCode ?? undefined,
  signal: error?.commandResult?.signal ?? undefined,
  timedOut: error?.commandResult?.timedOut || undefined,
  durationMs: error?.commandResult?.durationMs,
});

const buildFindingFor = (error, command) => {
  const timedOut = Boolean(error?.commandResult?.timedOut);
  const restricted = /Restricted security mode disables local command execution/.test(error?.message || "");
  return sourceFinding({
    id: restricted ? "repo.build_unavailable" : timedOut ? "repo.build_timeout" : "repo.build_failed",
    message: restricted
      ? "Build command execution is disabled in restricted security mode."
      : timedOut
        ? "Build command timed out before repository audit could collect page evidence."
        : "Build command failed before repository audit could collect page evidence.",
    evidence: command,
    recommendation: restricted
      ? "Use local security mode for trusted repository builds, or audit prebuilt static output."
      : "Run the build command locally, fix the failure, and rerun the repository audit.",
    details: buildErrorDetails(error),
  });
};

const generatedOutputFindings = (staticDir) => {
  const findings = [];
  if (!fs.existsSync(path.join(staticDir, "robots.txt"))) {
    findings.push(
      sourceFinding({
        id: "repo.robots_missing",
        severity: "P3",
        message: "Static output does not include robots.txt.",
        evidence: path.join(staticDir, "robots.txt"),
        recommendation: "Generate robots.txt in static output when the deployed site should expose crawler directives.",
        confidence: "medium",
      }),
    );
  }
  if (!fs.existsSync(path.join(staticDir, "sitemap.xml"))) {
    findings.push(
      sourceFinding({
        id: "repo.sitemap_missing",
        severity: "P3",
        message: "Static output does not include sitemap.xml.",
        evidence: path.join(staticDir, "sitemap.xml"),
        recommendation: "Generate sitemap.xml in static output so important URLs can be discovered consistently.",
        confidence: "medium",
      }),
    );
  }
  return findings;
};

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

const htmlPathForRoute = (staticDir, route) => {
  const cleanRoute = route.trim();
  if (!cleanRoute || cleanRoute.startsWith("#")) return null;
  if (path.isAbsolute(cleanRoute) && fs.existsSync(cleanRoute) && fs.statSync(cleanRoute).isFile()) return cleanRoute;
  const normalized = cleanRoute.startsWith("/") ? cleanRoute.slice(1) : cleanRoute;
  if (!normalized || normalized.endsWith("/")) return path.join(staticDir, normalized, "index.html");
  if (normalized.endsWith(".html")) return path.join(staticDir, normalized);
  if (path.extname(normalized)) return path.join(staticDir, normalized);
  return path.join(staticDir, normalized, "index.html");
};

const routeForStaticFile = (staticDir, filePath) => {
  const relative = path.relative(staticDir, filePath);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) return null;

  const parsed = path.parse(relative);
  const routePath = relative.split(path.sep).join("/");
  if (routePath === "index.html") return "/";
  if (parsed.base === "index.html") return `/${parsed.dir.split(path.sep).join("/")}/`;
  return `/${routePath}`;
};

const routeForEntry = (entry, staticDir, filePath) => {
  const clean = entry.trim();
  if (!clean || clean.startsWith("#")) return null;
  if (path.isAbsolute(clean)) return routeForStaticFile(staticDir, filePath);
  return clean.startsWith("/") ? clean : `/${clean}`;
};

const readRouteListRoutes = (routeListPath, staticDir) => {
  if (!fs.existsSync(routeListPath) || !fs.statSync(routeListPath).isFile()) {
    return {
      routes: [],
      sourceFindings: [
        sourceFinding({
          id: "repo.route_list_missing",
          message: "Configured route list file does not exist.",
          evidence: routeListPath,
          recommendation: "Create the route list file or remove the route-list option.",
        }),
      ],
    };
  }

  const entries = fs
    .readFileSync(routeListPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("#"));
  if (!entries.length) {
    return {
      routes: [],
      sourceFindings: [
        sourceFinding({
          id: "repo.route_list_empty",
          message: "Configured route list does not contain any routes.",
          evidence: routeListPath,
          recommendation: "Add at least one route to audit.",
        }),
      ],
    };
  }

  const routes = [];
  const sourceFindings = [];
  for (const entry of entries) {
    const filePath = htmlPathForRoute(staticDir, entry);
    const route = filePath ? routeForEntry(entry, staticDir, filePath) : null;
    if (!filePath || !fs.existsSync(filePath)) {
      sourceFindings.push(
        sourceFinding({
          id: "repo.route_list_entry_missing",
          message: "Route list entry does not resolve to a generated HTML file.",
          evidence: entry,
          recommendation: "Build the route or remove it from the route list.",
        }),
      );
      continue;
    }
    if (!route) {
      sourceFindings.push(
        sourceFinding({
          id: "repo.route_list_entry_outside_static_dir",
          message: "Route list entry resolves outside the configured static output directory.",
          evidence: entry,
          recommendation: "Use routes or HTML files generated under the configured static output directory.",
        }),
      );
      continue;
    }
    if (!filePath.endsWith(".html")) {
      sourceFindings.push(
        sourceFinding({
          id: "repo.route_list_entry_not_html",
          message: "Route list entry does not resolve to an HTML file.",
          evidence: entry,
          recommendation: "Route-list entries must point to generated HTML pages.",
        }),
      );
      continue;
    }
    routes.push({ type: "route_list", route, path: filePath });
  }

  return { routes, sourceFindings };
};

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
  const buildCommand = options.buildCommand || detected.buildCommand;
  let build;

  if (options.buildCommand) {
    try {
      const result = await runCommand({
        command: options.buildCommand,
        cwd: repoPath,
        timeoutMs: options.maxBuildMs ?? 120000,
        label: "Build",
        security: options.security,
      });
      build = {
        executed: true,
        durationMs: result.durationMs,
        exitCode: result.exitCode,
        stdout: commandText(result.stdout),
        stderr: commandText(result.stderr),
      };
    } catch (error) {
      return emptyAudit(detected, {
        buildCommand: options.buildCommand,
        build: {
          executed: true,
          durationMs: error?.commandResult?.durationMs,
          exitCode: error?.commandResult?.exitCode ?? null,
          stdout: commandText(error?.commandResult?.stdout),
          stderr: commandText(error?.commandResult?.stderr),
          timedOut: error?.commandResult?.timedOut || undefined,
        },
        sourceFindings: [buildFindingFor(error, options.buildCommand)],
      });
    }
  }

  const hasExplicitPreview = Boolean(options.previewCommand && options.previewUrl);
  const staticDir = hasExplicitPreview ? null : options.staticDir ? path.resolve(repoPath, options.staticDir) : detected.staticDir;

  if (staticDir) {
    const staticDirRelative = options.staticDir ? relativePath(repoPath, staticDir) : detected.staticDirRelative;
    const staticRepoFields = {
      buildCommand,
      build,
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

    const routeList = options.routeList ? path.resolve(repoPath, options.routeList) : null;
    const routeListResult = routeList ? readRouteListRoutes(routeList, staticDir) : null;
    const routes = routeListResult ? routeListResult.routes : discoverStaticRoutes(staticDir);
    const routeSourceFindings = routeListResult?.sourceFindings || [];
    if (routeSourceFindings.length) {
      return emptyAudit(detected, {
        ...staticRepoFields,
        buildCommand: options.buildCommand || detected.buildCommand,
        build,
        routeList,
        sourceFindings: routeSourceFindings,
      });
    }

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

    const outputSourceFindings = generatedOutputFindings(staticDir);
    const audit = await runAudit({
      ...options,
      target: routes[0].path,
      urlListEntries: routes.map((route) => route.path),
      crawl: { ...(options.crawl || {}), mode: "single" },
    });

    audit.repo = repoEvidence(detected, {
      buildCommand,
      build,
      staticDir,
      staticDirRelative,
      routeList,
      routeSources: routes,
      sourceFindings: outputSourceFindings,
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
        security: options.security,
        limits: options.limits,
      });
    } catch (error) {
      return emptyAudit(detected, {
        buildCommand,
        build,
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
        buildCommand,
        build,
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
    buildCommand,
    build,
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
