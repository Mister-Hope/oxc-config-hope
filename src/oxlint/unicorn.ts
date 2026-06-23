import { defineConfig, defineRules } from "./helper.ts";
import type { DummyRuleMap, OxlintConfig } from "./helper.ts";

/**
 * unicorn plugin rules
 */
export const unicornRules = defineRules({
  // filename should not be enforced strictly, e.g. Vue SFC files shall be PascalCased
  // we shall expect a project level setting
  "unicorn/filename-case": "off",
  // this rule introduce too many false positives
  "unicorn/explicit-length-check": "off",
  // sometimes we do need to use reduce for better readability
  "unicorn/no-array-reduce": "off",
  // toReversed can introduce memory overhead,
  // in some chained calls it is better to use reverse as the "reversed" array is also a temp variable.
  "unicorn/no-array-reverse": "off",
  // toSorted can introduce memory overhead
  // in some chained calls it is better to use reverse as the "sorted" array is also a temp variable.
  "unicorn/no-array-sort": "off",
  // Array.forEach has its use cases
  "unicorn/no-array-for-each": "off",
  // for code simplicity we may not want to create temp variables for single use
  "unicorn/no-await-expression-member": "off",
  // conflicts with oxfmt code style
  "unicorn/no-nested-ternary": "off",
  // conflicts with oxfmt code style
  "unicorn/number-literal-case": "off",
  // Array.at() is too modern for browser targets
  "unicorn/prefer-at": "off",
  // support starts with chrome71, firefox68. safari12.1, node12
  // leaving it to warn for edge cases
  "unicorn/prefer-global-this": "warn",
  // ternary with multiple lines is usually less readable than if-else statement
  "unicorn/prefer-ternary": ["warn", "only-single-line"],
  // this will introduce a lot of false positives
  "unicorn/text-encoding-identifier-case": "off",
});

export interface UnicornConfigOptions {
  /**
   * Additional unicorn rules
   */
  rules?: DummyRuleMap;
}

/**
 * unicorn plugin config
 *
 * @returns OxlintConfig
 */
export const getUnicornConfig = ({ rules = {} }: UnicornConfigOptions = {}): OxlintConfig =>
  defineConfig({
    plugins: ["unicorn"],
    rules: { ...unicornRules, ...rules },
    overrides: [
      {
        files: ["**/worker/**/*.{js,ts}", "*.worker.{js,ts}", "worker.{js,ts}"],
        rules: {
          // targetOrigin is not supported in workers' postMessage
          "unicorn/require-post-message-target-origin": "off",
        },
      },

      {
        files: ["*.ts", "*.cts", "*.mts"],
        rules: {
          // we need `export {}` to convert a file to a module
          "unicorn/require-module-specifiers": "off",
        },
      },
    ],
  });
