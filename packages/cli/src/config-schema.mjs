import fs from "node:fs";
import path from "node:path";
import { unsafeRegexReason } from "./regex-guards.mjs";

export const auditConfigSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://rankforge.dev/schemas/rankforge-config.schema.json",
  title: "RankForge Config",
  type: "object",
  required: ["target"],
  additionalProperties: true,
  properties: {
    project: { type: "string" },
    target: { type: "string", minLength: 1 },
    sitemap: { type: "string" },
    urlList: { type: "string" },
    respectRobots: { type: "boolean" },
    brand: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: { type: "string" },
        type: { type: "string" },
        sameAs: { type: "array", items: { type: "string" } },
      },
    },
    audience: { type: "array", items: { type: "string" } },
    targetQueries: { type: "array", items: { type: "string" } },
    competitors: { type: "array", items: { type: "string" } },
    crawl: {
      type: "object",
      additionalProperties: true,
      properties: {
        mode: { enum: ["full", "sample", "single"] },
        maxPages: { type: "integer", minimum: 1 },
        maxDepth: { type: "integer", minimum: 0 },
        include: { type: "array", items: { type: "string" } },
        exclude: { type: "array", items: { type: "string" } },
      },
    },
    repo: {
      type: "object",
      additionalProperties: true,
      properties: {
        buildCommand: { type: "string" },
        previewCommand: { type: "string" },
        previewUrl: { type: "string" },
        staticDir: { type: "string" },
        routeList: { type: "string" },
        maxBuildMs: { type: "integer", minimum: 1 },
        maxPreviewMs: { type: "integer", minimum: 1 },
      },
    },
    render: {
      type: "object",
      additionalProperties: true,
      properties: {
        mode: { enum: ["auto", "always", "never"] },
        viewports: {
          type: "array",
          items: { enum: ["mobile", "desktop"] },
        },
      },
    },
    security: {
      type: "object",
      additionalProperties: true,
      properties: {
        mode: { enum: ["local", "restricted"] },
      },
    },
    limits: {
      type: "object",
      additionalProperties: true,
      properties: {
        timeoutMs: { type: "integer", minimum: 1 },
        maxHtmlBytes: { type: "integer", minimum: 1 },
        maxTextBytes: { type: "integer", minimum: 1 },
        maxFileBytes: { type: "integer", minimum: 1 },
        maxIntegrationBytes: { type: "integer", minimum: 1 },
      },
    },
    integrations: {
      type: "object",
      additionalProperties: true,
      properties: {
        searchConsole: { type: "string" },
        serp: { type: "string" },
        aiAnswers: { type: "string" },
        lighthouse: { type: "string" },
      },
    },
  },
};

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const isUrlOrLocalhost = (value) =>
  /^https?:\/\//i.test(value) || /^localhost(?::\d+)?(?:\/|$)/i.test(value) || /^127\.0\.0\.1(?::\d+)?/i.test(value);

const resolveMaybePath = (value, baseDir) => {
  if (typeof value !== "string" || !value || !baseDir) return value;
  if (isUrlOrLocalhost(value) || path.isAbsolute(value)) return value;
  return path.resolve(baseDir, value);
};

export const resolveAuditConfigPaths = (config, baseDir) => {
  if (!isObject(config)) return config;
  const resolved = {
    ...config,
    target: resolveMaybePath(config.target, baseDir),
    urlList: resolveMaybePath(config.urlList, baseDir),
    repo: isObject(config.repo)
      ? {
          ...config.repo,
          staticDir: resolveMaybePath(config.repo.staticDir, baseDir),
          routeList: resolveMaybePath(config.repo.routeList, baseDir),
        }
      : config.repo,
    integrations: config.integrations
      ? {
          ...config.integrations,
          searchConsole: resolveMaybePath(config.integrations.searchConsole, baseDir),
          serp: resolveMaybePath(config.integrations.serp, baseDir),
          aiAnswers: resolveMaybePath(config.integrations.aiAnswers, baseDir),
          lighthouse: resolveMaybePath(config.integrations.lighthouse, baseDir),
        }
      : config.integrations,
  };

  return resolved;
};

const isTargetLike = (value) => {
  if (typeof value !== "string" || !value.trim()) return false;
  if (/^https?:\/\//i.test(value)) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
  if (/^localhost(?::\d+)?\//i.test(value) || /^localhost(?::\d+)?$/i.test(value)) return true;
  if (/^127\.0\.0\.1(?::\d+)?/i.test(value)) return true;
  return Boolean(path.normalize(value));
};

const validateRegexList = (errors, key, value) => {
  if (value === undefined) return;
  if (!Array.isArray(value)) {
    errors.push(`${key} must be an array`);
    return;
  }
  for (const [index, pattern] of value.entries()) {
    if (typeof pattern !== "string") {
      errors.push(`${key}[${index}] must be a string`);
      continue;
    }
    try {
      new RegExp(pattern);
    } catch {
      errors.push(`${key}[${index}] must be a valid regular expression`);
      continue;
    }
    const unsafeReason = unsafeRegexReason(pattern);
    if (unsafeReason) errors.push(`${key}[${index}] contains an unsafe regular expression: ${unsafeReason}`);
  }
};

const validatePositiveInteger = (errors, key, value) => {
  if (value !== undefined && (!Number.isInteger(value) || value < 1)) {
    errors.push(`${key} must be a positive integer`);
  }
};

const validateExistingFile = (errors, key, filePath, baseDir) => {
  if (filePath === undefined || filePath === null || filePath === "") return;
  if (typeof filePath !== "string") {
    errors.push(`${key} must be a string`);
    return;
  }
  const resolved = path.isAbsolute(filePath) ? filePath : path.resolve(baseDir || process.cwd(), filePath);
  if (!fs.existsSync(resolved)) errors.push(`${key} file does not exist: ${filePath}`);
};

export const validateAuditConfig = (config, options = {}) => {
  const errors = [];

  if (!isObject(config)) {
    return { ok: false, errors: ["config must be an object"] };
  }

  if (!("target" in config)) {
    errors.push("target is required");
  } else if (!isTargetLike(config.target)) {
    errors.push("target must be a URL, localhost target, or local path");
  }

  if (config.crawl !== undefined) {
    if (!isObject(config.crawl)) {
      errors.push("crawl must be an object");
    } else {
      if (config.crawl.mode !== undefined && !["full", "sample", "single"].includes(config.crawl.mode)) {
        errors.push("crawl.mode must be one of: full, sample, single");
      }
      if (
        config.crawl.maxPages !== undefined &&
        (!Number.isInteger(config.crawl.maxPages) || config.crawl.maxPages < 1)
      ) {
        errors.push("crawl.maxPages must be a positive integer");
      }
      if (
        config.crawl.maxDepth !== undefined &&
        (!Number.isInteger(config.crawl.maxDepth) || config.crawl.maxDepth < 0)
      ) {
        errors.push("crawl.maxDepth must be a non-negative integer");
      }
      validateRegexList(errors, "crawl.include", config.crawl.include);
      validateRegexList(errors, "crawl.exclude", config.crawl.exclude);
      if (config.crawl.sitemap !== undefined && typeof config.crawl.sitemap !== "string") {
        errors.push("crawl.sitemap must be a string");
      }
      if (config.crawl.respectRobots !== undefined && typeof config.crawl.respectRobots !== "boolean") {
        errors.push("crawl.respectRobots must be a boolean");
      }
    }
  }

  if (config.repo !== undefined) {
    if (!isObject(config.repo)) {
      errors.push("repo must be an object");
    } else {
      for (const key of ["buildCommand", "previewCommand", "previewUrl", "staticDir", "routeList"]) {
        if (config.repo[key] !== undefined && typeof config.repo[key] !== "string") {
          errors.push(`repo.${key} must be a string`);
        }
      }
      validatePositiveInteger(errors, "repo.maxBuildMs", config.repo.maxBuildMs);
      validatePositiveInteger(errors, "repo.maxPreviewMs", config.repo.maxPreviewMs);
    }
  }

  if (config.render !== undefined) {
    if (!isObject(config.render)) {
      errors.push("render must be an object");
    } else if (config.render.mode !== undefined && !["auto", "always", "never"].includes(config.render.mode)) {
      errors.push("render.mode must be one of: auto, always, never");
    }
  }

  if (config.security !== undefined) {
    if (!isObject(config.security)) {
      errors.push("security must be an object");
    } else if (config.security.mode !== undefined && !["local", "restricted"].includes(config.security.mode)) {
      errors.push("security.mode must be one of: local, restricted");
    }
  }

  if (config.limits !== undefined) {
    if (!isObject(config.limits)) {
      errors.push("limits must be an object");
    } else {
      validatePositiveInteger(errors, "limits.timeoutMs", config.limits.timeoutMs);
      validatePositiveInteger(errors, "limits.maxHtmlBytes", config.limits.maxHtmlBytes);
      validatePositiveInteger(errors, "limits.maxTextBytes", config.limits.maxTextBytes);
      validatePositiveInteger(errors, "limits.maxFileBytes", config.limits.maxFileBytes);
      validatePositiveInteger(errors, "limits.maxIntegrationBytes", config.limits.maxIntegrationBytes);
    }
  }

  if (config.urlList !== undefined && typeof config.urlList !== "string") {
    errors.push("urlList must be a string");
  }

  if (config.integrations !== undefined && !isObject(config.integrations)) {
    errors.push("integrations must be an object");
  }

  if (options.checkFiles) {
    validateExistingFile(errors, "urlList", config.urlList, options.baseDir);
    validateExistingFile(errors, "repo.routeList", config.repo?.routeList, options.baseDir);
    validateExistingFile(errors, "integrations.searchConsole", config.integrations?.searchConsole, options.baseDir);
    validateExistingFile(errors, "integrations.serp", config.integrations?.serp, options.baseDir);
    validateExistingFile(errors, "integrations.aiAnswers", config.integrations?.aiAnswers, options.baseDir);
    validateExistingFile(errors, "integrations.lighthouse", config.integrations?.lighthouse, options.baseDir);
  }

  return { ok: errors.length === 0, errors };
};

export const readAuditConfig = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
