import { getCoreConfig } from "./core.ts";
import type { DummyRuleMap, OxlintConfig } from "./helper.ts";
import { splitRulesByPrefix } from "./helper.ts";
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
   * Rules to configure.
   */
  rules?: DummyRuleMap;

  /**
   * Whether to include typescript related rules
   *
   * @default true
   */
  ts?: boolean;

  /**
   * Whether to include import related rules
   *
   * @default true
   */
  import?: boolean;

  /**
   * Whether to include jsdoc related rules
   *
   * @default true
   */
  jsdoc?: boolean;

  /**
   * Additional oxc rules
   *
   * @default true
   */
  oxc?: boolean;

  /**
   * Whether to include promise related rules
   *
   * @default true
   */
  promise?: boolean;

  /**
   * Whether to include unicorn related rules
   *
   * @default true
   */
  unicorn?: boolean;

  /**
   * Node related configuration.
   *
   * - `true`: enable node plugin globally, all files are treated as node environment. Use with caution since it may cause false positives in non-node files.
   * - `false`: do not enable node plugin.
   * - `string` or `string[]`: glob patterns for files that should be treated as node environment.
   *
   * By default, it includes common config files and cli/node files.
   */
  node?: NodeScopeOptions | false;

  /**
   * Whether to include react related rules
   *
   * @default false
   */
  react?: boolean;

  /**
   * Whether to include vue related rules
   *
   * @default false
   */
  vue?: boolean;

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

  /**
   * Additional vitest bench rules.
   */
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
  oxc = true,
  import: importOption = true,
  promise = true,
  jsdoc = true,
  unicorn = true,
  vitest = true,
  vitestBenchRules,
  node = "default",
  playwright,
  react,
  vue,
}: ConfigOptions = {}): OxlintConfig[] => {
  const splitRules = splitRulesByPrefix(rules ?? {});

  // Prefixes with no dedicated config should fallback to core
  const coreWithFallback = {
    ...splitRules.core,
    ...splitRules.jest,
    ...splitRules.nextjs,
  };

  // React config merges react, react-perf, and jsx-a11y prefixed rules
  const reactRules = {
    ...splitRules.react,
    ...splitRules["react-perf"],
    ...splitRules["jsx-a11y"],
  };

  const results: OxlintConfig[] = [getCoreConfig({ rules: coreWithFallback })];

  if (ts) results.push(getTypeScriptConfig({ rules: splitRules.typescript }));
  if (oxc) results.push(getOxcConfig({ rules: splitRules.oxc }));

  if (importOption) results.push(getImportConfig({ rules: splitRules.import }));
  if (promise) results.push(getPromiseConfig({ rules: splitRules.promise }));
  if (unicorn) results.push(getUnicornConfig({ rules: splitRules.unicorn }));

  if (jsdoc) results.push(getJsdocConfig({ ts, rules: splitRules.jsdoc }));

  // oxlint-disable-next-line typescript/strict-boolean-expressions
  if (node) results.push(getNodeConfig({ rules: splitRules.node }, node));

  if (react) results.push(getReactConfig({ rules: reactRules }));
  if (vue) results.push(getVueConfig({ rules: splitRules.vue }));
  // oxlint-disable-next-line typescript/strict-boolean-expressions
  if (vitest)
    // oxlint-disable-next-line curly
    results.push(
      getVitestConfig({ rules: splitRules.vitest, benchRules: vitestBenchRules }, vitest),
    );
  // oxlint-disable-next-line typescript/strict-boolean-expressions
  if (playwright) results.push(getPlaywrightConfig(playwright));

  return results;
};
