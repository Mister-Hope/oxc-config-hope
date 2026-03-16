import { defineConfig, defineRules } from "./helper.ts";

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

/**
 * oxc plugin config
 */
export const oxcConfig = defineConfig({
  plugins: ["oxc"],
  rules: oxcRules,
});
