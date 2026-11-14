import { Zap } from "lucide-react";

// Above-the-fold "quick answer" box. Gives Google + AI search engines (and
// impatient users) a direct answer in the first screen — strong featured-snippet
// and AI-overview signal. Server component, no client JS.
//
//   <TLDRSummary
//     answer="A taxi from Jeddah Airport to Makkah costs from SAR 250, takes ~1 hour, and is available 24/7."
//     facts={[{ label: "Price", value: "from SAR 250" }, { label: "Time", value: "~1 hour" }]}
//   />
export function TLDRSummary({
  answer,
  facts,
  label = "Quick Answer",
  className = "",
  id = "speakable-summary",
}: {
  answer: string;
  facts?: { label: string; value: string }[];
  label?: string;
  className?: string;
  /** Matches speakableSchema()'s default cssSelector "#speakable-summary" — keep
   *  in sync if a page passes custom cssSelectors to speakableSchema. */
  id?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-[#16A34A]/15 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_40px_-28px_rgba(22,163,74,0.6)] sm:p-7 ${className}`}
    >
      <span aria-hidden className="absolute inset-y-0 start-0 w-1 bg-gradient-to-b from-[#16A34A] to-[#FACC15]" />
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FACC15]/25 text-[#A16207]">
          <Zap className="h-4 w-4" aria-hidden />
        </span>
        <span className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#15803D]">
          {label}
        </span>
      </div>
      <p id={id} className="max-w-[70ch] text-[1rem] font-medium leading-relaxed text-[#1E293B] sm:text-[1.06rem]">
        {answer}
      </p>
      {facts && facts.length > 0 && (
        <dl className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="min-w-0 rounded-2xl border border-[#16A34A]/10 bg-[#F4FAF5] px-3.5 py-3">
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#64748B]">{f.label}</dt>
              <dd className="mt-1 break-words text-sm font-bold text-[#15803D]">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
