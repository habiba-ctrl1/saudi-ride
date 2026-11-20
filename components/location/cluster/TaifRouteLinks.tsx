import Link from "next/link";
import { ArrowRight, Mountain } from "lucide-react";
import { ROUTES_DATA } from "@/lib/data/routes";
import { formatDrive } from "@/components/cross-border/CorridorRouteCards";

// Taif route network (2026-11-21). One accessible list of every live Taif route,
// with distance/time read from ROUTES_DATA (single source of truth), so each
// Taif page links to its siblings, reverse leg, distance guides, the Taif hub
// and Taif airport. Rendered on the generic /routes/[slug] template for the
// Taif slugs that are not on the bespoke TAIF_ROUTE_PAGES layout, and on the
// bespoke ones via their `related` list.

const NETWORK: { slug: string; label: string }[] = [
  { slug: "makkah-to-taif", label: "Makkah → Taif" },
  { slug: "taif-to-makkah", label: "Taif → Makkah" },
  { slug: "makkah-hotels-to-taif-resorts", label: "Makkah hotels → Al Hada & Al Shafa resorts" },
  { slug: "jeddah-to-taif", label: "Jeddah → Taif" },
  { slug: "jeddah-airport-to-taif", label: "Jeddah Airport (JED) → Taif" },
  { slug: "taif-to-albaha", label: "Taif → Al Baha" },
  { slug: "madinah-to-taif", label: "Madinah → Taif" },
  { slug: "riyadh-to-taif", label: "Riyadh → Taif" },
];

const GUIDES = [
  { href: "/distance/makkah-to-taif", label: "Makkah–Taif distance guide" },
  { href: "/distance/jeddah-to-taif", label: "Jeddah–Taif distance guide" },
  { href: "/distance/riyadh-to-taif", label: "Riyadh–Taif distance guide" },
];

/** Generic-template slugs that get this block (bespoke Taif pages list links themselves). */
export const TAIF_LINKED_SLUGS = ["makkah-to-taif", "taif-to-makkah", "makkah-hotels-to-taif-resorts", "riyadh-to-taif"];

export function TaifRouteLinks({ slug }: { slug: string }) {
  const rows = NETWORK.map((n) => ({ ...n, r: ROUTES_DATA.find((x) => x.slug === n.slug) }))
    .filter((n) => n.r)
    .sort((a, b) => a.r!.distance - b.r!.distance);
  const max = Math.max(...rows.map((n) => n.r!.distance));

  return (
    <section aria-labelledby="taif-network" className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 md:p-8">
      <h2 id="taif-network" className="font-heading flex items-center gap-2 text-xl font-bold text-[#1C1C1C]">
        <Mountain className="h-5 w-5 text-[#16A34A]" aria-hidden /> Every private route to and from Taif
      </h2>
      <p className="mt-1 text-sm text-[#6B7280]">Approximate road distance and driving time before stops, shortest first.</p>
      <ul className="mt-5 space-y-2">
        {rows.map(({ slug: s, label, r }) => {
          const current = s === slug;
          const pct = Math.max(6, Math.round((r!.distance / max) * 100));
          const body = (
            <>
              <span className="flex items-baseline justify-between gap-3">
                <span className={`text-sm font-semibold ${current ? "text-[#1C1C1C]" : "text-[#16A34A]"}`}>
                  {label}{current && <span className="ms-2 text-xs font-medium text-[#6B7280]">(this page)</span>}
                </span>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-[#475569]">
                  ~{r!.distance.toLocaleString("en-US")} km · ~{formatDrive(r!.duration)}
                </span>
              </span>
              <span aria-hidden className="mt-1.5 block h-1.5 rounded-full bg-[#F0FDF4]">
                <span className="block h-1.5 rounded-full bg-[#16A34A]/70" style={{ width: `${pct}%` }} />
              </span>
            </>
          );
          return (
            <li key={s}>
              {current ? (
                <div aria-current="page" className="rounded-2xl bg-[#FAFAF7] px-4 py-3">{body}</div>
              ) : (
                <Link href={`/routes/${s}`} className="block min-h-[44px] rounded-2xl px-4 py-3 transition-colors hover:bg-[#F0FDF4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#16A34A]">{body}</Link>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#16A34A]/10 pt-4">
        <Link href="/locations/taif" className="inline-flex items-center gap-1 text-sm font-semibold text-[#16A34A] hover:underline">Taif transfers and private driver <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
        <Link href="/airports/taif-regional" className="inline-flex items-center gap-1 text-sm font-semibold text-[#16A34A] hover:underline">Taif Regional Airport (TIF) <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
        {GUIDES.map((g) => (
          <Link key={g.href} href={g.href} className="inline-flex items-center gap-1 text-sm font-semibold text-[#16A34A] hover:underline">{g.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link>
        ))}
      </div>
    </section>
  );
}
