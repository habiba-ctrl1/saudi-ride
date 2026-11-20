/**
 * One-off seed: real prices quoted to clients, pasted in chat 2026-09-20 (batch 3).
 * Covers 4 separate WhatsApp threads: Dammam-Dubai cross-border, Makkah-Madina
 * S-Class round trip, Makkah-Madina same-day 3-pax group, Yanbu-Jeddah Airport
 * mixed-vehicle round trip.
 * Run:  npx tsx --env-file=.env.local scripts/seed-pricing-book-2026-09-20c.ts
 */
import { prisma } from "../lib/prisma";

async function main() {
  const entries = [
    // Thread 1: Dammam -> Dubai cross-border, client wanted Sedan, 2 pax + 2 luggage, 2026-08-20 9pm
    {
      fromCity: "Dammam",
      toCity: "Dubai",
      vehicleType: "SUV",
      price: 4000,
      tripType: "ONE_WAY",
      notes:
        "Quoted in error — client had requested Sedan, not SUV. Cross-border transfer incl. in price. 2 pax, 2 luggage, trip 2026-08-20 9pm",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Dammam",
      toCity: "Dubai",
      vehicleType: "Sedan",
      price: 2800,
      tripType: "ONE_WAY",
      notes: "Ford Taurus; corrected quote after client complained about being offered SUV; cross-border transfer incl.; 2 pax, 2 luggage, trip 2026-08-20 9pm",
      source: "whatsapp_chat",
    },

    // Thread 2: Makkah (Fairmont) <-> Madina (Sofitel) round trip, S-Class negotiation
    {
      fromCity: "Makkah (Fairmont)",
      toCity: "Madina (Sofitel)",
      vehicleType: "Luxury",
      price: 700,
      tripType: "ONE_WAY",
      notes: "Lexus ES 300h 2026 model; offered alongside the S450 as a cheaper alternative — trip type not fully confirmed in chat, logged as one-way; verify before reusing",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Makkah (Fairmont)",
      toCity: "Madina (Sofitel)",
      vehicleType: "Luxury",
      price: 4100,
      tripType: "ROUND_TRIP",
      notes: "Mercedes-Benz S450 4MATIC; initial round-trip offer before client pushed back citing a 3,000 SAR competitor quote",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Makkah (Fairmont)",
      toCity: "Madina (Sofitel)",
      vehicleType: "Luxury",
      price: 3500,
      tripType: "ROUND_TRIP",
      notes: "Mercedes-Benz S450 4MATIC; negotiated rate; round trip 15th 9am Makkah->Madina, 16th 2pm Madina->Makkah",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Makkah (Fairmont)",
      toCity: "Madina (Sofitel)",
      vehicleType: "Luxury",
      price: 3000,
      tripType: "ROUND_TRIP",
      notes: "Mercedes-Benz S450 4MATIC; FINAL price, client confirmed and booked; round trip 15th 9am Makkah->Madina, 16th 2pm Madina->Makkah",
      source: "whatsapp_chat",
    },

    // Thread 3: Makkah -> Madina, same-day, 3 passengers, 3-tier option list
    {
      fromCity: "Makkah",
      toCity: "Madina",
      vehicleType: "Sedan",
      price: 450,
      tripType: "ONE_WAY",
      notes: "3 passengers, same-day request (exact date not stated in chat), incl. professional driver",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Makkah",
      toCity: "Madina",
      vehicleType: "Van",
      price: 550,
      tripType: "ONE_WAY",
      notes: "Hyundai Staria; 3 passengers, same-day request, incl. professional driver",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Makkah",
      toCity: "Madina",
      vehicleType: "SUV",
      price: 1000,
      tripType: "ONE_WAY",
      notes: "GMC Yukon XL; 3 passengers, same-day request, incl. professional driver",
      source: "whatsapp_chat",
    },

    // Thread 4 (Arabic): Yanbu <-> Jeddah Airport, asymmetric pax (1 going, 5 returning)
    {
      fromCity: "Yanbu",
      toCity: "Jeddah Airport (JED)",
      vehicleType: "SUV",
      price: 2000,
      tripType: "ROUND_TRIP",
      notes: "Initial single-SUV both-ways offer before splitting into two vehicles; 1 pax going, 5 pax return; client's 800 SAR counter-offer was rejected as too low",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Yanbu",
      toCity: "Jeddah Airport (JED)",
      vehicleType: "Sedan",
      price: 500,
      tripType: "ONE_WAY",
      notes: "Going leg only (1 passenger); paired with a separate return-leg vehicle for the 5-passenger return",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Jeddah Airport (JED)",
      toCity: "Yanbu",
      vehicleType: "SUV",
      price: 1200,
      tripType: "ONE_WAY",
      notes: "GMC Yukon XL; return leg (5 passengers); combined with 500 SAR Yanbu->Jeddah sedan leg = 1,700 SAR total round trip (option A)",
      source: "whatsapp_chat",
    },
    {
      fromCity: "Jeddah Airport (JED)",
      toCity: "Yanbu",
      vehicleType: "Van",
      price: 700,
      tripType: "ONE_WAY",
      notes: "Hyundai Staria; cheaper return-leg alternative (5 passengers); combined with 500 SAR Yanbu->Jeddah sedan leg = 1,200 SAR total round trip (option B, offered as discount)",
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
