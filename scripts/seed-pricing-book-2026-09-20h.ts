/**
 * One-off seed: 2026-09-20 batch 8.
 * - Oxagon (NEOM) -> Aqaba, Jordan round trip (the Chevrolet Tahoe quote whose
 *   route was missing from the earlier chat paste).
 * - Dammam -> Qatar, Sedan, SAR 1,500 (new price point for that route).
 * Run:  npx tsx --env-file=.env.local scripts/seed-pricing-book-2026-09-20h.ts
 */
import { prisma } from "../lib/prisma";

async function main() {
  const entries = [
    {
      fromCity: "Oxagon (NEOM)",
      toCity: "Aqaba (Jordan, round trip)",
      vehicleType: "SUV",
      price: 2200,
      tripType: "ROUND_TRIP",
      notes: "Chevrolet Tahoe; final best price, same price for 1 or 5 passengers since car covers full distance with border fees/fuel/driver time; client considered NEOM airport instead as a cheaper alternative",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Dammam",
      toCity: "Qatar",
      vehicleType: "Sedan",
      price: 1500,
      tripType: "ONE_WAY",
      notes: "Additional price point for this route/vehicle combo",
      source: "whatsapp_chat",
    },
  ];

  for (const e of entries) {
    const created = await prisma.priceBookEntry.create({ data: e });
    console.log("✓", created.fromCity, "→", created.toCity, created.vehicleType, created.price, created.currency, created.tripType);
  }
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
