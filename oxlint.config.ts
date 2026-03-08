import { defineConfig, getOxlintConfigs } from "./src/index.ts";

export default defineConfig({
  extends: getOxlintConfigs({
    vitest: false,
  }),
  ignorePatterns: ["dist/"],
  options: {
    typeAware: true,
    typeCheck: true,
  },
});
