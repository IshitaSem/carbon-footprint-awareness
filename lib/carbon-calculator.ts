import {
  AVERAGE_BREAKDOWN,
  BASE_WASTE_EMISSIONS,
  CHART_COLORS,
  DIET_EMISSIONS,
  EMISSION_FACTORS,
  GLOBAL_AVERAGE_KG_PER_YEAR,
  OPTIMAL_BREAKDOWN,
  RATING_THRESHOLDS,
  RECYCLING_OFFSETS,
  type RatingThreshold,
} from "@/lib/constants";
import type {
  BarChartData,
  CalculatorInputs,
  CarbonRating,
  CarbonResult,
  EmissionBreakdown,
  PieChartData,
  Recommendation,
  RecommendationPriority,
} from "@/types";

export function calculateTransportEmissions(inputs: CalculatorInputs): number {
  return (
    inputs.carKmPerWeek * 52 * EMISSION_FACTORS.carPerKm +
    inputs.publicTransportKmPerWeek *
      52 *
      EMISSION_FACTORS.publicTransportPerKm +
    inputs.flightsPerYear * EMISSION_FACTORS.flightPerTrip
  );
}

export function calculateElectricityEmissions(
  inputs: CalculatorInputs,
): number {
  return inputs.electricityKwhPerMonth * 12 * EMISSION_FACTORS.electricityPerKwh;
}

export function calculateFoodEmissions(inputs: CalculatorInputs): number {
  return DIET_EMISSIONS[inputs.dietType];
}

export function calculateWasteEmissions(inputs: CalculatorInputs): number {
  return Math.max(
    0,
    BASE_WASTE_EMISSIONS - RECYCLING_OFFSETS[inputs.recyclingHabit],
  );
}

export function determineRating(totalKg: number): CarbonRating {
  if (totalKg <= RATING_THRESHOLDS.low.max) {
    return "low";
  }

  if (totalKg <= RATING_THRESHOLDS.medium.max) {
    return "medium";
  }

  if (totalKg <= RATING_THRESHOLDS.high.max) {
    return "high";
  }

  return "critical";
}

export function calculateCarbonFootprint(
  inputs: CalculatorInputs,
): CarbonResult {
  const breakdown: EmissionBreakdown = {
    transport: calculateTransportEmissions(inputs),
    electricity: calculateElectricityEmissions(inputs),
    food: calculateFoodEmissions(inputs),
    waste: calculateWasteEmissions(inputs),
  };

  const totalKgPerYear = Object.values(breakdown).reduce(
    (sum, value) => sum + value,
    0,
  );

  const percentages: EmissionBreakdown = {
    transport: totalKgPerYear === 0 ? 0 : (breakdown.transport / totalKgPerYear) * 100,
    electricity:
      totalKgPerYear === 0 ? 0 : (breakdown.electricity / totalKgPerYear) * 100,
    food: totalKgPerYear === 0 ? 0 : (breakdown.food / totalKgPerYear) * 100,
    waste: totalKgPerYear === 0 ? 0 : (breakdown.waste / totalKgPerYear) * 100,
  };

  return {
    totalKgPerYear,
    breakdown,
    rating: determineRating(totalKgPerYear),
    percentages,
    comparisonToAverage:
      ((totalKgPerYear - GLOBAL_AVERAGE_KG_PER_YEAR) /
        GLOBAL_AVERAGE_KG_PER_YEAR) *
      100,
  };
}

function recPriorityValue(priority: RecommendationPriority): number {
  const priorityOrder: Record<RecommendationPriority, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return priorityOrder[priority];
}

/**
 * Deduplicate recommendations so that when multiple recs target the same
 * category, only the highest-priority one per category is kept.
 *
 * This prevents a specific threshold-based rec (e.g. "transport-car-high")
 * from co-existing with a broader percentage-based fallback rec for the same
 * category (e.g. "transport-share-high"), which would be redundant and lower
 * the perceived quality of the recommendation engine.
 *
 * Ties within a category are broken by the order they were added — whichever
 * specific rec was pushed first wins (specific recs are always pushed before
 * fallback recs in generateRecommendations).
 */
function deduplicateByCategory(recs: Recommendation[]): Recommendation[] {
  const seen = new Map<string, Recommendation>();

  for (const rec of recs) {
    const existing = seen.get(rec.category);

    if (!existing) {
      // First rec seen for this category — keep it
      seen.set(rec.category, rec);
    } else if (recPriorityValue(rec.priority) < recPriorityValue(existing.priority)) {
      // This rec has a higher priority than the one already stored — replace it
      seen.set(rec.category, rec);
    }
    // Otherwise: existing rec is equal or higher priority — keep existing, discard this one
  }

  return Array.from(seen.values());
}

export function generateRecommendations(
  inputs: CalculatorInputs,
  result: CarbonResult,
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // ── Transport: specific threshold recs (pushed first so they win dedup) ──────

  if (inputs.carKmPerWeek > 200) {
    recommendations.push({
      id: "transport-car-high",
      category: "transport",
      priority: "high",
      title: "Cut high weekly car mileage",
      description:
        "Your car travel is a major source of annual emissions. Replacing repeated short trips with lower-carbon options can quickly reduce your footprint.",
      potentialSavingKgPerYear: Math.round(inputs.carKmPerWeek * 52 * 0.25 * EMISSION_FACTORS.carPerKm),
      actionItems: [
        "Replace two weekly car trips with walking or cycling",
        "Batch errands into one planned route",
        "Carpool for recurring commutes or school runs",
        "Use train or coach routes for intercity travel where practical",
      ],
    });
  } else if (inputs.carKmPerWeek > 100) {
    recommendations.push({
      id: "transport-car-medium",
      category: "transport",
      priority: "medium",
      title: "Trim routine car trips",
      description:
        "Moderate car use still adds up over a year. Targeting the most flexible trips is the easiest place to begin.",
      potentialSavingKgPerYear: Math.round(inputs.carKmPerWeek * 52 * 0.15 * EMISSION_FACTORS.carPerKm),
      actionItems: [
        "Swap one commute day for public transport",
        "Walk or cycle journeys under three kilometres",
        "Keep tires inflated to improve fuel efficiency",
      ],
    });
  }

  if (inputs.flightsPerYear >= 4) {
    recommendations.push({
      id: "transport-flights-high",
      category: "transport",
      priority: "high",
      title: "Reduce frequent flights",
      description:
        "Flights create a compact but powerful share of personal emissions. Avoiding even one return trip can have an outsized impact.",
      potentialSavingKgPerYear: Math.round(Math.min(inputs.flightsPerYear, 2) * EMISSION_FACTORS.flightPerTrip),
      actionItems: [
        "Replace one short-haul flight with rail",
        "Combine meetings or visits into fewer trips",
        "Choose direct routes when flying is unavoidable",
        "Prioritise longer stays over repeated weekend flights",
      ],
    });
  } else if (inputs.flightsPerYear >= 2) {
    recommendations.push({
      id: "transport-flights-medium",
      category: "transport",
      priority: "medium",
      title: "Plan lower-flight travel",
      description:
        "A small change in annual travel planning can remove hundreds of kilograms of CO2 from your footprint.",
      potentialSavingKgPerYear: EMISSION_FACTORS.flightPerTrip,
      actionItems: [
        "Replace one domestic flight with train or coach travel",
        "Group travel needs into fewer annual journeys",
        "Use video calls for optional business travel",
      ],
    });
  }

  // ── Transport: percentage-based fallback (pushed after specific recs) ─────────

  if (result.percentages.transport > 50) {
    recommendations.push({
      id: "transport-share-high",
      category: "transport",
      priority: "high",
      title: "Shift your transport mix",
      description:
        "More than half of your footprint comes from transport, so mode-shifting will produce the clearest gains.",
      potentialSavingKgPerYear: Math.round(result.breakdown.transport * 0.2),
      actionItems: [
        "Map your top three recurring routes",
        "Test public transit on the highest-emission route for two weeks",
        "Use cycling, walking, or e-scooter options for short local trips",
        "Consider a lower-emission vehicle when replacement is due",
      ],
    });
  }

  // ── Electricity: specific threshold recs (pushed first so they win dedup) ─────

  if (inputs.electricityKwhPerMonth > 400) {
    recommendations.push({
      id: "electricity-high",
      category: "electricity",
      priority: "high",
      title: "Lower high household electricity use",
      description:
        "Your monthly electricity use is above the typical household range. Efficiency upgrades and habit changes can reduce recurring emissions.",
      potentialSavingKgPerYear: Math.round(inputs.electricityKwhPerMonth * 12 * 0.25 * EMISSION_FACTORS.electricityPerKwh),
      actionItems: [
        "Replace remaining incandescent or halogen bulbs with LEDs",
        "Set heating and cooling equipment to efficient schedules",
        "Run laundry cold and air-dry when possible",
        "Unplug standby devices with smart power strips",
        "Choose high-efficiency appliances at replacement time",
      ],
    });
  } else if (inputs.electricityKwhPerMonth > 200) {
    recommendations.push({
      id: "electricity-medium",
      category: "electricity",
      priority: "medium",
      title: "Improve everyday energy efficiency",
      description:
        "Your electricity use has room for practical reductions without changing core household routines.",
      potentialSavingKgPerYear: Math.round(inputs.electricityKwhPerMonth * 12 * 0.15 * EMISSION_FACTORS.electricityPerKwh),
      actionItems: [
        "Use timers for high-use devices",
        "Wash full loads of laundry and dishes",
        "Seal obvious drafts around doors and windows",
      ],
    });
  }

  // ── Electricity: percentage-based fallback (pushed after specific recs) ───────

  if (result.percentages.electricity > 30) {
    recommendations.push({
      id: "electricity-renewable-medium",
      category: "electricity",
      priority: "medium",
      title: "Choose cleaner electricity",
      description:
        "Electricity is a large share of your footprint. A renewable tariff or rooftop solar can reduce emissions without reducing comfort.",
      potentialSavingKgPerYear: Math.round(result.breakdown.electricity * 0.35),
      actionItems: [
        "Check whether your utility offers a renewable electricity plan",
        "Compare certified green tariffs before switching",
        "Evaluate rooftop solar or community solar availability",
      ],
    });
  }

  // ── Food ──────────────────────────────────────────────────────────────────────

  if (inputs.dietType === "high_meat") {
    recommendations.push({
      id: "food-high-meat",
      category: "food",
      priority: "high",
      title: "Move toward lower-carbon meals",
      description:
        "Meat-heavy diets have a significantly higher annual footprint. Replacing some meals with plant-rich options is one of the most accessible changes.",
      potentialSavingKgPerYear: DIET_EMISSIONS.high_meat - DIET_EMISSIONS.mixed,
      actionItems: [
        "Make two dinners each week vegetarian",
        "Replace beef or lamb with poultry, legumes, or tofu",
        "Plan meals before shopping to avoid food waste",
        "Try plant-based proteins in familiar recipes",
      ],
    });
  } else if (inputs.dietType === "mixed") {
    recommendations.push({
      id: "food-mixed",
      category: "food",
      priority: "medium",
      title: "Make your mixed diet more plant-forward",
      description:
        "Small shifts in weekly meals can reduce food emissions while preserving flexibility.",
      potentialSavingKgPerYear: DIET_EMISSIONS.mixed - DIET_EMISSIONS.vegetarian,
      actionItems: [
        "Choose vegetarian lunches on weekdays",
        "Reduce red meat portions and frequency",
        "Buy seasonal produce when available",
      ],
    });
  }

  // ── Waste ─────────────────────────────────────────────────────────────────────

  if (inputs.recyclingHabit === "never") {
    recommendations.push({
      id: "waste-never",
      category: "waste",
      priority: "high",
      title: "Start a simple recycling routine",
      description:
        "Waste emissions are easiest to reduce when sorting becomes automatic at home.",
      potentialSavingKgPerYear: RECYCLING_OFFSETS.often,
      actionItems: [
        "Place clearly labelled bins near your main trash bin",
        "Learn local rules for paper, glass, plastic, and metal",
        "Rinse containers before recycling",
        "Compost food scraps if collection or garden composting is available",
      ],
    });
  } else if (inputs.recyclingHabit === "sometimes") {
    recommendations.push({
      id: "waste-sometimes",
      category: "waste",
      priority: "medium",
      title: "Make recycling consistent",
      description:
        "You already recycle some materials. A more consistent routine can prevent avoidable landfill emissions.",
      potentialSavingKgPerYear: RECYCLING_OFFSETS.often - RECYCLING_OFFSETS.sometimes,
      actionItems: [
        "Add recycling bins to bathrooms and work areas",
        "Set a weekly reminder to empty sorted materials",
        "Avoid products with hard-to-recycle mixed packaging",
      ],
    });
  }

  // ── Lifestyle ─────────────────────────────────────────────────────────────────

  recommendations.push({
    id: "lifestyle-low",
    category: "lifestyle",
    priority: "low",
    title: "Build a monthly carbon check-in",
    description:
      "A lightweight review keeps climate choices visible and helps you notice progress without turning it into a chore.",
    potentialSavingKgPerYear: 100,
    actionItems: [
      "Review your dashboard once a month",
      "Pick one habit to improve for the next four weeks",
      "Share a practical low-carbon idea with your household",
    ],
  });

  // Deduplicate: within each category keep only the highest-priority rec.
  // Specific threshold recs were pushed before fallback recs, so in a tie
  // the specific rec is already stored in the Map and wins automatically.
  const deduplicated = deduplicateByCategory(recommendations);

  return deduplicated.sort(
    (a, b) => recPriorityValue(a.priority) - recPriorityValue(b.priority),
  );
}

export function toPieChartData(breakdown: EmissionBreakdown): PieChartData[] {
  return [
    { name: "Transport", value: breakdown.transport, color: CHART_COLORS.transport },
    {
      name: "Electricity",
      value: breakdown.electricity,
      color: CHART_COLORS.electricity,
    },
    { name: "Food", value: breakdown.food, color: CHART_COLORS.food },
    { name: "Waste", value: breakdown.waste, color: CHART_COLORS.waste },
  ];
}

export function toBarChartData(breakdown: EmissionBreakdown): BarChartData[] {
  return [
    {
      category: "Transport",
      yours: breakdown.transport,
      average: AVERAGE_BREAKDOWN.transport,
      optimal: OPTIMAL_BREAKDOWN.transport,
    },
    {
      category: "Electricity",
      yours: breakdown.electricity,
      average: AVERAGE_BREAKDOWN.electricity,
      optimal: OPTIMAL_BREAKDOWN.electricity,
    },
    {
      category: "Food",
      yours: breakdown.food,
      average: AVERAGE_BREAKDOWN.food,
      optimal: OPTIMAL_BREAKDOWN.food,
    },
    {
      category: "Waste",
      yours: breakdown.waste,
      average: AVERAGE_BREAKDOWN.waste,
      optimal: OPTIMAL_BREAKDOWN.waste,
    },
  ];
}

export function formatKg(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)}t`;
  }

  return `${Math.round(kg).toLocaleString("en-US")} kg`;
}

export function formatTonnes(kg: number): string {
  return `${(kg / 1000).toFixed(2)} tonnes`;
}

export function getRatingConfig(rating: CarbonRating): RatingThreshold {
  return RATING_THRESHOLDS[rating];
}
