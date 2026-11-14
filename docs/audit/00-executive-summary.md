# 00 — Executive Summary

**Site:** taxisaudiarabia.com · **Codebase:** `taxidriver/` · **Stack:** Next.js 15 (App Router), React 19, Prisma + Supabase (Postgres), Resend, NextAuth · **Deploy:** Vercel
**Audit date:** 2026‑08‑04 · **Mode:** read‑only, no code changed.

---

## The blunt answer first

**Your near‑zero leads are mostly NOT a code bug. They are a demand + trust + measurement problem.**

A 3‑month‑old domain in one of the most competitive local niches on earth (Saudi taxi / Umrah transport, where you compete against Careem, Uber, and hundreds of established operators with thousands of Google reviews) will rank for **almost nothing** organically yet, and I found **no evidence of a Google Business Profile, no real reviews, and no paid‑traffic instrumentation**. If nobody is landing on the site, no amount of code fixes the lead count. So the honest #1 problem is: **you have a traffic problem, not (yet) a conversion problem — and you have no analytics to even see the traffic you do get.**

**But** — and this matters — the code *also* actively wastes the few visitors you get, in ways that are cheap to fix and are quietly destroying attribution. Two things in particular are indefensible:

1. Your **main homepage booking widget captures no lead at all** — it hands the user to WhatsApp and forgets them ([PriceCalculator.tsx:516](../../components/booking/PriceCalculator.tsx#L516)).
2. Your **`/book` wizard stores the booking in the database but notifies nobody** — not you, not the customer — while telling the customer "SMS confirmation sent" ([api/bookings/route.ts:242](../../app/api/bookings/route.ts#L242)). Leads may already be sitting unseen in your database right now.

So the real strategy is: **fix trust + measurement + lead‑capture (cheap, days), then pour effort into demand generation (GBP, ads, content). Do not rewrite the site — it does not need one.**

---

## The 10 things costing you the most money — ranked by (impact × ease)

| # | Problem | Evidence | Impact | Ease | Money logic |
|---|---------|----------|:------:|:----:|-------------|
| 1 | **No analytics that track leads.** Only Vercel Analytics; `trackEvent` fires on just 2 pages; WhatsApp clicks tracked only on FAQ; phone clicks never. You have **zero attribution** — you literally cannot tell if you get 0 leads or 30. | [lib/analytics.ts](../../lib/analytics.ts), only callers [pricing/page.tsx:251](../../app/pricing/page.tsx#L251), [faq/page.tsx:556](../../app/faq/page.tsx#L556) | 🔴 Critical | 🟢 Hours | You're flying blind. Install GA4 + Meta Pixel + track every WhatsApp/phone/quote click **before** spending on ads, or ad money is wasted. |
| 2 | **Homepage widget captures no lead.** The hero "Instant Price Calculator" deep‑links to WhatsApp with no DB write, no email. If the user doesn't finish the WhatsApp chat, they're gone forever. | [PriceCalculator.tsx:514‑528](../../components/booking/PriceCalculator.tsx#L514) | 🔴 Critical | 🟢 Hours | Add a name+phone capture that POSTs to `/api/quotations` (which already emails you) *before* the WhatsApp handoff. This is your single highest‑ROI change. |
| 3 | **`/book` leads notify nobody.** The wizard writes to Prisma but never calls `sendAdminNotification`/`sendBookingConfirmation` (both exist!). UI shows *fake* "Twilio/Resend queued" logs. | [api/bookings/route.ts:208‑245](../../app/api/bookings/route.ts#L208), fake logs [book/page.tsx:369‑374](../../app/book/page.tsx#L369), unused senders [notifications.ts:289](../../lib/notifications.ts#L289) | 🔴 Critical | 🟢 Hours | Wire 3 existing functions into one API route. Leads you already have may be unseen in the DB — check it today. |
| 4 | **Conflicting prices for the same route.** Jeddah Airport→Makkah is **SAR 80** (hero card), **SAR 249** (Umrah card, FAQ, routes, schema), **SAR 374** (FAQ Staria), and **SAR 180** (what the live calculator actually returns). A customer sees three numbers before they even ask. | See [05-duplication-map.md](05-duplication-map.md) | 🔴 High | 🟡 1 day | Price contradictions at the decision moment kill trust and conversions. One price source, referenced everywhere. |
| 5 | **No trust identifiers.** No CR number, no TGA/Ministry of Transport licence number, no VAT number, no landline, no address on‑page, no named legal entity in Terms. Yet the site claims "Ministry of Transport Certified" and "ZATCA VAT Compliant." | [PriceCalculator.tsx:556](../../components/booking/PriceCalculator.tsx#L556), [Footer.tsx:295](../../components/layout/Footer.tsx#L295), Terms has no entity (verified) | 🔴 High | 🟡 1 day | Saudi buyers of a "trust" service (they're handing you their family at 2 AM) need to see you're a real, licensed company. This is also a Google trust (E‑E‑A‑T) signal for a YMYL niche. |
| 6 | **Fabricated reviews shown as "verified."** 6 hard‑coded 5★ homepage reviews labelled **"Google Review — Verified Trip"** with no link; every location page shows a hard‑coded **"4.9/5"**. Named people ("Dr. Farhan Malik", "Evelyn Sterling") who don't exist. | [home-page.tsx:611‑618](../../components/sections/home-page.tsx#L611), label [:165](../../components/sections/home-page.tsx#L165), city rating [locations/[city]/page.tsx:737](../../app/(marketing)/locations/[city]/page.tsx#L737) | 🔴 High | 🟢 Hours | Fake "verified Google reviews" is a deceptive‑practice risk (FTC‑style) and undermines trust if noticed. Relabel as illustrative or remove until you have real ones. *(Good news: the JSON‑LD fake‑rating schema was already correctly removed — this is on‑page only.)* |
| 7 | **The "instant" promise is a lie the site repeats.** Everything says "instant quote" / "guaranteed fixed quote," but the real promise is "we'll confirm **within 1–2 hours**." That gap disappoints at the exact moment of intent, and the quoted price is often a **fake distance** (string‑length math when the Google Maps key is absent). | delay copy [home-page.tsx:111](../../components/sections/home-page.tsx#L111),[:185](../../components/sections/home-page.tsx#L185), fake distance [api/pricing/route.ts:99‑102](../../app/api/pricing/route.ts#L99) | 🟠 High | 🟡 1 day | Either make quotes genuinely instant (fix pricing) or stop calling them instant. Mixed messages read as amateur. |
| 8 | **No Google Business Profile / Maps presence found.** `sameAs` points to Facebook/Instagram/YouTube handles that appear to be placeholders; there is no GBP link, no map embed, no reviews source. | [layout.tsx:107‑111](../../app/layout.tsx#L107), [schema.ts:10](../../lib/schema.ts#L10) | 🔴 Critical (for a *local* business) | 🟡 Days (external) | For "taxi near me / airport taxi Jeddah," the **map pack** is where the leads are, and it needs a verified GBP with real reviews. This is likely your biggest *untapped* lead source and it lives outside the code. |
| 9 | **Arabic booking UI is broken (mojibake) and `/ar` pages declare `lang="en"`.** The whole document `<html lang="en">` is hard‑coded, so Arabic pages tell Google they're English and render without document‑level RTL; the `/book` Arabic strings are corrupted bytes. | [layout.tsx:222](../../app/layout.tsx#L222), garbled strings [book/page.tsx:431‑436](../../app/book/page.tsx#L431) | 🟠 Medium | 🟡 1 day | You're paying for Arabic content but shipping it broken. Fix `lang`/`dir` per‑locale; repair encoding. |
| 10 | **Everything‑is‑a‑client‑component homepage.** The 1,671‑line homepage ships all 3 languages of copy + framer‑motion to every visitor as client JS. ~63 files are `"use client"`, many needlessly. | [home-page.tsx:1](../../components/sections/home-page.tsx#L1) (`"use client"`, 1671 lines) | 🟠 Medium | 🔴 Refactor | Slower LCP on mobile (your pilgrim audience is on mid‑range phones on Saudi mobile networks) = lower rank + lower conversion. Server‑render static sections. |

---

## What is GOOD and must be preserved (do not rewrite)

The bones are solid. A rewrite would throw away real, correct work:

- **Centralized schema builder** ([lib/schema.ts](../../lib/schema.ts)) — clean JSON‑LD, and it **deliberately removed the fake AggregateRating/Review markup** with a comment explaining the penalty risk. This is exactly right.
- **SEO metadata helper** ([lib/seo.ts](../../lib/seo.ts)) — proper canonical, hreflang, robots, OG per page.
- **Rendering strategy on money pages** — routes, locations, recovery, are `generateStaticParams` + `revalidate = 86400` (SSG + daily ISR). Fast and indexable.
- **Genuinely unique per‑city copy** on location pages ([locations/[city]/page.tsx:59‑460](../../app/(marketing)/locations/[city]/page.tsx#L59)) — these are NOT doorway pages (the old templated version was already fixed).
- **301 redirect hygiene** in [next.config.ts](../../next.config.ts) for retired/duplicate URLs, and **middleware `/ar` dedupe** (301 to EN when no Arabic content) — good technical SEO.
- **The correct lead pattern already exists**: `/api/quotations` → Supabase → Resend admin+customer email ([api/quotations/route.ts](../../app/api/quotations/route.ts)). It's just not wired to your main funnels. You don't need to build lead‑capture — you need to *connect* it.
- **Single config sources** for contact ([lib/config/contact.ts](../../lib/config/contact.ts)) and stats ([lib/config/stats.ts](../../lib/config/stats.ts)) — the pattern is right, it's just not used everywhere yet.
- Breadcrumbs, TLDR/speakable blocks, next/image everywhere, sitemap + robots present.

---

## Where to spend the next 30 days (ROI order)

1. **Week 1 — Stop the bleeding & start seeing (Phases 1–3 in [06-phased-plan.md](06-phased-plan.md)):** wire booking notifications, add lead capture before every WhatsApp handoff, install GA4 + Pixel + click tracking. ~2–3 days of work. This makes every future marketing riyal measurable.
2. **Week 1–2 — Trust pass:** single price source; remove/relabel fake reviews; add CR/VAT/licence/address/landline (or remove the claims you can't back). ~2 days.
3. **Week 2+ — Demand generation (mostly outside the code):** create & verify the Google Business Profile, get your first 10 *real* reviews, launch a small Google Ads "airport transfer Jeddah / Umrah taxi" campaign now that you can measure it. **This is what actually moves the lead count.**
4. **Later — Performance & i18n polish, architecture consolidation.** Important, not urgent.

> If you do only three things this week: (a) check your database for orphaned bookings and wire notifications, (b) add name+phone capture to the homepage widget, (c) install GA4 + Meta Pixel. Everything else can wait.
