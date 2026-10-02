import Link from "next/link";
import { ArrowLeftRight, ArrowRight, FileCheck2, Repeat, Globe } from "lucide-react";
import { BorderJourney, type JourneyStage } from "./BorderJourney";
import { ROUTES_DATA } from "@/lib/data/routes";
import { CROSS_BORDER_DOCUMENTS, isSaudiSide, type Corridor } from "@/lib/data/cross-border";

// Cross-border block for /routes/[slug] — rendered for every route listed in
// a corridor (lib/data/cross-border.ts). Gives each route: an upward link to
// its corridor hub, the reverse route, a direction-aware border journey, the
// passenger-documents checklist and trip options. Route-specific values
// (cities, crossing) come from data; distances are not repeated here.
interface Props {
  slug: string;
  fromCity: string;
  toCity: string;
  corridor: Corridor;
  /** Kuwait → Saudi routes already render their own journey section. */
  showJourney?: boolean;
}

export function CrossBorderRouteSections({ slug, fromCity, toCity, corridor, showJourney = true }: Props) {
  const outbound = isSaudiSide(fromCity, corridor);
  const reverse = ROUTES_DATA.find((r) => r.fromCity === toCity && r.toCity === fromCity && r.slug !== slug);

  const stages: JourneyStage[] = [
    { label: "Pickup", title: fromCity, desc: "Door-to-door pickup at your home, hotel, office or airport.", kind: "origin" },
    outbound
      ? { label: "Saudi exit", title: corridor.saudiSide, desc: "Each passenger completes their own Saudi exit check.", kind: "border" }
      : { label: `${corridor.country} exit`, title: corridor.otherSide, desc: `Each passenger completes their own ${corridor.country} exit check.`, kind: "border" },
    outbound
      ? { label: `${corridor.country} entry`, title: corridor.otherSide, desc: `${corridor.country} entry checks, in person.`, kind: "border" }
      : { label: "Saudi entry", title: corridor.saudiSide, desc: "Saudi entry checks, in person.", kind: "border" },
    { label: "Drop-off", title: toCity, desc: "Straight to your exact address — no change of car.", kind: "destination" },
  ];

  return (
    <>
      {/* Corridor context — upward link to the country hub + reverse leg */}
      <nav aria-label="Cross-border corridor" className="flex flex-col gap-3 rounded-2xl border border-[#16A34A]/20 bg-[#F0FDF4] p-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-[#166534]">
          <Globe className="h-4 w-4 shrink-0" aria-hidden />
          Crosses {corridor.crossingName}
        </span>
        <span className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
          <Link href={`/cross-border/${corridor.slug}`} className="inline-flex items-center gap-1 text-[#16A34A] hover:underline">
            All {corridor.pairLabel.replace("↔", "–")} transfers <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          {reverse && (
            <Link href={`/routes/${reverse.slug}`} className="inline-flex items-center gap-1 text-[#16A34A] hover:underline">
              <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden /> Return: {reverse.fromCity} to {reverse.toCity}
            </Link>
          )}
        </span>
      </nav>

      {showJourney && (
        <BorderJourney eyebrow="Cross-border journey" heading={`What happens between ${fromCity} and ${toCity}`} stages={stages} />
      )}

      <section aria-label="Border documents and trip options" className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-6">
          <h2 className="font-heading flex items-center gap-2 text-lg font-bold text-[#1C1C1C]">
            <FileCheck2 className="h-5 w-5 text-[#16A34A]" aria-hidden /> Documents for this crossing
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#475569]">{corridor.crossingNote}</p>
          <ul className="mt-3 space-y-2">
            {CROSS_BORDER_DOCUMENTS.map((d) => (
              <li key={d} className="flex gap-2 text-sm leading-relaxed text-[#475569]">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" />
                {d}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-6">
          <h2 className="font-heading flex items-center gap-2 text-lg font-bold text-[#1C1C1C]">
            <Repeat className="h-5 w-5 text-[#16A34A]" aria-hidden /> One-way, return or waiting
          </h2>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed text-[#475569]">
            <li><span className="font-semibold text-[#1C1C1C]">One-way:</span> drop-off at your address in {toCity}.</li>
            <li><span className="font-semibold text-[#1C1C1C]">Return on a later date:</span> book both legs together and the return is confirmed in the same quote.</li>
            <li><span className="font-semibold text-[#1C1C1C]">Same-day return:</span> the driver can wait while you are in {toCity}; waiting time is priced into the fixed fare.</li>
            <li><span className="font-semibold text-[#1C1C1C]">Included:</span> border crossing fees for the vehicle and 15–30 minutes of free waiting.</li>
            <li><span className="font-semibold text-[#1C1C1C]">Vehicle eligibility:</span> the car and driver for your date are confirmed as able to cross before we send the fare.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
