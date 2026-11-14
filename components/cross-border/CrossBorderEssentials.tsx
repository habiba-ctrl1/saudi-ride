import { FileCheck2, ListOrdered, Scale } from "lucide-react";
import { CROSS_BORDER_DOCUMENTS, CROSS_BORDER_STEPS, CROSS_BORDER_FARE_FACTORS } from "@/lib/data/cross-border";
import { AR_DOCUMENTS, AR_STEPS, AR_FARE_FACTORS } from "@/lib/data/cross-border-ar";

const T = {
  en: { docs: "What passengers need at the border", how: "How booking works", fare: "What decides a cross-border fare", fareP: "Cross-border trips are quoted individually — there is no meter and no surge. You receive one fixed fare in writing before you book, with border crossing fees for the vehicle included. It is based on:" },
  ar: { docs: "ما يحتاجه الركاب عند الحدود", how: "كيف يتم الحجز", fare: "ما الذي يحدد سعر الرحلة عبر الحدود", fareP: "نسعّر كل رحلة عبر الحدود على حدة — بلا عداد وبلا زيادة. تحصل على سعر ثابت مكتوب قبل الحجز يشمل رسوم عبور السيارة، ويعتمد على:" },
};

// Documents checklist + booking steps + what decides the fare. Shared across
// corridor hubs and the services hub; every line is hedged (see data file).
export function CrossBorderEssentials({ showFareFactors = true, locale = "en" }: { showFareFactors?: boolean; locale?: "en" | "ar" }) {
  const t = T[locale];
  const DOCS = locale === "ar" ? AR_DOCUMENTS : CROSS_BORDER_DOCUMENTS;
  const STEPS = locale === "ar" ? AR_STEPS : CROSS_BORDER_STEPS;
  const FACTORS = locale === "ar" ? AR_FARE_FACTORS : CROSS_BORDER_FARE_FACTORS;
  return (
    <section aria-label="Documents and booking" className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 sm:p-7">
        <h2 className="font-heading flex items-center gap-2 text-xl font-bold text-[#1C1C1C]">
          <FileCheck2 className="h-5 w-5 text-[#16A34A]" aria-hidden /> {t.docs}
        </h2>
        <ul className="mt-4 space-y-3">
          {DOCS.map((d) => (
            <li key={d} className="flex gap-2.5 text-sm leading-relaxed text-[#475569]">
              <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#16A34A]" />
              {d}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 sm:p-7">
        <h2 className="font-heading flex items-center gap-2 text-xl font-bold text-[#1C1C1C]">
          <ListOrdered className="h-5 w-5 text-[#16A34A]" aria-hidden /> {t.how}
        </h2>
        <ol className="mt-4 space-y-3">
          {STEPS.map((s, i) => (
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
            <Scale className="h-5 w-5 text-[#A16207]" aria-hidden /> {t.fare}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#475569]">
            {t.fareP}
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {FACTORS.map((f) => (
              <li key={f} className="rounded-xl bg-white/70 px-3 py-2 text-sm font-medium text-[#1C1C1C]">{f}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
