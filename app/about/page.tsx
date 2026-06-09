import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  Database,
  ExternalLink,
  Shield,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how SustainaX estimates personal carbon footprints and why its calculator keeps data private in the browser.",
};

const principles = [
  {
    title: "Privacy First",
    description:
      "Your calculator inputs stay in session storage on your device. SustainaX has no backend, database, or account system.",
    icon: Shield,
    color: "bg-earth-100 text-earth-700",
  },
  {
    title: "Science-Backed",
    description:
      "The platform uses transparent factors informed by IPCC, IEA, and public emissions research.",
    icon: Database,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Transparent",
    description:
      "Every category is visible in kilograms per year, with clear benchmarks and practical recommendations.",
    icon: Calculator,
    color: "bg-amber-100 text-amber-700",
  },
] as const;

const factors = [
  { activity: "Car travel", factor: "0.21 kg CO2/km", source: "IPCC-informed transport factors" },
  { activity: "Public transport", factor: "0.089 kg CO2/km", source: "IEA and conversion datasets" },
  { activity: "Electricity", factor: "0.475 kg CO2/kWh", source: "IEA global grid estimates" },
  { activity: "Flight per trip", factor: "255 kg CO2", source: "Public aviation averages" },
  { activity: "Vegan diet", factor: "1,500 kg CO2/year", source: "Food system lifecycle research" },
  { activity: "Vegetarian diet", factor: "1,700 kg CO2/year", source: "Food system lifecycle research" },
  { activity: "Mixed diet", factor: "2,500 kg CO2/year", source: "Food system lifecycle research" },
  { activity: "High-meat diet", factor: "3,300 kg CO2/year", source: "Food system lifecycle research" },
] as const;

const sources = [
  { title: "IPCC", href: "https://www.ipcc.ch/", description: "Assessment reports and climate science synthesis." },
  { title: "Our World in Data", href: "https://ourworldindata.org/co2-and-greenhouse-gas-emissions", description: "Accessible emissions data and research explainers." },
  { title: "IEA", href: "https://www.iea.org/", description: "Energy system data, electricity, and transition analysis." },
  { title: "UK GHG Conversion Factors", href: "https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting", description: "Detailed activity-based greenhouse gas conversion factors." },
] as const;

export default function AboutPage() {
  return (
    <section className="section-container py-14 sm:py-20">
      <div className="max-w-3xl">
        <h1 className="page-title">About SustainaX</h1>
        <div className="page-subtitle space-y-5">
          <p>
            SustainaX exists to make personal climate impact easier to understand. It translates everyday activities into annual carbon estimates that are concrete enough to act on.
          </p>
          <p>
            The calculator uses science-backed emission factors and keeps the assumptions visible. It is designed for awareness, comparison, and habit change rather than formal carbon accounting.
          </p>
          <p>
            Privacy is part of the design. There is no backend, no database, and no authentication. Your inputs live only in this browser session.
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {principles.map((principle) => {
          const Icon = principle.icon;
          return (
            <article key={principle.title} className="rounded-2xl border border-carbon-200 bg-white p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${principle.color}`}>
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h2 className="mt-5 text-xl font-bold text-carbon-950">{principle.title}</h2>
              <p className="mt-3 leading-7 text-carbon-600">{principle.description}</p>
            </article>
          );
        })}
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl font-bold text-carbon-950">
          Emission Factors
        </h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-carbon-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-carbon-200">
              <thead className="bg-carbon-50">
                <tr>
                  <th scope="col" className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide text-carbon-500">
                    Activity
                  </th>
                  <th scope="col" className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide text-carbon-500">
                    Factor
                  </th>
                  <th scope="col" className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide text-carbon-500">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-carbon-100">
                {factors.map((factor) => (
                  <tr key={factor.activity}>
                    <td className="px-5 py-4 font-semibold text-carbon-950">
                      {factor.activity}
                    </td>
                    <td className="px-5 py-4 font-mono text-carbon-700">
                      {factor.factor}
                    </td>
                    <td className="px-5 py-4 text-carbon-600">{factor.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <p className="flex gap-3 text-sm leading-6">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            Electricity emissions vary significantly by region because grid mixes differ. Treat the global factor as a useful approximation.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl font-bold text-carbon-950">
          Primary Sources
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {sources.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-carbon-200 bg-white p-6 transition hover:border-earth-300 hover:shadow-md hover:shadow-carbon-900/10"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-carbon-950">{source.title}</h3>
                <ExternalLink className="h-5 w-5 text-carbon-400" aria-hidden />
              </div>
              <p className="mt-3 leading-7 text-carbon-600">{source.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-2xl font-bold text-amber-950">Limitations</h2>
        <ul className="mt-4 space-y-3 text-amber-900">
          <li>It does not include every purchase, service, building material, or investment-linked emission.</li>
          <li>It uses global averages rather than location-specific electricity, transit, or food supply chains.</li>
          <li>It estimates carbon dioxide equivalents for awareness and is not a certified audit.</li>
        </ul>
      </section>

      <div className="mt-16 rounded-2xl bg-earth-950 p-8 text-white">
        <h2 className="font-display text-3xl font-bold">Measure your footprint next</h2>
        <p className="mt-3 text-earth-50/80">
          Start with a private browser-based estimate, then use the dashboard to choose your next step.
        </p>
        <Link
          href="/calculator"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-earth-400 px-5 font-bold text-earth-950 transition hover:bg-earth-300"
        >
          Open Calculator
        </Link>
      </div>
    </section>
  );
}
