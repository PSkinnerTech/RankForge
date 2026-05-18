import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import net from "node:net";
import { once } from "node:events";
import { startPreview, stopPreview, waitForHttp } from "../src/repo-process.mjs";

const outputCaptureLimitBytes = 64 * 1024;

const freePort = async () => {
  const server = net.createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address();
  server.close();
  await once(server, "close");
  return port;
};

test("starts preview command, waits for HTTP, and stops process", async () => {
  const port = await freePort();
  const preview = await startPreview({
    command: `node server.mjs ${port}`,
    cwd: "examples/fixture-repos/npm-preview",
    previewUrl: `http://127.0.0.1:${port}`,
    timeoutMs: 5000,
  });

  assert.equal(preview.url, `http://127.0.0.1:${port}`);
  const response = await fetch(preview.url);
  assert.equal(response.status, 200);

  await stopPreview(preview);
  await assert.rejects(() => waitForHttp(preview.url, { timeoutMs: 250 }), /Preview server did not become reachable/);
});

test("stopPreview is safe to call more than once", async () => {
  const port = await freePort();
  const preview = await startPreview({
    command: `node server.mjs ${port}`,
    cwd: "examples/fixture-repos/npm-preview",
    previewUrl: `http://127.0.0.1:${port}`,
    timeoutMs: 5000,
  });

  await stopPreview(preview);
  await stopPreview(preview);
});

test("waitForHttp times out promptly when a server accepts but never responds", async () => {
  const sockets = new Set();
  const server = net.createServer((socket) => {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
    socket.on("error", () => {});
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address();

  const startedAt = Date.now();
  await assert.rejects(
    () => waitForHttp(`http://127.0.0.1:${port}`, { timeoutMs: 250 }),
    /Preview server did not become reachable/,
  );
  assert.ok(Date.now() - startedAt < 1000);

  for (const socket of sockets) {
    socket.destroy();
  }
  server.close();
  await once(server, "close");
});

test("waitForHttp keeps polling on 500 and resolves on a later non-500 response", async () => {
  let requests = 0;
  const server = http.createServer((request, response) => {
    requests += 1;
    const status = requests === 1 ? 500 : 200;
    response.writeHead(status);
    response.end();
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address();

  await waitForHttp(`http://127.0.0.1:${port}`, { timeoutMs: 1000 });

  assert.equal(requests, 2);
  server.close();
  await once(server, "close");
});

test("reports preview startup timeout", async () => {
  const port = await freePort();
  await assert.rejects(
    () =>
      startPreview({
        command: "node -e \"setTimeout(() => {}, 5000)\"",
        cwd: ".",
        previewUrl: `http://127.0.0.1:${port}`,
        timeoutMs: 250,
      }),
    /Preview server did not become reachable/,
  );
});

test("reports spawn errors before preview startup timeout", async () => {
  const port = await freePort();
  await assert.rejects(
    () =>
      startPreview({
        command: "node server.mjs",
        cwd: "examples/fixture-repos/missing",
        previewUrl: `http://127.0.0.1:${port}`,
        timeoutMs: 5000,
      }),
    /Preview command failed to start/,
  );
});

test("reports early preview command exits with stderr tail", async () => {
  const port = await freePort();
  await assert.rejects(
    () =>
      startPreview({
        command: "node -e \"console.error('startup failed'); process.exit(7)\"",
        cwd: ".",
        previewUrl: `http://127.0.0.1:${port}`,
        timeoutMs: 5000,
      }),
    /Preview command exited before server became reachable \(code 7\).*startup failed/s,
  );
});

test("rejects before spawning when another process already serves the preview URL", async () => {
  const server = http.createServer((request, response) => {
    response.end("already running");
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address();

  try {
    await assert.rejects(
      () =>
        startPreview({
          command: "node -e \"setTimeout(() => process.exit(7), 250)\"",
          cwd: ".",
          previewUrl: `http://127.0.0.1:${port}`,
          timeoutMs: 5000,
        }),
      new RegExp(`Preview URL is already reachable before starting command: http://127\\.0\\.0\\.1:${port}`),
    );
  } finally {
    server.close();
    await once(server, "close");
  }
});

test("caps captured preview stdout and stderr", async () => {
  const port = await freePort();
  await assert.rejects(
    async () => {
      const preview = await startPreview({
        command:
          "node -e \"process.stdout.write('o'.repeat(70000)); process.stderr.write('e'.repeat(70000)); process.exit(3)\"",
        cwd: ".",
        previewUrl: `http://127.0.0.1:${port}`,
        timeoutMs: 5000,
      });
      return preview;
    },
    (error) => {
      assert.match(error.message, /Preview command exited before server became reachable/);
      assert.ok(error.preview);
      assert.ok(error.preview.stdout.join("").length <= outputCaptureLimitBytes);
      assert.ok(error.preview.stderr.join("").length <= outputCaptureLimitBytes);
      return true;
    },
  );
});

test("requires preview command", async () => {
  await assert.rejects(
    () =>
      startPreview({
        cwd: ".",
        previewUrl: "http://127.0.0.1:3000",
      }),
    /--preview-command is required for preview repo audits\./,
  );
});

test("requires preview URL", async () => {
  await assert.rejects(
    () =>
      startPreview({
        command: "node server.mjs",
        cwd: ".",
      }),
    /--preview-url is required for preview repo audits\./,
  );
});
