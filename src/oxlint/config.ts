import type { OxlintConfig } from "./helper.ts";
import { coreConfig } from "./core.ts";
import { getNodeConfig } from "./node.ts";
import type { NodeConfigOptions, NodeSimpleOptions } from "./node.ts";
import { typescriptConfig } from "./typescript.ts";
import { getJsdocConfig } from "./jsdoc.ts";
import { reactConfig } from "./react.ts";
import { vueConfig } from "./vue.ts";
import { getVitestConfig } from "./vitest.ts";
import type { VitestSimpleOptions, VitestConfigOptions } from "./vitest.ts";
import { getPlaywrightConfig } from "./playwright.ts";
import type { PlaywrightSimpleOptions } from "./playwright.ts";
import { oxcConfig } from "./oxc.ts";
import { promiseConfig } from "./promise.ts";
import { unicornConfig } from "./unicorn.ts";
import { importConfig } from "./import.ts";

export interface ConfigOptions {
  /**
   * Whether to include jsdoc related rules
   *
   * @default true
   */
  jsdoc?: boolean;

  /**
   * Whether to include import related rules
   *
   * @default true
   */
  import?: boolean;

  /**
   * Whether to include oxc related rules
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
   * Whether to include typescript related rules
   *
   * @default true
   */
  typescript?: boolean;

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
  typescript = true,
  jsdoc = true,
  import: importOption = true,
  oxc = true,
  promise = true,
  unicorn = true,
  vitest = true,
  node,
  playwright,
  react,
  vue,
}: ConfigOptions = {}): OxlintConfig[] => {
  const results: OxlintConfig[] = [coreConfig];

  if (importOption) results.push(importConfig);
  if (oxc) results.push(oxcConfig);
  if (promise) results.push(promiseConfig);
  if (unicorn) results.push(unicornConfig);

  const nodeConfig = getNodeConfig(node);

  if (Object.keys(nodeConfig).length > 0) results.push(nodeConfig);

  if (typescript) results.push(typescriptConfig);
  if (jsdoc) results.push(getJsdocConfig({ typescript }));
  if (react) results.push(reactConfig);
  if (vue) results.push(vueConfig);
  // oxlint-disable-next-line typescript/strict-boolean-expressions
  if (vitest) results.push(getVitestConfig(vitest));
  // oxlint-disable-next-line typescript/strict-boolean-expressions
  if (playwright) results.push(getPlaywrightConfig(playwright));

  return results;
};
