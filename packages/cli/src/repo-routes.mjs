import fs from "node:fs";
import path from "node:path";

const ordinalCompare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);

const htmlFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((left, right) => ordinalCompare(left.name, right.name));
  const files = [];

  for (const entry of entries) {
    const itemPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...htmlFiles(itemPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(itemPath);
  }

  return files;
};

const routeFor = (root, file) => {
  const relative = path.relative(root, file);
  const parsed = path.parse(relative);
  const routePath = relative.split(path.sep).join("/");

  if (routePath === "index.html") return "/";
  if (parsed.base === "index.html") return `/${parsed.dir.split(path.sep).join("/")}/`;
  return `/${routePath}`;
};

export const discoverStaticRoutes = (staticDir) => {
  const root = path.resolve(staticDir);

  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    throw new Error(`Static directory does not exist or is not a directory: ${root}`);
  }

  return htmlFiles(root)
    .map((file) => ({
      type: "static_html",
      route: routeFor(root, file),
      path: file,
    }))
    .sort((left, right) => ordinalCompare(left.route, right.route) || ordinalCompare(left.path, right.path));
};
