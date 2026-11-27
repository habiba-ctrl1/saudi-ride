"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface VehicleRecommenderOption {
  category: "sedan" | "suv" | "van";
  name: string;
  href: string;
}

interface VehicleRecommenderProps {
  options: VehicleRecommenderOption[];
}

const PASSENGER_OPTIONS = ["1", "2", "3", "4", "5+"] as const;
const LUGGAGE_OPTIONS = ["Light", "Normal", "Heavy"] as const;

// Deterministic only — no fake intelligence. Does not submit anything; the
// user still goes through the real quote form / WhatsApp flow if they
// proceed. Recommendation logic:
//  - 5+ passengers -> van
//  - 4 passengers, or heavy luggage with 1-4 passengers -> SUV
//  - 1-3 passengers with light/normal luggage -> sedan
function recommend(passengers: string, luggage: string): "sedan" | "suv" | "van" {
  if (passengers === "5+") return "van";
  if (passengers === "4" || luggage === "Heavy") return "suv";
  return "sedan";
}

export function VehicleRecommender({ options }: VehicleRecommenderProps) {
  const [passengers, setPassengers] = useState<string | null>(null);
  const [luggage, setLuggage] = useState<string | null>(null);

  const result = passengers && luggage ? options.find((o) => o.category === recommend(passengers, luggage)) : null;

  return (
    <div className="rounded-3xl border border-[#16A34A]/12 bg-[#FAFAF7] p-6 md:p-8">
      <h3 className="font-heading text-lg font-bold mb-4">Not sure which vehicle you need?</h3>

      <div className="mb-5">
        <span className="block text-[0.7rem] font-bold uppercase tracking-wide text-[#6B7280] mb-2">Passengers</span>
        <div className="flex gap-2">
          {PASSENGER_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPassengers(p)}
              aria-pressed={passengers === p}
              className="rounded-full px-4 py-2 text-xs font-bold transition-all"
              style={{
                border: passengers === p ? "1.5px solid #16A34A" : "1.5px solid rgba(22,163,74,0.2)",
                backgroundColor: passengers === p ? "#16A34A" : "#FFFFFF",
                color: passengers === p ? "#FFFFFF" : "#15803D",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <span className="block text-[0.7rem] font-bold uppercase tracking-wide text-[#6B7280] mb-2">Luggage</span>
        <div className="flex gap-2">
          {LUGGAGE_OPTIONS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLuggage(l)}
              aria-pressed={luggage === l}
              className="rounded-full px-4 py-2 text-xs font-bold transition-all"
              style={{
                border: luggage === l ? "1.5px solid #16A34A" : "1.5px solid rgba(22,163,74,0.2)",
                backgroundColor: luggage === l ? "#16A34A" : "#FFFFFF",
                color: luggage === l ? "#FFFFFF" : "#15803D",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#16A34A]/25 bg-white px-5 py-4">
          <div>
            <span className="block text-[0.65rem] uppercase tracking-wide text-[#6B7280]">Recommended</span>
            <span className="block text-sm font-bold text-[#1C1C1C]">{result.name}</span>
          </div>
          <Link
            href={result.href}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#16A34A] px-4 py-2 text-xs font-bold text-white hover:bg-[#15803D] transition-colors shrink-0"
          >
            View <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
