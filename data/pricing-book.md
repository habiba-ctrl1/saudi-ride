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
| 2026-09-20 | Makkah | Madinah | SUV (GMC Yukon XL 2026) | One-way | 950 | Final best offer; lost to competitor's 800 SAR (also claimed 2026 model) |
| 2026-09-20 | Riyadh (Al Khuzama) | Dubai | SUV (GMC Yukon XL 2025) | One-way | 3000 | 2 pax; cross-border; pay-after-trip; generic 1,000 SAR/day baseline floated before route was known, corrected once route confirmed |
| 2026-09-20 | Riyadh | Manama (Bahrain) | Sedan | One-way | 850 | 1 pax; private ride only, no shared option; pickup ~2 days out |
| 2026-09-20 | Tabuk Airport | NEOM Airport (Bay) | Sedan (Camry/Elantra/Sonata) | One-way | 500 | 1 pax, 2 small luggage; trip 2026-08-31 6am; not confirmed at time of quote |
| 2026-09-20 | Al Jubail | Al Khafji Border (outside border) | Unspecified | One-way | 550 | Drop-off outside border only, client crosses into Kuwait himself |
| 2026-09-20 | Al Jubail | Ar-Ruqi Border (outside border) | Unspecified | One-way | 900 | Alternative border option, not chosen |
| 2026-09-20 | Al Jubail | Kuwait (driver crosses border) | Unspecified | One-way | 1300 | Incl. driver's border fees + return; client declined |
| 2026-09-20 | Ras Tanura (Aden Restaurant) | Safwa (Al Rajhi/Riyadh Bank) | Recovery/Tow Truck | One-way | 300 | Car towing job, not a taxi ride; client found competitor at 70 SAR and cancelled |
| 2026-09-20 | Hanak | Tabuk Airport (round trip) | Unspecified | Round-trip | 1840 | Bank transfer incl. 15% VAT (1,600+240), official invoice via partner Eagle Eyes; 29 Aug 01:30 out / 30 Aug 09:15 back |
| 2026-09-20 | Hanak | Tabuk Airport (round trip) | Unspecified | Round-trip | 1600 | Cash option, no invoice, half/half payment; same trip as 1,840 SAR quote |
| 2026-09-20 | Riyadh | Dammam | Sedan | One-way | 750 | 1 pax, no luggage; trip 2026-08-30 9:30pm; initial quote |
| 2026-09-20 | Riyadh | Dammam | Sedan | One-way | 600 | Same trip; discounted follow-up offer |
| 2026-09-20 | Dammam | Doha (Qatar) | Unspecified (Fortuner/Taurus) | One-way | 1500 | 1 pax; vehicle depends on date/time availability; date not confirmed |
| 2026-09-20 | Riyadh | Dammam | SUV (GMC) | One-way | 1100 | 2 luggage; trip 2 Sept 2026 (different client than the 750/600 pair above) |
| 2026-09-20 | Riyadh | Dammam | Sedan | One-way | 650 | Alt. option, same trip as the 1,100 SAR GMC quote |
| 2026-09-20 | Abha | Rijal Almaa (round trip) | Sedan | Round-trip | 650 | 1 pax, same-day, waiting incl.; 23 Sept after 4pm; client declined, used Uber |
| 2026-09-20 | Saudi side of Jordan border (near Aqaba) | Tabuk | Sedan | One-way | 1000 | 2 pax, 2 hand luggage; pickup only from Saudi side, not Aqaba; date 25 Dec |
| 2026-09-20 | Tabuk | Aqaba (Jordan) | Sedan | One-way | 1800 | Direct transfer incl. border crossing; alt to border-only pickup |
| 2026-09-20 | Tabuk | Aqaba (Jordan) | SUV (GMC) | One-way | 2200 | Direct transfer incl. border crossing; same thread as 1,800 SAR sedan |
| 2026-09-20 | Madinah | Tabuk | Sedan | One-way | 850 | 1 pax; trip 2026-09-06 12pm; initial quote |
| 2026-09-20 | Madinah | Tabuk | Sedan (Hyundai Sonata) | One-way | 450 | Discounted after Uber price comparison; same trip |
| 2026-09-20 | King Fahd Intl Airport (Dammam) | Hyatt Regency Oryx Doha | Sedan | One-way | 1300 | 1 pax, 1 luggage; trip 9 Sept 11am; corporate client, initial quote |
| 2026-09-20 | King Fahd Intl Airport (Dammam) | Hyatt Regency Oryx Doha | Sedan | One-way | 1200 | Final offer after 1,000 SAR budget; client declined |
| 2026-09-20 | Abha Airport | Braira Abha Hotel | Sedan | One-way | 300 | 2 pax, 3 luggage; trip 11 Sept 5:30pm |
| 2026-09-20 | Al-Irqah District, Riyadh | Riyadh Airport | SUV (GMC Yukon) | One-way | 400 | Client wanted Cadillac; GMC Yukon offered as available alt |
| 2026-09-20 | Riyadh | Makkah | SUV (GMC Yukon XL) | One-way | 2000 | 4 adults + 2 kids; trip 21 Sept; client declined on price |
| 2026-09-20 | Riyadh | Makkah | Van (Staria) | One-way | 1700 | Alt. option, same trip as the 2,000 SAR GMC quote |
| 2026-09-20 | Madinah | Al-Ula (round trip) | Van (Staria) | Round-trip | 1100 | Umrah pilgrim client; initial best offer |
| 2026-09-20 | Madinah | Al-Ula (round trip) | Van (Staria) | Round-trip | 1000 | FINAL, client agreed; trip 4 Oct; stops incl. Old Town AlUla, Maraya; permits (e.g. Hegra) paid separately; fuel+driver incl. |
| 2026-09-20 | Al Khobar | Manama (Bahrain) | Sedan (Toyota Veloz) | One-way | 400 | Initial quote |
| 2026-09-20 | Al Khobar | Manama (Bahrain) | Sedan (Toyota Veloz) | One-way | 350 | Final discounted rate |
| 2026-09-20 | Desert Rock Resort (AlUla) | Six Senses Southern Dunes (AlUla) | Unspecified (Hyundai) | One-way | 100 USD | BOOKED; Fri 11 Sept 12pm; driver Amir, plate 8775 SSA |
| 2026-09-20 | Tabuk | Aqaba (Jordan) | SUV (GMC) | One-way | 1100 | Different client/thread; trip October (date pending) |
| 2026-09-20 | Tabuk | Aqaba (Jordan, round trip) | SUV (GMC/Fortuner) | Round-trip | 2150 | Round-trip total, return 6 days later; same client as the 1,100 SAR one-way |
| 2026-09-20 | Tabuk | Aqaba (Jordan, round trip) | Sedan (Ford Taurus) | Round-trip | 1800 | Round-trip total alt, same thread |
| 2026-09-20 | Bahrain | Dhahran | Sedan (Toyota Veloz) | One-way | 400 | Trip on the 18th; client didn't confirm |
| 2026-09-20 | Adani Bar Al-Rawda, Jeddah | Jeddah International Airport | Sedan | One-way | 150 | 1 pax; trip 2026-09-14 06:15; client declined |
| 2026-09-20 | Jubail | Dammam Airport | SUV/Van | One-way | 370 | 5 pax, 3 cabin bags; trip 14 Sept 2:20pm; client declined |
| 2026-09-20 | Al Khobar | Doha (Qatar) | Unspecified | One-way | 1300 | 2 pax, small bags; trip 15.09.2026 10am |
| 2026-09-20 | Dhahran | Makkah | Sedan | One-way | 1600 | 3 pax; trip Dec 2; ~13hr drive; initial quote |
| 2026-09-20 | Dhahran | Makkah | Sedan | One-way | 1550 | Final discounted price, same trip |
| 2026-09-20 | W KAFD, Riyadh | Doha (Qatar) | Sedan | One-way | 1900 | 1 pax, 1 bag; trip 17 Sept 5pm; door-to-door, e-receipt; CONFIRMED |
| 2026-09-20 | Makkah (Pullman Zamzam) | Jeddah Airport (JED) | Sedan | One-way | 300 | 1 pax; midnight pickup 22 Sept, flight 4am; initial quote |
| 2026-09-20 | Makkah (Pullman Zamzam) | Jeddah Airport (JED) | Sedan | One-way | 250 | Discounted, same trip; client still declined |
| 2026-09-20 | Makkah (Pullman Zamzam) | Jeddah Airport (JED) | Van (Hyundai Staria) | One-way | 350 | Held for client Mohamed, same 22 Sept trip; booking cancelled (plans changed) |
| 2026-09-20 | Radisson Olaya, Riyadh | Riyadh Airport Terminal 5 | Sedan (Ford Taurus 2025) | One-way | 250 | 1 pax, 1 luggage; trip 15/09/2026 23:00; CONFIRMED (guest Andrea); card pay +15% VAT |
| 2026-09-20 | Madinah | Al-Ula (round trip day tour) | Sedan (Toyota Camry) | Round-trip | 1200 | 2 pax; Hegra/Old Town/Elephant Rock; fuel+tolls+driver incl.; trip 30-31 Oct |
| 2026-09-20 | Riyadh | Hail Jawazat Office | Sedan | One-way | 1000 | 1 pax; trip 16 Sept 8pm; client declined |
| 2026-09-20 | Doha (Qatar) | Dammam | SUV (Fortuner/GMC) | One-way | 1600 | 1 adult + 2 kids; trip 17 Sept 4pm; client declined |
| 2026-09-20 | Doha (Qatar) | Dammam | Van (Toyota Innova) | One-way | 1200 | Cheaper alt., same trip |
| 2026-09-20 | Hail | Riyadh | Sedan | One-way | 800 | 1 pax; 2025/2026 model; client will confirm later |
| 2026-09-20 | Riyadh | Doha (Qatar) | SUV (GMC) | One-way | 1800 | Ref TSA-2026-131821; trip 22 Sept 9pm; client declined |
| 2026-09-20 | Al Khobar | Manama Airport (Bahrain) | Sedan | One-way | 400 | 2 bags; trip Sun 20 Sept 4pm |
| 2026-09-20 | Madinah | Riyadh | Sedan | One-way | 1100 | 4 adults+2 children+6 luggage; trip 18 Oct; fixed-price menu |
| 2026-09-20 | Madinah | Riyadh | SUV | One-way | 1400 | Same menu/trip |
| 2026-09-20 | Madinah | Riyadh | Van | One-way | 1400 | Same menu/trip |
| 2026-09-20 | Madinah | Riyadh | SUV (GMC Yukon) | One-way | 1800 | Premium tier, same menu/trip |
| 2026-09-20 | Dammam | Qatar | Sedan | One-way | 1350 | 3 pax; trip 1 Oct; incl. border crossing assistance |
| 2026-09-20 | Riyadh | Doha (Qatar) | SUV (GMC) | One-way | 1800 | Client Rauff, 3 pax; initial quote |
| 2026-09-20 | Riyadh | Doha (Qatar) | Sedan (Ford Taurus) | One-way | 1400 | Same client/trip, sedan alt |
| 2026-09-20 | Riyadh | Doha (Qatar) | SUV (GMC) | One-way | 1700 | Special discount after competitor Innova quote (~1,000 QAR) |
| 2026-09-20 | Riyadh | Doha (Qatar) | Sedan (Ford Taurus) | One-way | 1350 | Final best price, same negotiation |
