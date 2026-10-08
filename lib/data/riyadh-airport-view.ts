// Resolves the airport-intent section for a route + locale into plain,
// serialisable props so the client component never imports route data.
import { RIYADH_AIRPORT_INTENT, airportWhatsAppText } from "./riyadh-airport-intent";
import { RIYADH_AIRPORT_INTENT_AR, airportWhatsAppTextAr } from "./riyadh-airport-intent-ar";

export interface AirportView {
  routeId: string;
  code: string;
  heading: string;
  answer: string;
  distinctions: { name: string; desc: string }[];
  askFor: string[];
  tradeOff: { heading: string; body: string[] };
  entryNote?: string;
  cta: string;
  waText: string;
  faqs: { question: string; answer: string }[];
}

export function airportView(slug: string, locale: "en" | "ar" = "en"): AirportView | undefined {
  const en = RIYADH_AIRPORT_INTENT[slug];
  if (!en) return undefined;
  if (locale === "ar") {
    const ar = RIYADH_AIRPORT_INTENT_AR[slug];
    if (!ar) return undefined;
    return { routeId: en.routeId, code: en.code, ...ar, waText: airportWhatsAppTextAr(slug) };
  }
  return { ...en, waText: airportWhatsAppText(en) };
}
