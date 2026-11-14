/**
 * One-off seed: real prices quoted to clients, pasted in chat 2026-09-20.
 * Run:  npx tsx --env-file=.env.local scripts/seed-pricing-book-2026-09-20.ts
 */
import { prisma } from "../lib/prisma";

async function main() {
  const entries = [
    {
      fromCity: "Jeddah Airport (JED)",
      toCity: "Makkah - Swissotel Al Maqam (Clock Tower)",
      vehicleType: "Sedan",
      price: 400,
      tripType: "ONE_WAY",
      notes:
        "Toyota Camry 2026; Terminal 1 arrival; incl. airport pickup, hotel drop-off, flight tracking, free wait for slight delay; trip date 2026-08-02, 3:20am, 4 pax, 2 bags",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Jeddah Airport (JED)",
      toCity: "Makkah - Swissotel Al Maqam (Clock Tower)",
      vehicleType: "Sedan",
      price: 450,
      tripType: "ONE_WAY",
      notes:
        "Toyota Camry 2026; arrival at any terminal other than T1; same inclusions as the 400 SAR quote; trip date 2026-08-02",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Jeddah Airport (JED)",
      toCity: "Makkah - Swissotel Al Maqam (Clock Tower)",
      vehicleType: "Sedan",
      price: 350,
      tripType: "ONE_WAY",
      notes:
        "Final negotiated price after client said 400/450 SAR too expensive; incl. airport parking fees; Toyota Camry 2026; trip date 2026-08-02",
      source: "whatsapp_chat",
    },
  ];

  for (const e of entries) {
    const created = await prisma.priceBookEntry.create({ data: e });
    console.log("✓", created.fromCity, "→", created.toCity, created.price, created.currency);
  }
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
