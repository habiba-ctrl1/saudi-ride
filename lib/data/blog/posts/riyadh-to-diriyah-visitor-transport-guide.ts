import type { BlogPost } from "../types";

// Rewritten 2026-10-02. GSC pos ~6 (92 impr). Deliberately no km/minute figure
// for Riyadh–Diriyah: there is no Diriyah entry in lib/data/routes.ts (the single
// source of truth for distances), and the Riyadh cluster page also avoids one.
// Add a figure only after a routes.ts entry exists.
const post: BlogPost = {
  slug: "riyadh-to-diriyah-visitor-transport-guide",
  title: "Riyadh to Diriyah: Visitor & Transport Guide to At-Turaif and Bujairi Terrace",
  seoTitle: "Riyadh to Diriyah: Visitor & Transport Guide",
  excerpt:
    "How to get from Riyadh to Diriyah — At-Turaif, Bujairi Terrace, when to go, where drivers drop you, and why a private car with a fixed pickup time is the easy option.",
  category: "City Guides",
  coverImage: "/services/heritage-tours-hero.webp",
  coverAlt: "Black SUV on a palm-lined road in front of a restored mud-brick town at sunset",
  publishedAt: "2026-09-25",
  updatedAt: "2026-10-02",
  quickAnswer:
    "Diriyah sits on the north-west edge of Riyadh above Wadi Hanifa, a short drive from Olaya and KAFD. Most visitors go in the late afternoon or evening for At-Turaif and dinner at Bujairi Terrace. A private car is the simplest way: you are dropped at the visitor area and collected at a time you choose, with the fare agreed before booking.",
  related: ["riyadh-season-taxi-transport-guide", "riyadh-airport-ruh-taxi-guide", "private-driver-cost-saudi-arabia"],
  links: [
    { label: "Diriyah return trips from Riyadh", href: "/locations/riyadh/diriyah" },
    { label: "Hourly private driver in Riyadh", href: "/locations/riyadh/private-driver" },
    { label: "Riyadh Airport (RUH) arrivals", href: "/airports/king-khalid-riyadh" },
    { label: "Riyadh chauffeur service", href: "/locations/riyadh" },
    { label: "Heritage tours by private car", href: "/services/heritage-tours" },
  ],
  cta: {
    intro: "Hello, I'd like a quote for a private car to Diriyah and back.",
    to: "Diriyah (At-Turaif / Bujairi Terrace)",
    heading: "Plan your Diriyah evening",
    text: "Tell us your hotel, the day, what time you want to arrive and when you'd like to be collected. We confirm the vehicle and a fixed fare before you book.",
  },
  content: `
## Why Diriyah is worth the trip

Diriyah was the seat of the first Saudi state, and its old quarter, **At-Turaif**, is a UNESCO World Heritage Site — a restored district of mud-brick palaces and walls above Wadi Hanifa. Next to it, **Bujairi Terrace** is a restaurant and café quarter with views across to At-Turaif, and it is where most visitors end the evening. Together they are the most popular half-day outing from Riyadh for business visitors with a free evening, families and first-time tourists.

## Where Diriyah is, and how long it takes

Diriyah is on the **north-west edge of Riyadh**, a short drive from the main hotel districts of Olaya and KAFD. The journey time depends far more on the time of day than on distance: Riyadh's evening rush and the traffic around popular weekend events can stretch a short drive considerably. If you have a dinner reservation, allow a margin and tell your driver what time you need to arrive.

From **King Khalid International Airport (RUH)** Diriyah is across the city, so it rarely makes sense as a stop on arrival day unless you land early and have time to spare.

## What to see

### At-Turaif

The historic district — restored palaces, the old walls and exhibition spaces that explain the history of the first Saudi state. Check opening times and ticketing on the official Diriyah channels before you go, as access arrangements change with events and seasons.

### Bujairi Terrace

The dining quarter overlooking At-Turaif. It is busiest after sunset, especially at weekends and during the cooler months, when At-Turaif is lit up in the evening.

### Wadi Hanifa

The valley that runs below Diriyah, with walking paths — pleasant in the cooler months, in the early morning or around sunset.

## When to go

- **Evening** is the most popular time: cooler temperatures, the lit-up old town, and dinner at Bujairi Terrace.
- **Late morning on a weekday** is quieter if you want photographs or a museum visit without the crowds.
- **Summer middays** are very hot; plan outdoor walking for the early morning or after dark.
- **Weekends and event nights** are the busiest — book your car in advance and agree a pickup point.

## Getting there: your options

| Option | Good for | Things to know |
|---|---|---|
| **Private car with driver** | Families, groups, evenings out, visitors with a dinner booking | Fixed fare agreed beforehand; dropped at the visitor area and collected at a set time |
| **Ride-hailing app** | Solo travellers, one-way trips | Needs mobile data; return pickups can be slow when everyone leaves at once after dinner |
| **Self-drive** | Residents who know Riyadh | You manage navigation and parking |

The pickup is where a pre-booked driver earns their fare. On busy evenings, a lot of people try to leave Bujairi Terrace at the same time; with a pre-booked car you agree a time and a meeting point and walk straight to it.

## Making a day of it

Diriyah pairs well with other stops in north and central Riyadh. With an [hourly private driver](/locations/riyadh/private-driver) you can, for example:

- spend the afternoon in Olaya or at the King Abdulaziz Historical Center in Al Murabba,
- reach At-Turaif for sunset,
- have dinner at Bujairi Terrace,
- and go back to your hotel without arranging another car.

For a single evening, a [return trip from your hotel to Diriyah](/locations/riyadh/diriyah) is usually enough.

## Practical tips

- **Dress modestly and comfortably** — there is walking on uneven, historic surfaces.
- **Bring water** in the warmer months, even in the evening.
- **Share your dinner time** when booking so your pickup is timed after the meal, not in the middle of it.
- **Families with prams** may prefer a van or SUV for boot space.

## Common questions

### Can the driver wait while we visit?

Yes, if you book by the hour; the driver waits and you leave when you're ready. With a return-trip booking, you agree a pickup time instead.

### Is Diriyah suitable for a business visitor with one free evening?

Yes — it is the most common "one evening in Riyadh" plan. Go from your hotel straight after your last meeting, have dinner at Bujairi Terrace, and you will be back at a reasonable hour.

### Can I combine Diriyah with Riyadh Season?

Yes, though both are busiest on weekend evenings. See our [Riyadh Season transport guide](/blog/riyadh-season-taxi-transport-guide) for planning around the event zones.
`,
};

export default post;
