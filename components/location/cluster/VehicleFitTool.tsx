"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Users, Luggage, ArrowRight } from "lucide-react";

export interface FitOption {
  id: string;
  label: string;
  forWho: string;
  href: string;
  passengers: number;
  luggage: number;
}

function Stepper({ label, icon, value, setValue, min, max }: { label: string; icon: React.ReactNode; value: number; setValue: (n: number) => void; min: number; max: number }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3">
      <span className="flex items-center gap-2 text-sm font-semibold text-[#1C1C1C]">
        <span className="text-[#16A34A]">{icon}</span>
        {label}
      </span>
      <div className="flex items-center gap-2">
        <button type="button" aria-label={`Fewer ${label.toLowerCase()}`} onClick={() => setValue(Math.max(min, value - 1))} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] text-[#374151] hover:border-[#16A34A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <output aria-live="polite" className="w-8 text-center font-heading text-lg font-bold tabular-nums">{value}</output>
        <button type="button" aria-label={`More ${label.toLowerCase()}`} onClick={() => setValue(Math.min(max, value + 1))} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] text-[#374151] hover:border-[#16A34A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

// Passenger/luggage → vehicle category. Capacities come from lib/fleet-data
// via props; luxury is never auto-picked (it's a choice of occasion, not size).
export function VehicleFitTool({ options }: { options: FitOption[] }) {
  const [pax, setPax] = useState(2);
  const [bags, setBags] = useState(2);
  const sized = options.filter((o) => o.id !== "luxury");
  const fit = sized.find((o) => pax <= o.passengers && bags <= o.luggage) ?? sized[sized.length - 1];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
      <div className="space-y-3">
        <Stepper label="Passengers" icon={<Users className="h-4 w-4" />} value={pax} setValue={setPax} min={1} max={25} />
        <Stepper label="Large bags" icon={<Luggage className="h-4 w-4" />} value={bags} setValue={setBags} min={0} max={30} />
        <p className="px-1 text-[0.75rem] leading-relaxed text-[#6B7280]">
          Indicative only — the exact vehicle is confirmed with your quote. Larger groups can be split across vehicles.
        </p>
      </div>
      <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {options.map((o) => {
          const on = o.id === fit.id;
          return (
            <li key={o.id}>
              <Link
                href={o.href}
                className={`group flex h-full flex-col rounded-2xl border p-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 ${
                  on ? "border-[#16A34A] bg-[#F0FDF4] shadow-[0_12px_30px_-18px_rgba(22,163,74,0.7)]" : "border-[#E5E7EB] bg-white hover:-translate-y-0.5 hover:border-[#16A34A]/40"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-heading text-[0.95rem] font-bold text-[#1C1C1C]">{o.label}</span>
                  {on && <span className="rounded-full bg-[#16A34A] px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-[#FFFFFF]">Fits</span>}
                </span>
                <span className="mt-1 text-[0.75rem] font-semibold tabular-nums text-[#15803D]">
                  Up to {o.passengers} passengers · {o.luggage} bags
                </span>
                <span className="mt-2 flex-1 text-[0.8rem] leading-relaxed text-[#6B7280]">{o.forWho}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-[0.75rem] font-bold text-[#16A34A]">
                  Details <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
