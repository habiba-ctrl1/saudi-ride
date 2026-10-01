import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface TransferDestination {
  label: string;
  km: number;
  duration: string;
  href: string;
}

interface CityTransferNetworkProps {
  cityName: string;
  destinations: TransferDestination[];
}

// Compact "hub and spoke" visual summary of the real distances/times already
// sourced from lib/data/routes.ts (the single source of truth per CLAUDE.md
// internal-linking rules) — gives a spatial overview above the detailed
// route-ladder list further down the page, rather than repeating it.
export function CityTransferNetwork({ cityName, destinations }: CityTransferNetworkProps) {
  return (
    <div className="rounded-3xl border border-[#16A34A]/12 bg-white p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="rounded-full bg-[#16A34A] text-white font-bold text-xs px-4 py-2 uppercase tracking-wide">
          {cityName}
        </span>
        <span className="text-[0.65rem] uppercase tracking-wider text-[#6B7280]">
          Transfer network at a glance
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {destinations.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="group flex flex-col rounded-2xl border border-[#16A34A]/10 p-4 hover:border-[#16A34A]/35 transition-colors"
          >
            <span className="text-sm font-bold text-[#1C1C1C]">{d.label}</span>
            <span className="text-[0.7rem] text-[#6B7280] mt-1">
              {d.km} km · ~{d.duration}
            </span>
            <span className="mt-3 text-[0.65rem] font-bold text-[#16A34A] inline-flex items-center gap-1">
              View route <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
