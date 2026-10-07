import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { reverseSlug, routeFact } from "@/lib/data/cluster";

// Contextual link block rendered on every Makkah-cluster route page. Each link
// has a reason (hub, reverse leg, nearest sibling routes, service pages) and
// anchors differ per route so no exact-match anchor repeats site-wide.
type L = { href: string; label: string; why: string };

// Hand-picked sibling routes per page (reason: same traveller, next leg).
const SIBLINGS: Record<string, { slug: string; label: string; why: string }[]> = {
  "jeddah-airport-to-makkah": [
    { slug: "makkah-to-madinah", label: "Continue to Madinah by private car", why: "Most Umrah trips continue to Madinah" },
    { slug: "jeddah-airport-to-swissotel-makkah", label: "Airport transfer to Swissotel Al Maqam", why: "Hotel-specific pickup details" },
  ],
  "makkah-to-jeddah-airport": [
    { slug: "makkah-to-jeddah", label: "Makkah to a Jeddah hotel instead", why: "When you are not flying out the same day" },
    { slug: "madinah-to-makkah", label: "Arriving from Madinah first?", why: "The leg before your flight home" },
  ],
  "jeddah-to-makkah": [
    { slug: "jeddah-airport-to-makkah", label: "Straight from the airport terminal", why: "Arrival-day version with flight tracking" },
    { slug: "makkah-to-taif", label: "Day trip on from Makkah to Taif", why: "Popular add-on" },
  ],
  "makkah-to-jeddah": [
    { slug: "makkah-to-jeddah-airport", label: "Heading to JED for a flight?", why: "Airport leg, timed from the flight" },
    { slug: "jeddah-to-makkah", label: "The same trip in the other direction", why: "Return leg" },
  ],
  "makkah-to-madinah": [
    { slug: "jeddah-airport-to-makkah", label: "Landing in Jeddah first?", why: "Airport leg before Makkah" },
    { slug: "makkah-clock-tower-to-madinah-markaziyah", label: "Clock Tower hotels to Madinah Markaziyah", why: "Hotel-to-hotel version" },
  ],
  "madinah-to-makkah": [
    { slug: "makkah-to-jeddah-airport", label: "Makkah to Jeddah Airport for the flight home", why: "Usual next leg" },
    { slug: "madinah-airport-to-makkah", label: "From Madinah Airport directly", why: "If you land in Madinah" },
  ],
  "makkah-to-taif": [
    { slug: "makkah-hotels-to-taif-resorts", label: "Makkah hotels to Taif resorts", why: "Resort-specific version" },
    { slug: "makkah-to-jeddah", label: "Back via Jeddah", why: "Onward or return" },
  ],
  "taif-to-makkah": [
    { slug: "makkah-to-jeddah-airport", label: "Makkah to Jeddah Airport for your flight", why: "Usual next leg" },
    { slug: "makkah-to-madinah", label: "Onward to Madinah", why: "Umrah itineraries often include both cities" },
  ],
  "riyadh-to-makkah": [
    { slug: "makkah-to-madinah", label: "Onward to Madinah", why: "Umrah itineraries often include both cities" },
    { slug: "makkah-to-riyadh", label: "The drive home to Riyadh", why: "Return leg" },
  ],
  "makkah-to-riyadh": [
    { slug: "madinah-to-makkah", label: "Coming from Madinah first?", why: "Previous leg" },
    { slug: "jeddah-airport-to-makkah", label: "Flying in through Jeddah", why: "Alternative arrival" },
  ],
};

export function MakkahRouteLinks({ slug, fromCity, toCity }: { slug: string; fromCity: string; toCity: string }) {
  const isHotel = slug.startsWith("jeddah-airport-to-") && slug !== "jeddah-airport-to-makkah" && slug.includes("makkah");
  const rev = reverseSlug(slug);
  const links: L[] = [];

  links.push({ href: "/locations/makkah", label: "Private transportation in Makkah", why: "All Makkah services, vehicles and routes in one place" });
  if (rev) {
    const f = routeFact(rev);
    if (f) links.push({ href: `/routes/${rev}`, label: `Return: ${f.from} to ${f.to}`, why: "Book the way back" });
  }
  for (const sb of SIBLINGS[slug] ?? []) {
    if (routeFact(sb.slug)) links.push({ href: `/routes/${sb.slug}`, label: sb.label, why: sb.why });
  }
  if (isHotel) {
    links.push({ href: "/routes/jeddah-airport-to-makkah", label: "All Jeddah Airport to Makkah transfers", why: "Main airport page with every vehicle option" });
    links.push({ href: "/guides/makkah-hotel-haram-dropoff-guide", label: "Haram-area drop-off guide", why: "Where cars can stop near the hotel" });
  }
  links.push({ href: "/locations/makkah/private-driver", label: "Hire a private driver in Makkah", why: "Hourly or full-day hire" });
  links.push({ href: "/services/makkah-ziyarat", label: "Makkah Ziyarat by private car", why: "Sites visited by car with waiting time" });
  links.push({ href: "/fleet", label: "Vehicle categories for your group size", why: "Sedan, SUV, Staria, van, coaster" });
  if (!isHotel) links.push({ href: "/services/intercity", label: "Other intercity transfers", why: "All routes between Saudi cities" });

  const uniq = Array.from(new Map(links.map((l) => [l.href, l])).values()).slice(0, 8);

  return (
    <section aria-labelledby="mk-network-heading" className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 md:p-8">
      <h2 id="mk-network-heading" className="font-heading text-xl font-bold text-[#1C1C1C]">Plan the rest of your Makkah trip</h2>
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

export function MakkahRouteDetails({ details }: { details: { heading: string; rows: { label: string; value: string }[]; factors: { title: string; body: string }[] } }) {
  return (
    <section aria-labelledby="mk-details-heading" className="rounded-3xl border border-[#E5E7EB] bg-white p-6 md:p-8">
      <h2 id="mk-details-heading" className="font-heading text-xl font-bold text-[#1C1C1C]">{details.heading}</h2>
      <dl className="mt-5 divide-y divide-[#E5E7EB] overflow-hidden rounded-2xl border border-[#E5E7EB]">
        {details.rows.map((r) => (
          <div key={r.label} className="grid gap-1 px-4 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
            <dt className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#15803D]">{r.label}</dt>
            <dd className="text-sm text-[#1F2937]">{r.value}</dd>
          </div>
        ))}
      </dl>
      <h3 className="mt-8 font-heading text-base font-bold text-[#1C1C1C]">What changes the journey time</h3>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {details.factors.map((f) => (
          <li key={f.title} className="rounded-2xl bg-[#F0FDF4] p-4">
            <p className="text-sm font-bold text-[#1C1C1C]">{f.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-[#4B5563]">{f.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
