// Arabic city hubs that exist under /ar/locations — single list used for
// Arabic internal linking (homepage section, footer, Arabic route pages).
// Added 2026-11-22 (seo/sprint4-arabic-plan.md): before this, no Arabic page
// outside the hubs themselves linked to them. Only list hubs that exist.
export interface ArCityHub {
  key: string;
  href: string;
  name: string;
  /** Short line for the homepage card. */
  blurb: string;
  /** Route slugs whose text matches this pattern link to the hub. */
  match: RegExp;
}

export const AR_CITY_HUBS: ArCityHub[] = [
  { key: "riyadh", href: "/ar/locations/riyadh", name: "الرياض", blurb: "مطار الملك خالد، المركز المالي والعليا، وليموزين بالساعة", match: /riyadh/ },
  { key: "makkah", href: "/ar/locations/makkah", name: "مكة المكرمة", blurb: "من مطار جدة إلى فندقك، وزيارات مكة، وسيارة مع سائق بالساعة", match: /makkah/ },
  { key: "madinah", href: "/ar/locations/madinah", name: "المدينة المنورة", blurb: "مطار المدينة، فنادق المنطقة المركزية، والزيارات", match: /madinah/ },
  { key: "jeddah", href: "/ar/locations/jeddah", name: "جدة", blurb: "مطار الملك عبدالعزيز، الكورنيش، والرحلات إلى مكة", match: /jeddah/ },
  { key: "alula", href: "/ar/locations/alula", name: "العلا", blurb: "مطار العلا، الحِجر، والتنقل بين المعالم", match: /alula/ },
  { key: "dammam", href: "/ar/locations/dammam", name: "الدمام والخبر والقطيف", blurb: "مطار الملك فهد، التنقل داخل المنطقة، والبحرين", match: /dammam|alkhobar|dhahran|qatif/ },
  { key: "jubail", href: "/ar/locations/jubail", name: "الجبيل", blurb: "مطار الدمام، المدينة الصناعية، والكويت", match: /jubail/ },
  { key: "yanbu", href: "/ar/locations/yanbu", name: "ينبع", blurb: "ينبع البحر والمدينة الصناعية، والطريق إلى المدينة", match: /yanbu/ },
];

export const arHubFor = (key: string) => AR_CITY_HUBS.find((h) => h.key === key);
export const arHubsForRoute = (slug: string) => AR_CITY_HUBS.filter((h) => h.match.test(slug));
