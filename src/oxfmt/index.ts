import { defineConfig } from "oxfmt";
import type { OxfmtConfig } from "oxfmt";
export { defineConfig } from "oxfmt";

export type { OxfmtConfig } from "oxfmt";

export const defaultIgnorePatterns = [
  // common build output folder
  "**/dist/**",
  // test coverage
  "coverage/",

  // vuepress related
  "**/.vuepress/.cache/**",
  "**/.vuepress/.temp/**",
  "**/.vuepress/dist/**",
];

export const config = defineConfig({
  ignorePatterns: defaultIgnorePatterns,

  sortPackageJson: {
    sortScripts: true,
  },

  sortImports: {},
});

export const defineHopeConfig = ({ ignorePatterns = [], ...rest }: OxfmtConfig = {}): OxfmtConfig =>
  defineConfig({
    ignorePatterns: [...ignorePatterns],

    sortPackageJson: {
      sortScripts: true,
    },

    sortImports: {},

    ...rest,
  });
