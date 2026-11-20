import type { BlogPost } from "../types";

// Rewritten 2026-10-02. Fixed the broken "Makkah Ziyarat guide" link (pointed at
// /services). Distinct from /services/makkah-ziyarat (booking page): this is the
// planning guide — which sites, what order, how long, etiquette.
// Enriched 2026-11-16 (Semrush: a competitor ranks pos 38-48 for "makkah ziyarat places" /
// "ziyarat in makkah", 3,600 searches each, KD 6-8; ours had ~0 impressions). Added approximate
// distances from Masjid al-Haram and answer-first questions. Distances are APPROXIMATE: published
// sources disagree by 1-4 km (Jabal al-Nour 4-5 km north, Jabal Thawr ~4 km, Masjid al-Jinn ~1 km,
// Masjid Aisha 6.5-7 km north, Mina 6-8 km east, Muzdalifah ~10-12 km, Arafat ~20 km east) —
// compiled from halalbooking.com/umrah/makkah/ziyarat, lifeinsaudiarabia.net/ziyarat-places-in-makkah
// and theislamicinformation.com; /services/makkah-ziyarat says Mina is ~8 km, which sits inside the range.
const post: BlogPost = {
  slug: "makkah-ziyarat-taxi-holy-sites-tour",
  title: "Makkah Ziyarat by Private Car: Holy Sites, Route Order and How Long It Takes",
  seoTitle: "Makkah Ziyarat Places: Distances, Route Order & Taxi Tour",
  excerpt:
    "Planning a Makkah Ziyarat: Jabal al-Nour, Jabal Thawr, Mina, Muzdalifah, Arafat and Masjid Aisha — a sensible route order, timing, what to wear and how a private car tour works.",
  category: "Umrah",
  coverImage: "/blog/makkah-ziyarat-taxi-holy-sites-tour.webp",
  coverAlt: "Aerial view of Makkah's mountains and city around Masjid al-Haram and the clock tower",
  publishedAt: "2026-06-05",
  updatedAt: "2026-11-16",
  quickAnswer:
    "The main Makkah ziyarat places are Jabal al-Nour (Cave of Hira), Jabal Thawr, Mina, Muzdalifah, Arafat with Jabal al-Rahmah and Masjid Aisha at Al-Tan'im, spread from about 4 km to about 20 km from Masjid al-Haram. A Makkah Ziyarat by private car usually takes a half-day, around three to four hours. Going early in the morning avoids the worst heat, and one car and driver for the whole circuit is simpler than separate rides.",
  related: ["best-time-visit-makkah-crowds-weather-umrah", "makkah-taxi-fares-cost-guide", "complete-miqat-locations-guide-umrah-pilgrims"],
  links: [
    { label: "Book a Makkah Ziyarat", href: "/services/makkah-ziyarat" },
    { label: "Madinah Ziyarat by private car", href: "/services/madinah-ziyarat" },
    { label: "Taif Ziyarat day trip", href: "/services/taif-ziyarat" },
    { label: "Makkah to Taif", href: "/routes/makkah-to-taif" },
    { label: "Getting around Makkah", href: "/locations/makkah" },
  ],
  cta: {
    intro: "Hello, I'd like a quote for a Makkah Ziyarat tour.",
    from: "Makkah hotel",
    heading: "Book your Makkah Ziyarat",
    text: "Send your hotel, preferred date and start time, the number of people and any sites you particularly want to include. We confirm the vehicle and a fixed price before you book.",
  },
  content: `
## What a Makkah Ziyarat covers

"Ziyarat" means visiting places connected with the life of the Prophet ﷺ and the rites of Hajj. In Makkah, the sites are spread around the city and the valleys to the east, which is why most pilgrims see them by car in a single half-day loop.

| Site | Why pilgrims visit | Approx. distance from Masjid al-Haram | Time on site |
|---|---|---|---|
| **Jabal al-Nour** (Cave of Hira) | Where the first revelation came to the Prophet ﷺ | About 4–5 km north | Short stop at the foot; the climb takes much longer |
| **Jabal Thawr** | The cave where the Prophet ﷺ and Abu Bakr (RA) sheltered during the Hijrah | About 4 km south | Short stop at the foot |
| **Mina** | The valley of tents used during Hajj | About 6–8 km east | Drive-through or short stop |
| **Muzdalifah** | Where Hajj pilgrims spend the night after Arafat | About 10–12 km east | Drive-through |
| **Arafat and Jabal al-Rahmah** | The plain of the central rite of Hajj; the Mount of Mercy | About 20 km east | Usually the longest stop |
| **Masjid Aisha** (Al-Tan'im) | The nearest point outside the Haram boundary, where people staying in Makkah enter Ihram for another Umrah | About 6.5–7 km north | Stop for prayer or Ihram |
| **Masjid al-Jinn** | A historic mosque in the city, often added to tours | About 1 km north | Short stop |

Distances are approximate and published sources differ by a few kilometres, so treat them as a guide to the layout rather than exact figures. Your driver follows the road, which is usually longer than a straight line.

## A sensible route order

Most drivers run the loop to minimise backtracking and traffic, for example: **hotel → Jabal Thawr → Arafat (Jabal al-Rahmah) → Muzdalifah → Mina → Jabal al-Nour → back to the hotel**, with Masjid Aisha added at the start or end if you want to enter Ihram for another Umrah. The order changes with traffic, prayer times and your hotel's location — tell the driver your priorities.

## How long it takes

- **Half-day (about 3–4 hours):** the main sites with short stops.
- **Longer:** if you want to climb Jabal al-Nour (the climb and descent alone take a couple of hours) or spend more time at Arafat.
- **Add Taif:** for a full day, some families combine Makkah Ziyarat with a [Taif Ziyarat](/services/taif-ziyarat) — [Makkah to Taif](/routes/makkah-to-taif) is about 90 km, around 1 hour 10 minutes.

## When to go

- **Early morning** — cooler, and the light is good. Leave after Fajr and you are back before the midday heat.
- **Avoid the Hajj period**, when the sites are restricted and in use.
- **Fridays** — plan around the midday prayer.

## Practical tips

- **Dress modestly and comfortably**; good shoes if you plan to climb.
- **Carry water**, even in winter.
- **Respect the sites** — they are places of history and reflection; follow any local guidance on prayer and conduct.
- **Families:** an SUV or van gives everyone a window seat and space for a stroller. See [vehicle classes](/fleet).

## Why a private car

The sites are far apart, parking is limited, and stops are short — so booking a new ride at each site is impractical. With one car and driver, the vehicle waits at each stop, the route follows your pace, and the price is agreed before you set off.

## Common questions

### What are the main ziyarat places in Makkah?

The main ziyarat places in Makkah are Jabal al-Nour (Cave of Hira), Jabal Thawr, Mina, Muzdalifah, Arafat with Jabal al-Rahmah, and Masjid Aisha at Al-Tan'im. Many visitors also add Masjid al-Jinn and other historic mosques in the city.

### How far are the Makkah ziyarat places from Masjid al-Haram?

They range from about 1 km (Masjid al-Jinn) to about 20 km (Arafat). Jabal al-Nour and Jabal Thawr are about 4–5 km out, Mina about 6–8 km, and Muzdalifah about 10–12 km. Figures vary slightly between sources.

### How long is a Makkah Ziyarat?

Usually about three to four hours for the main sites.

### Is a private car or a group tour better for Makkah Ziyarat?

A group tour runs to a fixed schedule and route, which can suit a solo traveller who is happy to follow it. A private car runs to your pace and your hotel pick-up time, with the car waiting at each stop, which suits families, elderly relatives and anyone planning a climb. Both visit the same sites; the difference is flexibility.

### Can we enter Ihram at Masjid Aisha during the tour?

Yes — add it to the route, at the start or at the end.

### Can we climb Jabal al-Nour?

Yes, but allow extra time and go early. Tell us when you book so the tour is planned around the climb.
`,
};

export default post;
