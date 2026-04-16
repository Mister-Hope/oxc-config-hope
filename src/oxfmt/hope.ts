import { defineConfig } from "./helper.ts";
import type { OxfmtConfig } from "./helper.ts";
import { defaultIgnorePatterns } from "./ignore.ts";

export const defineHopeConfig = ({ ignorePatterns = [], ...rest }: OxfmtConfig = {}): OxfmtConfig =>
  defineConfig({
    ignorePatterns: [...defaultIgnorePatterns, ...ignorePatterns],

    jsdoc: true,

    sortPackageJson: {
      sortScripts: true,
    },

    sortImports: {},

    ...rest,
  });
