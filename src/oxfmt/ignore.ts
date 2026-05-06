export const defaultIgnorePatterns = [
  // node modules
  "**/node_modules/**",

  // common build output folder
  "**/dist/**",
  // test coverage
  "coverage/",

  // vuepress related
  "**/.vuepress/.cache/**",
  "**/.vuepress/.temp/**",
  "**/.vuepress/dist/**",
];
