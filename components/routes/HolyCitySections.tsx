import { CorridorSections } from "@/components/routes/CorridorSections";

// Makkah <-> Madinah block. All copy, visuals and fact sources live in CorridorSections.tsx.
export function HolyCitySections({ locale, dir }: { locale: "en" | "ar"; dir: "makkah-to-madinah" | "madinah-to-makkah" }) {
  return <CorridorSections corridor={dir} locale={locale} />;
}
