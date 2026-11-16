import { CorridorSections } from "@/components/routes/CorridorSections";

// Jeddah <-> Madinah block. All copy, visuals and fact sources live in CorridorSections.tsx.
export function JeddahMadinahSections({ locale, dir }: { locale: "en" | "ar"; dir: "jeddah-to-madinah" | "madinah-to-jeddah" }) {
  return <CorridorSections corridor={dir} locale={locale} />;
}
