import type { Metadata } from "next";
import { Manrope, Geist, Cairo } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/layout/SiteShell";
import { Analytics } from "@vercel/analytics/react";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://taxisaudiarabia.com"),
  title: "Taxi Service Saudi Arabia — Book Airport Transfer & Umrah Taxi | Fixed Prices 24/7",
  description:
    "Book a taxi in Saudi Arabia — airport transfers, Umrah transport & intercity rides at fixed prices. Licensed drivers, WhatsApp booking 24/7.",
  keywords: [
    "taxi service Saudi Arabia",
    "airport transfer Saudi Arabia",
    "private taxi Saudi Arabia",
    "VIP taxi Saudi Arabia",
    "Saudi airport transfer",
    "book taxi Saudi Arabia",
    "Jeddah airport to Makkah taxi",
    "Makkah to Madinah taxi",
    "Madinah to Makkah taxi",
    "Jeddah to Madinah taxi",
    "Makkah to Jeddah airport taxi",
    "Madinah airport taxi",
    "Riyadh airport taxi",
    "Taif taxi",
    "Dammam taxi",
    "book airport transfer",
    "taxi fare Saudi Arabia",
    "taxi price Saudi Arabia",
    "WhatsApp booking",
    "24/7 taxi service",
    "licensed drivers",
    "fixed price taxi",
    "professional chauffeurs",
    "family taxi",
    "luxury SUV taxi",
    "GMC Yukon",
    "Hyundai Staria",
    "Toyota Hiace",
    "Umrah taxi",
    "Umrah transport",
    "Umrah airport transfer",
    "Makkah Ziyarat taxi",
    "Madinah Ziyarat taxi",
  ],
  openGraph: {
    title: "Taxi Service Saudi Arabia — Book Airport Transfer & Umrah Taxi | Fixed Prices 24/7",
    description:
      "Book a private taxi in Saudi Arabia. Airport transfers, Umrah transport, Jeddah to Makkah, Makkah to Madinah routes. Licensed drivers, fixed prices, GMC Yukon & Hyundai Staria fleet. WhatsApp booking 24/7.",
    type: "website",
    locale: "en_SA",
    url: "https://taxisaudiarabia.com",
    siteName: "Taxi Saudi Arabia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxi Service Saudi Arabia — Book Airport Transfer & Umrah Taxi",
    description:
      "Book a taxi in Saudi Arabia for airport transfers and Umrah transport. Fixed price taxi with licensed drivers. Jeddah Airport to Makkah from SAR 249. WhatsApp booking 24/7.",
  },
  // NOTE: ar-SA hreflang hataya — /ar page exist nahi karta (404). Arabic launch par wapas.
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    "name": "Taxi Saudi Arabia",
    "alternateName": ["Saudi Taxi Service", "Taxi Saudi Arabia Service", "Saudi Arabia Car Service"],
    "description": "Professional taxi service in Saudi Arabia offering airport transfers, Umrah transport, and intercity rides. Book a private taxi or VIP taxi with licensed drivers and professional chauffeurs across Riyadh, Jeddah, Makkah, Madinah, Taif, and Dammam. Fixed price taxi with WhatsApp booking available 24/7.",
    "image": "https://taxisaudiarabia.com/fleet/mercedes-s-class.webp",
    "@id": "https://taxisaudiarabia.com/#taxiservice",
    "url": "https://taxisaudiarabia.com",
    "telephone": "+966539388072",
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
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Airport Transfer Saudi Arabia", "description": "Saudi airport transfer with meet-and-greet at Jeddah (JED), Riyadh (RUH), Madinah (MED), and Dammam (DMM). Flight tracking and 60-minute free wait time included." } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Umrah Taxi & Transport", "description": "Umrah airport transfer and Umrah transport for pilgrims. Jeddah Airport to Makkah taxi, Makkah to Madinah taxi, Makkah Ziyarat taxi, and Madinah Ziyarat taxi with Meeqat stops." } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Private Taxi Saudi Arabia", "description": "Private taxi and VIP taxi service between Riyadh, Jeddah, Makkah, Madinah, Taif, and Dammam. Fixed price taxi with licensed drivers and professional chauffeurs." } },
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
        name: "Confirm Fixed Price",
        text: "Review the instant fixed taxi fare with no hidden fees and provide your contact details.",
      },
      {
        name: "Receive Booking Confirmation",
        text: "Get your instant booking confirmation via WhatsApp or email with your licensed driver's details.",
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
          "text": "You can book a taxi in Saudi Arabia online through our website or via WhatsApp booking. Enter your pickup location, drop-off, date, and time to get an instant fixed price quote. Booking takes less than 2 minutes. Our 24/7 taxi service means you can book any time."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a Jeddah Airport to Makkah taxi cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A Jeddah Airport to Makkah taxi starts from SAR 249 in a sedan and SAR 349 in a GMC Yukon or Hyundai Staria. The taxi fare is fixed — no hidden charges or surge pricing. The journey takes about 1 hour 15 minutes (85 km)."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide Umrah taxi and Umrah transport service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We provide dedicated Umrah taxi and Umrah transport including Umrah airport transfers from Jeddah Airport to Makkah, Makkah to Madinah taxi, Madinah to Makkah taxi, and Makkah Ziyarat taxi and Madinah Ziyarat taxi services. Our licensed drivers stop at Meeqat and plan trips around prayer times."
        }
      },
      {
        "@type": "Question",
        "name": "What is the taxi fare from Makkah to Madinah?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Makkah to Madinah taxi fare starts from SAR 499 in a sedan (estimated — final price confirmed in your quotation). The fixed price taxi includes a Meeqat stop and bottled water. The journey covers 450 km and takes approximately 4 hours 30 minutes via the Haramain Highway."
        }
      },
      {
        "@type": "Question",
        "name": "What vehicles are available for airport transfer in Saudi Arabia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our Saudi airport transfer fleet includes executive sedans (Toyota Camry), luxury SUV taxis (GMC Yukon Denali XL), family taxis (Hyundai Staria VIP), group transport (Toyota Hiace), and VIP sedans (Mercedes S-Class). All vehicles are driven by professional chauffeurs with valid Saudi transport licenses."
        }
      },
      {
        "@type": "Question",
        "name": "Are your taxi prices fixed in Saudi Arabia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all our taxi prices in Saudi Arabia are fixed. The taxi fare you see at booking is the exact price you pay. We never apply surge pricing or hidden fees. You can check the taxi price for any route using our online calculator."
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
          "text": "Yes, WhatsApp booking is available 24/7. Simply message us your pickup location, destination, date, and time. Our team will confirm your booking with a fixed taxi price within minutes. You can also book airport transfers, Umrah taxis, and intercity rides through WhatsApp."
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
      <body className={cn(manrope.variable, geist.variable, cairo.variable, "font-sans antialiased bg-background text-foreground")}>
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
