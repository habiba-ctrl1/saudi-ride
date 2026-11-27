import { MapPin, ShieldCheck, Flag } from "lucide-react";

// Origin → Saudi exit → entry → destination, as an accessible ordered list.
// Horizontal rail on desktop, vertical on mobile — no images, no overflow.
// Pure data in, no facts invented here.
export interface JourneyStage {
  label: string;
  title: string;
  desc: string;
  kind: "origin" | "border" | "destination";
}

const ICON = { origin: MapPin, border: ShieldCheck, destination: Flag } as const;

export function BorderJourney({ stages, heading, eyebrow = "Journey" }: { stages: JourneyStage[]; heading: string; eyebrow?: string }) {
  return (
    <section aria-labelledby="xb-journey" className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 sm:p-8">
      <span className="t-eyebrow">{eyebrow}</span>
      <h2 id="xb-journey" className="font-heading mt-1 text-2xl font-bold text-[#1C1C1C]">{heading}</h2>
      <ol className="mt-6 grid gap-4 md:grid-cols-4 md:gap-3">
        {stages.map((s, i) => {
          const Icon = ICON[s.kind];
          const border = s.kind === "border";
          return (
            <li key={i} className="relative flex gap-3 md:flex-col md:gap-2">
              {/* connector */}
              {i < stages.length - 1 && (
                <span aria-hidden className="absolute start-[1.15rem] top-10 bottom-[-1rem] w-0 border-s-2 border-dashed border-[#16A34A]/30 md:start-10 md:end-[-0.75rem] md:top-[1.15rem] md:bottom-auto md:h-0 md:w-auto md:border-s-0 md:border-t-2" />
              )}
              <span
                className={`relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  border ? "bg-[#FACC15]/25 text-[#854D0E] ring-4 ring-[#FACC15]/15" : "bg-[#16A34A] text-[#FFFFFF] ring-4 ring-[#16A34A]/15"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#6B7280]">
                  {i + 1}. {s.label}
                </p>
                <p className="mt-0.5 font-semibold text-[#1C1C1C]">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">{s.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
