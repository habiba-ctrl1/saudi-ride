// Estimated "from" fares shown on public route pages. SINGLE SOURCE — pages must
// not hardcode SAR numbers. Every figure comes from data/pricing-book.md (quotes
// given to clients / owner-set rates) and was approved by the owner on 2026-11-24.
// Never add a row without a real quote and owner approval. Routes not listed here
// keep "confirmed on WhatsApp".
type VehicleKey = "sedan" | "van" | "suv" | "suvOrVan" | "any";

export interface RouteFromPrice {
  sar: number;
  vehicle: VehicleKey;
  /** Condition the quote was based on, when it differs from the page's plain route. */
  noteEn?: string;
  noteAr?: string;
}

const CHECKED_EN = "November 2026";
const CHECKED_AR = "نوفمبر 2026";

const VEHICLE: Record<VehicleKey, { en: string; ar: string }> = {
  sedan: { en: "sedan", ar: "سيارة سيدان" },
  van: { en: "van", ar: "فان" },
  suv: { en: "full-size SUV", ar: "SUV كبيرة" },
  suvOrVan: { en: "SUV or van", ar: "SUV أو فان" },
  any: { en: "", ar: "" },
};

export const ROUTE_FROM_PRICES: Record<string, RouteFromPrice> = {
  "jeddah-airport-to-makkah": { sar: 350, vehicle: "sedan" },
  "jeddah-airport-to-swissotel-makkah": { sar: 350, vehicle: "sedan" },
  "jeddah-airport-to-makkah-clock-tower": { sar: 350, vehicle: "sedan" },
  "makkah-to-madinah": { sar: 450, vehicle: "sedan" },
  "makkah-to-jeddah-airport": { sar: 250, vehicle: "sedan" },
  "jeddah-to-yanbu": { sar: 700, vehicle: "van", noteEn: "based on a Jeddah Airport pickup", noteAr: "على أساس الاستقبال من مطار جدة" },
  "tabuk-airport-to-neom": { sar: 500, vehicle: "sedan", noteEn: "based on drop-off at NEOM Bay Airport", noteAr: "على أساس الوصول إلى مطار خليج نيوم" },
  "alula-airport-to-banyan-tree": { sar: 300, vehicle: "sedan" },
  "riyadh-to-dammam": { sar: 600, vehicle: "sedan" },
  "riyadh-to-makkah": { sar: 1700, vehicle: "van" },
  "jeddah-to-riyadh": { sar: 1500, vehicle: "van" },
  "madinah-to-riyadh": { sar: 1100, vehicle: "sedan" },
  "dammam-to-makkah": { sar: 1550, vehicle: "sedan", noteEn: "based on a Dhahran pickup", noteAr: "على أساس الانطلاق من الظهران" },
  "riyadh-to-manama": { sar: 850, vehicle: "sedan" },
  "alkhobar-to-manama": { sar: 350, vehicle: "sedan" },
  "dammam-to-doha": { sar: 1350, vehicle: "sedan" },
  "dammam-airport-to-doha": { sar: 1200, vehicle: "sedan" },
  "alkhobar-to-doha": { sar: 1300, vehicle: "any" },
  "doha-to-dammam": { sar: 1200, vehicle: "van" },
  "dammam-to-dubai": { sar: 2800, vehicle: "sedan" },
  "dubai-to-riyadh": { sar: 4500, vehicle: "suv", noteEn: "with a change of vehicle on the way", noteAr: "مع تبديل السيارة في الطريق" },
  "aqaba-to-tabuk": { sar: 1000, vehicle: "suv" },
  "jubail-to-dammam-airport": { sar: 370, vehicle: "suvOrVan" },
};

export function routeFromPriceText(slug: string, ar = false) {
  const p = ROUTE_FROM_PRICES[slug];
  if (!p) return null;
  const n = p.sar.toLocaleString("en-US");
  const note = ar ? p.noteAr : p.noteEn;
  const short = ar ? `من ${n} ريال` : `From SAR ${n}`;
  const scope = [VEHICLE[p.vehicle][ar ? "ar" : "en"], note].filter(Boolean).join(ar ? "، " : ", ");
  const label = scope ? `${short} (${scope})` : short;
  const sentence = ar
    ? `يبدأ السعر التقديري للرحلة باتجاه واحد ${label}، ويُؤكد السعر النهائي عبر واتساب قبل الحجز.`
    : `Estimated one-way fares start from SAR ${n}${scope ? ` (${scope})` : ""} for the whole vehicle; the final fare is confirmed on WhatsApp before booking.`;
  return { short, label, sentence, checked: ar ? CHECKED_AR : CHECKED_EN };
}

type Faq = { question: string; answer: string };
type Fact = { label: string; value: string };

const PRICE_Q_EN = /^(how much (is|does|for)|what (is|does) .*(fare|price|cost))/i;
const PRICE_Q_AR = /^(كم (سعر|تكلفة|أجرة|يكلف|تكلف)|ما (هو |هي )?(سعر|أجرة|تكلفة))/;

/** Puts the estimate into the page's own price FAQ, or appends one if it has none. */
export function withPriceFaq(slug: string, faqs: Faq[], routeName: string, ar = false): Faq[] {
  const p = routeFromPriceText(slug, ar);
  if (!p) return faqs;
  const i = faqs.findIndex((f) => (ar ? PRICE_Q_AR : PRICE_Q_EN).test(f.question));
  if (i >= 0) return faqs.map((f, k) => (k === i ? { ...f, answer: `${p.sentence} ${f.answer}` } : f));
  const question = ar ? `كم سعر النقل الخاص ${routeName}؟` : `How much is a private car from ${routeName}?`;
  return [...faqs, { question, answer: p.sentence }];
}

/** Swaps the "On WhatsApp" fare chip for the estimate. */
export function withPriceFact(slug: string, facts: Fact[] | undefined, ar = false): Fact[] | undefined {
  const p = routeFromPriceText(slug, ar);
  if (!p) return facts;
  return facts?.map((f) => (/^(fare|price|السعر|الأجرة)$/i.test(f.label) ? { ...f, value: p.short } : f));
}
