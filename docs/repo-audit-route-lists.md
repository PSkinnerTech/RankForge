# Repository Route Lists

RankForge route lists make repository audits deterministic when static output does not expose every user-facing route as a discoverable HTML file. RankForge does not infer client router source files, so React Router, Vue Router, SvelteKit adapter output, and other client-side route definitions need an explicit route list or a preview server workflow.

Use route lists when you already know the routes that should be audited and want stable JSON, Markdown, and HTML reports in local checks or CI.

## Static HTML Routes

For static sites that emit one HTML file per route, use a one-column route list. Each line is the route path RankForge should audit inside the static output directory.

```txt
/
/pricing/
/docs/
/blog/launch-notes/
```

Run the repository audit after building the site:

```bash
rankforge audit-repo . --build-command "npm run build" --static-dir dist --route-list routes.txt --out rankforge-audit.json --markdown rankforge-audit.md --html rankforge-audit.html
```

## SPA Mapped Routes

For a single-page application, many routes may map to the same generated `index.html` file. Use a two-column route list where the first column is the public route and the second column is the file inside the static directory.

```txt
/ index.html
/pricing/ index.html
/account/ index.html
/docs/getting-started/ index.html
```

This tells RankForge to audit each public route while reading the SPA shell from `dist/index.html`. The route still appears as the intended URL path in the audit evidence and reports.

## Config File Example

You can keep the same workflow in `audit.config.json`:

```json
{
  "target": ".",
  "repo": {
    "buildCommand": "npm run build",
    "staticDir": "dist",
    "routeList": "routes.txt"
  }
}
```

Then run:

```bash
rankforge audit-repo . --config audit.config.json --fail-on P1 --out rankforge-audit.json --markdown rankforge-audit.md --html rankforge-audit.html
```

## Preview Server Alternative

If your app requires server behavior, middleware, redirects, dynamic rendering, or client router fallback behavior that is not represented by static files, audit an explicit preview server instead of a route list.

```bash
rankforge audit-repo . --preview-command "npm run preview -- --host 127.0.0.1" --preview-url http://127.0.0.1:4173 --max-pages 25 --out rankforge-audit.json --markdown rankforge-audit.md --html rankforge-audit.html
```

Use the preview server workflow for routes that only work through the application server. Use route lists for deterministic static output audits where the route-to-file mapping is known.
