import { array, string, union } from "zod";

export const stringOrArray = union([string(), array(string())]).transform(
  (val) => {
    if (typeof val === "string") {
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (Array.isArray(val)) {
      return val
        .flatMap((s) => s.split(",").map((x) => x.trim()))
        .filter(Boolean);
    }
    return [];
  }
);