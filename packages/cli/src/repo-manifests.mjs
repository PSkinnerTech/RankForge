import fs from "node:fs";
import path from "node:path";
import { sourceFinding } from "./repo-findings.mjs";

const manifestConfigs = {
  next: {
    type: "next_prerender_manifest",
    relativePath: path.join(".next", "prerender-manifest.json"),
    routesFor: (json) => (json?.routes && typeof json.routes === "object" && !Array.isArray(json.routes) ? Object.keys(json.routes) : []),
  },
  astro: {
    type: "astro_manifest",
    relativePath: path.join(".astro", "manifest.json"),
    routesFor: (json) => {
      const routes = Array.isArray(json?.routes) ? json.routes : Array.isArray(json?.manifest?.routes) ? json.manifest.routes : [];
      return routes.map((route) => (typeof route === "string" ? route : route?.route)).filter(Boolean);
    },
  },
};

const normalizeRoute = (route) => {
  if (typeof route !== "string") return null;
  const cleanRoute = route.trim();
  if (!cleanRoute) return null;
  const withLeadingSlash = cleanRoute.startsWith("/") ? cleanRoute : `/${cleanRoute}`;
  if (withLeadingSlash === "/") return "/";
  if (withLeadingSlash.endsWith("/") || withLeadingSlash.endsWith(".html")) return withLeadingSlash;
  return `${withLeadingSlash}/`;
};

const uniqueNormalizedRoutes = (routes) => {
  const normalized = [];
  const seen = new Set();
  for (const route of routes) {
    const normalizedRoute = normalizeRoute(route);
    if (!normalizedRoute || seen.has(normalizedRoute)) continue;
    seen.add(normalizedRoute);
    normalized.push(normalizedRoute);
  }
  return normalized;
};

const invalidManifestFinding = (manifestPath, error) =>
  sourceFinding({
    id: "repo.route_manifest_invalid",
    message: "Framework route manifest could not be parsed.",
    evidence: manifestPath,
    recommendation: "Regenerate the framework build output and rerun the repository audit.",
    details: { message: error?.message },
  });

const manifestRouteMissingFinding = (route) =>
  sourceFinding({
    id: "repo.manifest_route_missing",
    message: "Framework route manifest lists a route that is missing from static output.",
    evidence: route,
    recommendation: "Ensure the framework build emits this route or remove it from generated route metadata.",
  });

const staticRouteUnlistedFinding = (route) =>
  sourceFinding({
    id: "repo.static_route_unlisted",
    message: "Static output includes a route that is not listed in the framework route manifest.",
    evidence: route,
    recommendation: "Confirm the generated route is intentional and represented in framework route metadata.",
  });

export const analyzeFrameworkRouteManifests = ({ repoPath, detectedFramework, staticRoutes = [] }) => {
  const config = manifestConfigs[detectedFramework];
  const frameworkManifests = [];
  const sourceFindings = [];
  if (!config) return { frameworkManifests, sourceFindings };

  const manifestPath = path.join(repoPath, config.relativePath);
  if (!fs.existsSync(manifestPath)) return { frameworkManifests, sourceFindings };

  let json;
  try {
    json = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    return {
      frameworkManifests,
      sourceFindings: [invalidManifestFinding(manifestPath, error)],
    };
  }

  const manifestRoutes = uniqueNormalizedRoutes(config.routesFor(json));
  frameworkManifests.push({
    type: config.type,
    path: manifestPath,
    routes: manifestRoutes,
  });

  const manifestRouteSet = new Set(manifestRoutes);
  const staticRouteSet = new Set(uniqueNormalizedRoutes(staticRoutes.map((route) => route.route)));

  for (const route of manifestRoutes) {
    if (!staticRouteSet.has(route)) sourceFindings.push(manifestRouteMissingFinding(route));
  }
  for (const route of staticRouteSet) {
    if (!manifestRouteSet.has(route)) sourceFindings.push(staticRouteUnlistedFinding(route));
  }

  return { frameworkManifests, sourceFindings };
};
