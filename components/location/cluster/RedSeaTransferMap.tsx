"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Plane } from "lucide-react";
import {
  RSI_TRANSFER_RATES, rsiWhatsApp, sar, type RsiDestination,
} from "@/lib/data/red-sea-cluster";
import { TransferBadges } from "./RedSeaVisuals";

// Schematic (not geographic) destination map for the RSI hub. Markers are real
// buttons (keyboard + touch), mobile falls back to a vertical list, and the
// detail card is plain crawlable HTML. Destinations without their own URL show a
// card instead of a link — no URLs are created for map markers.

const AIRPORT = { x: 50, y: 50 };
const TURTLE = { x: 66, y: 34 };
const SHURA = { x: 60, y: 62 };

function legsFor(d: RsiDestination): { from: { x: number; y: number }; to: { x: number; y: number }; kind: "road" | "marine" | "shuttle" }[] {
  const p = d.map;
  if (d.key === "turtle-bay" || d.key === "shura-island") return [{ from: AIRPORT, to: p, kind: "road" }];
  if (d.group === "island") return [{ from: AIRPORT, to: TURTLE, kind: "road" }, { from: TURTLE, to: p, kind: "marine" }];
  if (d.group === "shura") return [{ from: AIRPORT, to: SHURA, kind: "road" }, { from: SHURA, to: p, kind: "shuttle" }];
  return [{ from: AIRPORT, to: p, kind: "road" }];
}
const STROKE = { road: "#16A34A", marine: "#06B6D4", shuttle: "#EAB308" } as const;

export default function RedSeaTransferMap({ destinations }: { destinations: RsiDestination[] }) {
  const [activeKey, setActiveKey] = useState(destinations[0].key);
  const active = destinations.find((d) => d.key === activeKey) ?? destinations[0];
  const legs = legsFor(active);
  const rate = active.rateKey ? RSI_TRANSFER_RATES[active.rateKey] : null;

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <div className="lg:col-span-3">
        {/* md+ : schematic map */}
        <div className="relative hidden aspect-[4/3] overflow-hidden rounded-3xl border border-[#0E7490]/20 bg-[#F5E6C8] md:block">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden role="presentation">
            <defs>
              <linearGradient id="rsm-sea" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5EEAD4" /><stop offset="1" stopColor="#0E7490" /></linearGradient>
            </defs>
            <path d="M54 0 C46 18 62 28 52 46 C44 60 56 72 50 100 H100 V0 Z" fill="url(#rsm-sea)" />
            <path d="M54 0 C46 18 62 28 52 46 C44 60 56 72 50 100" fill="none" stroke="#FFFFFF" strokeOpacity=".6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            {/* all routes faint */}
            {destinations.flatMap((d) => legsFor(d).map((l, i) => (
              <line key={`${d.key}-${i}`} x1={l.from.x} y1={l.from.y} x2={l.to.x} y2={l.to.y} stroke={STROKE[l.kind]} strokeOpacity=".22" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeDasharray={l.kind === "road" ? undefined : "5 5"} />
            )))}
            {/* active route */}
            <g key={active.key} className="rs-leg">
              {legs.map((l, i) => (
                <line key={i} x1={l.from.x} y1={l.from.y} x2={l.to.x} y2={l.to.y} stroke={STROKE[l.kind]} strokeWidth="3.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" strokeDasharray={l.kind === "road" ? undefined : "8 7"} />
              ))}
            </g>
          </svg>

          {/* Airport marker */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${AIRPORT.x}%`, top: `${AIRPORT.y}%` }}>
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#0F172A] text-[#FFFFFF] shadow-lg ring-4 ring-[#FFFFFF]/70">
              <span aria-hidden className="rs-pulse absolute inset-0 rounded-full bg-[#FACC15]/60" />
              <Plane aria-hidden className="relative h-5 w-5" />
            </span>
            <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#0F172A] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-[#FFFFFF]">RSI · Red Sea Airport</span>
          </div>

          {/* Turtle Bay waypoint for island routes (only visible when relevant) */}
          {(active.group === "island") && (
            <span className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#06B6D4] ring-2 ring-[#FFFFFF]" style={{ left: `${TURTLE.x}%`, top: `${TURTLE.y}%` }} aria-hidden />
          )}

          {destinations.map((d) => {
            const on = d.key === active.key;
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => setActiveKey(d.key)}
                aria-pressed={on}
                className={`absolute inline-flex min-h-[32px] -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.68rem] font-bold shadow-md transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A] ${
                  on ? "z-10 scale-110 bg-[#16A34A] text-[#FFFFFF]" : "bg-[#FFFFFF] text-[#0F172A] hover:bg-[#F0FDF4]"
                }`}
                style={{ left: `${d.map.x}%`, top: `${d.map.y}%` }}
              >
                <span aria-hidden className={`h-2 w-2 rounded-full ${on ? "bg-[#FACC15]" : "bg-[#16A34A]"}`} />
                {d.short ?? d.name}
              </button>
            );
          })}
          <p className="absolute bottom-2 start-3 rounded bg-[#FFFFFF]/80 px-2 py-0.5 text-[0.62rem] text-[#475569]">Schematic, not to scale. Green: road. Cyan dashed: boat or seaplane. Yellow dashed: property electric transfer.</p>
        </div>

        {/* <md : vertical list */}
        <ul className="space-y-2 md:hidden" aria-label="Red Sea destinations from RSI">
          {destinations.map((d) => {
            const on = d.key === active.key;
            return (
              <li key={d.key}>
                <button
                  type="button"
                  onClick={() => setActiveKey(d.key)}
                  aria-pressed={on}
                  className={`flex min-h-[48px] w-full items-center justify-between gap-3 rounded-2xl border px-4 py-2.5 text-start ${on ? "border-[#16A34A] bg-[#F0FDF4]" : "border-[#0E7490]/15 bg-white"}`}
                >
                  <span className="text-sm font-bold text-[#0F172A]">{d.name}</span>
                  <TransferBadges badges={d.badges.slice(0, 1)} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Detail card (shared) */}
      <div className="lg:col-span-2" aria-live="polite">
        <div className="rounded-3xl border border-[#0E7490]/15 bg-white p-5 sm:p-6">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#0E7490]">Private transfer from RSI</p>
          <h3 className="font-heading mt-1 text-xl font-bold text-[#0F172A]">{active.name}</h3>
          <TransferBadges badges={active.badges} className="mt-3" />
          <p className="mt-3 text-sm leading-relaxed text-[#475569]">{active.summary}</p>
          {active.time && <p className="mt-2 text-sm text-[#475569]"><strong className="text-[#0F172A]">Journey time:</strong> {active.time}</p>}
          <p className="mt-3 text-sm text-[#0F172A]">
            {rate ? (
              <>Sedan <strong>{sar(rate.sedan)}</strong> · SUV <strong>{sar(rate.suv)}</strong> <span className="text-xs text-[#64748B]">(indicative, land transfer)</span></>
            ) : (
              <strong>Fare confirmed on WhatsApp</strong>
            )}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col">
            <a href={rsiWhatsApp(active.name)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <MessageCircle aria-hidden className="h-4 w-4" /> Get Quote: RSI → {active.name}
            </a>
            {(active.href || active.anchorHref) && (
              <Link href={active.href ?? active.anchorHref!} className="btn btn-secondary">
                {active.href ? `View ${active.name} transfer` : "See resort transfers"} <ArrowRight aria-hidden className="h-4 w-4 rtl:rotate-180" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
