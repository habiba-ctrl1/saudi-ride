import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Landmark, Languages, ShieldCheck, HeartHandshake, CheckCircle2, MessageCircle } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/umrah-transport" },
  title: "Umrah Taxi Service | Jeddah to Makkah & Madinah Transfers",
  description: "Umrah taxi service in Saudi Arabia — airport to Makkah, Makkah to Madinah, Ziyarat tours & Meeqat stops. English, Arabic & Urdu drivers. Fixed prices, 24/7.",
};

const PACKAGES = [
  {
    title: "Airport to Makkah (One-Way)",
    desc: "Direct VIP transfer from Jeddah Airport to your Makkah hotel.",
    price: "From SAR 249",
    features: ["Meet & Greet at Arrivals", "Luggage Assistance", "Zamzam Water Provided", "Direct Haram Drop-off"]
  },
  {
    title: "Full Umrah Package",
    desc: "Complete transport solution for your entire journey.",
    price: "From SAR 1,200",
    features: ["JED to Makkah", "Makkah to Madinah", "Madinah to Airport", "24/7 Support via WhatsApp"]
  },
  {
    title: "Ziyarat Tours (Makkah or Madinah)",
    desc: "4-hour guided transport to historical Islamic sites.",
    price: "From SAR 250",
    features: ["Jabal Al-Nour / Quba Mosque", "Knowledgeable Driver", "Flexible Timing", "Comfortable SUV/Van"]
  }
];

const TESTIMONIALS = [
  {
    quote: "Our driver was extremely respectful and spoke fluent Urdu, which helped my parents immensely. The SUV was pristine. Made our Umrah journey so peaceful.",
    author: "Tariq Mahmood",
    location: "UK"
  },
  {
    quote: "We booked the full package. From landing in Jeddah to our Ziyarat in Madinah, the service was flawless. They even guided us on the best time to visit the Rawdah.",
    author: "Fatima Al-Sayed",
    location: "UAE"
  }
];

const FAQS = [
  {
    q: "Where do you drop us off in Makkah?",
    a: "We drop you off directly at your hotel's lobby. If your hotel is located on the immediate Haram boundary where vehicles are restricted during prayer times, we will safely drop you at the closest permitted security checkpoint."
  },
  {
    q: "What languages do your drivers speak?",
    a: "We understand pilgrims come from all over the world. Our drivers speak fluent Arabic, English, Urdu, and Hindi. You can request a specific language during booking."
  },
  {
    q: "Can you take us to the Miqat if we forgot to enter Ihram?",
    a: "Yes. If you land in Jeddah and need to assume Ihram, we can arrange a dedicated trip to the nearest Miqat (Al-Juhfah) before heading to Makkah."
  },
  {
    q: "Is Jeddah a Miqat for Umrah?",
    a: "No. Jeddah lies inside the Miqat boundary, so you must enter Ihram before crossing the Miqat — usually announced on your flight before landing. If you arrive without it, we can stop at Al-Juhfah on the way to Makkah."
  },
  {
    q: "How far is Jeddah Airport from Makkah for Umrah?",
    a: "King Abdulaziz International Airport (JED) is about 80 km from Makkah — roughly a 1-hour direct transfer, with an optional Miqat stop for Ihram."
  }
];

export default function UmrahTransportPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: "Umrah Taxi Service",
            description:
              "Dedicated Umrah taxi service in Saudi Arabia — Jeddah Airport to Makkah transfers, Makkah to Madinah rides, Ziyarat tours, and Meeqat stops with multilingual drivers.",
            path: "/services/umrah-transport",
            serviceType: "Umrah Transport",
            areaServed: ["Makkah", "Madinah", "Jeddah"],
          }),
          faqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
          speakableSchema({ path: "/services/umrah-transport" }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Umrah Taxi", href: "/services/umrah-transport" },
        ]}
      />
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/services/umrah-transport-hero.webp" 
            alt="Makkah Umrah Pilgrimage" 
            fill 
            className="object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/80 to-[#FAFAF7]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B] mb-6">
            <Landmark className="h-3 w-3" /> Spiritual Journeys
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Premium Transport for <br />
            <span className="text-[#16A34A]">Your Sacred Journey</span>
          </h1>
          <p id="speakable-summary" className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-10">
            Serving the Guests of Allah with dignity, comfort, and unmatched reliability. From Jeddah Airport arrivals to complete Ziyarat tours in Madinah.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
            >
              Book Umrah Transfer
            </Link>
          </div>
        </div>
      </section>

      {/* ─── KNOWLEDGE SECTION ────────────────────────────────────── */}
      <section className="section-container max-w-6xl py-20 border-b border-[#C9A84C]/10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-3xl font-bold mb-4">Dedicated to Pilgrims</h2>
              <p className="text-[#6B7280] leading-relaxed">
                We understand that Umrah is a profoundly physical and spiritual undertaking. Our drivers are trained specifically in the logistics of Makkah and Madinah to ensure you face zero transport stress.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-[#C9A84C]/10 p-3 rounded-xl h-fit">
                  <Languages className="h-6 w-6 text-[#C9A84C]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1C1C1C] mb-1">English, Arabic & Urdu Drivers</h4>
                  <p className="text-sm text-[#6B7280]">Our team includes drivers fluent in Arabic, English, and Urdu to ensure perfect communication with you and your family.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-[#C9A84C]/10 p-3 rounded-xl h-fit">
                  <ShieldCheck className="h-6 w-6 text-[#C9A84C]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1C1C1C] mb-1">Haram Drop-Off Expertise</h4>
                  <p className="text-sm text-[#6B7280]">Navigating road closures during Salah (prayer) times requires deep local knowledge. We guarantee the closest possible legal drop-off to your hotel.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-[#C9A84C]/10 p-3 rounded-xl h-fit">
                  <HeartHandshake className="h-6 w-6 text-[#C9A84C]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1C1C1C] mb-1">Elderly & Family Friendly</h4>
                  <p className="text-sm text-[#6B7280]">Spacious SUVs and Vans available with ample room for wheelchairs, large luggage, and large families.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative h-[500px] rounded-3xl overflow-hidden border border-[#16A34A]/15">
            <Image src="/services/madinah-ziyarat-hero.webp" alt="Madinah Ziyarat Transport" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-[#C9A84C]/30">
                <p className="text-xs text-[#C9A84C] font-bold uppercase tracking-wider mb-2">Ziyarat Guidance</p>
                <p className="text-sm text-[#1C1C1C]">Our drivers can guide you to all historical sites including Jabal Uhud, Quba Mosque, and Jabal Al-Nour with dedicated waiting time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── UMRAH FROM JEDDAH (journey + internal linking) ───────── */}
      <section className="section-container max-w-5xl py-20 border-b border-[#C9A84C]/10">
        <div className="mb-12">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B]">The Gateway</span>
          <h2 className="font-heading text-3xl font-bold mt-2 mb-4">Your Umrah Journey from Jeddah, Step by Step</h2>
          <p className="text-[#6B7280] leading-relaxed max-w-2xl">
            Most pilgrims begin Umrah by landing at King Abdulaziz International Airport (JED) in Jeddah — the Kingdom&apos;s main gateway. Here is the full transport chain we handle for you, from arrival to your return flight.
          </p>
        </div>
        <ol className="space-y-4">
          {[
            { n: 1, title: "Arrive at Jeddah Airport (JED)", desc: "Meet & greet at arrivals with a name sign, 24/7 — even on late-night flights. We track your flight for delays.", href: "/airports/king-abdulaziz-jeddah", cta: "Jeddah Airport taxi" },
            { n: 2, title: "Enter Ihram at the Miqat", desc: "Enter Ihram on the plane, or ask the driver to stop at the Miqat (Al-Juhfah) if you land without it.", href: "/guides/miqat-jeddah-makkah", cta: "Miqat & Ihram guide" },
            { n: 3, title: "Transfer to Makkah (~80 km, ~1 hr)", desc: "Direct, fixed-price ride from the airport to your Makkah hotel, as close to the Haram as vehicles are permitted.", href: "/routes/jeddah-airport-to-makkah", cta: "JED → Makkah route" },
            { n: 4, title: "Makkah Ziyarat", desc: "Visit Jabal Al-Nour, Mina, Arafat and other sites with a knowledgeable driver and flexible waiting time.", href: "/services/makkah-ziyarat", cta: "Makkah Ziyarat tour" },
            { n: 5, title: "Travel to Madinah (~420 km)", desc: "Comfortable long-distance transfer via the Haramain highway, with prayer and rest stops on request.", href: "/routes/jeddah-to-madinah", cta: "Jeddah → Madinah route" },
            { n: 6, title: "Madinah Ziyarat & return", desc: "Visit Masjid an-Nabawi, Quba, and Uhud, then a smooth transfer back to the airport for your flight home.", href: "/services/madinah-ziyarat", cta: "Madinah Ziyarat tour" },
          ].map((step) => (
            <li key={step.n} className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-[#C9A84C]/10">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-sm font-bold text-[#16A34A]">{step.n}</span>
              <div>
                <h3 className="font-bold text-[#1C1C1C] mb-1">{step.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-2">{step.desc}</p>
                <Link href={step.href} className="text-xs font-bold uppercase tracking-wider text-[#16A34A] hover:underline">{step.cta} &rarr;</Link>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Link href="/guides/jeddah-airport-to-makkah-guide" className="text-sm font-bold text-[#16A34A] hover:underline">
            Read the full Jeddah Airport to Makkah transfer guide &rarr;
          </Link>
        </div>
      </section>

      {/* ─── PACKAGES ─────────────────────────────────────────────── */}
      <section className="section-container max-w-7xl py-20">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Umrah Transport Packages</h2>
          <p className="text-[#6B7280]">Choose the transport tier that fits your pilgrimage needs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PACKAGES.map((pkg, i) => (
            <div key={i} className="bg-white border border-[#16A34A]/12 rounded-3xl p-8 flex flex-col hover:border-[#16A34A]/35 transition-colors">
              <h3 className="font-heading text-xl font-bold mb-2 text-[#1C1C1C]">{pkg.title}</h3>
              <p className="text-sm text-[#6B7280] mb-6 min-h-[40px]">{pkg.desc}</p>
              <div className="text-2xl font-bold text-[#16A34A] mb-8">{pkg.price}</div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {pkg.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#6B7280]">
                    <CheckCircle2 className="h-4 w-4 text-[#C9A84C] shrink-0 mt-0.5" />
                    {feat}
                  </li>
                ))}
              </ul>

              <Link
                href="/book"
                className="w-full text-center rounded-full border border-[#C9A84C]/30 py-3 text-xs font-bold uppercase text-[#C9A84C] hover:bg-[#16A34A] hover:text-white transition-all"
              >
                Select Package
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="bg-white py-20 border-y border-[#C9A84C]/10">
        <div className="section-container max-w-5xl">
          <h2 className="font-heading text-3xl font-bold mb-12 text-center">Words from Pilgrims</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((test, i) => (
              <div key={i} className="bg-[#FAFAF7] p-8 rounded-3xl border border-[#C9A84C]/10">
                <p className="text-[#6B7280] italic leading-relaxed mb-6">&quot;{test.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] font-bold">
                    {test.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1C1C1C]">{test.author}</p>
                    <p className="text-xs text-[#6B7280]">{test.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────── */}
      <section className="section-container max-w-4xl py-20">
        <h2 className="font-heading text-3xl font-bold mb-12 text-center">Umrah Transport FAQ</h2>
        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white border border-[#16A34A]/12 rounded-2xl p-6">
              <h4 className="font-bold text-[#1C1C1C] mb-3 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                {faq.q}
              </h4>
              <p className="text-sm text-[#6B7280] leading-relaxed pl-8">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="section-container max-w-5xl pb-20">
        <div className="bg-white border border-[#16A34A]/15 shadow-lg rounded-3xl p-12 text-center">
          <h2 className="font-heading text-2xl font-bold mb-4 text-[#1C1C1C]">Have custom itinerary requirements?</h2>
          <p className="text-[#6B7280] mb-8 max-w-lg mx-auto">
            Our team is available 24/7 on WhatsApp to help you plan complex family itineraries across Makkah and Madinah.
          </p>
          <a
            href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam, I need help planning my Umrah transportation.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C] px-8 py-4 text-xs font-bold uppercase text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
          >
            <MessageCircle className="h-4 w-4" /> Message on WhatsApp
          </a>
        </div>
      </section>
      <ServiceRelatedLinks currentPath="/services/umrah-transport" />
    </div>
  );
}
