"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, MessageCircle, RotateCcw } from "lucide-react";
import { PLANNER_STOPS, PLANNER_STARTS, PLANNER_ENDS } from "@/lib/data/alula-cluster";

const GROUPS = ["Heritage", "Architecture & culture", "Nature"] as const;

// Multi-stop planner. It is a lead-generation helper, not a booking engine:
// it submits nothing, only assembles a WhatsApp message from the choices and
// says honestly whether a private driver or a single transfer fits.
export function JourneyPlanner({ whatsappLink }: { whatsappLink: string }) {
  const [start, setStart] = useState(PLANNER_STARTS[0]);
  const [end, setEnd] = useState(PLANNER_ENDS[0]);
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const chosen = PLANNER_STOPS.filter((s) => picked.includes(s.id));
  const guided = chosen.filter((s) => ["hegra", "dadan", "jabal-ikmah", "sharaan"].includes(s.id));

  const verdict = useMemo(() => {
    if (chosen.length === 0) return { title: "Choose your stops", body: "Tick the places you want to see and the planner suggests the right kind of booking.", href: "", cta: "" };
    if (chosen.length <= 2)
      return { title: "One or two stops: transfers may be enough", body: "A single round trip with the car waiting, or separate transfers, usually fits. If the plan is likely to change, a private driver is more relaxed.", href: "/locations/alula/private-driver", cta: "Compare with a private driver" };
    return { title: "Three or more stops: book a private driver", body: "One car and driver for the day waits at every stop, carries your bags and lets you change the order. This is the case private-driver hire is built for.", href: "/locations/alula/private-driver", cta: "How private drivers work in AlUla" };
  }, [chosen.length]);

  const message = [
    "Salam! AlUla sightseeing day by car.",
    `• Start: ${start}`,
    `• Stops: ${chosen.length ? chosen.map((s) => s.name).join(" → ") : "(to be decided)"}`,
    `• Finish: ${end}`,
    "• Date & start time: ",
    "• Passengers: ",
    "• Vehicle (Executive sedan / SUV / Van): ",
  ].join("\n");

  const selectCls = "min-h-[44px] w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm font-medium text-[#1C1C1C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]";

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_1fr] lg:gap-8">
      <div className="space-y-6 rounded-3xl border border-[#E5E7EB] bg-white p-5 md:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#15803D]">
            1 · Start
            <select value={start} onChange={(e) => setStart(e.target.value)} className={`mt-2 ${selectCls}`}>
              {PLANNER_STARTS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="block text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#15803D]">
            3 · Finish
            <select value={end} onChange={(e) => setEnd(e.target.value)} className={`mt-2 ${selectCls}`}>
              {PLANNER_ENDS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
        </div>

        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#15803D]">2 · Add stops</p>
          <div className="mt-3 space-y-5">
            {GROUPS.map((g) => (
              <fieldset key={g}>
                <legend className="mb-2 text-sm font-semibold text-[#1C1C1C]">{g}</legend>
                <div className="flex flex-wrap gap-2">
                  {PLANNER_STOPS.filter((s) => s.group === g).map((s) => {
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
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        </div>
        {picked.length > 0 && (
          <button type="button" onClick={() => setPicked([])} className="inline-flex min-h-[44px] items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B7280] hover:text-[#15803D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Clear stops
          </button>
        )}
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-[#0B1F14] p-6 text-[#FFFFFF] md:p-7" aria-live="polite">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#FACC15]">Your day</p>
        <ol className="mt-4 space-y-0">
          {[start, ...chosen.map((s) => s.name), end].map((label, i, arr) => (
            <li key={`${label}-${i}`} className="relative flex gap-3 pb-4 last:pb-0">
              {i < arr.length - 1 && <span aria-hidden="true" className="absolute left-[7px] top-4 h-full w-px bg-white/20" />}
              <span className={`relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${i === 0 || i === arr.length - 1 ? "border-[#FACC15] bg-[#FACC15]" : "border-[#16A34A] bg-[#0B1F14]"}`} />
              <span className="text-sm font-semibold">{label}</span>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-2xl bg-white/10 p-4">
          <p className="font-heading text-base font-bold">{verdict.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-white/80">{verdict.body}</p>
          {verdict.href && (
            <Link href={verdict.href} className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FACC15] hover:text-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]">
              {verdict.cta} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>

        {guided.length > 0 && (
          <p className="mt-4 text-xs leading-relaxed text-white/70">
            {guided.map((g) => g.name).join(", ")} {guided.length > 1 ? "are" : "is"} visited through Experience AlUla experiences. Book those first; we plan the drive times around your slots. We provide transport only.
          </p>
        )}

        <a
          href={`${whatsappLink}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#FACC15] px-6 text-sm font-bold uppercase tracking-wider text-[#0B1F14] transition-colors hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> Send this plan for a quote
        </a>
        <p className="mt-3 text-center text-[0.7rem] text-white/50">A planning aid — nothing is booked until we confirm the fare.</p>
      </div>
    </div>
  );
}
