import { spawn } from "node:child_process";
import { once } from "node:events";
import { setTimeout as sleep } from "node:timers/promises";
import { fetchWithGuards } from "./io-guards.mjs";

const outputCaptureLimitBytes = 64 * 1024;
const pollIntervalMs = 50;
const fetchAttemptTimeoutMs = 500;
const preflightTimeoutMs = 250;
const shutdownGraceMs = 500;

const isExited = (child) => child.exitCode !== null || child.signalCode !== null;

const waitForExit = async (child, timeoutMs) => {
  if (isExited(child)) {
    return true;
  }

  let timer;
  try {
    return await Promise.race([
      once(child, "exit").then(() => true),
      new Promise((resolve) => {
        timer = setTimeout(() => resolve(false), timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
};

const killChild = (child, signal) => {
  if (!child.pid || isExited(child)) {
    return;
  }

  try {
    if (process.platform === "win32") {
      child.kill(signal);
    } else {
      process.kill(-child.pid, signal);
    }
  } catch (error) {
    if (error?.code !== "ESRCH") {
      throw error;
    }
  }
};

const capStringByBytes = (value, maxBytes) => {
  if (Buffer.byteLength(value) <= maxBytes) {
    return value;
  }
  return Buffer.from(value).subarray(-maxBytes).toString();
};

const appendCappedChunk = (chunks, chunk) => {
  const capped = capStringByBytes(`${chunks.join("")}${String(chunk)}`, outputCaptureLimitBytes);
  chunks.splice(0, chunks.length, capped);
};

const stderrTail = (stderr) => {
  const tail = stderr.join("").trim();
  return tail ? ` Stderr: ${tail}` : "";
};

const previewError = (message, preview) => {
  const error = new Error(message);
  error.preview = preview;
  return error;
};

const earlyExitError = (preview, code, signal) =>
  previewError(
    `Preview command exited before server became reachable (${code === null ? `signal ${signal}` : `code ${code}`}).${stderrTail(preview.stderr)}`,
    preview,
  );

const commandExecutionDisabledError = () =>
  new Error("Restricted security mode disables local command execution for repo audits.");

const commandError = (message, commandResult) => {
  const error = new Error(message);
  error.commandResult = commandResult;
  return error;
};

export const runCommand = async ({ command, cwd, timeoutMs = 120000, label = "Command", security }) => {
  if (!command) {
    throw new Error(`${label} command is required.`);
  }
  if (security?.mode === "restricted") {
    throw commandExecutionDisabledError();
  }

  const child = spawn(command, {
    cwd,
    shell: true,
    detached: process.platform !== "win32",
    stdio: ["ignore", "pipe", "pipe"],
  });

  const startedAt = Date.now();
  const commandResult = {
    command,
    stdout: [],
    stderr: [],
    exitCode: null,
    signal: null,
    durationMs: 0,
    timedOut: false,
  };

  child.stdout?.on("data", (chunk) => appendCappedChunk(commandResult.stdout, chunk));
  child.stderr?.on("data", (chunk) => appendCappedChunk(commandResult.stderr, chunk));

  let timeout;
  const timeoutPromise = new Promise((_, reject) => {
    timeout = setTimeout(async () => {
      commandResult.timedOut = true;
      try {
        await stopPreview({ child });
      } catch {
        // Keep the timeout error as the actionable failure.
      }
      commandResult.durationMs = Date.now() - startedAt;
      reject(commandError(`${label} command timed out after ${timeoutMs} ms.`, commandResult));
    }, timeoutMs);
  });

  const exitPromise = new Promise((resolve, reject) => {
    child.once("error", (error) => {
      commandResult.durationMs = Date.now() - startedAt;
      reject(commandError(`${label} command failed to start: ${error.message}`, commandResult));
    });
    child.once("close", (code, signal) => {
      commandResult.exitCode = code;
      commandResult.signal = signal;
      commandResult.durationMs = Date.now() - startedAt;
      if (code === 0) {
        resolve(commandResult);
        return;
      }
      reject(
        commandError(
          `${label} command exited with ${code === null ? `signal ${signal}` : `code ${code}`}.`,
          commandResult,
        ),
      );
    });
  });

  try {
    return await Promise.race([exitPromise, timeoutPromise]);
  } finally {
    clearTimeout(timeout);
  }
};

const isSecurityGuardError = (error) => String(error?.message || "").startsWith("Restricted security mode ");

export const waitForHttp = async (url, options = {}) => {
  const timeoutMs = options.timeoutMs ?? 30000;
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (true) {
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) {
      break;
    }

    const attemptTimeoutMs = Math.min(fetchAttemptTimeoutMs, remainingMs);

    try {
      const response = await fetchWithGuards(url, {
        security: options.security,
        limits: { ...(options.limits || {}), timeoutMs: attemptTimeoutMs },
        fetchOptions: { redirect: "manual" },
      });
      if (response.status < 500) {
        await response.body?.cancel();
        return;
      }
      await response.body?.cancel();
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (isSecurityGuardError(error)) throw error;
      lastError = error;
    }

    await sleep(Math.min(pollIntervalMs, Math.max(0, deadline - Date.now())));
  }

  const suffix = lastError?.message ? ` Last error: ${lastError.message}` : "";
  throw new Error(`Preview server did not become reachable at ${url}.${suffix}`);
};

export const startPreview = async ({ command, cwd, previewUrl, timeoutMs = 30000, security, limits }) => {
  if (!command) {
    throw new Error("--preview-command is required for preview repo audits.");
  }
  if (!previewUrl) {
    throw new Error("--preview-url is required for preview repo audits.");
  }

  let previewUrlAlreadyReachable = false;
  try {
    await waitForHttp(previewUrl, { timeoutMs: preflightTimeoutMs, security, limits });
    previewUrlAlreadyReachable = true;
  } catch (error) {
    if (isSecurityGuardError(error)) throw error;
    previewUrlAlreadyReachable = false;
  }

  if (previewUrlAlreadyReachable) {
    throw new Error(`Preview URL is already reachable before starting command: ${previewUrl}`);
  }

  const child = spawn(command, {
    cwd,
    shell: true,
    detached: process.platform !== "win32",
    stdio: ["ignore", "pipe", "pipe"],
  });

  const preview = {
    child,
    url: previewUrl,
    stdout: [],
    stderr: [],
  };

  child.stdout?.on("data", (chunk) => appendCappedChunk(preview.stdout, chunk));
  child.stderr?.on("data", (chunk) => appendCappedChunk(preview.stderr, chunk));

  const startupError = new Promise((_, reject) => {
    child.once("error", (error) => {
      reject(previewError(`Preview command failed to start: ${error.message}`, preview));
    });
    child.once("close", (code, signal) => {
      reject(earlyExitError(preview, code, signal));
    });
  });

  try {
    await Promise.race([waitForHttp(previewUrl, { timeoutMs, security, limits }), startupError]);
    if (isExited(child)) {
      throw earlyExitError(preview, child.exitCode, child.signalCode);
    }
  } catch (error) {
    try {
      await stopPreview(preview);
    } catch {
      // Preserve the startup failure, which is the actionable error for callers.
    }
    error.preview ??= preview;
    throw error;
  }

  return preview;
};

export const stopPreview = async (preview) => {
  const child = preview?.child;
  if (!child || isExited(child)) {
    return;
  }

  if (preview.stopPromise) {
    return preview.stopPromise;
  }

  preview.stopPromise = (async () => {
    if (isExited(child)) {
      return;
    }

    killChild(child, "SIGTERM");
    const terminated = await waitForExit(child, shutdownGraceMs);
    if (terminated || isExited(child)) {
      return;
    }

    killChild(child, "SIGKILL");
    await waitForExit(child, shutdownGraceMs);
  })();

  return preview.stopPromise;
};
