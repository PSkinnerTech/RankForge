# Release Checklist

Use this checklist before publishing `openclaw-geo-seo-audit`.

## Verification

Run from the repository root:

```bash
npm test
npm run validate
npm pack --dry-run --workspace packages/cli
```

For CI gating, run audits with a severity threshold:

```bash
npm run cli -- audit https://example.com --mode full --max-pages 25 --fail-on P1 --out audit.json --markdown audit.md
```

The audit command returns exit code `2` when findings meet or exceed the configured `--fail-on` severity.

## Version and Changelog

- Confirm `packages/cli/package.json` has the intended version.
- Update `CHANGELOG.md` with user-visible CLI, rule, schema, fixture, and skill-wrapper changes.
- Keep audit output schema changes backward-compatible unless the `schemaVersion` is intentionally changed.

## Publish Dry Run

- Confirm `npm pack --dry-run --workspace packages/cli` includes only intended package files.
- Confirm optional Playwright support remains optional.
- Confirm fixture/golden files remain repository test assets and are not shipped in the CLI package.

## GitHub Release Workflow

- Use `.github/workflows/release.yml`.
- Run with `dry_run: "true"` first.
- Publishing requires the `NPM_TOKEN` repository secret.
- Run with `dry_run: "false"` only after tests, validation, package dry run, version, and changelog are correct.
