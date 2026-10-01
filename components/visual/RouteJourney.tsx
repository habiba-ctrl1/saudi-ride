import { Car, MapPin } from "lucide-react";

/**
 * Route visualization — origin → destination with a connecting line and a
 * vehicle marker. Distance/time are OPTIONAL and only ever rendered when the
 * caller passes real values (from lib/data/routes.ts); this component never
 * fabricates them.
 *
 * Horizontal on desktop, vertical on mobile. Pure server component (no JS);
 * the hover emphasis lives in CSS via the `group` utility so it works without
 * hydration.
 */
export function RouteJourney({
  from,
  to,
  distance,
  duration,
  vehicleLabel,
  className = "",
}: {
  from: string;
  to: string;
  distance?: string;
  duration?: string;
  vehicleLabel?: string;
  className?: string;
}) {
  const meta = [distance, duration].filter(Boolean).join(" · ");

  return (
    <div
      className={`group rounded-3xl border border-[#16A34A]/12 bg-white p-6 sm:p-8 transition-colors hover:border-[#16A34A]/35 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        {/* Origin */}
        <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#16A34A]/10 text-[#16A34A]">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <span className="block text-eyebrow text-[#6B7280]">From</span>
            <span className="block text-lg font-bold text-[#0F172A]">{from}</span>
          </div>
        </div>

        {/* Connector */}
        <div className="relative flex flex-1 items-center sm:px-4">
          {/* line: horizontal on desktop, vertical rail on mobile */}
          <div className="hidden sm:block h-px w-full bg-gradient-to-r from-[#16A34A]/30 via-[#16A34A]/50 to-[#16A34A]/30" />
          <div className="sm:hidden ms-5 h-10 w-px bg-gradient-to-b from-[#16A34A]/40 to-[#16A34A]/40" />
          <span className="absolute start-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:flex h-9 w-9 items-center justify-center rounded-full border border-[#16A34A]/25 bg-white text-[#16A34A] shadow-sm transition-transform duration-300 group-hover:scale-110">
            <Car className="h-4 w-4" />
          </span>
          {meta && (
            <span className="absolute start-1/2 top-full hidden -translate-x-1/2 sm:block whitespace-nowrap pt-3 text-xs font-semibold text-[#6B7280]">
              {meta}
            </span>
          )}
        </div>

        {/* Destination */}
        <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2 sm:text-end">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FACC15]/20 text-[#15803D]">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <span className="block text-eyebrow text-[#6B7280]">To</span>
            <span className="block text-lg font-bold text-[#0F172A]">{to}</span>
          </div>
        </div>
      </div>

      {(meta || vehicleLabel) && (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#16A34A]/10 pt-4 sm:hidden">
          {meta && (
            <span className="rounded-full bg-[#16A34A]/[0.07] px-3 py-1 text-xs font-semibold text-[#15803D]">
              {meta}
            </span>
          )}
          {vehicleLabel && (
            <span className="rounded-full bg-[#16A34A]/[0.07] px-3 py-1 text-xs font-semibold text-[#15803D]">
              {vehicleLabel}
            </span>
          )}
        </div>
      )}
      {vehicleLabel && meta && (
        <div className="mt-6 hidden sm:flex justify-center">
          <span className="rounded-full bg-[#16A34A]/[0.07] px-3 py-1 text-xs font-semibold text-[#15803D]">
            {vehicleLabel}
          </span>
        </div>
      )}
    </div>
  );
}
