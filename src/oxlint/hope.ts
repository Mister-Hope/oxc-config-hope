import type { OxlintOverride } from "oxlint";

import { defaultCategories } from "./categories.ts";
import { getOxlintConfigs } from "./config.ts";
import type { ConfigOptions } from "./config.ts";
import { defineConfig } from "./helper.ts";
import type { OxlintConfig, OxlintOptions } from "./helper.ts";
import { defaultIgnorePatterns } from "./ignore.ts";

export interface HopeConfigOptions extends ConfigOptions {
  /** Glob patterns for files to ignore. It supports the same syntax as .eslintignore. */
  ignore?: string[];

  /**
   * Options for the linter.
   *
   * See [Options](https://oxc.rs/docs/guide/usage/linter/config-file-reference.html#options).
   *
   * `typeAware` and `typeCheck` are enabled by default.
   */
  options?: OxlintOptions;
}

export const defineHopeConfig = (
  options: HopeConfigOptions = {},
  ...overrides: OxlintOverride[]
): OxlintConfig =>
  defineConfig({
    extends: getOxlintConfigs(options),
    categories: defaultCategories,
    ignorePatterns: [...defaultIgnorePatterns, ...(options.ignore ?? [])],
    options: {
      typeAware: true,
      typeCheck: true,
      denyWarnings: true,
      maxWarnings: 10,
      ...options.options,
    },
    overrides,
  });
