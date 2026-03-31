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
export type NodeScopeOptions = boolean | string | string[] | NodeScopeConfig;

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
 * Convert node scope options to resolved patterns.
 *
 * @param scope - Node scope options
 * @param defaults - Default patterns to use when not specified
 * @returns Resolved object with global flag and patterns
 */
export const resolveNodeScope = (
  scope?: NodeScopeOptions,
  defaults: string[] = DEFAULT_NODE_PATTERNS,
): { global: boolean; patterns: string[] } => {
  if (scope === false) return { global: false, patterns: [] };
  if (scope === true) return { global: true, patterns: [] };
  if (typeof scope === "string" && scope !== "default") return { global: false, patterns: [scope] };
  if (Array.isArray(scope)) return { global: false, patterns: scope };
  if (typeof scope === "object" && scope != null) {
    const global = scope.global ?? false;
    const patterns = Array.isArray(scope.nodeFiles)
      ? scope.nodeFiles
      : scope.nodeFiles
        ? [scope.nodeFiles]
        : global
          ? []
          : defaults;
    return { global, patterns };
  }

  return { global: false, patterns: defaults };
};

/**
 * Get node plugin config based on the provided options.
 *
 * @param options Additional node plugin configuration options, such as additional rules.
 *
 * @param scope Node related configuration options.
 *
 * - `'default'`: use default node file patterns (config files and cli/node files).
 * - `true`: enable node plugin globally, all files are treated as node environment. Use with caution since it may cause false positives in non-node files.
 * - `false`: do not enable node plugin.
 * - `string` or `string[]`: glob patterns for files that should be treated as node environment.
 *
 * @returns OxlintConfig or null if node plugin is not enabled.
 */
export const getNodeConfig = (
  { rules }: NodeConfigOptions = {},
  scope: NodeScopeOptions = "default",
): OxlintConfig => {
  const { global, patterns } = resolveNodeScope(scope, DEFAULT_NODE_PATTERNS);

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

  if (!patterns.length) return defineConfig({});

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
        files: patterns,
        plugins: ["node"],
        rules: {
          ...nodeRules,
          ...rules,
        },
      },
    ],
  });
};
