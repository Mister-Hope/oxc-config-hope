import { defineConfig } from "oxfmt";
export { defineConfig } from "oxfmt";

export const config = defineConfig({
  ignorePatterns: [
    // common build output folder
    "**/dist/**",
    // test coverage
    "coverage/",

    // vuepress related
    "**/.vuepress/.cache/**",
    "**/.vuepress/.temp/**",
    "**/.vuepress/dist/**",
  ],
  sortPackageJson: {
    sortScripts: true,
  },
});
