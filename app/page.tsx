import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Calculator,
  Gauge,
  Globe2,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

const features = [
  {
    title: "Precise Calculator",
    description:
      "Estimate transport, electricity, food, and waste emissions with clear assumptions and science-informed factors.",
    icon: Calculator,
    color: "bg-earth-100 text-earth-700",
  },
  {
    title: "Visual Dashboard",
    description:
      "Turn annual kilograms into charts, progress views, and comparisons that make your footprint easier to understand.",
    icon: BarChart3,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Personalised Insights",
    description:
      "Get ranked recommendations based on your highest-impact activities, from travel to household energy.",
    icon: Gauge,
    color: "bg-amber-100 text-amber-700",
  },
] as const;

const steps = [
  {
    title: "Enter your habits",
    description:
      "Add weekly travel, electricity use, diet pattern, flights, and recycling habits in under three minutes.",
  },
  {
    title: "Review your dashboard",
    description:
      "See your annual footprint, category breakdown, rating, and comparison against global and sustainable benchmarks.",
  },
  {
    title: "Act on the insights",
    description:
      "Prioritise the recommendations that save the most carbon while fitting your real life.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-earth-950 via-moss-950 to-earth-900 text-white">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.26),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.1),transparent_24%)]"
          aria-hidden
        />
        <div className="section-container relative py-20 sm:py-24 lg:py-28">
          <div className="max-w-4xl animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-earth-100">
              <span className="h-2 w-2 rounded-full bg-earth-400 animate-pulse-slow" aria-hidden />
              Based on IPCC & IEA emission factors
            </div>
            <h1 className="mt-8 font-display text-6xl font-bold tracking-normal sm:text-7xl lg:text-8xl">
              Know Your
              <span className="block text-earth-400">Carbon Footprint</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-earth-50/85">
              SustainYapri helps you calculate your annual impact, understand the categories that matter most, and choose practical reductions with confidence.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/calculator"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-earth-500 px-6 text-base font-bold text-earth-950 transition hover:bg-earth-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-300 focus-visible:ring-offset-2 focus-visible:ring-offset-earth-950"
              >
                Calculate My Footprint
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/25 px-6 text-base font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-earth-950"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-carbon-200 bg-white">
        <div className="section-container py-8">
          <dl className="grid gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-4">
              <Globe2 className="h-8 w-8 text-earth-600" aria-hidden />
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-carbon-500">
                  Global average
                </dt>
                <dd className="text-2xl font-bold text-carbon-950">4.7t</dd>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Target className="h-8 w-8 text-earth-600" aria-hidden />
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-carbon-500">
                  Sustainable target
                </dt>
                <dd className="text-2xl font-bold text-carbon-950">2t</dd>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-earth-600" aria-hidden />
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-carbon-500">
                  Shared challenge
                </dt>
                <dd className="text-2xl font-bold text-carbon-950">8bn+ people</dd>
              </div>
            </div>
          </dl>
        </div>
      </section>

      <section className="section-container py-20">
        <div className="max-w-2xl">
          <h2 className="page-title">A clearer way to read your impact</h2>
          <p className="page-subtitle">
            SustainYapri keeps the experience focused on action: simple inputs, transparent math, and recommendations matched to your biggest categories.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-carbon-200 bg-white p-6 transition hover:border-earth-300 hover:shadow-md hover:shadow-carbon-900/10"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-bold text-carbon-950">{feature.title}</h3>
                <p className="mt-3 leading-7 text-carbon-600">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-20">
        <div className="section-container">
          <h2 className="page-title">How it works</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="relative border-t border-carbon-200 pt-8">
                <span className="font-mono text-6xl font-bold text-earth-100">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-2xl font-bold text-carbon-950">{step.title}</h3>
                <p className="mt-3 leading-7 text-carbon-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-earth-950 py-20 text-white">
        <div className="section-container flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-4xl font-bold tracking-normal sm:text-5xl">
              Ready to measure
              <span className="block text-earth-300">your impact?</span>
            </h2>
            <p className="mt-4 text-earth-50/80">
              Under 3 minutes, no account, data stays in browser.
            </p>
          </div>
          <Link
            href="/calculator"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-earth-400 px-6 text-base font-bold text-earth-950 transition hover:bg-earth-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-200 focus-visible:ring-offset-2 focus-visible:ring-offset-earth-950"
          >
            Start Calculator
            <ShieldCheck className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
