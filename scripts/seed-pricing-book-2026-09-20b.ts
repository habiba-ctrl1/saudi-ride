/**
 * One-off seed: Dammam <-> Abha prices quoted to a client, chat 2026-09-20.
 * Run:  npx tsx --env-file=.env.local scripts/seed-pricing-book-2026-09-20b.ts
 */
import { prisma } from "../lib/prisma";

async function main() {
  const entries = [
    {
      fromCity: "Dammam",
      toCity: "Abha",
      vehicleType: "SUV",
      price: 4600,
      tripType: "ONE_WAY",
      notes: "GMC (2026 model); one-way leg quoted as part of a round-trip request; trip 7/29, 2:00pm pickup",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Abha",
      toCity: "Dammam",
      vehicleType: "SUV",
      price: 4600,
      tripType: "ONE_WAY",
      notes: "GMC (2026 model); return leg; driver's 24hr overnight wait in Abha billed separately at 1,000 SAR",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Dammam",
      toCity: "Abha",
      vehicleType: "SUV",
      price: 10000,
      tripType: "ROUND_TRIP",
      notes:
        "All-inclusive round-trip (2x4,600 one-way + 1,000 overnight wait = 10,200, discounted to 10,000); GMC 2026; initial offer before further negotiation; trip 7/29",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Dammam",
      toCity: "Abha",
      vehicleType: "SUV",
      price: 9500,
      tripType: "ROUND_TRIP",
      notes:
        "Final firm lowest round-trip offer (incl. overnight wait) after client cited a competitor quote of 5,000 SAR on a 2025-model car; client declined and booked with the competitor; GMC 2026; trip 7/29",
      source: "whatsapp_chat",
    },
  ];

  for (const e of entries) {
    const created = await prisma.priceBookEntry.create({ data: e });
    console.log("✓", created.fromCity, "→", created.toCity, created.price, created.currency, created.tripType);
  }
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
