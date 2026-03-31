import type { DummyRuleMap, RuleCategories } from "oxlint";

export { defineConfig } from "oxlint";
export type { DummyRuleMap, OxlintConfig } from "oxlint";

export const defineCategories = (categories: RuleCategories): RuleCategories => categories;

export const defineRules = (rules: DummyRuleMap): DummyRuleMap => rules;
