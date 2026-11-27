/**
 * One-off diagnostic (pricing bug remediation, 2026-08-15).
 *
 * Before this fix, `/api/pricing` (called live by the `/book` wizard in the
 * browser) silently fell back to
 * `distance = clamp(30, 650, (pickup.length + dropoff.length) * 4.5)` — a
 * placeholder based on the CHARACTER LENGTH of the place names — whenever
 * Google Distance Matrix wasn't available (it never was: no Maps key was
 * configured). The resulting fare was then sent to /api/bookings as a plain
 * `totalPrice` number, so the Booking row itself never stored a `distance`
 * (that column stayed null — the bogus distance only ever existed
 * transiently in the browser/API response). This produced wildly wrong,
 * too-low fares for long/cross-border routes (e.g. Dammam -> Doha priced at
 * SAR 320 instead of a realistic ~SAR 2,464).
 *
 * Since `distance` isn't in the DB for these rows, detection works backward:
 * recompute the bogus distance from the stored pickup/dropoff text, run it
 * through the real pricing engine (same lib/pricing/quote.ts used live) for
 * the booking's vehicle class and trip time, and flag rows where that
 * reproduces the stored totalPrice almost exactly — strong evidence the
 * price came from the broken fallback, not a real quote.
 *
 * This script NEVER changes totalPrice, status, or any field except
 * appending a warning to `notes` so flagged rows sort to the top of the new
 * /admin/bookings page. An admin must manually verify and re-quote on
 * WhatsApp.
 *
 * Run:  npx tsx --env-file=.env.local scripts/flag-bogus-pricing.ts
 */
import { prisma } from "../lib/prisma";
import { quote } from "../lib/pricing";

const FLAG_MARKER = "SYSTEM FLAG";

function bogusFallbackDistance(pickup: string, dropoff: string): number {
  const charSum = pickup.length + dropoff.length;
  return Math.max(30, Math.min(650, charSum * 4.5));
}

async function main() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "asc" },
    include: { vehicle: { select: { type: true } } },
  });

  const matches: { id: string; bookingRef: string; customerName: string; totalPrice: number; reproducedPrice: number; notes: string | null }[] = [];

  for (const b of bookings) {
    if (b.notes?.includes(FLAG_MARKER)) continue; // already flagged, don't duplicate
    if (!b.totalPrice) continue; // 0 = never priced yet (post-fix flow), nothing to flag

    const bogusDistance = bogusFallbackDistance(b.pickupLocation, b.dropoffLocation);
    let reproduced: number;
    try {
      reproduced = quote({
        vehicleSlug: b.vehicle.type,
        distanceKmOverride: bogusDistance,
        datetime: b.pickupDateTime,
        options: { roundTrip: b.isRoundTrip },
      }).total;
    } catch {
      continue; // unknown vehicle slug etc — skip rather than guess
    }

    if (Math.abs(reproduced - b.totalPrice) < 1) {
      matches.push({ id: b.id, bookingRef: b.bookingRef, customerName: b.customerName, totalPrice: b.totalPrice, reproducedPrice: reproduced, notes: b.notes });
    }
  }

  console.log("──────────────────────────────────────────────");
  console.log(`Bookings scanned : ${bookings.length}`);
  console.log(`Bogus-price matches found : ${matches.length}`);
  console.log("──────────────────────────────────────────────");

  const flagText = `⚠ ${FLAG_MARKER}: price matches the placeholder distance formula (pre-2026-08-15 pricing bug) — verify manually before treating as final.`;

  for (const m of matches) {
    console.log(`  ${m.bookingRef}  ${m.customerName}  SAR ${m.totalPrice}  (reproduced via bogus formula: SAR ${m.reproducedPrice})`);
    await prisma.booking.update({
      where: { id: m.id },
      data: { notes: m.notes ? `${m.notes} | ${flagText}` : flagText },
    });
  }

  console.log(matches.length > 0 ? "Flagged rows updated." : "Nothing to flag.");
}

main()
  .catch((err) => {
    console.error("Flagging failed:", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
