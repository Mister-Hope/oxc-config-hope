import type { OxlintConfig } from "./helper.ts";
import { defineConfig, defineRules } from "./helper.ts";

/**
 * vitest plugin rules
 */
export const vitestRules = defineRules({
  "vitest/consistent-test-filename": [
    "warn",
    {
      allTestPattern: "(^|\\/)(?:__tests__|tests)\\/",
      pattern: ".*\\.((bench|spec)\\.[tj]sx?|spec-d\\.ts)$",
    },
  ],
  "vitest/no-importing-vitest-globals": "off",
  "vitest/prefer-called-once": "off",
  "vitest/prefer-to-be-falsy": "off",
  "vitest/prefer-to-be-truthy": "off",
});

export const vitestTestFileRules = defineRules({
  // stylistic rules
  "id-length": "off",
  "max-classes-per-file": "off",
  "max-lines-per-function": "off",
  "max-lines": "off",
  "max-statements": "off",
  "no-empty-function": "off",
  "no-undefined": "off",

  // vitest polyfills __dirname and __filename
  "prefer-module": "off",

  // allow importing node modules in tests
  "import/no-nodejs-modules": "off",

  // allow @ts-ignore and @ts-expect-error in tests
  "typescript/ban-ts-comment": "off",
  // allow non-null assertions in tests
  "typescript/no-non-null-assertion": "off",
  // allow @ts-ignore for untyped modules
  "typescript/prefer-ts-expect-error": "off",
  "typescript/require-array-sort-compare": "off",

  // test functions shall be placed near tests, not the beginning of the file
  "unicorn/consistent-function-scoping": "off",
});

/**
 * Vitest related configuration.
 */
export interface VitestConfigOptions {
  /**
   * test files pattern
   */
  tests?: string | string[];

  /**
   * bench files pattern
   */
  bench?: string | string[] | boolean;
}

/**
 * Vitest related configuration.
 *
 * - `true`: enable vitest plugin with default test files pattern.
 * - `false`: do not enable vitest plugin.
 * - `string | string[]`: glob pattern(s) for test files.
 *
 * By default, it includes common test file patterns and excludes bench files.
 */
export type VitestSimpleOptions = boolean | string | string[];

const DEFAULT_VITEST_TEST_FILES = ["**/*.{spec,test}.{js,ts}", "**/*.{spec,test}-d.ts"];
const DEFAULT_VITEST_BENCH_FILES = ["**/*.bench.{js,ts}"];

export const getVitestConfig = (
  options: VitestConfigOptions | VitestSimpleOptions = {},
): OxlintConfig => {
  if (options === false) return defineConfig({});

  let testPatterns: string[] = DEFAULT_VITEST_TEST_FILES;
  let benchPatterns: string[] | false = false;

  if (typeof options === "string") {
    testPatterns = [options];
  } else if (Array.isArray(options)) {
    testPatterns = options;
  } else if (typeof options === "object" && options != null) {
    testPatterns = Array.isArray(options.tests)
      ? options.tests
      : options.tests
        ? [options.tests]
        : DEFAULT_VITEST_TEST_FILES;
    benchPatterns = Array.isArray(options.bench)
      ? options.bench
      : options.bench === true
        ? DEFAULT_VITEST_BENCH_FILES
        : // oxlint-disable-next-line typescript/strict-boolean-expressions
          options.bench
          ? [options.bench]
          : false;
  }

  return defineConfig({
    plugins: ["vitest"],
    rules: vitestRules,
    overrides: [
      {
        // oxlint-disable-next-line typescript/strict-boolean-expressions
        files: benchPatterns ? [...testPatterns, ...benchPatterns] : testPatterns,
        rules: vitestTestFileRules,
      },
    ],
  });
};
