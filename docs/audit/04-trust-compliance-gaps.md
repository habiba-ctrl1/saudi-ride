# 04 — Trust & Compliance Gaps

For a Saudi transport business, buyers (and Google, for this YMYL niche) look for verifiable legal identifiers. **Almost none are present**, yet the marketing copy makes formal‑sounding claims. This is both a conversion problem and a regulatory/reputational risk.

## Required identifiers — presence check

| Identifier | Present? | Where / evidence | Verdict |
|---|:---:|---|---|
| **Commercial Registration (CR) number** | ❌ No | grep across `app/**`, `components/**` — not found | Missing everywhere |
| **Ministry of Transport / TGA operator licence number** | ❌ No | Terms name‑drops "TGA" with no number [terms-conditions/page.tsx:53](../../app/terms-conditions/page.tsx#L53) | Missing — yet "Certified" is claimed (below) |
| **VAT registration number (ZATCA)** | ❌ No (placeholder only) | Placeholder `300000000000003` in [zatca.ts:64](../../lib/zatca.ts#L64); no VAT no. shown on‑site | Missing — yet "ZATCA VAT Compliant" is claimed |
| **Physical registered address** | ⚠️ In schema only | `Sanaiya Industrial Area, Dammam` in JSON‑LD [layout.tsx:67](../../app/layout.tsx#L67); **not shown on any page** | Unverified; not visible to users |
| **Landline / unified (9200) number** | ❌ No | Only a mobile `+966 53 938 8072` [contact.ts:2](../../lib/config/contact.ts#L2) | No landline/unified line |
| **Named legal entity in Terms & Privacy** | ❌ No | grep for company/LLC/registered/CR in Terms & Privacy → **no matches** | No legal entity named |
| **Cancellation/refund policy matching marketing** | ⚠️ Partial | Site: "Free cancellation — 24 hours" [home-page.tsx:114](../../components/sections/home-page.tsx#L114); email policy adds "fees inside 24h window" [notifications.ts:165](../../lib/notifications.ts#L165) | Broadly consistent; needs a single canonical policy page |
| **Real, linkable Google Business Profile** | ❌ No | No GBP link, no map embed; `sameAs` = placeholder socials [schema.ts:10](../../lib/schema.ts#L10) | Missing — critical for a local business |

## Unsubstantiated claims (claim made, no verifiable identifier behind it)

> Per the brief, these are flagged explicitly. Each is a claim that a Saudi consumer‑protection or advertising standard would expect you to be able to prove.

| # | Sev | Claim on the site | Location | Backing identifier? |
|---|-----|-------------------|----------|:-------------------:|
| T1 | 🔴 Critical | **"Ministry of Transport Certified"** — printed under the price calculator on the homepage. | [PriceCalculator.tsx:556](../../components/booking/PriceCalculator.tsx#L556) | ❌ No licence number anywhere |
| T2 | 🔴 Critical | **"Google Review — Verified Trip"** on 6 invented 5★ reviews. | [home-page.tsx:165](../../components/sections/home-page.tsx#L165),[:611](../../components/sections/home-page.tsx#L611) | ❌ No link to any real review |
| T3 | 🟠 High | **"4.9/5"** aggregate rating on every location page. | [locations/[city]/page.tsx:737](../../app/(marketing)/locations/[city]/page.tsx#L737) | ❌ No review source |
| T4 | 🟠 High | **"ZATCA VAT Compliant" / "ZATCA‑compliant e‑invoice"** trust badges & service copy. | [Footer.tsx:295](../../components/layout/Footer.tsx#L295), [home-page.tsx:116](../../components/sections/home-page.tsx#L116) | ❌ No VAT no.; ZATCA submission is simulated [zatca.ts:119](../../lib/zatca.ts#L119) |
| T5 | 🟠 High | **"Licensed Drivers" / "100% licensed"** and "Valid Saudi License" badge. | [Footer.tsx:294](../../components/layout/Footer.tsx#L294), [stats.ts:6](../../lib/config/stats.ts#L6) | ⚠️ Plausible but unverifiable to the visitor |
| T6 | 🟡 Medium | **"Trusted by hotels, embassies, and enterprises."** | [home-page.tsx:116](../../components/sections/home-page.tsx#L116) | ❌ No named client/logo |
| T7 | 🟡 Medium | Fabricated **plate number "KSA 9921"** and a stock‑photo "chauffeur" in the driver‑assignment email. | [notifications.ts:207](../../lib/notifications.ts#L207),[:193](../../lib/notifications.ts#L193) | ❌ Fake details in a transactional email |
| T8 | 🟡 Medium | Stale brand fallback `saudi-ride.vercel.app` as the site URL in notifications. | [notifications.ts:40](../../lib/notifications.ts#L40) | Wrong domain in customer‑facing links |

## Security / data‑protection observations (adjacent to trust)

> Noted because they affect legal exposure and customer‑data trust. **No secret values are reproduced here.**

| # | Sev | Finding | Location | Fix |
|---|-----|---------|----------|-----|
| S1 | 🔴 Critical | **TLS certificate verification disabled globally**: `NODE_TLS_REJECT_UNAUTHORIZED="0"` plus `sslaccept=accept_invalid_certs` on the DB URLs. Disables cert checking for *all* outbound TLS in the process (Resend, webhooks, everything) → MITM exposure. | `.env.local` (lines 6‑8) | Remove `NODE_TLS_REJECT_UNAUTHORIZED`; use Supabase's proper CA/`sslmode=require` without `accept_invalid_certs`. |
| S2 | 🟠 High | Live secrets committed to `.env.local` (Supabase service‑role key, DB password, admin password, Resend key). If this file is ever not git‑ignored or is shared, full DB/admin compromise. | `.env.local` | Confirm `.env.local` is git‑ignored (it is in `.gitignore`); rotate any key that has left the machine; move admin creds out of plaintext env into a hashed store. |
| S3 | 🟡 Medium | Admin password stored/compared as plaintext env `ADMIN_PASSWORD`. | `.env.local`, [lib/auth.ts] | Use a hashed credential in the DB. |
| S4 | 🟡 Medium | Customer PII (name, phone, email, trip) is stored but the Privacy Policy names no data controller/legal entity and no retention/DPO contact. | Privacy page (no entity found) | Add a real controller identity + retention terms (Saudi PDPL alignment). |

## Remediation priorities

1. **Stop making claims you can't back** (T1–T4): remove "Ministry of Transport Certified," the "verified Google review" labels, "4.9/5," and soften "ZATCA compliant" to "ZATCA‑ready invoicing" until you actually submit. *Minutes.*
2. **Add the real identifiers** you *do* have — CR number, TGA licence number, VAT number, registered trade name, and a visible address + landline — in the footer and on `/about`, `/contact`, and Terms/Privacy. *Half a day once you have the numbers.*
3. **Create & verify the Google Business Profile**, link it in `sameAs` and the footer, and start collecting real reviews. *Days, external.*
4. **Fix the TLS + secret hygiene** (S1–S3). *Hours.*
5. **Name a legal entity** in Terms & Privacy and add PDPL‑aligned data terms. *Half a day.*

> Principle: a transport service is a *trust purchase* — the customer is putting their family in your car, often at 2 AM. Every verifiable number you show raises conversion; every unbacked "certified/verified" claim you show lowers it the moment a careful buyer checks.
