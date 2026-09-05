import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.js", "tests/**/*.test.ts", "*.test.js", "src/**/*.test.ts"],
  },
});
