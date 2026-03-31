import { describe, expect, it } from "vitest";

import { resolveVitestScope } from "../src/oxlint/vitest.ts";

const DEFAULT_TEST_PATTERNS = ["**/*.{spec,test}.{js,ts}", "**/*.{spec,test}-d.ts"];
const DEFAULT_BENCH_PATTERNS = ["**/*.bench.{js,ts}"];

describe("resolveVitestScope", () => {
  it("should return default test patterns when scope is undefined or true", () => {
    expect(resolveVitestScope()).toEqual({
      testPatterns: DEFAULT_TEST_PATTERNS,
      benchPatterns: false,
    });
    expect(resolveVitestScope(true)).toEqual({
      testPatterns: DEFAULT_TEST_PATTERNS,
      benchPatterns: false,
    });
  });

  it("should return empty patterns when scope is false", () => {
    const result = resolveVitestScope(false);
    expect(result.testPatterns).toEqual([]);
    expect(result.benchPatterns).toBe(false);
  });

  it("should wrap string scope as test pattern", () => {
    const result = resolveVitestScope("custom-test");
    expect(result.testPatterns).toEqual(["custom-test"]);
    expect(result.benchPatterns).toBe(false);
  });

  it("should use array scope directly as test patterns", () => {
    const result = resolveVitestScope(["pattern1", "pattern2"]);
    expect(result.testPatterns).toEqual(["pattern1", "pattern2"]);
    expect(result.benchPatterns).toBe(false);
  });

  it("should handle VitestScopeConfig with tests as string", () => {
    const result = resolveVitestScope({ tests: "my-test" });
    expect(result.testPatterns).toEqual(["my-test"]);
    expect(result.benchPatterns).toBe(false);
  });

  it("should handle VitestScopeConfig with tests as array", () => {
    const result = resolveVitestScope({ tests: ["test1", "test2"] });
    expect(result.testPatterns).toEqual(["test1", "test2"]);
    expect(result.benchPatterns).toBe(false);
  });

  it("should use default test patterns when tests is not provided", () => {
    const result = resolveVitestScope({});
    expect(result.testPatterns).toEqual(DEFAULT_TEST_PATTERNS);
    expect(result.benchPatterns).toBe(false);
  });

  it("should handle bench as string", () => {
    const result = resolveVitestScope({ bench: "my-bench" });
    expect(result.testPatterns).toEqual(DEFAULT_TEST_PATTERNS);
    expect(result.benchPatterns).toEqual(["my-bench"]);
  });

  it("should handle bench as array", () => {
    const result = resolveVitestScope({ bench: ["bench1", "bench2"] });
    expect(result.testPatterns).toEqual(DEFAULT_TEST_PATTERNS);
    expect(result.benchPatterns).toEqual(["bench1", "bench2"]);
  });

  it("should use default bench patterns when bench is true", () => {
    const result = resolveVitestScope({ bench: true });
    expect(result.testPatterns).toEqual(DEFAULT_TEST_PATTERNS);
    expect(result.benchPatterns).toEqual(DEFAULT_BENCH_PATTERNS);
  });

  it("should return false bench when bench is false", () => {
    const result = resolveVitestScope({ bench: false });
    expect(result.benchPatterns).toBe(false);
  });
});
