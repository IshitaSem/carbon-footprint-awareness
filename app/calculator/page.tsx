import type { Metadata } from "next";
import { Calculator, Info } from "lucide-react";
import { CalculatorForm } from "@/components/calculator/CalculatorForm";

export const metadata: Metadata = {
  title: "Carbon Calculator",
  description:
    "Estimate your annual carbon footprint across transport, electricity, food, flights, and waste.",
};

export default function CalculatorPage() {
  return (
    <section className="section-container py-14 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-earth-100 text-earth-700">
          <Calculator className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="page-title mt-6">Carbon Calculator</h1>
        <p className="page-subtitle mx-auto">
          Enter your typical weekly and yearly habits to estimate your annual carbon footprint.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-900">
        <p className="flex gap-3 text-sm leading-6">
          <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          Use average habits if your month varies. The goal is a useful estimate, not perfect bookkeeping.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <CalculatorForm />
      </div>
    </section>
  );
}
