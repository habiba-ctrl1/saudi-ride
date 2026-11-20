import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export interface ShowcaseVehicle {
  category: "sedan" | "suv" | "van";
  name: string;
  subtitle: string;
  image: string;
  passengers: number;
  luggage: number;
  bestFor: string;
  href: string;
}

interface VehicleShowcaseProps {
  heading: string;
  intro: string;
  vehicles: ShowcaseVehicle[];
}

// Real fleet vehicles (lib/fleet-data.ts) with real images — categories only
// named per CLAUDE.md Rule 6 is not required here since these specific
// models are confirmed available via the partner network in seo/facts.md.
export function VehicleShowcase({ heading, intro, vehicles }: VehicleShowcaseProps) {
  return (
    <section>
      <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">{heading}</h2>
      <p className="text-sm text-[#6B7280] leading-relaxed mb-6 max-w-2xl">{intro}</p>
      <div className="grid sm:grid-cols-3 gap-4">
        {vehicles.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[#16A34A]/12 bg-white hover:border-[#16A34A]/35 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
          >
            <div className="relative h-40 w-full overflow-hidden bg-[#FAFAF7]">
              <Image
                src={v.image}
                alt={`${v.name} — ${v.subtitle}`}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <span className="text-sm font-bold text-[#1C1C1C]">{v.name}</span>
              <span className="text-[0.7rem] uppercase tracking-wider text-[#16A34A] font-bold mt-0.5">{v.subtitle}</span>
              <span className="text-[0.75rem] text-[#6B7280] mt-2.5">
                {v.passengers} passengers · {v.luggage} bags
              </span>
              <p className="text-[0.75rem] text-[#6B7280] mt-2 leading-relaxed flex-1">{v.bestFor}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-[0.7rem] font-bold text-[#16A34A] group-hover:gap-2 transition-all">
                View vehicle <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
