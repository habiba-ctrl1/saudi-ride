import { Metadata } from "next";
import { HomePage } from "@/components/sections/home-page";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://taxisaudiarabia.com",
    languages: {
      en: "https://taxisaudiarabia.com",
      ar: "https://taxisaudiarabia.com/ar",
      "x-default": "https://taxisaudiarabia.com",
    },
  },
};

// Matches the FAQ section actually rendered in homeTranslations.en.faq.items
// (components/sections/home-page.tsx) — kept in sync manually since that
// content lives in a client component's translation object.
const HOME_FAQS = [
  {
    question: "How do I book a taxi in Saudi Arabia?",
    answer: "You can book a taxi in Saudi Arabia online via our booking console or directly through WhatsApp booking. Simply provide your pickup location, destination, date, and time. Our 24/7 taxi service team will confirm your ride with a clear price, usually within 1–2 hours.",
  },
  {
    question: "How much is a Jeddah Airport to Makkah taxi?",
    answer: "The taxi fare for a Jeddah Airport to Makkah taxi is confirmed on WhatsApp before booking — a fixed fare with no hidden charges or surge. Standard sedans and larger family vehicles like the Hyundai Staria are available.",
  },
  {
    question: "Do you offer Umrah transport from Madinah?",
    answer: "Yes, our Umrah transport covers the Makkah to Madinah taxi route, Madinah to Makkah taxi route, and Madinah Ziyarat taxi services. All Umrah taxi rides include stops at Meeqat and are driven by professional chauffeurs.",
  },
  {
    question: "Are the taxi drivers licensed and professional?",
    answer: "Absolutely. All our professional chauffeurs hold valid Saudi driving licenses. They speak English, Arabic, and Urdu, ensuring a smooth Saudi airport transfer and intercity experience.",
  },
  {
    question: "Do you have vehicles for large families or groups?",
    answer: "Yes, we offer luxury SUV taxis like the GMC Yukon and spacious vans like the Toyota Hiace and Hyundai Staria. These are perfect for group Umrah airport transfers and family taxi trips across Saudi Arabia.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd data={faqSchema(HOME_FAQS)} />
      <HomePage />
    </>
  );
}
