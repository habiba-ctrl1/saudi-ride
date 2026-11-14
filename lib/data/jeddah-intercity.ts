// Jeddah long-distance intercity route pages (2026-11-14): Jeddah ↔ Dammam,
// Jeddah ↔ Jazan, Abha → Jeddah. Rendered by
// components/location/cluster/SouthernRoutePage.tsx from /routes/[slug].
//
// Truth sources:
// - Distance/time: ROUTES_DATA only. Jeddah–Dammam 1,360 km / ~14 h 20 min and
//   Jeddah–Jazan 710 km / ~8 h are OSRM road measurements (2026-11-14,
//   city centre to city centre). Abha–Jeddah mirrors the existing
//   jeddah-to-abha entry (690 km / ~7.5 h) so the two directions never disagree.
// - Service facts: seo/facts.md (fixed fare agreed before booking, 15–30 min
//   free waiting, flight tracking, meet & greet, EN/AR drivers, free
//   cancellation to 24 h, cash/bank transfer, quote usually within 1–2 hours).
// - Vehicle models named here (Toyota Camry, GMC Yukon XL, Hyundai Staria) are
//   listed in facts.md; seats/bags come from lib/fleet-data.ts at render time.
// - No prices, no hotel names, no flight/bus/ferry timetables, no licence or
//   ownership claims. "Jazan" is the official spelling; the site's older pages
//   use "Jizan" — both are used once so either search finds the page.
// - Qarn al-Manazil (As-Sayl Al-Kabir) is the Miqat for travellers arriving
//   from Najd/the east; consistent with the site's Miqat guide.

import type { SouthernRoutePageData } from "@/lib/data/southern-cluster";

const INVOICE = "Corporate invoicing can be arranged through our sister company.";

export const JEDDAH_INTERCITY_ROUTE_PAGES: Record<string, SouthernRoutePageData> = {
  /* ───────────────────────── JEDDAH → DAMMAM ───────────────────────── */
  "jeddah-to-dammam": {
    slug: "jeddah-to-dammam",
    h1: "Jeddah to Dammam Private Transfer",
    eyebrow: "Red Sea coast → Arabian Gulf",
    fromPlace: "Jeddah",
    toPlace: "Dammam",
    bestFor: "Families with heavy luggage, relocations, travellers who prefer not to fly",
    lead: "A private car and driver for the full coast-to-coast crossing of Saudi Arabia, from your door in Jeddah to your door in Dammam, Al Khobar or Dhahran. The fare is agreed before you book.",
    quickAnswer:
      "A Jeddah to Dammam private transfer is about 1,360 km by road and roughly 14 to 15 hours of driving, crossing the Kingdom through Riyadh. It is the longest domestic route we arrange, so it is planned with rest, meal and prayer stops, and many travellers break it with a night in Riyadh. You book one private vehicle with a driver, the fare is fixed and confirmed on WhatsApp before booking, and vehicle availability is confirmed with your quote.",
    metaTitle: "Jeddah to Dammam Private Transfer | Car with Driver",
    metaDescription:
      "Private car with driver from Jeddah to Dammam, Al Khobar or Dhahran — about 1,360 km via Riyadh, door to door. Sedan, SUV or van; fare agreed on WhatsApp before booking.",
    stages: [
      { label: "Pickup", title: "Jeddah", desc: "Your home, hotel or office anywhere in Jeddah — Al Hamra, Al Rawdah, Al Salamah, Al Zahra, Obhur or Al-Balad — or King Abdulaziz International Airport (JED). Send the exact address when you book.", kind: "origin" },
      { label: "Up to the plateau", title: "Makkah bypass and Taif", desc: "The road leaves the coast and climbs towards Taif before turning east. This is the last large city before the long desert section, so it is a natural first stop.", kind: "road" },
      { label: "Across Najd", title: "Riyadh, the halfway point", desc: "Riyadh is about 950 km from Jeddah and roughly 400 km from Dammam. Most people who split the journey stop here for the night; tell us when you book and the stop is quoted with your fare.", kind: "road" },
      { label: "Drop-off", title: "Dammam, Al Khobar or Dhahran", desc: "Your address in Dammam, the Al Khobar corniche, Dhahran, or King Fahd International Airport (DMM) for an onward flight.", kind: "destination" },
    ],
    tradeOff: {
      heading: "Should you drive or fly from Jeddah to Dammam?",
      body: [
        "For one or two people with normal luggage, flying is usually the better choice. The flight is a fraction of the road time, and we can simply arrange the airport transfers at each end. We would rather tell you that than sell you a 14-hour drive you do not need.",
        "A private car makes sense when the flight does not: a family moving house with more bags than an airline allows, travellers who cannot or prefer not to fly, a group that wants to stay together in one vehicle, or a trip with stops on the way in Taif or Riyadh. You pay for the vehicle, not per seat, so the cost is shared across everyone travelling.",
        "Tell us what you are carrying and how many of you are travelling, and we will say honestly whether one long day, a two-day trip with a night in Riyadh, or a flight with transfers fits you best.",
      ],
    },
    endPoints: {
      heading: "Where we pick up in Jeddah and drop off in the Eastern Province",
      intro: "The transfer is door to door at both ends. These are the usual points; any address in either city can be used.",
      points: [
        { name: "Jeddah districts", desc: "Homes, hotels and offices across the city, including Al Hamra, Al Rawdah, Al Salamah, Al Zahra, Obhur and Al-Balad." },
        { name: "King Abdulaziz International Airport (JED)", desc: "Arrivals pickup with meet & greet. Share your flight number; we track your flight." },
        { name: "Dammam", desc: "Addresses across the city, including the corniche side at Al Shati and the central districts." },
        { name: "Al Khobar and Dhahran", desc: "The three cities form one urban area, so a drop-off in Al Khobar or Dhahran is part of the same trip. Name the city when you book." },
        { name: "King Fahd International Airport (DMM)", desc: "For onward flights. The airport is about 35 km from central Dammam, so say if this is your final stop." },
      ],
    },
    vehicleGuide: [
      { fleetSlug: "toyota-camry", name: "Executive sedan (e.g. Toyota Camry)", fit: "One or two adults with light luggage. Comfortable, but tight for a full day with a full boot." },
      { fleetSlug: "gmc-yukon-xl", name: "Full-size SUV (e.g. GMC Yukon XL)", fit: "The usual choice for this distance: families, more legroom and more luggage space over 14 hours." },
      { fleetSlug: "hyundai-staria", name: "Van (e.g. Hyundai Staria)", fit: "Larger families and groups who want to travel in one vehicle." },
    ],
    booking: {
      heading: "One-way, return and how far ahead to book",
      body: [
        "Most Jeddah to Dammam bookings are one-way. If you also need the journey back, ask for both legs in one request and each fare is agreed before you travel.",
        "Book as early as you can. A drive of this length needs a driver and vehicle set aside for at least a full day, so a few days' notice gives you the widest choice. Short-notice requests are checked against availability and we tell you plainly what can be arranged.",
        "To quote accurately we need the pickup and drop-off addresses, date and time, number of passengers, number of large bags and whether you want a night stop on the way.",
      ],
    },
    whoBooks: [
      { title: "Families relocating between the two coasts", desc: "A job move from Jeddah to the Eastern Province usually means more luggage than a flight allows, and everyone travelling together." },
      { title: "Travellers who prefer the road", desc: "Passengers who cannot or do not want to fly, including those travelling with elderly relatives who are more comfortable in a private car with stops." },
      { title: "Company staff and project teams", desc: `Businesses moving staff between Jeddah and Dammam, Jubail or Dhahran can request a written quote by email. ${INVOICE}` },
    ],
    tips: [
      { title: "Decide on one day or two before you book", desc: "Fourteen to fifteen hours of driving plus stops is a very long day. A night in Riyadh makes it two comfortable days; tell us which you want so the quote matches." },
      { title: "Count the large bags, not just the people", desc: "On a relocation trip luggage is usually what decides the vehicle. Give us the number of large suitcases and any boxes." },
      { title: "Leave early", desc: "An early-morning departure from Jeddah puts the long desert section in daylight." },
      { title: "Travelling with children", desc: "Tell us their ages when you book so stops can be planned around them." },
    ],
    faqs: [
      { question: "Can I book a private car from Jeddah to Dammam?", answer: "Yes. We arrange a private car with a driver from any address in Jeddah to Dammam, Al Khobar or Dhahran. Send your pickup and drop-off addresses, date, passengers and luggage, and we reply on WhatsApp, usually within 1–2 hours, with one fixed fare for the vehicle you choose." },
      { question: "How far is Jeddah from Dammam by road, and how long does it take?", answer: "Jeddah to Dammam is about 1,360 km by road and roughly 14 to 15 hours of driving, plus rest, meal and prayer stops. The road crosses the Kingdom through Taif and Riyadh. Real travel time depends on traffic and how many stops you want." },
      { question: "How much is a taxi from Jeddah to Dammam?", answer: "We do not publish a price list because the fare depends on the vehicle, the date and whether you want a night stop. The fare is fixed and agreed on WhatsApp before you book, with no meter and no surge." },
      { question: "Can we stop overnight in Riyadh?", answer: "Yes, and many travellers do. Riyadh is roughly two-thirds of the way. Tell us when you book and the overnight stop is included in the quote, so the fare you agree is the fare you pay." },
      { question: "Which vehicle is best for Jeddah to Dammam?", answer: "A full-size SUV suits most travellers on this route because of the hours involved and the luggage space. A sedan works for one or two adults with light bags, and a van suits a larger family. The exact vehicle is confirmed with your fare." },
      { question: "Can you pick us up from Jeddah airport and drive straight to Dammam?", answer: "Yes. Share your flight number and the driver meets you at arrivals at King Abdulaziz International Airport (JED). We track your flight, and 15–30 minutes of free waiting is included." },
      { question: "Can a company book this route with an invoice?", answer: `Yes. Email an RFQ with your dates, passenger numbers and vehicle needs for a written quote. ${INVOICE}` },
    ],
    related: [
      { href: "/routes/dammam-to-jeddah", label: "The return direction: Dammam to Jeddah by private car" },
      { href: "/routes/jeddah-to-riyadh", label: "Jeddah to Riyadh, the first two-thirds of this road" },
      { href: "/routes/riyadh-to-dammam", label: "Riyadh to Dammam transfer" },
      { href: "/locations/jeddah", label: "Private transport in Jeddah" },
      { href: "/locations/dammam", label: "Dammam and Eastern Province transfers" },
      { href: "/airports/king-abdulaziz-jeddah", label: "Jeddah airport (JED) pickups" },
    ],
  },

  /* ───────────────────────── DAMMAM → JEDDAH ───────────────────────── */
  "dammam-to-jeddah": {
    slug: "dammam-to-jeddah",
    h1: "Dammam to Jeddah Private Transfer",
    eyebrow: "Arabian Gulf → Red Sea coast",
    fromPlace: "Dammam",
    toPlace: "Jeddah",
    bestFor: "Eastern Province families, Umrah trips by road, travellers with heavy luggage",
    lead: "One private vehicle and driver from Dammam, Al Khobar or Dhahran across the Kingdom to Jeddah, door to door. The fare is agreed before you book, and stops on the way are planned with you.",
    quickAnswer:
      "Dammam to Jeddah by car is about 1,360 km and roughly 14 to 15 hours of driving through Riyadh and Taif. A private transfer gives you one vehicle and a driver for the whole trip, with rest and prayer stops, and the option of a night in Riyadh. Travellers going on to Makkah for Umrah pass the Qarn al-Manazil Miqat near Taif on this road. The fare is fixed and confirmed on WhatsApp before booking.",
    metaTitle: "Dammam to Jeddah Private Transfer | By Car with Driver",
    metaDescription:
      "Dammam to Jeddah by private car with a driver — about 1,360 km and 14–15 hours via Riyadh and Taif. Pickup in Dammam, Khobar or Dhahran. Fare agreed on WhatsApp first.",
    stages: [
      { label: "Pickup", title: "Dammam, Al Khobar or Dhahran", desc: "Your home, compound, hotel or office in the Eastern Province, or King Fahd International Airport (DMM). Compound and gate details help the driver, so include them.", kind: "origin" },
      { label: "First leg", title: "Dammam to Riyadh", desc: "About 400 km of motorway to the capital. A good point for a meal stop, or for the night if you are splitting the trip.", kind: "road" },
      { label: "Second leg", title: "Riyadh to Taif", desc: "The long desert section across Najd. Near Taif the road passes As-Sayl Al-Kabir, the Qarn al-Manazil Miqat, where Umrah travellers stop to enter ihram.", kind: "road" },
      { label: "Drop-off", title: "Jeddah", desc: "The road descends to the coast. Drop-off at any Jeddah address — Al Hamra, Al Rawdah, Al Salamah, Obhur, Al-Balad — or King Abdulaziz International Airport (JED).", kind: "destination" },
    ],
    tradeOff: {
      heading: "Dammam to Jeddah: by car, by plane or by train?",
      body: [
        "There is no direct train from Dammam to Jeddah. The railway from Dammam ends in Riyadh, and the Haramain line on the west coast is a separate network, so a rail trip still leaves the long Riyadh to Jeddah section to cover another way.",
        "Flying is the fastest option and is the right one for most solo and business travellers; we can arrange the airport transfers at both ends. A private car is the better fit when you are a family with a lot of luggage, when you want to stop in Riyadh or Taif, when you are combining the trip with Umrah, or when someone in the group prefers not to fly.",
        "Driving yourself is possible, but it is two long days at the wheel. With a private transfer the driver handles the road, and you agree one fare for the vehicle before you leave.",
      ],
    },
    endPoints: {
      heading: "Pickup points in the Eastern Province and drop-off in Jeddah",
      intro: "Send the exact address at both ends. These are the pickup and drop-off points we are asked for most on this route.",
      points: [
        { name: "Dammam", desc: "Homes and hotels across the city, including Al Faisaliyah and the Al Shati corniche side." },
        { name: "Al Khobar and Dhahran", desc: "Residential compounds, the Al Khobar corniche and Dhahran. Pickups here are part of the same route." },
        { name: "King Fahd International Airport (DMM)", desc: "Arrivals pickup with meet & greet; we track your flight." },
        { name: "Jeddah city", desc: "Hotels, family homes and offices in any district, from Obhur in the north to Al-Balad in the historic centre." },
        { name: "King Abdulaziz International Airport (JED)", desc: "For international departures. Give us the flight time and we plan the arrival with check-in margin." },
      ],
    },
    vehicleGuide: [
      { fleetSlug: "toyota-camry", name: "Executive sedan (e.g. Toyota Camry)", fit: "One or two adults travelling light. Fine for the distance, limited for luggage." },
      { fleetSlug: "gmc-yukon-xl", name: "Full-size SUV (e.g. GMC Yukon XL)", fit: "Most families choose this for the space and comfort over two long driving legs." },
      { fleetSlug: "hyundai-staria", name: "Van (e.g. Hyundai Staria)", fit: "Extended families and Umrah groups who want everyone in one vehicle." },
    ],
    booking: {
      heading: "One-way, return and booking ahead from Dammam",
      body: [
        "You can book one-way to Jeddah, or a return where the same request covers the journey back on a later date. Each leg has its own fare, agreed before travel.",
        "Around school holidays, Ramadan and the Hajj season the western region is busy and vehicles are booked early, so send your dates as soon as they are fixed. For other dates a few days' notice is usually enough; we confirm availability with the quote rather than promising it in advance.",
        "If the trip continues to Makkah or Madinah, say so in the same message. It changes the route and the fare, and it is easier to plan as one journey than as two.",
      ],
    },
    whoBooks: [
      { title: "Eastern Province families visiting the west", desc: "Family visits to Jeddah, often with children and several large bags, where one vehicle door to door is simpler than flights and taxis." },
      { title: "Umrah travellers going by road", desc: "Groups from Dammam, Al Khobar and Dhahran who travel by car, stop at the Miqat near Taif and continue to Makkah or Jeddah." },
      { title: "Staff and contractors", desc: `Companies sending employees from the Eastern Province to Jeddah can ask for a written quote by email. ${INVOICE}` },
    ],
    tips: [
      { title: "Going for Umrah? Tell us before you book", desc: "The driver needs to plan the stop at As-Sayl Al-Kabir (Qarn al-Manazil) near Taif, and the drop-off may be Makkah rather than Jeddah." },
      { title: "A night in Riyadh splits the trip well", desc: "Dammam to Riyadh is the short leg and Riyadh to Jeddah the long one, so leaving Dammam in the afternoon and continuing early the next morning works for many families." },
      { title: "Give compound access details", desc: "If you live in a gated compound, send the gate name and any entry procedure so the pickup is not delayed." },
      { title: "Flying out of Jeddah afterwards?", desc: "Share the flight time. On a drive this long we plan a wide margin before an international departure." },
    ],
    faqs: [
      { question: "How many hours is Dammam to Jeddah by car?", answer: "Dammam to Jeddah is roughly 14 to 15 hours of driving for about 1,360 km, before stops. With rest, meals and prayers most trips take a full day and evening, which is why many travellers stay overnight in Riyadh." },
      { question: "Is there a taxi from Dammam to Jeddah?", answer: "Yes. We arrange a pre-booked private car with a driver from Dammam, Al Khobar or Dhahran to Jeddah. It is not a metered street taxi: you agree one fixed fare on WhatsApp before booking and the vehicle is yours for the whole trip." },
      { question: "What does a private car from Dammam to Jeddah cost?", answer: "The fare depends on the vehicle, the date and any overnight stop, so we quote each trip rather than publish a list. Send the details and we reply, usually within 1–2 hours, with a fixed fare. There is no meter and no surge." },
      { question: "Can the driver stop at the Miqat for Umrah?", answer: "Yes. Travellers coming from the east pass the Qarn al-Manazil Miqat at As-Sayl Al-Kabir, near Taif. Tell us when you book and the stop is planned into the trip." },
      { question: "Can you drop us at Jeddah airport instead of the city?", answer: "Yes. King Abdulaziz International Airport (JED) can be the drop-off. Share your flight time so the departure from Dammam is set with enough margin." },
      { question: "Can we go to Makkah or Madinah on the same trip?", answer: "Yes. Tell us the full plan in one message and we quote it as a single journey, including any waiting time and the onward leg." },
      { question: "How do we pay?", answer: "Payment is by cash to the driver or by bank transfer, and an electronic receipt is available on request. Cancellation is free up to 24 hours before pickup." },
    ],
    related: [
      { href: "/routes/jeddah-to-dammam", label: "The opposite direction: Jeddah to Dammam" },
      { href: "/routes/riyadh-to-jeddah", label: "Riyadh to Jeddah private car" },
      { href: "/locations/dammam", label: "Dammam, Al Khobar and Dhahran transfers" },
      { href: "/airports/king-fahd-dammam", label: "Dammam airport (DMM) pickups" },
      { href: "/locations/jeddah", label: "Getting around Jeddah with a private driver" },
      { href: "/services/umrah-transport", label: "Umrah transport by private car" },
    ],
  },

  /* ───────────────────────── JEDDAH → JAZAN ───────────────────────── */
  "jeddah-to-jazan": {
    slug: "jeddah-to-jazan",
    h1: "Jeddah to Jazan Private Transfer",
    eyebrow: "Down the Red Sea coast",
    fromPlace: "Jeddah",
    toPlace: "Jazan",
    bestFor: "Families, business trips to Jazan, travellers heading for the Farasan Islands",
    lead: "A private car with a driver from Jeddah or Jeddah airport down the Red Sea coastal highway to Jazan, door to door, with the fare agreed before you book.",
    quickAnswer:
      "A private transfer from Jeddah to Jazan (also written Jizan) is about 710 km by road and roughly 8 hours of driving along the Red Sea coast, passing Al Lith and Al Qunfudhah. You book one private vehicle with a driver, with rest and prayer stops on the way. The fare is fixed and confirmed on WhatsApp before booking, and the vehicle is confirmed with your quote.",
    metaTitle: "Jeddah to Jazan Private Transfer | Car with Driver",
    metaDescription:
      "Private car with driver from Jeddah or JED airport to Jazan (Jizan) — about 710 km along the Red Sea coast, roughly 8 hours, door to door. Fare agreed on WhatsApp first.",
    stages: [
      { label: "Pickup", title: "Jeddah", desc: "Your hotel, home or office in Jeddah, or King Abdulaziz International Airport (JED). If you are landing first, share the flight number and the driver is planned around your arrival.", kind: "origin" },
      { label: "South along the coast", title: "Al Lith", desc: "The road leaves Jeddah heading south and stays on the coastal plain. Al Lith is the first town of any size and a common first stop.", kind: "road" },
      { label: "Midway", title: "Al Qunfudhah", desc: "Roughly the middle of the journey and the usual place for a meal and prayer break before the southern half.", kind: "road" },
      { label: "Drop-off", title: "Jazan", desc: "Your hotel, home or office in Jazan city, Jazan airport (GIZ), the port for the Farasan Islands ferry, or towns nearby such as Sabya and Abu Arish.", kind: "destination" },
    ],
    tradeOff: {
      heading: "Private car or flight from Jeddah to Jazan?",
      body: [
        "A flight is quicker in the air, and if you are travelling alone with a small bag it is usually the simpler choice. We can arrange the airport transfers at either end.",
        "A private car suits you when you are travelling as a family, carrying more luggage than you want to check in, or going somewhere beyond Jazan city where you would need a second car anyway. It is one vehicle from your door in Jeddah to the exact address in the south, at the time you choose, and the cost is for the vehicle rather than per person.",
        "The drive is a full day. The coastal plain is flat and hot for most of the year, so the trip is planned with stops, and an early start keeps most of it in daylight.",
      ],
    },
    endPoints: {
      heading: "Pickup in Jeddah and drop-off in the Jazan region",
      intro: "Give us the exact address at both ends when you book. Common points on this route:",
      points: [
        { name: "Jeddah city", desc: "Any district. South Jeddah and Al-Balad pickups are closest to the road out; Obhur and the north add time through the city." },
        { name: "King Abdulaziz International Airport (JED)", desc: "Arrivals pickup with meet & greet. We track your flight." },
        { name: "Jazan city", desc: "Hotels, homes and offices across the city and the corniche." },
        { name: "Jazan airport (GIZ)", desc: "For onward domestic flights; share the departure time." },
        { name: "Jazan port", desc: "For passengers continuing to the Farasan Islands by ferry. Check the ferry schedule yourself before booking and tell us the sailing you plan to take." },
        { name: "Sabya, Abu Arish and the industrial area", desc: "Drop-offs outside the city, including the industrial and economic city north of Jazan, are quoted with the fare. Give the exact location." },
      ],
    },
    vehicleGuide: [
      { fleetSlug: "toyota-camry", name: "Executive sedan (e.g. Toyota Camry)", fit: "Solo travellers and couples with standard luggage, and most business trips." },
      { fleetSlug: "gmc-yukon-xl", name: "Full-size SUV (e.g. GMC Yukon XL)", fit: "Families and anyone who wants more space for eight hours on the road." },
      { fleetSlug: "hyundai-staria", name: "Van (e.g. Hyundai Staria)", fit: "Groups and families who would otherwise need two cars." },
    ],
    booking: {
      heading: "One-way or return, and when to book",
      body: [
        "You can book Jeddah to Jazan one-way, or include the journey back to Jeddah on a later date in the same request. Each direction is quoted and agreed before you travel.",
        "Because the driver is away from Jeddah for the whole day, booking a few days ahead gives the best choice of vehicle. If you need to travel sooner, send the details and we will tell you what is available.",
        "For the quote we need both addresses, the date and time, the number of passengers and the number of large bags.",
      ],
    },
    whoBooks: [
      { title: "Families visiting relatives in the south", desc: "Trips home to Jazan, Sabya and Abu Arish with children and luggage, where one car door to door avoids flights and local taxis." },
      { title: "Business and project travellers", desc: `Staff travelling to offices and industrial sites in the Jazan region. Companies can request a written quote by email. ${INVOICE}` },
      { title: "Visitors heading for the islands and the mountains", desc: "Travellers going on to the Farasan Islands from Jazan port, or combining Jazan with Abha and the Asir highlands." },
    ],
    tips: [
      { title: "Start early", desc: "An early departure from Jeddah means arriving in Jazan before evening and keeps the drive in daylight." },
      { title: "Dress for the heat at the stops", desc: "The coastal plain is hot and humid for much of the year. The car is air-conditioned; the rest stops are not always." },
      { title: "Continuing to Abha?", desc: "Jazan to Abha is a further mountain drive. Ask for it in the same request and it is planned as one trip." },
      { title: "Catching a ferry", desc: "Tell us the sailing time and we plan the departure from Jeddah back from it, with margin." },
    ],
    faqs: [
      { question: "Is a private transfer available from Jeddah to Jazan?", answer: "Yes. We arrange a private car with a driver from any address in Jeddah, or from Jeddah airport, to Jazan city and the surrounding area. Send your details on WhatsApp and we reply, usually within 1–2 hours, with a fixed fare." },
      { question: "How far is Jeddah from Jazan by road?", answer: "Jeddah to Jazan is about 710 km by road, roughly 8 hours of driving along the Red Sea coast through Al Lith and Al Qunfudhah. Stops add to that, so plan for a full day." },
      { question: "How much is a taxi from Jeddah to Jazan?", answer: "The fare depends on the vehicle and the date, so each trip is quoted. It is a fixed fare agreed on WhatsApp before you book, with no meter and no surge." },
      { question: "Is Jazan the same place as Jizan?", answer: "Yes. Jazan and Jizan are two English spellings of the same city and region in the south-west of Saudi Arabia. Gizan is a third spelling, which is where the airport code GIZ comes from." },
      { question: "Can I choose an SUV for the journey?", answer: "Yes. Tell us you want an SUV, or choose it in the quote form, and the fare is given for that vehicle. An SUV is the most common choice for families on this route. Availability is confirmed with your quote." },
      { question: "Can you pick me up at Jeddah airport and drive directly to Jazan?", answer: "Yes. The driver meets you at arrivals at King Abdulaziz International Airport (JED). We track your flight, and 15–30 minutes of free waiting is included." },
      { question: "Can I book a return transfer from Jazan to Jeddah?", answer: "Yes. Ask for both directions in one request with the two dates, and each fare is agreed before you travel." },
    ],
    related: [
      { href: "/routes/jazan-to-jeddah", label: "Jazan to Jeddah, the northbound trip" },
      { href: "/locations/jizan", label: "Private transfers in Jazan (Jizan)" },
      { href: "/airports/jizan-regional", label: "Jazan airport (GIZ) transfers" },
      { href: "/routes/jeddah-to-abha", label: "Jeddah to Abha in the Asir highlands" },
      { href: "/routes/abha-to-jizan", label: "Abha to Jizan mountain descent" },
      { href: "/locations/jeddah", label: "Jeddah private transport hub" },
    ],
  },

  /* ───────────────────────── JAZAN → JEDDAH ───────────────────────── */
  "jazan-to-jeddah": {
    slug: "jazan-to-jeddah",
    h1: "Jazan to Jeddah Private Transfer",
    eyebrow: "North along the Red Sea",
    fromPlace: "Jazan",
    toPlace: "Jeddah",
    bestFor: "International flights from Jeddah, medical and family trips, Umrah travellers",
    lead: "A private car and driver from Jazan to Jeddah city or straight to King Abdulaziz International Airport, timed around your flight or appointment, with the fare agreed before you book.",
    quickAnswer:
      "A private transfer from Jazan (Jizan) to Jeddah is about 710 km by road and roughly 8 hours of driving north along the Red Sea coast. Many travellers book it to reach an international flight at King Abdulaziz International Airport (JED), so the pickup time is worked back from the flight with margin. The fare is fixed and confirmed on WhatsApp before booking.",
    metaTitle: "Jazan to Jeddah Private Transfer | To City or JED Airport",
    metaDescription:
      "Private car with driver from Jazan (Jizan) to Jeddah or Jeddah airport (JED) — about 710 km, roughly 8 hours along the coast. Timed to your flight; fare agreed first.",
    stages: [
      { label: "Pickup", title: "Jazan", desc: "Your home or hotel in Jazan city, or in Sabya, Abu Arish and nearby towns. Pickup from Jazan airport (GIZ) is also possible.", kind: "origin" },
      { label: "Northbound", title: "The coastal plain", desc: "The road runs north with the Red Sea on one side and the mountains inland. It is flat, open driving for most of the day.", kind: "road" },
      { label: "Midway", title: "Al Qunfudhah and Al Lith", desc: "The two main towns on the way and the natural places to stop for food, fuel and prayers.", kind: "road" },
      { label: "Drop-off", title: "Jeddah or JED airport", desc: "Any address in Jeddah, or the departures level at King Abdulaziz International Airport. The airport is on the north side of the city, so it adds time after you reach Jeddah.", kind: "destination" },
    ],
    tradeOff: {
      heading: "Jazan to Jeddah by private car or by air?",
      body: [
        "If a domestic flight lines up with your plans, it is faster, and we can arrange the car at the Jeddah end only. That is often the right answer for one traveller with one bag.",
        "A private car is the better fit when the timings do not line up with an onward international flight, when you are travelling with family and a lot of luggage, when an elderly or unwell passenger is more comfortable going door to door, or when you start from a town outside Jazan city and want to avoid a separate trip to the airport.",
        "With a car you choose the departure time and pay one fare for the vehicle. The trade-off is time: it is a full day of travel, so we plan it carefully rather than promise an exact arrival minute.",
      ],
    },
    endPoints: {
      heading: "Where the trip starts in Jazan and ends in Jeddah",
      intro: "The service is door to door. Tell us the exact pickup location, especially if it is outside Jazan city.",
      points: [
        { name: "Jazan city", desc: "Homes, hotels and offices in the city." },
        { name: "Sabya, Abu Arish and nearby towns", desc: "Pickups across the region are possible. Send a location pin so the driver finds you without delay." },
        { name: "Jazan airport (GIZ)", desc: "If you are arriving on a flight and continuing north by road." },
        { name: "King Abdulaziz International Airport (JED)", desc: "The most requested drop-off on this route. Give us the flight number and departure time." },
        { name: "Jeddah hotels and homes", desc: "Any district, including Al Hamra and the corniche, Al Rawdah, Al Salamah, Al Zahra and Al-Balad." },
        { name: "Jeddah hospitals and clinics", desc: "For medical appointments, send the hospital name and appointment time and we plan around it." },
      ],
    },
    vehicleGuide: [
      { fleetSlug: "toyota-camry", name: "Executive sedan (e.g. Toyota Camry)", fit: "One or two passengers going to the airport with normal luggage." },
      { fleetSlug: "gmc-yukon-xl", name: "Full-size SUV (e.g. GMC Yukon XL)", fit: "Families, and passengers who need more room and an easier seat to get in and out of." },
      { fleetSlug: "hyundai-staria", name: "Van (e.g. Hyundai Staria)", fit: "Larger families travelling together with several large suitcases." },
    ],
    booking: {
      heading: "Flight timing, return trips and advance booking",
      body: [
        "If you are catching a flight, book the transfer as soon as the ticket is confirmed. For a drive of about eight hours we plan a wide margin before an international departure, which often means leaving Jazan the night before or very early in the morning.",
        "A return to Jazan can be included in the same request, with its own date and its own agreed fare.",
        "Send both addresses, the date, your flight or appointment time, the number of passengers and the number of large bags, and we confirm the fare and vehicle availability together.",
      ],
    },
    whoBooks: [
      { title: "Passengers flying internationally from Jeddah", desc: "Travellers from the Jazan region whose long-haul flight leaves from King Abdulaziz International Airport and who want one car straight to the terminal." },
      { title: "Families and patients with appointments in Jeddah", desc: "Trips for hospital visits, family events and paperwork, where a door-to-door car is easier than a flight for the person travelling." },
      { title: "Umrah travellers", desc: "Groups travelling north for Umrah. Tell us when you book so the stop at the Miqat is planned and the drop-off is set to Makkah or Jeddah." },
    ],
    tips: [
      { title: "Work back from the flight, not forward from the pickup", desc: "Tell us the departure time and let us set the pickup. Eight hours of driving, stops and Jeddah traffic all need margin." },
      { title: "Send a location pin for town and village pickups", desc: "Addresses outside Jazan city are much easier for the driver to find with a pin than with a description." },
      { title: "Going for Umrah?", desc: "Say so in the first message. The Miqat stop and the final drop-off both change the plan." },
      { title: "Keep medicines and documents in the cabin", desc: "On a full-day trip, keep what you need to hand rather than in the boot." },
    ],
    faqs: [
      { question: "Can I book a private car from Jazan to Jeddah airport?", answer: "Yes. We arrange a private car with a driver from Jazan to King Abdulaziz International Airport (JED). Give us your flight time and we set the pickup with a wide margin for the roughly 8-hour drive." },
      { question: "How long is the drive from Jazan to Jeddah?", answer: "Jazan to Jeddah is about 710 km and roughly 8 hours of driving, plus stops. Reaching the airport on the north side of Jeddah adds time through the city." },
      { question: "How much does a taxi from Jazan to Jeddah cost?", answer: "Each trip is quoted because the fare depends on the vehicle and date. You receive one fixed fare on WhatsApp, usually within 1–2 hours of asking, and it is agreed before you book." },
      { question: "Can you pick up from Sabya or Abu Arish?", answer: "Yes. Pickups from towns in the Jazan region can be arranged. Send the exact location and it is included in the quote." },
      { question: "Is the transfer suitable for an elderly passenger?", answer: "A private car is often chosen for that reason: it is door to door, the stops are yours to set, and an SUV gives an easier seat height. Tell us about any needs when you book so the right vehicle is confirmed." },
      { question: "Can we stop on the way?", answer: "Yes. Rest, meal and prayer stops are part of a trip this long. Longer stops or detours are quoted with the fare, so mention them when you book." },
      { question: "Can I cancel if my plans change?", answer: "Cancellation is free up to 24 hours before pickup." },
    ],
    related: [
      { href: "/routes/jeddah-to-jazan", label: "Jeddah to Jazan, the southbound trip" },
      { href: "/airports/king-abdulaziz-jeddah", label: "King Abdulaziz Airport (JED) transfers" },
      { href: "/locations/jizan", label: "Jazan (Jizan) local transfers" },
      { href: "/airports/jizan-regional", label: "Jazan airport (GIZ) pickups" },
      { href: "/routes/jeddah-to-makkah", label: "Jeddah to Makkah, if you are continuing for Umrah" },
    ],
  },

  /* ───────────────────────── ABHA → JEDDAH ───────────────────────── */
  "abha-to-jeddah": {
    slug: "abha-to-jeddah",
    h1: "Abha to Jeddah Private Transfer",
    eyebrow: "Asir highlands → Red Sea coast",
    fromPlace: "Abha",
    toPlace: "Jeddah",
    bestFor: "Summer visitors returning home, flights from Jeddah, families from Abha and Khamis Mushait",
    lead: "One private car and driver from Abha or Khamis Mushait down from the Asir highlands to Jeddah city or Jeddah airport, door to door, with the fare agreed before you book.",
    quickAnswer:
      "A private transfer from Abha to Jeddah is about 690 km by road and roughly 7 to 8 hours of driving. The trip starts with a mountain descent from the Asir highlands, then runs north to Jeddah. Pickup can be in Abha, Khamis Mushait or at Abha airport, and drop-off at any Jeddah address or King Abdulaziz International Airport (JED). The fare is fixed and confirmed on WhatsApp before booking.",
    metaTitle: "Abha to Jeddah Private Transfer | Car with Driver",
    metaDescription:
      "Private car with driver from Abha or Khamis Mushait to Jeddah or JED airport — about 690 km, 7–8 hours, door to door. Sedan, SUV or van; fare agreed on WhatsApp first.",
    stages: [
      { label: "Pickup", title: "Abha or Khamis Mushait", desc: "Your hotel, holiday rental or home in Abha, in Khamis Mushait about 25 km away, or Abha International Airport (AHB).", kind: "origin" },
      { label: "The descent", title: "Leaving the highlands", desc: "The first part of the drive comes down from the Sarawat mountains. Expect bends and, at times, fog or rain, and a sharp rise in temperature on the way down.", kind: "road" },
      { label: "Northbound", title: "The long open section", desc: "Once off the mountains the road is faster and flatter. Rest, meal and prayer stops are taken along this stretch.", kind: "road" },
      { label: "Drop-off", title: "Jeddah", desc: "Any address in Jeddah, or King Abdulaziz International Airport (JED) for a flight.", kind: "destination" },
    ],
    tradeOff: {
      heading: "Abha to Jeddah: private car, flight or bus?",
      body: [
        "Flights between Abha and Jeddah are short, and for a single traveller with light luggage a flight plus an airport transfer in Jeddah is usually the practical choice. In summer, though, Abha is at its busiest and seats on the day you want are not always available.",
        "A private car suits families going home after a summer stay with more bags than they arrived with, groups who want to travel together, and anyone connecting to an international flight in Jeddah who would rather not depend on a separate domestic leg. You pay for the vehicle, so the cost is shared by everyone in it.",
        "Intercity buses cost less per person but run to their own timetable and stations, and you still need a car at each end. Tell us what you are comparing and we will say which fits your trip.",
      ],
    },
    endPoints: {
      heading: "Pickup points in Asir and drop-off points in Jeddah",
      intro: "Send the exact pickup location. Holiday rentals in the hills around Abha can be hard to find without a location pin.",
      points: [
        { name: "Abha city", desc: "Hotels, apartments and homes across the city centre and the surrounding hills." },
        { name: "Khamis Mushait", desc: "About 25 km from Abha. Pickups here are arranged in the same way; name the city in your request." },
        { name: "Soudah and the highland resorts", desc: "Pickup from the mountain areas above Abha can be arranged. It adds time before the main descent, so mention it when you book." },
        { name: "Abha International Airport (AHB)", desc: "Arrivals pickup with meet & greet if you are flying into Abha and continuing by road." },
        { name: "Jeddah city", desc: "Any district, from Al-Balad and Al Hamra to Al Rawdah, Al Salamah and Obhur." },
        { name: "King Abdulaziz International Airport (JED)", desc: "Give us the flight time and the pickup in Abha is set back from it with margin." },
      ],
    },
    vehicleGuide: [
      { fleetSlug: "toyota-camry", name: "Executive sedan (e.g. Toyota Camry)", fit: "One or two adults with standard luggage." },
      { fleetSlug: "gmc-yukon-xl", name: "Full-size SUV (e.g. GMC Yukon XL)", fit: "Recommended for the mountain descent and for families: more space and a higher, steadier ride." },
      { fleetSlug: "hyundai-staria", name: "Van (e.g. Hyundai Staria)", fit: "Larger families at the end of a holiday, with luggage for everyone." },
    ],
    booking: {
      heading: "One-way, return and summer-season booking",
      body: [
        "Abha to Jeddah is usually booked one-way at the end of a stay. If you want the same service from Jeddah up to Abha at the start of your trip, ask for both and each direction is quoted and agreed in advance.",
        "Summer is the peak season in Abha, and the days at the end of school holidays are the busiest for trips back to Jeddah. Send your date as early as you can; outside those periods a few days' notice is normally enough. We confirm vehicle availability with the quote.",
        "For an accurate fare we need the pickup location, the Jeddah address or flight time, the number of passengers and the number of large bags.",
      ],
    },
    whoBooks: [
      { title: "Summer visitors heading home", desc: "Families who have spent part of the summer in the cool of Abha and Soudah and are returning to Jeddah with a full car of luggage." },
      { title: "Residents of Abha and Khamis Mushait", desc: "Trips to Jeddah for international flights, family visits and appointments." },
      { title: "Companies and delegations", desc: `Teams travelling between Asir and Jeddah can request a written quote by email. ${INVOICE}` },
    ],
    tips: [
      { title: "Allow extra time for the mountain section", desc: "Fog and rain are common in the highlands, especially in summer afternoons. A morning departure usually gives the clearest descent." },
      { title: "Pack for two climates", desc: "Abha can be cool when you leave and Jeddah hot and humid when you arrive. Keep a lighter layer in the cabin." },
      { title: "If anyone gets car-sick on bends", desc: "Tell us before the trip. The driver can take the descent gently and stop when needed." },
      { title: "Catching a flight in Jeddah", desc: "Share the departure time. We work back from it rather than promising a fixed arrival minute." },
    ],
    faqs: [
      { question: "Can I book a private car from Abha to Jeddah?", answer: "Yes. We arrange a private car with a driver from Abha, Khamis Mushait or Abha airport to any address in Jeddah or to Jeddah airport. Send your details on WhatsApp and we reply, usually within 1–2 hours, with one fixed fare." },
      { question: "How far is Abha from Jeddah by road?", answer: "Abha to Jeddah is about 690 km by road, roughly 7 to 8 hours of driving. The first part is a mountain descent, so real time depends on weather and stops." },
      { question: "How much is a taxi from Abha to Jeddah?", answer: "The fare depends on the vehicle and the date, so we quote each trip. The fare is fixed and agreed on WhatsApp before you book, with no meter and no surge." },
      { question: "Do you pick up from Khamis Mushait?", answer: "Yes. Khamis Mushait is about 25 km from Abha and pickups there are arranged in the same way. Give the exact address when you book." },
      { question: "Is an SUV better than a sedan for this route?", answer: "For most travellers, yes. The route starts with a long mountain descent and takes most of a day, so the extra space and ride height of an SUV make a difference, especially for families. A sedan is fine for one or two adults with light luggage." },
      { question: "Can the driver take us straight to Jeddah airport?", answer: "Yes. King Abdulaziz International Airport (JED) can be the drop-off. Share the flight time and the Abha pickup is planned with margin for the drive and for check-in." },
      { question: "Can we book the trip up to Abha as well?", answer: "Yes. The Jeddah to Abha direction can be booked in the same request, each with its own agreed fare." },
    ],
    related: [
      { href: "/routes/jeddah-to-abha", label: "Jeddah to Abha, the trip up to the highlands" },
      { href: "/locations/abha", label: "Abha city transfers and mountain tours" },
      { href: "/airports/abha-regional", label: "Abha airport (AHB) pickups" },
      { href: "/routes/abha-to-jizan", label: "Abha to Jizan private transfer" },
      { href: "/airports/king-abdulaziz-jeddah", label: "Arriving at Jeddah airport (JED)" },
      { href: "/locations/jeddah/private-driver", label: "A private driver in Jeddah by the hour" },
    ],
  },
};

export const JEDDAH_INTERCITY_ROUTE_SLUGS = Object.keys(JEDDAH_INTERCITY_ROUTE_PAGES);
