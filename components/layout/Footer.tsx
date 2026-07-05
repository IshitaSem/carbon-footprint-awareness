import Link from "next/link";
import { ExternalLink, Leaf } from "lucide-react";

const platformLinks = [
  { href: "/calculator", label: "Calculator" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
] as const;

const externalLinks = [
  { href: "https://www.ipcc.ch/", label: "IPCC" },
  { href: "https://ourworldindata.org/co2-and-greenhouse-gas-emissions", label: "Our World in Data" },
  { href: "https://www.iea.org/", label: "IEA" },
  { href: "https://www.goldstandard.org/", label: "Carbon offsets" },
] as const;

export function Footer() {
  return (
    <footer className="bg-moss-950 text-white">
      <div className="section-container py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-earth-500 text-white">
                <Leaf className="h-5 w-5" aria-hidden />
              </span>
              <span className="font-display text-2xl font-bold">Sustainyapri</span>
            </div>
            <p className="mt-4 max-w-md leading-7 text-moss-100">
              A browser-first platform for understanding personal carbon emissions and finding practical reduction opportunities.
            </p>
            <p className="mt-4 text-sm text-moss-200">
              Emission factors are informed by IPCC, IEA, and public climate datasets.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-moss-200">
              Platform
            </h2>
            <ul className="mt-4 space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-moss-100 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-moss-200">
              Resources
            </h2>
            <ul className="mt-4 space-y-3">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-moss-100 transition hover:text-white"
                  >
                    {link.label}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-moss-200 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 Sustainyapri. All rights reserved.</p>
          <p>Built with Next.js 14 - Data from IPCC</p>
        </div>
      </div>
    </footer>
  );
}
