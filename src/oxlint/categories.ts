import { defineCategories } from "./helper.ts";

export const defaultCategories = defineCategories({
  correctness: "error",
  suspicious: "warn",
  pedantic: "warn",
  perf: "warn",
  style: "warn",
  restriction: "warn",
});
