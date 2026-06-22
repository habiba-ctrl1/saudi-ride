# 🚗 Fleet Images — Audit Report

## ✅ COMPLETE (2026-06-20)
**14 / 14 ho gaye!** Har car ki image verify + WebP convert + sahi slug naam + data update.
Card data (names, passengers, luggage, features, descriptions) bhi improve kar diya.

⚠️ Sirf ek note: **Toyota Camry** ki image aspect bohat patli (1000×313) thi — card me thodi crop hoti hai. Behtar mile to `public/fleet/toyota-camry.webp` replace kar dena (ya koi bhi naam se daal dein, main fix kar dunga).

---

**Date:** 2026-06-16
**Page:** http://localhost:3000/fleet
**Result:** Maine fleet ki **saari 14 images download kar ke khud dekhi**. **Ek bhi image sahi nahi thi** — sab ya to galat car thi, broken (404) thi, ya ek to insaan ki photo thi.

Ab maine `lib/fleet-data.ts` mein har car ka image path **local** kar diya hai:
`/fleet/<slug>.jpg`

➡️ **Aapko bas karna ye hai:** har car ki sahi photo Google se le kar
`taxidriver/public/fleet/` folder mein **neeche diye gaye exact naam** se save kar dein (`.jpg`).
File daalte hi page pe sahi image apne aap aa jayegi — mujhe dobara code change nahi karna padega.

> 📐 **Tip:** landscape (chaurai zyada), kam-az-kam ~900px wide, saaf background. Filename bilkul same rakhein (chhote letters, `.jpg`).

---

## 📋 Har Car ki Report

| # | Car (jo chahiye) | Save as (public/fleet/…) | Purani image asal mein kya thi? | Status |
|---|---|---|---|---|
| 1 | **Toyota Camry** (sedan) | `toyota-camry.jpg` | Laal **BMW M4** sports coupe | ❌ Galat |
| 2 | **GMC Yukon XL** (SUV) | `gmc-yukon-xl.jpg` | Image hi load nahi hoti (404, broken) | ❌ Missing |
| 3 | **Hyundai Staria** (van) | `hyundai-staria.jpg` | Grey **Mercedes-AMG GT** sports car | ❌ Galat |
| 4 | **Cadillac Escalade** (SUV) | `cadillac-escalade.jpg` | Safed **Ford Expedition** (Ford logo) | ❌ Galat |
| 5 | **Mercedes S-Class** (luxury sedan) | `mercedes-s-class.jpg` | Kaali **Range Rover Sport** (SUV) | ❌ Galat |
| 6 | **BMW 7 Series** (luxury sedan) | `bmw-7-series.jpg` | Safed **BMW M5** (BMW hai, par model M5 — 7-Series nahi) | ⚠️ Brand sahi, model galat |
| 7 | **Genesis G80** (sedan) | `genesis-g80.jpg` | Neeli **BMW M2** coupe | ❌ Galat |
| 8 | **Ford Taurus** (sedan) | `ford-taurus.jpg` | Orange **BMW M3/M4** sedan | ❌ Galat |
| 9 | **Mercedes Vito** (van) | `mercedes-vito.jpg` | Image hi load nahi hoti (404, broken) | ❌ Missing |
| 10 | **Mercedes Sprinter** (van) | `mercedes-sprinter.jpg` | Ek **aadmi ki photo** — koi gaadi hi nahi! | ❌ Galat |
| 11 | **Hyundai Starex** (van) | `hyundai-starex.jpg` | Light-blue **Fiat 500** (chhoti retro car) | ❌ Galat |
| 12 | **Toyota Hiace** (van) | `toyota-hiace.jpg` | **Double-decker coach bus** | ❌ Galat |
| 13 | **Toyota Coaster** (bus) | `toyota-coaster.jpg` | Raat ko ek **generic bara coach** (Coaster nahi) | ⚠️ Bus hai, par model galat |
| 14 | **Luxury Coach Bus** (bus) | `luxury-bus.jpg` | Orange **purana VW camper van** | ❌ Galat |

---

## ✅ Khulasa (Summary)

- **Galat car:** 9 images
- **Brand/category sahi par model galat:** 2 (BMW 7 Series, Toyota Coaster)
- **Missing / broken (404):** 2 (GMC Yukon XL, Mercedes Vito)
- **Insaan ki photo (koi gaadi nahi):** 1 (Mercedes Sprinter)
- **Sahi:** 0 ❌

**Total: 14/14 images badalni hain.**

---

## 📂 Kahan daalni hain

```
taxidriver/
└── public/
    └── fleet/          ← ye folder ban chuka hai
        ├── toyota-camry.jpg
        ├── gmc-yukon-xl.jpg
        ├── hyundai-staria.jpg
        ├── cadillac-escalade.jpg
        ├── mercedes-s-class.jpg
        ├── bmw-7-series.jpg
        ├── genesis-g80.jpg
        ├── ford-taurus.jpg
        ├── mercedes-vito.jpg
        ├── mercedes-sprinter.jpg
        ├── hyundai-starex.jpg
        ├── toyota-hiace.jpg
        ├── toyota-coaster.jpg
        └── luxury-bus.jpg
```

Pics daalne ke baad bata dena — main fleet page ka design bhi upgrade kar dunga (cards, layout, green/gold theme ke mutabiq).
