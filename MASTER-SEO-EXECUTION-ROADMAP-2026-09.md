# Master SEO Execution Roadmap — 2026-09

Living change log for the Phase 1+ execution work that follows
`MASTER-AUDIT-2026-09-27.md`. One entry per batch, in order. Do not
rely on memory — this file plus `seo/page-log.md` are the source of
truth for what's actually been done vs proposed.

---

## Batch 0 — Technical/conversion fixes — DONE, validated, not deployed (2026-09-27)

Pre-approved directly in the Phase 1 execution prompt (§4). Full detail
in `seo/page-log.md` ("Phase 0 master audit + Batch 0 technical/conversion
fixes — 2026-09-27"). Summary:

- `twitter.title` fixed on airport pages + car-recovery service pages.
- Hero LCP (`priority`+`sizes`) fixed on location pages, airport-transfers,
  and all 4 Ziyarat pages.
- Duplicate `/faq` `FAQPage` JSON-LD removed; homepage got its own accurate
  FAQ schema (EN+AR) instead of the removed generic sitewide one.
- `lib/analytics.ts` taxonomy extended (`email_click` event, `path` field
  on `whatsapp_click`/`phone_click`). Tracking wired on: `WhatsAppButton.tsx`,
  `Footer.tsx`, `Navbar.tsx`, 4 sites in `home-page.tsx`, 2 sites in
  `RoutesClient.tsx`, plus `lead_captured` added to `CorporateAccountForm.tsx`
  and `RecoveryLeadForm.tsx` (both had zero tracking despite being real forms).
- Weak/bare WhatsApp prefills upgraded to the structured bulleted format
  everywhere tracking was added.
- `booking-form.tsx` / `site-footer.tsx` / `ScrollCTA.tsx` assessed, not
  deleted — recommendations on file in `seo/page-log.md`.

**Validation:** `tsc --noEmit` 0 errors · lint 0 errors (3 pre-existing
warnings) · `next build` exit 0. **Not deployed** — awaiting explicit
"deploy" instruction per CLAUDE.md rule 8.

**Known out-of-scope items surfaced during Batch 0** (not done, flagged
for a future batch): the ~150 page-level WhatsApp/email CTAs living in
Server Components can't carry `onClick` without a shared client-component
wrapper (large, separate batch); the CTA-collision on car-recovery mobile
pages; the Arabic language-switcher fix; deletion of the 3 orphaned
components.

## Batch 1 — Internal-linking + language switcher — PROPOSED, awaiting approval

Proposed at the end of the Phase 1 GSC scorecard pass. Not yet approved,
not implemented. See the "BATCH 1 PROPOSAL" table in that response for
the 7 items (inbound links to `jeddah-airport-to-makkah`, `makkah-to-madinah`,
`umrah-transport`, `corporate`; language switcher; 2 gated title/meta
proposals for `airports/king-khalid-riyadh` and `routes/riyadh-to-dammam`
pending explicit sign-off per CLAUDE.md rule 3).

**Superseded by Batch 2 below** — the Phase 2 prompt asked for a fresh,
more deeply researched page-by-page queue before continuing, so Batch 1's
proposal is folded into Batch 2's research rather than implemented
separately. Nothing from Batch 1 has been implemented yet.

## Batch 2 — internal-linking authority pass — DONE, validated, not deployed (2026-09-28)

Full detail in `seo/page-log.md` ("Batch 2 — internal-linking authority
pass on 6 researched money pages"). User approved all 6 items, implemented
one at a time:

1. `/airports/king-khalid-riyadh` — linked from `/locations/riyadh` +
   embedded `WhatsAppQuoteForm` added (was the only 600+ impression
   airport page with no on-page lead form).
2. `/routes/riyadh-to-dammam` — its `/distance/` sibling linked from both
   `/locations/riyadh` and `/locations/dammam` (was getting zero
   impressions despite ~234 impressions of matching distance-intent
   queries landing on the transactional route page instead).
3. `/routes/jeddah-airport-to-makkah` — reciprocal link added from
   `/locations/makkah` (previously only linked from Jeddah's side).
4. `/routes/makkah-to-madinah` + `/routes/madinah-to-makkah` +
   `/distance/makkah-to-madinah` — linked from both `/locations/makkah`
   and `/locations/madinah` (previously **zero** inbound links from
   either hub, despite being the site's most content-built pages).
5. `/services/umrah-transport` — contextual link added from both Makkah
   and Madinah hubs (already had Navbar visibility, but no topical
   in-content link from the two most relevant pages).
6. `/services/corporate` — added to Navbar (new "Corporate Accounts"
   entry) + linked from `/locations/riyadh` and `/locations/jeddah`
   (was the only Path B flagship page with zero sitewide nav presence).

No title/H1/content rewrites in this batch — pure internal linking + one
embedded form + one nav entry. Two pages explicitly gated (rule 3,
ranking ≤20) and two explicitly held for a future "wait and see" check
before any content/title work.

**Validation:** `tsc --noEmit` 0 errors · lint 0 errors (1 pre-existing
warning) · `next build` exit 0 · rendered-HTML spot checks confirmed.

**Deployed 2026-09-28** — `git push origin main`, commit `9030124`.
Bundled Batch 0 + Batch 2 into one commit (Batch 0 had not been deployed
yet either). Only the files actually touched by these two batches were
staged; a separate set of pre-existing uncommitted changes from other
work sessions was deliberately left alone in the working tree.

**Next research checkpoint:** pull GSC again in a few weeks to check
whether `/distance/riyadh-to-dammam`, `/distance/makkah-to-madinah` get
crawled/indexed, and whether `/services/corporate` /
`/airports/king-khalid-riyadh` gain impressions — that data should decide
whether the next batch touches title/content on the flagship routes or
continues the internal-linking approach elsewhere.
