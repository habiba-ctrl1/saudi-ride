// Blog content model — one file per post under ./posts (English) and
// ./ar (Arabic). Dates are fixed ISO strings: never compute them from
// `new Date()` (that made every post look freshly published on each build —
// fixed 2026-10-02). Set `updatedAt` only when the content genuinely changes.

export const BLOG_CATEGORIES = [
  "Airport Transfers",
  "Routes",
  "City Guides",
  "Business Travel",
  "Umrah",
  "AlUla & Tourism",
  "Events & Conferences",
  "Travel Tips",
  "Pricing",
  "Car Recovery",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_CATEGORY_AR: Record<BlogCategory, string> = {
  "Airport Transfers": "توصيل المطارات",
  Routes: "المسارات",
  "City Guides": "أدلة المدن",
  "Business Travel": "سفر الأعمال",
  Umrah: "العمرة",
  "AlUla & Tourism": "العُلا والسياحة",
  "Events & Conferences": "الفعاليات والمؤتمرات",
  "Travel Tips": "نصائح السفر",
  Pricing: "الأسعار",
  "Car Recovery": "سحب السيارات",
};

/** The real, single author entity. No invented personas (removed 2026-10-02). */
export const BLOG_AUTHOR = "Taxi Saudi Arabia Editorial Team";
export const BLOG_AUTHOR_AR = "فريق تحرير تاكسي السعودية";

export interface BlogLink {
  label: string;
  href: string;
}

/** What the end-of-article quote CTA pre-fills. */
export interface BlogCta {
  /** individual = WhatsApp + quote form; corporate adds an email RFQ;
   *  recovery routes to the car-recovery intake. */
  kind?: "individual" | "corporate" | "recovery";
  /** Opening line of the WhatsApp message. */
  intro?: string;
  from?: string;
  to?: string;
  heading?: string;
  text?: string;
}

export interface BlogPost {
  slug: string;
  /** Visible H1. */
  title: string;
  /** <title> override when the H1 is too long for the SERP. */
  seoTitle?: string;
  /** Card excerpt + meta description (aim 140–160 chars). */
  excerpt: string;
  category: BlogCategory;
  coverImage: string;
  /** Describes the photo itself — never claims a venue the photo doesn't show. */
  coverAlt: string;
  publishedAt: string;
  updatedAt?: string;
  /** 2–3 sentence self-contained answer shown at the top. */
  quickAnswer?: string;
  /** Markdown (GFM tables supported). Start with ## headings; no H1. */
  content: string;
  /** Hand-picked commercial pages for the "Plan this trip" block. */
  links?: BlogLink[];
  /** Hand-picked related article slugs (falls back to same category). */
  related?: string[];
  cta?: BlogCta;
  featured?: boolean;
  published?: boolean;
}

export interface BlogPostAr {
  slug: string;
  title: string;
  seoTitle?: string;
  excerpt: string;
  coverAlt: string;
  /** Only when the Arabic text itself was revised. */
  updatedAt?: string;
  publishedAt: string;
  quickAnswer?: string;
  content: string;
  links?: BlogLink[];
  cta?: BlogCta;
}
