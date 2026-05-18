import fs from "node:fs";
import path from "node:path";

const staticDirCandidates = ["dist", "build", "out", "public"];

const frameworkSignals = [
  ["next", "next"],
  ["astro", "astro"],
  ["@sveltejs/kit", "@sveltejs/kit"],
  ["@remix-run/node", "@remix-run/node"],
  ["vite", "vite"],
];

const compareOrdinal = (left, right) => {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
};

const readPackageJson = (repoRoot) => {
  const packageJsonPath = path.join(repoRoot, "package.json");
  if (!fs.existsSync(packageJsonPath)) return null;
  return JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
};

const detectPackageManager = (repoRoot) => {
  if (fs.existsSync(path.join(repoRoot, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(repoRoot, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(repoRoot, "package-lock.json"))) return "npm";
  if (fs.existsSync(path.join(repoRoot, "package.json"))) return "npm";
  return null;
};

const scriptCommand = (packageManager, scriptName, packageJson) => {
  if (!packageManager || !packageJson?.scripts?.[scriptName]) return null;
  return `${packageManager} run ${scriptName}`;
};

const dependenciesFor = (packageJson) => ({
  ...packageJson?.dependencies,
  ...packageJson?.devDependencies,
});

const detectFramework = (packageJson, hasStaticOutput) => {
  const dependencies = dependenciesFor(packageJson);
  for (const [dependencyName, framework] of frameworkSignals) {
    if (dependencies[dependencyName]) {
      return { detectedFramework: framework, confidence: "high" };
    }
  }

  if (packageJson) {
    return { detectedFramework: "generic-node", confidence: "medium" };
  }

  if (hasStaticOutput) {
    return { detectedFramework: "generic-static", confidence: "medium" };
  }

  return { detectedFramework: null, confidence: "low" };
};

const detectStaticDir = (repoRoot) => {
  for (const dirRelative of staticDirCandidates) {
    const dir = path.join(repoRoot, dirRelative);
    if (fs.existsSync(path.join(dir, "index.html"))) {
      return { staticDir: dir, staticDirRelative: dirRelative };
    }
  }

  return { staticDir: null, staticDirRelative: null };
};

const findHtmlFiles = (dir) => {
  if (!dir) return [];

  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .toSorted((left, right) => compareOrdinal(left.name, right.name));
  return entries.flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return findHtmlFiles(entryPath);
    if (entry.isFile() && entry.name.endsWith(".html")) return [entryPath];
    return [];
  });
};

const routeForHtmlFile = (staticDir, filePath) => {
  const relative = path.relative(staticDir, filePath).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) {
    return `/${relative.slice(0, -"index.html".length)}`;
  }
  return `/${relative}`;
};

const routeSourcesForStaticDir = (staticDir) =>
  findHtmlFiles(staticDir).map((filePath) => ({
    type: "static_html",
    path: filePath,
    route: routeForHtmlFile(staticDir, filePath),
  }));

export const detectRepo = (repoRoot, options = {}) => {
  const resolvedRepoRoot = path.resolve(repoRoot);
  const packageJson = options.packageJson ?? readPackageJson(resolvedRepoRoot);
  const packageManager = detectPackageManager(resolvedRepoRoot);
  const { staticDir, staticDirRelative } = detectStaticDir(resolvedRepoRoot);
  const { detectedFramework, confidence } = detectFramework(packageJson, Boolean(staticDir));

  return {
    repoRoot: resolvedRepoRoot,
    detectedFramework,
    confidence,
    packageManager,
    buildCommand: scriptCommand(packageManager, "build", packageJson),
    previewCommand: scriptCommand(packageManager, "preview", packageJson),
    staticDir,
    staticDirRelative,
    routeSources: routeSourcesForStaticDir(staticDir),
  };
};
