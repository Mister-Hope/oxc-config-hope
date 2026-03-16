import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    oxfmt: "./src/oxfmt/index.ts",
    oxlint: "./src/oxlint/index.ts",
  },
  fixedExtension: false,
  platform: "node",
  minify: true,
  publint: true,
  dts: true,
});
