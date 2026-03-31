import type { DummyRuleMap, RuleCategories } from "oxlint";

export { defineConfig } from "oxlint";
export type { DummyRuleMap, OxlintConfig } from "oxlint";

export const defineCategories = (categories: RuleCategories): RuleCategories => categories;

export const defineRules = (rules: DummyRuleMap): DummyRuleMap => rules;

/**
 * Known rule prefixes used to categorize rules.
 */
export const RULE_PREFIXES = [
  "import",
  "node",
  "typescript",
  "oxc",
  "promise",
  "unicorn",
  "jsdoc",
  "react",
  "react-perf",
  "jsx-a11y",
  "jest",
  "vue",
  "vitest",
  "nextjs",
] as const;

export type RulePrefix = (typeof RULE_PREFIXES)[number];

/**
 * Result of splitting rules by prefix.
 */
export type SplitRules = Record<string, DummyRuleMap>;

/**
 * Split a DummyRuleMap into separate objects based on rule prefixes.
 *
 * Rules with prefixes like `import/rule1` or `node/rule2` are grouped under
 * their respective prefix keys. Rules without a recognized prefix go to `core`.
 *
 * @param rules - The rules to split
 * @returns An object with `core` containing unprefixed rules and named keys for each prefix
 *
 * @example
 * // input: { "import/rule1": "error", "node/rule2": "warn", "rule3": "off" }
 * // output: {
 * //   "core": { "rule3": "off" },
 * //   "import": { "import/rule1": "error" },
 * //   "node": { "node/rule2": "warn" },
 * // }
 */
export const splitRulesByPrefix = (rules: DummyRuleMap): SplitRules => {
  const result: SplitRules = { core: {} };

  for (const [key, value] of Object.entries(rules)) {
    const slashIndex = key.indexOf("/");

    if (slashIndex === -1) result.core[key] = value;
    else (result[key.slice(0, slashIndex)] ??= {})[key] = value;
  }

  return result;
};
