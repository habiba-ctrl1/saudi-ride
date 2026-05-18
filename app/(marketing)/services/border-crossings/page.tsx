import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Globe, FileText, Clock, Car, CheckCircle2, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "GCC Border Crossing Taxi Service | Riyadh Luxe Taxi",
  description: "Seamless VIP cross-border transfers from Saudi Arabia to Bahrain, UAE, Qatar, Kuwait, and Jordan. We handle the driving and border logistics.",
};

const BORDERS = [
  {
    name: "Saudi-Bahrain",
    crossing: "King Fahd Causeway",
    wait: "30 - 60 mins",
    reqs: "Valid Passport, Bahrain Visa (if applicable), Saudi Exit/Re-entry Visa (for expats).",
    vehicle: "Executive Sedan or SUV",
    price: 350,
    from: "Dammam / Khobar"
  },
  {
    name: "Saudi-UAE",
    crossing: "Al Batha / Ghuwaifat",
    wait: "1 - 2 hrs",
    reqs: "Valid Passport, UAE Visa (check eligibility), Saudi Exit/Re-entry Visa.",
    vehicle: "Luxury SUV (Recommended for long haul)",
    price: 1800,
    from: "Riyadh"
  },
  {
    name: "Saudi-Qatar",
    crossing: "Salwa Border",
    wait: "45 - 90 mins",
    reqs: "Valid Passport, Hayya Card / Qatar Visa.",
    vehicle: "Executive Sedan or SUV",
    price: 900,
    from: "Dammam / Al-Ahsa"
  },
  {
    name: "Saudi-Kuwait",
    crossing: "Al Khafji / Nuwaiseeb",
    wait: "45 - 90 mins",
    reqs: "Valid Passport, Kuwait Visa.",
    vehicle: "Executive Sedan or SUV",
    price: 850,
    from: "Dammam / Jubail"
  },
  {
    name: "Saudi-Jordan",
    crossing: "Al Hadithah",
    wait: "1 - 2 hrs",
    reqs: "Valid Passport, Jordan Visa.",
    vehicle: "Luxury SUV",
    price: 1500,
    from: "Tabuk"
  }
];

export default function BorderCrossingsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24">
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80" 
            alt="GCC Border Crossing Saudi Arabia" 
            fill 
            className="object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-6">
            <Globe className="h-3 w-3" /> International
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Seamless GCC <br />
            <span className="text-[#C9A84C]">Border Crossings</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#A1A1A6] leading-relaxed mb-10">
            Skip the flights. Travel directly from your doorstep in Saudi Arabia to Bahrain, UAE, Qatar, Kuwait, or Jordan in a private VIP vehicle. Our experienced chauffeurs handle the border logistics.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-3.5 text-xs font-bold uppercase text-[#0A0A0A] hover:bg-[#B8963B] transition-all"
            >
              Book Cross-Border Transfer
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHY US FOR BORDERS ───────────────────────────────────── */}
      <section className="section-container max-w-5xl py-20 border-b border-[#C9A84C]/10">
        <div className="bg-[#111] border border-[#C9A84C]/20 rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="font-heading text-3xl font-bold mb-2">The Complexity of Border Travel</h2>
              <p className="text-sm text-[#A1A1A6] leading-relaxed">
                Crossing land borders in the GCC requires specific vehicle authorizations, international insurance (Carnet de Passages), and experienced drivers who understand customs protocols. 
              </p>
              <p className="text-sm text-[#A1A1A6] leading-relaxed">
                We eliminate this stress. Our cross-border fleet is pre-authorized with all necessary international permits, and our drivers are seasoned in navigating the Saudi exit and neighboring country entry processes smoothly.
              </p>
              <ul className="space-y-3 pt-4 border-t border-[#C9A84C]/10">
                <li className="flex items-center gap-3 text-sm text-[#F5F0E8] font-bold"><CheckCircle2 className="h-4 w-4 text-[#C9A84C]" /> Pre-cleared vehicle insurance</li>
                <li className="flex items-center gap-3 text-sm text-[#F5F0E8] font-bold"><CheckCircle2 className="h-4 w-4 text-[#C9A84C]" /> Dedicated fast-track lanes (where applicable)</li>
                <li className="flex items-center gap-3 text-sm text-[#F5F0E8] font-bold"><CheckCircle2 className="h-4 w-4 text-[#C9A84C]" /> 24/7 border operations</li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <div className="bg-gradient-to-b from-[#C9A84C]/20 to-transparent p-6 rounded-2xl border border-[#C9A84C]/30 text-center">
                <AlertTriangle className="h-8 w-8 text-[#C9A84C] mx-auto mb-3" />
                <h4 className="font-bold text-sm mb-2">Important Notice</h4>
                <p className="text-xs text-[#A1A1A6]">While we handle the vehicle logistics, passengers are strictly responsible for holding valid personal visas and passports required for entry.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BORDER DETAILS ───────────────────────────────────────── */}
      <section className="section-container max-w-7xl py-20">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold mb-4">Supported Borders & Rates</h2>
          <p className="text-[#A1A1A6]">Select your destination to view requirements and estimated starting prices.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {BORDERS.map((border, i) => (
            <div key={i} className="bg-[#111] rounded-3xl border border-[#C9A84C]/15 p-8 flex flex-col hover:border-[#C9A84C]/40 transition-all">
              <div className="flex justify-between items-start mb-6 border-b border-[#C9A84C]/10 pb-6">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-[#F5F0E8] mb-1">{border.name}</h3>
                  <p className="text-sm text-[#C9A84C] font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" /> {border.crossing}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[0.6rem] uppercase text-[#7C8088] font-bold tracking-wider">From {border.from}</p>
                  <p className="text-xl font-bold text-[#C9A84C]">SAR {border.price}</p>
                </div>
              </div>

              <div className="space-y-5 flex-1">
                <div className="flex gap-4">
                  <Clock className="h-5 w-5 text-[#7C8088] shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[#F5F0E8] uppercase tracking-wider mb-1">Est. Border Wait Time</h4>
                    <p className="text-sm text-[#A1A1A6]">{border.wait}</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <FileText className="h-5 w-5 text-[#7C8088] shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[#F5F0E8] uppercase tracking-wider mb-1">Passenger Requirements</h4>
                    <p className="text-sm text-[#A1A1A6]">{border.reqs}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Car className="h-5 w-5 text-[#7C8088] shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[#F5F0E8] uppercase tracking-wider mb-1">Recommended Vehicle</h4>
                    <p className="text-sm text-[#A1A1A6]">{border.vehicle}</p>
                  </div>
                </div>
              </div>

              <Link
                href={`/book?pickup=${encodeURIComponent(border.from)}&dropoff=${encodeURIComponent(border.name.split('-')[1])}`}
                className="mt-8 w-full text-center rounded-full border border-[#C9A84C]/30 py-3 text-xs font-bold uppercase text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all"
              >
                Book This Route
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
