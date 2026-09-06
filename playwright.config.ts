import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  workers: 2,
  reporter: "list",
  forbidOnly: !!process.env.CI,
  webServer: process.env.BASE_URL ? undefined : {
    command: "npm run preview",
    url: "http://127.0.0.1:4100",
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: process.env.BASE_URL || "http://127.0.0.1:4100",
    channel: "chrome",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
});
