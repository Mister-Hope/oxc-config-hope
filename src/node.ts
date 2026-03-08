import type { OxlintConfig } from "./helper.ts";
import { defineConfig, defineRules } from "./helper.ts";

export const nodeRules = defineRules({
  // allow importing node built-in modules in config files and scripts
  "import/no-nodejs-modules": "off",
});

/**
 * Node related configuration.
 */
export interface NodeConfigOptions {
  /**
   * Whether to enable node plugin globally
   *
   * @description This means all files are treated as node environment. Use with caution since it may cause false positives in non-node files.
   *
   * @default false
   */
  global?: boolean;

  /**
   * glob patterns for files that should be treated as node environment.
   */
  nodeFiles?: string | string[] | false;
}

/**
 * Node related configuration.
 *
 * - `true`: enable node plugin globally, all files are treated as node environment. Use with caution since it may cause false positives in non-node files.
 * - `false`: do not enable node plugin.
 * - `string` or `string[]`: glob patterns for files that should be treated as node environment.
 *
 * By default, it includes common config files and cli/node files.
 */
export type NodeSimpleOptions = boolean | string | string[];

const DEFAULT_NODE_PATTERNS = [
  // cli and node files
  "**/{cli,node}/**/*.{js,ts}",
  "**/{cli,node}.{js,ts}",
  // config files
  "*.config.{js,ts,mjs,mts,cjs,cts}",
];

export const getNodeConfig = (options?: NodeConfigOptions | NodeSimpleOptions): OxlintConfig => {
  let global = false;
  let nodeFiles: string | string[] | false = DEFAULT_NODE_PATTERNS;

  if (typeof options === "boolean") global = options;
  else if (typeof options === "string") nodeFiles = options;
  else if (Array.isArray(options)) nodeFiles = options;
  else if (typeof options === "object" && options != null)
    ({ global = false, nodeFiles = DEFAULT_NODE_PATTERNS } = options);

  if (global) // enable node plugin globally
  {
    return defineConfig({
      plugins: ["node"],
      rules: nodeRules,
    });
  }

  // oxlint-disable-next-line typescript/strict-boolean-expressions
  if (!nodeFiles) return defineConfig({});

  const nodeFilePatterns = Array.isArray(nodeFiles) ? nodeFiles : [nodeFiles];

  // enable node plugin for specific files
  return defineConfig({
    overrides: [
      // always treat scripts files as node environment
      {
        files: ["**/scripts/**/*.{js,ts}"],
        plugins: ["node"],
        rules: {
          // allow console usage in scripts files
          "no-console": "off",
          ...nodeRules,
        },
      },
      {
        files: nodeFilePatterns,
        plugins: ["node"],
        rules: nodeRules,
      },
    ],
  });
};
