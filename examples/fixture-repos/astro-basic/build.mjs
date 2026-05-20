import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "src");
const dist = path.join(root, "dist");
const astroDir = path.join(root, ".astro");

fs.rmSync(dist, { recursive: true, force: true });
fs.rmSync(astroDir, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, "services"), { recursive: true });
fs.mkdirSync(astroDir, { recursive: true });

fs.copyFileSync(path.join(src, "index.html"), path.join(dist, "index.html"));
fs.copyFileSync(path.join(src, "services.html"), path.join(dist, "services", "index.html"));
fs.writeFileSync(path.join(dist, "robots.txt"), "User-agent: *\nAllow: /\n");
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.test/</loc></url><url><loc>https://example.test/services/</loc></url></urlset>\n',
);
fs.writeFileSync(
  path.join(astroDir, "manifest.json"),
  `${JSON.stringify(
    {
      routes: [
        { route: "/", type: "page" },
        { route: "/services/", type: "page" }
      ],
      assets: []
    },
    null,
    2,
  )}\n`,
);

console.log("astro fixture build complete");
