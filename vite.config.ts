import { defineConfig } from "vite";
import { resolve } from "node:path";
import { readdirSync, readFileSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";

const root = resolve(import.meta.dirname, ".generated");
const inputs = readdirSync(root, { recursive: true })
  .filter((path) => typeof path === "string" && path.endsWith(".html"))
  .map((path) => resolve(root, String(path)));
const vercel = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "vercel.json"), "utf8"),
) as {
  headers: { headers: { key: string; value: string }[] }[];
  redirects: { source: string; destination: string; permanent: boolean }[];
};
const securityHeaders = Object.fromEntries(
  vercel.headers[0]!.headers.map(({ key, value }) => [key, value]),
);

// Keep local navigation consistent with the redirects applied by Vercel.
function retiredOffers(req: IncomingMessage, res: ServerResponse, next: () => void): void {
  const url = new URL(req.url ?? "/", "http://localhost");
  const pathname = url.pathname.replace(/\/$/, "").replace(/\.html$/, "");
  const redirect = vercel.redirects.find((rule) => rule.source === pathname);
  if (!redirect) return next();
  res.statusCode = redirect.permanent ? 308 : 307;
  res.setHeader("Location", redirect.destination + url.search);
  res.end();
}

export default defineConfig({
  plugins: [{
    name: "retired-offer-redirects",
    configureServer(server) { server.middlewares.use(retiredOffers); },
    configurePreviewServer(server) { server.middlewares.use(retiredOffers); },
  }],
  root,
  appType: "mpa",
  publicDir: resolve(import.meta.dirname, "public"),
  resolve: { alias: { "/src": resolve(import.meta.dirname, "src") } },
  server: {
    host: "127.0.0.1",
    port: 3100,
    strictPort: true,
    fs: { allow: [import.meta.dirname] },
  },
  preview: {
    host: "127.0.0.1",
    port: 4100,
    strictPort: true,
    headers: securityHeaders,
  },
  build: {
    outDir: resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    target: "es2022",
    rollupOptions: { input: inputs },
  },
});
