# I18N-PROGRESS.md — Arabic i18n execution tracker

Branch: `feat/arabic-i18n` · Approach: **Option A** (extend existing custom pattern; NO next-intl).
Full audit: see [I18N-AUDIT.md](./I18N-AUDIT.md). Rules: no redesign, English URLs/content untouched, targeted greps only.

## Decisions locked
- next-intl migration **CANCELLED**. Existing `/ar/` + middleware + LanguageContext extended.
- Strings stay inline per-component (`translations = {en, ar}`), NOT `messages/*.json`.
- English root URLs & content untouched. Arabic on `/ar/` only.
- `components/ar/*` = Arabic-only, written RTL-visual — **excluded from logical-class codemod**.

## STEP 1 — RTL sweep ✅ COMPLETE (1a=cdd0fb9, 1b=5dd8e22, 1c=bcb05f0, 1d=verified)
- [x] **1a** Logical margins/padding/text-align in shared components (`ml/mr/pl/pr → ms/me/ps/pe`, `text-left/right → text-start/end`). 14 files, codemod, `ar/` excluded. globals.css had 0 targets. ✅ committed
- [x] **1b** `left-/right-` → `start-/end-` — MANUAL (11 files). Floating CTAs → `end` (bottom-left in RTL). Intentionally left: `dialog` centering `left-1/2 -translate-x-1/2` (symmetric), `popover`/`select` `slide-in-from-left/right` (physical placement-side animations). ✅ committed
- [x] **1c** Arrow flips → `rtl:-scale-x-100` on **lucide icon arrows** only (12: RouteRelatedLinks, ServiceRelatedLinks, RelatedLinks, Breadcrumbs, home-page cards). Text-glyph arrows already language-correct (English `→`, Arabic strings already use `←`), so NOT CSS-flipped. ✅ committed
- [x] **1d** RTL verify (structural/CSS-level via dev server). Both pages `<html lang=ar dir=rtl>`, Arabic SSR content, no forced-LTR override, no compile errors. Generated CSS confirms logical utilities (`margin/padding-inline`, `inset-inline`, `text-align:start`) + `.rtl\:-scale-x-100` rule all emit. Chrome (switcher/WhatsApp/footer) renders. ⚠️ Pixel-level not done headless — **user to browser-eyeball**: WhatsApp now bottom-left, long-Arabic overflow, `/ar/book` calendar. ✅

### Deferred (global-chrome translation, STEP 4)
- [ ] **Navbar mega-menu is English-only** (no `useLanguage`) — its `→` glyphs + labels ("View All Services →", "Jeddah Airport → Makkah") get Arabic `←` when Navbar is translated, matching the Footer/home-page string pattern. Not CSS-flipped.

### ⚠️ Deferred visual test (don't miss)
- [ ] **`/ar/book` calendar** date-range RTL: `calendar.tsx` was converted to logical (`rounded-s/e`, `after:end/start-0`) but `/ar/book` isn't in 1d scope. Eyeball date-range mirroring on `/ar/book` before final sign-off.

## STEP 2 — Routes Arabic template (decision: FULL PARITY — translate all 71 bespoke)
Content audit done: ArabicRoutePage chrome = 100% Arabic; English has 71/76 bespoke `ROUTE_CONTENT` entries (only 5 use DEFAULT_FAQS); Arabic had only 5. Real English leak on /ar pages = **Navbar mega-menu** (global-chrome, STEP 4). Route content lives in a parallel map, NOT routes.ts.

- [x] **2a Infrastructure** ✅ committed
  - `lib/data/routes-content-ar.ts` — `AR_ROUTE_CONTENT` map (meta + ArabicRouteContent) + `AR_ROUTE_CONTENT_SLUGS`
  - `app/ar/routes/[slug]/page.tsx` — dynamic (generateStaticParams, per-slug Arabic metadata, `dynamicParams=false`, revalidate 86400)
  - `lib/config/i18n.ts` — `AR_ROUTE_SLUGS` now derived from content map (single source)
  - Deleted 5 standalone hand-written pages → migrated into the map
  - Verified: 5 pages 200+Arabic, non-content /ar 301→EN, hreflang en/ar/x-default bidirectional, og:locale ar_SA, tsc clean
- [ ] **2b–2n Translation batches** — remaining routes (~10/batch), each = metaTitle + metaDescription + badge + introExtra + tldrAnswer + tldrFacts + whyUs + faqs. Add entry to `AR_ROUTE_CONTENT` → auto-registers (middleware + hreflang + static param). Native review on money routes.
  - [x] **Batch 1** (10 money routes) ✅ committed — machine-translated, native review pending: jeddah-to-makkah, makkah-to-jeddah-airport, makkah-to-jeddah, madinah-to-makkah, jeddah-airport-to-jeddah-city, riyadh-airport-to-city, madinah-airport-to-city, riyadh-to-alula, madinah-to-alula, riyadh-to-dubai. Verified: 200+Arabic H1+FAQ, untranslated still 301, tsc clean.
  - **Progress: 15/76 routes** (5 infra + 10 batch-1). Remaining: 61.

### Branch reconciliation ✅ done (merge `1d78540`)
`main` had advanced with 2 SEO commits (`bb752a3` Premium repositioning, `8666a4b` SEO internal links). Merged main → feat; overlap in `Footer.tsx` + `home-page.tsx` auto-merged cleanly (RTL logical classes and SEO changes were on different lines). Verified: both change-sets present, no physical directional classes remain, tsc clean. feat is now a superset of main.

## STEP 3 — Pilot: `/ar/services/umrah-transport`
- [ ] First hardcoded service page translated (pattern for remaining 17)

## STEP 4+ — Batch (per approval)
- [ ] Remaining 17 service pages (money pages first)
- [ ] Locations body text (only nameAr exists today)
- [ ] SEO hreflang/canonical/JSON-LD `ar-SA` gap-fill

## Verification facts (2026-08-28)
- `/ar/about` = real Arabic SSR (raw HTML has `<html lang=ar dir=rtl>` + Arabic body). ✅
- `routes.ts` = 100% translatable fields bilingual (76×3). ✅
- Active footer = `Footer.tsx`; `site-footer.tsx` = dead code.
- Tailwind v4 (logical utilities native). Arabic font = Cairo via next/font.
