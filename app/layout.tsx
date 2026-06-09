import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: {
    default: "CarbonWise | Carbon Footprint Awareness Platform",
    template: "%s | CarbonWise",
  },
  description:
    "CarbonWise helps you calculate, visualize, and reduce your annual carbon footprint using IPCC and IEA-informed emission factors.",
  keywords: [
    "carbon footprint",
    "climate calculator",
    "carbon emissions",
    "sustainability",
    "IPCC",
    "IEA",
    "personal climate action",
  ],
  openGraph: {
    title: "CarbonWise | Carbon Footprint Awareness Platform",
    description:
      "Measure your personal carbon footprint and discover practical actions to reduce it.",
    type: "website",
    siteName: "CarbonWise",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@600;700;800&family=Source+Sans+3:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col font-body antialiased">
        <a
          href="#main-content"
          className="sr-only z-[60] rounded-br-xl bg-earth-600 px-4 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:left-0 focus:top-0"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
