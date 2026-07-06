import Link from "next/link";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section-container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-earth-100 text-earth-700">
        <Leaf className="h-8 w-8" aria-hidden />
      </div>
      <h1 className="mt-6 font-display text-5xl font-bold text-carbon-950">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-lg leading-8 text-carbon-600">
        The page you are looking for is not available in SustainYapri.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-earth-600 px-5 font-bold text-white transition hover:bg-earth-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-500 focus-visible:ring-offset-2"
      >
        Go home
      </Link>
    </section>
  );
}
