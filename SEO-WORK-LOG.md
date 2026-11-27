# SEO Work Log — taxisaudiarabia.com

Running log of the SEO sprint. Keep this updated each session so future work
doesn't need to be re-derived. (Days 1–8 history lives in Claude's project
memory for now — this file starts fresh from Day 9's continuation.)

## Day 9 continuation (2026-07-20) — Fixed the /ar duplicate-content bug

**Problem found on Day 9, fixed today:** `/ar/*` pages were live and earning
real GSC clicks, but the language switch was 100% client-side
(`lib/context/LanguageContext.tsx`). The server always rendered English HTML
first; Arabic only appeared after hydration (`useEffect`). Worse, middleware
was rewriting *every* `/ar/<anything>` path to its English route regardless of
whether that page had any Arabic translation — so most of the site had a
byte-identical English clone living under a second `/ar/...` URL. That's a
likely contributor to the 151 "Discovered — currently not indexed" pages.

**Root cause:** `useState<Language>("en")` in `LanguageProvider` always
defaulted to English; the pathname check that should have set `"ar"` only ran
in a `useEffect`, which never executes during SSR. `middleware.ts` rewrote
`/ar/*` → `/*` unconditionally, so pages with zero Arabic content still
resolved and served English through the `/ar/` URL.

**Fix (only 6 pages actually have real Arabic copy — home, about, contact,
faq, pricing, partners; scoped the fix to those):**
- `lib/context/LanguageContext.tsx`: initial `language` state is now computed
  synchronously from `usePathname()` via a lazy `useState` initializer instead
  of a post-hydration effect — so `/ar/about`'s *server-rendered* HTML is
  actually Arabic now, not just the client-side re-render.
- `lib/config/i18n.ts` (new): single source of truth for which paths have
  real Arabic content (`AR_REAL_ROUTES`) vs. noindex utility pages that still
  rewrite client-side only (`AR_REWRITE_ROUTES`: `/book`, `/track-booking`,
  `/partners/driver-registration` — already noindex, so no duplicate-content
  risk, left as-is rather than building full routes for pages nobody indexes).
- `app/ar/page.tsx`, `app/ar/about/page.tsx`, `app/ar/contact/page.tsx`,
  `app/ar/faq/page.tsx`, `app/ar/pricing/page.tsx`, `app/ar/partners/page.tsx`
  (new): real static Next.js routes, each re-exporting the existing page
  component + its own Arabic `title`/`description` + self-referential
  `canonical` + bidirectional `hreflang` (`en`/`ar`/`x-default`) via
  `lib/seo.ts`'s extended `generateMetadata()` (`locale`, `hreflangPaths`).
- The matching English layouts (`app/about/layout.tsx`, `contact`, `faq`,
  `pricing`, `partners`, `app/page.tsx`) now declare the `ar` hreflang
  alternate back to their `/ar/...` counterpart.
- `middleware.ts`: `/ar/<path>` now only rewrites (old shadow behavior) for
  the 3 noindex utility paths, and returns `NextResponse.next()` for the 6
  real routes (Next's router serves `app/ar/*` natively). Every other
  `/ar/*` request — i.e. the ~140+ pages with no Arabic content — now
  **301-redirects to the English URL** instead of serving a duplicate.
- `app/sitemap.ts`: added the 6 real `/ar/*` URLs (priority 0.5); removed the
  stale "don't add /ar, it 404s" note.

**Verified locally** (`next dev`, raw `curl`, no JS): `/ar/about`'s HTML
source now contains real Arabic text and an Arabic `<title>`; `/about` stays
English; hreflang/canonical tags present and correct on both; `/ar/services`,
`/ar/fleet`, etc. (no translation) 301 → English equivalent; `/ar/book`
still works via rewrite. `tsc --noEmit` clean (pre-existing unrelated errors
in `app/(marketing)/locations/[city]/page.tsx` untouched).

**Known limitation (left as-is, low impact):** root `app/layout.tsx` still
hardcodes `<html lang="en">` — making it locale-aware would require reading
request headers in the root layout, which forces the whole site to dynamic
rendering (undoes the Day 1 static-generation perf fix). The `lang`/`dir`
attributes are still corrected client-side after hydration (existing
behavior in `LanguageContext`), so real users get correct RTL almost
instantly — only the very first byte of crawled HTML has the "wrong" `lang`
attribute on the `<html>` tag itself. The actual page *content* (the thing
that mattered for duplicate-content signals) is now correct in the raw HTML.

**Not done / still uncommitted:** these changes are on disk, `tsc` clean, not
yet committed or deployed. Also unrelated to this fix: existing in-progress
Prisma/quotations and homepage/stats work is sitting uncommitted in the same
working tree (`app/(dashboard)/admin/quotations/*`, `lib/supabase/quotations.ts`,
`components/sections/home-page.tsx`, `lib/config/stats.ts`, etc.) — left
untouched, don't bundle it into the /ar commit.
