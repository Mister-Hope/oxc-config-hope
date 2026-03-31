import { defineConfig, defineRules } from "./helper.ts";
import type { DummyRuleMap, OxlintConfig } from "./helper.ts";

/**
 * jsdoc plugin rules
 */
export const jsdocRules = defineRules({
  "jsdoc/require-param": ["warn", { checkConstructors: true, checkDestructuredRoots: false }],
  // getter does not need a @returns tag
  "jsdoc/require-returns": ["warn", { checkGetters: false }],
});

/**
 * typescript related jsdoc rules
 */
export const jsdocTypescriptRules = defineRules({
  // duplicated typescript related jsdoc shall be warned
  "jsdoc/check-tag-names": ["warn", { typed: true }],
  // we do not require types in jsdoc since we use TypeScript
  "jsdoc/require-param-type": "off",
  // we do not require types in jsdoc since we use TypeScript
  "jsdoc/require-returns-type": "off",
});

export interface JsdocConfigOptions {
  /**
   * Additional js doc rules
   */
  rules?: DummyRuleMap;

  /**
   * Whether to include typescript related jsdoc rules
   *
   * @default true
   */
  ts?: boolean;
}

/**
 * @returns jsdoc config
 */
export const getJsdocConfig = ({ rules, ts = true }: JsdocConfigOptions = {}): OxlintConfig =>
  defineConfig({
    plugins: ["jsdoc"],
    rules: {
      ...jsdocRules,
      ...(ts ? jsdocTypescriptRules : {}),
      ...rules,
    },
  });
