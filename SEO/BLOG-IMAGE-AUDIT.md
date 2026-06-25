# 🖼️ Blog Cover Image Audit
**18 posts. All cover images are currently external Unsplash URLs (placeholders).**
Goal: replace with correct, unique local images in `public/blog/` (same approach used for the fleet images).

> How to use: generate/source each image, save to `public/blog/<filename>.webp`, then tell me — I'll switch each post's `coverImage` from the Unsplash URL to `/blog/<filename>.webp`.

**Suggested convention:** `public/blog/<slug-shortened>.webp`, landscape ~1200×630, WebP.

---

## 🔴 Priority 1 — REUSED across multiple posts (must become unique)

| # | Post | Current Unsplash ID | Reused with | Suggested local file | Image should show |
|---|------|--------------------|-------------|---------------------|-------------------|
| 1 | Makkah Taxi Fares 2026 | photo-1591604466107 | also: Jeddah-Airport-to-Makkah, Best-time-Makkah, Makkah-Ziyarat | `blog/makkah-taxi-fares.webp` | Makkah skyline / car near Makkah + price feel (or Clock Tower) |
| 2 | Jeddah Airport to Makkah Guide 2025 | photo-1591604466107 | (Kaaba, shared ×4) | `blog/jeddah-airport-to-makkah.webp` | Car/taxi on Makkah Expressway with Makkah in background |
| 3 | Best Time to Visit Makkah | photo-1591604466107 | (shared ×4) | `blog/best-time-makkah.webp` | Masjid al-Haram crowd density / seasonal feel |
| 4 | Makkah Ziyarat by Taxi | photo-1591604466107 | (shared ×4) | `blog/makkah-ziyarat.webp` | Jabal al-Nour / Cave of Hira or Ziyarat site |
| 5 | Makkah to Madinah Taxi (450km) | photo-1548013146 | also: Jeddah-to-Madinah | `blog/makkah-to-madinah.webp` | Haramain highway / SUV on desert highway |
| 6 | Jeddah to Madinah Taxi Guide | photo-1548013146 | (shared) | `blog/jeddah-to-madinah.webp` | Open highway toward Madinah / green dome distant |
| 7 | Complete Miqat Locations Guide | photo-1591604129939 | also: Madinah-to-Makkah | `blog/miqat-locations.webp` | Pilgrims in Ihram / Miqat mosque |
| 8 | Madinah to Makkah Taxi (2026) | photo-1591604129939 | (shared) | `blog/madinah-to-makkah.webp` | Road between the two Holy Cities |
| 9 | Riyadh to Dubai by Taxi | photo-1512453979798 | also: Riyadh-Airport-RUH | `blog/riyadh-to-dubai.webp` | Desert highway / GCC road trip / Dubai skyline ahead |
| 10 | Riyadh Airport (RUH) Taxi Guide | photo-1512453979798 | (shared) | `blog/riyadh-airport-ruh.webp` | King Khalid Airport / Riyadh skyline (Kingdom Tower) |
| 11 | Corporate Travel in Saudi Arabia | photo-1556761175 | also: Taxi-Cost-Saudi | `blog/corporate-travel-ksa.webp` | Executive sedan / business traveller |
| 12 | How Much Does a Taxi Cost in KSA | photo-1556761175 | (shared) | `blog/taxi-cost-saudi.webp` | Taxi meter / SAR cash + car (price theme) — **mismatch: currently a corporate photo** |

## 🟡 Priority 2 — Single-use but VERIFY relevance / make local

| # | Post | Current Unsplash ID | Suggested local file | Image should show |
|---|------|--------------------|---------------------|-------------------|
| 13 | Jeddah Taxi Fares 2026 | photo-1559827260 | `blog/jeddah-taxi-fares.webp` | Taxi/car in Jeddah (Corniche or city) + price theme |
| 14 | Madinah Taxi Fares 2026 | photo-1564769662533 | `blog/madinah-taxi-fares.webp` | Masjid an-Nabawi (green dome) + car |
| 15 | SIM Cards at Jeddah Airport | photo-1512428559087 | `blog/jeddah-airport-sim.webp` | SIM card / phone / telecom kiosk at airport |
| 16 | Saudi Riyal Cash & Cards | photo-1621501103258 | `blog/saudi-riyal-guide.webp` | SAR banknotes / Mada card |
| 17 | AlUla Travel Guide | photo-1518684079 | `blog/alula-guide.webp` | Hegra / Elephant Rock (AlUla) |
| 18 | NEOM & The Line | photo-1506905925346 | `blog/neom-the-line.webp` | NEOM / The Line render / futuristic desert |

---

## Notes
- **Religious imagery caution:** for Makkah/Madinah/Umrah posts, prefer respectful exterior shots (Clock Tower, highway, mosque exterior, Ziyarat landmarks) over close interior Haram shots if AI-generating.
- Once images are in `public/blog/`, ping me with the filenames and I'll update `lib/data/blog-posts.ts` `coverImage` fields (and convert to WebP paths). The blog template, OG tags, and "Recent Posts" thumbnails all read from that one field — so one change per post is enough.
- The `coverImage` is also used in BlogPosting schema (`image`) and OpenGraph — local correct images improve rich results + social previews.
