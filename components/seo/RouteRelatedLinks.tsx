import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { ROUTES_DATA } from "@/lib/data/routes";

// City label -> /locations/[city] slug (sirf jahan location page exist karta hai)
const CITY_TO_LOCATION: [string, string][] = [
  ["jeddah", "jeddah"],
  ["makkah", "makkah"],
  ["madinah", "madinah"],
  ["riyadh", "riyadh"],
  ["dammam", "dammam"],
  ["khobar", "alkhobar"],
  ["yanbu", "yanbu"],
  ["alula", "alula"],
  ["neom", "neom"],
  ["taif", "taif"],
  ["abha", "abha"],
];

function locationSlug(city: string): string | null {
  const c = city.toLowerCase();
  for (const [needle, slug] of CITY_TO_LOCATION) {
    if (c.includes(needle)) return slug;
  }
  return null;
}

interface Props {
  slug: string;
  fromCity: string;
  toCity: string;
}

// Server component — crawlable internal links: reverse route, same-corridor
// routes, aur relevant city guide pages. Orphan-route fix (Day 5).
export function RouteRelatedLinks({ slug, fromCity, toCity }: Props) {
  const from = fromCity.toLowerCase();
  const to = toCity.toLowerCase();

  // Reverse route (Makkah->Madinah ka ulta Madinah->Makkah)
  const reverse = ROUTES_DATA.find(
    (r) =>
      r.slug !== slug &&
      r.fromCity.toLowerCase() === to &&
      r.toCity.toLowerCase() === from,
  );

  // Same origin ya destination share karne wali routes
  const related = ROUTES_DATA.filter(
    (r) =>
      r.slug !== slug &&
      r.slug !== reverse?.slug &&
      (r.fromCity.toLowerCase() === from ||
        r.toCity.toLowerCase() === to ||
        r.fromCity.toLowerCase() === to ||
        r.toCity.toLowerCase() === from),
  ).slice(0, 5);

  const routeLinks = [...(reverse ? [reverse] : []), ...related].slice(0, 6);

  // City guide links (unique, sirf existing location pages)
  const citySlugs = Array.from(
    new Set([locationSlug(fromCity), locationSlug(toCity)].filter(Boolean)),
  ) as string[];

  if (routeLinks.length === 0 && citySlugs.length === 0) return null;

  return (
    <section className="mt-16 border-t border-[#C9A84C]/10 pt-10">
      <h2 className="font-heading text-2xl font-bold mb-6">
        Related Taxi Routes &amp; City Guides
      </h2>

      {routeLinks.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 mb-8">
          {routeLinks.map((r) => (
            <Link
              key={r.slug}
              href={`/routes/${r.slug}`}
              className="group flex items-center justify-between rounded-2xl border border-[#16A34A]/12 bg-white px-5 py-4 hover:border-[#16A34A]/35 transition-all"
            >
              <span className="text-sm font-semibold">
                Taxi {r.fromCity} to {r.toCity}
                <span className="block text-[0.65rem] text-[#6B7280] font-normal mt-0.5">
                  {r.distance} km · from SAR {r.basePrice}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 text-[#C9A84C] shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      )}

      {citySlugs.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {citySlugs.map((c) => (
            <Link
              key={c}
              href={`/locations/${c}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
            >
              <MapPin className="h-3.5 w-3.5" />
              Taxi service in {c.charAt(0).toUpperCase() + c.slice(1)}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
