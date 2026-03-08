import { defineConfig, defineRules } from "./helper.ts";

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

export const reactConfig = defineConfig({
  plugins: ["react", "react-perf"],
  rules: reactRules,
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
