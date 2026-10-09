import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AirportFlow } from "./AirportFlow";
import { MED_ARRIVAL_STEPS, MED_DEPARTURE_STEPS, MD_MED_CITY, MD_MED_MAKKAH } from "@/lib/data/madinah-cluster";

// Extra blocks for /airports/prince-mohammad-madinah (added 2026-10-09):
// the MED ↔ hotel journey diagram, the Central Area (Markaziyah) drop-off
// reality, and links to the Madinah hub, Ziyarat and private-driver pages.
// Figures come from routeFact() via madinah-cluster.ts.
export function MedAirportExtras() {
  return (
    <>
      <section aria-labelledby="med-flow-heading" className="overflow-hidden rounded-3xl bg-[#0B1F14] p-6 text-[#FFFFFF] sm:p-8">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#FACC15]">MED ↔ your hotel</p>
        <h2 id="med-flow-heading" className="mt-2 font-heading text-2xl font-bold text-[#FFFFFF]">From the arrivals hall to your Madinah hotel</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">
          Prince Mohammad bin Abdulaziz International Airport (MED) is about {MD_MED_CITY.km} km from the Central Area, {MD_MED_CITY.time} on a clear road. Switch to departure to see the return leg.
        </p>
        <div className="mt-8">
          <AirportFlow arrival={MED_ARRIVAL_STEPS} departure={MED_DEPARTURE_STEPS} code="MED" />
        </div>
      </section>

      <section aria-labelledby="med-hotel-heading" className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 sm:p-8">
        <h2 id="med-hotel-heading" className="font-heading text-2xl font-bold text-[#1C1C1C]">Hotels near Masjid an-Nabawi: where the car can stop</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">
          The Central Area (Markaziyah) around Al-Masjid an-Nabawi has restricted vehicle access, and roads there are slower around prayer times and on Fridays. The driver takes you to the nearest permitted drop-off point to your hotel — we cannot promise a door-to-door drop at every hotel. Give us the exact hotel name, and tell us about heavy bags or mobility needs so the drop-off can be planned.
        </p>
        <ul className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <li><Link href="/routes/madinah-airport-to-madinah-markaziyah" className="font-semibold text-[#15803D] hover:underline">MED to Markaziyah hotels</Link> — hotel-level details for the Central Area</li>
          <li><Link href="/routes/madinah-airport-to-city" className="font-semibold text-[#15803D] hover:underline">MED to any Madinah district</Link> — hotels outside the Central Area</li>
          <li><Link href="/routes/madinah-airport-to-makkah" className="font-semibold text-[#15803D] hover:underline">MED to Makkah</Link> — about {MD_MED_MAKKAH.km} km, {MD_MED_MAKKAH.time}, hotel to hotel</li>
          <li><Link href="/services/madinah-ziyarat" className="font-semibold text-[#15803D] hover:underline">Madinah Ziyarat by private car</Link> — Quba, Qiblatayn, Uhud and more</li>
          <li><Link href="/locations/madinah/private-driver" className="font-semibold text-[#15803D] hover:underline">Private driver in Madinah</Link> — hourly or full-day hire</li>
          <li><Link href="/locations/madinah" className="font-semibold text-[#15803D] hover:underline">All Madinah transfers</Link> — the full route and service overview</li>
        </ul>
        <p className="mt-5 flex items-center gap-2 text-xs text-[#6B7280]"><ArrowRight className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" /> Fare for every trip is confirmed on WhatsApp before booking.</p>
      </section>
    </>
  );
}
