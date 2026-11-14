# I18N-AUDIT.md — Phase 0 (read-only audit)

**Date:** 2026-08-28 · **Scope:** taxidriver (taxisaudiarabia.com) · **No code changed.**

---

## ⚠️ Sabse bara finding (Roman Urdu)

Plan maan raha hai ke i18n zero se lagana hai (next-intl install, `app/[locale]/`, `messages/*.json`).
**Lekin repo mein pehle se ek chalu custom Arabic system maujood hai** — apna middleware, `/ar/` routes,
language switcher, aur `<html dir/lang>` sab already kaam kar rahe hain. 6 pages + recovery cluster
Arabic mein LIVE hain aur index ho rahe hain.

**Isliye next-intl install / `app/[locale]` migration NAHI karni chahiye.** Wo:
- 6 live Arabic pages + recovery Arabic cluster tornay ka risk (SEO + rankings)
- Working middleware, hreflang, canonical sab dobara likhna
- Bohot credits jalana — **zero naya faida**, kyun ke jo plan maang raha hai wo 80% pehle se mojood hai.

**Sahi rasta:** mojooda pattern ko EXTEND karo (naye pages usi tareeqe se translate karo). Plan ke
Phase 2 (RTL), Phase 4 (translation priority), Phase 5 (SEO hreflang) abhi bhi valid hain — sirf
Phase 1 (infra install) ki zaroorat NAHI, wo ho chuka hai.

---

## 1. Stack

| Cheez | Value | Note |
|---|---|---|
| Next.js | `^15.3.2` | App Router — **confirmed** (`app/` dir, `layout.tsx`, RSC) |
| next-intl / next-i18next | **Nahi hai** | Custom in-house i18n instead |
| Tailwind | **v4** (`tailwindcss ^4.0.15`, `@tailwindcss/postcss ^4.1.7`) | Logical utilities (`ms-`, `ps-`, `text-start`, `start-`) **native available** ✅ |
| React | 19 | — |
| Arabic font | **Cairo** already wired via `next/font/google` (`--font-arabic`, subset `arabic`) | ⚠️ globally load hota hai, sirf `ar` par nahi (chhoti perf cost) |

---

## 2. Mojooda custom i18n system (already built)

Ye samajhna zaroori hai — plan ise nahi jaanta.

**a) URL structure — plan se already match:**
- English root par (`/services/umrah-transport`) — untouched, rankings safe ✅
- Arabic `/ar/` prefix par (`/ar/about`) ✅
- Slugs English hi hain (`/ar/routes/jeddah-airport-to-makkah`) ✅ — bilkul plan jaisa

**b) `middleware.ts`** — dil hai is system ka:
- `/ar/` detect karta hai, `x-locale` request header set karta hai
- Jis `/ar/...` path ka Arabic content NAHI, usay 301 → English (duplicate-content se bachne ke liye)
- Allowed Arabic paths ki list `lib/config/i18n.ts` se aati hai
- `localePrefix: 'as-needed'` ka behaviour effectively already implemented

**c) `lib/config/i18n.ts`** — single source of truth:
- `AR_REAL_ROUTES` = jin paths ke real Arabic SSR pages hain
- `AR_REWRITE_ROUTES` = noindex utility pages jo client-side Arabic ho jate hain (`/book`, `/track-booking`, `/partners/driver-registration`)
- Recovery cities/routes data se auto-register hote hain

**d) `app/layout.tsx`** (root):
- `x-locale` header se `<html lang={locale} dir={locale==='ar'?'rtl':'ltr'}>` **server-side** set karta hai ✅ (first paint sahi, koi flash nahi)

**e) `lib/context/LanguageContext.tsx`** (client):
- `/ar/` prefix se language state banata hai, cookie/localStorage yaad rakhta hai
- **Auto browser-redirect NAHI karta** ✅ (plan ne yehi mana kiya tha — pehle se sahi)

**f) `components/shared/LanguageSwitcher.tsx`** — header ka button:
- Plan keh raha tha "🇬🇧 en" ko `EN | العربية` se replace karo. **Ye pehle se ho chuka hai** — dropdown hai: `🇬🇧 English` / `🇸🇦 العربية`
- `setLanguage()` current path ka prefix swap karke doosre locale par bhejta hai (homepage par nahi) ✅
- Agar current page ka Arabic version nahi to switch refuse karta hai (safe)

---

## 3. Content kahan hai? (Phase 0 ka sabse ahem sawal)

Mila-jula: routes/locations/recovery **data-driven** hain, services **hardcoded** hain.

| Content | Kahan | Arabic status | Translation approach |
|---|---|---|---|
| **Routes (76)** | `lib/data/routes.ts` (data) + `routes/[slug]/page.tsx` (1 template) | ✅ **Har route mein `fromCityAr`, `toCityAr`, `descriptionAr` PEHLE SE hai** | Sirf 1 template Arabic karo + data ready hai. **Bohot sasta.** |
| **Locations (12 cities)** | `lib/data/locations.ts` (data) + `locations/[city]/page.tsx` (1 template) | ⚠️ Sirf `nameAr` hai. `description/tldr/tips/faqs/testimonials` **English-only** | Template + har city ki body text Arabic add karni hogi (medium cost) |
| **Recovery (cities+routes)** | `lib/data/recovery.ts` (78 Ar fields!), `recovery-routes.ts` | ✅ **Bhari bilingual, real Arabic pages LIVE** | Ho chuka — template as reference |
| **Airports (4)** | `lib/data/airports.ts` | ⚠️ Partial (10 Ar fields) | Data complete karke template |
| **Subareas** | `lib/data/subareas.ts` | Partial (34 Ar fields) | Data-driven |
| **Services (18)** | Har service ka apna folder, **inline hardcoded** `TITLE`/`DESCRIPTION`/`PACKAGES` arrays | ❌ **Zero Arabic, fully hardcoded per-page** | **Sabse mehnga.** Har page ek-ek karke. Money pages (umrah, airport, intercity, corporate) pehle. |
| **Homepage + about/contact/faq/pricing/partners** | Client components, **inline `translations = {en, ar}` object** | ✅ Arabic LIVE | Yehi pattern extend karo |
| Blog/guides/events | `lib/data/*.ts` | ❌ English-only | Phase 5 / skip |

**Nateeja:** Routes ka 76-page dukhda pehle se hal hai (data + template). Asal kaam:
1. **18 hardcoded service pages** (biggest cost — money pages first)
2. **Locations body text** (nameAr ke ilawa baaki)
3. Global chrome strings jo abhi English-only hain (header/footer/booking console ke andar)

---

## 4. Header ka "🇬🇧 en" button abhi kya karta hai

Plan ka assumption purana hai. Abhi wo ek **full working dropdown switcher** hai (`LanguageSwitcher.tsx`):
`🇬🇧 English` / `🇸🇦 العربية`. Click par current page ke doosre locale par le jata hai (agar mojood ho),
warna switch nahi karta. **Ye kaam ho chuka — sirf styling review chahiye ho to.**

---

## 5. Global chrome (header/footer/booking/WhatsApp) kin components mein

| Chrome | Component | i18n status |
|---|---|---|
| Shell (sab wrap) | `components/layout/SiteShell.tsx` | — |
| Header | `components/layout/site-header.tsx` + `Navbar.tsx` | Kuch `useLanguage` use karte hain; nav labels check karne honge |
| Footer | `components/layout/Footer.tsx` (+ `site-footer.tsx` duplicate?) | `useLanguage` use karta hai |
| Homepage sections | `components/sections/home-page.tsx` | `useLanguage` — bilingual |
| Booking / WhatsApp CTA | `components/booking/WhatsAppQuoteForm.tsx` | `useLanguage` — bilingual, WhatsApp prefill yahan |
| Html lang/dir sync | `components/i18n/HtmlLangSync.tsx` | client dir/lang sync |

⚠️ **Do footer files** (`Footer.tsx` + `site-footer.tsx`) — konsa active hai, confirm karna (dead code ho sakta hai).

---

## 6. RTL scope (Phase 2 ka andaza)

`globals.css` mein **koi RTL layout handling nahi** (sirf marquee animation + `[lang="ar"]` font swap).
Directional Tailwind classes convert karni hongi:

| Pattern | Count (app+components) | Convert to |
|---|---|---|
| `ml- / mr- / pl- / pr-` | ~91 | `ms- / me- / ps- / pe-` |
| `left- / right-` | ~126 | `start- / end-` |
| `text-left / text-right` | ~77 | `text-start / text-end` |
| **Total directional** | **~294** | Logical utilities |
| Already logical | **1** | (kaam abhi shuru nahi hua) |

Tailwind v4 mein ye sab native support hain — sirf mechanical replace + arrow flips (`rtl:-scale-x-100` route cards ke `→`/`➔` par) + component-level testing (booking console, fleet slider, mobile drawer, FAQ chevrons).

---

## 7. Plan vs reality — kya karna hai / kya SKIP

| Plan phase | Verdict |
|---|---|
| **Phase 1: next-intl install, `app/[locale]`, messages JSON** | ❌ **SKIP.** System already hai. Migration = live pages tornay ka risk + credit waste. |
| Phase 1: URL structure (en root, ar prefix) | ✅ Already done |
| Phase 1: `<html lang/dir>`, Arabic font | ✅ Already done (font ko `ar`-only conditional karna = chhoti optimization) |
| **Phase 2: RTL logical classes + arrow flips** | ✅ **VALID — asal kaam yahan hai** (~294 classes + component testing) |
| Phase 3: Language switcher | ✅ Already built — sirf review |
| Phase 3: no auto-redirect, cookie memory | ✅ Already done |
| **Phase 4: Translation priority (money pages)** | ✅ **VALID.** Data-driven cheezen sasti (routes ready). 18 service pages + locations body = asal cost. |
| **Phase 5: SEO hreflang/canonical/JSON-LD `ar-SA`** | ⚠️ Partly wired (`lib/seo.ts`, `hreflangPaths`) — audit karke gaps bharo |

**Ek architecture faisla jo user ko lena hai:** mojooda pattern strings ko component ke andar
`translations = {en, ar}` object mein rakhta hai — **`messages/en.json` + `ar.json` mein NAHI**. Do options:

- **(A) Existing pattern extend karo** (recommended): kam risk, kam credit, consistency. Plan ka "sab strings JSON mein" rule chhor do.
- **(B) messages JSON par migrate karo**: 6 live pages rewrite, zyada saaf lekin mehnga + risky.

---

## 8. Recommended next step (Phase 1 ke bajaye)

1. **Faisla:** Option A (existing pattern) confirm karo — phir koi infra install nahi.
2. **Pilot page:** plan ke mutabiq `/ar/services/umrah-transport` end-to-end banao — **ye pehla hardcoded service page hoga**, isse pattern set hoga baaqi 17 ke liye.
3. Phase 2 RTL sweep ek alag commit mein (mechanical, low-risk).
4. `I18N-PROGRESS.md` maintain karo (checklist) taake har session repo dobara na parhe.

**Koi code abhi tak change nahi hua. Approval ka intezaar — Option A/B aur pilot page confirm karen.**
