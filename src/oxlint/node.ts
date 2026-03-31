import type { DummyRuleMap, OxlintConfig } from "./helper.ts";
import { defineConfig, defineRules } from "./helper.ts";

export const nodeRules = defineRules({
  // allow importing node built-in modules in config files and scripts
  "import/no-nodejs-modules": "off",
});

/**
 * Node related configuration.
 */
export interface NodeScopeConfig {
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
export type NodeScopeOptions = true | string | string[] | NodeScopeConfig;

export interface NodeConfigOptions {
  /**
   * Additional node rules, merged with default node rules.
   *
   */
  rules?: DummyRuleMap;
}

const DEFAULT_NODE_PATTERNS = [
  // cli and node files
  "**/{cli,node}/**/*.{js,ts}",
  "**/{cli,node}.{js,ts}",
];

/**
 * Get node plugin config based on the provided options.
 *
 * @param options Additional node plugin configuration options, such as additional rules.
 *
 * @param scope Node related configuration options.
 *
 * - `true`: enable node plugin globally, all files are treated as node environment. Use with caution since it may cause false positives in non-node files.
 * - `false`: do not enable node plugin.
 * - `string` or `string[]`: glob patterns for files that should be treated as node environment.
 *
 * @returns OxlintConfig or null if node plugin is not enabled.
 */
export const getNodeConfig = (
  { rules }: NodeConfigOptions = {},
  scope?: NodeScopeOptions,
): OxlintConfig => {
  let global = false;
  let nodeFilePatterns: string[] = DEFAULT_NODE_PATTERNS;

  if (scope === true) {
    global = true;
  } else if (typeof scope === "string") {
    nodeFilePatterns = [scope];
  } else if (Array.isArray(scope)) {
    nodeFilePatterns = scope;
  } else if (typeof scope === "object" && scope != null) {
    global = scope.global ?? false;
    nodeFilePatterns = Array.isArray(scope.nodeFiles)
      ? scope.nodeFiles
      : scope.nodeFiles
        ? [scope.nodeFiles]
        : DEFAULT_NODE_PATTERNS;
  }

  if (global) {
    // enable node plugin globally
    return defineConfig({
      plugins: ["node"],
      rules: {
        ...nodeRules,
        ...rules,
      },
    });
  }

  // enable node plugin for specific files
  return defineConfig({
    overrides: [
      // script files
      {
        files: ["**/scripts/**/*.{js,ts}"],
        plugins: ["node"],
        rules: {
          // allow console usage in scripts files
          "no-console": "off",
          // scripts files shall be allowed to access process.env
          "node/no-process-env": "off",
          ...nodeRules,
          ...rules,
        },
      },

      // config files
      {
        files: ["*.config.{js,ts,mjs,mts,cjs,cts}"],
        plugins: ["node"],
        rules: {
          // config files shall be allowed to access process.env
          "node/no-process-env": "off",
          ...nodeRules,
          ...rules,
        },
      },

      // vite config files
      {
        files: ["{vite,vitest}.config.{js,ts,mjs,mts,cjs,cts}"],
        rules: {
          // vite loader polyfills __dirname and __filename
          "prefer-module": "off",
        },
      },

      {
        files: nodeFilePatterns,
        plugins: ["node"],
        rules: {
          ...nodeRules,
          ...rules,
        },
      },
    ],
  });
};
