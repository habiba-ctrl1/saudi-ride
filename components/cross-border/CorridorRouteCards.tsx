import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { arDrive } from "@/lib/data/cross-border-ar";

// Route cards for a corridor. Distance/time come straight from ROUTES_DATA
// (single source of truth, CLAUDE.md §17) — never typed here.
export interface CorridorRoute {
  slug: string;
  fromCity: string;
  toCity: string;
  fromCityAr?: string;
  toCityAr?: string;
  distance: number;
  duration: number;
}

export function formatDrive(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function CorridorRouteCards({ heading, routes, id, locale = "en", arSlugs = [] }: { heading: string; routes: CorridorRoute[]; id?: string; locale?: "en" | "ar"; arSlugs?: string[] }) {
  const ar = locale === "ar";
  if (!routes.length) return null;
  return (
    <div id={id}>
      <h3 className="font-heading mb-3 text-lg font-bold text-[#1C1C1C]">{heading}</h3>
      <ul className="grid gap-3 sm:grid-cols-2">
        {routes.map((r) => (
          <li key={r.slug}>
            <Link
              href={ar && arSlugs.includes(r.slug) ? `/ar/routes/${r.slug}` : `/routes/${r.slug}`}
              className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-[#16A34A]/15 bg-white px-4 py-3.5 transition-colors hover:border-[#16A34A]/45"
            >
              <span className="min-w-0">
                <span className="block font-semibold text-[#1C1C1C]">
                  {ar ? `${r.fromCityAr} إلى ${r.toCityAr}` : `${r.fromCity} to ${r.toCity}`}
                </span>
                <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#6B7280]">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden />{ar ? `حوالي ${r.distance.toLocaleString("en-US")} كم` : `~${r.distance.toLocaleString("en-US")} km`}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden />{ar ? `${arDrive(r.duration)} + الحدود` : `~${formatDrive(r.duration)} + border`}</span>
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-[#16A34A] transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
