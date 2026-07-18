# UI PLAN — Ek Consistent Design System (Homepage jaisa)
> Har page conversion is plan ko follow kare. Naye colors/patterns invent NAHI karne.
> Verify: `python scripts/ui_consistency_check.py`

## Brand Colors (sirf yeh)
| Role | Value | Kahan |
|---|---|---|
| Page background | `bg-[#FAFAF7]` | har public page ka base |
| Section alt bg | `#F8FAFC` / `bg-white` | alternating sections |
| Green tint bg | `bg-[#F0FDF4]` | stats bars, table heads, tinted tiles |
| Primary green | `#16A34A` (hover `#15803D`) | CTAs, links hover, prices, h1 accent span |
| Golden yellow | `#FACC15` | hero primary CTA, dark-image accents |
| Gold accent | `#C9A84C` (light-bg text: `#B8963B`) | icons, badges, section labels, dividers `border-[#C9A84C]/10` |
| Heading text | `#1C1C1C` (ya `#0F172A`) | h1–h4 |
| Body text | `#6B7280` | paragraphs (WCAG AA pass) — #A1A1A6/#7C8088 BANNED |
| White text | `text-white` / `text-white/85` | SIRF dark image overlays ke upar |

## Patterns (copy-paste source: homepage + services pages)
- **Card:** `bg-white border border-[#16A34A]/12 rounded-3xl shadow-sm hover:shadow-lg hover:border-[#16A34A]/35 transition-all`
- **Hero (image wala):** `<Image opacity-30/40>` + overlay `bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/80 to-[#FAFAF7]/40` + DARK text (services pages dekho)
- **Image card overlay (dark):** `from-[#111]`/`from-black/60` + `text-white` — allowed idiom (homepage fleet cards)
- **Primary CTA:** `rounded-full bg-[#16A34A] text-white hover:bg-[#15803D]` + shadow `rgba(22,163,74,0.3)`
- **Secondary CTA:** `rounded-full border border-[#C9A84C]/45 text-[#C9A84C] hover:bg-[#C9A84C]/10`
- **Badge:** `rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#B8963B] uppercase tracking-[0.2em]`
- **Table:** head `bg-[#F0FDF4] text-[#6B7280]`, rows `divide-[#C9A84C]/5 hover:bg-[#F0FDF4]/60`, price `text-[#16A34A] font-bold`
- **FAQ card:** `bg-white border border-[#16A34A]/12 rounded-2xl p-6` — question `text-[#1C1C1C]`, answer `text-[#6B7280]`
- **Parallax:** `<ParallaxSection image title text buttonLabel buttonHref />` (components/sections) — section breaks par jahan suitable
- **Section divider:** `border-t border-[#C9A84C]/10` · Radius: cards `rounded-3xl`, chhote `rounded-2xl`, buttons `rounded-full`
- **Dark exceptions (intentional, mat chhedo):** Footer, WhatsApp tooltip, admin/dashboard UI

## Layout Rules
- Page wrapper: `<div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">` — `<main>` NAHI (SiteShell deta hai)
- Sections: `section-container` + `py-20`/`py-24`; headings `font-heading`, h2 size `clamp(1.75rem, 3.5vw, 2.5rem)`
- Ek h1 per page; Breadcrumbs top par (schema ke saath)
- Har detail page ke end mein `<ServiceRelatedLinks />` / `<RouteRelatedLinks />`

## Conversion (dark→light) Recipe
1. Codemod chalao (scratchpad `services-light-theme.js` jaisa mapping)
2. Image-overlay text ko `text-white` rakhna (checker "invisible text" warning dekho)
3. Dark gradient CTA boxes → `bg-white border border-[#16A34A]/15 shadow-lg`
4. `python scripts/ui_consistency_check.py` → 0 violations
5. `npx tsc --noEmit` + eslint changed files
6. WORK-LEDGER.md update karo
