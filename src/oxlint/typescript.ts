import { defineConfig, defineRules } from "./helper.ts";
import { jsdocTypescriptRules } from "./jsdoc.ts";

/**
 * typescript plugin rules
 */
export const typescriptRules = defineRules({
  // typescript plugin rules
  // shall be disabled with isolateDeclarations: true since type that can be inferred
  // will be required to be explicitly declared
  "typescript/no-inferrable-types": "off",
  // disable unsafe type assertion checks
  "typescript/no-unsafe-type-assertion": "off",
  // we may use a union contain void to declare function return type
  "typescript/no-invalid-void-type": "off",
  // enforce naming conventions
  // NOTE: not implemented yet by the moment: https://github.com/oxc-project/tsgolint/tree/main?tab=readme-ov-file#implemented-rules
  "typescript/naming-convention": [
    "warn",
    [
      { selector: "default", format: ["camelCase"] },
      {
        selector: "variable",
        filter: { regex: "^__(?:dirname|filename)$", match: true },
        format: null,
      },
      {
        selector: "variable",
        filter: {
          regex: "^(?:_{0,2})[A-Z][A-z0-9]*(?:_[A-Z][A-z0-9]*)*$",
          match: true,
        },
        format: null,
      },
      {
        selector: ["variable"],
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
        leadingUnderscore: "allow",
      },
      {
        selector: ["parameter"],
        format: ["camelCase", "PascalCase"],
        leadingUnderscore: "allow",
      },
      {
        selector: ["property"],
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
        leadingUnderscore: "allow",
        trailingUnderscore: "allow",
      },
      { selector: "import", format: ["PascalCase", "camelCase"] },
      { selector: "typeLike", format: ["PascalCase"] },
      { selector: "enumMember", format: ["PascalCase"] },
    ],
  ],
  "typescript/parameter-properties": ["warn", { prefer: "parameter-property" }],
  // allow non-null assertions in some cases
  "typescript/strict-boolean-expressions": [
    "warn",
    { allowNullableString: true, allowNullableBoolean: true },
  ],
  // allow default case to cover exhaustive switch cases
  "typescript/switch-exhaustiveness-check": ["warn", { considerDefaultExhaustiveForUnions: true }],
  // avoid forcing arrow functions with async
  "typescript/promise-function-async": ["error", { checkArrowFunctions: false }],
});

/**
 * typescript related rules
 */
export const typeScriptRelatedRules = defineRules({
  ...typescriptRules,
  ...jsdocTypescriptRules,
});

/**
 * typescript config
 */
export const typescriptConfig = defineConfig({
  plugins: ["typescript"],
  rules: typescriptRules,
  overrides: [
    {
      files: ["*.d.ts"],
      rules: {
        // to extend existing modules, import/export must not appear in declaration files at top level
        "import/unambiguous": "off",
        // we need `export {}` to convert a file to a module
        "unicorn/require-module-specifiers": "off",
      },
    },

    // allow commonjs usage in cjs/cts files
    {
      files: ["*.cjs", "*.cts"],
      rules: {
        "no-require-imports": "off",
        "import/no-commonjs": "off",
        "import/unambiguous": "off",
      },
    },

    // disable typescript types checking
    // See: https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslintrc/disable-type-checked.ts
    {
      files: ["*.js", "*.jsx", "*.cjs", "*.mjs"],
      rules: {
        "typescript/await-thenable": "off",
        "typescript/consistent-return": "off",
        "typescript/consistent-type-exports": "off",
        "typescript/dot-notation": "off",
        "typescript/naming-convention": "off",
        "typescript/no-array-delete": "off",
        "typescript/no-base-to-string": "off",
        "typescript/no-confusing-void-expression": "off",
        "typescript/no-deprecated": "off",
        "typescript/no-duplicate-type-constituents": "off",
        "typescript/no-floating-promises": "off",
        "typescript/no-for-in-array": "off",
        "typescript/no-implied-eval": "off",
        "typescript/no-meaningless-void-operator": "off",
        "typescript/no-misused-promises": "off",
        "typescript/no-misused-spread": "off",
        "typescript/no-mixed-enums": "off",
        "typescript/no-redundant-type-constituents": "off",
        "typescript/no-unnecessary-boolean-literal-compare": "off",
        "typescript/no-unnecessary-condition": "off",
        "typescript/no-unnecessary-qualifier": "off",
        "typescript/no-unnecessary-template-expression": "off",
        "typescript/no-unnecessary-type-arguments": "off",
        "typescript/no-unnecessary-type-assertion": "off",
        "typescript/no-unnecessary-type-conversion": "off",
        "typescript/no-unnecessary-type-parameters": "off",
        "typescript/no-unsafe-argument": "off",
        "typescript/no-unsafe-assignment": "off",
        "typescript/no-unsafe-call": "off",
        "typescript/no-unsafe-enum-comparison": "off",
        "typescript/no-unsafe-member-access": "off",
        "typescript/no-unsafe-return": "off",
        "typescript/no-unsafe-type-assertion": "off",
        "typescript/no-unsafe-unary-minus": "off",
        "typescript/no-useless-default-assignment": "off",
        "typescript/non-nullable-type-assertion-style": "off",
        "typescript/only-throw-error": "off",
        "typescript/prefer-destructuring": "off",
        "typescript/prefer-find": "off",
        "typescript/prefer-includes": "off",
        "typescript/prefer-nullish-coalescing": "off",
        "typescript/prefer-optional-chain": "off",
        "typescript/prefer-promise-reject-errors": "off",
        "typescript/prefer-readonly": "off",
        "typescript/prefer-readonly-parameter-types": "off",
        "typescript/prefer-reduce-type-parameter": "off",
        "typescript/prefer-regexp-exec": "off",
        "typescript/prefer-return-this-type": "off",
        "typescript/prefer-string-starts-ends-with": "off",
        "typescript/promise-function-async": "off",
        "typescript/related-getter-setter-pairs": "off",
        "typescript/require-array-sort-compare": "off",
        "typescript/require-await": "off",
        "typescript/restrict-plus-operands": "off",
        "typescript/restrict-template-expressions": "off",
        "typescript/return-await": "off",
        "typescript/strict-boolean-expressions": "off",
        "typescript/strict-void-return": "off",
        "typescript/switch-exhaustiveness-check": "off",
        "typescript/unbound-method": "off",
        "typescript/use-unknown-in-catch-callback-variable": "off",
      },
    },
  ],
});
