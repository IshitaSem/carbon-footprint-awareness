"use client";

import { useCallback, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Car, Info, Plane, PlugZap, Recycle, Salad } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DIET_OPTIONS, RECYCLING_OPTIONS } from "@/lib/constants";
import { CalculatorInputSchema } from "@/lib/validation";
import type { CalculatorInputs } from "@/types";

type FormErrors = Partial<Record<keyof CalculatorInputs, string>>;

const initialInputs: CalculatorInputs = {
  carKmPerWeek: 120,
  publicTransportKmPerWeek: 40,
  electricityKwhPerMonth: 260,
  dietType: "mixed",
  flightsPerYear: 1,
  recyclingHabit: "often",
};

function SectionIcon({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-earth-100 text-earth-700">
      {children}
    </div>
  );
}

export function CalculatorForm() {
  const router = useRouter();
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateNumberField = useCallback(
    (field: keyof Pick<
      CalculatorInputs,
      | "carKmPerWeek"
      | "publicTransportKmPerWeek"
      | "electricityKwhPerMonth"
      | "flightsPerYear"
    >) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value === "" ? 0 : Number(event.target.value);
        setInputs((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
      },
    [],
  );

  const updateDietType = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setInputs((current) => ({
        ...current,
        dietType: event.target.value as CalculatorInputs["dietType"],
      }));
      setErrors((current) => ({ ...current, dietType: undefined }));
    },
    [],
  );

  const updateRecyclingHabit = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setInputs((current) => ({
        ...current,
        recyclingHabit: event.target.value as CalculatorInputs["recyclingHabit"],
      }));
      setErrors((current) => ({ ...current, recyclingHabit: undefined }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);

      const result = CalculatorInputSchema.safeParse(inputs);

      if (!result.success) {
        const nextErrors: FormErrors = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof CalculatorInputs | undefined;
          if (field) {
            nextErrors[field] = issue.message;
          }
        });
        setErrors(nextErrors);
        setIsSubmitting(false);
        return;
      }

      sessionStorage.setItem("carbonInputs", JSON.stringify(result.data));
      router.push("/dashboard");
    },
    [inputs, router],
  );

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <Card variant="elevated">
        <CardHeader className="flex flex-row items-center gap-4">
          <SectionIcon>
            <Car className="h-5 w-5" aria-hidden />
          </SectionIcon>
          <CardTitle>Transport</CardTitle>
        </CardHeader>
        <CardBody className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Car distance per week"
            type="number"
            min={0}
            max={3000}
            step={1}
            value={inputs.carKmPerWeek}
            onChange={updateNumberField("carKmPerWeek")}
            error={errors.carKmPerWeek}
            unit="km"
          />
          <Input
            label="Public transport per week"
            type="number"
            min={0}
            max={3000}
            step={1}
            value={inputs.publicTransportKmPerWeek}
            onChange={updateNumberField("publicTransportKmPerWeek")}
            error={errors.publicTransportKmPerWeek}
            unit="km"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <SectionIcon>
            <Plane className="h-5 w-5" aria-hidden />
          </SectionIcon>
          <CardTitle>Flights</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="max-w-sm">
            <Input
              label="Flights per year"
              type="number"
              min={0}
              max={100}
              step={1}
              value={inputs.flightsPerYear}
              onChange={updateNumberField("flightsPerYear")}
              error={errors.flightsPerYear}
              unit="trips"
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <SectionIcon>
            <PlugZap className="h-5 w-5" aria-hidden />
          </SectionIcon>
          <CardTitle>Electricity</CardTitle>
        </CardHeader>
        <CardBody>
          <Input
            label="Monthly electricity use"
            type="number"
            min={0}
            max={5000}
            step={1}
            value={inputs.electricityKwhPerMonth}
            onChange={updateNumberField("electricityKwhPerMonth")}
            error={errors.electricityKwhPerMonth}
            hint="Check your electricity bill for monthly kWh. A typical household often falls near 200-400 kWh per month."
            unit="kWh"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <SectionIcon>
            <Salad className="h-5 w-5" aria-hidden />
          </SectionIcon>
          <CardTitle>Diet</CardTitle>
        </CardHeader>
        <CardBody>
          <Select
            label="Diet type"
            options={DIET_OPTIONS}
            value={inputs.dietType}
            onChange={updateDietType}
            error={errors.dietType}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <SectionIcon>
            <Recycle className="h-5 w-5" aria-hidden />
          </SectionIcon>
          <CardTitle>Waste</CardTitle>
        </CardHeader>
        <CardBody>
          <Select
            label="Recycling habit"
            options={RECYCLING_OPTIONS}
            value={inputs.recyclingHabit}
            onChange={updateRecyclingHabit}
            error={errors.recyclingHabit}
          />
        </CardBody>
      </Card>

      <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-carbon-200">
        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
          Calculate my footprint
        </Button>
        <p className="flex items-start gap-2 text-sm leading-6 text-carbon-500">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-earth-600" aria-hidden />
          Your answers are stored only in this browser session and are never sent to a server.
        </p>
      </div>
    </form>
  );
}
