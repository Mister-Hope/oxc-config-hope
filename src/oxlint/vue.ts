import { defineConfig, defineRules } from "./helper.ts";
import type { DummyRuleMap, OxlintConfig } from "./helper.ts";

/** Vue plugin rules */
export const vueRules = defineRules({
  // allow 5 props in vue components
  "vue/max-props": ["warn", { maxProps: 5 }],
});

export interface VueConfigOptions {
  /** Additional vue rules */
  rules?: DummyRuleMap;
}

/**
 * Vue plugin config
 *
 * @returns OxlintConfig
 */
export const getVueConfig = ({ rules = {} }: VueConfigOptions = {}): OxlintConfig =>
  defineConfig({
    plugins: ["vue"],
    rules: { ...vueRules, ...rules },
    overrides: [
      {
        files: ["**/components/**/*.{ts,vue}"],
        rules: {
          // loose max lines for components setup blocks
          "max-lines-per-function": [
            "warn",
            { max: 300, skipBlankLines: true, skipComments: true },
          ],
          // h() calls can be nested deeply in vue components
          "unicorn/max-nested-calls": "off",
        },
      },
    ],
  });
