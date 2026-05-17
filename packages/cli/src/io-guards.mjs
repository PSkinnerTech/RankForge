import dns from "node:dns/promises";
import fs from "node:fs";
import net from "node:net";

export const defaultLimits = {
  timeoutMs: 15000,
  maxHtmlBytes: 2_000_000,
  maxTextBytes: 1_000_000,
  maxFileBytes: 5_000_000,
  maxIntegrationBytes: 5_000_000,
};

export const resolveLimits = (limits = {}) => ({
  ...defaultLimits,
  ...(limits || {}),
});

const securityMode = (security = {}) => security?.mode || "local";

const isBlockedHostname = (hostname) => {
  const normalized = String(hostname || "").toLowerCase().replace(/^\[|\]$/g, "");
  return (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized === "ip6-localhost" ||
    normalized === "metadata.google.internal"
  );
};

const isPrivateIpv4 = (address) => {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return false;
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    a === 169 && b === 254 ||
    a === 172 && b >= 16 && b <= 31 ||
    a === 192 && b === 168 ||
    a === 100 && b >= 64 && b <= 127 ||
    a === 198 && (b === 18 || b === 19)
  );
};

const isPrivateIpv6 = (address) => {
  const normalized = address.toLowerCase();
  const firstHextet = Number.parseInt(normalized.split(":")[0], 16);
  return (
    normalized === "::1" ||
    normalized.startsWith("::ffff:") ||
    (Number.isFinite(firstHextet) && firstHextet >= 0xfe80 && firstHextet <= 0xfebf) ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd")
  );
};

const isPrivateAddress = (address) => {
  const version = net.isIP(address);
  if (version === 4) return isPrivateIpv4(address);
  if (version === 6) return isPrivateIpv6(address);
  return false;
};

const resolveAddresses = async (hostname) => {
  const literalVersion = net.isIP(hostname);
  if (literalVersion) return [hostname];
  try {
    const records = await dns.lookup(hostname, { all: true, verbatim: true });
    return records.map((record) => record.address);
  } catch {
    return [];
  }
};

export const assertUrlAllowed = async (target, security = {}) => {
  if (securityMode(security) !== "restricted") return;

  const parsed = new URL(target);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(`Restricted security mode only allows HTTP(S) URLs: ${target}`);
  }
  const hostname = parsed.hostname.replace(/^\[|\]$/g, "");
  if (isBlockedHostname(hostname)) {
    throw new Error(`Restricted security mode blocks private network target: ${target}`);
  }

  const addresses = await resolveAddresses(hostname);
  if (addresses.some(isPrivateAddress)) {
    throw new Error(`Restricted security mode blocks private network target: ${target}`);
  }
};

export const assertFileAllowed = (target, security = {}, options = {}) => {
  if (securityMode(security) === "restricted" && !options.allowRestricted) {
    throw new Error(`Local file targets are disabled by restricted security mode: ${target}`);
  }
};

export const readTextFileLimited = (filePath, options = {}) => {
  const limits = resolveLimits(options.limits);
  const maxBytes = options.maxBytes ?? limits.maxFileBytes;
  if (options.security) assertFileAllowed(filePath, options.security, { allowRestricted: options.allowRestricted });

  const stat = fs.statSync(filePath);
  if (!stat.isFile()) {
    throw new Error(`Only regular files can be read: ${filePath}`);
  }
  if (stat.size > maxBytes) {
    throw new Error(`File ${filePath} exceeds ${maxBytes} bytes.`);
  }
  return fs.readFileSync(filePath, "utf8");
};

export const fetchWithGuards = async (target, options = {}) => {
  const limits = resolveLimits(options.limits);
  const redirect = options.fetchOptions?.redirect || "manual";
  if (securityMode(options.security) === "restricted" && redirect !== "manual") {
    throw new Error("Restricted security mode requires manual redirects.");
  }
  await assertUrlAllowed(target, options.security);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), limits.timeoutMs);
  try {
    return await fetch(target, {
      redirect: "manual",
      ...options.fetchOptions,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Timed out fetching ${target} after ${limits.timeoutMs} ms.`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const readResponseTextLimited = async (response, options = {}) => {
  const limits = resolveLimits(options.limits);
  const maxBytes = options.maxBytes ?? limits.maxTextBytes;
  const label = options.label || response.url || "response";
  const timeoutError = () => new Error(`Timed out reading response body for ${label} after ${limits.timeoutMs} ms.`);
  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new Error(`Response body for ${label} exceeds ${maxBytes} bytes.`);
  }

  if (!response.body) {
    let timeout;
    const text = await Promise.race([
      response.text(),
      new Promise((resolve, reject) => {
        timeout = setTimeout(() => reject(timeoutError()), limits.timeoutMs);
      }),
    ]).finally(() => clearTimeout(timeout));
    if (Buffer.byteLength(text, "utf8") > maxBytes) {
      throw new Error(`Response body for ${label} exceeds ${maxBytes} bytes.`);
    }
    return text;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let received = 0;
  let text = "";
  let timeout;
  let timedOut = false;
  const timeoutPromise = new Promise((resolve, reject) => {
    timeout = setTimeout(() => {
      timedOut = true;
      reader.cancel().catch(() => {});
      reject(timeoutError());
    }, limits.timeoutMs);
  });

  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), timeoutPromise]);
      if (timedOut) throw timeoutError();
      if (done) break;
      received += value.byteLength;
      if (received > maxBytes) {
        await reader.cancel();
        throw new Error(`Response body for ${label} exceeds ${maxBytes} bytes.`);
      }
      text += decoder.decode(value, { stream: true });
    }
  } finally {
    clearTimeout(timeout);
  }

  return text + decoder.decode();
};
