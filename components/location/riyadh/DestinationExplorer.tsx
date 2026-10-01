"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Ruler, ArrowLeftRight } from "lucide-react";

export interface ExplorerItem {
  slug: string;
  name: string;
  purpose: string;
  km: number;
  time: string;
  distanceSlug: string | null;
  reverseSlug: string | null;
}

export interface ExplorerGroup {
  id: string;
  label: string;
  intro: string;
  items: ExplorerItem[];
}

// Destination "ladder" — every corridor out of Riyadh, ordered by distance,
// with a bar scaled to the longest trip in the group. All numbers arrive as
// props computed server-side from ROUTES_DATA (single source of truth).
export function DestinationExplorer({ groups }: { groups: ExplorerGroup[] }) {
  const [active, setActive] = useState(groups[0]?.id);
  const group = groups.find((g) => g.id === active) ?? groups[0];

  return (
    <div>
      <div role="tablist" aria-label="Destination type" className="mb-6 flex flex-wrap gap-2">
        {groups.map((g) => {
          const on = g.id === group.id;
          return (
            <button
              key={g.id}
              role="tab"
              aria-selected={on}
              aria-controls={`dest-panel-${g.id}`}
              id={`dest-tab-${g.id}`}
              onClick={() => setActive(g.id)}
              className={`min-h-[44px] rounded-full border px-4 text-xs sm:px-5 font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 ${
                on ? "border-[#1C1C1C] bg-[#1C1C1C] text-[#FFFFFF]" : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[#16A34A]/40"
              }`}
            >
              {g.label} <span className={on ? "text-[#FACC15]" : "text-[#9CA3AF]"}>· {g.items.length}</span>
            </button>
          );
        })}
      </div>

      {/* Every panel is rendered (inactive ones `hidden`) so all route links
          stay in the server HTML for crawlers, not just the active tab. */}
      {groups.map((g) => {
        const max = Math.max(...g.items.map((i) => i.km));
        return (
      <div key={g.id} id={`dest-panel-${g.id}`} role="tabpanel" aria-labelledby={`dest-tab-${g.id}`} hidden={g.id !== group.id}>
        <p className="mb-5 max-w-2xl text-sm leading-relaxed text-[#6B7280]">{g.intro}</p>
        <ul className="grid gap-2.5">
          {g.items.map((d) => (
            <li key={d.slug} className="group relative rounded-2xl border border-[#E5E7EB] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:shadow-[0_12px_30px_-18px_rgba(15,23,42,0.4)] focus-within:border-[#16A34A]">
              <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2.5 p-4 sm:flex sm:gap-5">
                <div className="min-w-0 sm:w-56">
                  <Link href={`/routes/${d.slug}`} className="font-heading text-base font-bold text-[#1C1C1C] after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
                    Riyadh → {d.name}
                  </Link>
                  <p className="text-[0.75rem] text-[#6B7280]">{d.purpose}</p>
                </div>
                <span className="text-right text-[0.8rem] font-semibold tabular-nums text-[#1C1C1C] sm:order-2 sm:w-28 sm:shrink-0">
                  {d.km.toLocaleString("en-US")} km
                  <span className="block text-[0.7rem] font-normal text-[#6B7280]">{d.time}</span>
                </span>
                <div className="col-span-2 h-1.5 overflow-hidden rounded-full bg-[#F3F4F6] sm:order-1 sm:h-2 sm:flex-1" aria-hidden="true">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#16A34A] to-[#FACC15] transition-all duration-500" style={{ width: `${Math.max(6, (d.km / max) * 100)}%` }} />
                </div>
                {(d.distanceSlug || d.reverseSlug) && (
                <div className="relative z-10 col-span-2 flex flex-wrap items-center gap-2 sm:order-3 sm:justify-end">
                  {d.distanceSlug && (
                    <Link href={`/distance/${d.distanceSlug}`} className="inline-flex min-h-[32px] items-center gap-1 rounded-full bg-[#F0FDF4] px-3 text-[0.7rem] font-semibold text-[#15803D] hover:bg-[#DCFCE7]">
                      <Ruler className="h-3 w-3" aria-hidden="true" /> Distance guide
                    </Link>
                  )}
                  {d.reverseSlug && (
                    <Link href={`/routes/${d.reverseSlug}`} className="inline-flex min-h-[32px] items-center gap-1 rounded-full bg-[#F9FAFB] px-3 text-[0.7rem] font-semibold text-[#374151] hover:bg-[#F3F4F6]">
                      <ArrowLeftRight className="h-3 w-3" aria-hidden="true" /> Return trip
                    </Link>
                  )}
                </div>
                )}
                <ArrowRight className="hidden h-4 w-4 shrink-0 text-[#16A34A] transition-transform group-hover:translate-x-1 sm:order-4 sm:block" aria-hidden="true" />
              </div>
            </li>
          ))}
        </ul>
      </div>
        );
      })}
    </div>
  );
}
