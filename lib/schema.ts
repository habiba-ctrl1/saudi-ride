// Centralized Schema.org / JSON-LD builders for Taxi Saudi Arabia.
// One source of truth keeps entity data (name, URL, ratings) consistent across all pages.

import { trustStats } from "@/lib/config/stats";

export const SITE = {
  name: "Taxi Saudi Arabia",
  url: "https://taxisaudiarabia.com",
  logo: "https://taxisaudiarabia.com/icon.svg",
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
    inLanguage: ["en", "ar", "ur"],
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

interface ServiceSchemaInput {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
  /** City / area names this page targets, e.g. ["Makkah", "Jeddah"]. */
  areaServed?: string[];
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
    areaServed: (areaServed ?? ["Saudi Arabia"]).map((a) => ({ "@type": "Place", name: a })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: String(trustStats.tripsCount),
      bestRating: "5",
      worstRating: "1",
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
