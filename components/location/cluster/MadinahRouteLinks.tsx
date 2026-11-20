import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { reverseSlug, routeFact } from "@/lib/data/cluster";

// Related-routes module rendered on every Madinah-cluster route page. Each link
// has a stated reason (hub, reverse leg, the next leg a traveller usually
// books, the airport, Ziyarat, hourly hire). Links are built from real route
// data: a sibling is only shown if routeFact() finds the route, and the reverse
// leg is derived with reverseSlug(), so no URL can be invented or broken.
type L = { href: string; label: string; why: string };

const SIBLINGS: Record<string, { slug: string; label: string; why: string }[]> = {
  "madinah-to-makkah": [
    { slug: "makkah-to-jeddah-airport", label: "Makkah to Jeddah Airport for the flight home", why: "The usual next leg" },
    { slug: "madinah-airport-to-makkah", label: "Landing at Madinah Airport instead?", why: "Airport to Makkah in one vehicle" },
  ],
  "makkah-to-madinah": [
    { slug: "madinah-airport-to-madinah-markaziyah", label: "Madinah Airport to Central Area hotels", why: "If you also fly out of Madinah" },
    { slug: "madinah-to-alula", label: "Continue north to AlUla", why: "A popular add-on after Ziyarat" },
  ],
  "madinah-airport-to-makkah": [
    { slug: "madinah-airport-to-city", label: "Madinah Airport to the city", why: "If you stay in Madinah first" },
    { slug: "jeddah-airport-to-madinah", label: "Arriving at Jeddah Airport instead?", why: "The other common arrival point" },
  ],
  "makkah-to-madinah-airport": [
    { slug: "makkah-to-madinah", label: "Makkah to a Madinah hotel", why: "When you are not flying out the same day" },
    { slug: "madinah-airport-to-city", label: "Madinah Airport to the city", why: "The reverse airport leg" },
  ],
  "madinah-airport-to-city": [
    { slug: "madinah-airport-to-madinah-markaziyah", label: "Madinah Airport to Markaziyah hotels", why: "Hotel-level details for the Central Area" },
    { slug: "madinah-to-makkah", label: "Onward to Makkah by private car", why: "Most Umrah trips continue to Makkah" },
  ],
  "madinah-airport-to-madinah-markaziyah": [
    { slug: "madinah-airport-to-city", label: "Madinah Airport to the city, any district", why: "For hotels outside the Central Area" },
    { slug: "madinah-to-makkah", label: "Madinah to Makkah, hotel to hotel", why: "The next leg for Umrah travellers" },
  ],
  "makkah-clock-tower-to-madinah-markaziyah": [
    { slug: "makkah-to-madinah", label: "Makkah to Madinah from any hotel", why: "For hotels beyond the Clock Tower" },
    { slug: "madinah-airport-to-madinah-markaziyah", label: "Landing at MED instead?", why: "Airport arrival to the Central Area" },
  ],
  "jeddah-to-madinah": [
    { slug: "jeddah-airport-to-madinah", label: "Straight from the airport terminal", why: "Arrival-day version with flight tracking" },
    { slug: "madinah-to-makkah", label: "Then on to Makkah", why: "Most Umrah itineraries include both cities" },
  ],
  "jeddah-airport-to-madinah": [
    { slug: "jeddah-to-madinah", label: "From a Jeddah hotel or home instead", why: "City departure, not the airport" },
    { slug: "madinah-airport-to-city", label: "Prefer to fly into Madinah?", why: "MED is close to the Central Area" },
  ],
  "madinah-to-jeddah": [
    { slug: "madinah-to-jeddah-airport", label: "Heading to JED for a flight?", why: "Airport leg, timed from the flight" },
    { slug: "madinah-to-makkah", label: "Via Makkah first", why: "A common stop before the flight home" },
  ],
  "madinah-to-jeddah-airport": [
    { slug: "madinah-to-jeddah", label: "To a Jeddah hotel instead", why: "When you are not flying out the same day" },
    { slug: "madinah-airport-to-city", label: "Flying from Madinah instead?", why: "MED is the shorter airport run" },
  ],
  "madinah-to-alula": [
    { slug: "madinah-to-tabuk", label: "Continue north towards Tabuk", why: "The same corridor, further on" },
    { slug: "madinah-airport-to-city", label: "Arriving at Madinah Airport first?", why: "Airport to hotel before the AlUla leg" },
  ],
  "alula-to-madinah": [
    { slug: "madinah-airport-to-city", label: "To Madinah Airport for your flight", why: "If you fly out of MED" },
    { slug: "madinah-to-makkah", label: "Then on to Makkah", why: "Umrah itineraries often follow" },
  ],
  "madinah-to-riyadh": [
    { slug: "madinah-airport-to-city", label: "Flying instead? Madinah Airport", why: "A flight can suit solo travellers better" },
    { slug: "madinah-to-makkah", label: "Making a Makkah stop first", why: "Both Holy Cities in one trip" },
  ],
  "riyadh-to-madinah": [
    { slug: "madinah-to-makkah", label: "Onward to Makkah", why: "Umrah itineraries often include both cities" },
    { slug: "madinah-airport-to-city", label: "Flying into Madinah instead?", why: "A flight can suit solo travellers better" },
  ],
  "madinah-to-yanbu": [
    { slug: "madinah-to-jeddah", label: "Madinah to Jeddah on the Red Sea side", why: "Another western destination" },
    { slug: "madinah-airport-to-city", label: "Madinah Airport to the city", why: "If you land in Madinah first" },
  ],
  "madinah-to-tabuk": [
    { slug: "madinah-to-alula", label: "Madinah to AlUla on the way north", why: "A heritage stop on the same corridor" },
    { slug: "medinah-to-amman", label: "Onward to Amman, Jordan", why: "Cross-border from Madinah" },
  ],
  "madinah-to-taif": [
    { slug: "madinah-to-makkah", label: "Via Makkah", why: "Taif is usually reached through Makkah" },
    { slug: "madinah-airport-to-city", label: "Madinah Airport to the city", why: "If you land in Madinah first" },
  ],
  "medinah-to-amman": [
    { slug: "madinah-to-tabuk", label: "Madinah to Tabuk, the first leg north", why: "The same road corridor" },
    { slug: "madinah-to-alula", label: "A stop in AlUla on the way", why: "Heritage break on the route north" },
  ],
};

export function MadinahRouteLinks({ slug, fromCity, toCity }: { slug: string; fromCity: string; toCity: string }) {
  const rev = reverseSlug(slug);
  const links: L[] = [];

  links.push({ href: "/locations/madinah", label: "Private transportation in Madinah", why: "Airport, hotels, Ziyarat, vehicles and every route in one place" });
  if (rev) {
    const f = routeFact(rev);
    if (f) links.push({ href: `/routes/${rev}`, label: `Return: ${f.from} to ${f.to}`, why: "Book the way back" });
  }
  for (const sb of SIBLINGS[slug] ?? []) {
    if (routeFact(sb.slug)) links.push({ href: `/routes/${sb.slug}`, label: sb.label, why: sb.why });
  }
  if (!slug.startsWith("madinah-airport-") && slug !== "madinah-to-makkah" && slug !== "makkah-to-madinah") {
    links.push({ href: "/airports/prince-mohammad-madinah", label: "Madinah Airport (MED) transfers", why: "Arrival and departure details for MED" });
  }
  links.push({ href: "/services/madinah-ziyarat", label: "Madinah Ziyarat by private car", why: "Quba, Qiblatayn, Uhud and more, with the car waiting" });
  links.push({ href: "/locations/madinah/private-driver", label: "Hire a private driver in Madinah", why: "Hourly or full-day hire" });
  links.push({ href: "/fleet", label: "Vehicle categories for your group size", why: "Sedan, SUV, Staria, van, coaster" });

  const uniq = Array.from(new Map(links.map((l) => [l.href, l])).values()).slice(0, 8);

  return (
    <section aria-labelledby="md-network-heading" className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 md:p-8">
      <h2 id="md-network-heading" className="font-heading text-xl font-bold text-[#1C1C1C]">More Madinah transfers</h2>
      <p className="mt-1 text-sm text-[#6B7280]">{fromCity} to {toCity} is one leg. These pages cover the others.</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {uniq.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="group flex h-full min-h-[64px] items-start justify-between gap-3 rounded-2xl border border-[#E5E7EB] p-4 transition-colors hover:border-[#16A34A]/40 hover:bg-[#F0FDF4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
              <span>
                <span className="block text-sm font-semibold text-[#1C1C1C] group-hover:text-[#15803D]">{l.label}</span>
                <span className="mt-0.5 block text-[0.75rem] text-[#6B7280]">{l.why}</span>
              </span>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#16A34A] transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ─── Journey strip (data-driven, accessible ordered list) ───────────── */

// Each step is plain text; the only numbers are route km/time from
// routeFact(). "On request" steps are optional stops, never promised.
const JOURNEYS: Record<string, { steps: { label: string; note?: string; optional?: boolean }[] }> = {
  "madinah-to-makkah": { steps: [
    { label: "Madinah hotel", note: "Nearest permitted pickup point" },
    { label: "Dhul Hulayfah (Abyar Ali)", note: "Miqat — stop on request", optional: true },
    { label: "Highway to Makkah" },
    { label: "Rest or prayer stop", note: "On request", optional: true },
    { label: "Makkah hotel", note: "Nearest permitted drop-off" },
  ] },
  "makkah-to-madinah": { steps: [
    { label: "Makkah hotel", note: "Nearest permitted pickup point" },
    { label: "Highway to Madinah" },
    { label: "Rest or prayer stop", note: "On request", optional: true },
    { label: "Madinah hotel", note: "Central Area: nearest permitted drop-off" },
  ] },
  "jeddah-airport-to-madinah": { steps: [
    { label: "JED arrivals" },
    { label: "Baggage claim" },
    { label: "Meet your driver", note: "Meet & greet; flight tracked" },
    { label: "Private vehicle to Madinah" },
    { label: "Madinah hotel", note: "Nearest permitted drop-off" },
  ] },
  "madinah-to-jeddah-airport": { steps: [
    { label: "Madinah hotel", note: "Pickup worked back from your flight" },
    { label: "Private vehicle" },
    { label: "Rest stop", note: "On request", optional: true },
    { label: "JED departures" },
  ] },
  "jeddah-to-madinah": { steps: [
    { label: "Jeddah hotel or home" },
    { label: "Private vehicle" },
    { label: "Rest or prayer stop", note: "On request", optional: true },
    { label: "Madinah hotel", note: "Nearest permitted drop-off" },
  ] },
  "madinah-to-jeddah": { steps: [
    { label: "Madinah hotel" },
    { label: "Private vehicle" },
    { label: "Rest or prayer stop", note: "On request", optional: true },
    { label: "Jeddah hotel or address" },
  ] },
  "madinah-to-alula": { steps: [
    { label: "Madinah hotel" },
    { label: "Private vehicle" },
    { label: "Highway north" },
    { label: "AlUla hotel or airport" },
  ] },
  "alula-to-madinah": { steps: [
    { label: "AlUla hotel or airport" },
    { label: "Private vehicle" },
    { label: "Highway south" },
    { label: "Madinah hotel or MED" },
  ] },
  "madinah-airport-to-city": { steps: [
    { label: "MED arrivals" },
    { label: "Luggage" },
    { label: "Meet your driver", note: "Meet & greet; flight tracked" },
    { label: "Private vehicle" },
    { label: "Madinah hotel", note: "Nearest permitted drop-off" },
  ] },
  "madinah-airport-to-madinah-markaziyah": { steps: [
    { label: "MED arrivals" },
    { label: "Luggage" },
    { label: "Meet your driver", note: "Meet & greet; flight tracked" },
    { label: "Private vehicle" },
    { label: "Central Area hotel", note: "Nearest permitted drop-off" },
  ] },
};

export function MadinahRouteJourney({ slug }: { slug: string }) {
  const j = JOURNEYS[slug];
  const f = routeFact(slug);
  if (!j || !f) return null;
  return (
    <section aria-labelledby="md-journey-heading" className="rounded-3xl border border-[#E5E7EB] bg-white p-6 md:p-8">
      <h2 id="md-journey-heading" className="font-heading text-xl font-bold text-[#1C1C1C]">The journey, step by step</h2>
      <p className="mt-1 text-sm text-[#6B7280]">About {f.km} km, {f.time}. Dashed steps are optional and arranged on request.</p>
      <ol className="mt-6 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-stretch">
        {j.steps.map((st, i) => (
          <li key={st.label} className="flex items-center gap-3 md:flex-1 md:basis-[8.5rem]">
            <div className={`flex-1 rounded-2xl border p-4 ${st.optional ? "border-dashed border-[#9CA3AF] bg-[#F9FAFB]" : "border-[#16A34A]/25 bg-[#F0FDF4]"}`}>
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#15803D]">Step {i + 1}</span>
              <p className="mt-1 text-sm font-bold text-[#1C1C1C]">{st.label}</p>
              {st.note && <p className="mt-0.5 text-[0.75rem] text-[#6B7280]">{st.note}</p>}
            </div>
            {i < j.steps.length - 1 && <ArrowRight className="hidden h-4 w-4 shrink-0 text-[#16A34A] md:block rtl:rotate-180" aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </section>
  );
}
