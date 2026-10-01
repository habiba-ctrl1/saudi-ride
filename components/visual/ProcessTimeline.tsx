import type { LucideIcon } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

export interface ProcessStep {
  title: string;
  desc: string;
  icon?: LucideIcon;
}

/**
 * Numbered "how it works" timeline — big index numerals, connecting line,
 * staggered reveal. Desktop: horizontal 4-up with a line through the number
 * badges. Mobile: vertical rail. Distinct from <TransferJourneySteps> (which
 * is the location-page journey graphic) — this is the generic booking/process
 * explainer any page type can drop in.
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
  const numberCls = onDark
    ? "text-white/15"
    : "text-[#16A34A]/15";
  const titleCls = onDark ? "text-white" : "text-[#0F172A]";
  const descCls = onDark ? "text-white/70" : "text-[#6B7280]";
  const lineCls = onDark ? "bg-white/15" : "bg-[#16A34A]/20";

  return (
    <div>
      {heading && (
        <Reveal className="mb-10 max-w-2xl">
          <h2 className={`text-section-title ${titleCls}`}>{heading}</h2>
          {intro && <p className={`mt-3 text-body-lg ${descCls}`}>{intro}</p>}
        </Reveal>
      )}
      <RevealGroup className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {/* connecting line — desktop horizontal, mobile vertical rail */}
        <div className={`absolute hidden lg:block top-7 start-[10%] end-[10%] h-px ${lineCls}`} />
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <RevealItem key={i} className="relative flex gap-4 lg:flex-col lg:gap-4">
              <div className="flex shrink-0 flex-col items-center lg:items-start">
                <span className="relative z-10 flex items-baseline gap-1">
                  <span className={`font-heading text-5xl font-extrabold leading-none ${numberCls}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
              </div>
              <div className="pt-1">
                <div className="mb-2 flex items-center gap-2">
                  {Icon && (
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        onDark ? "bg-white/10 text-[#FACC15]" : "bg-[#16A34A]/10 text-[#16A34A]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                  )}
                  <h3 className={`font-heading text-base font-bold ${titleCls}`}>{step.title}</h3>
                </div>
                <p className={`text-sm leading-relaxed ${descCls}`}>{step.desc}</p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </div>
  );
}
