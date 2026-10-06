# TSA Operations Backend — Roz ka istemal (Roman Urdu)

Sidebar: **Dashboard · Enquiries · Quotes & Bookings · Clients · Drivers · Pricing Book · Reports** (baqi purane pages "More tools" mein).

## 1. Subah (2 minute)
`Dashboard` kholein:
- **Outstanding actions** — jo kaam baqi hai (driver nahi, purani ride open, cost missing, follow-up due…). Har item par click = seedha record.
- **Today / Tomorrow / Upcoming** — rides, driver ke saath. "unassigned" peela = driver assign karein.
- **Website enquiries** — "Quote" dabayein, form pehle se bhar jata hai.

## 2. Nayi enquiry → quotation
1. `Quotes & Bookings → New Quotation` (ya dashboard/enquiries se "Quote").
2. Client search karein (phone se pehchan hoti hai) ya naya likhein.
3. Pickup + drop + vehicle likhte hi **Pricing Book** khud check hota hai: range, recommended, minimum, cost, margin, purani asli rides.
4. Final price + expected driver cost likhein — margin/LOSS live dikhta hai.
5. **Save as Draft** ya **Save as Ready**. *Save karne se client ko kuch nahi jata.*

## 3. Bhejna
Booking record (`TSA-…` par click) → **Quote & communication**:
- **Email** — PDF ke saath jati hai, office (`info@taxisaudiarabia.com`) ko BCC. Screen par "Sent ✓" ya "Email Failed — Retry" (asli error ke saath).
- **WhatsApp** — message khulta hai, aap khud bhejti hain, phir "Mark sent on WhatsApp" dabayein.
- Templates: Quotation, Follow-up, Booking confirmation, Driver/pickup details, Receipt, Thank-you.

## 4. Booking → ride → paisa
1. **Convert to Booking** (client ne haan kaha).
2. **Ride, payment & receipt** card: driver chunein (Naimat/Sheraz/Bilal/Ajmal/Faisal ya local), share %, plate.
3. Ride ke baad: **Customer paid**, **Driver cost**, **Extra cost** likhein → margin khud banta hai (nuqsan = laal "LOSS").
4. **Mark ride Completed** → **Generate Receipt** → Email/WhatsApp se bhejein.
5. Lifecycle bar (10 steps) khud tick hoti hai.

## 5. Drivers aur hisaab
`Drivers`: Main drivers ka ledger — rides, margin, aap ka hissa, mila, baqi (PKR ke saath). Paise milen to **Record payment**.

## 6. Pricing Book
`Pricing Book`: har route × vehicle ka recommended / minimum / est. cost / range yahan ek baar set karein. Conflict wale routes laal hain — confirm karke price set karein. Kuch bhi khud-ba-khud customer ko nahi jata.

## 7. Reports
`Reports`: mahina/90 din/saal/custom — rides, revenue, driver cost, margin, aap ka hissa, funnel (enquiry → quote → booking → complete), routes, vehicles, clients, drivers, source. **Export bookings CSV** accounting ke liye.

## Qaide jo system khud nibhata hai
- Koi email/price customer ko khud nahi jata — sirf aap ke button se.
- Purani ride/cost kabhi delete nahi hoti; completed ride ki trip details lock hoti hain (sirf phone/email theek ho sakta hai).
- Margin kabhi haath se nahi likhte: paid − driver cost − extra.
- PKR sirf paisay wale figures ke saath; rate `app_settings.sar_to_pkr_rate` (abhi 73).
- Test record: record ke neeche "Mark as test" → dashboard/reports se chhup jata hai; sirf test record delete ho sakta hai.
