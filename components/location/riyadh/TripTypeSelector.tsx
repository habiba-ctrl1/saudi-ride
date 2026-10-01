"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Plane, Hotel, Clock, Briefcase, Route, Landmark, Ticket, Crown, ArrowRight, MessageCircle, Check } from "lucide-react";
import type { TripType, TripIcon } from "@/lib/data/riyadh-cluster";

const ICONS: Record<TripIcon, typeof Plane> = {
  plane: Plane,
  hotel: Hotel,
  clock: Clock,
  briefcase: Briefcase,
  route: Route,
  landmark: Landmark,
  ticket: Ticket,
  crown: Crown,
};

// "What kind of trip?" chooser. Each option is a real tab (arrow-key
// navigable) whose panel answers the question, lists what to send for a
// quote, and links to the page that owns that intent — no dead cards.
export function TripTypeSelector({ trips, whatsappLink }: { trips: TripType[]; whatsappLink: string }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const trip = trips[active];
  const Icon = ICONS[trip.icon];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % trips.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + trips.length) % trips.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = trips.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
      <div role="tablist" aria-label="Choose your trip type" aria-orientation="horizontal" className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2">
        {trips.map((t, i) => {
          const TIcon = ICONS[t.icon];
          const selected = i === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`trip-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`trip-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={`group flex min-h-[88px] flex-col items-start gap-2 rounded-2xl border p-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 ${
                selected
                  ? "border-[#16A34A] bg-[#16A34A] text-[#FFFFFF] shadow-[0_10px_30px_-10px_rgba(22,163,74,0.6)]"
                  : "border-[#E5E7EB] bg-white text-[#1C1C1C] hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:shadow-md"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                  selected ? "bg-white/15 text-[#FACC15]" : "bg-[#F0FDF4] text-[#16A34A] group-hover:bg-[#DCFCE7]"
                }`}
              >
                <TIcon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <span className="text-[0.8rem] font-bold leading-tight">{t.label}</span>
              <span className={`text-[0.7rem] leading-snug ${selected ? "text-white/80" : "text-[#6B7280]"}`}>{t.short}</span>
            </button>
          );
        })}
      </div>

      <div
        id="trip-panel"
        role="tabpanel"
        aria-labelledby={`trip-tab-${trip.id}`}
        aria-live="polite"
        className="relative overflow-hidden rounded-3xl border border-[#16A34A]/15 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] md:p-8"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FACC15]/15 blur-2xl" aria-hidden="true" />
        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#16A34A] text-[#FFFFFF]">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="font-heading text-xl font-bold text-[#1C1C1C]">{trip.label}</h3>
          </div>
          <p className="text-[0.95rem] leading-relaxed text-[#374151]">{trip.answer}</p>

          <p className="mt-6 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#15803D]">Send us for a quote</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {trip.send.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-[#374151]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />
                <span>{s}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={`${whatsappLink}?text=${encodeURIComponent(trip.waPrefill)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#16A34A] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] transition-colors hover:bg-[#15803D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> Quote this trip
            </a>
            <Link
              href={trip.href}
              className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#16A34A]/30 px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#15803D] transition-colors hover:bg-[#F0FDF4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2"
            >
              {trip.linkLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
