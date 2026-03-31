import { defineConfig } from "./helper.ts";
import { defaultIgnorePatterns } from "./ignore.ts";

export const config = defineConfig({
  ignorePatterns: defaultIgnorePatterns,

  sortPackageJson: {
    sortScripts: true,
  },

  sortImports: {},
});
