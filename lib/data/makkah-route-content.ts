// Bespoke content for the Makkah corridor route pages (2026-10-08). Overrides
// ROUTE_CONTENT in app/(en)/(marketing)/routes/[slug]/page.tsx for these slugs.
// Every number comes from routeFact() so a route page, the Makkah hub and the
// meta description can never disagree. Business facts: seo/facts.md only
// (fare agreed before booking, free cancellation 24h, cash/bank transfer,
// 15–30 min free waiting, flight tracking, EN/AR drivers, 24/7).
// No Miqat rulings; no unverified driver-training, toll or licence claims.
import { routeFact } from "@/lib/data/cluster";

export interface MakkahRouteContent {
  tldr: string;
  tldrFacts: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
  details: {
    heading: string;
    rows: { label: string; value: string }[];
    factors: { title: string; body: string }[];
  };
}

const FREE_WAIT = "15–30 minutes";
const fact = (s: string) => routeFact(s)!;
const km = (s: string) => `${fact(s).km} km`;
const t = (s: string) => fact(s).time;

const GROUP_VEHICLES = "A sedan suits one to three people with normal luggage. A GMC or full-size SUV, or a Hyundai Staria, suits families with more luggage. A Hiace van or coaster suits larger groups; coaches are arranged on request. We confirm the vehicle against your passenger and luggage count when we quote.";
const RETURN = "Yes. Tell us the return date and time when you book and both legs are quoted together, or add the return later on WhatsApp.";
const QUOTE = "Send pickup, drop-off, date, passengers and luggage by the form or on WhatsApp. We reply with the vehicle and one fixed fare before anything is booked.";

const facts = (slug: string, extra: { label: string; value: string }): MakkahRouteContent["tldrFacts"] => [
  { label: "Distance", value: `~${km(slug)}` },
  { label: "Time", value: t(slug) },
  extra,
  { label: "Fare", value: "Agreed before booking" },
];

export const MAKKAH_ROUTE_CONTENT: Record<string, MakkahRouteContent> = {
  "jeddah-airport-to-makkah": {
    tldr: `A private transfer from King Abdulaziz International Airport (JED) to your Makkah hotel is about ${km("jeddah-airport-to-makkah")} and takes ${t("jeddah-airport-to-makkah")} on a clear road. We track your flight, the driver meets you after baggage claim, and the fare is agreed before you travel. Vehicles range from sedans to SUVs, vans and coasters.`,
    tldrFacts: facts("jeddah-airport-to-makkah", { label: "Flights", value: "We track your flight" }),
    faqs: [
      { question: "Can I travel from Jeddah Airport directly to my Makkah hotel?", answer: `Yes. The driver takes you from your JED terminal to your hotel — about ${km("jeddah-airport-to-makkah")}, ${t("jeddah-airport-to-makkah")} — as close to the entrance as vehicles are permitted. Near Masjid al-Haram that may be the nearest permitted drop-off point at prayer times.` },
      { question: "Where does the driver meet me at Jeddah Airport?", answer: "After baggage claim in the arrivals area of your terminal. JED has Terminal 1, the North Terminal and, in pilgrimage season, the Hajj Terminal. Send your flight number and we confirm the meeting point on WhatsApp before you land." },
      { question: "What happens if my flight is delayed?", answer: `We track your flight, so the pickup moves with it. After you land, the first ${FREE_WAIT} of waiting is free.` },
      { question: "Is the transfer private?", answer: "Yes. The whole car is yours — you share it only with the people in your group. There are no other pickups on the way." },
      { question: "Which vehicle should I choose for my family and luggage?", answer: GROUP_VEHICLES },
      { question: "Can I book the return journey to Jeddah Airport at the same time?", answer: RETURN },
      { question: "Does a Jeddah Airport pickup involve a Miqat stop?", answer: "A pickup in Jeddah does not by itself involve a Miqat stop. Whether a Miqat matters depends on where you travelled from and on your own religious circumstances, which we cannot advise on. If your plans include a stop, tell us when you book." },
      { question: "How do I get a quote?", answer: QUOTE },
    ],
    details: {
      heading: "Jeddah Airport to Makkah route details",
      rows: [
        { label: "Pickup", value: "King Abdulaziz International Airport (JED), arrivals area of your terminal" },
        { label: "Drop-off", value: "Your Makkah hotel, or the nearest permitted point to it" },
        { label: "Distance and time", value: `About ${km("jeddah-airport-to-makkah")}, ${t("jeddah-airport-to-makkah")} on a clear road` },
        { label: "Flight tracking", value: "Yes — the pickup moves with your landing time" },
        { label: "Free waiting", value: `${FREE_WAIT} after landing` },
        { label: "Return leg", value: "Makkah to Jeddah Airport, pickup worked back from your flight" },
      ],
      factors: [
        { title: "Season", body: "Ramadan and peak Umrah weeks slow the Jeddah–Makkah road and the Haram area. Allow extra time on departure days." },
        { title: "Time of day", body: "Night arrivals are quickest on the road; late-afternoon and Friday traffic is slower." },
        { title: "Prayer-time closures", body: "Roads around Masjid al-Haram close at prayer times, which can change where you are dropped." },
        { title: "Luggage", body: "Heavy cases and zamzam on the way home need a bigger vehicle — tell us the number of large bags." },
      ],
    },
  },

  "makkah-to-jeddah-airport": {
    tldr: `A private car from your Makkah hotel to King Abdulaziz International Airport (JED) is about ${km("makkah-to-jeddah-airport")} and takes ${t("makkah-to-jeddah-airport")} on a clear road. We work the pickup time back from your flight, allowing for the season's traffic, and the fare is agreed before you book.`,
    tldrFacts: facts("makkah-to-jeddah-airport", { label: "Pickup", value: "Timed from your flight" }),
    faqs: [
      { question: "How early should I leave Makkah for my flight from Jeddah?", answer: `The drive is about ${t("makkah-to-jeddah-airport")}. We set the pickup from your flight time and add margin for check-in and the season — more in Ramadan and peak Umrah weeks. Tell us your terminal and flight time and we propose the pickup.` },
      { question: "Can the car pick me up at my Makkah hotel?", answer: "Yes. The driver meets you at your hotel or, near Masjid al-Haram at prayer times, at the nearest permitted point and tells you where." },
      { question: "Is it a private car or shared?", answer: "Private. The car is only for your group, with no other pickups." },
      { question: "Which vehicle fits my luggage after Umrah?", answer: GROUP_VEHICLES },
      { question: "Can I book Jeddah Airport pickup for several hotels or groups?", answer: "Yes. Send the hotels, passenger numbers and flight times and we quote one car or several, timed together." },
      { question: "Can I add a stop on the way?", answer: "Yes. A short prayer, meal or luggage stop can be added when you book." },
      { question: "How do I get a quote?", answer: QUOTE },
    ],
    details: {
      heading: "Makkah to Jeddah Airport route details",
      rows: [
        { label: "Pickup", value: "Your Makkah hotel or address; nearest permitted point near the Haram" },
        { label: "Drop-off", value: "Departures area of your JED terminal" },
        { label: "Distance and time", value: `About ${km("makkah-to-jeddah-airport")}, ${t("makkah-to-jeddah-airport")} on a clear road` },
        { label: "Pickup time", value: "Worked back from your flight, with margin for check-in" },
        { label: "Return leg", value: "Jeddah Airport to Makkah for your arrival" },
      ],
      factors: [
        { title: "Check-in margin", body: "International departures need more lead time than domestic. We plan the pickup around your airline's check-in." },
        { title: "Peak Umrah weeks", body: "Traffic and airport queues build sharply in Ramadan and peak weeks. Leave extra margin." },
        { title: "Prayer times", body: "Pickups near the Haram can be delayed by road closures — the driver confirms the meeting point by message." },
        { title: "Luggage", body: "Zamzam and extra cases change the vehicle you need — tell us the count when you book." },
      ],
    },
  },

  "jeddah-to-makkah": {
    tldr: `A private car from any address in Jeddah to Makkah is about ${km("jeddah-to-makkah")} and takes ${t("jeddah-to-makkah")}. Pickup is from your Jeddah hotel or home at any hour, the fare is one fixed price for the whole car, agreed before booking. For flights, book the Jeddah Airport leg instead.`,
    tldrFacts: facts("jeddah-to-makkah", { label: "Pickup", value: "Any Jeddah address" }),
    faqs: [
      { question: "How far is Jeddah city from Makkah?", answer: `About ${km("jeddah-to-makkah")}, around ${t("jeddah-to-makkah")} by road. From King Abdulaziz International Airport it is about ${km("jeddah-airport-to-makkah")}.` },
      { question: "Can you pick me up from my Jeddah hotel?", answer: "Yes. Give us the hotel or address and the driver meets you there at the time you choose, day or night." },
      { question: "Is this the same as the airport transfer?", answer: "No. This page is for pickups inside Jeddah. If you are landing at JED, use the Jeddah Airport to Makkah transfer, where flight tracking and free waiting apply." },
      { question: "Is the car private?", answer: "Yes. The car is only for your group." },
      { question: "Which vehicle should I choose?", answer: GROUP_VEHICLES },
      { question: "Can I book Makkah and back in one day?", answer: "Yes. Book the return together, or hire a private driver for the full day if you have several stops." },
      { question: "Do I need a Miqat stop on the way?", answer: "A pickup in Jeddah does not by itself involve a Miqat stop. Whether a Miqat matters depends on your route and your own religious circumstances, which we cannot advise on. If your plans include one, tell us when you book." },
      { question: "How do I get a quote?", answer: QUOTE },
    ],
    details: {
      heading: "Jeddah to Makkah route details",
      rows: [
        { label: "Pickup", value: "Any hotel or address in Jeddah" },
        { label: "Drop-off", value: "Your Makkah hotel, or the nearest permitted point" },
        { label: "Distance and time", value: `About ${km("jeddah-to-makkah")}, ${t("jeddah-to-makkah")}` },
        { label: "Booking", value: "One fixed fare for the whole car, agreed first" },
        { label: "Return leg", value: "Makkah to Jeddah, any address" },
      ],
      factors: [
        { title: "Where you start in Jeddah", body: "North Jeddah is closer to the airport road; the old town and southern districts add time." },
        { title: "Rush hours", body: "Morning and late-afternoon traffic in Jeddah adds time before the Makkah road opens up." },
        { title: "Ramadan and Umrah peaks", body: "The Makkah approach and Haram area slow down — leave extra time." },
        { title: "Prayer closures", body: "Near the Haram, the driver uses the nearest permitted point at prayer times." },
      ],
    },
  },

  "makkah-to-jeddah": {
    tldr: `A private car from Makkah to any address in Jeddah is about ${km("makkah-to-jeddah")} and takes ${t("makkah-to-jeddah")}. Pickup at your Makkah hotel, drop-off at a Jeddah hotel, the Corniche, Al-Balad or a business address, at a fixed fare agreed before booking. For a flight, book the Makkah to Jeddah Airport leg.`,
    tldrFacts: facts("makkah-to-jeddah", { label: "Drop-off", value: "Any Jeddah address" }),
    faqs: [
      { question: "How far is Makkah from Jeddah by road?", answer: `About ${km("makkah-to-jeddah")}, roughly ${t("makkah-to-jeddah")}. To Jeddah Airport it is about ${km("makkah-to-jeddah-airport")}.` },
      { question: "Can you drop me at a Jeddah hotel or the Corniche?", answer: "Yes. Any hotel, residence, office or sight in Jeddah. Al-Balad's historic core is on foot — the driver drops you at its edge." },
      { question: "Should I book this or the airport transfer?", answer: "If you are flying, book Makkah to Jeddah Airport, which is timed from your flight. This page is for trips to addresses in the city." },
      { question: "Is the car private?", answer: "Yes. The car is only for your group." },
      { question: "Which vehicle should I choose?", answer: GROUP_VEHICLES },
      { question: "Can I book a driver for the whole day instead?", answer: "Yes. If you will visit several places in Jeddah, a private driver by the hour keeps the car waiting at each stop." },
      { question: "How do I get a quote?", answer: QUOTE },
    ],
    details: {
      heading: "Makkah to Jeddah route details",
      rows: [
        { label: "Pickup", value: "Your Makkah hotel; nearest permitted point near the Haram" },
        { label: "Drop-off", value: "Any hotel or address in Jeddah" },
        { label: "Distance and time", value: `About ${km("makkah-to-jeddah")}, ${t("makkah-to-jeddah")}` },
        { label: "Return leg", value: "Jeddah to Makkah, any pickup address" },
      ],
      factors: [
        { title: "Your Jeddah destination", body: "The north is closest to the airport road; the old town and the south take longer." },
        { title: "Time of day", body: "Late-afternoon and Friday traffic is slower on both ends." },
        { title: "Ramadan and peak weeks", body: "Allow extra time leaving the Haram area." },
        { title: "Luggage", body: "Heavy cases need a bigger vehicle — tell us the count when you book." },
      ],
    },
  },

  "makkah-to-madinah": {
    tldr: `A private car from Makkah to Madinah is about ${km("makkah-to-madinah")} — roughly ${t("makkah-to-madinah")} of driving plus the prayer and rest stops you ask for. The car goes hotel to hotel with all your luggage, one fixed fare agreed before booking. The same route is available in reverse.`,
    tldrFacts: facts("makkah-to-madinah", { label: "Stops", value: "Prayer & rest on request" }),
    faqs: [
      { question: "Can I travel privately from Makkah to Madinah?", answer: `Yes. A private car takes your group from your Makkah hotel to your Madinah hotel — about ${km("makkah-to-madinah")}, ${t("makkah-to-madinah")} of driving — with no other pickups.` },
      { question: "How long does it take, and what changes it?", answer: `About ${t("makkah-to-madinah")} of driving. Prayer stops, meals, traffic leaving Makkah and Umrah peaks add time. Tell the driver your preferred stops at the start.` },
      { question: "Can we stop for prayer and rest on the way?", answer: "Yes. Prayer, meal and rest stops can be planned when you book or agreed with the driver along the road." },
      { question: "Taxi, train or bus — which is better for a family?", answer: "A private car is door to door with all luggage in one vehicle and one fare for the group. The Haramain train is fast station to station but needs a transfer at each end and a ticket per person. See the comparison guide for details." },
      { question: "Which vehicle should I choose?", answer: GROUP_VEHICLES },
      { question: "Can I book the return from Madinah to Makkah?", answer: RETURN },
      { question: "Can you drop me at Madinah Airport instead of a hotel?", answer: "Yes. Makkah to Madinah Airport is its own route, with the pickup timed from your flight." },
      { question: "How do I get a quote?", answer: QUOTE },
    ],
    details: {
      heading: "Makkah to Madinah route details",
      rows: [
        { label: "Pickup", value: "Your Makkah hotel; nearest permitted point near the Haram" },
        { label: "Drop-off", value: "Your Madinah hotel, or the nearest permitted point near Masjid an-Nabawi" },
        { label: "Distance and time", value: `About ${km("makkah-to-madinah")}, ${t("makkah-to-madinah")} of driving` },
        { label: "Stops", value: "Prayer, meal and rest stops on request" },
        { label: "Return leg", value: "Madinah to Makkah, same vehicle options" },
      ],
      factors: [
        { title: "Leaving Makkah", body: "Traffic and prayer-time closures near the Haram affect the first stretch." },
        { title: "Stops", body: "Each prayer or meal stop adds time — plan departure around them." },
        { title: "Season", body: "Ramadan and peak Umrah weeks mean heavier traffic at both ends." },
        { title: "Passengers", body: "Elderly travellers and children often need more frequent rest stops; an SUV or van gives more room." },
      ],
    },
  },

  "madinah-to-makkah": {
    tldr: `A private car from Madinah to Makkah is about ${km("madinah-to-makkah")} — roughly ${t("madinah-to-makkah")} of driving plus stops you ask for. Hotel to hotel, all luggage in one vehicle, one fixed fare agreed before booking. Dhul Hulaifah (Abyar Ali) lies on the way out of Madinah; whether a stop there applies to you depends on your own religious circumstances.`,
    tldrFacts: facts("madinah-to-makkah", { label: "Stops", value: "Prayer & rest on request" }),
    faqs: [
      { question: "Can I book a private car from Madinah to Makkah?", answer: `Yes. Pickup at your Madinah hotel, drop-off at your Makkah hotel — about ${km("madinah-to-makkah")}, ${t("madinah-to-makkah")} of driving — with a fixed fare agreed first.` },
      { question: "How long is the drive?", answer: `About ${t("madinah-to-makkah")} of driving. Prayer and meal stops, traffic arriving in Makkah and Umrah peaks add time.` },
      { question: "Can we stop at Dhul Hulaifah (Abyar Ali) on the way?", answer: "Yes, if you want a stop there, tell us when you book and the driver includes it. Whether it applies to you depends on your intentions and religious circumstances, which we cannot advise on." },
      { question: "Which vehicle should I choose for a family with elderly parents?", answer: GROUP_VEHICLES },
      { question: "Can I book from Madinah Airport instead?", answer: "Yes. Madinah Airport to Makkah is its own route, with pickup timed from your landing and flight tracking." },
      { question: "Can I book the Makkah to Madinah leg together?", answer: RETURN },
      { question: "How do I get a quote?", answer: QUOTE },
    ],
    details: {
      heading: "Madinah to Makkah route details",
      rows: [
        { label: "Pickup", value: "Your Madinah hotel; nearest permitted point near Masjid an-Nabawi" },
        { label: "Drop-off", value: "Your Makkah hotel, or the nearest permitted point near the Haram" },
        { label: "Distance and time", value: `About ${km("madinah-to-makkah")}, ${t("madinah-to-makkah")} of driving` },
        { label: "Stops", value: "Prayer, meal and rest stops on request" },
        { label: "Return leg", value: "Makkah to Madinah, same vehicle options" },
      ],
      factors: [
        { title: "Departure time", body: "Leaving after Fajr or in the evening avoids the hottest hours and the heaviest Makkah arrival traffic." },
        { title: "Stops", body: "Each prayer, meal or Miqat stop adds time." },
        { title: "Arriving at the Haram area", body: "Prayer-time road closures can change where you are dropped near your hotel." },
        { title: "Luggage and zamzam", body: "Tell us the number of large cases so the vehicle fits." },
      ],
    },
  },

  "makkah-to-taif": {
    tldr: `A private car from Makkah to Taif is about ${km("makkah-to-taif")} and takes ${t("makkah-to-taif")} up the Al Hada escarpment, or via the gentler Al Sail road on request. Book a one-way transfer, or a day trip with a timed return — the fare is agreed before booking.`,
    tldrFacts: facts("makkah-to-taif", { label: "Road", value: "Al Hada or Al Sail" }),
    faqs: [
      { question: "How far is Taif from Makkah by car?", answer: `About ${km("makkah-to-taif")}, ${t("makkah-to-taif")}. The road climbs from Makkah up to Taif's mountain plateau, so the weather is noticeably cooler at the top.` },
      { question: "Which road does the car take — Al Hada or Al Sail?", answer: "Al Hada is the steeper, more scenic climb; Al Sail Al Kabeer is the gentler alternative. Say which you prefer when you book." },
      { question: "Can I do a day trip from Makkah to Taif and back?", answer: "Yes. Book a transfer with a timed return, or a private driver by the hour so the car waits at each stop in Taif." },
      { question: "Can you take me to a Taif hotel or resort?", answer: "Yes. Give us the hotel or resort and the drop-off is arranged there. There is a separate page for Makkah hotels to Taif resorts." },
      { question: "Which vehicle should I choose?", answer: GROUP_VEHICLES },
      { question: "Can I book the return, Taif to Makkah?", answer: "Yes. Taif to Makkah is booked the same way, from any Taif address or Taif Regional Airport." },
      { question: "How do I get a quote?", answer: QUOTE },
    ],
    details: {
      heading: "Makkah to Taif route details",
      rows: [
        { label: "Pickup", value: "Your Makkah hotel or address" },
        { label: "Drop-off", value: "Any Taif address, hotel, resort or Taif Regional Airport" },
        { label: "Distance and time", value: `About ${km("makkah-to-taif")}, ${t("makkah-to-taif")}` },
        { label: "Roads", value: "Al Hada (steeper, scenic) or Al Sail Al Kabeer (gentler)" },
        { label: "Return leg", value: "Taif to Makkah, or a timed return the same day" },
      ],
      factors: [
        { title: "Mountain road", body: "The climb is slower than a motorway; weather and weekend traffic add time." },
        { title: "Weekends and summer", body: "Taif is a popular summer escape; Thursday and Friday traffic is heavier." },
        { title: "Car sickness", body: "Families with children or elders often prefer the gentler Al Sail road." },
        { title: "Day trips", body: "A timed return or hourly hire keeps the car with you between stops." },
      ],
    },
  },

  "taif-to-makkah": {
    tldr: `A private car from Taif to Makkah is about ${km("taif-to-makkah")} and takes ${t("taif-to-makkah")} down the Al Hada escarpment, or via the Al Sail road on request. Pickup from your Taif hotel, resort or Taif Regional Airport; the fare is agreed before booking.`,
    tldrFacts: facts("taif-to-makkah", { label: "Road", value: "Al Hada or Al Sail" }),
    faqs: [
      { question: "How far is Makkah from Taif?", answer: `About ${km("taif-to-makkah")}, ${t("taif-to-makkah")} by road, descending from the Taif plateau to Makkah.` },
      { question: "Can you pick me up from Taif Regional Airport?", answer: "Yes. Send your flight number and we time the pickup from your landing and track the flight." },
      { question: "Can you collect me from a Taif resort or hotel?", answer: "Yes. Give us the hotel or resort and the driver collects you there." },
      { question: "Which road does the car take?", answer: "Al Hada is the steeper, scenic road; Al Sail Al Kabeer is gentler. Say which you prefer when you book." },
      { question: "Which vehicle should I choose?", answer: GROUP_VEHICLES },
      { question: "Can I continue to Jeddah Airport or Madinah afterwards?", answer: "Yes. Add the next leg when you book and we quote the trips together." },
      { question: "How do I get a quote?", answer: QUOTE },
    ],
    details: {
      heading: "Taif to Makkah route details",
      rows: [
        { label: "Pickup", value: "Any Taif address, hotel, resort or Taif Regional Airport" },
        { label: "Drop-off", value: "Your Makkah hotel, or the nearest permitted point near the Haram" },
        { label: "Distance and time", value: `About ${km("taif-to-makkah")}, ${t("taif-to-makkah")}` },
        { label: "Roads", value: "Al Hada or Al Sail Al Kabeer" },
        { label: "Return leg", value: "Makkah to Taif" },
      ],
      factors: [
        { title: "Descent", body: "The way down is steep on Al Hada; Al Sail is gentler." },
        { title: "Weekend returns", body: "Late Friday and Saturday return traffic to Makkah is heavier." },
        { title: "Haram-area access", body: "Prayer-time closures can change the drop-off point." },
        { title: "Luggage", body: "Tell us the number of large cases so the vehicle fits." },
      ],
    },
  },
};

