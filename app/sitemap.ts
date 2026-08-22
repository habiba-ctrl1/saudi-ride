import { MetadataRoute } from "next";
import { ROUTES_DATA } from "@/lib/data/routes";
import { FLEET_VEHICLES } from "@/lib/fleet-data";
import { BLOG_POSTS_DATA } from "@/lib/data/blog-posts";
import { GUIDES } from "@/lib/data/guides";
import { RECOVERY_INDEXABLE_CITIES, RECOVERY_AR_CITIES } from "@/lib/data/recovery";
import { RECOVERY_ROUTES } from "@/lib/data/recovery-routes";
import { SUB_AREAS as SUB_AREAS_DATA } from "@/lib/data/subareas";
import { CITY_DETAILS } from "@/lib/data/locations";
import { AIRPORT_DETAILS } from "@/lib/data/airports";
import { AR_ROUTE_SLUGS } from "@/lib/config/i18n";

const DOMAIN = "https://taxisaudiarabia.com";

// NOTE (SEO):
// - /book, /track-booking, /partners/driver-registration are noindex → sitemap mein nahi.
// - Routes ab ROUTES_DATA (static) se — DB down ho to bhi 56 routes sitemap mein rahen.
// - /ar/* real SSR routes only for pages with actual Arabic content (see AR_PAGES below);
//   every other /ar/* path 301-redirects to English (middleware.ts) so it's not indexed.
// - LOCATIONS/AIRPORTS/SUB_AREAS below are derived from the same data the pages render from
//   (CITY_DETAILS/AIRPORT_DETAILS/SUB_AREAS) — add a new city/airport/subarea once and the
//   sitemap picks it up automatically, no separate list to remember to update.

const AR_PAGES = ["", "/about", "/contact", "/faq", "/pricing", "/partners"];

const STATIC_PAGES = [
  { path: "", priority: 1.0 },
  { path: "/about", priority: 0.6 },
  { path: "/contact", priority: 0.6 },
  { path: "/faq", priority: 0.7 },
  { path: "/gallery", priority: 0.5 },
  { path: "/fleet", priority: 0.9 },
  { path: "/routes", priority: 0.9 },
  { path: "/services", priority: 0.9 },
  { path: "/services/airport-transfers", priority: 0.9 },
  { path: "/services/border-crossings", priority: 0.8 },
  { path: "/services/corporate", priority: 0.8 },
  { path: "/services/intercity", priority: 0.9 },
  { path: "/services/tourism", priority: 0.8 },
  { path: "/services/umrah-transport", priority: 0.9 },
  { path: "/services/group-transport", priority: 0.8 },
  { path: "/services/hajj-transport", priority: 0.9 },
  { path: "/services/vip-luxury", priority: 0.8 },
  { path: "/services/madinah-ziyarat", priority: 0.9 },
  { path: "/services/makkah-ziyarat", priority: 0.9 },
  { path: "/services/business-executive", priority: 0.8 },
  { path: "/services/heritage-tours", priority: 0.8 },
  { path: "/services/car-recovery", priority: 0.9 },
  { path: "/pricing", priority: 0.7 },
  { path: "/guides", priority: 0.8 },
  { path: "/blog", priority: 0.8 },
];

const LOCATIONS = Object.keys(CITY_DETAILS);

const SUB_AREAS = Object.values(SUB_AREAS_DATA).map((s) => ({ city: s.city, subarea: s.subarea }));

const AIRPORTS = Object.keys(AIRPORT_DETAILS);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticItems = STATIC_PAGES.map((page) => ({
    url: `${DOMAIN}${page.path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: page.priority,
  }));

  const arItems = AR_PAGES.map((path) => ({
    url: `${DOMAIN}/ar${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // Curated Arabic route pages (real SSR under app/ar/routes/*). Kept in sync
  // with the English routes via AR_ROUTE_SLUGS so hreflang has a crawlable pair.
  const arRouteItems = AR_ROUTE_SLUGS.map((slug) => ({
    url: `${DOMAIN}/ar/routes/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const locationItems = LOCATIONS.map((loc) => ({
    url: `${DOMAIN}/locations/${loc}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const airportItems = AIRPORTS.map((airport) => ({
    url: `${DOMAIN}/airports/${airport}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const subAreaItems = SUB_AREAS.map((loc) => ({
    url: `${DOMAIN}/locations/${loc.city}/${loc.subarea}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const routeItems = ROUTES_DATA.map((route) => ({
    url: `${DOMAIN}/routes/${route.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const fleetItems = FLEET_VEHICLES.map((vehicle) => ({
    url: `${DOMAIN}/fleet/${vehicle.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogItems = BLOG_POSTS_DATA.filter((post) => post.published).map((post) => ({
    url: `${DOMAIN}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const recoveryItems = RECOVERY_INDEXABLE_CITIES.map((c) => ({
    url: `${DOMAIN}/services/car-recovery/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: c.region === "eastern" ? 0.8 : 0.7,
  }));

  const recoveryRouteItems = RECOVERY_ROUTES.map((r) => ({
    url: `${DOMAIN}/services/car-recovery/${r.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Arabic recovery pages: hub + Eastern-Province cities + routes.
  const recoveryArItems = [
    { url: `${DOMAIN}/ar/services/car-recovery`, priority: 0.7 },
    ...RECOVERY_AR_CITIES.map((c) => ({ url: `${DOMAIN}/ar/services/car-recovery/${c.slug}`, priority: 0.8 })),
    ...RECOVERY_ROUTES.map((r) => ({ url: `${DOMAIN}/ar/services/car-recovery/${r.slug}`, priority: 0.8 })),
  ].map((x) => ({ ...x, lastModified: now, changeFrequency: "weekly" as const }));

  const guideItems = GUIDES.map((guide) => ({
    url: `${DOMAIN}/guides/${guide.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticItems,
    ...arItems,
    ...arRouteItems,
    ...locationItems,
    ...subAreaItems,
    ...airportItems,
    ...routeItems,
    ...fleetItems,
    ...blogItems,
    ...guideItems,
    ...recoveryItems,
    ...recoveryRouteItems,
    ...recoveryArItems,
  ];
}
