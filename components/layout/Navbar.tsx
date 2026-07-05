"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/calculator", label: "Calculator" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuId = "primary-mobile-navigation";

  const toggleMenu = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-carbon-200/80 bg-white/85 backdrop-blur-xl">
      <nav className="section-container flex h-16 items-center justify-between gap-4" aria-label="Primary navigation">
        <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-earth-600 text-white">
            <Leaf className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-display text-2xl font-bold text-carbon-950">
            Sustainyapri
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-semibold transition",
                  active
                    ? "bg-earth-50 text-earth-700"
                    : "text-carbon-600 hover:bg-carbon-100 hover:text-carbon-950",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:block">
          <Link
            href="/calculator"
            aria-label="Go to carbon calculator"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-earth-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-earth-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-500 focus-visible:ring-offset-2"
          >
            Calculate Now
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-carbon-700 transition hover:bg-carbon-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-500 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls={mobileMenuId}
          onClick={toggleMenu}
        >
          {isOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </nav>

      {isOpen ? (
        <div
          id={mobileMenuId}
          className="border-t border-carbon-200 bg-white lg:hidden"
        >
          <div className="section-container py-3">
            <div className="grid gap-1">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMenu}
                    className={cn(
                      "rounded-xl px-4 py-3 text-base font-semibold transition",
                      active
                        ? "bg-earth-50 text-earth-700"
                        : "text-carbon-700 hover:bg-carbon-100",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/calculator"
                onClick={closeMenu}
                className="mt-2 rounded-xl bg-earth-600 px-4 py-3 text-center font-bold text-white"
              >
                Calculate Now
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
