import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface VehicleFitOption {
  category: string;
  capacity: string;
  bestFor: string;
  href: string;
  linkLabel: string;
}

interface VehicleFitChooserProps {
  heading: string;
  intro: string;
  options: VehicleFitOption[];
}

// Structured "which vehicle do I need" block — real categories from facts.md,
// not decorative. Survives extraction as a self-contained table for AI/AIO
// retrieval (CLAUDE.md §15), and each row links to the page that actually
// fulfils it (/fleet for standard categories, the VIP page for luxury).
export function VehicleFitChooser({ heading, intro, options }: VehicleFitChooserProps) {
  return (
    <section className="rounded-3xl border border-[#16A34A]/12 bg-white p-6 md:p-8">
      <h2 className="font-heading text-2xl font-bold mb-2">{heading}</h2>
      <p className="text-sm text-[#6B7280] leading-relaxed mb-6 max-w-2xl">{intro}</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {options.map((opt) => (
          <div key={opt.category} className="rounded-2xl border border-[#16A34A]/10 p-5 flex flex-col">
            <span className="text-sm font-bold text-[#1C1C1C]">{opt.category}</span>
            <span className="text-[0.7rem] uppercase tracking-wider text-[#16A34A] mt-1">{opt.capacity}</span>
            <p className="text-sm text-[#6B7280] mt-3 leading-relaxed flex-1">{opt.bestFor}</p>
            <Link
              href={opt.href}
              className="mt-4 inline-flex items-center gap-1.5 text-[0.75rem] font-bold text-[#16A34A] hover:underline"
            >
              {opt.linkLabel} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
