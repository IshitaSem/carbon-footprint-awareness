import type {
  CarbonRating,
  DietType,
  EmissionBreakdown,
  RecyclingHabit,
} from "@/types";

export const EMISSION_FACTORS = {
  carPerKm: 0.21,
  publicTransportPerKm: 0.089,
  electricityPerKwh: 0.475,
  flightPerTrip: 255,
} as const;

export const DIET_EMISSIONS: Record<DietType, number> = {
  vegan: 1500,
  vegetarian: 1700,
  mixed: 2500,
  high_meat: 3300,
} as const;

export const RECYCLING_OFFSETS: Record<RecyclingHabit, number> = {
  never: 0,
  sometimes: 100,
  often: 250,
  always: 450,
} as const;

export const BASE_WASTE_EMISSIONS = 500;
export const GLOBAL_AVERAGE_KG_PER_YEAR = 4700;
export const SUSTAINABLE_TARGET_KG_PER_YEAR = 2000;

export interface RatingThreshold {
  rating: CarbonRating;
  label: string;
  min: number;
  max: number;
  color: string;
  bgColor: string;
}

export const RATING_THRESHOLDS: Record<CarbonRating, RatingThreshold> = {
  low: {
    rating: "low",
    label: "Low",
    min: 0,
    max: 2000,
    color: "#22c55e",
    bgColor: "#dcfce7",
  },
  medium: {
    rating: "medium",
    label: "Medium",
    min: 2001,
    max: 4700,
    color: "#f59e0b",
    bgColor: "#fef3c7",
  },
  high: {
    rating: "high",
    label: "High",
    min: 4701,
    max: 8000,
    color: "#f97316",
    bgColor: "#ffedd5",
  },
  critical: {
    rating: "critical",
    label: "Critical",
    min: 8001,
    max: Number.POSITIVE_INFINITY,
    color: "#ef4444",
    bgColor: "#fee2e2",
  },
} as const;

export const CHART_COLORS: Record<keyof EmissionBreakdown, string> = {
  transport: "#22c55e",
  electricity: "#3b82f6",
  food: "#f59e0b",
  waste: "#8b5cf6",
} as const;

export const DIET_OPTIONS: Array<{
  value: DietType;
  label: string;
  description: string;
}> = [
  {
    value: "vegan",
    label: "Vegan",
    description: "Plant-based meals with no animal products",
  },
  {
    value: "vegetarian",
    label: "Vegetarian",
    description: "Plant-forward diet including dairy or eggs",
  },
  {
    value: "mixed",
    label: "Mixed",
    description: "Balanced diet with occasional meat or fish",
  },
  {
    value: "high_meat",
    label: "High meat",
    description: "Meat-centred meals most days",
  },
];

export const RECYCLING_OPTIONS: Array<{
  value: RecyclingHabit;
  label: string;
  description: string;
}> = [
  {
    value: "never",
    label: "Never",
    description: "No regular recycling or composting routine",
  },
  {
    value: "sometimes",
    label: "Sometimes",
    description: "Recycles selected items when convenient",
  },
  {
    value: "often",
    label: "Often",
    description: "Recycles most eligible household materials",
  },
  {
    value: "always",
    label: "Always",
    description: "Recycles, composts, and avoids excess waste",
  },
];

export const AVERAGE_BREAKDOWN: EmissionBreakdown = {
  transport: 1700,
  electricity: 1200,
  food: 1400,
  waste: 400,
};

export const OPTIMAL_BREAKDOWN: EmissionBreakdown = {
  transport: 550,
  electricity: 450,
  food: 750,
  waste: 250,
};
