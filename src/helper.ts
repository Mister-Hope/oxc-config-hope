import type { DummyRuleMap, RuleCategories } from "oxlint";

export { defineConfig, type OxlintConfig } from "oxlint";

export const defineCategories = (categories: RuleCategories): RuleCategories => categories;

export const defineRules = (rules: DummyRuleMap): DummyRuleMap => rules;
