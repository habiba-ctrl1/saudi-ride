import type { BlogPost } from "../types";

// Rewritten 2026-10-02 — P0: the old copy said card payment is accepted by
// "premium taxi services (like Taxi Saudi Arabia)". facts.md: payment is cash to
// the driver or bank transfer only. Also removed "accepted at 99% of terminals"
// and named exchange-house brands (unverifiable).
const post: BlogPost = {
  slug: "saudi-riyal-cash-cards-guide-pilgrims",
  title: "Saudi Riyal Guide for Visitors and Pilgrims: Cash, Cards, Mada and ATMs",
  seoTitle: "Saudi Riyal Guide: Cash & Cards for Pilgrims and Visitors",
  excerpt:
    "Using money in Saudi Arabia: the riyal's fixed rate to the dollar, where cards and phone payments work, when you still need cash, ATMs, exchange tips and paying for transport.",
  category: "Travel Tips",
  coverImage: "/blog/saudi-riyal-cash-cards-guide-pilgrims.webp",
  coverAlt: "Saudi riyal banknotes and a payment card on a wooden table",
  publishedAt: "2026-09-12",
  updatedAt: "2026-10-02",
  quickAnswer:
    "Saudi Arabia's currency is the riyal (SAR), pegged at 3.75 to the US dollar. Cards and phone payments are widely accepted in hotels, malls, supermarkets and most shops, including around the Harams, but cash is still useful for small vendors, tips and some services. ATMs are easy to find; check your bank's foreign-transaction fees before you travel.",
  related: ["buying-sim-cards-jeddah-airport-stc-mobily-zain", "taxi-cost-saudi-arabia-price-guide", "saudi-arabia-airport-transfer-guide"],
  links: [
    { label: "Airport transfers", href: "/services/airport-transfers" },
    { label: "Riyal tips for pilgrims (quick guide)", href: "/guides/saudi-riyal-pilgrim-guide" },
    { label: "Jeddah Airport (JED) arrivals", href: "/airports/king-abdulaziz-jeddah" },
    { label: "Private Umrah transport", href: "/services/umrah-transport" },
  ],
  content: `
## The riyal in one paragraph

The Saudi riyal (SAR, ﷼) is divided into 100 halalas and has been **pegged to the US dollar at 3.75 riyals per dollar** for decades, so dollar-based prices are easy to convert. Notes commonly in use run from 5 to 500 riyals; coins are used for small change.

## Cards and phone payments

Saudi Arabia has moved quickly towards cashless payment. The local debit network is **mada**, and international **Visa and Mastercard** cards, plus **Apple Pay** and **Google Pay**, are widely accepted.

| Usually accepts cards | Often cash-only or cash-preferred |
|---|---|
| Hotels | Small street vendors and stalls |
| Malls and supermarkets | Tips for porters and hotel staff |
| Restaurants and cafés | Some small shops in older markets |
| Pharmacies | Charity boxes and small donations |
| Most shops around the Harams | Some services such as barbers or laundries |
| Ride-hailing apps (in-app) | — |

**Tip:** tell your bank you are travelling, and carry a backup card in case one is blocked.

## Cash: how much to carry

You will not need much, but a modest amount in small notes — 5s, 10s and 50s — saves awkward moments with porters, small shops and tips. Keep larger amounts in your hotel safe.

## Getting riyals

1. **ATMs** — the easiest option, found at airports, malls, hotels and throughout the cities. Your bank's foreign-transaction and withdrawal fees matter more than the ATM itself; choose to be charged in **riyals** when the machine offers a conversion.
2. **Exchange offices** — common in city centres and near the Harams in Makkah and Madinah. Compare the rate shown with the 3.75 peg for dollars.
3. **Airport counters** — convenient for a small amount on arrival; rates are often less favourable than in the city.

## Paying for transport

- **Ride-hailing apps** take card payment in the app.
- **Street taxis** — carry cash as a fallback.
- **Pre-booked transfers with us** — the fare is agreed before booking and paid **in cash to the driver or by bank transfer**. An **electronic receipt** is available on request, and companies can request an invoice. Bookings can be **cancelled free of charge up to 24 hours before pickup**.

## Practical tips for pilgrims

- **Keep a little cash on you** at the Haram for small purchases and charity; leave the rest in your hotel safe.
- **Watch your wallet in crowds**, especially in Ramadan.
- **Shop prices are usually fixed** in malls and modern stores; small markets may allow some bargaining.
- **VAT** is included in most displayed prices; ask if unsure.

## Common questions

### Can I use US dollars in Saudi Arabia?

Generally no — pay in riyals. Exchange dollars at an exchange office or use a card or ATM.

### Is Apple Pay accepted?

Widely, in shops, hotels and restaurants with contactless terminals.

### Do I need cash for a taxi?

For an app ride, no. For a street taxi, carry some. For a pre-booked transfer with us, you can pay the driver in cash or pay by bank transfer before the trip.
`,
};

export default post;
