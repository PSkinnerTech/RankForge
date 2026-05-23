# Release Checklist

Use this checklist before publishing `rankforge`.

## Documentation Alignment

Before publishing:

- Confirm `docs/prd-deterministic-audit-cli.md` describes the current CLI package version and the next roadmap target.
- Confirm `CHANGELOG.md` contains the package version being released.
- Confirm `README.md` and `skill/rankforge/SKILL.md` describe readiness versus measured rankings accurately.
- Confirm raw source corpus files remain repository assets and are not included in the CLI package dry run.
- Confirm the root `package.json` has `private: true` so accidental root publishes are blocked.
- Confirm npm registry metadata points at the intended package and repository:

```bash
npm view rankforge version dist-tags.latest homepage bugs.url repository.url
```

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

## Publish Flow

The currently verified manual publish path is:

```bash
npm publish --workspace packages/cli --access public
```

For accounts protected by npm web authentication, the npm CLI may print an authentication URL. Complete the browser security-key or passkey challenge, return to the terminal, and let the publish finish.

For token-based publishing, use a granular npm access token with package read/write access and the npm-required two-factor bypass setting. Do not use a broad long-lived token when a narrower token is sufficient. Do not print tokens in logs.

## Post-Publish Registry Smoke

After publishing, verify the registry and install the package in a clean temporary project:

```bash
npm view rankforge version dist-tags.latest homepage bugs.url repository.url

tmpdir="$(mktemp -d)"
mkdir "$tmpdir/project"
cd "$tmpdir/project"
npm init -y
npm install --ignore-scripts rankforge@0.4.0
npx rankforge --version
npx rankforge --help
npx rankforge explain-rule indexability.noindex
```

Expected result:

- `npm view` reports the released version as `latest`.
- The temporary install succeeds without repository-local files.
- `npx rankforge --version` prints the released version.
- `npx rankforge explain-rule indexability.noindex` prints JSON for that rule.

## GitHub Release Workflow

- Use `.github/workflows/release.yml` for verification and optional token-backed publish attempts.
- Run with `dry_run: "true"` first.
- Publishing with the workflow currently requires the `NPM_TOKEN` repository secret.
- The preferred future direction is npm trusted publishing with provenance if it can be configured without weakening package publishing security.
- Run with `dry_run: "false"` only after tests, validation, package dry run, version, changelog, and registry expectations are correct.
