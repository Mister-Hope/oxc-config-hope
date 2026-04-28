import type { OxlintOverride } from "oxlint";

import type { DummyRuleMap, OxlintConfig } from "./helper.ts";
import { defineConfig, defineRules } from "./helper.ts";

/**
 * vitest plugin rules
 */
export const vitestRules = defineRules({
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
  // allow void expressions in tests, e.g.: check a void function returns undefined
  "typescript/no-confusing-void-expression": "off",
  // allow non-null assertions in tests
  "typescript/no-non-null-assertion": "off",
  // the following rules are often too restrictive for tests,
  // which usually have more flexible coding style and may need to use any type for testing various edge cases.
  "typescript/no-explicit-any": "off",
  "typescript/no-unsafe-assignment": "off",
  "typescript/no-unsafe-member-access": "off",
  "typescript/unbound-method": "off",

  // allow @ts-ignore for untyped modules
  "typescript/prefer-ts-expect-error": "off",
  "typescript/require-array-sort-compare": "off",

  // test functions shall be placed near tests, not the beginning of the file
  "unicorn/consistent-function-scoping": "off",
  // we may implicit use func(undefined) in tests, this will be considered useless
  "unicorn/no-useless-undefined": "off",

  // set test file naming rules
  "vitest/consistent-test-filename": [
    "warn",
    {
      allTestPattern: "(^|\\/)(?:__tests__|tests)\\/(?!__fixtures__\\/|fixtures\\/)",
      pattern: ".*\\.((bench|spec)\\.[tj]sx?|spec-d\\.ts)$",
    },
  ],
  // limit the number of expects in a test
  "vitest/max-expects": ["warn", { max: 8 }],
  // we prefer importing vitest apis implicitly from 'vitest'
  "vitest/no-importing-vitest-globals": "off",
  // we prefer vitest/prefer-called-times to vitest/prefer-called-once for better readability
  "vitest/prefer-called-once": "off",
  // we prefer to check this manually, rather than adding expect.assertions() everywhere
  "vitest/prefer-expect-assertions": "off",
  // .toBe(false) is stricter than .toBeFalsy()
  "vitest/prefer-to-be-falsy": "off",
  // .toBe(true) is stricter than .toBeTruthy()
  "vitest/prefer-to-be-truthy": "off",
  // we may need to check truthy and falsy values in tests, so we don't enforce strict boolean matchers
  "vitest/prefer-strict-boolean-matchers": "off",
  // performance should be considered in bench files, but not test files, so we don't enforce timeout in tests
  "vitest/require-test-timeout": "off",
  // vitest allows test titles to be functions, so we don't enforce string titles
  "vitest/valid-title": "off",
});

/**
 * Vitest related configuration.
 */
export interface VitestScopeConfig {
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
export type VitestScopeOptions = boolean | string | string[] | VitestScopeConfig;

export interface VitestConfigOptions {
  /**
   * Additional vitest rules, merged with default vitest rules.
   *
   */
  rules?: DummyRuleMap;

  benchRules?: DummyRuleMap;
}

const DEFAULT_VITEST_TEST_FILES = ["**/*.{spec,test}.{js,ts}", "**/*.{spec,test}-d.ts"];
const DEFAULT_VITEST_BENCH_FILES = ["**/*.bench.{js,ts}"];

/**
 * Convert vitest scope options to resolved patterns.
 *
 * @param scope - Vitest scope options
 * @returns Resolved object with test patterns and bench patterns
 */
export const resolveVitestScope = (
  scope?: VitestScopeOptions,
): { testPatterns: string[]; benchPatterns: string[] | false } => {
  if (scope === false) return { testPatterns: [], benchPatterns: false };
  if (typeof scope === "string") return { testPatterns: [scope], benchPatterns: false };
  if (Array.isArray(scope)) return { testPatterns: scope, benchPatterns: false };
  if (typeof scope === "object" && scope != null) {
    const { tests, bench } = scope;
    const testPatterns = Array.isArray(tests) ? tests : tests ? [tests] : DEFAULT_VITEST_TEST_FILES;
    const benchPatterns = Array.isArray(bench)
      ? bench
      : bench === true
        ? DEFAULT_VITEST_BENCH_FILES
        : // oxlint-disable-next-line typescript/strict-boolean-expressions
          bench
          ? [bench]
          : false;
    return { testPatterns, benchPatterns };
  }

  return { testPatterns: DEFAULT_VITEST_TEST_FILES, benchPatterns: false };
};

export const getVitestConfig = (
  options: VitestConfigOptions = {},
  scope: VitestScopeOptions = true,
): OxlintConfig => {
  const { testPatterns, benchPatterns } = resolveVitestScope(scope);

  if (!testPatterns.length && (benchPatterns === false || !benchPatterns.length))
    return defineConfig({});

  return defineConfig({
    overrides: [
      {
        files: testPatterns,
        plugins: ["eslint", "vitest"],
        rules: { ...vitestRules, ...options.rules },
      },

      // oxlint-disable-next-line typescript/strict-boolean-expressions
      ...(benchPatterns
        ? [
            {
              files: benchPatterns,
              plugins: ["vitest"],
              rules: { ...vitestRules, ...options.rules, ...options.benchRules },
            } as OxlintOverride,
          ]
        : []),
    ],
  });
};
