import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Landmark, MapPin, Clock, ShieldCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";

const TITLE = "Taif Ziyarat & Historical Taxi Tour | Rose Farms, Al-Hada & Islamic Heritage";
const DESCRIPTION = "Book a private Taif Ziyarat & mountain tour from Makkah or Jeddah. Visit Masjid Abdullah Ibn Abbas, Wadi Mitna, Al-Hada cable car, and Taif rose factories with licensed drivers.";
const OG_IMAGE = "https://taxisaudiarabia.com/services/taif-ziyarat-hero.webp";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/taif-ziyarat" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://taxisaudiarabia.com/services/taif-ziyarat",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Taif Ziyarat private taxi tour" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const SITES = [
  { name: "Masjid Abdullah Ibn Abbas", desc: "The historic mosque and burial place of the Prophet's cousin, Abdullah ibn Abbas (RA).", dist: "City Center" },
  { name: "Wadi Mitna & Addas Garden", desc: "The historic site where the Christian slave Addas offered grapes to the Prophet ﷺ.", dist: "10 km" },
  { name: "Al-Hada Mountain & Cable Car", desc: "Scenic mountain pass with cool weather, baboons, and panoramic views down to Makkah.", dist: "20 km" },
  { name: "Taif Rose Distilleries", desc: "Visit traditional rose oil factories and gardens (Al-Kadi, Rashid Al-Qurashi).", dist: "Shafa / Hada" },
  { name: "Shubra Palace Museum", desc: "The elegant royal palace built in 1905, former residence of King Abdulaziz.", dist: "Downtown" },
  { name: "Al-Shafa Mountain Resort", desc: "Highest peak in Taif known for fruit orchards, juniper trees, and cool climate.", dist: "25 km" },
];

const FEATURES = [
  { icon: MapPin, title: "Makkah & Jeddah Pickup", desc: "Direct private pickup from your hotel in Makkah or Jeddah, with comfortable air-conditioned vehicles." },
  { icon: Landmark, title: "Islamic & Cultural Heritage", desc: "Explore both sacred Islamic history (Wadi Mitna, Ibn Abbas) and scenic Taif mountain attractions." },
  { icon: Clock, title: "Full-Day Flexible Tour", desc: "Enjoy a relaxed 6 to 8 hour day trip. Stop for lunch, rose shopping, and mountain photography at your pace." },
  { icon: ShieldCheck, title: "Fixed All-Inclusive Fare", desc: "Clear upfront pricing with no hidden toll fees or fuel surcharges. Instant booking confirmation on WhatsApp." },
];

const FAQS = [
  { question: "How far is Taif from Makkah and how long does the tour take?", answer: "Taif is approximately 85 km from Makkah via the Al-Hada mountain road (~1 hour drive). A full day trip usually takes 6 to 8 hours." },
  { question: "Which sites are included in the Taif Ziyarat tour?", answer: "Our standard tour includes Masjid Abdullah Ibn Abbas, Wadi Mitna (Addas garden), Al-Hada cable car area, Shubra Palace, and a Taif rose factory." },
  { question: "Can we get picked up from Makkah or Jeddah?", answer: "Yes! We provide hotel pickup and drop-off from any hotel in Makkah, Jeddah, or Taif." },
  { question: "Can we stop at the Meeqat on the return to Makkah?", answer: "Yes. On the return journey to Makkah, your driver will stop at Qarn al-Manazil (Al-Sail Al-Kabeer) or Wadi Maharim Meeqat for Ihram." },
];

export default function TaifZiyaratPage() {
  const whatsappMsg = encodeURIComponent("Salam! I would like to book a Taif Ziyarat Tour from Makkah/Jeddah.");

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({ name: TITLE, description: DESCRIPTION, serviceType: "ChauffeurService", path: "/services/taif-ziyarat" }),
          faqSchema(FAQS),
          speakableSchema({ path: "/services/taif-ziyarat" }),
        ]}
      />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Taif Ziyarat", href: "/services/taif-ziyarat" },
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-[#121212] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-3.5 py-1 text-xs font-semibold text-[#C9A84C] mb-4">
              <Landmark className="h-3.5 w-3.5" /> Day Trip & Religious Heritage
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white">
              Taif Ziyarat & Historical Taxi Tour
            </h1>
            <p className="text-base sm:text-lg text-[#D4D4D4] leading-relaxed mb-6">
              Experience the cool mountains and sacred Islamic history of Taif. Private transfers from Makkah or Jeddah covering Masjid Ibn Abbas, Wadi Mitna, Al-Hada, and famous Rose distilleries.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`${contactConfig.whatsappLink}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
              >
                <MessageCircle className="h-5 w-5" /> Book Taif Tour on WhatsApp
              </a>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Calculate Tour Fare
              </Link>
            </div>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#C9A84C]/30 shadow-2xl">
            <Image
              src="/fleet/real/mercedes-v-class-fleet-lineup.webp"
              alt="Taif Ziyarat private VIP transfer"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <TLDRSummary
          answer="Taif Ziyarat is a popular day tour from Makkah (~85 km, 1 hour). Highlights include Masjid Abdullah Ibn Abbas, Wadi Mitna, Al-Hada mountain pass, and local rose farms. Includes Meeqat stop on return."
          facts={[
            { label: "Distance", value: "85 km from Makkah" },
            { label: "Duration", value: "6–8 Hours" },
            { label: "Pickup", value: "Hotel Door-to-Door" },
            { label: "Meeqat", value: "Qarn Al-Manazil Included" },
          ]}
          className="mb-12"
        />

        {/* Key Features Grid */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Why Book Your Taif Tour With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-sm">
                <f.icon className="h-8 w-8 text-[#006C35] mb-4" />
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-[#525252] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sites Covered Table */}
        <section className="mb-16 bg-white rounded-2xl p-8 border border-[#E5E5E5] shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Key Historical & Cultural Attractions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SITES.map((site, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-xl bg-[#FAFAF7] border border-[#E5E5E5]">
                <CheckCircle2 className="h-6 w-6 text-[#006C35] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-base text-[#1C1C1C]">{site.name}</h3>
                  <p className="text-sm text-[#525252] mt-1">{site.desc}</p>
                  <span className="inline-block mt-2 text-xs font-semibold text-[#006C35] bg-[#006C35]/10 px-2.5 py-0.5 rounded-full">
                    Location: {site.dist}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 border border-[#E5E5E5] shadow-sm">
                <h3 className="font-bold text-lg mb-2 text-[#1C1C1C]">{faq.question}</h3>
                <p className="text-sm text-[#525252] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <ServiceRelatedLinks currentPath="/services/taif-ziyarat" />
      </div>
    </div>
  );
}
