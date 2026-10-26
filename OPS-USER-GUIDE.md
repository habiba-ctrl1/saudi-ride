# TSA Operations — Roz ka istemal (Roman Urdu)

Sidebar: **Dashboard · Lead Inbox · Quotes & Bookings · Calendar · Needs Review · Ride Register · Clients · Reviews · Drivers · Pricing Book · Reports** (baqi purane pages "More tools" mein).

## Naya client aaye to — poora flow (10 qadam)

1. **Enquiry andar lein**
   - Website form / contact form: khud `Lead Inbox` mein aa jati hai (status *New*). Aap ko `[TSA] Lead …` email bhi aati hai.
   - WhatsApp par aayi: `Lead Inbox → Paste New Enquiry` → poori chat paste → **Extract details** → jo khali/ghalat hai theek karein (email zaroor) → **Save to Lead Inbox**. Agar wohi phone pehle se hai to system warning deta hai.
2. **Lead kholein** (naam par click): status "Contacted" karein, follow-up date lagayein. Har tabdeeli *Activity* mein likhi jati hai.
3. **Create quotation** dabayein — form lead ke data se bhara aata hai. Pricing Book route ka rate + purani rides dikhata hai. **Final price** aur **driver cost** likhein (margin live dikhta hai) → **Save as Ready to Send**. *Save se customer ko kuch nahi jata.*
4. Booking page par **New Quotation → Email** dabayein. Customer ko hari/peeli design wali email + PDF jati hai. Aap ke office inbox (`info@`) mein alag se **`[TSA copy] Quotation · TSA-… · Naam`** email aati hai — wohi cheez jo customer ne payi (record ke liye). Lead khud "Quotation sent" ho jati hai.
5. Client haan kahe → **Accepted**, phir **Convert to Booking**. Phir **Booking Confirmation → Email**.
6. **Driver** chunein (+ share %, plate) → **Save driver**. **Driver / Pickup Details → Email** (customer ko driver ka naam, phone, gaari, plate).
7. Ride ho jaye → **Driver cost** likh kar **Save costs** → **Mark ride Completed**.
8. **Payments** card mein jo paisa asal mein mila woh **Record payment** karein (cash/bank, tareekh, reference). Aadha mila to "Partial", poora mila to "Paid" khud ho jata hai. Galat entry ho to **Void** (delete nahi hoti).
9. Har payment ke saath **Issue receipt** → **Payment / Receipt → Email**. Poora paisa ho to receipt par **PAID** stamp, warna **PART PAYMENT** + balance. Receipt email mein **Trustpilot review button** hota hai (`trustpilot.com/evaluate/taxisaudiarabia.com`).
10. **Ride Completion / Thank You → Email**. Company ko chahiye to **Create invoice** (VAT none / included / on top) — invoice par outstanding balance likha hota hai.

> Koi email apne aap nahi jati — sirf aap ke dabane par. Har email ka natija "Sent ✓" ya "Email Failed — Retry" booking par dikhta hai.

## Roz subah (2 minute)
- `Dashboard`: Outstanding actions (driver nahi, purani ride open, cost missing, payment baqi…), Today/Tomorrow rides.
- `Needs Review`: jin records ka status data se saabit nahi (tareekh guzar gayi par open, completed par payment nahi…). Har ek par faisla karein — system khud kuch badalta nahi.
- `Calendar`: mahine ki rides; laal "no driver" = driver lagayein.

## Email ko saaf rakhna (Gmail labels)
System ki har internal email ka subject ek hi tarz ka hai, taake Gmail khud label laga de:

| Subject shuru hota hai | Matlab | Label |
|---|---|---|
| `[TSA] Lead · …` | Website se nayi enquiry | TSA/Alerts/Leads |
| `[TSA] Contact · …` | Contact form | TSA/Alerts/Contact |
| `[TSA] Driver application · …` | Driver ki application | TSA/Alerts/Drivers |
| `[TSA] Booking · …` | Nayi booking | TSA/Alerts/Bookings |
| `[TSA] URGENT · …` | Bina price ke pickup nazdeek | TSA/Alerts/URGENT (star) |
| `[TSA copy] Quotation · …` | Customer ko gayi quotation ki copy | TSA/Records/Quotations |
| `[TSA copy] Follow-up / Booking confirmation / Pickup details / Receipt / Thank-you · …` | Baqi copies | TSA/Records/… |

**Ek baar setup:** Gmail → ⚙ Settings → *See all settings* → **Filters and Blocked Addresses** → **Import filters** → file `docs/gmail-filters.xml` chunein → *Apply new filters to existing conversations* tick karke **Create filters**. Records wali emails Inbox se hat kar sirf label mein jati hain (parhne ke liye label kholein); Alerts Inbox mein rehti hain.

## Paisa aur hisaab
- `Drivers`: har driver ka ledger (rides, margin, aap ka hissa, mila, baqi, PKR).
- `Reports`: mahina/saal/custom, funnel, routes, vehicles, clients; **Export CSV** accounting ke liye.
- Margin haath se nahi likhte: *mila hua paisa − driver cost − extra*.

## Qaide jo system khud nibhata hai
- Customer ko email/price sirf aap ke button se.
- Payment, receipt, invoice, quotation ki purani versions kabhi overwrite/delete nahi hoti (sirf Void / nayi version).
- Lead "Quotation sent" tak khud jati hai, "Confirmed" kabhi khud nahi.
- Test record: booking ke neeche **Mark as test** → reports se chhup jata hai.
