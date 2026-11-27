// Cross-border imagery (owner-supplied 2026-10-03, converted to WebP in
// public/cross-border/). Alt text describes what each photo actually shows —
// checked visually (CLAUDE.md §9): e.g. the Petra photo is Ad Deir (the
// Monastery), not the Treasury; AI-generated images (desert highway SUV,
// vehicles) carry no place claims. The owner-supplied "Aqaba waterfront" PNG
// looked like an architectural render, so it is not used.
import type { CorridorSlug } from "./cross-border";

export interface XbImage {
  src: string;
  alt: string;
  altAr: string;
}

const img = (file: string, alt: string, altAr: string): XbImage => ({ src: `/cross-border/${file}`, alt, altAr });

export const CORRIDOR_HERO: Record<CorridorSlug, XbImage> = {
  "saudi-to-bahrain": img("king-fahd-causeway-bahrain.webp", "King Fahd Causeway between Saudi Arabia and Bahrain", "جسر الملك فهد بين السعودية والبحرين"),
  "saudi-to-qatar": img("doha-west-bay-skyline.webp", "West Bay skyline in Doha, Qatar", "أبراج الخليج الغربي في الدوحة، قطر"),
  "saudi-to-kuwait": img("kuwait-towers-city-skyline.webp", "Kuwait Towers and the Kuwait City skyline", "أبراج الكويت وأفق مدينة الكويت"),
  "saudi-to-uae": img("saudi-uae-desert-highway.webp", "SUV on a desert highway at sunset", "سيارة SUV على طريق صحراوي عند الغروب"),
  "saudi-to-jordan": img("gulf-of-aqaba-coast.webp", "Beach and mountains on the Gulf of Aqaba coast", "شاطئ وجبال على ساحل خليج العقبة"),
};

// Route hero = the foreign end of the route (matched on the English city names).
const DESTINATIONS: { match: RegExp; image: XbImage }[] = [
  { match: /Petra/, image: img("petra-ad-deir-monastery.webp", "Ad Deir (the Monastery) at Petra, Jordan", "الدير في البتراء، الأردن") },
  { match: /Wadi Rum/, image: img("wadi-rum-desert.webp", "Red sand and rock mountains in Wadi Rum, Jordan", "الرمال الحمراء والجبال الصخرية في وادي رم، الأردن") },
  { match: /Amman/, image: img("amman-citadel-temple-of-hercules.webp", "Temple of Hercules on the Amman Citadel, Jordan", "معبد هرقل في جبل القلعة، عمّان") },
  { match: /Aqaba/, image: CORRIDOR_HERO["saudi-to-jordan"] },
  { match: /Manama|Bahrain/, image: img("manama-skyline.webp", "Manama skyline with the Bahrain World Trade Center", "أفق المنامة ومركز البحرين التجاري العالمي") },
  { match: /Doha/, image: CORRIDOR_HERO["saudi-to-qatar"] },
  { match: /Kuwait/, image: CORRIDOR_HERO["saudi-to-kuwait"] },
  { match: /Dubai/, image: img("dubai-skyline-sheikh-zayed-road.webp", "Dubai skyline on Sheikh Zayed Road with the Museum of the Future", "أفق دبي على شارع الشيخ زايد ومتحف المستقبل") },
  { match: /Abu Dhabi/, image: img("abu-dhabi-corniche.webp", "Abu Dhabi Corniche beach and skyline", "شاطئ كورنيش أبوظبي وأفق المدينة") },
];

export function routeHeroImage(fromCity: string, toCity: string): XbImage | null {
  const s = `${fromCity} ${toCity}`;
  return DESTINATIONS.find((d) => d.match.test(s))?.image ?? null;
}

// Vehicle-fit thumbnails (AI-generated, generic — no place or brand claims).
export const VEHICLE_IMAGES: Record<string, XbImage> = {
  Sedan: img("executive-sedan-desert-road.webp", "Executive sedan on a desert road", "سيدان تنفيذية على طريق صحراوي"),
  "VIP SUV": img("chauffeur-loading-luggage-suv.webp", "Chauffeur loading luggage into a full-size SUV", "سائق يضع الحقائب في سيارة SUV كبيرة"),
  Van: img("family-van-interior.webp", "Family travelling in a spacious van", "عائلة تسافر في فان واسعة"),
};
