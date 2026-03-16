import { defineConfig, defineRules } from "./helper.ts";

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

/**
 * promise plugin config
 */
export const promiseConfig = defineConfig({
  plugins: ["promise"],
  rules: promiseRules,
});
