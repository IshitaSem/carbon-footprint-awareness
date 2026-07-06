import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JetBrains_Mono, Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SustainYapri | Carbon Footprint Awareness Platform",
    template: "%s | SustainYapri",
  },
  description:
    "SustainYapri helps you calculate, visualize, and reduce your annual carbon footprint using IPCC and IEA-informed emission factors.",
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
    title: "SustainYapri | Carbon Footprint Awareness Platform",
    description:
      "Measure your personal carbon footprint and discover practical actions to reduce it.",
    type: "website",
    siteName: "SustainYapri",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${sourceSans3.variable} ${jetbrainsMono.variable}`}
    >
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
