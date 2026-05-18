import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

test("packed CLI includes the source map used by audit output", async () => {
  const { stdout } = await execFileAsync("npm", ["pack", "--json", "--dry-run", "--workspace", "packages/cli"], {
    cwd: repoRoot,
  });
  const [pack] = JSON.parse(stdout);
  const files = pack.files.map((file) => file.path);

  assert.ok(files.includes("src/audit.mjs"));
  assert.ok(files.includes("src/source-map.json"));
});
