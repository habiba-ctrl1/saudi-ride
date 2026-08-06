/**
 * One-off lead-recovery export (Phase 1A, item 1).
 *
 * Dumps EVERY row of the Prisma `Booking` table (the table the /book wizard
 * writes to) to a CSV so we can see whether real enquiries have been sitting
 * unread because /api/bookings never notified anyone.
 *
 * Read-only: this script only SELECTs. It never writes or deletes.
 *
 * Run:  npx tsx --env-file=.env.local scripts/export-leads.ts
 * Out:  docs/audit/existing-leads.csv  (+ count & date range printed to stdout)
 *
 * NOTE on UTM/source columns: the Booking table has no UTM/source columns yet
 * (they are added by Phase 1A items 3 & 6). Those columns are emitted empty
 * here so the CSV shape is stable going forward.
 */
import { prisma } from "../lib/prisma";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

const OUT = join(process.cwd(), "docs", "audit", "existing-leads.csv");

const HEADERS = [
  "created_at",
  "booking_ref",
  "name",
  "phone",
  "email",
  "route",
  "vehicle",
  "pickup_date_time",
  "quoted_price_sar",
  "status",
  "payment_status",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "source",
] as const;

/** RFC-4180 CSV cell escaping. */
function csv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function main() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "asc" },
    include: { vehicle: { select: { name: true, type: true } } },
  });

  const rows = bookings.map((b) =>
    [
      b.createdAt.toISOString(),
      b.bookingRef,
      b.customerName,
      b.customerPhone,
      b.customerEmail ?? "",
      `${b.pickupLocation} -> ${b.dropoffLocation}`,
      b.vehicle?.name ?? b.vehicle?.type ?? "",
      b.pickupDateTime.toISOString(),
      b.totalPrice,
      b.status,
      b.paymentStatus,
      "", // utm_source   — not captured before Phase 1A
      "", // utm_medium
      "", // utm_campaign
      "", // source
    ]
      .map(csv)
      .join(","),
  );

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, [HEADERS.join(","), ...rows].join("\n") + "\n", "utf8");

  const count = bookings.length;
  const first = count ? bookings[0].createdAt.toISOString() : "—";
  const last = count ? bookings[count - 1].createdAt.toISOString() : "—";

  console.log("──────────────────────────────────────────────");
  console.log(`Bookings exported : ${count}`);
  console.log(`Date range        : ${first}  →  ${last}`);
  console.log(`CSV written to     : ${OUT}`);
  console.log("──────────────────────────────────────────────");
}

main()
  .catch((err) => {
    console.error("Export failed:", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
