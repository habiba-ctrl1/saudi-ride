import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Analytics } from "@vercel/analytics/react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://riyadhtaxi.com"),
  title: "Riyadh Taxi | VIP Chauffeur & Premium Taxi Saudi Arabia",
  description:
    "Experience absolute luxury with Riyadh Taxi. Premium airport transfers, executive corporate travel, and bespoke VIP Umrah packages across Makkah, Madinah, Jeddah, and Riyadh.",
  keywords: [
    "Saudi luxury taxi service",
    "VIP chauffeur Riyadh",
    "Premium airport transfer KSA",
    "VIP Umrah transportation",
    "Luxury taxi Jeddah to Makkah",
    "Makkah to Madinah premium ride",
    "Saudi Arabia executive private car",
  ],
  openGraph: {
    title: "Riyadh Taxi | VIP Chauffeur & Premium Taxi Saudi Arabia",
    description:
      "Elite private transfers and bespoke luxury chauffeur service across the Kingdom of Saudi Arabia. Book Rolls Royce & premium fleet instantly.",
    type: "website",
    locale: "en_SA",
    url: "https://riyadhtaxi.com",
    siteName: "Riyadh Taxi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Riyadh Taxi | VIP Chauffeur & Premium Taxi Saudi Arabia",
    description:
      "Book ultra-premium taxis and executive chauffeurs for airport transfers, VIP Umrah, and city travel across Saudi Arabia.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TaxiService",
  "name": "Riyadh Taxi",
  "image": "https://riyadhtaxi.com/images/luxury-fleet.jpg",
  "@id": "https://riyadhtaxi.com/#taxiservice",
  "url": "https://riyadhtaxi.com",
  "telephone": "+966500123456",
  "priceRange": "$$$",
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
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    "opens": "00:00",
    "closes": "23:59",
  },
  "sameAs": [
    "https://facebook.com/riyadh.taxi",
    "https://instagram.com/riyadh.taxi",
    "https://youtube.com/riyadh.taxi",
  ],
  "areaServed": [
    {
      "@type": "AdministrativeArea",
      "name": "Riyadh",
    },
    {
      "@type": "AdministrativeArea",
      "name": "Makkah",
    },
    {
      "@type": "AdministrativeArea",
      "name": "Madinah",
    },
    {
      "@type": "AdministrativeArea",
      "name": "Jeddah",
    },
    {
      "@type": "AdministrativeArea",
      "name": "Dammam",
    },
    {
      "@type": "AdministrativeArea",
      "name": "AlUla",
    },
    {
      "@type": "AdministrativeArea",
      "name": "NEOM",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={cn(cormorant.variable, dmSans.variable, "font-sans antialiased bg-background text-foreground")}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
