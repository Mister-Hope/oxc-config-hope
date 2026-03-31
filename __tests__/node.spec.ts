import { describe, expect, it } from "vitest";

import { resolveNodeScope } from "../src/oxlint/node.ts";

const DEFAULT_PATTERNS = ["**/{cli,node}/**/*.{js,ts}", "**/{cli,node}.{js,ts}"];

describe("resolveNodeScope", () => {
  it("should return global mode when scope is true", () => {
    const result = resolveNodeScope(true);
    expect(result.global).toBe(true);
    expect(result.patterns).toEqual([]);
  });

  it("should return disabled when scope is false", () => {
    const result = resolveNodeScope(false);
    expect(result.global).toBe(false);
    expect(result.patterns).toEqual([]);
  });

  it("should use defaults when scope is undefined or 'default'", () => {
    expect(resolveNodeScope()).toEqual({ global: false, patterns: DEFAULT_PATTERNS });
    expect(resolveNodeScope("default")).toEqual({ global: false, patterns: DEFAULT_PATTERNS });
  });

  it("should wrap string scope as pattern when not 'default'", () => {
    const result = resolveNodeScope("custom-pattern");
    expect(result.global).toBe(false);
    expect(result.patterns).toEqual(["custom-pattern"]);
  });

  it("should use array scope directly as patterns", () => {
    const result = resolveNodeScope(["pattern1", "pattern2"]);
    expect(result.global).toBe(false);
    expect(result.patterns).toEqual(["pattern1", "pattern2"]);
  });

  it("should handle NodeScopeConfig with global true", () => {
    const result = resolveNodeScope({ global: true });
    expect(result.global).toBe(true);
    expect(result.patterns).toEqual([]);
  });

  it("should handle NodeScopeConfig with nodeFiles as string", () => {
    const result = resolveNodeScope({ nodeFiles: "custom-file" });
    expect(result.global).toBe(false);
    expect(result.patterns).toEqual(["custom-file"]);
  });

  it("should handle NodeScopeConfig with nodeFiles as array", () => {
    const result = resolveNodeScope({ nodeFiles: ["file1", "file2"] });
    expect(result.global).toBe(false);
    expect(result.patterns).toEqual(["file1", "file2"]);
  });

  it("should use defaults when NodeScopeConfig has no nodeFiles", () => {
    const result = resolveNodeScope({});
    expect(result.global).toBe(false);
    expect(result.patterns).toEqual(DEFAULT_PATTERNS);
  });

  it("should use custom defaults when provided", () => {
    const customDefaults = ["custom/default"];
    const result = resolveNodeScope(undefined, customDefaults);
    expect(result.patterns).toEqual(customDefaults);
  });
});
