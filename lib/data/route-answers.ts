// Page-specific answers for domestic routes whose Search Console queries
// (28 days to 22 Nov 2026) the generic template did not answer. Added 2026-11-25.
//
// Truth sources:
// - First row of every table = the route's own distance in lib/data/routes.ts.
//   Other rows = OSRM road distance between the named points, measured
//   2026-11-25 and rounded to 5 km.
// - Service facts: seo/facts.md. No prices, visa rules or fixed drive promises.

export interface RouteAnswers {
  heading: string;
  intro: string;
  table?: { caption: string; rows: { label: string; km: number }[] };
  qa: { q: string; a: string }[];
  links: { href: string; label: string }[];
}

export const ROUTE_ANSWERS: Record<string, RouteAnswers> = {
  // Queries: "riyadh to jeddah taxi", "taxi price", "by car how many hours"
  "riyadh-to-jeddah": {
    heading: "Planning Riyadh to Jeddah by car",
    intro:
      "This is a full day on the road across the Kingdom, so the pickup hour matters more than on a short transfer. Most of the drive is open highway; the slow parts are leaving Riyadh and the last stretch past Taif or into Jeddah.",
    table: {
      caption: "Riyadh to Jeddah road distance by pickup and drop-off",
      rows: [
        { label: "Riyadh city to Jeddah city", km: 950 },
        { label: "Riyadh Airport (RUH) to Jeddah Airport (JED)", km: 995 },
      ],
    },
    qa: [
      { q: "What decides the price of a Riyadh to Jeddah taxi?", a: "Vehicle size, one way or return, the exact pickup and drop-off, and any overnight waiting. You receive one written fare on WhatsApp before booking, and it does not change with traffic." },
      { q: "Can one car take a family with Umrah luggage?", a: "Yes. A family SUV or a 7-seat van is the usual choice. Send the passenger and bag count so the vehicle is sized for both." },
      { q: "Can the same car continue to Makkah?", a: "Yes, but Makkah is closer from Riyadh than Jeddah is, so going to Makkah first is normally the shorter plan. Tell us if you are performing Umrah so the Miqat stop is planned." },
    ],
    links: [
      { href: "/routes/jeddah-to-riyadh", label: "Return leg: Jeddah to Riyadh" },
      { href: "/locations/jeddah/private-driver", label: "Keep a driver by the hour in Jeddah" },
      { href: "/locations/riyadh/private-driver", label: "Hourly private driver in Riyadh" },
    ],
  },

  // Queries: "jeddah to riyadh taxi" (60 impr, 0 clicks), "taxi number", "by land"
  "jeddah-to-riyadh": {
    heading: "Booking a car from Jeddah to Riyadh",
    intro:
      "The road climbs away from the Red Sea coast past Taif before the long, flat run east to Riyadh. Pickups in north Jeddah and at the airport add city driving before the highway starts.",
    table: {
      caption: "Jeddah to Riyadh road distance by pickup and drop-off",
      rows: [
        { label: "Jeddah city to Riyadh city", km: 950 },
        { label: "Jeddah Airport (JED) to Riyadh Airport (RUH)", km: 995 },
      ],
    },
    qa: [
      { q: "How do I reach someone for a Jeddah to Riyadh taxi?", a: "Use the quote form or the WhatsApp button on this page. Send the pickup location, date and time, passengers and bags, and you get a written fare to confirm." },
      { q: "Can I travel overnight from Jeddah to Riyadh?", a: "Yes, pickups are available 24/7. On a drive this long the driver needs rest stops, so agree the departure hour and planned breaks when you book." },
      { q: "Do you collect from Jeddah hotels, the Corniche and the airport?", a: "Yes. Any Jeddah address, hotel or airport terminal can be the pickup. For a flight, send the flight number with the request." },
    ],
    links: [
      { href: "/routes/riyadh-to-jeddah", label: "Opposite direction: Riyadh to Jeddah" },
      { href: "/locations/jeddah/corniche", label: "Pickups on Jeddah Corniche" },
      { href: "/locations/riyadh/olaya", label: "Arriving in Olaya, Riyadh" },
    ],
  },

  // Queries: "jeddah to abha distance by road" (68), "abha to jeddah distance", "jeddah airport to abha airport distance"
  "jeddah-to-abha": {
    heading: "How far is Abha from Jeddah by road?",
    intro:
      "The answer depends on which end of Jeddah you leave from and whether you stop in Abha, at its airport or in Khamis Mushait. The last part climbs into the Asir highlands, so it is slower than the coastal highway.",
    table: {
      caption: "Jeddah to Abha road distance by point",
      rows: [
        { label: "Jeddah city to Abha", km: 690 },
        { label: "Jeddah Airport (JED) to Abha", km: 700 },
        { label: "Jeddah to Khamis Mushait", km: 705 },
        { label: "Jeddah Airport (JED) to Abha Airport (AHB)", km: 715 },
      ],
    },
    qa: [
      { q: "Is the Abha to Jeddah distance the same in the other direction?", a: "Yes, practically. Abha to Jeddah is also about 690 km by road; only the exact pickup and drop-off change the figure slightly." },
      { q: "Should I drive to Abha in daylight?", a: "A morning start is the comfortable choice, because it puts the mountain section in daylight. Fog and rain can slow the Asir roads, so leave margin if you have a fixed appointment." },
      { q: "Which vehicle suits the Asir mountains?", a: "A sedan handles the main highway. Families with luggage, or anyone continuing to mountain viewpoints, usually prefer a full-size SUV." },
    ],
    links: [
      { href: "/routes/abha-to-jizan", label: "Continue from Abha to Jizan" },
      { href: "/routes/abha-to-jeddah", label: "Abha to Jeddah transfer" },
      { href: "/locations/jizan", label: "Private cars in Jizan" },
    ],
  },

  // Queries: "jeddah to yanbu distance by road" (64), "jeddah airport to yanbu distance", "yanbu to jeddah distance by car"
  "jeddah-to-yanbu": {
    heading: "Jeddah to Yanbu distance by road",
    intro:
      "Yanbu is two places for a driver: the old port city, Yanbu Al-Bahr, and Yanbu Industrial City to its south. Coming from Jeddah you reach the industrial city first, so name the right one when you book.",
    table: {
      caption: "Jeddah to Yanbu road distance by point",
      rows: [
        { label: "Jeddah city to Yanbu Al-Bahr", km: 330 },
        { label: "Jeddah Airport (JED) to Yanbu Al-Bahr", km: 325 },
        { label: "Jeddah city to Yanbu Industrial City", km: 320 },
        { label: "Jeddah Airport (JED) to Yanbu Industrial City", km: 310 },
      ],
    },
    qa: [
      { q: "Why is Jeddah Airport closer to Yanbu than the city?", a: "King Abdulaziz International Airport sits on the north side of Jeddah, on the Yanbu side, so an airport pickup skips the drive across the city." },
      { q: "How far is Yanbu to Jeddah by car?", a: "About 330 km from Yanbu Al-Bahr to Jeddah city, the same coastal highway in reverse. For a flight from JED, plan the pickup around check-in, not departure." },
      { q: "Can you collect a work crew for the industrial city?", a: "Yes. Vans and larger vehicles are arranged through partner operators. Send the headcount, gate or camp name and shift time for a written quote." },
    ],
    links: [
      { href: "/routes/makkah-to-yanbu", label: "Makkah to Yanbu by private car" },
      { href: "/routes/madinah-to-yanbu", label: "Madinah to Yanbu" },
      { href: "/services/group-transport", label: "Crew vans and group transport" },
    ],
  },

  // Queries: "madinah to alula distance" (26), "madina to alula distance" (22), "al ula to madinah distance"
  "madinah-to-alula": {
    heading: "Madinah to AlUla distance, city and airport",
    intro:
      "People ask this with two different starting points: a hotel near the Prophet's Mosque, or the arrivals hall at Madinah Airport. The destination matters too, because AlUla Airport lies outside the old town.",
    table: {
      caption: "Madinah to AlUla road distance by point",
      rows: [
        { label: "Madinah city to AlUla", km: 330 },
        { label: "Madinah Airport (MED) to AlUla", km: 350 },
        { label: "Madinah Airport (MED) to AlUla Airport (ULH)", km: 335 },
      ],
    },
    qa: [
      { q: "Is AlUla to Madinah the same distance?", a: "Yes, about 330 km between the two cities in either direction." },
      { q: "Can I visit AlUla from Madinah as a day trip?", a: "It is possible with an early start and a car that waits, but it is a long day. Hegra is visited on booked tours, so fix the tour time first and plan the pickup backwards from it." },
      { q: "Does the car wait in AlUla or is it one way?", a: "Both can be arranged. A one-way drop suits travellers staying overnight; a round trip with waiting is quoted as one fare." },
    ],
    links: [
      { href: "/routes/alula-to-madinah", label: "AlUla back to Madinah" },
      { href: "/routes/alula-to-neom", label: "Onward from AlUla to NEOM" },
      { href: "/locations/madinah/private-driver", label: "Private driver in Madinah" },
    ],
  },

  // Crawled, not indexed. 832 km OSRM vs 840 in routes.ts — same figure rounded.
  "madinah-to-riyadh": {
    heading: "Who takes a car from Madinah to Riyadh?",
    intro:
      "It suits families going home after Ziyarah, pilgrims flying out of Riyadh, and groups with a lot of luggage. The road runs east through the Qassim region before turning down to the capital.",
    table: {
      caption: "Madinah to Riyadh road distance",
      rows: [{ label: "Madinah city to Riyadh city", km: 840 }],
    },
    qa: [
      { q: "Is there a natural halfway stop between Madinah and Riyadh?", a: "The Qassim region, around Buraydah, is the usual place for a longer meal or prayer break. Ask for the stop when you book so it is included in the plan." },
      { q: "Should I fly instead?", a: "For one or two people with light bags, flying is quicker. A car is simpler for larger families, elderly travellers who want one seat from hotel to home, or heavy luggage." },
      { q: "Can you drop me at King Khalid International Airport?", a: "Yes. Share the flight time and choose a departure from Madinah with a wide margin, since this is a long road day before a flight." },
    ],
    links: [
      { href: "/routes/riyadh-to-madinah", label: "Riyadh to Madinah" },
      { href: "/routes/riyadh-to-al-qassim-airport", label: "Riyadh and Al Qassim Airport" },
      { href: "/locations/madinah/private-driver", label: "Ziyarah by private car in Madinah" },
    ],
  },

  // Crawled, not indexed.
  "riyadh-to-alahsa": {
    heading: "Riyadh to Al Ahsa: Hofuf, the oasis or the Qatar road?",
    intro:
      "Al Ahsa is both a destination and a junction. Some passengers stop in Hofuf or Al Mubarraz; others break the journey here before the Salwa border and Doha. Tell us which, because it changes the drop-off and the plan.",
    table: {
      caption: "Riyadh to Al Ahsa road distance",
      rows: [{ label: "Riyadh city to Hofuf (Al Ahsa)", km: 330 }],
    },
    qa: [
      { q: "Is Hofuf the same place as Al Ahsa?", a: "Hofuf is the main city inside the Al Ahsa governorate. Al Mubarraz and the oasis villages are separate stops, so send a map pin for the exact address." },
      { q: "Can I do Riyadh to Al Ahsa and back in one day?", a: "Yes. A return car that waits works well for Jabal Al Qarah, the old souq area and the palm groves. Give the hours you want on the ground so waiting is in the quote." },
      { q: "Can the same car continue to Doha?", a: "Yes, through the Salwa border. Book it as Riyadh to Doha with an Al Ahsa stop; each passenger presents their own passport and entry documents." },
    ],
    links: [
      { href: "/routes/alahsa-to-doha", label: "Al Ahsa to Doha" },
      { href: "/routes/riyadh-to-doha", label: "Riyadh to Doha in one trip" },
      { href: "/cross-border/saudi-to-qatar", label: "How the Qatar road works" },
    ],
  },

  // Discovered, not indexed. Distance from routes.ts only.
  "makkah-to-yanbu": {
    heading: "Makkah to Yanbu without going through Madinah",
    intro:
      "The direct road goes west towards the coast and then north beside the Red Sea, passing the Jeddah area on the way. It suits residents of Yanbu returning after Umrah and families adding beach days to a pilgrimage.",
    qa: [
      { q: "Can we stop in Jeddah on the way to Yanbu?", a: "Yes. Jeddah is on the way to the coastal highway, so a meal stop or a short visit can be added. Mention it in the request so it is priced once." },
      { q: "Can we go Makkah to Yanbu and then on to Madinah?", a: "Yes. Yanbu to Madinah is a common second leg. Booking both legs together lets you keep one plan for luggage and timing." },
      { q: "Where in Yanbu do you drop off?", a: "Yanbu Al-Bahr, Yanbu Industrial City, hotels on the coast or the airport. The city and the industrial area are apart, so send a pin." },
    ],
    links: [
      { href: "/routes/jeddah-to-yanbu", label: "Jeddah to Yanbu distance and car" },
      { href: "/routes/madinah-to-yanbu", label: "Madinah to Yanbu" },
      { href: "/locations/makkah/private-driver", label: "Private driver in Makkah" },
    ],
  },
  // Queries (3 months): "riyadh to khobar distance" 150, "khobar to riyadh distance" 95, "riyadh to khobar by car".
  "riyadh-to-alkhobar": {
    heading: "Riyadh to Khobar by car: what changes the trip",
    intro:
      "Riyadh and Al Khobar are about 400 km apart in either direction. The highway part is steady; the time you lose or gain is at the two ends, crossing Riyadh to reach the eastern exit and reaching the right side of the Khobar, Dhahran and Dammam area.",
    qa: [
      { q: "Is the Khobar to Riyadh distance the same?", a: "Yes, about 400 km. The return follows the same highway west, so only your exact addresses change the figure." },
      { q: "Can the same car go on from Khobar to Bahrain?", a: "Yes. Al Khobar is where the King Fahd Causeway starts, so a through booking from Riyadh to Bahrain avoids changing cars. The causeway toll for the vehicle is included in the fare." },
      { q: "Is a same-day return from Khobar possible?", a: "Yes, for a meeting day. Book the car with waiting so the driver and vehicle stay with you, and give the meeting address and finish time." },
    ],
    links: [
      { href: "/routes/alkhobar-to-riyadh", label: "Khobar back to Riyadh" },
      { href: "/routes/riyadh-to-manama", label: "Riyadh through to Bahrain" },
      { href: "/locations/dammam/private-driver", label: "Private driver in Dammam and Khobar" },
    ],
  },

  // Queries: "jubail to dammam airport" 53, "taxi price" 26, "jubail to dammam" 20. Page had no bespoke content.
  "jubail-to-dammam-airport": {
    heading: "Jubail to Dammam Airport (DMM) by private car",
    intro:
      "King Fahd International Airport lies between Jubail and Dammam, so you do not drive into Dammam first. Jubail city and Jubail Industrial City are separate pickup areas with different distances, and gate procedures can take longer than the road.",
    table: {
      caption: "Jubail to King Fahd International Airport road distance",
      rows: [
        { label: "Jubail Industrial City to DMM", km: 90 },
        { label: "Jubail city to DMM", km: 80 },
      ],
    },
    qa: [
      { q: "How is the Jubail to Dammam Airport taxi price set?", a: "By vehicle size, the exact pickup point and any waiting. Send them on WhatsApp with the flight time and you receive one written fare before booking, with no meter." },
      { q: "When should I leave Jubail for a flight?", a: "Work back from your airline's check-in time, then add the drive and a margin for shift traffic around the industrial city. Share the flight number and we suggest a pickup time." },
      { q: "Can you collect a crew from a camp or plant gate?", a: "Yes, with vans or a coaster through partner operators. Send the company, gate or camp name, headcount and bags. Site access is arranged by your host." },
      { q: "Do you also drive Jubail to Dammam city or Khobar?", a: "Yes. Those are separate city trips rather than airport transfers; name the drop-off address in the request and the fare follows it." },
    ],
    links: [
      { href: "/routes/dammam-airport-to-jubail", label: "Arriving: Dammam Airport to Jubail" },
      { href: "/locations/jubail", label: "Private cars in Jubail" },
      { href: "/routes/jubail-to-kuwait", label: "Jubail to Kuwait City" },
    ],
  },

  // Queries: "dammam airport to jubail taxi fare" 16; discovered, not indexed.
  "dammam-airport-to-jubail": {
    heading: "Landing at DMM for Jubail",
    intro:
      "The drop-off needs more detail here than the road does. Jubail city, the Royal Commission residential areas and the industrial plants are different destinations, so put the building or gate in the booking.",
    qa: [
      { q: "Does the driver go to Jubail directly from the terminal?", a: "Yes. The driver meets you at arrivals and leaves north for Jubail without going through Dammam city." },
      { q: "What happens if several colleagues land on different flights?", a: "Send all the flight numbers. The plan is either one van that waits for the last arrival or separate cars; both are quoted so the company can choose." },
    ],
    links: [
      { href: "/routes/jubail-to-dammam-airport", label: "Departing: Jubail to DMM" },
      { href: "/airports/king-fahd-dammam", label: "Dammam Airport pickups" },
    ],
  },


  // Queries: "madina to tabuk distance" 58, "madinah to tabuk distance" 31. No figures here:
  // public sources give 623-626 km (routes.ts 620), routing engines 688.
  "madinah-to-tabuk": {
    heading: "Madinah to Tabuk: one long drive or a stop in AlUla?",
    intro:
      "The direct road north is a long single day. Travellers with time often break it at AlUla, which turns the transfer into a two-day trip with Hegra in the middle.",
    qa: [
      { q: "Can we visit AlUla between Madinah and Tabuk?", a: "Yes, with an overnight stay in AlUla and a second leg the next day. Both legs can be quoted together; book your Hegra visit time first." },
      { q: "Can the trip continue into Jordan?", a: "Yes. From Tabuk the road goes to Halat Ammar for Petra and Amman, or to Haql for Aqaba. Each passenger needs their own travel documents; we do not arrange visas." },
      { q: "Where in Tabuk do you drop off?", a: "Any hotel, home, company site or Tabuk Airport (TUU). For NEOM, name the site, because it is a separate drive beyond the city." },
    ],
    links: [
      { href: "/routes/madinah-to-alula", label: "First leg: Madinah to AlUla" },
      { href: "/routes/tabuk-to-aqaba", label: "Onward: Tabuk to Aqaba" },
      { href: "/routes/medinah-to-amman", label: "Madinah to Amman by road" },
    ],
  },

  // Query: "tabuk to red sea distance" 11. Page had no bespoke content.
  "tabuk-to-red-sea-airport": {
    heading: "Tabuk to the Red Sea resorts",
    intro:
      "Red Sea International Airport (RSI) is on the coast well south of Tabuk, so this is an intercity drive rather than a local airport run. It suits travellers combining Tabuk or Jordan with a Red Sea stay.",
    qa: [
      { q: "Is Red Sea Airport near Tabuk?", a: "No. They share the same region on the map, but the airport is several hours by road from Tabuk city. Check which airport your ticket uses before booking a car." },
      { q: "Can you take me directly to a resort instead of the airport?", a: "Give the resort name. Some resorts are reached by road and others need the resort's own boat or transfer, so the drop-off point is confirmed with you first." },
    ],
    links: [
      { href: "/airports/red-sea", label: "Red Sea Airport (RSI) transfers" },
      { href: "/locations/tabuk", label: "Private cars in Tabuk" },
    ],
  },
};

// Pages Search Console reported as "Discovered / Crawled - currently not
// indexed" (16 Nov 2026) that share a city with many indexed routes. RouteRelatedLinks adds up
// to three matching ones, so they get contextual links instead of only the hub list.
export const UNDERLINKED_ROUTES: { slug: string; match: string[] }[] = [
  { slug: "madinah-to-riyadh", match: ["madinah", "riyadh"] },
  { slug: "riyadh-to-alahsa", match: ["riyadh", "ahsa", "hofuf"] },
  { slug: "makkah-to-yanbu", match: ["yanbu", "makkah"] },
  { slug: "jeddah-to-neom", match: ["neom", "jeddah"] },
  { slug: "abha-to-jizan", match: ["abha", "jizan", "jazan"] },
  { slug: "alula-to-neom", match: ["alula", "neom"] },
  { slug: "amman-to-tabuk", match: ["tabuk", "amman"] },
  { slug: "amman-to-neom", match: ["neom", "amman"] },
  { slug: "amman-to-alula", match: ["alula", "amman"] },
  { slug: "medinah-to-amman", match: ["madinah", "amman"] },
  { slug: "dammam-airport-to-jubail", match: ["jubail", "dammam"] },
  { slug: "bahrain-to-dammam-airport", match: ["dammam", "khobar"] },
  { slug: "jeddah-airport-to-makkah-clock-tower", match: ["jeddah airport"] },
];

export const PRIVATE_DRIVER_CITIES: [string, string][] = [
  ["riyadh", "Riyadh"],
  ["jeddah", "Jeddah"],
  ["makkah", "Makkah"],
  ["madinah", "Madinah"],
  ["dammam", "Dammam"],
];
