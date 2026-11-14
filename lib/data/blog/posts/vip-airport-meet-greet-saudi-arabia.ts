import type { BlogPost } from "../types";

// Rewritten 2026-10-02 — P0: the old copy promised "live flight tracking" and
// "60 minutes of free waiting" on every transfer; neither is confirmed in
// seo/facts.md. Flight wording now uses the approved line ("share your flight
// number when you book and we check it before pickup"); no specific terminal
// procedure, desk or free-waiting allowance is claimed.
const post: BlogPost = {
  slug: "vip-airport-meet-greet-saudi-arabia",
  title: "Airport Meet & Greet in Saudi Arabia: What to Expect at JED, RUH, MED and DMM",
  seoTitle: "VIP Airport Meet & Greet in Saudi Arabia: What to Expect",
  excerpt:
    "How a pre-booked airport pickup works in Saudi Arabia — what to send when you book, how the driver finds you, what happens if your flight is late, and what a VIP arrival adds.",
  category: "Airport Transfers",
  coverImage: "/blog/vip-airport-meet-greet-saudi-arabia.webp",
  coverAlt: "Driver in a dark suit holding a passenger name card in an airport arrivals hall",
  publishedAt: "2026-09-29",
  updatedAt: "2026-10-02",
  quickAnswer:
    "With a pre-booked airport pickup, your driver meets you on arrival and helps with your luggage to the car, so you are not queuing at a taxi rank after a long flight. Share your flight number and terminal when you book and we check the flight before pickup; the driver's contact details and the meeting arrangements are confirmed with you on WhatsApp. The fare is agreed before booking.",
  related: ["saudi-arabia-airport-transfer-guide", "riyadh-airport-ruh-taxi-guide", "how-to-choose-private-chauffeur-company-saudi-arabia"],
  links: [
    { label: "Airport transfer service", href: "/services/airport-transfers" },
    { label: "Jeddah Airport (JED) pickups", href: "/airports/king-abdulaziz-jeddah" },
    { label: "Riyadh Airport (RUH) arrivals", href: "/airports/king-khalid-riyadh" },
    { label: "Madinah Airport (MED) transfers", href: "/airports/prince-mohammad-madinah" },
    { label: "Dammam Airport (DMM) transfers", href: "/airports/king-fahd-dammam" },
    { label: "VIP transportation", href: "/services/vip-transportation" },
  ],
  cta: {
    intro: "Hello, I'd like to book an airport pickup with meet & greet.",
    from: "Airport (terminal):",
    heading: "Book your airport pickup",
    text: "Send your flight number, arrival date, terminal, destination and how many passengers and bags. We confirm the vehicle and a fixed fare before you book.",
  },
  content: `
## What "meet & greet" means in practice

A meet-and-greet pickup means you are **met on arrival** instead of walking out to find a taxi rank or an app pickup zone. The driver helps with your luggage, walks you to the car and takes you straight to your hotel, office, Makkah or Madinah. For a first visit to Saudi Arabia, a late-night landing or a family with a lot of luggage, it removes the most stressful part of the trip.

## What to send when you book

The quality of an airport pickup depends almost entirely on the information you give at booking:

| Detail | Why it matters |
|---|---|
| **Flight number** | We check the flight before pickup, so an early or late landing is seen in advance |
| **Arrival date and scheduled time** | Overnight flights often land "tomorrow" by local time — double-check the date |
| **Terminal** | JED and RUH have several terminals, and pickup points differ |
| **Passengers and bags** | Decides the vehicle — a sedan, SUV or van |
| **Destination** | Hotel name, office address or a map pin |
| **A WhatsApp number that works on arrival** | So the driver can reach you once you land |

## What happens on the day

1. **Before you land** — the booking, the driver's contact details and the meeting arrangements are confirmed with you on WhatsApp.
2. **Immigration and baggage** — this is the unpredictable part. Queues are longest when several long-haul flights land together, common at night at Jeddah in the Umrah season.
3. **Message the driver** once you have your bags (airport Wi-Fi works if you do not yet have a Saudi SIM).
4. **Meet and go** — the driver meets you, helps with luggage and takes you to the car.

## If your flight is delayed

Because we check your flight before pickup, a delay is normally picked up before the driver sets off. If you are held up for a long time after landing — a very slow immigration queue, lost baggage — message the driver or us so the pickup can be adjusted. How waiting time is handled is confirmed with your quote, so ask if you are on a flight that is often late.

## Airport by airport

### Jeddah — King Abdulaziz International Airport (JED)

The main gateway for Umrah, with several terminals and heavy night-time traffic. Most arrivals go on to Makkah (about 80 km, around an hour) or to Jeddah city. See [Jeddah Airport pickups](/airports/king-abdulaziz-jeddah).

### Riyadh — King Khalid International Airport (RUH)

Business-heavy, with several terminals. The city centre and KAFD are about 35–40 km away. See [Riyadh Airport arrivals](/airports/king-khalid-riyadh) and our [RUH arrival guide](/blog/riyadh-airport-ruh-taxi-guide).

### Madinah — Prince Mohammad bin Abdulaziz Airport (MED)

Smaller and close to the city; the hotels around Masjid an-Nabawi are about 22 km away. Many pilgrims go straight on to Makkah instead. See [Madinah Airport transfers](/airports/prince-mohammad-madinah).

### Dammam — King Fahd International Airport (DMM)

Serves the Eastern Province: Dammam, Al Khobar, Dhahran and Jubail. Some of these are a fair distance from the airport, so share the exact address. See [Dammam Airport transfers](/airports/king-fahd-dammam).

## What a VIP or executive arrival adds

For executives, delegations and VIP guests, you can request:

- a **premium vehicle** — a luxury sedan such as a Mercedes S-Class, or a full-size SUV such as a Cadillac Escalade — available through our partner network;
- a **driver in formal attire**;
- **a separate luggage vehicle** for delegations with a lot of equipment;
- **several cars timed to one flight** for a team arriving together.

Tell us the guest's name, role and any protocol requirements at booking so the right vehicle and driver are prepared. For larger arrivals, see [VIP transportation](/services/vip-transportation) and our [event and conference transport guide](/blog/saudi-arabia-event-conference-transportation-guide).

## Payment and cancellation

The fare is agreed before booking. Pay **cash to the driver or by bank transfer**; an **electronic receipt** is available on request, and companies can request an invoice. **Free cancellation up to 24 hours before pickup.**

## Common questions

### Is meet and greet available at every airport?

We arrange pickups at the main Saudi airports, including JED, RUH, MED and DMM. Tell us your airport and terminal when you book.

### What if I can't find my driver?

Message or call the driver on the number you received before the flight. That is why we ask for a WhatsApp number that will work when you land.

### Can I book a pickup for someone else?

Yes — give us the traveller's name, flight and phone number, and your own number as a backup contact.
`,
};

export default post;
