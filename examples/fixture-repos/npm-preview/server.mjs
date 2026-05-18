import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const port = Number(process.argv[2] || process.env.PORT || 4173);
const root = path.join(process.cwd(), "site");

const fileFor = (urlPath) => {
  if (urlPath === "/") return path.join(root, "index.html");
  return path.join(root, urlPath.replace(/^\//, ""));
};

const server = http.createServer((request, response) => {
  const filePath = fileFor(new URL(request.url, `http://127.0.0.1:${port}`).pathname);
  if (!filePath.startsWith(root) || !fs.existsSync(filePath)) {
    response.writeHead(404, { "content-type": "text/plain" });
    response.end("not found");
    return;
  }
  response.writeHead(200, { "content-type": "text/html" });
  response.end(fs.readFileSync(filePath, "utf8"));
});

server.listen(port, "127.0.0.1");
