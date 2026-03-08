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
  // missing async with await will be reported by typescript itself
  "typescript/promise-function-async": "off",
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
  ],
});
