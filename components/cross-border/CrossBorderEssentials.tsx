import { FileCheck2, ListOrdered, Scale } from "lucide-react";
import { CROSS_BORDER_DOCUMENTS, CROSS_BORDER_STEPS, CROSS_BORDER_FARE_FACTORS } from "@/lib/data/cross-border";

// Documents checklist + booking steps + what decides the fare. Shared across
// corridor hubs and the services hub; every line is hedged (see data file).
export function CrossBorderEssentials({ showFareFactors = true }: { showFareFactors?: boolean }) {
  return (
    <section aria-label="Documents and booking" className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 sm:p-7">
        <h2 className="font-heading flex items-center gap-2 text-xl font-bold text-[#1C1C1C]">
          <FileCheck2 className="h-5 w-5 text-[#16A34A]" aria-hidden /> What passengers need at the border
        </h2>
        <ul className="mt-4 space-y-3">
          {CROSS_BORDER_DOCUMENTS.map((d) => (
            <li key={d} className="flex gap-2.5 text-sm leading-relaxed text-[#475569]">
              <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#16A34A]" />
              {d}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 sm:p-7">
        <h2 className="font-heading flex items-center gap-2 text-xl font-bold text-[#1C1C1C]">
          <ListOrdered className="h-5 w-5 text-[#16A34A]" aria-hidden /> How booking works
        </h2>
        <ol className="mt-4 space-y-3">
          {CROSS_BORDER_STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F0FDF4] text-xs font-bold text-[#15803D]">{i + 1}</span>
              <p className="text-sm leading-relaxed text-[#475569]">
                <span className="font-semibold text-[#1C1C1C]">{s.title}.</span> {s.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {showFareFactors && (
        <div className="rounded-3xl border border-[#FACC15]/40 bg-[#FEFCE8] p-6 sm:p-7 lg:col-span-2">
          <h2 className="font-heading flex items-center gap-2 text-xl font-bold text-[#1C1C1C]">
            <Scale className="h-5 w-5 text-[#A16207]" aria-hidden /> What decides a cross-border fare
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#475569]">
            Cross-border trips are quoted individually — there is no meter and no surge. You receive one fixed fare in writing before you book, with border crossing fees for the vehicle included. It is based on:
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {CROSS_BORDER_FARE_FACTORS.map((f) => (
              <li key={f} className="rounded-xl bg-white/70 px-3 py-2 text-sm font-medium text-[#1C1C1C]">{f}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
