# Release Checklist

Use this checklist before publishing `rankforge`.

## Documentation Alignment

Before publishing:

- Confirm `docs/prd-deterministic-audit-cli.md` describes the current CLI package version and the next roadmap target.
- Confirm `CHANGELOG.md` contains the package version being released.
- Confirm `README.md` and `skill/rankforge/SKILL.md` describe readiness versus measured rankings accurately.
- Confirm raw source corpus files remain repository assets and are not included in the CLI package dry run.
- Confirm the root `package.json` has `private: true` so accidental root publishes are blocked.

## Verification

Run from the repository root:

```bash
npm ci
npm audit --omit=dev
npm test
npm run validate
npm pack --dry-run --workspace packages/cli
npm pack --dry-run --json
```

For CI gating, run audits with a severity threshold:

```bash
npm run cli -- audit https://example.com --mode full --max-pages 25 --fail-on P1 --out audit.json --markdown audit.md --html audit.html
```

The audit command returns exit code `2` when findings meet or exceed the configured `--fail-on` severity.

## Version and Changelog

- Confirm `packages/cli/package.json` has the intended version.
- Update `CHANGELOG.md` with user-visible CLI, rule, schema, fixture, and skill-wrapper changes.
- Keep audit output schema changes backward-compatible unless the `schemaVersion` is intentionally changed.

## Publish Dry Run

- Confirm `npm pack --dry-run --workspace packages/cli` includes only intended package files.
- Confirm `npm pack --dry-run` at the repository root is not used as a publish target; the root package is private and the publishable package is the CLI workspace.
- Confirm optional Playwright support remains optional.
- Confirm fixture/golden files remain repository test assets and are not shipped in the CLI package.

## Packed CLI Smoke

Pack and install the CLI workspace in a temporary project before publishing:

```bash
tmpdir="$(mktemp -d)"
npm pack --workspace packages/cli --pack-destination "$tmpdir"
mkdir "$tmpdir/install"
cd "$tmpdir/install"
npm init -y
npm install --ignore-scripts "$tmpdir"/rankforge-*.tgz
npx rankforge --version
npx rankforge --help
npx rankforge explain-rule indexability.noindex
```

## Post-Merge Verification

After merging release-stabilization work to `main`, run:

```bash
git checkout main
git pull --ff-only origin main
npm ci
npm audit --omit=dev
npm test
npm run validate
npm pack --dry-run --workspace packages/cli
npm pack --dry-run --json
git status --short --branch
```

Expected result:

- Audit reports `found 0 vulnerabilities`.
- Tests pass.
- Validation reports `ok: true`.
- CLI package dry run lists only intended CLI package files.
- Root pack dry run is treated as a private-root packaging sanity check, not a publish artifact.
- Git status shows a clean `main` branch.

## GitHub Release Workflow

- Use `.github/workflows/release.yml`.
- Run with `dry_run: "true"` first.
- Publishing requires the `NPM_TOKEN` repository secret.
- Run with `dry_run: "false"` only after tests, validation, package dry run, version, and changelog are correct.
