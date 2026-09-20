# Pricing Book — manual ledger

Running record of real prices quoted to clients, by route + vehicle. This file
is the git-tracked backup of the same data stored in the `price_book_entries`
table (managed at `/admin/pricing-book`). Whenever a price is shared in chat,
append a row here AND add it via the admin UI (or `POST /api/admin/pricing-book`).

Never invent a price here — only record prices actually quoted to a real
client, per `CLAUDE.md` rule 1.

| Date | From | To | Vehicle | Trip | Price (SAR) | Notes / client ref |
|---|---|---|---|---|---|---|
| 2026-09-20 | Jeddah Airport (JED) | Makkah - Swissotel Al Maqam (Clock Tower) | Sedan (Toyota Camry 2026) | One-way | 400 | Terminal 1 arrival; incl. pickup, hotel drop-off, flight tracking, free short wait; trip 2026-08-02 3:20am, 4 pax, 2 bags |
| 2026-09-20 | Jeddah Airport (JED) | Makkah - Swissotel Al Maqam (Clock Tower) | Sedan (Toyota Camry 2026) | One-way | 450 | Any terminal other than T1; same inclusions; trip 2026-08-02 |
| 2026-09-20 | Jeddah Airport (JED) | Makkah - Swissotel Al Maqam (Clock Tower) | Sedan (Toyota Camry 2026) | One-way | 350 | Final negotiated price after client pushed back on 400/450; incl. airport parking fees; trip 2026-08-02 |
| 2026-09-20 | Dammam | Abha | SUV (GMC 2026) | One-way | 4600 | One-way leg quoted as part of round-trip request; trip 7/29 2:00pm pickup |
| 2026-09-20 | Abha | Dammam | SUV (GMC 2026) | One-way | 4600 | Return leg; 24hr overnight driver wait in Abha billed separately at 1,000 SAR |
| 2026-09-20 | Dammam | Abha (round trip) | SUV (GMC 2026) | Round-trip | 10000 | All-inclusive (2x4,600 + 1,000 overnight wait = 10,200, discounted to 10,000); initial offer; trip 7/29 |
| 2026-09-20 | Dammam | Abha (round trip) | SUV (GMC 2026) | Round-trip | 9500 | Final firm lowest offer; client had competitor quote 5,000 SAR (2025-model car), declined and booked elsewhere; trip 7/29 |
| 2026-09-20 | Dammam | Dubai | SUV | One-way | 4000 | Quoted in error — client wanted Sedan not SUV; cross-border incl.; 2 pax, 2 luggage; trip 2026-08-20 9pm |
| 2026-09-20 | Dammam | Dubai | Sedan (Ford Taurus) | One-way | 2800 | Corrected quote after client complaint; cross-border incl.; trip 2026-08-20 9pm |
| 2026-09-20 | Makkah (Fairmont) | Madina (Sofitel) | Luxury (Lexus ES 300h 2026) | One-way | 700 | Offered alongside S450 as cheaper alt; trip type not fully confirmed — verify before reuse |
| 2026-09-20 | Makkah (Fairmont) | Madina (Sofitel) | Luxury (Mercedes S450 4MATIC) | Round-trip | 4100 | Initial round-trip offer; client cited 3,000 SAR competitor quote |
| 2026-09-20 | Makkah (Fairmont) | Madina (Sofitel) | Luxury (Mercedes S450 4MATIC) | Round-trip | 3500 | Negotiated rate; round trip 15th 9am / 16th 2pm |
| 2026-09-20 | Makkah (Fairmont) | Madina (Sofitel) | Luxury (Mercedes S450 4MATIC) | Round-trip | 3000 | FINAL — client confirmed and booked; round trip 15th 9am / 16th 2pm |
| 2026-09-20 | Makkah | Madina | Sedan | One-way | 450 | 3 passengers, same-day request, incl. driver |
| 2026-09-20 | Makkah | Madina | Van (Hyundai Staria) | One-way | 550 | 3 passengers, same-day request, incl. driver |
| 2026-09-20 | Makkah | Madina | SUV (GMC Yukon XL) | One-way | 1000 | 3 passengers, same-day request, incl. driver |
| 2026-09-20 | Yanbu | Jeddah Airport (JED) | SUV | Round-trip | 2000 | Initial single-SUV both-ways offer before splitting vehicles; 1 pax going, 5 pax return; client's 800 SAR counter rejected |
| 2026-09-20 | Yanbu | Jeddah Airport (JED) | Sedan | One-way | 500 | Going leg only (1 pax); paired with a separate return vehicle |
| 2026-09-20 | Jeddah Airport (JED) | Yanbu | SUV (GMC Yukon XL) | One-way | 1200 | Return leg (5 pax); + 500 SAR going leg = 1,700 SAR total (option A) |
| 2026-09-20 | Jeddah Airport (JED) | Yanbu | Van (Hyundai Staria) | One-way | 700 | Return leg (5 pax), cheaper alt; + 500 SAR going leg = 1,200 SAR total (option B) |
