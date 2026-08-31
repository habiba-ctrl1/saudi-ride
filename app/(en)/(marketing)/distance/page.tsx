import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { DISTANCE_GUIDES } from "@/lib/data/distances";
import { Route, MapPin, Clock, ArrowRight } from "lucide-react";

const TITLE = "Saudi Arabia Distance Guides — City-to-City km, Drive Time & Taxi";
const DESCRIPTION = "How far is it between Saudi cities? Real driving distances and times for Riyadh, Jeddah, Makkah, Madinah, Dammam and more — with private taxi options and fares on WhatsApp.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://taxisaudiarabia.com/distance" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "https://taxisaudiarabia.com/distance" },
};

export default function DistanceHubPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Distances", href: "/distance" }]} />
      <section className="section-container max-w-4xl pt-28 pb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
          <Route className="h-3 w-3" /> Distance &amp; Journey Guides
        </span>
        <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-4">
          Saudi Arabia City Distances
        </h1>
        <p className="text-[#6B7280] leading-relaxed mb-10 max-w-2xl">
          Real driving distances and times between major Saudi cities, with the main highway, rest stops, and how each journey compares by car, train, and flight. Book a private taxi for any route — fare confirmed on WhatsApp.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {DISTANCE_GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/distance/${g.slug}`}
              className="group bg-white border border-[#16A34A]/12 rounded-2xl p-6 hover:border-[#16A34A]/40 hover:shadow-md transition-all"
            >
              <h2 className="font-heading text-lg font-bold mb-3 flex items-center justify-between">
                {g.fromCity} → {g.toCity}
                <ArrowRight className="h-4 w-4 text-[#16A34A] opacity-0 group-hover:opacity-100 transition-opacity" />
              </h2>
              <div className="flex items-center gap-4 text-[0.7rem] text-[#6B7280] font-semibold">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-[#C9A84C]" /> ~{g.km} km</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-[#C9A84C]" /> {g.driveLabel}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
