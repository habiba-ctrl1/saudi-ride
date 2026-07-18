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
}: {
  answer: string;
  facts?: { label: string; value: string }[];
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#C8A45D]/30 bg-[#F4E4BC]/25 p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Zap className="h-4 w-4 text-[#C9A84C]" />
        <span className="text-xs font-semibold uppercase tracking-wide text-[#C9A84C]">
          {label}
        </span>
      </div>
      <p className="text-[15px] sm:text-base leading-relaxed text-[#1C1C1C] font-medium">
        {answer}
      </p>
      {facts && facts.length > 0 && (
        <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {facts.map((f) => (
            <div key={f.label} className="rounded-xl bg-white/70 px-3 py-2 border border-black/5">
              <dt className="text-[11px] uppercase tracking-wide text-[#6B7280]">{f.label}</dt>
              <dd className="text-sm font-semibold text-[#006C35]">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
