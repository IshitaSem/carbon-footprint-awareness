/**
 * Tests for lib/utils.ts
 *
 * Coverage targets: cn, clamp, slugify
 * formatNumber is a thin Intl wrapper — tested implicitly via its consumers.
 */

import { describe, it, expect } from "vitest";
import { cn, clamp, slugify } from "@/lib/utils";

// ─── cn ───────────────────────────────────────────────────────────────────────

describe("cn", () => {
  it("returns a single class unchanged", () => {
    expect(cn("text-red-500")).toBe("text-red-500");
  });

  it("merges multiple classes", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("resolves Tailwind conflicts (later class wins)", () => {
    expect(cn("px-4", "px-8")).toBe("px-8");
  });

  it("ignores undefined and null values", () => {
    expect(cn("text-sm", undefined, null, "font-bold")).toBe("text-sm font-bold");
  });

  it("handles conditional class with false (excludes falsy)", () => {
    expect(cn("base", false && "never")).toBe("base");
  });

  it("handles conditional class with true (includes truthy)", () => {
    expect(cn("base", true && "added")).toBe("base added");
  });

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });

  it("merges conflicting text colors (later wins)", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });
});

// ─── clamp ────────────────────────────────────────────────────────────────────

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("returns min when value is below range", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("returns max when value is above range", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("returns value when equal to min", () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it("returns value when equal to max", () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it("works with negative ranges", () => {
    expect(clamp(-3, -10, -1)).toBe(-3);
  });

  it("works with decimal values", () => {
    expect(clamp(0.5, 0, 1)).toBeCloseTo(0.5);
  });

  it("returns min when min equals max and value is below", () => {
    expect(clamp(-1, 5, 5)).toBe(5);
  });
});

// ─── slugify ──────────────────────────────────────────────────────────────────

describe("slugify", () => {
  it("lowercases the input", () => {
    expect(slugify("Hello")).toBe("hello");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("weekly car distance")).toBe("weekly-car-distance");
  });

  it("replaces multiple spaces with a single hyphen", () => {
    expect(slugify("a  b")).toBe("a-b");
  });

  it("removes leading hyphens", () => {
    expect(slugify(" leading")).toBe("leading");
  });

  it("removes trailing hyphens", () => {
    expect(slugify("trailing ")).toBe("trailing");
  });

  it("removes special characters", () => {
    expect(slugify("CO₂ Emissions!")).toBe("co-emissions");
  });

  it("handles mixed case and punctuation", () => {
    expect(slugify("Monthly kWh/Usage")).toBe("monthly-kwh-usage");
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  it("returns empty string for whitespace-only input", () => {
    expect(slugify("   ")).toBe("");
  });

  it("preserves numbers", () => {
    expect(slugify("Source Sans 3")).toBe("source-sans-3");
  });
});
