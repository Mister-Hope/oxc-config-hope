import { getCoreConfig } from "./core.ts";
import type { DummyRuleMap, OxlintConfig } from "./helper.ts";
import { getImportConfig } from "./import.ts";
import { getJsdocConfig } from "./jsdoc.ts";
import { getNodeConfig } from "./node.ts";
import type { NodeScopeOptions } from "./node.ts";
import { getOxcConfig } from "./oxc.ts";
import { getPlaywrightConfig } from "./playwright.ts";
import type { PlaywrightSimpleOptions } from "./playwright.ts";
import { getPromiseConfig } from "./promise.ts";
import { getReactConfig } from "./react.ts";
import { getTypeScriptConfig } from "./typescript.ts";
import { getUnicornConfig } from "./unicorn.ts";
import { getVitestConfig } from "./vitest.ts";
import type { VitestScopeOptions } from "./vitest.ts";
import { getVueConfig } from "./vue.ts";

export interface ConfigOptions {
  /**
   * Additional rules to be merged with default rules in core config.
   */
  rules?: DummyRuleMap;

  /**
   * Whether to include typescript related rules
   *
   * @default true
   */
  ts?: boolean;

  /**
   * Additional typescript rules, merged with default typescript rules.
   */
  tsRules?: DummyRuleMap;

  /**
   * Whether to include import related rules
   *
   * @default true
   */
  import?: boolean;

  /**
   * Additional import rules, merged with default import rules.
   */
  importRules?: DummyRuleMap;

  /**
   * Whether to include jsdoc related rules
   *
   * @default true
   */
  jsdoc?: boolean;

  /**
   * Additional jsdoc rules, merged with default jsdoc rules.
   */
  jsdocRules?: DummyRuleMap;

  /**
   * Additional oxc rules
   *
   * @default true
   */
  oxc?: boolean;

  /**
   * Additional oxc rules, merged with default oxc rules.
   */
  oxcRules?: DummyRuleMap;

  /**
   * Whether to include promise related rules
   *
   * @default true
   */
  promise?: boolean;

  /**
   * Additional promise rules, merged with default promise rules.
   */
  promiseRules?: DummyRuleMap;

  /**
   * Whether to include unicorn related rules
   *
   * @default true
   */
  unicorn?: boolean;

  /**
   * Additional unicorn rules, merged with default unicorn rules.
   */
  unicornRules?: DummyRuleMap;

  /**
   * Node related configuration.
   *
   * - `true`: enable node plugin globally, all files are treated as node environment. Use with caution since it may cause false positives in non-node files.
   * - `false`: do not enable node plugin.
   * - `string` or `string[]`: glob patterns for files that should be treated as node environment.
   * - `
   *
   * By default, it includes common config files and cli/node files.
   */
  node?: NodeScopeOptions | false;

  /**
   * Additional node rules, merged with default node rules.
   */
  nodeRules?: DummyRuleMap;

  /**
   * Whether to include react related rules
   *
   * @default false
   */
  react?: boolean;

  /**
   * Additional react rules, merged with default react rules. Only effective when `react` is `true`.
   */
  reactRules?: DummyRuleMap;

  /**
   * Whether to include vue related rules
   *
   * @default false
   */
  vue?: boolean;

  /**
   * Additional vue rules, merged with default vue rules. Only effective when `vue` is `true`.
   */
  vueRules?: DummyRuleMap;

  /**
   * Vitest related configuration.
   *
   * - `true`: enable vitest plugin with default test files pattern.
   * - `false`: do not enable vitest plugin.
   * - `string | string[]`: glob pattern(s) for test files.
   * - `object`: specify test files pattern and bench files pattern.
   *
   * By default, it includes common test file patterns and excludes bench files.
   */
  vitest?: VitestScopeOptions | false;

  vitestRules?: DummyRuleMap;

  vitestBenchRules?: DummyRuleMap;

  /**
   * Whether to include playwright related rules
   *
   * @default false
   */
  playwright?: PlaywrightSimpleOptions;
}

// oxlint-disable-next-line complexity
export const getOxlintConfigs = ({
  rules,
  ts = true,
  tsRules,
  oxc = true,
  oxcRules,
  import: importOption = true,
  importRules,
  promise = true,
  promiseRules,
  jsdoc = true,
  jsdocRules,
  unicorn = true,
  unicornRules,
  vitest = true,
  vitestRules,
  vitestBenchRules,
  node = "default",
  nodeRules,
  playwright,
  react,
  reactRules,
  vue,
  vueRules,
}: ConfigOptions = {}): OxlintConfig[] => {
  const results: OxlintConfig[] = [getCoreConfig({ rules })];

  if (ts) results.push(getTypeScriptConfig({ rules: tsRules }));
  if (oxc) results.push(getOxcConfig({ rules: oxcRules }));

  if (importOption) results.push(getImportConfig({ rules: importRules }));
  if (promise) results.push(getPromiseConfig({ rules: promiseRules }));
  if (unicorn) results.push(getUnicornConfig({ rules: unicornRules }));

  if (jsdoc) results.push(getJsdocConfig({ ts, rules: jsdocRules }));

  // oxlint-disable-next-line typescript/strict-boolean-expressions
  if (node) results.push(getNodeConfig({ rules: nodeRules }, node));

  if (react) results.push(getReactConfig({ rules: reactRules }));
  if (vue) results.push(getVueConfig({ rules: vueRules }));
  // oxlint-disable-next-line typescript/strict-boolean-expressions
  if (vitest)
    results.push(getVitestConfig({ rules: vitestRules, benchRules: vitestBenchRules }, vitest));
  // oxlint-disable-next-line typescript/strict-boolean-expressions
  if (playwright) results.push(getPlaywrightConfig(playwright));

  return results;
};
