# TSA Ops Backend — Audit, Target Architecture, Migration Plan
**Date:** 2026-10-05 · Backup taken first: `exports/backup-2026-10-05/*.json` (11 tables, read-only export, nothing modified).

## 1. Current backend structure
Next.js admin at `app/(en)/(dashboard)/admin/*`, APIs at `app/api/admin/*` and `app/api/quotations/*`. Two databases-in-one (same Supabase Postgres):

| Layer | Owner | Tables |
|---|---|---|
| Supabase-native (RLS, RPCs, SQL migrations 0001–0018) | `lib/supabase/*` | `quotations` (the real ops table), `drivers`, `quote_ref_counters`, legacy `bookings` (empty) |
| Prisma-owned | `prisma/schema.prisma` | `Booking` (13), `Lead` (13), `PriceBookEntry` (157), `RoutePriceApproval` (75), `Route` (76), `User`, `Payment` (0), `Review` (0), `PromoCode`, `FareRule`, `Vehicle`, `BlogPost` … |

Admin pages: Dashboard, Schedule, Quotations, Corporate Invoice, Bookings (legacy), Customers, Drivers, Fleet, Pricing Book (+/routes), Promo Codes, Revenue, Analytics, Blog CMS (13 sections).

## 2. Existing workflows
- **Quotation:** public form → `quotations` row (auto `TSA-YYYY-NNNN`) → status `new/quoted/confirmed/assigned/completed/cancelled`, payment `unpaid/partial/paid`, one `profit` number. PDF via `lib/pdf/invoice.tsx` (quotation + receipt modes). No "send quotation" button, no sent/viewed tracking, no follow-up, no accepted/rejected/expired.
- **Email:** `lib/notifications.ts sendEmail()` (Gmail SMTP, BCC supported). Templates in `lib/email/templates.ts`: new-quotation (client+admin), driver, receipt, status-update, contact. Missing: follow-up, booking confirmation, pickup/driver details, thank-you. No email log table (only `NotificationFailure` for failures).
- **Receipt:** `POST /api/quotations/[id]/receipt` records actual paid + method, marks paid, emails PDF (+Trustpilot BCC). Works; receipt PDF isn't stored/versioned.
- **Manual quotes (where most real business happens):** hand-edited HTML files in `client-quotations/{Quoted,Confirmed,Completed,Cancelled}/` → mostly NOT in DB.
- **Pricing:** 3 overlapping sources: `PriceBookEntry` (CLIENT_OBSERVED 83 / VENDOR_COST 37 / DERIVED_SUGGESTED 37), `RoutePriceApproval` (75 groups: 55 single-source, 16 multi, **4 CONFLICTING**), and code `lib/pricing/data/*` + `Route` table. No lookup is wired into quotation creation.

## 3. Real data found
**DB `quotations` = 11 rows. Folder `client-quotations/` = 15 quote folders + `Saudi rides.docx` (≈34 lost/priced WhatsApp enquiries).**

| Ref | Client | Folder | In DB? | Problem |
|---|---|---|---|---|
| 0003 Molhim | Completed | yes, completed, unpaid, profit 26 | no paid amount recorded |
| 0004 Mohamed Abdi | Quoted | yes, 12 Nov 2026 | upcoming |
| 0006 Sheriff Adigun | Cancelled | yes | ok |
| 0007 Mahmoud Naboulsy | Quoted | yes, 14 Oct 2026 | upcoming |
| 0008 Mohamed Alkhawaja | Completed | yes, paid 200 cash, profit 30 | ok |
| 0009 Dania AI | Cancelled | yes | ok |
| 0010 Bahriyat | Cancelled | yes | ok |
| 0011 Mohammed Almobid (LEAP) | Confirmed folder / DB completed | yes | **DB flags `is_test=true`, folder says real; unpaid SAR 450, profit 0** |
| 0012 Oleg Pronin | Completed | yes, paid 350, profit 50 | ok |
| 0013 Alaa Fares (RSI→AMAALA 16 Sep, 500/575 w/ VAT) | Confirmed | **no** (only in Prisma `Booking` TSA-2026-596718) | pickup 10:29pm vs 12:30pm unresolved |
| 0014 Andrea (15 Sep, 250+VAT=287.5) | Confirmed | yes, status `quoted` | date passed, status stale |
| **0015** | Folder: **Hayley Reid** (NEOM→RSI, 1 Oct, SAR 600) / DB: **Fer Palacios** | DB | **NUMBER CLASH — two different clients share 0015** |
| 0016 Julia (6/8/10 Oct, 3 legs) | Confirmed | **no** | **upcoming, not in DB** |
| 0017 Fer Palacios (29 Sep) | Confirmed | **no** (in DB under wrong no. 0015) | |
| 0018 Habib Thabeer (4 Oct, Jeddah station→Yanbu, Staria) | Completed + receipt | **no** | missing entirely |

**Today (5 Oct 2026):** true upcoming = Julia (6/8/10 Oct), Mahmoud (14 Oct), Mohamed Abdi (12 Nov). Past-dated but still open (need closing): Andrea, Fer, Hayley, Alaa.

**Financial gaps:** `profit` exists on only 5 rows; **no driver/vendor cost, no additional cost, no customer-paid on 6 completed/past rows.** I will NOT guess — these are "Financial data required".

**Other problems:** 13 legacy Prisma `Booking` rows (12 cancelled test noise, 1 = Alaa); `Booking` price columns null; client info duplicated between `Booking`/`quotations`/`Lead`; `Lead` (13 real web enquiries) has no link to quotations; `/admin/customers` reads Prisma Users, not real clients; no client entity at all (identity = phone string on each quotation); `profit` is a typed-in number, not derived; sensitive file `WhatsApp Image…12.29.14 PM.jpeg` (driver bank QR) sits in the folder — keep out of DB; 4 conflicting pricing groups: Madinah→Riyadh GMC (1400–2600), Madinah→Tabuk Sedan (450–850), Riyadh→Doha Sedan (1350–1900), Tabuk→Aqaba GMC (1100–2200).

## 4. Keep / merge / change / remove
- **Keep:** `quotations` table + ref counter, `sendEmail`, `invoice.tsx` PDF engine, `PriceBookEntry`/`RoutePriceApproval` data, `drivers`, receipt route.
- **Extend (additive):** `quotations` becomes the single booking/ride spine (no rename, no new parallel "bookings" table).
- **Add:** `clients`, `quotation_costs` (financials), `communication_log` (emails/WhatsApp sent), `documents`, `pricing_rules` (from existing price-book data), `enquiries` (lost/priced leads incl. docx + `Lead`).
- **Merge:** legacy Prisma `Booking` → archive-only; `Lead` → enquiries view; `/admin/schedule` + `/admin/quotations` + dashboard → one Ops Dashboard.
- **Remove:** nothing deleted. Manual HTML template flow retired only after the in-app quotation generator is verified.

## 5. Target architecture (compact, 6 nav items)
`Dashboard` · `Enquiries` · `Quotes & Bookings` (one table, stage chips) · `Clients` · `Pricing Book` · `Reports`

Relations: **Client 1—n Enquiry · Quotation · Booking(=same row, later stage) · Document · Communication**. Quotation → Booking is a status change on the same `quotations` row (stage: draft→sent→accepted→confirmed→driver_assigned→completed→paid→closed); financials 1:1 in `quotation_costs` (customer_price, driver_cost, extra_cost; margin **computed**, negatives flagged loss).

## 6. Migration plan (additive, idempotent, backup first — done)
1. Migration 0019: new tables + new nullable columns on `quotations` (`client_id`, `stage_detail`, `sent_at`, `valid_until`, `driver_cost`, `extra_cost`, `vehicle_category`). No drops, no renames.
2. Clients seeded by distinct phone from quotations/leads/Booking (dedupe report, not auto-merge).
3. Backfill missing folder quotes (0013, 0016, 0017, 0018, Hayley) — fix 0015 clash by re-numbering **Fer Palacios → 0017** and **Hayley → 0015** only after you confirm.
4. Pricing: load `PriceBookEntry` into `pricing_rules` with range (low/recommended/min); the 4 conflicts stay `NEEDS_REVIEW` for you.
5. Docx → `enquiries` (lost/cancelled with reason), not clients.

## 7. Implementation phases (this order)
A. Schema + clients + backfill (data integrity) → B. Pricing Book + lookup → C. Quotation workflow + email send/log + templates → D. Receipts/financials/loss flag → E. Booking detail page → F. Ops Dashboard (today/tomorrow/upcoming/actions) → G. Filters/search/quick actions → H. Reports.
Each phase: build, DB integrity check, historical data compared with backup, report.

## 8. Questions blocking safe migration
1. **0015 clash:** re-number Fer Palacios→0017 and Hayley Reid→0015 (matches your folders)? Hayley's DB row doesn't exist yet.
2. **Almobid 0011:** real ride (set `is_test=false`, unpaid SAR 450)? 
3. **Alaa Fares pickup:** 10:29pm or 12:30pm? Did the 16 Sep ride happen/was it paid?
4. **Past-dated open rides** (Andrea 15 Sep, Fer 29 Sep, Hayley 1 Oct, Alaa 16 Sep): completed? cancelled? paid how much? driver cost?
5. **Historical financials** for every completed ride (Molhim, Alkhawaja, Almobid, Oleg, Habib, + the above): customer paid / driver cost / extra costs. (Existing profit numbers will be preserved as-is.)
6. **Quotation email BCC:** confirm internal copy goes to `infotaxisaudiarabia@gmail.com`.
