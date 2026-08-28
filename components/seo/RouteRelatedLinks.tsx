import Link from "next/link";
import { ArrowRight, MapPin, Plane, BookOpen } from "lucide-react";
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

// Airport city label -> /airports/[slug] detail page. Order matters: more
// specific needles ("red sea") before generic ones. This gives the airport
// hub pages (king-abdulaziz-jeddah, king-khalid-riyadh, etc.) real inbound
// links from every indexed *-airport-* route page — the fix for those airport
// pages sitting "discovered, not indexed" because nothing linked to them.
const CITY_TO_AIRPORT: { needle: string; slug: string; label: string }[] = [
  { needle: "jeddah airport", slug: "king-abdulaziz-jeddah", label: "Jeddah Airport (JED)" },
  { needle: "madinah airport", slug: "prince-mohammad-madinah", label: "Madinah Airport (MED)" },
  { needle: "riyadh airport", slug: "king-khalid-riyadh", label: "Riyadh Airport (RUH)" },
  { needle: "dammam airport", slug: "king-fahd-dammam", label: "Dammam Airport (DMM)" },
  { needle: "abha airport", slug: "abha-regional", label: "Abha Airport (AHB)" },
  { needle: "tabuk airport", slug: "tabuk-regional", label: "Tabuk Airport (TUU)" },
  { needle: "alula airport", slug: "alula", label: "AlUla Airport (ULH)" },
  { needle: "red sea", slug: "red-sea", label: "Red Sea International Airport (RSI)" },
  // Plain-city fallbacks for the four major hub airports (all sitting on GSC
  // page 2). Listed AFTER the "X airport" needles so airport-endpoint routes
  // still resolve first (same slug either way). This lets intercity/city
  // routes touching a hub city — e.g. the site's #1 page riyadh-to-dammam —
  // pass a contextual inbound link to that city's airport money page, which
  // the "X airport"-only match previously never surfaced.
  { needle: "jeddah", slug: "king-abdulaziz-jeddah", label: "Jeddah Airport (JED)" },
  { needle: "madinah", slug: "prince-mohammad-madinah", label: "Madinah Airport (MED)" },
  { needle: "riyadh", slug: "king-khalid-riyadh", label: "Riyadh Airport (RUH)" },
  { needle: "dammam", slug: "king-fahd-dammam", label: "Dammam Airport (DMM)" },
];

function airportFor(city: string): { slug: string; label: string } | null {
  const c = city.toLowerCase();
  for (const a of CITY_TO_AIRPORT) {
    if (c.includes(a.needle)) return { slug: a.slug, label: a.label };
  }
  return null;
}

// Contextual service links per corridor. Gives the orphan-prone service hub
// pages (umrah-transport, corporate, vip-luxury) real in-content inbound links
// from strong, indexed route pages — footer/nav boilerplate links alone leave
// them "discovered, not indexed". Kept to ≤2 per route so pills stay relevant.
const HOLY_CITIES = ["makkah", "mecca", "madinah", "medina"];
const BUSINESS_CITIES = ["riyadh", "dammam", "khobar", "dhahran", "jubail", "kaec", "jeddah city"];

function serviceLinksFor(fromCity: string, toCity: string): { href: string; label: string }[] {
  const both = `${fromCity} ${toCity}`.toLowerCase();
  const out: { href: string; label: string }[] = [];
  if (HOLY_CITIES.some((h) => both.includes(h))) {
    out.push({ href: "/services/umrah-transport", label: "Umrah transport service" });
  }
  if (BUSINESS_CITIES.some((b) => both.includes(b))) {
    out.push({ href: "/services/corporate", label: "Corporate & business travel" });
  }
  if (out.length < 2 && both.includes("airport")) {
    out.push({ href: "/services/vip-transportation", label: "VIP transportation Riyadh" });
  }
  return out.slice(0, 2);
}

// Relevant travel guides per corridor. Guides have no auto-linker of their own,
// so most sat orphaned ("discovered, not indexed"); this gives them in-content
// links from indexed route pages and builds the pilgrim/business topical cluster
// (routes ↔ miqat/ziyarat/airport guides) that also helps AI/AIO understanding.
function guidesFor(fromCity: string, toCity: string): { slug: string; label: string }[] {
  const s = `${fromCity} ${toCity}`.toLowerCase();
  const g: { slug: string; label: string }[] = [];
  if (s.includes("jeddah airport")) g.push({ slug: "jeddah-airport-guide", label: "Jeddah Airport arrival guide" });
  if (s.includes("makkah") || s.includes("mecca")) g.push({ slug: "miqat-jeddah-makkah", label: "Miqat & Ihram guide" });
  if (s.includes("madinah") || s.includes("medina")) g.push({ slug: "dhul-hulaifah-miqat-madinah", label: "Madinah Miqat (Dhul Hulaifah) guide" });
  if (s.includes("alula")) g.push({ slug: "alula-transport-guide", label: "AlUla transport guide" });
  if (s.includes("bahrain") || s.includes("manama")) g.push({ slug: "riyadh-to-bahrain-taxi-vs-train", label: "Saudi–Bahrain: taxi vs train" });
  if (g.length < 2 && s.includes("riyadh")) g.push({ slug: "riyadh-business-travel", label: "Riyadh business travel guide" });
  // Dedupe by slug, keep it tidy.
  return Array.from(new Map(g.map((x) => [x.slug, x])).values()).slice(0, 2);
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

  // Same origin ya destination share karne wali routes. Substring match (not
  // exact) so e.g. toCity "Fairmont Makkah Clock Royal Tower" still cross-links
  // with plain "Makkah" routes both ways — hotel-specific routes otherwise
  // never surface on (or receive links from) their city's main route page.
  const sharesCity = (a: string, b: string) => a.includes(b) || b.includes(a);
  const related = ROUTES_DATA.filter(
    (r) =>
      r.slug !== slug &&
      r.slug !== reverse?.slug &&
      (sharesCity(r.fromCity.toLowerCase(), from) ||
        sharesCity(r.toCity.toLowerCase(), to) ||
        sharesCity(r.fromCity.toLowerCase(), to) ||
        sharesCity(r.toCity.toLowerCase(), from)),
  ).slice(0, 5);

  const routeLinks = [...(reverse ? [reverse] : []), ...related].slice(0, 6);

  // City guide links (unique, sirf existing location pages)
  const citySlugs = Array.from(
    new Set([locationSlug(fromCity), locationSlug(toCity)].filter(Boolean)),
  ) as string[];

  // Airport detail-page links (unique) — de-orphans /airports/* hub pages.
  const airportLinks = Array.from(
    new Map(
      [airportFor(fromCity), airportFor(toCity)]
        .filter((a): a is { slug: string; label: string } => a !== null)
        .map((a) => [a.slug, a]),
    ).values(),
  );

  // Contextual service links (unique) — de-orphans service hub pages.
  const serviceLinks = serviceLinksFor(fromCity, toCity);

  // Relevant travel guides — de-orphans /guides/* and builds topical cluster.
  const guideLinks = guidesFor(fromCity, toCity);

  if (
    routeLinks.length === 0 &&
    citySlugs.length === 0 &&
    airportLinks.length === 0 &&
    serviceLinks.length === 0 &&
    guideLinks.length === 0
  )
    return null;

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
                  {r.distance} km · fare on WhatsApp
                </span>
              </span>
              <ArrowRight className="h-4 w-4 text-[#C9A84C] shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      )}

      {(citySlugs.length > 0 || airportLinks.length > 0 || serviceLinks.length > 0 || guideLinks.length > 0) && (
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
          {airportLinks.map((a) => (
            <Link
              key={a.slug}
              href={`/airports/${a.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#16A34A] hover:bg-[#16A34A]/10 transition-all"
            >
              <Plane className="h-3.5 w-3.5" />
              {a.label} taxi
            </Link>
          ))}
          {serviceLinks.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              {s.label}
            </Link>
          ))}
          {guideLinks.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#6B7280]/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#6B7280] hover:bg-[#6B7280]/10 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5" />
              {g.label}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
