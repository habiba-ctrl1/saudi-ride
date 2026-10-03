import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Globe, ArrowRight, MessageCircle, Mail, CheckCircle2, UserCheck, Info } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema, itemListSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";
import { CrossBorderEssentials } from "@/components/cross-border/CrossBorderEssentials";
import { formatDrive } from "@/components/cross-border/CorridorRouteCards";
import { contactConfig } from "@/lib/config/contact";
import { CORRIDORS, CORRIDOR_SLUGS, corridorRoutes, corridorWhatsAppText } from "@/lib/data/cross-border";

// Pillar for the cross-border cluster. Rebuilt 2026-10-03:
// - P0: removed unsupported claims (vehicles "pre-authorized with all
//   necessary international permits", "Carnet de Passages", "pre-cleared
//   vehicle insurance", "fast-track lanes", "our cross-border fleet",
//   "drivers handle all border logistics / vehicle border paperwork").
// - Added Jordan; links down to the 5 corridor hubs (/cross-border/*) and
//   every live cross-border route (data from lib/data/cross-border.ts).
// TITLE and the H1 wording are unchanged on purpose (page ranks ~pos 18 —
// CLAUDE.md rule 3); a better title is proposed in seo/page-log.md.
// Title + H1 changed 2026-10-03 (owner-approved): adds Jordan and "private car".
const TITLE = "GCC & Jordan Cross-Border Taxi from Saudi Arabia | Private Car";
const DESCRIPTION =
  "Private cross-border transfers from Saudi Arabia to Bahrain, Qatar, Kuwait, the UAE and Jordan — pre-booked car with a professional driver, fixed fare confirmed on WhatsApp, 24/7.";
const OG_IMAGE = "https://taxisaudiarabia.com/services/border-crossings-hero.webp";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/border-crossings" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://taxisaudiarabia.com/services/border-crossings",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Private car for a cross-border transfer from Saudi Arabia" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
};

const FAQS = [
  { question: "Which countries can I travel to by car from Saudi Arabia with you?", answer: "We arrange private cross-border transfers between Saudi Arabia and Bahrain, Qatar, Kuwait, the UAE and Jordan. Each corridor has its own page with the border crossing used and the bookable routes." },
  { question: "Do I need a visa for a cross-border trip from Saudi Arabia?", answer: "Each passenger needs a valid passport or accepted ID and the right to enter the destination country; Saudi residents generally also need a valid exit and re-entry visa. Requirements depend on nationality and change, so confirm with official sources before travel. We do not arrange visas or immigration." },
  { question: "What happens at the border?", answer: "Your driver stays with the car while every passenger completes their own exit and entry checks. Border processing time varies with traffic, immigration, customs and official procedures and is never guaranteed, so we plan extra time around flights and meetings." },
  { question: "Is the car allowed to cross the border?", answer: "Not every vehicle can cross every border. When you request a quote, the car and driver for your date are confirmed as eligible for that specific crossing before we send the fixed fare." },
  { question: "How long does the King Fahd Causeway trip to Bahrain take?", answer: "Al Khobar to Manama is about 50 km and Dammam to Manama about 70 km — roughly an hour of driving. Border time on the causeway is extra and varies." },
  { question: "Can the same car wait and bring me back?", answer: "Yes. Book a return and the driver can wait for a same-day return, or collect you on a later date. Waiting time is included in the written quote." },
  { question: "Can my company get a written quote and invoice?", answer: "Yes. Email a corporate RFQ with routes, dates, passengers and vehicles and we reply in writing. Corporate invoicing can be arranged through our sister company." },
];

export default function BorderCrossingsPage() {
  const corridors = CORRIDOR_SLUGS.map((s) => {
    const c = CORRIDORS[s];
    return { c, ...corridorRoutes(c) };
  });

  return (
    <div className="min-h-screen bg-[#FAFAF7] pb-24 text-[#1C1C1C]">
      <JsonLd
        data={[
          serviceSchema({
            name: "Private cross-border transfer from Saudi Arabia",
            description: DESCRIPTION,
            path: "/services/border-crossings",
            serviceType: "Private cross-border transfer",
            areaServed: ["Saudi Arabia", "Bahrain", "Qatar", "Kuwait", "United Arab Emirates", "Jordan"],
          }),
          itemListSchema(corridors.map(({ c }) => ({ name: `${c.pairLabel.replace("↔", "–")} private transfer`, href: `/cross-border/${c.slug}` }))),
          faqSchema(FAQS),
          speakableSchema({ path: "/services/border-crossings" }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Border Crossings", href: "/services/border-crossings" },
        ]}
      />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden border-b border-[#16A34A]/10 pb-14 pt-10">
        <div className="absolute inset-0 z-0">
          <Image src="/services/border-crossings-hero.webp" alt="Private car on a highway between Saudi Arabia and a neighbouring country" fill priority sizes="100vw" className="object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/60 to-[#FAFAF7]/20" />
        </div>
        <div className="section-container relative z-10 max-w-4xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#16A34A]/25 bg-[#FFFFFF]/80 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#15803D]">
            <Globe className="h-3 w-3" aria-hidden /> Saudi Arabia · GCC · Jordan
          </span>
          <h1 className="font-heading mb-5 text-4xl font-bold leading-tight md:text-5xl">
            GCC &amp; Jordan cross-border taxi <span className="text-[#16A34A]">from Saudi Arabia</span>
          </h1>
          <p className="mx-auto mb-7 max-w-2xl text-sm leading-relaxed text-[#475569] md:text-base">
            A pre-booked private car with a professional driver, from your door in Saudi Arabia to Bahrain, Qatar, Kuwait, the UAE or Jordan — and back. One fixed fare in writing before you book.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#cross-border-quote" className="btn btn-primary btn-lg">Request a Cross-Border Quote</a>
            <a href="#corridors" className="btn btn-secondary btn-lg">Choose your country</a>
          </div>
        </div>
      </section>

      <div className="section-container mt-10 max-w-5xl space-y-14">
        <TLDRSummary
          answer="Taxi Saudi Arabia arranges private cross-border transfers from Saudi Arabia to Bahrain (King Fahd Causeway), Qatar (Salwa–Abu Samra), Kuwait (Al Khafji–Nuwaiseeb), the UAE (Al Batha–Ghuwaifat) and Jordan (Halat Ammar–Al Mudawwara or Al Durrah, whichever is shorter). You get one car and driver door to door and a fixed fare in writing; each passenger carries their own valid documents and completes the border checks in person."
          facts={[
            { label: "Countries", value: "5 corridors" },
            { label: "Shortest", value: "Al Khobar–Manama ~50 km" },
            { label: "Fare", value: "Fixed, in writing" },
            { label: "Hours", value: "24/7" },
          ]}
        />

        {/* ─── WHAT WE DO / WHAT YOU DO (replaces the old unsupported-claims block) ─── */}
        <section aria-labelledby="bc-honest" className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 sm:p-7">
            <h2 id="bc-honest" className="font-heading flex items-center gap-2 text-xl font-bold">
              <CheckCircle2 className="h-5 w-5 text-[#16A34A]" aria-hidden /> What we arrange
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[#475569]">
              <li>A private car and professional driver from our vetted partner network, door to door.</li>
              <li>A vehicle confirmed as eligible for your specific crossing before we quote.</li>
              <li>A pickup time planned with margin for the border, flights and meetings.</li>
              <li>One-way, return or waiting — priced as one fixed fare with border crossing fees included, no meter, no surge.</li>
              <li>15–30 minutes of free waiting on every trip.</li>
              <li>Written quotes for companies; corporate invoicing can be arranged through our sister company.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-[#FACC15]/40 bg-[#FEFCE8] p-6 sm:p-7">
            <h2 className="font-heading flex items-center gap-2 text-xl font-bold">
              <UserCheck className="h-5 w-5 text-[#A16207]" aria-hidden /> What passengers handle
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[#475569]">
              <li>Valid passports or accepted ID, and the right to enter the destination country.</li>
              <li>Saudi residents: a valid exit and re-entry visa where it applies.</li>
              <li>Completing their own exit and entry checks at the border, in person.</li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-[#6B7280]">
              We do not arrange visas, permits or immigration, and border processing time is never guaranteed.
            </p>
          </div>
        </section>

        {/* ─── CORRIDORS ─── */}
        <section id="corridors" aria-labelledby="bc-corridors" className="scroll-mt-24">
          <span className="t-eyebrow">Choose your corridor</span>
          <h2 id="bc-corridors" className="font-heading mt-1 text-3xl font-bold">Cross-border routes by country</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B7280]">
            Distances and drive times exclude border time. Each country page explains the crossing, practical notes and every route in both directions.
          </p>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {corridors.map(({ c, outbound, inbound }) => (
              <article key={c.slug} className="flex flex-col rounded-3xl border border-[#16A34A]/12 bg-white p-6 transition-colors hover:border-[#16A34A]/35">
                <div className="flex items-start justify-between gap-3 border-b border-[#16A34A]/10 pb-4">
                  <div>
                    <h3 className="font-heading text-2xl font-bold">
                      <Link href={`/cross-border/${c.slug}`} className="hover:text-[#16A34A]">Saudi Arabia to {c.country}</Link>
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[#15803D]">
                      <Globe className="h-4 w-4" aria-hidden /> {c.saudiSide.split(" (")[0]} – {c.otherSide.split(" (")[0]}
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(corridorWhatsAppText(c))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-[#16A34A] px-3.5 text-[0.68rem] font-bold uppercase tracking-wide text-[#FFFFFF] hover:bg-[#15803D]"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden /> Quote
                  </a>
                </div>
                <ul className="mt-4 flex-1 space-y-1.5">
                  {[...outbound, ...inbound].map((r) => (
                    <li key={r.slug}>
                      <Link href={`/routes/${r.slug}`} className="flex items-baseline justify-between gap-3 text-sm hover:text-[#16A34A]">
                        <span className="font-semibold">{r.fromCity} to {r.toCity}</span>
                        <span className="shrink-0 text-xs text-[#6B7280]">~{r.distance.toLocaleString("en-US")} km · {formatDrive(r.duration)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={`/cross-border/${c.slug}`} className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#16A34A] hover:underline">
                  {c.country} transfer guide &amp; border details <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-5 flex gap-3 rounded-2xl border border-[#16A34A]/20 bg-[#F0FDF4] p-4 text-sm leading-relaxed text-[#166534]">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <p>
              Oman, and trips between two other GCC countries (for example Dubai to Doha), are not listed routes. Ask on WhatsApp and we will tell you honestly whether we can arrange it before quoting.
            </p>
          </div>
        </section>

        <CrossBorderEssentials />

        {/* ─── FAQ ─── */}
        <section aria-labelledby="bc-faq">
          <h2 id="bc-faq" className="font-heading text-3xl font-bold">Cross-border transfer questions</h2>
          <div className="mt-6 space-y-3">
            {FAQS.map((f) => (
              <details key={f.question} className="rounded-2xl border border-[#16A34A]/12 bg-white p-5 open:border-[#16A34A]/35">
                <summary className="cursor-pointer list-none font-semibold marker:hidden">
                  <h3 className="inline">{f.question}</h3>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ─── BOOKING (Path A + Path B) ─── */}
        <section id="cross-border-quote" className="scroll-mt-24 rounded-3xl border border-[#16A34A]/20 bg-[#F0FDF4] p-5 sm:p-8">
          <div className="mx-auto mb-6 max-w-2xl text-center">
            <h2 className="font-heading text-2xl font-bold md:text-3xl">Get your cross-border transfer quote</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              Tell us where from, where to and when. We confirm an eligible vehicle and send one fixed fare on WhatsApp. Companies can request a written quote by email.
            </p>
          </div>
          <WhatsAppQuoteForm
            pickupPlaceholder="Pickup city & address in Saudi Arabia"
            dropoffPlaceholder="Destination — Bahrain, Doha, Kuwait City, Dubai, Aqaba…"
            messageIntro="Hello, I'd like a quote for a private cross-border transfer."
            showNotes
            submitLabel="Request a Cross-Border Quote"
          />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${contactConfig.email}?subject=${encodeURIComponent("Corporate cross-border transfer RFQ")}&body=${encodeURIComponent("Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for private cross-border transfers.\n\n• Company / group name: \n• Contact name & role: \n• Route(s) (from → to, country): \n• Dates & times: \n• Passengers per trip: \n• Vehicle(s) needed (Executive sedan / SUV / Van / Coaster): \n• One-way, return or waiting: \n• Corporate invoicing (VAT / PO)?: \n\nOur travellers carry their own valid travel documents. Please confirm a fixed fare before booking.\n\nThank you.")}`}
              className="btn btn-secondary btn-lg"
            >
              <Mail className="h-4 w-4" aria-hidden /> Email a corporate RFQ
            </a>
          </div>
        </section>
      </div>
      <ServiceRelatedLinks currentPath="/services/border-crossings" />
    </div>
  );
}
