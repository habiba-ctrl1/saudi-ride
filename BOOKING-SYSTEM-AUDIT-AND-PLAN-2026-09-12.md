# Booking System — Audit & Implementation Plan
**Date:** 12 Sep 2026

## 1. What I just did (already live in the DB)

| Ref | Customer | Status | Payment | Note |
|---|---|---|---|---|
| TSA-2026-0011 | Mohammed Almobid | completed | **unpaid — SAR 450 owed** | LEAP round trip, 1 Sep. Cash was agreed on arrival, never collected. |
| TSA-2026-0012 | Oleg Pronin & Anna Zolotarenko | completed | paid — SAR 350 (cash) | Driver Amir / Hyundai 8775 SSA noted in admin_notes (ad-hoc partner driver, not in your drivers roster). |
| TSA-2026-0006 | Sheriff Adigun | cancelled | — | Added a note: confirmed booking, no-show/no-pay, treated as a scam attempt, no refund owed. |

These now show up in `/admin/quotations` like any other booking. I also confirmed 7 other historical file-based quotes (Bahriyat Al-Sharq, Dania AI/LEAP, Mahmoud Naboulsy, Mohamed Alkhawaja, Mohamed Abdi, Molhim Salah, and Sheriff Adigun itself) were **already** correctly in the DB — no action needed there.

## 2. One thing I did NOT touch — needs your answer

**Alaa Fares** exists in a *third* place: the old `/book` Prisma system (ref `TSA-2026-596718`), separate from both the DB you check in `/admin/quotations` and the manual PDF file your business partner/you already built (`TSA-2026-0013-Alaa-Fares.html`). There's already a real "Generate Quotation" button in `/admin/bookings` that bridges a Prisma booking into the real system cleanly — I didn't have to build anything for that part.

But two records disagree on the pickup time:
- Original booking: **10:29 pm**
- The manual quotation file you built: **12:30 pm**

I won't guess which is right. Tell me the correct time (or confirm it's still 10:29pm) and set the price to 600 in `/admin/bookings`, then click **Generate Quotation** — or tell me to do it and I will.

## 3. Current state — why data was scattered

Three separate systems have existed side by side, each with its own numbering:
1. **Homepage 5-step form** → real `quotations` table (Supabase) → `/admin/quotations`. This is the good one — has PDF, status pipeline, now receipt/review too.
2. **`/book` page** → legacy `Booking` table (Prisma) → `/admin/bookings`. Has its own random ref format, its own price field, and its own "Generate Quotation" bridge into #1 — but nobody was using that bridge consistently.
3. **Pure WhatsApp quotes** → never touched the database at all, only existed as HTML/PDF files in `client-quotations/`. This is where most of your real business happens, and until today none of it was queryable.

None of this was your fault to fix by hand — it's just three flows that grew at different times and were never merged.

## 4. Automation gaps found

| Gap | Current state | Impact |
|---|---|---|
| No automated customer email on status change | Only "new booking" and (as of today) "receipt sent" trigger an email. Quoted → Confirmed → Assigned transitions are silent — customer only finds out via WhatsApp if you remember to message them. | Customers you forget to message get no confirmation trail. |
| No "add booking manually" button in `/admin/quotations` | Only the public website form or the `/admin/bookings` bridge can create a row. A pure WhatsApp lead has to go through the file-based workflow (like today) with no DB record unless someone runs a script. | Every WhatsApp-only client needs manual backfill like the one I just did. |
| Two visual templates for the same document | The React-PDF template (`lib/pdf/invoice.tsx`, used by admin buttons) and the standalone HTML template (`client-quotations/_TEMPLATES/*.html`, used for manual quotes) are two different codebases that happen to look similar after last session's rebrand. A future design tweak to one won't apply to the other. | Drift risk — the two will slowly look different again. |
| `/book` bookings invisible in `/admin/quotations` | Confirmed above with Alaa Fares. | Anyone using `/book` "disappears" from your main dashboard until manually bridged. |

## 5. Data storage / security — direct answer

**Keep it in the deployed Supabase database, not local-only.** Reasoning:
- It's already there and already the right shape (RLS on, service-role key required for reads, admin routes session-gated — I checked the policies, this part is solid).
- Local-only means only one device has the truth, no backup, and you lose everything if that machine dies.
- The `client-quotations/` HTML/PDF files should stay as-is (they're your generated documents, not your database) — but treat the **Supabase DB as the single source of truth** going forward, and generate PDFs *from* it (which is exactly what the receipt/quotation buttons already do).

One thing worth doing before you rely on it further: `.env.local` holds `SUPABASE_SERVICE_ROLE_KEY` (full read/write, bypasses RLS) and `GMAIL_APP_PASSWORD`. Confirm `.env.local` is in `.gitignore` (it should already be, since I've never seen it in git status) and never paste those values into a chat, ticket, or shared doc.

## 6. Implementation plan — priority order

### P0 — do next (small, high-value, low-risk)
1. **"+ New Quotation" button in `/admin/quotations`** — a form using the same fields as the public homepage form, inserting directly (reusing the existing `createQuotationFromBooking`-style direct-insert pattern, generalized to not require a Prisma booking first). This is what lets you stop needing me (or a script) for manual entries — you add the WhatsApp lead yourself, right after quoting them.
2. **Status-change customer emails** — when you move a quotation to `quoted` / `confirmed` / `assigned`, auto-send a branded email (reusing the same `sendEmail` + template pattern already built for receipts). This is the "proper company workflow" you described — client gets a trail without you remembering to message every step.

### P1 — next after that
3. **Unify the two PDF templates** — retire the standalone HTML files in `client-quotations/_TEMPLATES/`, make the React-PDF `invoice.tsx` the *only* template (it already supports quotation + receipt modes). For a WhatsApp-only lead with no DB row yet, the new "+ New Quotation" button (P0 #1) removes the reason to use the standalone HTML at all — one template, everywhere.
4. **Bridge `/book` bookings automatically** — instead of requiring someone to click "Generate Quotation" in `/admin/bookings`, auto-create the linked quotation row the moment a price is set, so `/book` customers never "go missing" from `/admin/quotations` again.

### P2 — worth doing, not urgent
5. Historical backfill of *fully* completed/old bookings you still have as paper/WhatsApp records only (if any exist beyond what's in `client-quotations/`) — same script approach as today, run once more if you find more gaps.
6. A lightweight "amount owed" report/filter in `/admin/quotations` (payment_status = unpaid AND status = completed) — Mohammed Almobid's SAR 450 is exactly the kind of thing that should surface automatically instead of being found by accident.

## 7. Open questions for you
- Alaa Fares pickup time: **10:29pm or 12:30pm**? (blocks bridging that one)
- OK to build P0 #1 and #2 next, in that order?
- For the "forward a WhatsApp chat to an agent" idea — that's already possible today (this conversation is proof: I read chat text and wrote real DB rows). If you want it faster/self-serve without me in the loop each time, that's really P0 #1 (a manual-add form) — same outcome, no separate feature needed.
