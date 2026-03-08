import type { OxlintConfig } from "./helper.ts";
import { defineConfig } from "./helper.ts";

/**
 * Playwright related configuration.
 *
 * - `true`: enable playwright plugin with default test files pattern.
 * - `false`: do not enable playwright plugin.
 * - `string | string[]`: glob pattern(s) for test files.
 */
export type PlaywrightSimpleOptions = boolean | string | string[];

const DEFAULT_PLAYWRIGHT_TEST_FILES = ["e2e/**/*.{spec,test}.{js,ts}"];

export const getPlaywrightConfig = (options?: PlaywrightSimpleOptions): OxlintConfig => {
  // oxlint-disable-next-line typescript/strict-boolean-expressions
  if (!options) return defineConfig({});

  const playwrightPatterns = Array.isArray(options)
    ? options
    : typeof options === "string"
      ? [options]
      : DEFAULT_PLAYWRIGHT_TEST_FILES;

  return defineConfig({
    overrides: [
      // for playwright e2e tests
      {
        files: playwrightPatterns,
        rules: {
          // e2e tests navigation and locators are async
          "no-await-in-loop": "off",
        },
      },
    ],
  });
};
