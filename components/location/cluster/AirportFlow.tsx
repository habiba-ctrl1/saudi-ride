"use client";

import { useState } from "react";
import { CalendarCheck, PlaneLanding, UserCheck, Luggage, Car, Building2, PlaneTakeoff, Hotel, TrafficCone } from "lucide-react";

type Step = { title: string; desc: string };

const ARRIVAL_ICONS = [CalendarCheck, PlaneLanding, UserCheck, Luggage, Car, Building2];
const DEPARTURE_ICONS = [CalendarCheck, Hotel, TrafficCone, PlaneTakeoff];

// Connected journey diagram for a city airport (RUH, JED, …). Horizontal rail with numbered nodes on
// desktop, vertical rail on mobile — same ordered list either way, so the
// text equivalent is the markup itself (no image, no canvas).
export function AirportFlow({ arrival, departure, code = "RUH" }: { arrival: Step[]; departure: Step[]; code?: string }) {
  const [mode, setMode] = useState<"arrival" | "departure">("arrival");
  const steps = mode === "arrival" ? arrival : departure;
  const icons = mode === "arrival" ? ARRIVAL_ICONS : DEPARTURE_ICONS;
  const cols = steps.length === 6 ? "lg:grid-cols-6" : "lg:grid-cols-4";

  return (
    <div>
      <div role="group" aria-label="Show arrival or departure" className="mb-8 inline-flex rounded-full border border-white/15 bg-white/5 p-1">
        {(["arrival", "departure"] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={`min-h-[40px] rounded-full px-5 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15] ${
              mode === m ? "bg-[#FACC15] text-[#0B1F14]" : "text-white/75 hover:text-white"
            }`}
          >
            {m === "arrival" ? `Arriving at ${code}` : `Departing from ${code}`}
          </button>
        ))}
      </div>

      <ol className={`relative grid gap-0 lg:gap-4 ${cols}`}>
        {/* desktop connector rail */}
        <span aria-hidden="true" className="absolute left-[8%] right-[8%] top-6 hidden h-px bg-gradient-to-r from-[#FACC15]/0 via-[#FACC15]/60 to-[#FACC15]/0 lg:block" />
        {steps.map((s, i) => {
          const Icon = icons[i] ?? Car;
          const last = i === steps.length - 1;
          return (
            <li key={`${mode}-${s.title}`} className="group relative flex gap-4 pb-8 lg:flex-col lg:items-center lg:gap-0 lg:pb-0 lg:text-center">
              {/* mobile connector rail */}
              {!last && <span aria-hidden="true" className="absolute left-6 top-12 bottom-0 w-px bg-[#FACC15]/35 lg:hidden" />}
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#FACC15]/40 bg-[#0B1F14] text-[#FACC15] transition-transform duration-300 group-hover:-translate-y-1">
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#16A34A] text-[0.6rem] font-bold text-[#FFFFFF]">{i + 1}</span>
              </span>
              <div className="lg:mt-4 lg:px-1">
                <p className="font-heading text-[0.95rem] font-bold text-[#FFFFFF]">{s.title}</p>
                <p className="mt-1 text-[0.8rem] leading-relaxed text-white/70">{s.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
