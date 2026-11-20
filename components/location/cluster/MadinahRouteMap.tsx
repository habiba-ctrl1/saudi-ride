import Link from "next/link";
import { routeFact } from "@/lib/data/cluster";
import { MADINAH_MAP_NODES } from "@/lib/data/madinah-cluster";
import { AR_ROUTE_CONTENT_SLUGS } from "@/lib/data/routes-content-ar";

// Schematic route diagram (not to scale): Madinah in the centre, each real
// route page as a clickable spoke. Distances come from routeFact(); the same
// links are also listed as plain HTML in the corridor board below it, so this
// is a visual layer on top of crawlable links, never a replacement.
const CX = 320;
const CY = 215;

export function MadinahRouteMap({ ar = false }: { ar?: boolean }) {
  const nodes = MADINAH_MAP_NODES.map((n) => ({ ...n, f: routeFact(n.slug) })).filter((n) => n.f);
  return (
    <figure className="overflow-hidden rounded-3xl border border-[#16A34A]/15 bg-gradient-to-br from-[#F0FDF4] to-white p-2 sm:p-4">
      <svg viewBox="0 0 640 380" role="group" aria-label={ar ? "مخطط الطرق: المدينة المنورة ومكة المكرمة وجدة ومطار جدة وينبع وتبوك والعلا والرياض" : "Route diagram: Madinah connected to Makkah, Jeddah, Jeddah Airport, Yanbu, Tabuk, AlUla and Riyadh"} className="h-auto w-full">
        <defs>
          <pattern id="md-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="#16A34A" strokeOpacity="0.07" />
          </pattern>
        </defs>
        <rect width="640" height="380" fill="url(#md-grid)" />
        {nodes.map((n) => (
          <line key={`l-${n.id}`} x1={CX} y1={CY} x2={n.x} y2={n.y} stroke="#16A34A" strokeOpacity="0.45" strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round" />
        ))}
        {nodes.map((n) => {
          const right = n.x > CX;
          return (
            <Link key={n.id} href={ar && AR_ROUTE_CONTENT_SLUGS.includes(n.slug) ? `/ar/routes/${n.slug}` : `/routes/${n.slug}`} aria-label={ar ? `المدينة المنورة إلى ${n.labelAr}، ${n.f!.km} كم` : `Madinah to ${n.label}, ${n.f!.km} kilometres, ${n.f!.time}`}>
              <g className="cursor-pointer [&:hover_circle]:fill-[#FACC15] [&:focus-visible_circle]:fill-[#FACC15]">
                <circle cx={n.x} cy={n.y} r="9" fill="#16A34A" stroke="#FFFFFF" strokeWidth="3" />
                <rect x={right ? n.x - 128 : n.x + 4} y={n.y - 46} width="124" height="34" rx="10" fill="#FFFFFF" stroke="#E5E7EB" />
                <text x={right ? n.x - 66 : n.x + 66} y={n.y - 33} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#1C1C1C">{ar ? n.labelAr : n.label}</text>
                <text x={right ? n.x - 66 : n.x + 66} y={n.y - 19} textAnchor="middle" fontSize="10.5" fill="#6B7280">{ar ? `${n.f!.km} كم` : `${n.f!.km} km · ${n.f!.time}`}</text>
                <title>{ar ? `المدينة المنورة ↔ ${n.labelAr}` : `Madinah ↔ ${n.label}`}</title>
              </g>
            </Link>
          );
        })}
        <g>
          <circle cx={CX} cy={CY} r="34" fill="#0B1F14" />
          <circle cx={CX} cy={CY} r="34" fill="none" stroke="#FACC15" strokeWidth="2.5" />
          <text x={CX} y={CY + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill="#FFFFFF">{ar ? "المدينة" : "Madinah"}</text>
        </g>
      </svg>
      <figcaption className="px-3 pb-3 pt-1 text-center text-[0.75rem] text-[#6B7280]">
        {ar ? "رسم تخطيطي غير مقيّس. اضغط على المدينة لفتح صفحة المسار. المسافات تقريبية." : "Schematic, not to scale. Tap a city to open its route page. Distances and times are approximate and come from our route data."}
      </figcaption>
    </figure>
  );
}
