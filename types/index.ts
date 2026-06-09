export type DietType = "vegan" | "vegetarian" | "mixed" | "high_meat";
export type RecyclingHabit = "never" | "sometimes" | "often" | "always";
export type CarbonRating = "low" | "medium" | "high" | "critical";
export type RecommendationCategory =
  | "transport"
  | "electricity"
  | "food"
  | "waste"
  | "lifestyle";
export type RecommendationPriority = "high" | "medium" | "low";

export interface CalculatorInputs {
  carKmPerWeek: number;
  publicTransportKmPerWeek: number;
  electricityKwhPerMonth: number;
  dietType: DietType;
  flightsPerYear: number;
  recyclingHabit: RecyclingHabit;
}

export interface EmissionBreakdown {
  transport: number;
  electricity: number;
  food: number;
  waste: number;
}

export interface CarbonResult {
  totalKgPerYear: number;
  breakdown: EmissionBreakdown;
  rating: CarbonRating;
  percentages: EmissionBreakdown;
  comparisonToAverage: number;
}

export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  priority: RecommendationPriority;
  title: string;
  description: string;
  potentialSavingKgPerYear: number;
  actionItems: string[];
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface BarChartData {
  category: string;
  yours: number;
  average: number;
  optimal: number;
}
