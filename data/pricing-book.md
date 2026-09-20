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
