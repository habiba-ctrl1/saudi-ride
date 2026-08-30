import type { Metadata } from "next";
import { Manrope, Geist, Cairo, Playfair_Display } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/layout/SiteShell";
import { Analytics } from "@vercel/analytics/react";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { websiteSchema, howToSchema } from "@/lib/schema";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

// Elegant serif for the brand wordmark — matches the Trajan-style "TSA" mark.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Shared default metadata for both the English and Arabic root layouts. Kept
// identical to the previous single root layout so /ar pages inherit the same
// defaults they always have (each /ar page still overrides title/description).
export const rootMetadata: Metadata = {
  metadataBase: new URL("https://taxisaudiarabia.com"),
  title: "Taxi Service Saudi Arabia — Book Airport Transfer & Umrah Taxi | 24/7",
  description:
    "Book a taxi in Saudi Arabia — airport transfers, Umrah transport & intercity rides. Professional drivers, clear pricing on WhatsApp, 24/7.",
  openGraph: {
    title: "Taxi Service Saudi Arabia — Book Airport Transfer & Umrah Taxi | 24/7",
    description:
      "Book a private taxi in Saudi Arabia. Airport transfers, Umrah transport, Jeddah to Makkah, Makkah to Madinah routes. Professional drivers, clear pricing on WhatsApp, GMC Yukon & Hyundai Staria available. WhatsApp booking 24/7.",
    type: "website",
    locale: "en_SA",
    url: "https://taxisaudiarabia.com",
    siteName: "Taxi Saudi Arabia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxi Service Saudi Arabia — Book Airport Transfer & Umrah Taxi",
    description:
      "Book a taxi in Saudi Arabia for airport transfers and Umrah transport. Professional chauffeurs, fixed fares confirmed on WhatsApp — no surge, no hidden fees. WhatsApp booking 24/7.",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": ["TaxiService", "LocalBusiness"],
    "name": "Taxi Saudi Arabia",
    "alternateName": ["Saudi Taxi Service", "Taxi Saudi Arabia Service", "Saudi Arabia Car Service"],
    "description": "Professional taxi service in Saudi Arabia offering airport transfers, Umrah transport, and intercity rides. Book a private taxi or VIP taxi with professional chauffeurs across Riyadh, Jeddah, Makkah, Madinah, Taif, and Dammam. Clear pricing on WhatsApp, booking available 24/7.",
    "image": "https://taxisaudiarabia.com/fleet/mercedes-s-class.webp",
    "@id": "https://taxisaudiarabia.com/#taxiservice",
    "url": "https://taxisaudiarabia.com",
    "telephone": "+966539388072",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+966539388072",
        "url": "https://wa.me/966539388072",
        "contactType": "reservations",
        "name": "WhatsApp booking",
        "availableLanguage": ["English", "Arabic", "Urdu"],
        "areaServed": ["SA", "BH", "QA", "AE", "KW", "Worldwide"],
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          "opens": "00:00",
          "closes": "23:59",
        },
      },
    ],
    "priceRange": "$$",
    "currenciesAccepted": "SAR",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sanaiya Industrial Area",
      "addressLocality": "Dammam",
      "addressRegion": "Eastern Province",
      "addressCountry": "SA",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.4207,
      "longitude": 50.0888,
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "00:00",
      "closes": "23:59",
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Taxi Services in Saudi Arabia",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Airport Transfer Saudi Arabia", "description": "Saudi airport transfer with meet-and-greet at Jeddah (JED), Riyadh (RUH), Madinah (MED), and Dammam (DMM). Flight tracking and 60-minute free wait time included." } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Umrah Taxi & Transport", "description": "Umrah airport transfer and Umrah transport for pilgrims. Jeddah Airport to Makkah taxi, Makkah to Madinah taxi, Makkah Ziyarat taxi, and Madinah Ziyarat taxi with Meeqat stops." } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Private Taxi Saudi Arabia", "description": "Private taxi and VIP taxi service between Riyadh, Jeddah, Makkah, Madinah, Taif, and Dammam. Clear pricing on WhatsApp, professional chauffeurs." } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Family & Luxury SUV Taxi", "description": "Family taxi in GMC Yukon, Hyundai Staria, and Toyota Hiace. Luxury SUV taxi for groups, families, and VIP travelers across Saudi Arabia." } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "GCC Cross-Border Taxi", "description": "Cross-border car service from Saudi Arabia to Bahrain, Qatar, UAE, and Kuwait with professional chauffeurs." } },
      ],
    },
    // NOTE: aggregateRating + review schema removed on purpose — fabricated
    // review markup risks a Google structured-data penalty. Re-add ONLY with
    // real reviews (e.g. from Google Business Profile) later.
    "areaServed": [
      { "@type": "City", "name": "Riyadh", "sameAs": "https://www.wikidata.org/wiki/Q3692" },
      { "@type": "City", "name": "Jeddah", "sameAs": "https://www.wikidata.org/wiki/Q79278" },
      { "@type": "City", "name": "Makkah", "sameAs": "https://www.wikidata.org/wiki/Q45765" },
      { "@type": "City", "name": "Madinah", "sameAs": "https://www.wikidata.org/wiki/Q40232" },
      { "@type": "City", "name": "Dammam", "sameAs": "https://www.wikidata.org/wiki/Q216756" },
      { "@type": "AdministrativeArea", "name": "Saudi Arabia", "sameAs": "https://www.wikidata.org/wiki/Q851" },
    ],
    "sameAs": [
      "https://facebook.com/taxisaudiarabia",
      "https://instagram.com/taxisaudiarabia",
      "https://youtube.com/@taxisaudiarabia",
    ],
  },
  websiteSchema(),
  howToSchema({
    name: "How to Book a Taxi in Saudi Arabia",
    description: "Follow these simple steps to book a private taxi, airport transfer, or Umrah transport in Saudi Arabia online.",
    steps: [
      {
        name: "Select Your Route",
        text: "Enter your pickup location (e.g., Jeddah Airport) and drop-off destination (e.g., Makkah Hotel).",
      },
      {
        name: "Choose Your Vehicle",
        text: "Select a vehicle that fits your needs, such as a standard sedan, luxury SUV (GMC Yukon), or family van (Hyundai Staria).",
      },
      {
        name: "Get Your Quote",
        text: "Message your trip details on WhatsApp and receive a clear price quote based on your route, vehicle, date, and passengers.",
      },
      {
        name: "Receive Booking Confirmation",
        text: "Once you confirm, get your booking confirmation via WhatsApp or email with your driver's details.",
      },
    ]
  }),
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I book a taxi in Saudi Arabia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can book a taxi in Saudi Arabia online through our website or via WhatsApp. Share your pickup location, drop-off, date, and time to get a clear price quote confirmed before you book. Our 24/7 taxi service means you can request a quote any time."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a Jeddah Airport to Makkah taxi cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A Jeddah Airport to Makkah taxi is a private, fixed-fare transfer confirmed on WhatsApp before booking, with no hidden charges or surge pricing. Sedans and larger vehicles like the GMC Yukon or Hyundai Staria are available. The journey takes about 1 hour (80 km)."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide Umrah taxi and Umrah transport service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We arrange dedicated Umrah taxi and Umrah transport including Umrah airport transfers from Jeddah Airport to Makkah, Makkah to Madinah taxi, Madinah to Makkah taxi, and Makkah Ziyarat taxi and Madinah Ziyarat taxi services. Drivers stop at Meeqat and plan trips around prayer times."
        }
      },
      {
        "@type": "Question",
        "name": "What is the taxi fare from Makkah to Madinah?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Makkah to Madinah taxi is a private transfer with a fixed fare confirmed on WhatsApp before booking. This includes a Meeqat stop and bottled water. The journey covers 430 km and takes approximately 4 hours via the Haramain Highway."
        }
      },
      {
        "@type": "Question",
        "name": "What vehicles are available for airport transfer in Saudi Arabia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our Saudi airport transfer options include executive sedans (Toyota Camry), luxury SUV taxis (GMC Yukon Denali XL), family taxis (Hyundai Staria VIP), group transport (Toyota Hiace), and VIP sedans (Mercedes S-Class), arranged through our transportation partners with professional chauffeurs."
        }
      },
      {
        "@type": "Question",
        "name": "Are your taxi prices fixed in Saudi Arabia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes — once your fare is confirmed in your quotation, it is fixed, with no surge pricing or hidden fees. Final pricing depends on your route, vehicle, date, and passengers, so prices shown on the website are starting estimates; message us on WhatsApp with your trip details for a clear quote before you book."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer Riyadh Airport taxi and Dammam taxi service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We provide Riyadh airport taxi service at King Khalid International Airport (RUH) and Dammam taxi service at King Fahd International Airport (DMM). Both include meet-and-greet, flight tracking, and 60-minute free wait time. We also cover Taif taxi service at Taif Regional Airport."
        }
      },
      {
        "@type": "Question",
        "name": "Can I book a taxi via WhatsApp in Saudi Arabia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, WhatsApp booking is available 24/7. Simply message us your pickup location, destination, date, and time. Our team will confirm your booking with a fixed taxi price, usually within 1-2 hours. You can also book airport transfers, Umrah taxis, and intercity rides through WhatsApp."
        }
      },
      {
        "@type": "Question",
        "name": "What cities in Saudi Arabia do you cover?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our taxi service covers all major cities in Saudi Arabia including Riyadh, Jeddah, Makkah, Madinah, Dammam, Taif, AlUla, Abha, Yanbu, and NEOM. We also provide GCC cross-border service to Bahrain, Qatar, UAE, and Kuwait."
        }
      },
    ],
  },
];

/**
 * Shared <html> document shell for the site's two root layouts. The English
 * root layout renders it with lang="en"/dir="ltr" and the Arabic root layout
 * with lang="ar"/dir="rtl". Splitting the roots this way lets both trees be
 * statically prerendered with the correct language baked in, instead of
 * reading the request-time `x-locale` header (which forced dynamic rendering
 * on every page).
 */
export function RootDocument({
  lang,
  dir,
  children,
}: Readonly<{
  lang: "en" | "ar";
  dir: "ltr" | "rtl";
  children: React.ReactNode;
}>) {
  return (
    <html lang={lang} dir={dir} className="light" style={{ colorScheme: "light" }} suppressHydrationWarning>
      <head>
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className={cn(manrope.variable, geist.variable, cairo.variable, playfair.variable, "font-sans antialiased bg-background text-foreground")}>
        <Providers>
          <SiteShell>
            {children}
          </SiteShell>
          <Analytics />
          <AnalyticsScripts />
        </Providers>
      </body>
    </html>
  );
}
