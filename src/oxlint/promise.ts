import { defineConfig, defineRules } from "./helper.ts";
import type { DummyRuleMap, OxlintConfig } from "./helper.ts";

/**
 * promise plugin rules
 */
export const promiseRules = defineRules({
  // check promise returns while skipping the last one
  "promise/always-return": ["warn", { ignoreLastCallback: true }],
  // we sometimes need to create new Promise instance
  "promise/avoid-new": "off",
  // we prefer async/await syntax
  "promise/prefer-await-to-then": "off",
});

export interface PromiseConfigOptions {
  /**
   * Additional promise rules
   */
  rules?: DummyRuleMap;
}

/**
 * promise plugin config
 *
 * @returns OxlintConfig
 */
export const getPromiseConfig = ({ rules = {} }: PromiseConfigOptions = {}): OxlintConfig =>
  defineConfig({
    plugins: ["promise"],
    rules: { ...promiseRules, ...rules },
  });
