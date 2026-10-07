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
  ["abu dhabi", "abudhabi"],
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

  const chipGroups = [
    { label: "Cities", items: citySlugs.map((c) => ({ key: c, href: `/locations/${c}`, icon: MapPin, text: `Taxi service in ${c.charAt(0).toUpperCase() + c.slice(1)}` })) },
    { label: "Airports", items: airportLinks.map((a) => ({ key: a.slug, href: `/airports/${a.slug}`, icon: Plane, text: `${a.label} taxi` })) },
    { label: "Services", items: serviceLinks.map((sv) => ({ key: sv.href, href: sv.href, icon: ArrowRight, text: sv.label })) },
    { label: "Travel guides", items: guideLinks.map((g) => ({ key: g.slug, href: `/guides/${g.slug}`, icon: BookOpen, text: g.label })) },
  ].filter((g) => g.items.length > 0);

  return (
    <section className="mt-16 border-t border-[#0F172A]/[0.07] pt-12">
      <span className="t-eyebrow">Plan the next leg</span>
      <h2 className="t-h2 mt-3 mb-7 !text-[clamp(1.4rem,2.4vw,1.9rem)]">
        Related Taxi Routes &amp; City Guides
      </h2>

      {routeLinks.length > 0 && (
        <div className="mb-8 grid gap-3 sm:grid-cols-2" data-stagger>
          {routeLinks.map((r) => (
            <Link
              key={r.slug}
              href={`/routes/${r.slug}`}
              className="no-lift group flex items-center gap-4 rounded-2xl border border-[#0F172A]/[0.08] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:shadow-[0_14px_30px_-18px_rgba(22,163,74,0.6)] sm:px-5"
            >
              <span aria-hidden className="flex flex-col items-center gap-1 self-stretch py-1">
                <span className="h-2.5 w-2.5 rounded-full bg-[#16A34A]" />
                <span className="w-px flex-1 border-s-2 border-dotted border-[#16A34A]/35" />
                <span className="h-2.5 w-2.5 rounded-full border-2 border-[#16A34A] bg-white" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-[#0F172A] transition-colors group-hover:text-[#15803D]">
                  Taxi {r.fromCity} to {r.toCity}
                </span>
                <span className="mt-0.5 block text-xs text-[#64748B]">
                  {r.distance > 0 ? `${r.distance} km · fare on WhatsApp` : "fare on WhatsApp"}
                </span>
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F0FDF4] text-[#16A34A] transition-colors group-hover:bg-[#16A34A] group-hover:text-[#FFFFFF]">
                <ArrowRight className="rtl:-scale-x-100 h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      )}

      {chipGroups.length > 0 && (
        <div className="grid gap-5 rounded-3xl border border-[#16A34A]/12 bg-[#F6FAF6] p-5 sm:p-6 md:grid-cols-2">
          {chipGroups.map((g) => (
            <div key={g.label}>
              <p className="t-meta mb-2.5 uppercase tracking-[0.14em]">{g.label}</p>
              <div className="flex flex-wrap gap-2">
                {g.items.map(({ key, href, icon: Icon, text }) => (
                  <Link key={key} href={href} className="chip">
                    <Icon className="rtl:-scale-x-100" />
                    {text}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
