import test from "node:test";
import assert from "node:assert/strict";
import { isAllowedByRobots, parseRobotsTxt } from "../src/robots.mjs";

test("parses robots groups and applies longest prefix rules", () => {
  const parsed = parseRobotsTxt(`
User-agent: *
Disallow: /private
Allow: /private/public

User-agent: OtherBot
Disallow: /
`);

  assert.equal(parsed.groups.length, 2);
  assert.equal(isAllowedByRobots(parsed, "/private/page", "RankForgeBot"), false);
  assert.equal(isAllowedByRobots(parsed, "/private/public/page", "RankForgeBot"), true);
  assert.equal(isAllowedByRobots(parsed, "/public/page", "RankForgeBot"), true);
});
