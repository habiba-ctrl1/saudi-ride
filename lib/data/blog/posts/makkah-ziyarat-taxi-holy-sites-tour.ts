import type { BlogPost } from "../types";

// Rewritten 2026-10-02. Fixed the broken "Makkah Ziyarat guide" link (pointed at
// /services). Distinct from /services/makkah-ziyarat (booking page): this is the
// planning guide — which sites, what order, how long, etiquette.
const post: BlogPost = {
  slug: "makkah-ziyarat-taxi-holy-sites-tour",
  title: "Makkah Ziyarat by Private Car: Holy Sites, Route Order and How Long It Takes",
  seoTitle: "Makkah Ziyarat by Taxi: Holy Sites & Half-Day Route",
  excerpt:
    "Planning a Makkah Ziyarat: Jabal al-Nour, Jabal Thawr, Mina, Muzdalifah, Arafat and Masjid Aisha — a sensible route order, timing, what to wear and how a private car tour works.",
  category: "Umrah",
  coverImage: "/blog/makkah-ziyarat-taxi-holy-sites-tour.webp",
  coverAlt: "Aerial view of Makkah's mountains and city around Masjid al-Haram and the clock tower",
  publishedAt: "2026-06-05",
  updatedAt: "2026-10-02",
  quickAnswer:
    "A Makkah Ziyarat by private car usually takes a half-day — around three to four hours — and covers Jabal al-Nour (Cave of Hira), Jabal Thawr, Mina, Muzdalifah, Arafat with Jabal al-Rahmah, and often Masjid Aisha at Al-Tan'im. Going early in the morning avoids the worst heat, and one car and driver for the whole circuit is simpler than separate rides.",
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

| Site | Why pilgrims visit | Time on site |
|---|---|---|
| **Jabal al-Nour** (Cave of Hira) | Where the first revelation came to the Prophet ﷺ | Short stop at the foot; the climb takes much longer |
| **Jabal Thawr** | The cave where the Prophet ﷺ and Abu Bakr (RA) sheltered during the Hijrah | Short stop at the foot |
| **Mina** | The valley of tents used during Hajj | Drive-through or short stop |
| **Muzdalifah** | Where Hajj pilgrims spend the night after Arafat | Drive-through |
| **Arafat and Jabal al-Rahmah** | The plain of the central rite of Hajj; the Mount of Mercy | Usually the longest stop |
| **Masjid Aisha** (Al-Tan'im) | The nearest point outside the Haram boundary, where people staying in Makkah enter Ihram for another Umrah | Stop for prayer or Ihram |

Some tours also include **Masjid al-Jinn** and other historic mosques in the city.

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

### How long is a Makkah Ziyarat?

Usually about three to four hours for the main sites.

### Can we enter Ihram at Masjid Aisha during the tour?

Yes — add it to the route, at the start or at the end.

### Can we climb Jabal al-Nour?

Yes, but allow extra time and go early. Tell us when you book so the tour is planned around the climb.
`,
};

export default post;
