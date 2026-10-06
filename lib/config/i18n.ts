import { RECOVERY_AR_CITIES } from "@/lib/data/recovery";
import { RECOVERY_ROUTES } from "@/lib/data/recovery-routes";
import { AR_ROUTE_CONTENT_SLUGS } from "@/lib/data/routes-content-ar";
// cross-border-ar has no runtime imports (types only), so middleware stays lean.
import { AR_XB_ROUTE_SLUGS, AR_CORRIDORS } from "@/lib/data/cross-border-ar";
import { AR_BLOG_SLUG_LIST } from "@/lib/data/blog/ar-slugs";

// Recovery/transport paths that have real Arabic SSR pages under
// app/ar/services/car-recovery/*. Generated from data so a new Eastern-Province
// city or route is registered automatically (otherwise middleware.ts would
// 301-redirect its /ar URL to English and it would never index).
const RECOVERY_AR_PATHS = [
  "/services/car-recovery",
  ...RECOVERY_AR_CITIES.map((c) => `/services/car-recovery/${c.slug}`),
  ...RECOVERY_ROUTES.map((r) => `/services/car-recovery/${r.slug}`),
];

// Route slugs that have curated Arabic content and thus a real SSR page under
// the dynamic app/ar/routes/[slug]. Single source of truth is AR_ROUTE_CONTENT
// (lib/data/routes-content-ar.ts): middleware uses this list (via
// AR_REAL_ROUTES) to allow the /ar URL, and the English routes/[slug] page uses
// it to emit bidirectional hreflang. Add a slug by adding its AR_ROUTE_CONTENT
// entry — no need to touch this file.
// Includes the bespoke Arabic cross-border routes (lib/data/cross-border-ar.ts).
export const AR_ROUTE_SLUGS = [...AR_ROUTE_CONTENT_SLUGS, ...AR_XB_ROUTE_SLUGS];

// Arabic cross-border corridor hubs (app/(ar)/ar/cross-border/[corridor]).
export const AR_CROSS_BORDER_PATHS = Object.keys(AR_CORRIDORS).map((c) => `/cross-border/${c}`);

// Pages that have real Arabic translations and their own SSR route under app/ar/*.
export const AR_REAL_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/faq",
  "/pricing",
  "/partners",
  ...AR_ROUTE_SLUGS.map((s) => `/routes/${s}`),
  // Arabic AlUla cluster (app/(ar)/ar/locations/alula/*) — hub + children.
  "/locations/alula",
  // Kept as a literal list (not imported from the data module) so middleware stays lean.
  ...["private-driver", "hegra", "maraya", "elephant-rock"].map((s) => `/locations/alula/${s}`),
  ...AR_CROSS_BORDER_PATHS,
  ...RECOVERY_AR_PATHS,
  // Arabic blog (app/ar/blog/*) — only slugs with a real localized article.
  "/blog",
  ...AR_BLOG_SLUG_LIST.map((s) => `/blog/${s}`),
];

// Noindex utility pages that still switch to Arabic client-side (via
// LanguageContext) but don't need a dedicated SSR route since they're never indexed.
export const AR_REWRITE_ROUTES = ["/book", "/track-booking", "/partners/driver-registration"];

export const AR_AVAILABLE_ROUTES = [...AR_REAL_ROUTES, ...AR_REWRITE_ROUTES];
