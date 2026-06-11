/**
 * Tests for lib/validation.ts
 *
 * Coverage:
 *  - CalculatorInputSchema.safeParse — valid inputs, all enum values, coercion
 *  - CalculatorInputSchema.safeParse — invalid, missing, wrong type, wrong enum
 *  - CalculatorInputSchema.safeParse — boundary values (min, max, over-max)
 *  - parseStoredCalculatorInputs    — null, empty, malformed JSON, wrong schema,
 *                                     valid round-trip, out-of-range stored values
 */

import { describe, it, expect } from "vitest";
import {
  CalculatorInputSchema,
  parseStoredCalculatorInputs,
} from "@/lib/validation";

// ─── Shared valid fixture ──────────────────────────────────────────────────────

const validInput = {
  carKmPerWeek: 100,
  publicTransportKmPerWeek: 50,
  electricityKwhPerMonth: 250,
  dietType: "mixed",
  flightsPerYear: 2,
  recyclingHabit: "often",
};

// ─── Valid inputs ──────────────────────────────────────────────────────────────

describe("CalculatorInputSchema — valid inputs", () => {
  it("accepts a complete valid input object", () => {
    expect(CalculatorInputSchema.safeParse(validInput).success).toBe(true);
  });

  it("accepts dietType: vegan", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, dietType: "vegan" }).success,
    ).toBe(true);
  });

  it("accepts dietType: vegetarian", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, dietType: "vegetarian" }).success,
    ).toBe(true);
  });

  it("accepts dietType: mixed", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, dietType: "mixed" }).success,
    ).toBe(true);
  });

  it("accepts dietType: high_meat", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, dietType: "high_meat" }).success,
    ).toBe(true);
  });

  it("accepts recyclingHabit: never", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, recyclingHabit: "never" }).success,
    ).toBe(true);
  });

  it("accepts recyclingHabit: sometimes", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, recyclingHabit: "sometimes" }).success,
    ).toBe(true);
  });

  it("accepts recyclingHabit: often", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, recyclingHabit: "often" }).success,
    ).toBe(true);
  });

  it("accepts recyclingHabit: always", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, recyclingHabit: "always" }).success,
    ).toBe(true);
  });

  it("accepts 0 for all numeric fields", () => {
    const result = CalculatorInputSchema.safeParse({
      ...validInput,
      carKmPerWeek: 0,
      publicTransportKmPerWeek: 0,
      electricityKwhPerMonth: 0,
      flightsPerYear: 0,
    });
    expect(result.success).toBe(true);
  });

  it("coerces numeric string carKmPerWeek to number", () => {
    const result = CalculatorInputSchema.safeParse({
      ...validInput,
      carKmPerWeek: "150",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.carKmPerWeek).toBe(150);
  });

  it("coerces numeric string flightsPerYear to integer", () => {
    const result = CalculatorInputSchema.safeParse({
      ...validInput,
      flightsPerYear: "3",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.flightsPerYear).toBe(3);
  });
});

// ─── Boundary values ──────────────────────────────────────────────────────────

describe("CalculatorInputSchema — boundary values", () => {
  it("accepts carKmPerWeek at minimum (0)", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, carKmPerWeek: 0 }).success,
    ).toBe(true);
  });

  it("accepts carKmPerWeek at maximum (3000)", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, carKmPerWeek: 3000 }).success,
    ).toBe(true);
  });

  it("rejects carKmPerWeek above maximum (3001)", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, carKmPerWeek: 3001 }).success,
    ).toBe(false);
  });

  it("rejects carKmPerWeek below minimum (-1)", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, carKmPerWeek: -1 }).success,
    ).toBe(false);
  });

  it("accepts publicTransportKmPerWeek at maximum (3000)", () => {
    expect(
      CalculatorInputSchema.safeParse({
        ...validInput,
        publicTransportKmPerWeek: 3000,
      }).success,
    ).toBe(true);
  });

  it("rejects publicTransportKmPerWeek above maximum (3001)", () => {
    expect(
      CalculatorInputSchema.safeParse({
        ...validInput,
        publicTransportKmPerWeek: 3001,
      }).success,
    ).toBe(false);
  });

  it("rejects publicTransportKmPerWeek below minimum (-1)", () => {
    expect(
      CalculatorInputSchema.safeParse({
        ...validInput,
        publicTransportKmPerWeek: -1,
      }).success,
    ).toBe(false);
  });

  it("accepts electricityKwhPerMonth at maximum (5000)", () => {
    expect(
      CalculatorInputSchema.safeParse({
        ...validInput,
        electricityKwhPerMonth: 5000,
      }).success,
    ).toBe(true);
  });

  it("rejects electricityKwhPerMonth above maximum (5001)", () => {
    expect(
      CalculatorInputSchema.safeParse({
        ...validInput,
        electricityKwhPerMonth: 5001,
      }).success,
    ).toBe(false);
  });

  it("rejects electricityKwhPerMonth below minimum (-1)", () => {
    expect(
      CalculatorInputSchema.safeParse({
        ...validInput,
        electricityKwhPerMonth: -1,
      }).success,
    ).toBe(false);
  });

  it("accepts flightsPerYear at maximum (100)", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, flightsPerYear: 100 }).success,
    ).toBe(true);
  });

  it("rejects flightsPerYear above maximum (101)", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, flightsPerYear: 101 }).success,
    ).toBe(false);
  });

  it("rejects flightsPerYear below minimum (-1)", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, flightsPerYear: -1 }).success,
    ).toBe(false);
  });

  it("rejects non-integer flightsPerYear (1.5)", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, flightsPerYear: 1.5 }).success,
    ).toBe(false);
  });
});

// ─── Invalid inputs ───────────────────────────────────────────────────────────

describe("CalculatorInputSchema — invalid inputs", () => {
  it("rejects unknown dietType", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, dietType: "pescatarian" }).success,
    ).toBe(false);
  });

  it("rejects unknown recyclingHabit", () => {
    expect(
      CalculatorInputSchema.safeParse({
        ...validInput,
        recyclingHabit: "occasionally",
      }).success,
    ).toBe(false);
  });

  it("rejects non-numeric carKmPerWeek string", () => {
    expect(
      CalculatorInputSchema.safeParse({ ...validInput, carKmPerWeek: "abc" }).success,
    ).toBe(false);
  });

  it("rejects missing carKmPerWeek", () => {
    const { carKmPerWeek: _omit, ...rest } = validInput;
    expect(CalculatorInputSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects missing dietType", () => {
    const { dietType: _omit, ...rest } = validInput;
    expect(CalculatorInputSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects missing recyclingHabit", () => {
    const { recyclingHabit: _omit, ...rest } = validInput;
    expect(CalculatorInputSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects empty object", () => {
    expect(CalculatorInputSchema.safeParse({}).success).toBe(false);
  });

  it("rejects null", () => {
    expect(CalculatorInputSchema.safeParse(null).success).toBe(false);
  });

  it("rejects undefined", () => {
    expect(CalculatorInputSchema.safeParse(undefined).success).toBe(false);
  });

  it("rejects a plain string", () => {
    expect(CalculatorInputSchema.safeParse("not-an-object").success).toBe(false);
  });

  it("provides an error message for invalid dietType", () => {
    const result = CalculatorInputSchema.safeParse({
      ...validInput,
      dietType: "carnivore",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBeTruthy();
    }
  });

  it("provides an error message for negative carKmPerWeek", () => {
    const result = CalculatorInputSchema.safeParse({
      ...validInput,
      carKmPerWeek: -10,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("negative");
    }
  });
});

// ─── parseStoredCalculatorInputs ──────────────────────────────────────────────

describe("parseStoredCalculatorInputs", () => {
  it("returns null for null input", () => {
    expect(parseStoredCalculatorInputs(null)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseStoredCalculatorInputs("")).toBeNull();
  });

  it("returns null for malformed JSON", () => {
    expect(parseStoredCalculatorInputs("{not valid json")).toBeNull();
  });

  it("returns null for valid JSON that fails schema validation", () => {
    expect(parseStoredCalculatorInputs(JSON.stringify({ foo: "bar" }))).toBeNull();
  });

  it("returns null for a JSON array", () => {
    expect(parseStoredCalculatorInputs(JSON.stringify([1, 2, 3]))).toBeNull();
  });

  it("returns parsed inputs for a valid JSON string", () => {
    const result = parseStoredCalculatorInputs(JSON.stringify(validInput));
    expect(result).not.toBeNull();
    expect(result?.carKmPerWeek).toBe(validInput.carKmPerWeek);
    expect(result?.dietType).toBe(validInput.dietType);
  });

  it("coerces numeric strings in stored JSON", () => {
    const stored = JSON.stringify({ ...validInput, carKmPerWeek: "120" });
    const result = parseStoredCalculatorInputs(stored);
    expect(result).not.toBeNull();
    expect(typeof result?.carKmPerWeek).toBe("number");
    expect(result?.carKmPerWeek).toBe(120);
  });

  it("returns null when a field is out of range in stored data", () => {
    expect(
      parseStoredCalculatorInputs(
        JSON.stringify({ ...validInput, carKmPerWeek: 99999 }),
      ),
    ).toBeNull();
  });

  it("returns null for out-of-range flightsPerYear in stored data", () => {
    expect(
      parseStoredCalculatorInputs(
        JSON.stringify({ ...validInput, flightsPerYear: -5 }),
      ),
    ).toBeNull();
  });

  it("returned object contains all six expected fields", () => {
    const result = parseStoredCalculatorInputs(JSON.stringify(validInput));
    expect(result).toHaveProperty("carKmPerWeek");
    expect(result).toHaveProperty("publicTransportKmPerWeek");
    expect(result).toHaveProperty("electricityKwhPerMonth");
    expect(result).toHaveProperty("dietType");
    expect(result).toHaveProperty("flightsPerYear");
    expect(result).toHaveProperty("recyclingHabit");
  });
});
