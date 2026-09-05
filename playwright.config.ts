import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  workers: 2,
  reporter: "list",
  use: {
    baseURL: process.env.BASE_URL || "http://127.0.0.1:4100",
    channel: "chrome",
    screenshot: "only-on-failure",
  },
});
