import { defineConfig, defineRules } from "./helper.ts";
import type { DummyRuleMap, OxlintConfig } from "./helper.ts";

/**
 * vue plugin rules
 */
export const vueRules = defineRules({
  // allow 5 props in vue components
  "vue/max-props": ["warn", { maxProps: 5 }],
});

export interface VueConfigOptions {
  /**
   * Additional vue rules
   */
  rules?: DummyRuleMap;
}

/**
 * vue plugin config
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
        },
      },
    ],
  });
