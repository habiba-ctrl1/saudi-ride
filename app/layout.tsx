import type { Metadata } from "next";
import { Manrope, Inter, Cairo } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/layout/SiteShell";
import { Analytics } from "@vercel/analytics/react";
import { websiteSchema } from "@/lib/schema";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
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

export const metadata: Metadata = {
  metadataBase: new URL("https://taxisaudiarabia.com"),
  title: "Taxi Saudi Arabia — Airport Transfers, Umrah & Intercity Rides",
  description:
    "Book a taxi in Saudi Arabia for airport transfers, Umrah trips, intercity rides, and business travel. Fixed prices, licensed drivers, 24/7 service across Riyadh, Jeddah, Makkah, Madinah, and Dammam.",
  keywords: [
    "taxi service Saudi Arabia",
    "airport taxi Riyadh",
    "airport taxi Jeddah",
    "taxi from Jeddah airport to Makkah",
    "Umrah taxi service",
    "Makkah to Madinah taxi",
    "intercity taxi Saudi Arabia",
    "Riyadh to Jeddah taxi",
    "car hire with driver Saudi Arabia",
    "taxi near me Saudi Arabia",
    "Madinah airport taxi",
    "corporate taxi Saudi Arabia",
    "GCC taxi service",
    "book taxi Saudi Arabia online",
    "Saudi Arabia private car service",
    "taxi Dammam",
    "taxi Makkah",
    "taxi Madinah",
    "Umrah transfer service",
    "Hajj taxi Saudi Arabia",
  ],
  openGraph: {
    title: "Taxi Saudi Arabia — Taxi Service in Saudi Arabia | Airport Transfers & Umrah Rides",
    description:
      "Book a taxi anywhere in Saudi Arabia. Airport pickups, Umrah transfers, intercity rides, and business car service. Fixed prices, no hidden fees, 24/7 availability.",
    type: "website",
    locale: "en_SA",
    url: "https://taxisaudiarabia.com",
    siteName: "Taxi Saudi Arabia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxi Saudi Arabia — Taxi Service in Saudi Arabia",
    description:
      "Book airport taxis, Umrah transfers, and intercity car rides anywhere in Saudi Arabia. Fixed prices, licensed drivers, 24/7 service.",
  },
  alternates: {
    canonical: "https://taxisaudiarabia.com",
    languages: {
      "ar-SA": "https://taxisaudiarabia.com/ar",
    },
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    "name": "Taxi Saudi Arabia",
    "alternateName": ["Saudi Taxi Service", "Taxi Saudi Arabia Service", "Saudi Arabia Car Service"],
    "description": "Professional taxi and car service in Saudi Arabia. Airport transfers, Umrah taxi, intercity rides, and corporate car service across Riyadh, Jeddah, Makkah, Madinah, and Dammam.",
    "image": "https://taxisaudiarabia.com/fleet/mercedes-s-class.webp",
    "@id": "https://taxisaudiarabia.com/#taxiservice",
    "url": "https://taxisaudiarabia.com",
    "telephone": "+966500123456",
    "priceRange": "$$",
    "currenciesAccepted": "SAR",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Olaya District, King Fahd Road",
      "addressLocality": "Riyadh",
      "addressRegion": "Riyadh Province",
      "postalCode": "12211",
      "addressCountry": "SA",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 24.7136,
      "longitude": 46.6753,
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
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Airport Taxi Service Saudi Arabia", "description": "Airport pickup and drop-off at Jeddah, Riyadh, and Madinah airports with flight tracking." } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Umrah Taxi Service", "description": "Dedicated taxi for Umrah pilgrims with Makkah and Madinah transfers, Meeqat stops, and prayer-time awareness." } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Intercity Taxi Saudi Arabia", "description": "Long-distance taxi between Riyadh, Jeddah, Makkah, Dammam, and Madinah at fixed prices." } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Corporate Car Service Saudi Arabia", "description": "Business car service for executives and corporate travelers with Wi-Fi equipped vehicles." } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "GCC Cross-Border Taxi", "description": "Cross-border car service from Saudi Arabia to Bahrain, Qatar, UAE, and Kuwait." } },
      ],
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "5000",
      "bestRating": "5",
      "worstRating": "1",
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Dr. Farhan Malik" },
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "datePublished": "2026-05-18",
        "reviewBody": "Excellent taxi service from Jeddah to Makkah. The driver was waiting in the arrivals hall with a name sign. Smooth, comfortable ride with no issues at all.",
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Muhammad Siddique" },
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "datePublished": "2026-05-02",
        "reviewBody": "Wonderful Umrah transfer booking. The driver was prayer-time aware and stopped for us at Meeqat with complete respect and patience. Highly recommended.",
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Hassan Qabbani" },
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "datePublished": "2026-04-21",
        "reviewBody": "Highly recommend Taxi Saudi Arabia for anyone in Saudi Arabia. Clean car, Wi-Fi included, fixed price — zero hidden charges or surge fees.",
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Evelyn Sterling" },
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "datePublished": "2026-04-09",
        "reviewBody": "Amazing airport taxi service. My flight was delayed 2 hours but the driver tracked it and was right there when I landed. Very professional and reliable.",
      },
    ],
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
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I book a taxi in Saudi Arabia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can book a taxi in Saudi Arabia online through our website or by messaging us on WhatsApp. Enter your pickup location, drop-off, date, and time to get an instant fixed price quote. Booking takes less than 2 minutes."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a taxi from Jeddah Airport to Makkah cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A taxi from Jeddah Airport (King Abdulaziz International Airport) to Makkah starts from SAR 249. The fare is fixed with no hidden charges or surge pricing."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide Umrah taxi service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We provide dedicated Umrah taxi service including transfers from Jeddah Airport to Makkah, Makkah to Madinah, and Madinah to Jeddah Airport. Our drivers stop at Meeqat and plan trips around prayer times."
        }
      },
      {
        "@type": "Question",
        "name": "Do your drivers speak English?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our drivers speak English, Arabic, and Urdu so you can communicate easily regardless of your language."
        }
      },
      {
        "@type": "Question",
        "name": "Are your taxi prices fixed or does the price change?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All our taxi prices are fixed. The price you see when you book is exactly what you pay. We never apply surge pricing or add hidden fees."
        }
      },
      {
        "@type": "Question",
        "name": "What cities in Saudi Arabia do you cover?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We cover all major cities in Saudi Arabia including Riyadh, Jeddah, Makkah, Madinah, Dammam, Taif, AlUla, and NEOM. We also provide GCC cross-border service to Bahrain, Qatar, UAE, and Kuwait."
        }
      },
    ],
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }} suppressHydrationWarning>
      <head>
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className={cn(manrope.variable, inter.variable, cairo.variable, "font-sans antialiased bg-background text-foreground")}>
        <Providers>
          <SiteShell>
            {children}
          </SiteShell>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
