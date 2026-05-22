const emptyGroup = () => ({ agents: [], rules: [] });

export const parseRobotsTxt = (text) => {
  const groups = [];
  let current = emptyGroup();

  const pushCurrent = () => {
    if (current.agents.length || current.rules.length) groups.push(current);
    current = emptyGroup();
  };

  for (const rawLine of String(text || "").split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    if (!line) continue;

    const [rawKey, ...rawValue] = line.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rawValue.join(":").trim();

    if (key === "user-agent") {
      if (current.rules.length) pushCurrent();
      current.agents.push(value.toLowerCase());
      continue;
    }

    if ((key === "allow" || key === "disallow") && current.agents.length) {
      current.rules.push({ type: key, path: value });
    }
  }

  pushCurrent();
  return { groups };
};

const pathFor = (pathOrUrl) => {
  try {
    const parsed = new URL(pathOrUrl);
    return parsed.pathname || "/";
  } catch {
    return String(pathOrUrl || "/");
  }
};

const matchingGroups = (parsed, userAgent) => {
  const agent = String(userAgent || "").toLowerCase();
  const groups = parsed?.groups || [];
  const exact = groups.filter((group) => group.agents.some((item) => item !== "*" && agent.includes(item)));
  return exact.length ? exact : groups.filter((group) => group.agents.includes("*"));
};

export const isAllowedByRobots = (parsed, pathOrUrl, userAgent = "RankForgeBot") => {
  const pathname = pathFor(pathOrUrl);
  const rules = matchingGroups(parsed, userAgent)
    .flatMap((group) => group.rules)
    .filter((rule) => rule.path && pathname.startsWith(rule.path))
    .sort((a, b) => b.path.length - a.path.length || (a.type === "allow" ? -1 : 1));

  if (!rules.length) return true;
  return rules[0].type === "allow";
};
