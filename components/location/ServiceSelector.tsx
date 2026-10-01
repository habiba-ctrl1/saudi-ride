import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

export interface ServiceTile {
  icon: LucideIcon;
  label: string;
  desc: string;
  href: string;
}

interface ServiceSelectorProps {
  heading: string;
  tiles: ServiceTile[];
}

// Navigation component, not decoration — each tile routes the visitor to
// the page (or on-page section) that actually owns that intent, so the hub
// doesn't try to answer every trip type itself in prose.
export function ServiceSelector({ heading, tiles }: ServiceSelectorProps) {
  return (
    <section>
      <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">{heading}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.href + tile.label}
              href={tile.href}
              className="group flex flex-col gap-2.5 rounded-2xl border border-[#16A34A]/12 bg-white p-4 md:p-5 hover:border-[#16A34A]/40 hover:shadow-md transition-all"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16A34A]/10 text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-bold text-[#1C1C1C]">{tile.label}</span>
              <span className="text-[0.75rem] text-[#6B7280] leading-snug flex-1">{tile.desc}</span>
              <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wide text-[#16A34A] opacity-0 group-hover:opacity-100 transition-opacity">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
