import type { LucideIcon } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

export interface ProcessStep {
  title: string;
  desc: string;
  icon?: LucideIcon;
}

/**
 * Numbered "how it works" journey — icon nodes on a connecting rail.
 *
 * Desktop: horizontal; each node sits on a single rail that fills with brand
 * colour from start to end as the band enters view (CSS, reduced-motion safe).
 * Mobile: vertical rail on the inline-start edge with the copy beside it.
 * Distinct from <TransferJourneySteps> (the location-page journey graphic) —
 * this is the generic booking/process explainer any page type can drop in.
 */
export function ProcessTimeline({
  heading,
  intro,
  steps,
  tone = "onLight",
}: {
  heading?: string;
  intro?: string;
  steps: ProcessStep[];
  tone?: "onLight" | "onDark";
}) {
  const onDark = tone === "onDark";
  const cols =
    steps.length >= 5 ? "lg:grid-cols-5" : steps.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";

  return (
    <div className={onDark ? "on-dark" : ""}>
      {heading && (
        <Reveal className="section-head mb-10 md:mb-14">
          <h2 className={`t-h2 ${onDark ? "!text-[#FFFFFF]" : ""}`}>{heading}</h2>
          {intro && <p className={`t-lead ${onDark ? "!text-white/75" : ""}`}>{intro}</p>}
        </Reveal>
      )}

      <div className="tsa-steps relative">
        {/* Desktop rail: track + animated fill */}
        <div aria-hidden className="absolute inset-x-[calc(100%/var(--n)/2)] top-7 hidden h-[3px] rounded-full lg:block" style={{ ["--n" as string]: steps.length, background: onDark ? "rgba(255,255,255,0.15)" : "rgba(22,163,74,0.14)" }}>
          <div className="tsa-steps-fill h-full rounded-full bg-gradient-to-r from-[#16A34A] to-[#FACC15] rtl:bg-gradient-to-l" />
        </div>

        <RevealGroup className={`relative grid grid-cols-1 gap-0 lg:gap-6 ${cols}`}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            const last = i === steps.length - 1;
            return (
              <RevealItem key={i} className="relative flex gap-5 pb-8 last:pb-0 lg:flex-col lg:items-center lg:gap-5 lg:pb-0 lg:text-center">
                {/* Mobile rail segment */}
                {!last && (
                  <span aria-hidden className={`absolute start-7 top-14 bottom-0 w-[2px] -translate-x-1/2 rtl:translate-x-1/2 lg:hidden ${onDark ? "bg-white/15" : "bg-[#16A34A]/20"}`} />
                )}
                <span
                  className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-[0_8px_20px_-6px_rgba(22,163,74,0.45)] ring-4 ${
                    onDark ? "bg-[#FACC15] text-[#14532D] ring-[#15803D]" : "bg-[#16A34A] text-[#FFFFFF] ring-[#FAFAF7]"
                  }`}
                >
                  {Icon ? <Icon className="h-6 w-6" aria-hidden /> : <span className="font-heading text-lg font-extrabold">{i + 1}</span>}
                  <span
                    className={`absolute -end-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[0.7rem] font-extrabold ring-2 ${
                      onDark ? "bg-white text-[#14532D] ring-[#15803D]" : "bg-[#FACC15] text-[#14532D] ring-white"
                    }`}
                  >
                    {i + 1}
                  </span>
                </span>
                <div className="min-w-0 pt-1 lg:pt-0">
                  <h3 className={`font-heading text-[1.05rem] font-bold leading-snug ${onDark ? "!text-[#FFFFFF]" : "text-[#0F172A]"}`}>{step.title}</h3>
                  <p className={`mt-1.5 text-sm leading-relaxed lg:mx-auto lg:max-w-[16rem] ${onDark ? "text-white/75" : "text-[#64748B]"}`}>{step.desc}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </div>
  );
}
