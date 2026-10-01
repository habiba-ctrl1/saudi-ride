export interface JourneyStep {
  title: string;
  desc: string;
}

interface TransferJourneyStepsProps {
  heading: string;
  steps: JourneyStep[];
}

// Generic 4-step airport-transfer timeline. Wording stays within the
// approved capability claims in seo/facts.md (flight number shared + checked
// before pickup, meet & greet as a value proposition — no specific terminal
// procedure or dedicated-desk claim).
export function TransferJourneySteps({ heading, steps }: TransferJourneyStepsProps) {
  return (
    <div className="rounded-3xl border border-[#16A34A]/12 bg-white p-6 md:p-8">
      <h3 className="font-heading text-xl font-bold mb-6">{heading}</h3>
      <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {steps.map((step, idx) => (
          <li key={idx} className="flex flex-col gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#16A34A] text-white text-xs font-bold">
              {idx + 1}
            </span>
            <span className="text-sm font-bold text-[#1C1C1C]">{step.title}</span>
            <span className="text-[0.75rem] text-[#6B7280] leading-relaxed">{step.desc}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
