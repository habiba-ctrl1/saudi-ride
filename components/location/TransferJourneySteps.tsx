import type { LucideIcon } from "lucide-react";

export interface JourneyStep {
  title: string;
  desc: string;
  icon?: LucideIcon;
}

interface TransferJourneyStepsProps {
  heading: string;
  steps: JourneyStep[];
}

// Numbered timeline with a connecting line — desktop horizontal, mobile
// vertical. Wording stays within the approved capability claims in
// seo/facts.md (flight number shared + checked before pickup, meet & greet
// as a value proposition — no specific terminal procedure or dedicated-desk
// claim).
export function TransferJourneySteps({ heading, steps }: TransferJourneyStepsProps) {
  return (
    <div className="rounded-3xl border border-[#16A34A]/12 bg-white p-6 md:p-8">
      <h3 className="font-heading text-xl font-bold mb-8">{heading}</h3>
      <ol className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
        {/* Connecting line: vertical spine on mobile, horizontal bar on desktop */}
        <div className="absolute start-[15px] top-2 bottom-2 w-px bg-[#16A34A]/20 sm:hidden" />
        <div className="absolute hidden sm:block top-[15px] start-[15px] end-[15px] h-px bg-[#16A34A]/20" />
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <li key={idx} className="relative flex items-start gap-4 sm:flex-col sm:items-start sm:gap-3">
              <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#16A34A] text-white text-xs font-bold ring-4 ring-white">
                {Icon ? <Icon className="h-4 w-4" /> : idx + 1}
              </span>
              <div>
                <span className="block text-sm font-bold text-[#1C1C1C]">{step.title}</span>
                <span className="block text-[0.75rem] text-[#6B7280] leading-relaxed mt-1">{step.desc}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
