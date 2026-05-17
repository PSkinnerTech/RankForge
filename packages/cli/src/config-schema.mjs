import fs from "node:fs";
import path from "node:path";

export const auditConfigSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://openclaw.dev/schemas/geo-seo-audit-config.schema.json",
  title: "OpenClaw GEO/SEO Audit Config",
  type: "object",
  required: ["target"],
  additionalProperties: true,
  properties: {
    project: { type: "string" },
    target: { type: "string", minLength: 1 },
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
  },
};

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

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
    }
  }
};

export const validateAuditConfig = (config) => {
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
    }
  }

  if (config.render !== undefined) {
    if (!isObject(config.render)) {
      errors.push("render must be an object");
    } else if (config.render.mode !== undefined && !["auto", "always", "never"].includes(config.render.mode)) {
      errors.push("render.mode must be one of: auto, always, never");
    }
  }

  return { ok: errors.length === 0, errors };
};

export const readAuditConfig = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
