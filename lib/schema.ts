// Centralized Schema.org / JSON-LD builders for Taxi Saudi Arabia.
// One source of truth keeps entity data (name, URL, ratings) consistent across all pages.

import { trustStats } from "@/lib/config/stats";

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

interface JobPostingInput {
  title: string;
  description: string;
  path: string;
  /** City the job is based in, e.g. "Riyadh". */
  city: string;
  region?: string;
  /** Monthly salary range in SAR, e.g. [4000, 9000]. */
  salary?: [number, number];
  /** ISO date the listing was posted. Defaults to today. */
  datePosted?: string;
  employmentType?: "FULL_TIME" | "PART_TIME" | "CONTRACTOR";
}

/** JobPosting — eligible for the Google Jobs rich result (driver/chauffeur recruitment pages). */
export function jobPostingSchema({ title, description, path, city, region, salary, datePosted, employmentType = "FULL_TIME" }: JobPostingInput) {
  const today = new Date().toISOString().slice(0, 10);
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    url: abs(path),
    datePosted: datePosted ?? today,
    // Keep the listing "fresh" for ~90 days so it stays eligible for the rich result.
    validThrough: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
    employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: SITE.name,
      sameAs: SITE.url,
      logo: SITE.logo,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: city,
        ...(region ? { addressRegion: region } : {}),
        addressCountry: "SA",
      },
    },
    ...(salary
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "SAR",
            value: {
              "@type": "QuantitativeValue",
              minValue: salary[0],
              maxValue: salary[1],
              unitText: "MONTH",
            },
          },
        }
      : {}),
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
