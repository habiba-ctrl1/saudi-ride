"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";

type Answer = "yes" | "no" | null;

const QUESTIONS = [
  { id: "recurring", q: "Is this for a company, recurring or for several people over days?" },
  { id: "stops", q: "Will you have three or more stops, or need the car to wait?" },
] as const;

const resultsFor = (city: string, transferHref?: string) => ({
  transfer: {
    title: "A single private transfer",
    body: "One pickup, one drop-off, a fixed fare. Right for airport runs, hotel moves and point-to-point trips.",
    href: transferHref ?? `/locations/${city}/hotel-transfer`,
    cta: "Plan a transfer",
  },
  hourly: {
    title: "A private driver by the hour",
    body: "The same car and driver stay with you and wait between stops — better value once a day has three or more stops.",
    href: `/locations/${city}/private-driver`,
    cta: "See hourly hire",
  },
  corporate: {
    title: "A corporate arrangement",
    body: "One point of contact, a written quote by email, vehicles sized to the group, and invoicing through our sister company.",
    href: "/services/corporate",
    cta: "Corporate transportation",
  },
});

// Two-question decision helper. Deterministic, submits nothing; the static
// comparison table that follows it on the page carries the same logic as
// plain text for readers and crawlers.
export function TripDecision({ city = "riyadh", transferHref }: { city?: string; transferHref?: string }) {
  const RESULTS = resultsFor(city, transferHref);
  const [answers, setAnswers] = useState<Record<string, Answer>>({ recurring: null, stops: null });
  const result =
    answers.recurring === "yes" ? RESULTS.corporate : answers.stops === "yes" ? RESULTS.hourly : answers.stops === "no" ? RESULTS.transfer : null;

  return (
    <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-5 md:p-7">
      <div className="space-y-5">
        {QUESTIONS.map((item, idx) => {
          const disabled = idx === 1 && answers.recurring === "yes";
          return (
            <fieldset key={item.id} disabled={disabled} className={disabled ? "opacity-40" : ""}>
              <legend className="mb-2.5 text-sm font-semibold text-[#1C1C1C]">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F0FDF4] text-[0.7rem] font-bold text-[#15803D]">{idx + 1}</span>
                {item.q}
              </legend>
              <div className="flex gap-2">
                {(["yes", "no"] as const).map((v) => {
                  const on = answers[item.id] === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setAnswers((a) => ({ ...a, [item.id]: v }))}
                      className={`min-h-[44px] min-w-[84px] rounded-full border px-5 text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 ${
                        on ? "border-[#16A34A] bg-[#16A34A] text-[#FFFFFF]" : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[#16A34A]/40"
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-6">
        {result ? (
          <div className="rounded-2xl border border-[#16A34A]/25 bg-[#F0FDF4] p-5">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#15803D]">Our suggestion</p>
            <p className="mt-1 font-heading text-lg font-bold text-[#1C1C1C]">{result.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-[#374151]">{result.body}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href={result.href} className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#16A34A] px-5 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-[#15803D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2">
                {result.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <button type="button" onClick={() => setAnswers({ recurring: null, stops: null })} className="inline-flex min-h-[44px] items-center gap-1.5 px-2 text-xs font-semibold text-[#6B7280] hover:text-[#1C1C1C]">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Start again
              </button>
            </div>
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-[#D1D5DB] p-5 text-sm text-[#6B7280]">Answer the questions to see which booking fits your trip.</p>
        )}
      </div>
    </div>
  );
}
