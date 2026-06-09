import { z } from "zod";
import type { CalculatorInputs } from "@/types";

export const CalculatorInputSchema = z.object({
  carKmPerWeek: z.coerce
    .number({
      invalid_type_error: "Enter weekly car distance as a number.",
    })
    .min(0, "Car distance cannot be negative.")
    .max(3000, "Car distance must be 3,000 km per week or less."),
  publicTransportKmPerWeek: z.coerce
    .number({
      invalid_type_error: "Enter weekly public transport distance as a number.",
    })
    .min(0, "Public transport distance cannot be negative.")
    .max(3000, "Public transport distance must be 3,000 km per week or less."),
  electricityKwhPerMonth: z.coerce
    .number({
      invalid_type_error: "Enter monthly electricity use as a number.",
    })
    .min(0, "Electricity use cannot be negative.")
    .max(5000, "Electricity use must be 5,000 kWh per month or less."),
  dietType: z.enum(["vegan", "vegetarian", "mixed", "high_meat"], {
    errorMap: () => ({ message: "Choose a diet type." }),
  }),
  flightsPerYear: z.coerce
    .number({
      invalid_type_error: "Enter flights per year as a number.",
    })
    .int("Flights must be a whole number.")
    .min(0, "Flights cannot be negative.")
    .max(100, "Flights must be 100 per year or less."),
  recyclingHabit: z.enum(["never", "sometimes", "often", "always"], {
    errorMap: () => ({ message: "Choose a recycling habit." }),
  }),
});

export type ValidatedCalculatorInputs = z.infer<typeof CalculatorInputSchema>;

export function parseStoredCalculatorInputs(
  storedValue: string | null,
): CalculatorInputs | null {
  if (!storedValue) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(storedValue);
    const validated = CalculatorInputSchema.safeParse(parsed);

    return validated.success ? validated.data : null;
  } catch {
    return null;
  }
}
