# Dammam Satha — Final Implementation Audit (pre-code)

**Objective:** Google search → qualified towing / car-transport lead → WhatsApp/call → **Dammam-based** driver (brother) → paid booking. Not max indexed pages.
**Status:** AUDIT ONLY. No code changed. Awaiting approval before implementation.
**Date:** 2026-08-22

---

## 1. Existing recovery routes / pages discovered

| URL | File | Type |
|---|---|---|
| `/services/car-recovery` | `app/(marketing)/services/car-recovery/page.tsx` | Hub (static) |
| `/services/car-recovery/[city]` | `app/(marketing)/services/car-recovery/[city]/page.tsx` | Dynamic city (9 slugs) |

**9 city slugs live** (from `lib/data/recovery.ts` → `RECOVERY_CITIES`): riyadh, jeddah, dammam, makkah, madinah, taif, al-khobar, tabuk, yanbu, jubail.
Data-driven: 1 entry in `recovery.ts` = 1 page + sitemap + internal links. Also referenced in: `app/sitemap.ts`, `components/seo/ServiceRelatedLinks.tsx`, `components/layout/Footer.tsx`, `app/services/page.tsx`.
**No Arabic recovery pages exist. No intercity route pages exist.**

## 2. Existing localization architecture (CRITICAL)

- **No `next-intl` / no `[locale]` segment.** Arabic = **manual mirror under `app/ar/*`**, one hand-written file per page.
- Only real Arabic pages today: `/ar`, `/ar/about`, `/ar/contact`, `/ar/faq`, `/ar/pricing`, `/ar/partners`, `/ar/routes/jeddah-airport-to-makkah` (see `lib/config/i18n.ts` → `AR_REAL_ROUTES`).
- **Middleware gate (`middleware.ts`):** any `/ar/*` path **not** in `AR_REAL_ROUTES`/`AR_REWRITE_ROUTES` → **301 redirect to English**. → Every new Arabic recovery/route path MUST be registered or it silently dies.
- **hreflang:** done in `lib/seo.ts` via `hreflangPaths:{en,ar}` → `alternates.languages {en, ar, x-default}`. **English recovery pages currently build metadata inline and have NO hreflang** → must be added.
- RTL handled per-page with `dir="rtl" lang="ar"` on the wrapper (see `/ar/routes/...` example). `x-locale` header set by middleware for `<html lang/dir>`.
- `LanguageSwitcher.tsx` + `LanguageContext.tsx` exist for the client toggle.

**Implication:** Arabic pages are hand-built one-by-one today. For a scalable cluster we should add a **dynamic Arabic route** reading Arabic fields from `recovery.ts` (recommended below), not 8 hand-written files.

## 3. Existing CTA / WhatsApp implementation

- `lib/config/contact.ts` → `recoveryContact.whatsappNumber = "966539388072"` (brother's number) used ONLY on recovery pages. `contactConfig` = main site.
- Pattern already used: `https://wa.me/${number}?text=${encodeURIComponent(...)}` with a pre-filled English message including city.
- Buttons present: WhatsApp (green), Request Callback, Emergency Call, form. **No sticky mobile bar. No Arabic pre-filled text.**

## 4. Existing lead attribution implementation

- `RecoveryLeadForm.tsx` → POST `/api/quotations` (same pipeline as taxi). Leads land in admin dashboard.
- **Attribution already works** via `notes`: `CAR RECOVERY — {city} | Service: … | Vehicle: …`. This is the source tag brother/admin filters on. **Preserve & extend** with consistent labels (§ Lead attribution below).

## 5. Existing image implementation

- Hub hero: real photo `public/services/car-recovery-hero.webp` (brother's truck).
- **City pages reuse generic city hero photos** (`/locations/dammam-hero.webp` etc.) — Khobar/Jubail both reuse Dammam's; Tabuk reuses Riyadh's. **No real truck photo on city pages, no gallery.**
- `next.config.ts` allows remote `images.unsplash.com` only. Local `next/image` used with `fill`.

## 6. Exact pages to MODIFY

| File | Change |
|---|---|
| `app/(marketing)/services/car-recovery/page.tsx` | Restructure hub into **Eastern Province** + **Intercity transport** clusters; remove fake "serves every city"; remove SAR numbers; add hreflang→`/ar/...`; sticky CTA. |
| `app/(marketing)/services/car-recovery/[city]/page.tsx` | Remove `From SAR {price}` badge; honest Dammam-based copy; sticky CTA; gallery slot; add hreflang; support route slugs (see §7 decision) or split. |
| `lib/data/recovery.ts` | Remove `RECOVERY_PRICING` numbers → "on WhatsApp"; drop network/dispatch-time claims from `intro`/`faqs`; add **Arabic fields**; add 5 EP cities; add `nameAr` to services; add route data (or new file). |
| `lib/config/i18n.ts` | Add all `/ar` recovery + route paths to `AR_REAL_ROUTES` (ideally generated from `RECOVERY_CITIES`/routes so it stays in sync). |
| `middleware.ts` | If we generate the list, no logic change; else allow `/services/car-recovery/` prefix for `/ar`. |
| `app/sitemap.ts` | Add Arabic recovery hub+cities, English+Arabic route pages. |
| `components/recovery/RecoveryLeadForm.tsx` | Arabic variant + Arabic pre-filled WhatsApp; consistent lead-source labels; ensure no price. |
| `components/seo/ServiceRelatedLinks.tsx`, `components/layout/Footer.tsx` | Add EP cities + route links (EN/AR). |

## 7. Exact pages to CREATE

**New data (not files):**
- EP city entries: **Dhahran, Qatif, Ras Tanura, Abqaiq, Al-Ahsa/Hofuf** (Al-Ahsa page also covers Hofuf + Mubarraz naturally — 1 page, not 3).
- Route entries: **Dammam→Riyadh, Dammam→Jeddah, Dammam→Yanbu** (`lib/data/recovery-routes.ts` or inside `recovery.ts`).

**New files:**
- `app/ar/services/car-recovery/page.tsx` — Arabic hub (RTL).
- `app/ar/services/car-recovery/[slug]/page.tsx` — Arabic dynamic city **+** route (RTL).
- `components/recovery/StickyRecoveryCTA.tsx` — mobile sticky WhatsApp + Call bar.
- (Optional) `components/recovery/TruckGallery.tsx` — placeholder-aware until real photos arrive.

**⚠️ URL decision needed — routes vs cities share one segment.**
Next can't have `[city]` and `[route]` at the same level. Two options:
- **(A, recommended)** Rename `[city]` → `[slug]`; page tries `getRecoveryRoute(slug)` first, else `getRecoveryCity(slug)`, else `notFound()`. Gives the exact URLs you want: `/services/car-recovery/dhahran` **and** `/services/car-recovery/dammam-to-riyadh`. One template branch per type.
- **(B)** Keep cities under `[city]`, put routes under `/services/car-recovery/transport/[route]`. Cleaner separation, slightly longer URL.

## 8. English keyword → page map

| Page | Primary | Secondary | Intent |
|---|---|---|---|
| Hub | car recovery Saudi Arabia | flatbed satha, tow truck | Nav/brand |
| Dammam | car recovery Dammam | satha Dammam, tow truck Dammam 24/7 | Emergency |
| Dhahran | car recovery Dhahran | satha Dhahran, breakdown Dhahran | Emergency/local |
| Khobar (opt.) | car recovery Al Khobar | satha Khobar, causeway recovery | Local |
| Qatif | car recovery Qatif | satha Qatif, towing Qatif | Local |
| Ras Tanura | car recovery Ras Tanura | towing Ras Tanura | Local |
| Abqaiq | car recovery Abqaiq | towing Abqaiq (Aramco) | Local |
| Al-Ahsa | car recovery Al-Ahsa / Hofuf | towing Hofuf, Mubarraz | Local |
| Dammam→Riyadh | Dammam to Riyadh car transport | flatbed/satha Dammam Riyadh | Transport |
| Dammam→Jeddah | Dammam to Jeddah car transport | satha Dammam Jeddah | Transport |
| Dammam→Yanbu | Dammam to Yanbu car transport | satha Dammam Yanbu | Transport |

## 9. Arabic keyword → page map

| Page | Primary (AR) | Secondary (AR) | Intent |
|---|---|---|---|
| Dammam | سطحة الدمام | سطحة هيدروليك الدمام · سطحة الدمام ٢٤ ساعة · سحب سيارات الدمام | Emergency |
| Dhahran | سطحة الظهران | سطحة هيدروليك الظهران · سحب سيارات الظهران | Local |
| Khobar | سطحة الخبر | سطحة الخبر ٢٤ ساعة · سحب سيارات الخبر | Local |
| Qatif | سطحة القطيف | سطحة هيدروليك القطيف · نقل سيارات القطيف | Local |
| Ras Tanura | سطحة رأس تنورة | سحب/نقل سيارات رأس تنورة | Local |
| Abqaiq | سطحة بقيق | سحب/نقل السيارات بقيق | Local |
| Al-Ahsa | سطحة الأحساء | سطحة الهفوف · سطحة المبرز · نقل سيارات الأحساء | Local |
| Dammam→Riyadh | نقل سيارة من الدمام إلى الرياض | سطحة من الدمام إلى الرياض | Transport |
| Dammam→Jeddah | نقل سيارة من الدمام إلى جدة | سطحة من الدمام إلى جدة | Transport |
| Dammam→Yanbu | نقل سيارة من الدمام إلى ينبع | سطحة من الدمام إلى ينبع | Transport |

> "سطحة قريبة مني" (near me) = handled on-page via LocalBusiness schema + Dammam geo, not a separate page.
> **Note:** keyword-intent is assigned from competitor phrasing you supplied + logic; no live volume/competition tool is wired in this repo. If you want validated volumes, that's an external step (GSC after launch is the cheapest real signal).

## 10. Internal-linking map

- **Dammam (EN & AR) = hub of the cluster.** Links out to: Dhahran, Khobar, Qatif, Ras Tanura, Abqaiq, Al-Ahsa, + Dammam→Riyadh/Jeddah/Yanbu.
- Every EP city + route page links **back to Dammam** ("Need a local satha in Dammam? →") and to the recovery hub.
- Route page ↔ its destination context; route page → Dammam hub.
- Arabic pages link only to Arabic siblings; each EN↔AR pair cross-links via `hreflang` + visible language switch.
- Hub restructured: **Eastern Province** block (real coverage) then **Intercity transport** block.

## 11. Schema plan

- **City (EN/AR):** `serviceSchema` (serviceType "Vehicle Towing & Recovery", areaServed = city + Eastern Province) + `faqSchema` (Arabic FAQs on AR) + `breadcrumbSchema` + `speakableSchema`.
- **Route (EN/AR):** `Service` w/ serviceType "Vehicle Transport", areaServed = [Dammam, destination] + `faqSchema` + breadcrumb. (Not `TouristTrip` — that's passenger.)
- **NEW — single-location trust:** add one `AutomotiveBusiness`/`TowingService` LocalBusiness node for the **Dammam** base (name, telephone, Dammam geo, `openingHours` 24/7 only if true, `areaServed` = Eastern Province). Strong local signal without a GBP.
- Reuse existing `SITE.businessId` provider linkage. No fake `aggregateRating`/review schema.

## 12. Sitemap / hreflang plan

- `app/sitemap.ts`: add Arabic recovery hub + Arabic city URLs + EN & AR route URLs (auto-derive from data, like existing `recoveryItems`).
- Register every AR path in `AR_REAL_ROUTES` (§2) — otherwise middleware 301s them out of the index.
- hreflang emitted per-page via `seo()`/`hreflangPaths` (bidirectional en/ar/x-default). English recovery pages must switch to (or add) this.
- One canonical per language; EN canonical = EN URL, AR canonical = AR URL.

## 13. Potential cannibalization risks

- **Taxi vs recovery same city:** existing `/locations/dammam`, `/locations/alkhobar`, `/locations/yanbu` (passenger taxi) vs recovery pages — different intent; keep recovery copy strictly satha/towing/transport, never "taxi".
- **Route recovery vs taxi routes:** `/routes/*` and `/services/intercity` target passenger rides; recovery routes target "نقل سيارة / car transport". Keep vocabulary separate.
- **Al-Ahsa spread:** Hofuf/Mubarraz on ONE page, not three (avoids thin near-dupes).
- **Route direction dupes:** one page per route cluster (no Dammam→Riyadh + Riyadh→Dammam + "satha"/"towing"/"recovery" variants). Per your rule.
- Low risk otherwise; EP cities are distinct locations.

## 14. Unsupported claims that MUST be removed (currently live in `recovery.ts`)

- Riyadh: "our recovery network covers **every district**", "units are spread across Olaya, KAFD…" → implies fleet in Riyadh.
- Dammam: "network is strongest", "flatbeds, winch trucks, and heavy loaders **available around the clock**".
- Global FAQ: "**20–45 min** … in Riyadh, Jeddah, and Dammam", "our **network** includes heavy-duty loaders", "we **position extra flatbeds**".
- Every city "**Is there a recovery truck near me** … units are based across [districts]" → implies multi-truck presence.
- **Decision — far-city pages (riyadh, jeddah, makkah, madinah, taif, tabuk):** these assert local emergency presence where brother is NOT. Recommend: **reframe Riyadh/Jeddah as intercity-transport destinations** (honest) and **`noindex` or retire makkah/madinah/taif/tabuk** recovery pages (no real service). Needs your call.
- Replace all with truthful: "**Dammam-based satha, serving Dammam & the surrounding Eastern Province**; intercity car transport to other cities on booking."

## 15. Technical risks

1. **Middleware whitelist** — forget to register an AR path → silent 301 to English (page "disappears"). Mitigate by generating the list from data.
2. **`[city]`→`[slug]` rename** — must update `generateStaticParams`, `getRecoveryCity` callers, and any hard links; no URL change for existing cities so no redirects needed. Route type must `notFound()` cleanly on unknown slug.
3. **Two content types, one segment** — clear branch logic + tests, else a route slug renders an empty city.
4. **Arabic pre-filled WhatsApp** — RTL text + `\n` must be `encodeURIComponent`'d (existing pattern is fine).
5. **Images** — only 1 real truck photo exists. Gallery ships as **placeholder** until brother sends photos; do NOT substitute AI/stock as "proof". Filenames like `dammam-satha-hydraulic-flatbed.webp` + real alt text.
6. **Pricing removal** — sweep hero badge, hub cards, `RECOVERY_PRICING` table, metadata descriptions, `startingPrice` usages; replace with "Price on WhatsApp / احصل على السعر عبر واتساب".
7. Build/type safety: new Arabic fields optional-typed so existing cities don't break before content is filled.

---

## Recommended first-deployment scope (for approval)

**Optimize:** hub, Dammam, Khobar, Jubail (remove fake claims + price, honest copy, sticky CTA).
**New EP cities (EN+AR):** Dhahran, Qatif, Ras Tanura, Abqaiq, Al-Ahsa/Hofuf.
**New routes (EN+AR):** Dammam→Riyadh, Dammam→Jeddah, Dammam→Yanbu.
**Cross-cutting:** WhatsApp-only pricing, sticky mobile CTA, Arabic pre-filled messages, dynamic Arabic route + middleware registration, hreflang, sitemap, LocalBusiness(Dammam) schema, lead-source labels, gallery placeholders.

### Decisions LOCKED (2026-08-22)
1. **URL model:** (A) rename `[city]` → `[slug]`, handles both city + route. URLs: `/services/car-recovery/dhahran` and `/services/car-recovery/dammam-to-riyadh`.
2. **Far-city pages:** **Riyadh & Jeddah → reframe as "intercity transport from Dammam"** (honest); **Makkah, Madinah, Taif, Tabuk → `noindex`** (no real service). All fake local-dispatch claims removed.
3. **Arabic build:** **dynamic** `/ar/services/car-recovery/[slug]` reading Arabic fields from `recovery.ts` + AR paths auto-registered in `AR_REAL_ROUTES`.

### Lead attribution labels (to standardize)
`CAR RECOVERY — DAMMAM/DHAHRAN/KHOBAR/QATIF/RAS TANURA/ABQAIQ/AL-AHSA`
`CAR TRANSPORT — DAMMAM TO RIYADH/JEDDAH/YANBU`
(+ language tag EN/AR appended to notes so GSC-vs-lead analysis is possible.)
