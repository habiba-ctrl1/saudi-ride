import { RECOVERY_AR_CITIES } from "@/lib/data/recovery";
import { RECOVERY_ROUTES } from "@/lib/data/recovery-routes";

// Recovery/transport paths that have real Arabic SSR pages under
// app/ar/services/car-recovery/*. Generated from data so a new Eastern-Province
// city or route is registered automatically (otherwise middleware.ts would
// 301-redirect its /ar URL to English and it would never index).
const RECOVERY_AR_PATHS = [
  "/services/car-recovery",
  ...RECOVERY_AR_CITIES.map((c) => `/services/car-recovery/${c.slug}`),
  ...RECOVERY_ROUTES.map((r) => `/services/car-recovery/${r.slug}`),
];

// Route slugs that have a curated Arabic SSR page under app/ar/routes/<slug>.
// Single source of truth: middleware uses it (via AR_REAL_ROUTES) to allow the
// /ar URL, and the English routes/[slug] page uses it to emit bidirectional
// hreflang. Add a slug here only after its app/ar/routes/<slug>/page.tsx exists.
export const AR_ROUTE_SLUGS = [
  "jeddah-airport-to-makkah",
  "riyadh-to-dammam",
  "dammam-to-doha",
  "makkah-to-madinah",
  "jeddah-to-madinah",
];

// Pages that have real Arabic translations and their own SSR route under app/ar/*.
export const AR_REAL_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/faq",
  "/pricing",
  "/partners",
  ...AR_ROUTE_SLUGS.map((s) => `/routes/${s}`),
  ...RECOVERY_AR_PATHS,
];

// Noindex utility pages that still switch to Arabic client-side (via
// LanguageContext) but don't need a dedicated SSR route since they're never indexed.
export const AR_REWRITE_ROUTES = ["/book", "/track-booking", "/partners/driver-registration"];

export const AR_AVAILABLE_ROUTES = [...AR_REAL_ROUTES, ...AR_REWRITE_ROUTES];
