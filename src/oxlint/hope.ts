import type { OxlintOverride } from "oxlint";

import { defaultCategories } from "./categories.ts";
import { getOxlintConfigs } from "./config.ts";
import type { ConfigOptions } from "./config.ts";
import { defineConfig } from "./helper.ts";
import type { OxlintConfig } from "./helper.ts";
import { defaultIgnorePatterns } from "./ignore.ts";

export interface HopeConfigOptions extends ConfigOptions {
  /**
   * Glob patterns for files to ignore. It supports the same syntax as .eslintignore.
   */
  ignore?: string[];
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
    },
    overrides,
  });
