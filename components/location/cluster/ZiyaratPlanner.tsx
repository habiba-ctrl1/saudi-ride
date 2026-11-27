"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, MessageCircle, RotateCcw } from "lucide-react";
import { ZIYARAT_STOPS } from "@/lib/data/madinah-cluster";

const HOTEL = { x: 320, y: 200 };
const LOOP = ZIYARAT_STOPS.filter((s) => s.id !== "dhul-hulayfah").sort((a, b) => a.order - b.order);
const MIQAT = ZIYARAT_STOPS.find((s) => s.id === "dhul-hulayfah")!;
const LENGTHS = [
  { id: "half", label: "Half-day" },
  { id: "full", label: "Full-day" },
  { id: "custom", label: "Custom plan" },
] as const;

// Ziyarat stop planner. It is a lead helper, not a booking engine: it stores
// nothing, calculates no fare, and only assembles a structured WhatsApp message
// from the choices. The SVG is an illustrative layout (not a navigation map);
// the buttons below it are the real, keyboard-operable controls. Stop data and
// road distances: lib/data/madinah-cluster.ts (OSRM, 2026-10-09).
export function ZiyaratPlanner({ whatsappLink, formHref = "#quote", defaultStops = [] }: { whatsappLink: string; formHref?: string; defaultStops?: string[] }) {
  const [picked, setPicked] = useState<string[]>(defaultStops);
  const [length, setLength] = useState<(typeof LENGTHS)[number]["id"]>("half");
  const [hotel, setHotel] = useState("");
  const [pax, setPax] = useState("");

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const chosen = LOOP.filter((s) => picked.includes(s.id));
  const path = [HOTEL, ...chosen.map((s) => ({ x: s.x, y: s.y })), HOTEL].map((p) => `${p.x},${p.y}`).join(" ");

  const verdict = useMemo(() => {
    if (chosen.length === 0) return { title: "Choose your stops", body: "Tick the sites you want to visit. The plan shows the order and what to send for a quote." };
    if (chosen.length <= 2) return { title: "One or two stops", body: "A round trip with the car waiting fits well. If you may add stops on the day, book a private driver by the hour instead." };
    return { title: "Three or more stops", body: "One car and driver for a block of hours works best: the car waits at every stop and you can change the order on the day." };
  }, [chosen.length]);

  const lengthLabel = LENGTHS.find((l) => l.id === length)!.label;
  const message = [
    "Salam! Madinah Ziyarat by private car.",
    `• Stops: ${chosen.length ? chosen.map((s) => s.name).join(" → ") : "(to be decided)"}`,
    `• Plan: ${lengthLabel}`,
    `• Pickup hotel: ${hotel || ""}`,
    "• Date & start time: ",
    `• Passengers (elders / children?): ${pax || ""}`,
    "• Vehicle (Sedan / SUV / Van): ",
  ].join("\n");
  const waHref = `${whatsappLink}?text=${encodeURIComponent(message)}`;

  const inputCls = "mt-2 min-h-[44px] w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm font-medium text-[#1C1C1C] placeholder:text-[#9CA3AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]";

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_1fr] lg:gap-8">
      <div className="space-y-6 rounded-3xl border border-[#E5E7EB] bg-white p-5 md:p-7">
        <figure className="overflow-hidden rounded-2xl border border-[#16A34A]/15 bg-gradient-to-br from-[#F0FDF4] to-white">
          <svg viewBox="0 0 640 400" className="h-auto w-full" role="img" aria-label={chosen.length ? `Illustrative Ziyarat route from Masjid an-Nabawi through ${chosen.map((s) => s.name).join(", ")} and back` : "Illustrative layout of Madinah Ziyarat sites around Masjid an-Nabawi"}>
            <defs>
              <pattern id="zp-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M32 0H0V32" fill="none" stroke="#16A34A" strokeOpacity="0.07" />
              </pattern>
            </defs>
            <rect width="640" height="400" fill="url(#zp-grid)" />
            {LOOP.map((s) => (
              <line key={`s-${s.id}`} x1={HOTEL.x} y1={HOTEL.y} x2={s.x} y2={s.y} stroke="#16A34A" strokeOpacity="0.18" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
            ))}
            <line x1={HOTEL.x} y1={HOTEL.y} x2={MIQAT.x} y2={MIQAT.y} stroke="#6B7280" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
            {chosen.length > 0 && <polyline points={path} fill="none" stroke="#FACC15" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />}
            {LOOP.map((s) => {
              const on = picked.includes(s.id);
              const right = s.x > HOTEL.x;
              return (
                <g key={s.id} aria-hidden="true" className="cursor-pointer" onClick={() => toggle(s.id)}>
                  <circle cx={s.x} cy={s.y} r="14" fill={on ? "#16A34A" : "#FFFFFF"} stroke={on ? "#FFFFFF" : "#16A34A"} strokeWidth="3" />
                  {on && <text x={s.x} y={s.y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill="#FFFFFF">{chosen.findIndex((c) => c.id === s.id) + 1}</text>}
                  <text x={s.x + (right ? -20 : 20)} y={s.y + 5} textAnchor={right ? "end" : "start"} fontSize="17" fontWeight="700" fill="#1C1C1C">{s.name.split(" (")[0].replace(" & the Uhud martyrs' cemetery", "")}</text>
                </g>
              );
            })}
            <g aria-hidden="true">
              <circle cx={MIQAT.x} cy={MIQAT.y} r="8" fill="#FFFFFF" stroke="#6B7280" strokeWidth="2.5" />
              <text x={MIQAT.x + 16} y={MIQAT.y + 5} fontSize="14" fontWeight="600" fill="#4B5563">Dhul Hulayfah (Miqat, Makkah road)</text>
            </g>
            <g aria-hidden="true">
              <circle cx={HOTEL.x} cy={HOTEL.y} r="30" fill="#0B1F14" />
              <circle cx={HOTEL.x} cy={HOTEL.y} r="30" fill="none" stroke="#FACC15" strokeWidth="2.5" />
              <text x={HOTEL.x} y={HOTEL.y - 2} textAnchor="middle" fontSize="12" fontWeight="800" fill="#FFFFFF">Masjid an-</text>
              <text x={HOTEL.x} y={HOTEL.y + 11} textAnchor="middle" fontSize="12" fontWeight="800" fill="#FFFFFF">Nabawi</text>
            </g>
          </svg>
          <figcaption className="px-4 pb-3 pt-1 text-center text-[0.75rem] text-[#6B7280]">
            Illustrative route map — not to scale and not for navigation. Locations and travel times are approximate.
          </figcaption>
        </figure>

        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#15803D]">1 · Choose your stops</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {LOOP.map((s) => {
              const on = picked.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(s.id)}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 active:scale-[0.97] ${
                    on ? "border-[#16A34A] bg-[#16A34A] text-[#FFFFFF]" : "border-[#E5E7EB] bg-white text-[#1C1C1C] hover:border-[#16A34A]/50 hover:bg-[#F0FDF4]"
                  }`}
                >
                  {on && <Check className="h-4 w-4" aria-hidden="true" />}
                  {s.name.split(" (")[0].replace(" & the Uhud martyrs' cemetery", "")}
                </button>
              );
            })}
          </div>
          {picked.length > 0 && (
            <button type="button" onClick={() => setPicked([])} className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B7280] hover:text-[#15803D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Clear stops
            </button>
          )}
        </div>

        <fieldset>
          <legend className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#15803D]">2 · How long?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {LENGTHS.map((l) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={length === l.id}
                onClick={() => setLength(l.id)}
                className={`min-h-[44px] rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 ${
                  length === l.id ? "border-[#0B1F14] bg-[#0B1F14] text-[#FFFFFF]" : "border-[#E5E7EB] bg-white text-[#1C1C1C] hover:bg-[#F9FAFB]"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[0.8rem] text-[#6B7280]">
            {length === "half" && "For the main sites at a normal pace."}
            {length === "full" && "For larger groups, elderly passengers, a slower pace, extra stops or a custom order."}
            {length === "custom" && "Tell us what you have in mind and we shape the plan around it."}
          </p>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#15803D]">
            3 · Pickup hotel
            <input value={hotel} onChange={(e) => setHotel(e.target.value)} placeholder="Hotel name" className={inputCls} autoComplete="off" />
          </label>
          <label className="block text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#15803D]">
            Passengers
            <input value={pax} onChange={(e) => setPax(e.target.value)} placeholder="e.g. 4 adults, 1 elderly" className={inputCls} autoComplete="off" />
          </label>
        </div>
      </div>

      <div className="flex flex-col rounded-3xl bg-[#0B1F14] p-6 text-[#FFFFFF] md:p-8" aria-live="polite">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#FACC15]">Your plan</p>
        <h3 className="mt-2 font-heading text-xl font-bold text-[#FFFFFF]">{verdict.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/80">{verdict.body}</p>

        {chosen.length > 0 && (
          <ol className="mt-5 space-y-3 border-t border-white/15 pt-5">
            <li className="text-sm text-white/70">Start: your hotel near Masjid an-Nabawi</li>
            {chosen.map((s, i) => (
              <li key={s.id} className="text-sm">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#FACC15] text-xs font-bold text-[#0B1F14]">{i + 1}</span>
                <span className="font-semibold text-[#FFFFFF]">{s.name}</span>
                <span className="block pl-8 text-[0.8rem] text-white/65">About {s.km} km by road from Masjid an-Nabawi (~{s.min} min without traffic). {s.about}</span>
                <span className="block pl-8 text-[0.8rem] text-white/65">{s.transport}</span>
              </li>
            ))}
            <li className="text-sm text-white/70">Finish: back to your hotel</li>
          </ol>
        )}

        <p className="mt-5 rounded-xl bg-white/5 p-3 text-[0.8rem] leading-relaxed text-white/75">
          Dhul Hulayfah (Abyar Ali) is on the Makkah road, about {MIQAT.km} km from Masjid an-Nabawi. Ask for it on a{" "}
          <Link href="/routes/madinah-to-makkah" className="font-semibold text-[#FACC15] underline-offset-2 hover:underline">Madinah to Makkah transfer</Link>.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-6 text-sm font-bold uppercase tracking-wider text-[#0B1F14] hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> Plan My Ziyarat
          </a>
          <a href={formHref} className="inline-flex min-h-[44px] items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FACC15] hover:text-[#FDE047]">
            Or use the quote form <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <p className="mt-4 text-[0.75rem] leading-relaxed text-white/60">No price is shown here: we confirm the vehicle and one fixed fare on WhatsApp before booking. Transport only — no guide or religious guidance.</p>
      </div>
    </div>
  );
}
