import { defineConfig, defineRules } from "./helper.ts";

/**
 * vue plugin rules
 */
export const vueRules = defineRules({
  // allow 5 props in vue components
  "vue/max-props": ["warn", { maxProps: 5 }],
});

/**
 * vue plugin config
 */
export const vueConfig = defineConfig({
  plugins: ["vue"],
  rules: vueRules,
  overrides: [
    {
      files: ["**/components/**/*.{ts,vue}"],
      rules: {
        // loose max lines for components setup blocks
        "max-lines-per-function": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],
      },
    },
  ],
});
