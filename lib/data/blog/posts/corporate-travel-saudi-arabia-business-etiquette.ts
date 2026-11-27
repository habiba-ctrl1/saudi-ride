import type { BlogPost } from "../types";

// Rewritten 2026-10-02. Kept as the etiquette-focused business post; the new
// saudi-arabia-business-travel-transportation-guide is the transport hub and
// this post points up to it. Removed "Mercedes S-Class" as a default and the
// "our corporate accounts provide daily hire" phrasing.
const post: BlogPost = {
  slug: "corporate-travel-saudi-arabia-business-etiquette",
  title: "Business Etiquette in Saudi Arabia: A Practical Guide for Visiting Executives",
  seoTitle: "Saudi Business Etiquette Guide for Visiting Executives",
  excerpt:
    "Meetings, greetings, dress, the working week, prayer times and hospitality in Saudi Arabia — practical etiquette for visiting executives, plus how to plan getting between meetings.",
  category: "Business Travel",
  coverImage: "/blog/corporate-travel-saudi-arabia-business-etiquette.webp",
  coverAlt: "Two businessmen in suits shaking hands in a bright office lobby with a city skyline behind",
  publishedAt: "2026-08-23",
  updatedAt: "2026-10-02",
  quickAnswer:
    "Business in Saudi Arabia runs on relationships: expect coffee and conversation before the agenda, dress conservatively, greet with the right hand and let a Saudi counterpart of the opposite sex decide whether to shake hands. The working week is Sunday to Thursday, prayer times shape the day, and arriving on time — even when meetings start late — matters.",
  related: ["saudi-arabia-business-travel-transportation-guide", "riyadh-business-events-executive-transfer-guide", "eastern-province-corporate-visitor-transport-guide"],
  links: [
    { label: "Executive chauffeur service", href: "/services/business-executive" },
    { label: "Corporate transportation", href: "/services/corporate" },
    { label: "KAFD chauffeur for meeting days", href: "/locations/riyadh/kafd" },
    { label: "Riyadh Airport (RUH) arrivals", href: "/airports/king-khalid-riyadh" },
    { label: "Hourly private driver in Riyadh", href: "/locations/riyadh/private-driver" },
  ],
  cta: {
    kind: "corporate",
    intro: "Hello, I'd like an executive car for business meetings.",
    heading: "Arrange transport for your business trip",
    text: "Send your city, dates and meeting schedule. We suggest per-trip or hourly bookings and confirm a fixed price; companies can request a written quote and invoice.",
  },
  content: `
## The basics in one table

| Topic | What to expect |
|---|---|
| **Working week** | Sunday to Thursday; Friday and Saturday are the weekend |
| **First meeting** | Coffee, tea and conversation before business |
| **Greeting** | Right hand; let a counterpart of the opposite sex decide whether to shake hands |
| **Dress** | Conservative business dress; covered shoulders and knees for everyone |
| **Timing** | Be punctual yourself; be patient if meetings start late or are interrupted |
| **Prayer** | Meetings pause or are scheduled around prayer times |
| **Decisions** | Often made after several meetings, sometimes by someone senior who wasn't in the first one |

## Meetings and greetings

### Relationships first

The first meeting is often about getting to know each other. Expect Arabic coffee (*qahwa*), dates or tea, and conversation about your journey, your family in general terms and your impressions of the Kingdom. Rushing straight to the slides can come across as cold. Accept the coffee; when you've had enough, a slight shake of the cup when handing it back is the traditional signal.

### Handshakes

Shake hands with your right hand. In mixed-gender meetings, wait for your Saudi counterpart to offer a hand; if they don't, a nod or a hand on the heart is a polite alternative. Use titles — *Dr.*, *Eng.*, *Sheikh* — until you are invited to do otherwise.

### Punctuality and patience

Arrive on time; it reflects on you. Do not be surprised if the meeting starts late, if phones are answered, or if people come and go. Allow buffers in your day rather than stacking meetings back to back.

### Business cards and materials

Bring business cards. Material in both **English and Arabic** is appreciated, though not essential in most international settings.

## Dress

- **Men:** a business suit is standard for visitors. Many Saudi colleagues will wear the *thobe* and *ghutra* or *shemagh*.
- **Women:** the abaya is no longer required for foreign women, but modest business dress — loose-fitting, with covered shoulders and knees — is expected. Headscarves are not required for non-Muslim women. Some women visitors carry a light abaya or scarf for government buildings or more traditional settings.

## The working week and the calendar

- The **weekend is Friday and Saturday**; Friday midday is the main congregational prayer.
- **Prayer times** move through the year; many offices pause at prayer, so a 30-minute gap in a schedule may simply be prayer.
- **Ramadan** shortens working hours and shifts much activity into the evening. Meetings happen, but schedules change — plan around it.
- **Major conference periods** in Riyadh book out hotels and cars early; see our [Riyadh conference venues guide](/blog/riyadh-business-events-executive-transfer-guide).

## Hospitality and dinners

Invitations to lunch, dinner or a majlis are part of building trust. Accept when you can. Alcohol is not served. Food is usually generous; trying a little of everything is polite. Business may not be discussed at all — that is fine.

## Topics to approach carefully

Keep politics and religion out of small talk unless your host raises them, avoid criticising local customs, and steer clear of jokes that rely on cultural references. Asking about Saudi Arabia's development, sport or travel inside the Kingdom is usually welcome.

## Getting between meetings

Riyadh is spread out, distances between districts are long, and summer heat makes walking between buildings impractical. A few planning points:

- **Allow for traffic.** A meeting in KAFD and another in the Diplomatic Quarter are not "around the corner" at rush hour.
- **Book a car that waits.** For a day of several meetings, an [hourly private driver](/locations/riyadh/private-driver) means the same car is outside each building when you finish.
- **Know the entrance.** Large business districts and ministries have several gates and entrances — give the driver the building name and entrance where you can.
- **Expenses.** Ask for an electronic receipt, or a company invoice for corporate bookings.

For the full transport picture — airports, cities, hourly hire and corporate bookings — see our [business travel transportation guide](/blog/saudi-arabia-business-travel-transportation-guide).

## Common questions

### Do I need to wear a suit in summer?

For first meetings, yes. Buildings and cars are air-conditioned; the main challenge is walking outside, which is why most visitors use a car door to door.

### Can women attend meetings alone?

Yes. Women regularly attend business meetings in Saudi Arabia, and travel to and from them by private car is routine.

### Is English widely used in business?

Yes, in most international and corporate settings. Arabic phrases such as *as-salamu alaykum* and *shukran* are appreciated.
`,
};

export default post;
