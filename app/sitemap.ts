import { MetadataRoute } from "next";
import { ROUTES_DATA } from "@/lib/data/routes";
import { FLEET_VEHICLES } from "@/lib/fleet-data";
import { BLOG_POSTS, BLOG_POSTS_AR, lastModified as blogLastModified } from "@/lib/data/blog";
import { GUIDES } from "@/lib/data/guides";
import { RECOVERY_INDEXABLE_CITIES, RECOVERY_AR_CITIES } from "@/lib/data/recovery";
import { RECOVERY_ROUTES } from "@/lib/data/recovery-routes";
import { SUB_AREAS as SUB_AREAS_DATA } from "@/lib/data/subareas";
import { CITY_DETAILS } from "@/lib/data/locations";
import { AIRPORT_DETAILS } from "@/lib/data/airports";
import { AR_ROUTE_SLUGS } from "@/lib/config/i18n";
import { EVENT_SLUGS } from "@/lib/data/events";
import { DISTANCE_GUIDES } from "@/lib/data/distances";
import { CORRIDOR_SLUGS } from "@/lib/data/cross-border";

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
  { path: "/services/vip-transportation", priority: 0.9 },
  { path: "/services/wedding-car-rental", priority: 0.9 },
  { path: "/services/corporate-bahrain-transport", priority: 0.8 },
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

  // Arabic AlUla cluster (hub + children) — hreflang pairs of /locations/alula/*.
  const arAlulaItems = ["", "/private-driver", "/hegra", "/maraya", "/elephant-rock"].map((sub) => ({
    url: `${DOMAIN}/ar/locations/alula${sub}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: sub === "" ? 0.8 : 0.7,
  }));

  // Arabic Makkah hub + Ziyarat (hreflang pairs of the English pages).
  const arMakkahItems = ["/ar/locations/makkah", "/ar/services/makkah-ziyarat", "/ar/locations/madinah"].map((p) => ({
    url: `${DOMAIN}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Event/exhibition transport hub + curated event pages.
  const eventItems = [
    { url: `${DOMAIN}/events`, priority: 0.8 },
    { url: `${DOMAIN}/riyadh-alternative-airports`, priority: 0.8 },
    ...EVENT_SLUGS.map((slug) => ({ url: `${DOMAIN}/events/${slug}`, priority: 0.7 })),
  ].map((x) => ({ ...x, lastModified: now, changeFrequency: "weekly" as const }));

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

  // Cross-border corridor hubs (/cross-border/[corridor]) — from lib/data/cross-border.ts.
  const arCorridorItems = CORRIDOR_SLUGS.map((slug) => ({
    url: `${DOMAIN}/ar/cross-border/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const corridorItems = CORRIDOR_SLUGS.map((slug) => ({
    url: `${DOMAIN}/cross-border/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const routeItems = ROUTES_DATA.map((route) => ({
    url: `${DOMAIN}/routes/${route.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const distanceItems = [
    { url: `${DOMAIN}/distance`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    ...DISTANCE_GUIDES.map((g) => ({
      url: `${DOMAIN}/distance/${g.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  const fleetItems = FLEET_VEHICLES.map((vehicle) => ({
    url: `${DOMAIN}/fleet/${vehicle.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Blog: fixed publish/update dates (never "now"), Arabic articles listed
  // separately — each pair also cross-references via hreflang on the page.
  const blogItems = [
    ...BLOG_POSTS.map((post) => ({
      url: `${DOMAIN}/blog/${post.slug}`,
      lastModified: new Date(blogLastModified(post)),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...(BLOG_POSTS_AR.length ? [{ url: `${DOMAIN}/ar/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 }] : []),
    ...BLOG_POSTS_AR.map((post) => ({
      url: `${DOMAIN}/ar/blog/${post.slug}`,
      lastModified: new Date(blogLastModified(post)),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

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
    ...arAlulaItems,
    ...arMakkahItems,
    ...eventItems,
    ...locationItems,
    ...subAreaItems,
    ...airportItems,
    ...corridorItems,
    ...arCorridorItems,
    ...routeItems,
    ...distanceItems,
    ...fleetItems,
    ...blogItems,
    ...guideItems,
    ...recoveryItems,
    ...recoveryRouteItems,
    ...recoveryArItems,
  ];
}
