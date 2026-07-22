// oxlint-disable vitest/max-expects
import { describe, expect, it } from "vitest";

import { splitRulesByPrefix } from "../src/oxlint/helper.ts";

describe(splitRulesByPrefix, () => {
  it("should return empty core object for empty input", () => {
    expect(splitRulesByPrefix({})).toStrictEqual({ core: {} });
  });

  it("should put unprefixed rules in core", () => {
    const result = splitRulesByPrefix({ "no-unused-vars": "error" });
    expect(result.core).toStrictEqual({ "no-unused-vars": "error" });
  });

  it("should split prefixed rules into separate groups", () => {
    const result = splitRulesByPrefix({
      "import/rule1": "error",
      "node/rule2": "warn",
      rule3: "off",
    });

    expect(result.core).toStrictEqual({ rule3: "off" });
    expect(result.import).toStrictEqual({ "import/rule1": "error" });
    expect(result.node).toStrictEqual({ "node/rule2": "warn" });
  });

  it("should handle multiple rules with the same prefix", () => {
    const result = splitRulesByPrefix({
      "import/no-unused": "warn",
      "import/no-restricted-paths": "error",
    });

    expect(result.import).toStrictEqual({
      "import/no-unused": "warn",
      "import/no-restricted-paths": "error",
    });
  });

  it("should preserve rule values that are arrays", () => {
    const result = splitRulesByPrefix({
      "import/rule": ["error", { "importing-directory": "off" }],
    });

    expect(result.import).toStrictEqual({
      "import/rule": ["error", { "importing-directory": "off" }],
    });
  });

  it("should handle all known prefixes", () => {
    const result = splitRulesByPrefix({
      "import/rule": "error",
      "node/rule": "warn",
      "typescript/rule": "off",
      "oxc/rule": "error",
      "promise/rule": "warn",
      "unicorn/rule": "off",
      "jsdoc/rule": "error",
      "react/rule": "warn",
      "vue/rule": "off",
      "vitest/rule": "error",
      "jest/rule": "warn",
      "jsx-a11y/rule": "off",
      "nextjs/rule": "error",
      "react-perf/rule": "warn",
      "eslint/rule": "off",
      "core-rule": "off",
    });

    expect(result.core).toStrictEqual({ "core-rule": "off" });
    expect(result.import).toStrictEqual({ "import/rule": "error" });
    expect(result.node).toStrictEqual({ "node/rule": "warn" });
    expect(result.typescript).toStrictEqual({ "typescript/rule": "off" });
    expect(result.oxc).toStrictEqual({ "oxc/rule": "error" });
    expect(result.promise).toStrictEqual({ "promise/rule": "warn" });
    expect(result.unicorn).toStrictEqual({ "unicorn/rule": "off" });
    expect(result.jsdoc).toStrictEqual({ "jsdoc/rule": "error" });
    expect(result.react).toStrictEqual({ "react/rule": "warn" });
    expect(result.vue).toStrictEqual({ "vue/rule": "off" });
    expect(result.vitest).toStrictEqual({ "vitest/rule": "error" });
    expect(result.jest).toStrictEqual({ "jest/rule": "warn" });
    expect(result["jsx-a11y"]).toStrictEqual({ "jsx-a11y/rule": "off" });
    expect(result.nextjs).toStrictEqual({ "nextjs/rule": "error" });
    expect(result["react-perf"]).toStrictEqual({ "react-perf/rule": "warn" });
    expect(result.eslint).toStrictEqual({ "eslint/rule": "off" });
  });

  it("should only create keys for prefixes that exist in the input", () => {
    const result = splitRulesByPrefix({
      "import/rule": "error",
      "no-console": "warn",
    });

    expect(result.core).toStrictEqual({ "no-console": "warn" });
    expect(result.import).toStrictEqual({ "import/rule": "error" });
    expect(result.node).toBeUndefined();
    expect(result.typescript).toBeUndefined();
  });
});
