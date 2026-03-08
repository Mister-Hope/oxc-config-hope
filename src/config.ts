import type { OxlintConfig } from "./helper.ts";
import { coreConfig } from "./core.ts";
import { getNodeConfig, type NodeConfigOptions, type NodeSimpleOptions } from "./node.ts";
import { typescriptConfig } from "./typescript.ts";
import { getJsdocConfig } from "./jsdoc.ts";
import { reactConfig } from "./react.ts";
import { vueConfig } from "./vue.ts";
import { getVitestConfig, type VitestSimpleOptions, type VitestConfigOptions } from "./vitest.ts";
import { getPlaywrightConfig, type PlaywrightSimpleOptions } from "./playwright.ts";

export interface ConfigOptions {
  /**
   * Whether to include jsdoc related rules
   *
   * @default true
   */
  jsdoc?: boolean;

  /**
   * Whether to include typescript related rules
   *
   * @default true
   */
  ts?: boolean;

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
  node?: NodeConfigOptions | NodeSimpleOptions;

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
  vitest?: VitestConfigOptions | VitestSimpleOptions;

  /**
   * Whether to include playwright related rules
   *
   * @default false
   */
  playwright?: PlaywrightSimpleOptions;
}

export const getOxlintConfigs = ({
  ts = true,
  jsdoc = true,
  vitest = true,
  node,
  playwright,
  react,
  vue,
}: ConfigOptions = {}): OxlintConfig[] => {
  const results: OxlintConfig[] = [coreConfig];

  const nodeConfig = getNodeConfig(node);

  if (Object.keys(nodeConfig).length > 0) results.push(nodeConfig);
  if (ts) results.push(typescriptConfig);
  if (jsdoc) results.push(getJsdocConfig({ ts }));
  if (react) results.push(reactConfig);
  if (vue) results.push(vueConfig);
  // oxlint-disable-next-line typescript/strict-boolean-expressions
  if (vitest) results.push(getVitestConfig(vitest));
  // oxlint-disable-next-line typescript/strict-boolean-expressions
  if (playwright) results.push(getPlaywrightConfig(playwright));

  return results;
};
