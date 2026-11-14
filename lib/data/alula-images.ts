// AlUla cluster imagery (added 2026-10-08). One place for src, size and alt so
// EN and AR pages describe each photo identically (CLAUDE.md §9: alt text must
// describe what the image actually shows — no venue named unless the photo shows it).
// Files live in public/locations/alula/. "illustration" = AI-generated image;
// its alt says so, and it must not be presented as a documentary photo.
export interface AlulaImage {
  src: string;
  w: number;
  h: number;
  alt: string;
  altAr: string;
  caption?: string;
  captionAr?: string;
  illustration?: boolean;
}

const D = "/locations/alula";

export const ALULA_IMG = {
  hubHero: { src: `${D}/alula-sandstone-road-hero.webp`, w: 1920, h: 1282, alt: "A paved road winding between towering sandstone rock formations and pale desert sand near AlUla", altAr: "طريق معبّد يلتف بين تكوينات صخرية رملية شاهقة ورمال صحراوية فاتحة قرب العلا" },
  og: { src: `${D}/alula-og-sandstone-road.webp`, w: 1200, h: 630, alt: "A paved road winding between sandstone rock formations near AlUla", altAr: "طريق معبّد بين تكوينات صخرية رملية قرب العلا" },
  hegra: { src: `${D}/hegra-qasr-al-farid.webp`, w: 1080, h: 1350, alt: "Qasr al-Farid, a monumental tomb carved into a freestanding sandstone outcrop at Hegra, with a visitor standing on the rock below for scale", altAr: "قصر الفريد، مقبرة ضخمة منحوتة في صخرة رملية قائمة بذاتها في الحِجر، ويظهر زائر واقف أسفلها لبيان الحجم" },
  maraya: { src: `${D}/maraya-mirrored-facade.webp`, w: 1640, h: 1094, alt: "The mirrored façade of Maraya concert hall reflecting the sun and the sandstone canyon walls around it", altAr: "واجهة قاعة مرايا المغطاة بالمرايا تعكس الشمس وجدران الوادي الرملية من حولها" },
  elephantRock: { src: `${D}/elephant-rock-dusk.webp`, w: 1600, h: 1068, alt: "Elephant Rock (Jabal AlFil), a sandstone formation with a natural arch, lit at dusk above a wooden walkway with low lights", altAr: "جبل الفيل، تكوين صخري رملي بقوس طبيعي، مضاء عند الغسق فوق ممر خشبي بإضاءة منخفضة" },
  privateDriver: { src: `${D}/private-driver-suv-heritage-car-park.webp`, w: 1376, h: 768, alt: "Illustration: a traveller opening the rear door of a white full-size SUV at a heritage-site car park in AlUla, with sandstone cliffs behind", altAr: "صورة توضيحية: مسافر يفتح الباب الخلفي لسيارة دفع رباعي بيضاء كبيرة في موقف أحد المواقع التراثية بالعلا، وخلفها منحدرات رملية", illustration: true },
  airport: { src: `${D}/alula-airport-terminal-aerial.webp`, w: 1476, h: 828, alt: "Aerial view of the AlUla airport terminal and forecourt in the desert, with mountains in the distance", altAr: "منظر جوي لمبنى مطار العلا والساحة الأمامية في الصحراء وخلفهما جبال", },
  oldTown: { src: `${D}/alula-old-town-lane.webp`, w: 904, h: 1356, alt: "A shaded lane between stone-and-mudbrick walls in AlUla Old Town, roofed with wooden beams and hanging lamps", altAr: "زقاق ظليل بين جدران من الحجر والطوب اللبن في البلدة القديمة بالعلا مسقوف بعوارض خشبية ومصابيح معلقة" },
  stay: { src: `${D}/ashar-valley-desert-camp-lounge.webp`, w: 1094, h: 730, alt: "An open-sided desert camp lounge with rugs, cushions and low seating facing sandstone cliffs", altAr: "صالة مخيم صحراوي مفتوحة الجوانب بسجاد ووسائد ومقاعد منخفضة تطل على منحدرات رملية" },
  redSea: { src: `${D}/red-sea-island-aerial-rendering.webp`, w: 1024, h: 640, alt: "Aerial rendering of a Red Sea island resort with beaches, lagoons and villas among turquoise water", altAr: "تصوير جوي مُنفَّذ بالحاسوب لمنتجع جزيري على البحر الأحمر بشواطئ ولاجونات وفلل وسط مياه فيروزية", caption: "Rendering of a Red Sea resort island — a separate destination from AlUla.", captionAr: "تصوير حاسوبي لجزيرة منتجعات على البحر الأحمر — وجهة منفصلة عن العلا.", illustration: true },
  road: { src: `${D}/alula-red-sea-neom-road-sign.webp`, w: 1376, h: 768, alt: "Illustration: a long straight highway through the desert with a road sign pointing to AlUla and to the Red Sea / NEOM", altAr: "صورة توضيحية: طريق سريع مستقيم طويل عبر الصحراء وعليه لوحة تشير إلى العلا وإلى البحر الأحمر / نيوم", caption: "Illustration of the long desert road between AlUla and the Red Sea coast.", captionAr: "صورة توضيحية للطريق الصحراوي الطويل بين العلا وساحل البحر الأحمر.", illustration: true },
} satisfies Record<string, AlulaImage>;
