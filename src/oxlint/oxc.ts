import { defineConfig, defineRules } from "./helper.ts";
import type { DummyRuleMap, OxlintConfig } from "./helper.ts";

/**
 * oxc plugin rules
 */
export const oxcRules = defineRules({
  // our environment supports object rest/spread properties
  "oxc/no-rest-spread-properties": "off",
  // optional chaining is widely supported in our target environments
  "oxc/no-optional-chaining": "off",
  // async/await is widely supported in our target environments
  "oxc/no-async-await": "off",
});

export interface OxcConfigOptions {
  /**
   * Additional oxc rules
   */
  rules?: DummyRuleMap;
}

/**
 * oxc plugin config
 *
 * @returns OxlintConfig
 */
export const getOxcConfig = ({ rules = {} }: OxcConfigOptions = {}): OxlintConfig =>
  defineConfig({
    plugins: ["oxc"],
    rules: { ...oxcRules, ...rules },
  });
