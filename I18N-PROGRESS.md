# I18N-PROGRESS.md — Arabic i18n execution tracker

Branch: `feat/arabic-i18n` · Approach: **Option A** (extend existing custom pattern; NO next-intl).
Full audit: see [I18N-AUDIT.md](./I18N-AUDIT.md). Rules: no redesign, English URLs/content untouched, targeted greps only.

## Decisions locked
- next-intl migration **CANCELLED**. Existing `/ar/` + middleware + LanguageContext extended.
- Strings stay inline per-component (`translations = {en, ar}`), NOT `messages/*.json`.
- English root URLs & content untouched. Arabic on `/ar/` only.
- `components/ar/*` = Arabic-only, written RTL-visual — **excluded from logical-class codemod**.

## STEP 1 — RTL sweep
- [x] **1a** Logical margins/padding/text-align in shared components (`ml/mr/pl/pr → ms/me/ps/pe`, `text-left/right → text-start/end`). 14 files, codemod, `ar/` excluded. globals.css had 0 targets. ✅ committed
- [x] **1b** `left-/right-` → `start-/end-` — MANUAL (11 files). Floating CTAs → `end` (bottom-left in RTL). Intentionally left: `dialog` centering `left-1/2 -translate-x-1/2` (symmetric), `popover`/`select` `slide-in-from-left/right` (physical placement-side animations). ✅ committed
- [ ] **1c** Arrow flips (`→`/`➔`) on route/service cards → `rtl:-scale-x-100`
- [ ] **1d** Visual verify on `/ar/about` + `/ar/routes/jeddah-airport-to-makkah`

### ⚠️ Deferred visual test (don't miss)
- [ ] **`/ar/book` calendar** date-range RTL: `calendar.tsx` was converted to logical (`rounded-s/e`, `after:end/start-0`) but `/ar/book` isn't in 1d scope. Eyeball date-range mirroring on `/ar/book` before final sign-off.

## STEP 2 — Routes Arabic template
- [ ] 1 template Arabic-ready → 76 pages (data already 100% bilingual: fromCityAr/toCityAr/descriptionAr)

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
