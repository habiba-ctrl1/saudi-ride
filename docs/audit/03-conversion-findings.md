# 03 — Conversion Findings

## The funnel, walked as a real user

There is no single funnel — there are **three**, and they behave differently. This is the central conversion problem.

### Path 1 — Homepage "Instant Price Calculator" (the loudest CTA)

1. User lands on `/`, hero CTA "Reserve Your Private Taxi" scrolls to `#booking-console` ([home-page.tsx:860](../../components/sections/home-page.tsx#L860)).
2. Widget = `PriceCalculator` ([home-page.tsx:966](../../components/sections/home-page.tsx#L966)). User types pickup/drop‑off, picks vehicle → `POST /api/pricing` returns a number.
3. The result headline says **"Guaranteed Fixed Quote"** ([PriceCalculator.tsx:442](../../components/booking/PriceCalculator.tsx#L442)) but the badge below says **"Estimated Fare"** ([:506](../../components/booking/PriceCalculator.tsx#L506)) — contradictory in the same card.
4. "Book This Journey" = a **`wa.me` deep link** with the quote pre‑filled ([:516](../../components/booking/PriceCalculator.tsx#L516)).

> **Drop‑off hypothesis (severe):** This is the primary path and it **captures nothing**. No name, no phone, no DB row, no email to you. If the user doesn't tap through to WhatsApp *and* send the message *and* you happen to reply in time, the lead evaporates with zero trace. On desktop (no WhatsApp app) the deep link is even weaker.

### Path 2 — `/book` 6‑step wizard

1. Step 1 Journey → Step 2 Vehicle → Step 3 Extras → Step 4 Contact → Step 5 Summary → Step 6 Done ([book/page.tsx:428‑437](../../app/book/page.tsx#L428)).
2. Step 4 collects name, phone, email, nationality, language.
3. Step 5 "payment" — there is **no payment**; it's cash‑on‑arrival ([book/page.tsx:112](../../app/book/page.tsx#L112)).
4. Finalize → `POST /api/bookings` → **real Prisma DB row created** ([api/bookings/route.ts:208](../../app/api/bookings/route.ts#L208)).
5. UI shows a confirmation with logs: *"Twilio SMS notification queued… Resend luxury invoice dispatch confirmation queued…"* — these are **hard‑coded fake strings** ([book/page.tsx:369‑374](../../app/book/page.tsx#L369), comment literally says "Simulate dispatch alerts").
6. The API response message is **"Booking received. SMS confirmation sent."** ([api/bookings/route.ts:242](../../app/api/bookings/route.ts#L242)) — **no SMS or email is sent to anyone.**

> **Drop‑off hypothesis (critical):** The lead *is* saved, but **you are never notified** — `/api/bookings` never calls `sendAdminNotification`/`sendBookingConfirmation`, which exist and work ([notifications.ts:110](../../lib/notifications.ts#L110),[:289](../../lib/notifications.ts#L289)). So a motivated customer who completed **6 steps** gets a fake "confirmed" screen, hears nothing, and you never learn they exist. **Check your `Booking` table now — there may be real orphaned leads.** Also: 6 steps + a fake payment step is long; expect heavy mid‑wizard abandonment.

### Path 3 — Quote/contact forms (the one that works)

- `BookingForm` → `POST /api/quotations` → Supabase + **Resend admin + customer email** ([booking-form.tsx:113](../../components/booking/booking-form.tsx#L113), [api/quotations/route.ts:75‑81](../../app/api/quotations/route.ts#L75)). **This is the correct pattern.** But `BookingForm` appears **unmounted** — no page imports it (verified by grep). It's dead code.
- `RecoveryLeadForm` → `/api/quotations` (used on recovery pages) ([car-recovery/[city]/page.tsx:179](../../app/(marketing)/services/car-recovery/[city]/page.tsx#L179)). Works.
- `CorporateAccountForm` / Contact / Partners → `/api/contact` → Resend ([contact/route.ts:30](../../app/api/contact/route.ts#L30)). Works.

> The only reliably‑notifying lead path is bolted to your **lowest‑traffic** pages (recovery, contact, corporate). Your **highest‑traffic** paths (homepage widget, `/book`) don't notify you.

---

## Direct answers to the brief's questions

| Question | Answer |
|---|---|
| **Clicks/fields from landing to confirmed booking?** | Via WhatsApp: ~1 click then a manual chat (dominant). Via `/book`: **6 steps**, ~10+ fields, then a *fake* confirmation. There is no truly "confirmed" booking — everything is a request. |
| **Instant confirmation, or "human replies later"?** | **Human replies later.** The site says "confirm within 1–2 hours" and the copy calls quotes "instant/guaranteed" — a contradiction. The "1–2 hours" promise appears in the hero why‑us grid ([home-page.tsx:111](../../components/sections/home-page.tsx#L111)), homepage FAQ ([:185](../../components/sections/home-page.tsx#L185)), the floating WhatsApp bubble ([WhatsAppButton.tsx:54](../../components/shared/WhatsAppButton.tsx#L54)), the layout JSON‑LD FAQ ([layout.tsx:201](../../app/layout.tsx#L201)), and repeats across service/FAQ pages. |
| **Online payment / gateway?** | **No.** Stripe/Moyasar/HyperPay routes exist but are unconfigured; booking is cash‑on‑arrival ([book/page.tsx:112](../../app/book/page.tsx#L112)). |
| **Fallback if WhatsApp is blocked?** | Weak. Phone `tel:` links exist (navbar/contact) but the homepage's two hero CTAs are the calculator (→WhatsApp) and "WhatsApp Us" ([home-page.tsx:867](../../components/sections/home-page.tsx#L867)). Corporate networks that block WhatsApp see no on‑page lead form on the homepage. |
| **Any lead capture that stores the enquiry?** | Partially. `/book` stores to DB (but silent). `/api/quotations` stores + emails. **The homepage widget stores nothing.** |
| **Abandoned‑quote recovery?** | **None.** The homepage quote → WhatsApp captures no contact info, so there is nothing to follow up. `/book` saves a `sessionStorage` draft locally only ([book/page.tsx:161](../../app/book/page.tsx#L161)) — not retrievable by you. |
| **Analytics installed?** | **Vercel Analytics only.** No GA4, GTM, Meta Pixel, or Clarity. `trackEvent` is defined ([analytics.ts:58](../../lib/analytics.ts#L58)) but called on **only 2 pages** (pricing, faq). WhatsApp clicks tracked **only on FAQ** ([faq/page.tsx:556](../../app/faq/page.tsx#L556)); **phone clicks tracked nowhere**; the homepage widget's WhatsApp CTA and the floating button emit **no event**. |

> **Bottom line on attribution: you currently have effectively zero. You cannot distinguish 0 leads from 30, cannot see which pages/queries convert, and cannot measure any ad you run.** Fix this before spending on traffic.

---

## Other conversion frictions found

| Sev | Finding | Location | Fix |
|-----|---------|----------|-----|
| 🔴 Critical | Fake "1" unread badge on the floating WhatsApp button (dark pattern; also untracked). | [WhatsAppButton.tsx:103](../../components/shared/WhatsAppButton.tsx#L103) | Remove the fake badge; add `trackEvent("whatsapp_click", …)` on click. |
| 🟠 High | Calculator can show a **fabricated price** (string‑length pseudo‑distance) when the Google Maps key is absent, then call it "Guaranteed." | [api/pricing/route.ts:99‑102](../../app/api/pricing/route.ts#L99) | Add the Maps key, or restrict the calculator to known fixed routes and label everything else "estimate — we'll confirm." |
| 🟠 High | Calculator returns **SAR 180** for Jeddah Airport→Makkah while the whole site advertises **SAR 249** — the user watches the price *drop* vs the ad, or *rise* vs the "From SAR 80" card. Confusing at the decision moment. | [pricing.ts:20](../../lib/pricing.ts#L20) vs [routes.ts:10](../../lib/data/routes.ts#L10) | Single price source (see [05](05-duplication-map.md)). |
| 🟠 High | Homepage hero shows an ultra‑luxury fleet (Mercedes S/V‑Class, Sprinter, Cadillac Escalade) but the bookable fleet is Camry/Yukon/Staria/Coaster — expectation mismatch on arrival. | fleet [home-page.tsx:541](../../components/sections/home-page.tsx#L541) vs bookable [book/page.tsx:60](../../app/book/page.tsx#L60) | Show the vehicles you actually dispatch. |
| 🟡 Medium | Admin/customer notification emails claim **"payment has been processed"** / "(Paid)" on unpaid bookings. | [notifications.ts:297](../../lib/notifications.ts#L297),[:326](../../lib/notifications.ts#L326) | Correct the copy to "Payment: cash on arrival / unpaid." |
| 🟡 Medium | Resend `from` defaults to `onboarding@resend.dev` (test mode) → customer emails likely undelivered even on the working quotation path. | [notifications.ts:29](../../lib/notifications.ts#L29) | Verify your domain in Resend, set `RESEND_FROM_EMAIL`. |
| 🟡 Medium | Booking wizard vehicle cards are clickable `<article onClick>` — **not keyboard‑focusable** (see [06 Appendix B](06-phased-plan.md#appendix-b--accessibility-findings-step-6)). | [book/page.tsx:775](../../app/book/page.tsx#L775) | Use `<button>` or add `role/tabIndex/onKeyDown`. |

---

## Recommended funnel (target)

1. **Every** quote/CTA captures **name + phone first** → `POST /api/lead` (reuse `/api/quotations`) → DB row + instant email/SMS to you → *then* open WhatsApp pre‑filled with the quote and a lead ref.
2. Shorten `/book` to **3 steps** (Journey+Vehicle → Contact → Confirm) and make the confirmation **real** (send the emails/SMS that already exist).
3. Add a **plain phone‑callback form** as the WhatsApp fallback on the homepage.
4. Wire `trackEvent` (or GA4/Pixel events) to **every** WhatsApp click, phone click, quote, and booking. Mark WhatsApp/phone/quote as **conversions**.
5. With contact info now captured, add **abandoned‑quote follow‑up** (a simple daily export or automation over the `quotations`/`leads` table).
