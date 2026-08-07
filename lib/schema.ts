// Centralized Schema.org / JSON-LD builders for Taxi Saudi Arabia.
// One source of truth keeps entity data (name, URL, ratings) consistent across all pages.

export const SITE = {
  name: "Taxi Saudi Arabia",
  url: "https://taxisaudiarabia.com",
  logo: "https://taxisaudiarabia.com/icon.png",
  // Stable @id of the primary business entity (defined in app/layout.tsx TaxiService node).
  businessId: "https://taxisaudiarabia.com/#taxiservice",
  sameAs: [
    "https://facebook.com/taxisaudiarabia",
    "https://instagram.com/taxisaudiarabia",
    "https://youtube.com/@taxisaudiarabia",
  ],
};

const abs = (path: string) => {
  if (!path) return SITE.url;
  if (path.startsWith("http")) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
};

export interface Crumb {
  name: string;
  href: string;
}

/** BreadcrumbList — feeds the breadcrumb rich result + helps Google understand site hierarchy. */
export function breadcrumbSchema(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.href),
    })),
  };
}

/** WebSite — enables the sitelinks search box and reinforces the brand entity. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: ["en", "ar"],
    publisher: { "@id": SITE.businessId },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/routes?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** A named area with optional real-world coordinates (public geographic
 *  facts — e.g. city centroids — not fabricated business data). */
interface AreaServedPlace {
  name: string;
  lat?: number;
  lng?: number;
}

interface ServiceSchemaInput {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
  /** City / area names this page targets, e.g. ["Makkah", "Jeddah"]. Pass an
   *  object with lat/lng to attach GeoCoordinates (useful on location pages). */
  areaServed?: (string | AreaServedPlace)[];
}

/** Service — describes a specific service offering and ties it to the business provider. */
export function serviceSchema({ name, description, path, serviceType, areaServed }: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: serviceType ?? name,
    url: abs(path),
    provider: { "@id": SITE.businessId },
    areaServed: (areaServed ?? ["Saudi Arabia"]).map((a) => {
      if (typeof a === "string") return { "@type": "Place", name: a };
      return {
        "@type": "Place",
        name: a.name,
        ...(a.lat !== undefined && a.lng !== undefined
          ? { geo: { "@type": "GeoCoordinates", latitude: a.lat, longitude: a.lng } }
          : {}),
      };
    }),
    // NOTE: aggregateRating hataya — trip count (5000) ko review count bata kar
    // fake 4.9★ dikhana schema.org violation + Google penalty risk hai. Sirf
    // REAL reviews (Google Business Profile se) milne par wapas add karna.
  };
}

// Wikidata entity URIs for Saudi airports — used for sameAs disambiguation.
// These are public Wikidata Q-IDs, not operational claims.
const AIRPORT_WIKIDATA: Record<string, string> = {
  JED: "https://www.wikidata.org/wiki/Q178122",  // King Abdulaziz International Airport
  RUH: "https://www.wikidata.org/wiki/Q286735",  // King Khalid International Airport
  MED: "https://www.wikidata.org/wiki/Q1552805", // Prince Mohammad Bin Abdulaziz Airport
  DMM: "https://www.wikidata.org/wiki/Q607300",  // King Fahd International Airport
  TIF: "https://www.wikidata.org/wiki/Q3553174", // Taif Regional Airport
  TUU: "https://www.wikidata.org/wiki/Q3553072", // Tabuk Regional Airport
  ULH: "https://www.wikidata.org/wiki/Q69487086", // AlUla International Airport
  AHB: "https://www.wikidata.org/wiki/Q2822273", // Abha International Airport
};

interface AirportTaxiSchemaInput {
  /** Airport name, e.g. "King Abdulaziz International Airport" */
  airportName: string;
  /** IATA code, e.g. "JED" */
  iataCode: string;
  /** URL path for this page, e.g. "/airports/king-abdulaziz-jeddah" */
  path: string;
  /** Page description */
  description: string;
}

/**
 * TaxiService + Airport entity schema — enriched structured data for airport
 * transfer pages. Links the taxi service provider to a specific Airport entity
 * with Wikidata sameAs for entity disambiguation.
 *
 * Only references service features already described on the live pages:
 * - Flight tracking
 * - Meet & greet at arrivals
 * - 60-minute complimentary waiting after landing
 * - Fixed pricing (no surge)
 * - 24/7 availability
 */
export function airportTaxiServiceSchema({ airportName, iataCode, path, description }: AirportTaxiSchemaInput) {
  const wikidataUrl = AIRPORT_WIKIDATA[iataCode];
  return {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: `Airport Taxi Service at ${airportName} (${iataCode})`,
    description,
    url: abs(path),
    provider: { "@id": SITE.businessId },
    serviceType: "Airport Transfer",
    areaServed: {
      "@type": "Airport",
      name: airportName,
      iataCode,
      ...(wikidataUrl ? { sameAs: wikidataUrl } : {}),
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE.url}/book`,
      availableLanguage: ["en", "ar"],
    },
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "SAR",
      availability: "https://schema.org/InStock",
    },
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

/** FAQPage — eligible for the FAQ rich result. */
export function faqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/**
 * Speakable — voice assistants / AI answer engines ke liye page ke
 * answer-first hisse mark karta hai. cssSelector wale elements page par
 * exist karne chahiye (h1 + #speakable-summary convention).
 */
export function speakableSchema({ path, cssSelectors = ["h1", "#speakable-summary"] }: { path: string; cssSelectors?: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE.url}${path}#webpage`,
    url: `${SITE.url}${path}`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
  };
}

interface ArticleSchemaInput {
  headline: string;
  description: string;
  path: string;
  image?: string;
  /** ISO date string, e.g. new Date().toISOString(). */
  datePublished?: string;
  author?: string;
  type?: "Article" | "BlogPosting";
}

/** Article / BlogPosting — eligible for the article rich result. */
export function articleSchema({ headline, description, path, image, datePublished, author, type = "Article" }: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    headline,
    description,
    url: abs(path),
    mainEntityOfPage: abs(path),
    ...(image ? { image } : {}),
    ...(datePublished ? { datePublished, dateModified: datePublished } : {}),
    author: { "@type": "Organization", name: author ?? SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: SITE.logo },
    },
  };
}

interface PersonInput {
  name: string;
  path: string;
  jobTitle?: string;
  description?: string;
  image?: string;
}

/** Person — author / expert entity for E-E-A-T (blog & guide authors). */
export function personSchema({ name, path, jobTitle, description, image }: PersonInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: abs(path),
    ...(jobTitle ? { jobTitle } : {}),
    ...(description ? { description } : {}),
    ...(image ? { image } : {}),
    worksFor: { "@id": SITE.businessId },
  };
}

/** ItemList — helps Google understand list/hub pages (route lists, city hubs). */
export function itemListSchema(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: abs(item.href),
    })),
  };
}

interface StepInput {
  name: string;
  text: string;
  url?: string;
}

interface HowToInput {
  name: string;
  description: string;
  steps: StepInput[];
  totalTime?: string; // ISO 8601 duration format, e.g., "PT2M" for 2 minutes
}

/** HowTo — eligible for How-To rich results, great for booking processes. */
export function howToSchema({ name, description, steps, totalTime = "PT2M" }: HowToInput) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    totalTime,
    step: steps.map((step) => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.text,
      ...(step.url ? { url: abs(step.url) } : {}),
    })),
  };
}
