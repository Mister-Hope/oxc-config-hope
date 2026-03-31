import { defineConfig, defineRules } from "./helper.ts";
import type { DummyRuleMap, OxlintConfig } from "./helper.ts";

/**
 * import plugin rules
 */
export const importRules = defineRules({
  // exports shall be at their declaration location
  "import/exports-last": "off",
  // type imports should be ignored
  "import/max-dependencies": ["warn", { ignoreTypeImports: true, max: 15 }],
  // usually we just export vue components as default export without naming it
  "import/no-anonymous-default-export": "off",
  // config file may use default export
  "import/no-default-export": "off",
  // a rule that shall not be enabled anyway
  "import/no-named-export": "off",
  // we allow relative parent imports in some cases, e.g. for monorepo packages
  "import/no-relative-parent-imports": "off",
  // allow importing stylesheets
  "import/no-unassigned-import": ["error", { allow: ["**/*.css", "**/*.scss"] }],
  // named export is preferred
  "import/prefer-default-export": "off",
});

export interface ImportConfigOptions {
  /**
   * Additional rules for import related rules.
   */
  rules?: DummyRuleMap;
}

export const getImportConfig = ({ rules = {} }: ImportConfigOptions = {}): OxlintConfig =>
  defineConfig({
    plugins: ["import"],
    rules: { ...importRules, ...rules },
    overrides: [
      // allow commonjs usage in cjs files
      {
        files: ["*.cjs", "*.cts"],
        rules: {
          "import/no-commonjs": "off",
          "import/unambiguous": "off",
        },
      },
    ],
  });
