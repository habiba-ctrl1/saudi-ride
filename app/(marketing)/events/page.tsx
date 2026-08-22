import { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MessageCircle, ArrowRight, MapPin } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { serviceSchema, speakableSchema, breadcrumbSchema } from "@/lib/schema";
import { EVENTS } from "@/lib/data/events";

const TITLE = "Event & Conference Transportation in Saudi Arabia | Riyadh";
const DESCRIPTION = "Private event, conference & exhibition transportation in Saudi Arabia — airport transfers, daily chauffeur standby, group and VIP cars for LEAP, Money20/20, Black Hat MEA & more. Fare on WhatsApp.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://taxisaudiarabia.com/events" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "https://taxisaudiarabia.com/events" },
};

export default function EventsHubPage() {
  const pillars = EVENTS.filter((e) => e.kind === "pillar");
  const named = EVENTS.filter((e) => e.kind === "event");
  const waLink = `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(
    "Salam, I need event / conference transportation in Saudi Arabia. My event, dates and group size are:",
  )}`;

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: "Event & Conference Transportation",
            description: DESCRIPTION,
            path: "/events",
            serviceType: "Event Transportation",
            areaServed: ["Riyadh", "Jeddah", "Dammam", "Saudi Arabia"],
          }),
          speakableSchema({ path: "/events" }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Events", href: "/events" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Events", href: "/events" }]} />

      {/* HERO */}
      <section className="section-container max-w-5xl pt-32 pb-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B] mb-6">
          <CalendarDays className="h-3 w-3" /> Event &amp; Conference Transport
        </span>
        <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-6">
          Event &amp; Conference Transportation in Saudi Arabia
        </h1>
        <p className="max-w-2xl text-sm md:text-base text-[#6B7280] leading-relaxed mb-8">
          Private transport built around your event — airport transfers, daily chauffeur standby, group vehicles, and VIP cars for conferences, exhibitions, and corporate events across Riyadh, Jeddah, and Dammam, all under one point of contact.
        </p>
        <div className="max-w-2xl mb-10">
          <TLDRSummary
            answer="We provide event and conference transportation across Saudi Arabia — private airport transfers, hourly and full-day chauffeur standby, group and delegation vehicles, and VIP executive cars — with your fare confirmed on WhatsApp."
            facts={[
              { label: "Coverage", value: "Riyadh · Jeddah · Dammam" },
              { label: "Vehicles", value: "Sedan · SUV · Van · Coaster" },
              { label: "Booking", value: "Transfer / standby / delegation" },
              { label: "Availability", value: "24/7" },
            ]}
          />
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-4 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all shadow-[0_4px_20px_rgba(22,163,74,0.3)]"
        >
          <MessageCircle className="h-4 w-4" /> Plan Event Transport on WhatsApp
        </a>
      </section>

      {/* NAMED EVENTS */}
      <section className="section-container max-w-5xl py-16 border-t border-[#C9A84C]/10">
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">Major Saudi Events We Serve</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {named.map((e) => (
            <Link key={e.slug} href={`/events/${e.slug}`} className="group rounded-2xl border border-[#16A34A]/12 bg-white p-6 hover:border-[#16A34A]/35 transition-all">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm">{e.shortName}</h3>
                <ArrowRight className="h-4 w-4 text-[#C9A84C] group-hover:translate-x-1 transition-transform" />
              </div>
              {e.edition && (
                <p className="text-xs text-[#6B7280] flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-[#C9A84C]" /> {e.edition.venue}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* PILLAR CATEGORIES */}
      <section className="section-container max-w-5xl py-16 border-t border-[#C9A84C]/10">
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">Event Transport Services</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {pillars.map((e) => (
            <Link key={e.slug} href={`/events/${e.slug}`} className="group flex items-center justify-between rounded-2xl border border-[#C9A84C]/20 bg-white px-5 py-4 hover:border-[#C9A84C]/45 transition-all">
              <span className="text-sm font-semibold">{e.h1}</span>
              <ArrowRight className="h-4 w-4 text-[#C9A84C] shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
