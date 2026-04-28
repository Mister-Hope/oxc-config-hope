import { defineConfig, defineRules } from "./helper.ts";
import type { DummyRuleMap, OxlintConfig } from "./helper.ts";

/**
 * oxlint core rules
 */
export const coreRules = defineRules({
  // core rules
  // we should not enforce capitalized comments
  "capitalized-comments": "off",
  complexity: ["warn", { variant: "modified" }],
  // we allow == and != with null
  eqeqeq: ["error", "smart", { null: "never" }],
  // function names can be omitted if the name can be inferred from the context
  "func-names": ["warn", "as-needed"],
  // prefer to export declarations instead of exporting at the end
  "group-exports": "off",
  // this rule is too restrictive
  "init-declarations": "off",
  // re-export is needed in many cases
  "no-barrel-file": "off",
  // allow continue in complicated loops
  "no-continue": "off",
  // warn about console usage but allow it
  "no-console": "warn",
  // type imports can be duplicated with value imports
  "no-duplicate-imports": ["error", { allowSeparateTypeImports: true }],
  // we use == null to check for both null and undefined
  "no-eq-null": "off",
  // inline comments shall be allowed
  "no-inline-comments": "off",
  // magic numbers shall be allowed in some cases
  "no-magic-numbers": "off",
  // allow nested ternary for better readability in some cases
  "no-nested-ternary": "off",
  // allow null usage
  "no-null": "off",
  // NOTE: this rule currently do not allow to forbid change with read operations, a single expression like `a++;` shall be allowed with loops
  "no-plusplus": ["warn", { allowForLoopAfterthoughts: true }],
  // "no-plusplus": "off",
  // ternary operator shall be allowed for simple expressions
  "no-ternary": "off",
  // _ is commonly used as a placeholder variable name
  "no-shadow": ["warn", { allow: ["_"] }],
  // allow __dirname and __filename usage in node environment
  "no-underscore-dangle": ["warn", { allow: ["__dirname", "__filename"] }],
  // allow using variables before their declaration, as long as they are not used in their initializers
  "no-use-before-define": ["warn", { allowNamedExports: true }],
  // we use void operator to mark those promise that shall not be awaited
  "no-void": "off",
  // we only warn about numeric separator usage when contains separator
  "numeric-separators-style": ["warn", { onlyIfContainsSeparator: true }],
  // Only warn if all variables in a destructuring assignment should be const
  "prefer-const": ["warn", { destructuring: "all" }],
  // some functions that return promise and plain values in different conditions
  // need an async declaration while not always using await
  "require-await": "off",
  // we prefer to sort imports with its pkg name, not the import variable name
  "sort-imports": "off",
  // object keys are not supposed to be sorted in many cases
  "sort-keys": "off",
});

/**
 * stylistic rules with default being tweaked
 */
export const stylisticRules = defineRules({
  "catch-error-name": ["warn", { name: "err" }],
  curly: ["warn", "multi-or-nest", "consistent"],
  "id-length": [
    "warn",
    {
      min: 2,
      exceptions: [
        // sorting
        "a",
        "b",
        // loops
        "i",
        "j",
        "k",
        // position
        "x",
        "y",
        "z",
        // Type parameter
        "T",
        // parameter name for unused variables
        "_",
      ],
    },
  ],
  "max-dependencies": ["warn", { ignoreTypeImports: true, max: 15 }],
  "max-lines": ["warn", { max: 500, skipBlankLines: true, skipComments: true }],
  "max-lines-per-function": ["warn", { max: 100, skipBlankLines: true, skipComments: true }],
  "max-params": ["warn", 4],
  "max-statements": ["warn", { max: 30 }],
});

export interface CoreConfigOptions {
  /**
   * Additional core rules, merged with default core rules.
   */
  rules?: DummyRuleMap;
}

export const getCoreConfig = ({ rules }: CoreConfigOptions = {}): OxlintConfig =>
  defineConfig({
    plugins: ["eslint"],
    rules: {
      ...coreRules,
      ...stylisticRules,
      ...rules,
    },
    overrides: [
      // allow commonjs usage in cjs files
      {
        files: ["*.cjs", "*.cts"],
        rules: {
          "no-require-imports": "off",
        },
      },
    ],
  });
