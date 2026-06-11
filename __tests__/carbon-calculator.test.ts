/**
 * Tests for lib/carbon-calculator.ts
 *
 * All expected values are derived from lib/constants.ts — no magic numbers.
 *
 * Coverage:
 *  - calculateTransportEmissions   (car-only, transit-only, flight-only, combined)
 *  - calculateElectricityEmissions (zero, linear scaling)
 *  - calculateFoodEmissions        (all 4 diet types, ordering)
 *  - calculateWasteEmissions       (all 4 recycling habits, floor at 0)
 *  - determineRating               (all 4 ratings, every exact boundary value)
 *  - calculateCarbonFootprint      (sum integrity, percentages, NaN safety, comparison)
 *  - generateRecommendations       (all 10 conditional branches, priority sort, dedup)
 *  - toPieChartData / toBarChartData
 *  - formatKg / formatTonnes
 *  - getRatingConfig
 */

import { describe, it, expect } from "vitest";
import {
  calculateTransportEmissions,
  calculateElectricityEmissions,
  calculateFoodEmissions,
  calculateWasteEmissions,
  determineRating,
  calculateCarbonFootprint,
  generateRecommendations,
  toPieChartData,
  toBarChartData,
  formatKg,
  formatTonnes,
  getRatingConfig,
} from "@/lib/carbon-calculator";
import {
  BASE_WASTE_EMISSIONS,
  DIET_EMISSIONS,
  EMISSION_FACTORS,
  GLOBAL_AVERAGE_KG_PER_YEAR,
  RATING_THRESHOLDS,
  RECYCLING_OFFSETS,
} from "@/lib/constants";
import type { CalculatorInputs } from "@/types";

// ─── Shared fixtures ───────────────────────────────────────────────────────────

const baseInputs: CalculatorInputs = {
  carKmPerWeek: 100,
  publicTransportKmPerWeek: 50,
  electricityKwhPerMonth: 250,
  dietType: "mixed",
  flightsPerYear: 2,
  recyclingHabit: "often",
};

const zeroInputs: CalculatorInputs = {
  carKmPerWeek: 0,
  publicTransportKmPerWeek: 0,
  electricityKwhPerMonth: 0,
  dietType: "vegan",
  flightsPerYear: 0,
  recyclingHabit: "always",
};

const highInputs: CalculatorInputs = {
  carKmPerWeek: 500,
  publicTransportKmPerWeek: 100,
  electricityKwhPerMonth: 600,
  dietType: "high_meat",
  flightsPerYear: 6,
  recyclingHabit: "never",
};

// ─── calculateTransportEmissions ──────────────────────────────────────────────

describe("calculateTransportEmissions", () => {
  it("combines car, public transport, and flight emissions correctly", () => {
    const expected =
      baseInputs.carKmPerWeek * 52 * EMISSION_FACTORS.carPerKm +
      baseInputs.publicTransportKmPerWeek * 52 * EMISSION_FACTORS.publicTransportPerKm +
      baseInputs.flightsPerYear * EMISSION_FACTORS.flightPerTrip;
    expect(calculateTransportEmissions(baseInputs)).toBeCloseTo(expected, 5);
  });

  it("returns 0 when all transport inputs are 0", () => {
    expect(calculateTransportEmissions(zeroInputs)).toBe(0);
  });

  it("car only: applies carPerKm factor × 52 weeks", () => {
    const inputs: CalculatorInputs = { ...zeroInputs, carKmPerWeek: 100 };
    expect(calculateTransportEmissions(inputs)).toBeCloseTo(
      100 * 52 * EMISSION_FACTORS.carPerKm,
      5,
    );
  });

  it("public transport only: applies publicTransportPerKm factor × 52 weeks", () => {
    const inputs: CalculatorInputs = {
      ...zeroInputs,
      publicTransportKmPerWeek: 80,
    };
    expect(calculateTransportEmissions(inputs)).toBeCloseTo(
      80 * 52 * EMISSION_FACTORS.publicTransportPerKm,
      5,
    );
  });

  it("flights only: applies flightPerTrip factor", () => {
    const inputs: CalculatorInputs = { ...zeroInputs, flightsPerYear: 3 };
    expect(calculateTransportEmissions(inputs)).toBeCloseTo(
      3 * EMISSION_FACTORS.flightPerTrip,
      5,
    );
  });

  it("1 flight equals exactly EMISSION_FACTORS.flightPerTrip (255 kg)", () => {
    const inputs: CalculatorInputs = { ...zeroInputs, flightsPerYear: 1 };
    expect(calculateTransportEmissions(inputs)).toBe(
      EMISSION_FACTORS.flightPerTrip,
    );
  });

  it("high inputs produce more emissions than base inputs", () => {
    expect(calculateTransportEmissions(highInputs)).toBeGreaterThan(
      calculateTransportEmissions(baseInputs),
    );
  });
});

// ─── calculateElectricityEmissions ────────────────────────────────────────────

describe("calculateElectricityEmissions", () => {
  it("multiplies monthlyKwh × 12 × electricityPerKwh factor", () => {
    const expected =
      baseInputs.electricityKwhPerMonth * 12 * EMISSION_FACTORS.electricityPerKwh;
    expect(calculateElectricityEmissions(baseInputs)).toBeCloseTo(expected, 5);
  });

  it("returns 0 when monthly electricity is 0", () => {
    expect(calculateElectricityEmissions(zeroInputs)).toBe(0);
  });

  it("doubles when monthly kWh doubles", () => {
    const a: CalculatorInputs = { ...zeroInputs, electricityKwhPerMonth: 100 };
    const b: CalculatorInputs = { ...zeroInputs, electricityKwhPerMonth: 200 };
    expect(calculateElectricityEmissions(b)).toBeCloseTo(
      calculateElectricityEmissions(a) * 2,
      5,
    );
  });

  it("high inputs produce more than base inputs", () => {
    expect(calculateElectricityEmissions(highInputs)).toBeGreaterThan(
      calculateElectricityEmissions(baseInputs),
    );
  });
});

// ─── calculateFoodEmissions ───────────────────────────────────────────────────

describe("calculateFoodEmissions", () => {
  it("returns DIET_EMISSIONS.vegan for vegan diet", () => {
    expect(
      calculateFoodEmissions({ ...baseInputs, dietType: "vegan" }),
    ).toBe(DIET_EMISSIONS.vegan);
  });

  it("returns DIET_EMISSIONS.vegetarian for vegetarian diet", () => {
    expect(
      calculateFoodEmissions({ ...baseInputs, dietType: "vegetarian" }),
    ).toBe(DIET_EMISSIONS.vegetarian);
  });

  it("returns DIET_EMISSIONS.mixed for mixed diet", () => {
    expect(
      calculateFoodEmissions({ ...baseInputs, dietType: "mixed" }),
    ).toBe(DIET_EMISSIONS.mixed);
  });

  it("returns DIET_EMISSIONS.high_meat for high_meat diet", () => {
    expect(
      calculateFoodEmissions({ ...baseInputs, dietType: "high_meat" }),
    ).toBe(DIET_EMISSIONS.high_meat);
  });

  it("emissions increase: vegan < vegetarian < mixed < high_meat", () => {
    const vegan = calculateFoodEmissions({ ...baseInputs, dietType: "vegan" });
    const veg = calculateFoodEmissions({ ...baseInputs, dietType: "vegetarian" });
    const mixed = calculateFoodEmissions({ ...baseInputs, dietType: "mixed" });
    const meat = calculateFoodEmissions({ ...baseInputs, dietType: "high_meat" });
    expect(vegan).toBeLessThan(veg);
    expect(veg).toBeLessThan(mixed);
    expect(mixed).toBeLessThan(meat);
  });

  it("high_meat minus vegan saving exceeds 1500 kg/year", () => {
    const saving =
      calculateFoodEmissions({ ...baseInputs, dietType: "high_meat" }) -
      calculateFoodEmissions({ ...baseInputs, dietType: "vegan" });
    expect(saving).toBeGreaterThan(1500);
  });
});

// ─── calculateWasteEmissions ──────────────────────────────────────────────────

describe("calculateWasteEmissions", () => {
  it("never: returns BASE_WASTE_EMISSIONS minus RECYCLING_OFFSETS.never", () => {
    expect(
      calculateWasteEmissions({ ...baseInputs, recyclingHabit: "never" }),
    ).toBe(BASE_WASTE_EMISSIONS - RECYCLING_OFFSETS.never);
  });

  it("sometimes: applies correct offset", () => {
    expect(
      calculateWasteEmissions({ ...baseInputs, recyclingHabit: "sometimes" }),
    ).toBe(BASE_WASTE_EMISSIONS - RECYCLING_OFFSETS.sometimes);
  });

  it("often: applies correct offset", () => {
    expect(
      calculateWasteEmissions({ ...baseInputs, recyclingHabit: "often" }),
    ).toBe(BASE_WASTE_EMISSIONS - RECYCLING_OFFSETS.often);
  });

  it("always: applies correct offset", () => {
    expect(
      calculateWasteEmissions({ ...baseInputs, recyclingHabit: "always" }),
    ).toBe(BASE_WASTE_EMISSIONS - RECYCLING_OFFSETS.always);
  });

  it("never > always (more recycling = fewer emissions)", () => {
    const never = calculateWasteEmissions({ ...baseInputs, recyclingHabit: "never" });
    const always = calculateWasteEmissions({ ...baseInputs, recyclingHabit: "always" });
    expect(never).toBeGreaterThan(always);
  });

  it("result is never negative (floor at 0)", () => {
    const result = calculateWasteEmissions({ ...baseInputs, recyclingHabit: "always" });
    expect(result).toBeGreaterThanOrEqual(0);
  });
});

// ─── determineRating ──────────────────────────────────────────────────────────

describe("determineRating", () => {
  it("returns 'low' for 0 kg", () => {
    expect(determineRating(0)).toBe("low");
  });

  it("returns 'low' at the low threshold max (2000)", () => {
    expect(determineRating(RATING_THRESHOLDS.low.max)).toBe("low");
  });

  it("returns 'medium' at low.max + 1 (2001)", () => {
    expect(determineRating(RATING_THRESHOLDS.low.max + 1)).toBe("medium");
  });

  it("returns 'medium' at the medium threshold max (4700)", () => {
    expect(determineRating(RATING_THRESHOLDS.medium.max)).toBe("medium");
  });

  it("returns 'high' at medium.max + 1 (4701)", () => {
    expect(determineRating(RATING_THRESHOLDS.medium.max + 1)).toBe("high");
  });

  it("returns 'high' at the high threshold max (8000)", () => {
    expect(determineRating(RATING_THRESHOLDS.high.max)).toBe("high");
  });

  it("returns 'critical' at high.max + 1 (8001)", () => {
    expect(determineRating(RATING_THRESHOLDS.high.max + 1)).toBe("critical");
  });

  it("returns 'critical' for very large value (50000 kg)", () => {
    expect(determineRating(50_000)).toBe("critical");
  });

  it("returns 'low' for typical eco-conscious footprint (1500 kg)", () => {
    expect(determineRating(1500)).toBe("low");
  });

  it("returns 'medium' for global average (4700 kg)", () => {
    expect(determineRating(GLOBAL_AVERAGE_KG_PER_YEAR)).toBe("medium");
  });
});

// ─── calculateCarbonFootprint (integration) ───────────────────────────────────

describe("calculateCarbonFootprint", () => {
  it("result contains all required fields", () => {
    const result = calculateCarbonFootprint(baseInputs);
    expect(result).toHaveProperty("totalKgPerYear");
    expect(result).toHaveProperty("breakdown");
    expect(result).toHaveProperty("rating");
    expect(result).toHaveProperty("percentages");
    expect(result).toHaveProperty("comparisonToAverage");
  });

  it("totalKgPerYear equals sum of all breakdown categories", () => {
    const result = calculateCarbonFootprint(baseInputs);
    const sum =
      result.breakdown.transport +
      result.breakdown.electricity +
      result.breakdown.food +
      result.breakdown.waste;
    expect(result.totalKgPerYear).toBeCloseTo(sum, 5);
  });

  it("percentages sum to exactly 100", () => {
    const result = calculateCarbonFootprint(baseInputs);
    const total =
      result.percentages.transport +
      result.percentages.electricity +
      result.percentages.food +
      result.percentages.waste;
    expect(total).toBeCloseTo(100, 5);
  });

  it("each percentage is between 0 and 100", () => {
    const result = calculateCarbonFootprint(baseInputs);
    Object.values(result.percentages).forEach((pct) => {
      expect(pct).toBeGreaterThanOrEqual(0);
      expect(pct).toBeLessThanOrEqual(100);
    });
  });

  it("zero transport/electricity inputs produce 0 in those breakdown fields", () => {
    const result = calculateCarbonFootprint(zeroInputs);
    expect(result.breakdown.transport).toBe(0);
    expect(result.breakdown.electricity).toBe(0);
  });

  it("percentages are never NaN even when total is low", () => {
    const result = calculateCarbonFootprint(zeroInputs);
    Object.values(result.percentages).forEach((pct) => {
      expect(Number.isNaN(pct)).toBe(false);
    });
  });

  it("high inputs produce a rating of 'high' or 'critical'", () => {
    const result = calculateCarbonFootprint(highInputs);
    expect(["high", "critical"]).toContain(result.rating);
  });

  it("comparisonToAverage is negative when below global average", () => {
    const result = calculateCarbonFootprint(zeroInputs);
    expect(result.comparisonToAverage).toBeLessThan(0);
  });

  it("comparisonToAverage is positive when above global average", () => {
    const result = calculateCarbonFootprint(highInputs);
    expect(result.comparisonToAverage).toBeGreaterThan(0);
  });

  it("rating matches determineRating called with the same total", () => {
    const result = calculateCarbonFootprint(baseInputs);
    expect(result.rating).toBe(determineRating(result.totalKgPerYear));
  });

  it("comparisonToAverage is ~0 when inputs are tuned to the global average", () => {
    // vegan (1500) + always waste (500-450=50) + 0 transport
    // remaining filled by electricity to hit GLOBAL_AVERAGE_KG_PER_YEAR
    const remainderKg = GLOBAL_AVERAGE_KG_PER_YEAR - DIET_EMISSIONS.vegan -
      (BASE_WASTE_EMISSIONS - RECYCLING_OFFSETS.always);
    const monthlyKwh = remainderKg / (12 * EMISSION_FACTORS.electricityPerKwh);
    const exactInputs: CalculatorInputs = {
      carKmPerWeek: 0,
      publicTransportKmPerWeek: 0,
      electricityKwhPerMonth: monthlyKwh,
      dietType: "vegan",
      flightsPerYear: 0,
      recyclingHabit: "always",
    };
    const result = calculateCarbonFootprint(exactInputs);
    expect(result.comparisonToAverage).toBeCloseTo(0, 2);
  });
});

// ─── generateRecommendations ──────────────────────────────────────────────────

describe("generateRecommendations", () => {
  it("always returns an array", () => {
    const result = calculateCarbonFootprint(baseInputs);
    expect(Array.isArray(generateRecommendations(baseInputs, result))).toBe(true);
  });

  it("always includes the lifestyle check-in recommendation", () => {
    const result = calculateCarbonFootprint(baseInputs);
    const recs = generateRecommendations(baseInputs, result);
    expect(recs.some((r) => r.id === "lifestyle-low")).toBe(true);
  });

  it("carKmPerWeek > 200 triggers transport-car-high", () => {
    const inputs: CalculatorInputs = { ...baseInputs, carKmPerWeek: 250 };
    const result = calculateCarbonFootprint(inputs);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "transport-car-high")).toBe(true);
  });

  it("carKmPerWeek 101–200 triggers transport-car-medium", () => {
    const inputs: CalculatorInputs = { ...baseInputs, carKmPerWeek: 150 };
    const result = calculateCarbonFootprint(inputs);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "transport-car-medium")).toBe(true);
  });

  it("carKmPerWeek <= 100 triggers neither car rec", () => {
    const inputs: CalculatorInputs = { ...baseInputs, carKmPerWeek: 80 };
    const result = calculateCarbonFootprint(inputs);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "transport-car-high")).toBe(false);
    expect(recs.some((r) => r.id === "transport-car-medium")).toBe(false);
  });

  it("flightsPerYear >= 4 triggers transport-flights-high", () => {
    const inputs: CalculatorInputs = { ...baseInputs, flightsPerYear: 5 };
    const result = calculateCarbonFootprint(inputs);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "transport-flights-high")).toBe(true);
  });

  it("flightsPerYear 2–3 triggers transport-flights-medium", () => {
    const inputs: CalculatorInputs = { ...baseInputs, flightsPerYear: 2 };
    const result = calculateCarbonFootprint(inputs);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "transport-flights-medium")).toBe(true);
  });

  it("flightsPerYear 0 triggers neither flight rec", () => {
    const inputs: CalculatorInputs = { ...baseInputs, flightsPerYear: 0 };
    const result = calculateCarbonFootprint(inputs);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "transport-flights-high")).toBe(false);
    expect(recs.some((r) => r.id === "transport-flights-medium")).toBe(false);
  });

  it("electricityKwhPerMonth > 400 triggers electricity-high", () => {
    const inputs: CalculatorInputs = {
      ...baseInputs,
      electricityKwhPerMonth: 450,
    };
    const result = calculateCarbonFootprint(inputs);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "electricity-high")).toBe(true);
  });

  it("electricityKwhPerMonth 201–400 triggers electricity-medium", () => {
    const inputs: CalculatorInputs = {
      ...baseInputs,
      electricityKwhPerMonth: 300,
    };
    const result = calculateCarbonFootprint(inputs);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "electricity-medium")).toBe(true);
  });

  it("high_meat diet triggers food-high-meat", () => {
    const inputs: CalculatorInputs = { ...baseInputs, dietType: "high_meat" };
    const result = calculateCarbonFootprint(inputs);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "food-high-meat")).toBe(true);
  });

  it("mixed diet triggers food-mixed", () => {
    const inputs: CalculatorInputs = { ...baseInputs, dietType: "mixed" };
    const result = calculateCarbonFootprint(inputs);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "food-mixed")).toBe(true);
  });

  it("vegan diet triggers no food recommendation", () => {
    const inputs: CalculatorInputs = { ...baseInputs, dietType: "vegan" };
    const result = calculateCarbonFootprint(inputs);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "food-high-meat")).toBe(false);
    expect(recs.some((r) => r.id === "food-mixed")).toBe(false);
  });

  it("recyclingHabit 'never' triggers waste-never", () => {
    const inputs: CalculatorInputs = { ...baseInputs, recyclingHabit: "never" };
    const result = calculateCarbonFootprint(inputs);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "waste-never")).toBe(true);
  });

  it("recyclingHabit 'sometimes' triggers waste-sometimes", () => {
    const inputs: CalculatorInputs = {
      ...baseInputs,
      recyclingHabit: "sometimes",
    };
    const result = calculateCarbonFootprint(inputs);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "waste-sometimes")).toBe(true);
  });

  it("recyclingHabit 'always' triggers no waste recommendation", () => {
    const inputs: CalculatorInputs = { ...baseInputs, recyclingHabit: "always" };
    const result = calculateCarbonFootprint(inputs);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "waste-never")).toBe(false);
    expect(recs.some((r) => r.id === "waste-sometimes")).toBe(false);
  });

  it("high priority recs appear before medium priority recs", () => {
    const result = calculateCarbonFootprint(highInputs);
    const recs = generateRecommendations(highInputs, result);
    const priorities = recs.map((r) => r.priority);
    let seenNonHigh = false;
    for (const p of priorities) {
      if (p !== "high") seenNonHigh = true;
      if (seenNonHigh && p === "high") {
        throw new Error("high priority rec appeared after medium/low");
      }
    }
  });

  it("all recommendations have non-empty title and description", () => {
    const result = calculateCarbonFootprint(highInputs);
    const recs = generateRecommendations(highInputs, result);
    recs.forEach((r) => {
      expect(r.title.length).toBeGreaterThan(0);
      expect(r.description.length).toBeGreaterThan(0);
    });
  });

  it("all recommendations have at least one action item", () => {
    const result = calculateCarbonFootprint(highInputs);
    const recs = generateRecommendations(highInputs, result);
    recs.forEach((r) => {
      expect(r.actionItems.length).toBeGreaterThan(0);
    });
  });

  it("potentialSavingKgPerYear is non-negative on every recommendation", () => {
    const result = calculateCarbonFootprint(highInputs);
    const recs = generateRecommendations(highInputs, result);
    recs.forEach((r) => {
      expect(r.potentialSavingKgPerYear).toBeGreaterThanOrEqual(0);
    });
  });

  it("transport-share-high fires when no threshold rec covers transport", () => {
    // Uses publicTransport only — no carKmPerWeek so no car threshold rec fires.
    // High public transport makes transport % > 50% of total.
    const inputs: CalculatorInputs = {
      carKmPerWeek: 0,
      publicTransportKmPerWeek: 500,
      electricityKwhPerMonth: 0,
      dietType: "vegan",
      flightsPerYear: 0,
      recyclingHabit: "always",
    };
    const result = calculateCarbonFootprint(inputs);
    expect(result.percentages.transport).toBeGreaterThan(50);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "transport-share-high")).toBe(true);
  });

  it("transport-share-high is suppressed when a specific car rec already fires", () => {
    // carKmPerWeek > 200 fires transport-car-high, which should suppress the fallback
    const inputs: CalculatorInputs = {
      carKmPerWeek: 300,
      publicTransportKmPerWeek: 0,
      electricityKwhPerMonth: 0,
      dietType: "vegan",
      flightsPerYear: 0,
      recyclingHabit: "always",
    };
    const result = calculateCarbonFootprint(inputs);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "transport-car-high")).toBe(true);
    expect(recs.some((r) => r.id === "transport-share-high")).toBe(false);
  });

  it("electricity-renewable-medium fires when electricity % > 30 and no threshold rec", () => {
    // 150 kWh/month is below the 200 threshold so no electricity-medium fires.
    // With zero transport and vegan + always, electricity share > 30%.
    const inputs: CalculatorInputs = {
      carKmPerWeek: 0,
      publicTransportKmPerWeek: 0,
      electricityKwhPerMonth: 150,
      dietType: "vegan",
      flightsPerYear: 0,
      recyclingHabit: "always",
    };
    const result = calculateCarbonFootprint(inputs);
    expect(result.percentages.electricity).toBeGreaterThan(30);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "electricity-renewable-medium")).toBe(true);
  });

  it("electricity-renewable-medium is suppressed when electricity-high already fires", () => {
    const inputs: CalculatorInputs = {
      ...baseInputs,
      electricityKwhPerMonth: 500,
    };
    const result = calculateCarbonFootprint(inputs);
    const recs = generateRecommendations(inputs, result);
    expect(recs.some((r) => r.id === "electricity-high")).toBe(true);
    expect(recs.some((r) => r.id === "electricity-renewable-medium")).toBe(false);
  });
});

// ─── toPieChartData ───────────────────────────────────────────────────────────

describe("toPieChartData", () => {
  it("returns exactly 4 items", () => {
    const result = calculateCarbonFootprint(baseInputs);
    expect(toPieChartData(result.breakdown)).toHaveLength(4);
  });

  it("each item has name, value, and color", () => {
    const result = calculateCarbonFootprint(baseInputs);
    toPieChartData(result.breakdown).forEach((item) => {
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("value");
      expect(item).toHaveProperty("color");
    });
  });

  it("Transport value matches breakdown.transport", () => {
    const result = calculateCarbonFootprint(baseInputs);
    const transport = toPieChartData(result.breakdown).find(
      (d) => d.name === "Transport",
    );
    expect(transport?.value).toBe(result.breakdown.transport);
  });

  it("color values are valid 6-digit hex strings", () => {
    const result = calculateCarbonFootprint(baseInputs);
    toPieChartData(result.breakdown).forEach((item) => {
      expect(item.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});

// ─── toBarChartData ───────────────────────────────────────────────────────────

describe("toBarChartData", () => {
  it("returns exactly 4 items", () => {
    const result = calculateCarbonFootprint(baseInputs);
    expect(toBarChartData(result.breakdown)).toHaveLength(4);
  });

  it("each item has category, yours, average, and optimal fields", () => {
    const result = calculateCarbonFootprint(baseInputs);
    toBarChartData(result.breakdown).forEach((item) => {
      expect(item).toHaveProperty("category");
      expect(item).toHaveProperty("yours");
      expect(item).toHaveProperty("average");
      expect(item).toHaveProperty("optimal");
    });
  });

  it("Transport yours value matches breakdown.transport", () => {
    const result = calculateCarbonFootprint(baseInputs);
    const transport = toBarChartData(result.breakdown).find(
      (d) => d.category === "Transport",
    );
    expect(transport?.yours).toBe(result.breakdown.transport);
  });

  it("optimal is always less than average for all categories", () => {
    const result = calculateCarbonFootprint(baseInputs);
    toBarChartData(result.breakdown).forEach((item) => {
      expect(item.optimal).toBeLessThan(item.average);
    });
  });
});

// ─── formatKg ─────────────────────────────────────────────────────────────────

describe("formatKg", () => {
  it("formats values under 1000 as integer kg", () => {
    expect(formatKg(500)).toBe("500 kg");
  });

  it("formats 0 as '0 kg'", () => {
    expect(formatKg(0)).toBe("0 kg");
  });

  it("formats values >= 1000 in tonnes with one decimal", () => {
    expect(formatKg(1000)).toBe("1.0t");
  });

  it("formats 4700 as '4.7t'", () => {
    expect(formatKg(4700)).toBe("4.7t");
  });

  it("rounds sub-1000 values to the nearest integer", () => {
    expect(formatKg(499.7)).toBe("500 kg");
  });

  it("formats 1500 as '1.5t' (>= 1000 uses tonnes branch)", () => {
    expect(formatKg(1500)).toBe("1.5t");
  });
});

// ─── formatTonnes ─────────────────────────────────────────────────────────────

describe("formatTonnes", () => {
  it("formats 4700 kg as '4.70 tonnes'", () => {
    expect(formatTonnes(4700)).toBe("4.70 tonnes");
  });

  it("formats 2000 kg as '2.00 tonnes'", () => {
    expect(formatTonnes(2000)).toBe("2.00 tonnes");
  });

  it("formats 0 as '0.00 tonnes'", () => {
    expect(formatTonnes(0)).toBe("0.00 tonnes");
  });

  it("always returns exactly 2 decimal places", () => {
    expect(formatTonnes(1234)).toMatch(/^\d+\.\d{2} tonnes$/);
  });
});

// ─── getRatingConfig ──────────────────────────────────────────────────────────

describe("getRatingConfig", () => {
  it("returns config with correct rating field for 'low'", () => {
    expect(getRatingConfig("low").rating).toBe("low");
  });

  it("returns config with correct rating field for 'medium'", () => {
    expect(getRatingConfig("medium").rating).toBe("medium");
  });

  it("returns config with correct rating field for 'high'", () => {
    expect(getRatingConfig("high").rating).toBe("high");
  });

  it("returns config with correct rating field for 'critical'", () => {
    expect(getRatingConfig("critical").rating).toBe("critical");
  });

  it("all configs have a non-empty label", () => {
    (["low", "medium", "high", "critical"] as const).forEach((r) => {
      expect(getRatingConfig(r).label.length).toBeGreaterThan(0);
    });
  });

  it("all configs have valid 6-digit hex color strings", () => {
    (["low", "medium", "high", "critical"] as const).forEach((r) => {
      const config = getRatingConfig(r);
      expect(config.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(config.bgColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it("min is less than max for non-critical ratings", () => {
    (["low", "medium", "high"] as const).forEach((r) => {
      const config = getRatingConfig(r);
      expect(config.min).toBeLessThan(config.max);
    });
  });

  it("critical rating has max of Infinity", () => {
    expect(getRatingConfig("critical").max).toBe(Number.POSITIVE_INFINITY);
  });
});
