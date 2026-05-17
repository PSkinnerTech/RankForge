import crypto from "node:crypto";
import path from "node:path";
import { extractHtmlEvidence } from "./html-extract.mjs";
import { fetchWithGuards, readResponseTextLimited, readTextFileLimited, resolveLimits } from "./io-guards.mjs";
import { renderHtml } from "./render.mjs";
import { isHttpUrl } from "./url-utils.mjs";

const userAgent = "OpenClaw GEO SEO audit snapshot";

const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");

const headersToObject = (headers) => {
  const result = {};
  for (const [key, value] of headers.entries()) result[key] = value;
  return result;
};

const fetchRaw = async (target, options = {}) => {
  let current = target;
  const redirectChain = [];
  const maxRedirects = options.maxRedirects ?? 5;
  const limits = resolveLimits(options.limits);

  for (let attempt = 0; attempt <= maxRedirects; attempt++) {
    const response = await fetchWithGuards(current, {
      security: options.security,
      limits,
      fetchOptions: {
        headers: { "user-agent": userAgent },
        redirect: "manual",
      },
    });

    const headers = headersToObject(response.headers);
    const location = response.headers.get("location");
    if ([301, 302, 303, 307, 308].includes(response.status) && location) {
      const nextUrl = new URL(location, current).href;
      redirectChain.push({ url: current, status: response.status, location: nextUrl });
      current = nextUrl;
      continue;
    }

    return {
      sourceType: "url",
      finalUrl: response.url || current,
      status: response.status,
      ok: response.ok,
      headers,
      redirectChain,
      html: await readResponseTextLimited(response, {
        limits,
        maxBytes: limits.maxHtmlBytes,
        label: current,
      }),
    };
  }

  throw new Error(`Too many redirects while fetching ${target}`);
};

const readFile = (target, options = {}) => {
  const fullPath = path.resolve(target);
  const limits = resolveLimits(options.limits);
  return {
    sourceType: "file",
    finalUrl: fullPath,
    status: null,
    ok: true,
    headers: {},
    redirectChain: [],
    html: readTextFileLimited(fullPath, {
      security: options.security,
      limits,
      maxBytes: limits.maxHtmlBytes,
    }),
  };
};

export const collectSnapshot = async (target, options = {}) => {
  const raw = isHttpUrl(target) ? await fetchRaw(target, options) : readFile(target, options);
  const baseUrl = raw.sourceType === "url" ? raw.finalUrl : null;
  const evidence = extractHtmlEvidence(raw.html, baseUrl);
  const shouldRender = options.render === "always" || options.render === "auto" || options.renderer;

  let render = { status: "not_requested" };
  if (shouldRender) {
    const rendered = await renderHtml(raw.finalUrl, {
      ...options,
      html: raw.html,
      finalUrl: raw.finalUrl,
    });
    if (rendered.status === "rendered") {
      const renderedEvidence = extractHtmlEvidence(rendered.html, baseUrl);
      render = {
        status: "rendered",
        renderedHash: hash(rendered.html),
        evidence: renderedEvidence,
        textDeltaCharacters: Math.abs(
          (renderedEvidence.counts?.visibleTextCharacters || 0) - (evidence.counts?.visibleTextCharacters || 0),
        ),
      };
    } else {
      render = rendered;
    }
  }

  return {
    target,
    sourceType: raw.sourceType,
    finalUrl: raw.finalUrl,
    status: raw.status,
    ok: raw.ok,
    headers: raw.headers,
    redirectChain: raw.redirectChain,
    rawHash: hash(raw.html),
    evidence,
    render,
  };
};
