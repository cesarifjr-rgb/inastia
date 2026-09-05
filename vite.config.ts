import { defineConfig } from "vite";
import { resolve } from "node:path";
import { readdirSync, readFileSync } from "node:fs";

const root = resolve(import.meta.dirname, ".generated");
const inputs = readdirSync(root, { recursive: true })
  .filter((path) => typeof path === "string" && path.endsWith(".html"))
  .map((path) => resolve(root, String(path)));
const vercel = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "vercel.json"), "utf8"),
) as { headers: { headers: { key: string; value: string }[] }[] };
const securityHeaders = Object.fromEntries(
  vercel.headers[0]!.headers.map(({ key, value }) => [key, value]),
);

export default defineConfig({
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
