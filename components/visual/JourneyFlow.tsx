import type { LucideIcon } from "lucide-react";

export interface FlowStage {
  label: string;
  /** Optional one-line detail under the label — real facts only. */
  note?: string;
  icon: LucideIcon;
}

/**
 * Compact stage-to-stage flow (e.g. Airport → Meet → Vehicle → Hotel).
 * Different job from <ProcessTimeline> (numbered booking steps with copy):
 * this is a scannable "what happens to you" strip.
 *
 * Desktop: one horizontal row of nodes joined by flowing dashed connectors.
 * Mobile: vertical chain. The final stage is highlighted as the destination.
 * Server component; connector motion is CSS (`.anim-dash`), reduced-motion safe.
 */
export function JourneyFlow({
  stages,
  title,
  className = "",
}: {
  stages: FlowStage[];
  title?: string;
  className?: string;
}) {
  return (
    <figure className={`rounded-[28px] border border-[#16A34A]/12 bg-gradient-to-br from-white to-[#F3FAF4] p-5 sm:p-8 ${className}`}>
      {title && <figcaption className="t-meta mb-6 uppercase tracking-[0.16em]">{title}</figcaption>}
      <ol className="flex flex-col gap-0 md:flex-row md:items-start" data-stagger>
        {stages.map((s, i) => {
          const Icon = s.icon;
          const last = i === stages.length - 1;
          return (
            <li key={s.label} className="relative flex flex-1 gap-4 md:flex-col md:items-center md:gap-3 md:text-center">
              {/* connector */}
              {!last && (
                <>
                  <svg aria-hidden className="absolute start-[1.6rem] top-14 h-[calc(100%-3rem)] w-1 md:hidden" preserveAspectRatio="none" viewBox="0 0 2 100">
                    <line x1="1" y1="0" x2="1" y2="100" stroke="#16A34A" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="4 6" className="anim-dash" vectorEffect="non-scaling-stroke" />
                  </svg>
                  <svg aria-hidden className="absolute top-7 hidden h-1 w-[calc(100%-3.5rem)] md:block ltr:left-[calc(50%+1.75rem)] rtl:right-[calc(50%+1.75rem)]" preserveAspectRatio="none" viewBox="0 0 100 2">
                    <line x1="0" y1="1" x2="100" y2="1" stroke="#16A34A" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="4 6" className="anim-dash" vectorEffect="non-scaling-stroke" />
                  </svg>
                </>
              )}
              <span
                className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-[6px] transition-transform duration-300 hover:scale-105 ${
                  last
                    ? "bg-[#FACC15] text-[#14532D] ring-[#FACC15]/25"
                    : i === 0
                      ? "bg-[#16A34A] text-[#FFFFFF] ring-[#16A34A]/15"
                      : "bg-white text-[#16A34A] ring-[#16A34A]/10 shadow-[0_6px_16px_-8px_rgba(22,163,74,0.6)] border border-[#16A34A]/20"
                }`}
              >
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <span className={`min-w-0 pb-8 pt-2 md:px-2 md:pb-0 md:pt-0 ${last ? "pb-0" : ""}`}>
                <span className="block font-heading text-[0.98rem] font-bold leading-snug text-[#0F172A]">{s.label}</span>
                {s.note && <span className="mt-1 block text-[0.82rem] leading-snug text-[#64748B]">{s.note}</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
