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
  nodeFiles?: string | string[];
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
];

export const getNodeConfig = (options?: NodeConfigOptions | NodeSimpleOptions): OxlintConfig => {
  if (options === false) return defineConfig({});

  let global = false;
  let nodeFilePatterns: string[] = DEFAULT_NODE_PATTERNS;

  if (options === true) {
    global = true;
  } else if (typeof options === "string") {
    nodeFilePatterns = [options];
  } else if (Array.isArray(options)) {
    nodeFilePatterns = options;
  } else if (typeof options === "object" && options != null) {
    global = options.global ?? false;
    nodeFilePatterns = Array.isArray(options.nodeFiles)
      ? options.nodeFiles
      : options.nodeFiles
        ? [options.nodeFiles]
        : DEFAULT_NODE_PATTERNS;
  }

  if (global) {
    // enable node plugin globally
    return defineConfig({
      plugins: ["node"],
      rules: nodeRules,
    });
  }

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
          // scripts files shall be allowed to access process.env
          "node/no-process-env": "off",
          ...nodeRules,
        },
      },
      {
        files: ["*.config.{js,ts,mjs,mts,cjs,cts}"],
        plugins: ["node"],
        rules: {
          // config files shall be allowed to access process.env
          "node/no-process-env": "off",
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
