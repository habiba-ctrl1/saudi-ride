import { Car, MapPin, Flag } from "lucide-react";

/**
 * Stylized route diagram — origin → destination on a drawn, curved route
 * line with markers. It is deliberately NOT a map: the curve is decorative
 * and implies no geography. Distance/time are OPTIONAL and only rendered when
 * the caller passes real values (from lib/data/routes.ts); this component
 * never fabricates them.
 *
 * Desktop: horizontal diagram, the route draws itself on reveal and dashes
 * flow toward the destination. Mobile: a vertical journey rail.
 * Pure server component — motion is CSS (`.tsa-route`), reduced-motion safe.
 */
export function RouteJourney({
  from,
  to,
  distance,
  duration,
  vehicleLabel,
  via,
  className = "",
}: {
  from: string;
  to: string;
  distance?: string;
  duration?: string;
  vehicleLabel?: string;
  /** Optional real waypoint label (e.g. "Haramain Expressway"); never invented. */
  via?: string;
  className?: string;
}) {
  const chips = [distance, duration, vehicleLabel].filter(Boolean) as string[];

  return (
    <div
      className={`tsa-route group relative overflow-hidden rounded-[28px] border border-[#0F172A]/[0.07] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_18px_44px_-24px_rgba(15,23,42,0.25)] sm:p-8 ${className}`}
    >
      {/* Faint dotted terrain texture — decorative only */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{ backgroundImage: "radial-gradient(rgba(22,163,74,0.12) 1px, transparent 1px)", backgroundSize: "18px 18px", maskImage: "linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent)" }}
      />

      {/* ── Desktop / tablet: horizontal diagram ── */}
      <div className="relative hidden sm:block">
        <div className="relative h-36">
          <svg viewBox="0 0 600 140" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible rtl:-scale-x-100" aria-hidden>
            <defs>
              <linearGradient id="tsa-route-grad" x1="0" x2="1">
                <stop offset="0" stopColor="#16A34A" />
                <stop offset="1" stopColor="#EAB308" />
              </linearGradient>
            </defs>
            <path d="M 30 100 C 170 10, 300 150, 420 60 S 540 40, 570 70" fill="none" stroke="rgba(15,23,42,0.07)" strokeWidth="10" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <path className="tsa-route-draw" d="M 30 100 C 170 10, 300 150, 420 60 S 540 40, 570 70" fill="none" stroke="url(#tsa-route-grad)" strokeWidth="3.5" strokeLinecap="round" pathLength={1} vectorEffect="non-scaling-stroke" />
            <path className="anim-dash" d="M 30 100 C 170 10, 300 150, 420 60 S 540 40, 570 70" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="2 10" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.9" />
          </svg>

          {/* Markers (HTML so labels stay crisp and RTL-aware) */}
          <span className="absolute start-[5%] top-[71%] -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2">
            <span className="anim-pulse flex h-10 w-10 items-center justify-center rounded-full bg-[#16A34A] text-[#FFFFFF] shadow-lg ring-4 ring-white">
              <MapPin className="h-5 w-5" aria-hidden />
            </span>
          </span>
          <span className="absolute start-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#16A34A]/25 bg-white text-[#16A34A] shadow-md transition-transform duration-500 group-hover:scale-110" style={{ animation: "tsa-float 3.2s ease-in-out infinite" }}>
              <Car className="h-4 w-4" aria-hidden />
            </span>
          </span>
          <span className="absolute start-[95%] top-[50%] -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FACC15] text-[#14532D] shadow-lg ring-4 ring-white">
              <Flag className="h-5 w-5" aria-hidden />
            </span>
          </span>
        </div>

        <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-end gap-4">
          <div>
            <span className="t-meta block uppercase tracking-[0.14em]">From</span>
            <span className="mt-1 block font-heading text-xl font-extrabold leading-tight text-[#0F172A]">{from}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pb-1">
            {via && <span className="chip">via {via}</span>}
            {chips.map((c) => (
              <span key={c} className="chip">{c}</span>
            ))}
          </div>
          <div className="text-end">
            <span className="t-meta block uppercase tracking-[0.14em]">To</span>
            <span className="mt-1 block font-heading text-xl font-extrabold leading-tight text-[#0F172A]">{to}</span>
          </div>
        </div>
      </div>

      {/* ── Mobile: vertical journey rail ── */}
      <ol className="relative sm:hidden">
        <span aria-hidden className="absolute start-5 top-10 bottom-10 w-0 -translate-x-1/2 border-s-[3px] border-dotted border-[#16A34A]/40 rtl:translate-x-1/2" />
        <li className="relative flex items-center gap-4 pb-6">
          <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#16A34A] text-[#FFFFFF] ring-4 ring-white">
            <MapPin className="h-5 w-5" aria-hidden />
          </span>
          <span>
            <span className="t-meta block uppercase tracking-[0.14em]">From</span>
            <span className="block font-heading text-lg font-extrabold text-[#0F172A]">{from}</span>
          </span>
        </li>
        {(chips.length > 0 || via) && (
          <li className="relative flex items-center gap-4 pb-6">
            <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#16A34A]/25 bg-white text-[#16A34A]">
              <Car className="h-4 w-4" aria-hidden />
            </span>
            <span className="flex flex-wrap gap-1.5">
              {via && <span className="chip">via {via}</span>}
              {chips.map((c) => (
                <span key={c} className="chip">{c}</span>
              ))}
            </span>
          </li>
        )}
        <li className="relative flex items-center gap-4">
          <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FACC15] text-[#14532D] ring-4 ring-white">
            <Flag className="h-5 w-5" aria-hidden />
          </span>
          <span>
            <span className="t-meta block uppercase tracking-[0.14em]">To</span>
            <span className="block font-heading text-lg font-extrabold text-[#0F172A]">{to}</span>
          </span>
        </li>
      </ol>
    </div>
  );
}
