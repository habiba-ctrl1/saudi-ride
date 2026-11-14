// Per-city copy for the GMC Yukon XL / Denali block and the corporate RFQ block
// on the Jeddah / Makkah / Madinah hubs. Bespoke by city (CLAUDE.md §16: no
// find-replace). Model naming follows seo/facts.md: "GMC Yukon XL / Denali" is
// the confirmed fleet entry — no model years, trims, capacities or prices here.
// {{TODO}} model years / trims / confirmed capacity: partner to confirm.

export type GmcCity = "jeddah" | "makkah" | "madinah";

export interface GmcCityCopy {
  city: string;
  path: string;
  heading: string;
  intro: string;
  useCases: { title: string; text: string }[];
  alternative: string;
  links: { href: string; label: string }[];
  waPrefill: string;
}

const prefill = (city: string, from: string) =>
  `Hello Taxi Saudi Arabia, I would like a quotation for a premium GMC chauffeur service.\nCity: ${city}\n• From: ${from}\n• To: \n• Date & time: \n• Passengers & luggage: \n• Trip type (one-way / return): \n• Booking type (corporate / individual): \nPlease confirm the available GMC models, the total quotation and the booking terms.`;

export const GMC_CITY_COPY: Record<GmcCity, GmcCityCopy> = {
  jeddah: {
    city: "Jeddah",
    path: "/locations/jeddah",
    heading: "GMC Yukon XL / Denali with a chauffeur in Jeddah",
    intro:
      "A GMC Yukon XL / Denali is the full-size SUV option for visitors who want more cabin space than an executive sedan — arrivals at King Abdulaziz International Airport, hotel-to-meeting days and the drive on to Makkah or Madinah. It is a private vehicle with a professional chauffeur, arranged through our partner network. Availability is confirmed per date when we quote.",
    useCases: [
      { title: "Executive arrivals at JED", text: "A visiting executive with luggage and a first meeting the same day: pickup at arrivals, straight to the hotel or office." },
      { title: "Family and VIP groups", text: "Parties who would otherwise split into two sedans can often travel together in one full-size SUV — tell us passengers and large bags and we confirm the fit." },
      { title: "Jeddah to Makkah or Madinah", text: "A private SUV for the corridor, with one driver and one fixed fare agreed before you book." },
      { title: "KAEC and port business trips", text: "Day trips to King Abdullah Economic City for site visits or meetings, quoted as a single journey or by the hour." },
    ],
    alternative:
      "Seven or more passengers, or a lot of luggage, may not fit one SUV. In that case we quote a van or coaster, or two vehicles — the right choice is confirmed against your party, not assumed.",
    links: [
      { href: "/fleet/gmc-yukon-xl", label: "GMC Yukon XL / Denali details" },
      { href: "/airports/king-abdulaziz-jeddah", label: "King Abdulaziz Airport transfers" },
      { href: "/routes/jeddah-airport-to-makkah", label: "Jeddah Airport to Makkah" },
      { href: "/routes/jeddah-to-madinah", label: "Jeddah to Madinah" },
    ],
    waPrefill: prefill("Jeddah", "King Abdulaziz Airport (JED) / hotel / address"),
  },
  makkah: {
    city: "Makkah",
    path: "/locations/makkah",
    heading: "GMC Yukon XL / Denali for Umrah families and VIP guests in Makkah",
    intro:
      "Umrah families and senior guests often travel with more luggage than a sedan carries. A GMC Yukon XL / Denali gives one private cabin for the whole party on the Jeddah-to-Makkah leg, hotel-to-hotel moves and the road on to Madinah. It is arranged with a professional chauffeur through our partner network and confirmed per date.",
    useCases: [
      { title: "Jeddah Airport to your Makkah hotel", text: "Arrivals pickup and a direct private transfer, with a Miqat stop on request, confirmed in the quote." },
      { title: "Family and elder-friendly travel", text: "Cabin space and room for bags matter on a long Umrah day; the SUV suits parties who want to stay together." },
      { title: "Business visitors and corporate guests", text: "Executives combining Umrah with meetings in Jeddah or Madinah, on one itinerary and one point of contact." },
      { title: "Makkah to Madinah", text: "A private SUV for the intercity leg, with the Ziyarat stops you want planned ahead." },
    ],
    alternative:
      "Access near the Haram is controlled and changes with the season and the day, so the exact drop-off point depends on your hotel and the restrictions in force — we do not promise that any vehicle can reach a given gate. Larger groups are better in a van or coaster; we confirm both the vehicle and the practical drop-off when we quote.",
    links: [
      { href: "/fleet/gmc-yukon-xl", label: "GMC Yukon XL / Denali details" },
      { href: "/routes/jeddah-airport-to-makkah", label: "Jeddah Airport to Makkah" },
      { href: "/routes/makkah-to-madinah", label: "Makkah to Madinah" },
      { href: "/services/makkah-ziyarat", label: "Makkah Ziyarat transport" },
    ],
    waPrefill: prefill("Makkah", "Jeddah Airport (JED) / Makkah hotel"),
  },
  madinah: {
    city: "Madinah",
    path: "/locations/madinah",
    heading: "GMC Yukon XL / Denali with a chauffeur in Madinah",
    intro:
      "For arrivals at Prince Mohammad bin Abdulaziz International Airport, hotel moves around the Prophet's Mosque and private Ziyarat days, a GMC Yukon XL / Denali gives families and senior guests a single private cabin. It is arranged with a professional chauffeur through our partner network; availability is confirmed for your date when we quote.",
    useCases: [
      { title: "MED airport arrivals", text: "Pickup at arrivals and a private transfer to your hotel, with flight tracking so a delay does not leave you without a driver." },
      { title: "Ziyarat with family", text: "A private SUV for Quba, Uhud and the other sites on your list, timed around prayer and set before the day starts." },
      { title: "Corporate and delegation guests", text: "Executives and guests moving between hotel, meetings and the airport, with a written quote on request." },
      { title: "Madinah to Makkah", text: "The intercity leg in one private vehicle, at a fare agreed before you book." },
    ],
    alternative:
      "Streets near the Prophet's Mosque have restricted access, so the pickup and drop-off point depends on your hotel and the controls in force that day. Larger groups or heavy luggage may need a van or coaster instead of an SUV; we confirm the vehicle against your party.",
    links: [
      { href: "/fleet/gmc-yukon-xl", label: "GMC Yukon XL / Denali details" },
      { href: "/airports/prince-mohammad-madinah", label: "Madinah Airport transfers" },
      { href: "/routes/madinah-to-makkah", label: "Madinah to Makkah" },
      { href: "/services/madinah-ziyarat", label: "Madinah Ziyarat transport" },
    ],
    waPrefill: prefill("Madinah", "Madinah Airport (MED) / hotel"),
  },
};

export const GMC_QUOTE_FACTORS = [
  "Pickup and drop-off locations",
  "Date and pickup time",
  "Passengers and luggage",
  "One-way, return or by the hour",
  "Waiting time and extra stops",
  "Partner availability for your date",
];
