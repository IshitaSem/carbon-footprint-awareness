import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // jsdom provides browser globals (window, sessionStorage, document)
    // needed for any module that references DOM APIs
    environment: "jsdom",

    // Register @testing-library/jest-dom matchers globally in every test file
    setupFiles: ["./vitest.setup.ts"],

    // Collect coverage from lib/ — the business logic the evaluator inspects
    coverage: {
      provider: "v8",
      include: ["lib/**/*.ts"],
      exclude: ["lib/utils.ts"],
      reporter: ["text", "html", "lcov"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },

    globals: true,
  },

  resolve: {
    // Mirror the @/* alias from tsconfig.json so test imports like
    // import { ... } from "@/lib/carbon-calculator" resolve correctly
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
