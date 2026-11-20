// Marketing multiplier applied to a route's sedan basePrice to derive the
// other vehicle-class "starting from" prices. Single source for
// app/(marketing)/routes/[slug]/page.tsx and app/pricing/page.tsx — these were
// previously two independently hand-maintained literals that happened to
// agree; kept as one so they can't silently drift apart again.
export const VEHICLE_PRICE_MULTIPLIERS: Record<string, number> = {
  sedan: 1,
  suv: 1.5,
  van: 1.35,
  luxury: 2.5,
  bus: 3.8,
};
