import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://riyadhluxetaxi.com"),
  title: "Riyadh Luxe Taxi | Premium Taxi Service in Saudi Arabia",
  description:
    "Luxury taxi service in Saudi Arabia with airport transfers, Umrah tours, and city-to-city travel. Book premium rides instantly.",
  keywords: [
    "Saudi taxi service",
    "Riyadh luxury taxi",
    "Airport transfer Saudi Arabia",
    "Umrah transport",
    "City to city taxi KSA"
  ],
  openGraph: {
    title: "Riyadh Luxe Taxi",
    description:
      "Premium rides in Saudi Arabia with elegant vehicles, professional chauffeurs, and instant booking.",
    type: "website",
    locale: "en_SA",
    url: "https://riyadhluxetaxi.com"
  },
  twitter: {
    card: "summary_large_image",
    title: "Riyadh Luxe Taxi",
    description:
      "Book premium taxis for airport transfers, Umrah tours, and city travel across Saudi Arabia."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
