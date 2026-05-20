import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "src");
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, "services"), { recursive: true });

fs.copyFileSync(path.join(src, "index.html"), path.join(dist, "index.html"));
fs.copyFileSync(path.join(src, "services.html"), path.join(dist, "services", "index.html"));
fs.writeFileSync(path.join(dist, "robots.txt"), "User-agent: *\nAllow: /\n");
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.test/</loc></url><url><loc>https://example.test/services/</loc></url></urlset>\n',
);

console.log("astro fixture build complete");
