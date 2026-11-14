import Link from "next/link";
import { ArrowRight, PlaneLanding } from "lucide-react";
import { RIYADH_AIRPORT_LINKS } from "@/lib/data/riyadh-airport-intent";

type Variant = "hub" | "service" | "border";

const INTRO: Record<Variant, string> = {
  hub: "Heading from Riyadh to a flight in the Gulf? Each route below is a private, pre-booked car from your Riyadh address, with the drop-off at the airport. Fares are confirmed before you book; airport names and codes are shown so you pick the right destination.",
  service: "Beyond Saudi airports, we arrange private cars from Riyadh to the main Gulf airports across the border or in the Eastern Province. Each route has its own page with a quote form and WhatsApp request.",
  border: "From Riyadh, the Gulf airports reached by road are on the routes below. Entry requirements are the traveller's responsibility — check official sources; we do not arrange visas.",
};

// Different anchor wording per surface so one exact anchor is not repeated site-wide.
export function RiyadhAirportTransferLinks({ variant = "hub", className = "" }: { variant?: Variant; className?: string }) {
  return (
    <section aria-labelledby={`riyadh-airports-${variant}`} className={`rounded-3xl border border-[#16A34A]/15 bg-white p-6 sm:p-8 ${className}`}>
      <h2 id={`riyadh-airports-${variant}`} className="font-heading flex items-center gap-2 text-2xl font-bold">
        <PlaneLanding className="h-5 w-5 text-[#16A34A]" aria-hidden /> Private Transfers from Riyadh to Major Airports
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#475569]" style={{ maxWidth: "70ch" }}>{INTRO[variant]}</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {RIYADH_AIRPORT_LINKS.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/routes/${a.slug}#airport-${a.code.toLowerCase()}`}
              className="group flex min-h-[44px] items-center justify-between gap-3 rounded-2xl border border-[#16A34A]/15 bg-[#FAFAF7] p-4 transition-colors hover:border-[#16A34A]/40"
            >
              <span>
                <span className="block text-sm font-semibold text-[#1C1C1C]">{variant === "hub" ? a.hub : a.alt}</span>
                <span className="block text-xs text-[#6B7280]">{a.code} · {a.note}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-[#16A34A] rtl:rotate-180" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-[#475569]">
        Not sure which airport suits your trip? <Link href="/riyadh-alternative-airports#compare" className="font-semibold text-[#166534] underline-offset-2 hover:underline">Compare the airports reachable from Riyadh by road</Link>.
      </p>
      {variant !== "border" && (
        <p className="mt-4 text-sm text-[#475569]">
          Crossing a border? See how <Link href="/services/border-crossings" className="font-semibold text-[#166534] underline-offset-2 hover:underline">cross-border private transfers</Link> work.
        </p>
      )}
      {variant === "border" && (
        <p className="mt-4 text-sm text-[#475569]">
          Starting in Riyadh? The <Link href="/locations/riyadh" className="font-semibold text-[#166534] underline-offset-2 hover:underline">Riyadh chauffeur service page</Link> covers pickups, districts and airport runs.
        </p>
      )}
    </section>
  );
}
