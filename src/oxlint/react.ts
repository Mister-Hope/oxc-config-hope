import { defineConfig, defineRules } from "./helper.ts";
import type { DummyRuleMap, OxlintConfig } from "./helper.ts";

/**
 * react plugin rules
 */
export const reactRules = defineRules({
  // react plugin rules
  // allow jsx in tsx files
  "react/jsx-filename-extension": ["warn", { extensions: [".jsx", ".tsx"] }],
  // default 2 levels is too low for complex components
  "react/jsx-max-depth": ["warn", { max: 6 }],
  // React 17+ does not require React in scope
  "react/react-in-jsx-scope": "off",
});

export interface ReactConfigOptions {
  /**
   * Additional react rules
   */
  rules?: DummyRuleMap;
}

/**
 * react plugin config
 *
 * @returns OxlintConfig
 */
export const getReactConfig = ({ rules = {} }: ReactConfigOptions = {}): OxlintConfig =>
  defineConfig({
    plugins: ["react", "react-perf", "jsx-a11y"],
    rules: { ...reactRules, ...rules },
    overrides: [
      {
        files: ["*.{jsx,tsx}"],
        rules: {
          // disable jsdoc rules in react components
          "jsdoc/require-param": "off",
          // disable jsdoc rules in react components
          "jsdoc/require-returns": "off",
          // allow loose boolean expressions in react components
          "typescript/strict-boolean-expressions": "off",
        },
      },
    ],
  });
