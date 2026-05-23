const sourceFindingGuidance = {
  "repo.build_failed": {
    inspectNext: ["build command", "package scripts", "build logs"],
    developerAction: "Run the configured build command locally and fix the failing build step before rerunning RankForge.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.build_failed is absent."],
  },
  "repo.build_timeout": {
    inspectNext: ["build command", "long-running build steps", "CI build timeout"],
    developerAction: "Identify the build step that exceeds the timeout and either optimize it or provide a completed static output directory.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.build_timeout is absent."],
  },
  "repo.build_unavailable": {
    inspectNext: ["security mode", "build command", "prebuilt static output"],
    developerAction: "Use local security mode for trusted repository builds, or audit prebuilt static output instead of executing the build command.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.build_unavailable is absent."],
  },
  "repo.static_dir_missing": {
    inspectNext: ["configured static output directory", "build command", "audit.config.json"],
    developerAction: "Run the explicit build command and confirm the configured static directory exists.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.static_dir_missing is absent."],
  },
  "repo.static_route_unlisted": {
    inspectNext: ["static output directory", "route discovery", "route manifest"],
    developerAction: "Update the route manifest or static export so every generated HTML route is represented in audit evidence.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.static_route_unlisted is absent."],
  },
  "repo.static_routes_missing": {
    inspectNext: ["static output directory", "generated route files", "framework export settings"],
    developerAction: "Update the build or export configuration so HTML routes are emitted into the static output directory.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.static_routes_missing is absent."],
  },
  "repo.route_manifest_invalid": {
    inspectNext: ["route manifest", "manifest JSON syntax", "audit.config.json"],
    developerAction: "Fix the configured route manifest so RankForge can parse the list of auditable routes.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.route_manifest_invalid is absent."],
  },
  "repo.route_list_missing": {
    inspectNext: ["route manifest", "configured route list path", "audit.config.json"],
    developerAction: "Provide a route list file or configure RankForge to discover routes from the generated static output.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.route_list_missing is absent."],
  },
  "repo.route_list_empty": {
    inspectNext: ["route list file", "route generation script", "static output directory"],
    developerAction: "Populate the configured route list with the HTML paths that should be audited.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.route_list_empty is absent."],
  },
  "repo.route_list_entry_missing": {
    inspectNext: ["route list entry", "static output directory", "build output"],
    developerAction: "Remove stale route entries or update the build so every listed route is emitted.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.route_list_entry_missing is absent."],
  },
  "repo.route_list_entry_not_html": {
    inspectNext: ["route list entry", "generated file extension", "route list source"],
    developerAction: "Replace non-HTML route entries with auditable HTML routes or remove them from the route list.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.route_list_entry_not_html is absent."],
  },
  "repo.route_list_entry_outside_static_dir": {
    inspectNext: ["route list entry", "static output directory", "path normalization"],
    developerAction: "Constrain route list entries to paths inside the configured static output directory.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.route_list_entry_outside_static_dir is absent."],
  },
  "repo.preview_unreachable": {
    inspectNext: ["preview URL", "preview server command", "local port"],
    developerAction: "Start the preview server or update the configured preview URL so RankForge can reach it.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.preview_unreachable is absent."],
  },
  "repo.robots_missing": {
    inspectNext: ["public assets directory", "robots.txt", "build output"],
    developerAction: "Add robots.txt to the public assets that are copied into the built site.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.robots_missing is absent."],
  },
  "repo.sitemap_missing": {
    inspectNext: ["public assets directory", "sitemap generation", "build output"],
    developerAction: "Generate or add a sitemap file that is included in the built site output.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.sitemap_missing is absent."],
  },
  "repo.manifest_route_missing": {
    inspectNext: ["framework route manifest", "generated static output", "framework route configuration"],
    developerAction: "Update the framework build/export configuration so every manifest route is emitted to static output, or remove stale route metadata.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.manifest_route_missing is absent."],
  },
  "repo.audit_path_missing": {
    inspectNext: ["audit config", "static output directory", "preview server"],
    developerAction: "Configure either a static directory or preview server for the repository audit.",
    acceptanceCriteria: ["Rerun RankForge and confirm repo.audit_path_missing is absent."],
  },
};

const normalizeGuidance = (guidance = {}) => ({
  inspectNext: Array.isArray(guidance.inspectNext) ? [...guidance.inspectNext] : [],
  developerAction: guidance.developerAction ?? "",
  acceptanceCriteria: Array.isArray(guidance.acceptanceCriteria) ? [...guidance.acceptanceCriteria] : [],
});

export const guidanceForSourceFinding = (id) =>
  normalizeGuidance(sourceFindingGuidance[id]);

export const sourceFinding = ({
  id,
  severity = "P1",
  message,
  evidence,
  recommendation,
  confidence = "high",
  details,
  inspectNext,
  developerAction,
  acceptanceCriteria,
}) => {
  const guidance = guidanceForSourceFinding(id);

  return {
    id,
    severity,
    message,
    evidence,
    recommendation,
    confidence,
    ...(details ? { details } : {}),
    inspectNext: Array.isArray(inspectNext) ? [...inspectNext] : guidance.inspectNext,
    developerAction: developerAction ?? guidance.developerAction,
    acceptanceCriteria: Array.isArray(acceptanceCriteria) ? [...acceptanceCriteria] : guidance.acceptanceCriteria,
  };
};
