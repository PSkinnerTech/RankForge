import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "src");
const out = path.join(root, "out");
const nextDir = path.join(root, ".next");

fs.rmSync(out, { recursive: true, force: true });
fs.rmSync(nextDir, { recursive: true, force: true });
fs.mkdirSync(path.join(out, "about"), { recursive: true });
fs.mkdirSync(nextDir, { recursive: true });

fs.copyFileSync(path.join(src, "index.html"), path.join(out, "index.html"));
fs.copyFileSync(path.join(src, "about.html"), path.join(out, "about", "index.html"));
fs.writeFileSync(path.join(out, "robots.txt"), "User-agent: *\nAllow: /\n");
fs.writeFileSync(
  path.join(out, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.test/</loc></url><url><loc>https://example.test/about/</loc></url></urlset>\n',
);
fs.writeFileSync(
  path.join(nextDir, "prerender-manifest.json"),
  `${JSON.stringify(
    {
      version: 4,
      routes: {
        "/": { initialRevalidateSeconds: false, srcRoute: null, dataRoute: null },
        "/about/": { initialRevalidateSeconds: false, srcRoute: null, dataRoute: null },
        "/missing/": { initialRevalidateSeconds: false, srcRoute: null, dataRoute: null }
      },
      dynamicRoutes: {},
      notFoundRoutes: [],
      preview: { previewModeId: "fixture", previewModeSigningKey: "fixture", previewModeEncryptionKey: "fixture" }
    },
    null,
    2,
  )}\n`,
);

console.log("next fixture build complete");
