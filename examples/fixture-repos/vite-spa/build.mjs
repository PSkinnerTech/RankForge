import fs from "node:fs";
import path from "node:path";

const root = new URL(".", import.meta.url).pathname;
const src = path.join(root, "src");
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.copyFileSync(path.join(src, "index.html"), path.join(dist, "index.html"));
fs.writeFileSync(path.join(dist, "robots.txt"), "User-agent: *\nAllow: /\n");
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    "  <url><loc>https://example.com/</loc></url>",
    "  <url><loc>https://example.com/pricing/</loc></url>",
    "  <url><loc>https://example.com/docs/</loc></url>",
    "</urlset>",
    "",
  ].join("\n"),
);
