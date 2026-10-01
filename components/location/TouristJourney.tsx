import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";

export interface JourneyStop {
  label: string;
  desc: string;
  href?: string;
}

interface TouristJourneyProps {
  heading: string;
  intro: string;
  stops: JourneyStop[];
}

// A sample one-day itinerary shown as a visual flow, not a travel-blog
// paragraph — the point is to make "book this for a whole day, not just an
// airport ride" visible at a glance. Stops without an href (e.g. "Hotel")
// are plain waypoints; stops with an href link to a real, existing page.
export function TouristJourney({ heading, intro, stops }: TouristJourneyProps) {
  return (
    <section className="rounded-3xl border border-[#16A34A]/12 bg-white p-6 md:p-8">
      <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">{heading}</h2>
      <p className="text-sm text-[#6B7280] leading-relaxed mb-6 max-w-2xl">{intro}</p>

      {/* Mobile: vertical flow */}
      <div className="flex flex-col sm:hidden">
        {stops.map((stop, idx) => (
          <div key={idx} className="flex flex-col items-start">
            <StopCard stop={stop} />
            {idx < stops.length - 1 && <ArrowDown className="h-4 w-4 text-[#16A34A]/50 my-1 ms-5" />}
          </div>
        ))}
      </div>

      {/* Desktop: horizontal wrapping flow */}
      <div className="hidden sm:flex flex-wrap items-center gap-3">
        {stops.map((stop, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <StopCard stop={stop} />
            {idx < stops.length - 1 && <ArrowRight className="h-4 w-4 text-[#16A34A]/50 shrink-0" />}
          </div>
        ))}
      </div>
    </section>
  );
}

function StopCard({ stop }: { stop: JourneyStop }) {
  if (!stop.href) {
    return (
      <div className="rounded-xl border border-dashed border-[#16A34A]/20 bg-[#FAFAF7] px-4 py-3">
        <span className="block text-sm font-bold text-[#6B7280]">{stop.label}</span>
        <span className="block text-[0.7rem] text-[#6B7280] mt-0.5 max-w-[11rem]">{stop.desc}</span>
      </div>
    );
  }
  return (
    <Link
      href={stop.href}
      className="group block rounded-xl border border-[#16A34A]/15 bg-white px-4 py-3 hover:border-[#16A34A]/40 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
    >
      <span className="block text-sm font-bold text-[#16A34A]">{stop.label}</span>
      <span className="block text-[0.7rem] text-[#6B7280] mt-0.5 max-w-[11rem]">{stop.desc}</span>
    </Link>
  );
}
