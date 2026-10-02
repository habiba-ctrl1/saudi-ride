import type { BlogPost } from "../types";

// Rewritten 2026-10-02. Figures from routes.ts only: DMM→Dhahran 25 km/25 min,
// DMM→Jubail 90 km/65 min, Riyadh→Dammam 390 km/210 min, Riyadh→Al Khobar
// 400 km/220 min, Dammam→Manama 70 km/60 min (via the King Fahd Causeway route
// page). The old "~35 km from DMM to Dammam/Al Khobar" had no source — removed.
const post: BlogPost = {
  slug: "eastern-province-corporate-visitor-transport-guide",
  title: "Eastern Province Business Travel: Transport Guide for Dammam, Al Khobar, Dhahran and Jubail",
  seoTitle: "Eastern Province Business Transport: Dammam, Khobar, Jubail",
  excerpt:
    "Visiting the Eastern Province for work: King Fahd International Airport (DMM) transfers, moving between Dammam, Al Khobar, Dhahran and Jubail, site access, multi-day projects and Bahrain trips.",
  category: "Business Travel",
  coverImage: "/blog/eastern-province-corporate-visitor-transport-guide.webp",
  coverAlt: "Black sedan on a highway with an illuminated industrial plant on the horizon at dusk",
  publishedAt: "2026-09-29",
  updatedAt: "2026-10-02",
  quickAnswer:
    "Most business visitors to the Eastern Province land at King Fahd International Airport (DMM), about 25 km from Dhahran, and then move between Dammam, Al Khobar, Dhahran and Jubail (about 90 km from the airport). A pre-booked car per trip suits a simple visit; for several site visits a day or a multi-day project, an hourly or day booking — quoted in writing for companies — is usually simpler.",
  related: ["saudi-arabia-business-travel-transportation-guide", "corporate-travel-saudi-arabia-business-etiquette", "riyadh-to-dubai-taxi-gcc-road-trip"],
  links: [
    { label: "Dammam Airport (DMM) transfers", href: "/airports/king-fahd-dammam" },
    { label: "DMM to Dhahran", href: "/routes/dammam-airport-to-dhahran" },
    { label: "DMM to Jubail", href: "/routes/dammam-airport-to-jubail" },
    { label: "Riyadh to Dammam", href: "/routes/riyadh-to-dammam" },
    { label: "Dammam to Bahrain (Manama)", href: "/routes/dammam-to-manama" },
    { label: "Private car in Al Khobar", href: "/locations/alkhobar" },
  ],
  cta: {
    kind: "corporate",
    intro: "Hello, we need business transport in the Eastern Province.",
    from: "Dammam Airport (DMM)",
    heading: "Moving a team around the Eastern Province?",
    text: "Send the sites, dates, number of people and the daily pattern of movements. We confirm vehicles and a written fixed quote; company invoices are available on request.",
  },
  content: `
## One region, several cities

Dammam, Al Khobar and Dhahran form one continuous urban area on the Gulf coast, with Jubail's industrial city further north. The region is the centre of the Kingdom's energy industry, so business visitors are typically engineers, consultants, auditors, project teams and suppliers — often on multi-day trips that touch more than one city each day.

## Key distances

| Route | Distance | Typical drive |
|---|---|---|
| [DMM airport → Dhahran](/routes/dammam-airport-to-dhahran) | ~25 km | ~25 min |
| [DMM airport → Jubail](/routes/dammam-airport-to-jubail) | ~90 km | ~65 min |
| [Riyadh → Dammam](/routes/riyadh-to-dammam) | ~390 km | ~3 hr 30 min |
| [Riyadh → Al Khobar](/routes/riyadh-to-alkhobar) | ~400 km | ~3 hr 40 min |
| [Dammam → Manama, Bahrain](/routes/dammam-to-manama) | ~70 km | ~1 hr + border |

For Dammam city and Al Khobar, give us the exact address — distances vary a lot across the metro area.

## Arriving at King Fahd International Airport (DMM)

DMM is north-west of the Dammam–Khobar area and serves the whole region. Share your **flight number** when you book and we check it before pickup. If you are going straight to a site, tell us — luggage, timing and gate details all matter. See [Dammam Airport transfers](/airports/king-fahd-dammam).

## What's different about business visits here

### Site access

Industrial sites, company compounds and university campuses often have controlled gates, visitor badges and specific entry points. Share the **gate or entrance name, your host's contact and any visitor reference** when you book, so the driver goes to the right place first time.

### Long days, many stops

A typical day might be hotel → site in Dhahran → office in Al Khobar → dinner. Booked per trip, that is several separate pickups; booked **by the hour or by the day**, one driver waits and follows the schedule. See [private driver pricing explained](/blog/private-driver-cost-saudi-arabia).

### Multi-day projects

For teams on site for a week or more, book the whole period together. One quote covers the daily pattern (morning drop-offs, evening returns, the airport at either end), and changes are handled with one contact.

### Coming from Riyadh

Many executives combine Riyadh and the Eastern Province. The road from Riyadh to Dammam is about 390 km — roughly three and a half hours — which can be a better use of time than a short flight once airport time is counted, especially for a team with equipment.

### Bahrain

Dammam and Al Khobar are close to the causeway to Bahrain, so short cross-border trips are common. You carry your own valid documents; see [Dammam to Manama](/routes/dammam-to-manama).

## Choosing vehicles

- **Executive sedan** for one or two people.
- **Full-size SUV** for small teams, or when sites have rough access roads.
- **Van or coaster** for crews and project teams — see [vehicle classes](/fleet).

## For companies

Send the sites, dates and expected movements and we return a **written fixed quote**. Payment is by cash to the driver or bank transfer, electronic receipts are available, and company invoices can be issued on request — corporate invoicing can be arranged through our sister company. Bookings can be cancelled free of charge up to 24 hours before pickup.

## Common questions

### How far is Dammam Airport from Dhahran?

About 25 km — around 25 minutes.

### How far is Jubail from Dammam Airport?

About 90 km — just over an hour.

### Can we book the same driver for a whole week?

Book the full period together and we arrange it as one plan with one contact.
`,
};

export default post;
