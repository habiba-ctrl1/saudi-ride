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

// Hub-and-spoke visual summary of the real distances/times already sourced
// from lib/data/routes.ts (the single source of truth per CLAUDE.md
// internal-linking rules). Desktop: horizontal network with a connecting
// line. Mobile: vertical stack with a left spine — never a plain text list.
export function CityTransferNetwork({ cityName, destinations }: CityTransferNetworkProps) {
  return (
    <div className="rounded-3xl border border-[#16A34A]/12 bg-white p-6 md:p-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-[0.65rem] uppercase tracking-wider text-[#6B7280]">Transfer network at a glance</span>
      </div>

      {/* Mobile: vertical stack with a left spine running through the hub + spokes */}
      <div className="relative sm:hidden mt-4 ps-6">
        <div className="absolute start-[11px] top-2 bottom-2 w-px bg-[#16A34A]/20" />
        <div className="relative flex items-center gap-3 pb-5">
          <span className="absolute -start-6 flex h-6 w-6 items-center justify-center rounded-full bg-[#16A34A] ring-4 ring-white" />
          <span className="rounded-full bg-[#16A34A] text-white font-bold text-xs px-4 py-2 uppercase tracking-wide">{cityName}</span>
        </div>
        {destinations.map((d) => (
          <Link key={d.href} href={d.href} className="group relative flex items-center justify-between gap-3 pb-5 last:pb-0">
            <span className="absolute -start-6 flex h-3 w-3 items-center justify-center rounded-full border-2 border-[#16A34A] bg-white" />
            <span>
              <span className="block text-sm font-bold text-[#1C1C1C] group-hover:text-[#16A34A]">{d.label}</span>
              <span className="block text-[0.7rem] text-[#6B7280]">{d.km} km · ~{d.duration}</span>
            </span>
            <ArrowRight className="h-4 w-4 text-[#16A34A] shrink-0" />
          </Link>
        ))}
      </div>

      {/* Desktop: hub on the left, horizontal connector line into the spokes */}
      <div className="hidden sm:flex items-center gap-0 mt-4">
        <span className="shrink-0 rounded-full bg-[#16A34A] text-white font-bold text-xs px-5 py-3 uppercase tracking-wide shadow-[0_4px_16px_rgba(22,163,74,0.25)]">
          {cityName}
        </span>
        <span className="h-px flex-1 max-w-10 bg-[#16A34A]/25" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-1">
          {destinations.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="group relative flex flex-col rounded-2xl border border-[#16A34A]/10 p-4 hover:border-[#16A34A]/35 hover:shadow-md transition-all"
            >
              <span className="absolute -top-[21px] start-1/2 -translate-x-1/2 h-3 w-3 rounded-full border-2 border-[#16A34A] bg-white hidden md:block" />
              <span className="text-sm font-bold text-[#1C1C1C]">{d.label}</span>
              <span className="text-[0.7rem] text-[#6B7280] mt-1">{d.km} km · ~{d.duration}</span>
              <span className="mt-3 text-[0.65rem] font-bold text-[#16A34A] inline-flex items-center gap-1">
                View route <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
