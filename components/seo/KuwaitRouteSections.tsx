import Link from "next/link";
import { MapPin, Navigation, ShieldCheck, CheckCircle2, MessageSquare } from "lucide-react";

// Config-driven bespoke sections for Kuwait cross-border route pages. One
// component serves every Kuwait → Saudi corridor (Dammam, Riyadh, …) so the
// route template stays lean and the cluster stays consistent. All facts come
// from the config passed in — no numbers are invented here.
const ICONS = { MapPin, Navigation, ShieldCheck } as const;

export interface KuwaitRouteConfig {
  /** Destination city label, e.g. "Dammam" / "Riyadh". */
  destination: string;
  /** Region label used in coverage copy, e.g. "the Eastern Province" / "Riyadh". */
  dropoffRegionLabel: string;
  /** Hedged distance label reused in copy, e.g. "~436 km". */
  distanceLabel: string;
  /** Phrase for the drive length in the border note, e.g. "roughly 4-hour drive". */
  drivePhrase: string;
  journeySteps: { title: string; desc: string; icon: keyof typeof ICONS }[];
  pickupAreas: string[];
  dropoffAreas: string[];
  whyBook: { title: string; desc: string }[];
  /** Contextual links shown in the border section (must be existing pages). */
  borderLinks: { href: string; label: string }[];
}

interface Props {
  slug: string;
  fromCity: string;
  toCity: string;
  whatsappNumber: string;
  config: KuwaitRouteConfig;
}

export function KuwaitRouteSections({ fromCity, toCity, whatsappNumber, config }: Props) {
  const bookHref = `/book?pickup=${encodeURIComponent(fromCity)}&dropoff=${encodeURIComponent(toCity)}`;
  const waPrefill = encodeURIComponent(
    `Salam! I want to book a private taxi from Kuwait to ${config.destination}.\n\n` +
      `• Pickup (Kuwait area): \n` +
      `• Drop-off (${config.destination} area): \n` +
      `• Travel date: \n` +
      `• Travel time: \n` +
      `• Passengers & luggage: \n` +
      `• Vehicle (Sedan / SUV / Van): `,
  );

  return (
    <>
      {/* How the journey works */}
      <section className="bg-white border border-[#16A34A]/15 rounded-3xl p-8 shadow-sm">
        <div className="mb-8">
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#C9A84C] font-bold">Cross-Border Journey</span>
          <h2 className="font-heading text-2xl font-bold mt-1 text-[#1C1C1C]">
            How the Kuwait to {config.destination} Journey Works
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {config.journeySteps.map((s, idx) => {
            const Icon = ICONS[s.icon];
            return (
              <div key={idx} className="bg-[#FAFAF7] rounded-2xl p-5 border border-[#16A34A]/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#16A34A] text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    <Icon className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <h3 className="font-bold text-sm text-[#1C1C1C] mb-1.5">{s.title}</h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pickup & drop-off coverage */}
      <section className="bg-white border border-[#16A34A]/12 rounded-3xl p-8 shadow-sm">
        <h2 className="font-heading text-2xl font-bold mb-2 flex items-center gap-3">
          <MapPin className="text-[#C9A84C]" />
          Where We Pick Up and Drop Off
        </h2>
        <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed mb-6 max-w-2xl">
          Every booking is door-to-door, so the areas below are examples of where we collect and drop off — not a fixed list. Share your exact pickup and destination when booking.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#16A34A]/12 bg-[#FAFAF7] p-5">
            <h3 className="font-bold text-sm text-[#1C1C1C] mb-3">Kuwait pickup areas</h3>
            <ul className="space-y-2">
              {config.pickupAreas.map((a) => (
                <li key={a} className="flex items-center gap-2 text-xs text-[#334155]">
                  <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0" /> {a}
                </li>
              ))}
              <li className="text-[0.7rem] text-[#6B7280] pt-1">…and any other address in Kuwait.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[#16A34A]/12 bg-[#FAFAF7] p-5">
            <h3 className="font-bold text-sm text-[#1C1C1C] mb-3">{config.destination} drop-off options</h3>
            <ul className="space-y-2">
              {config.dropoffAreas.map((a) => (
                <li key={a} className="flex items-center gap-2 text-xs text-[#334155]">
                  <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0" /> {a}
                </li>
              ))}
              <li className="text-[0.7rem] text-[#6B7280] pt-1">…or your exact address in {config.dropoffRegionLabel}.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Border crossing & documents */}
      <section className="bg-white border border-[#C9A84C]/25 rounded-3xl p-8 relative overflow-hidden shadow-sm">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#16A34A]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Border Crossing &amp; Documents
          </span>
          <h2 className="font-heading text-2xl font-bold text-[#1C1C1C]">
            Crossing the Kuwait–Saudi Border
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
            The Kuwait to {config.destination} route uses the land crossing at Nuwaiseeb on the Kuwaiti side and Al Khafji on the Saudi side. Every traveller clears immigration and customs in person with their own passport. Your driver knows the crossing and assists with the process, but <strong className="text-[#334155] font-semibold">each passenger is responsible for their own visa and entry eligibility</strong>.
          </p>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
            Entry rules depend on your nationality and can change, so confirm current requirements with the official Saudi and Kuwaiti government sources before you travel — for Saudi entry, the Ministry of Foreign Affairs visa portal (visa.mofa.gov.sa) is the authoritative reference. Border-crossing time is separate from the {config.drivePhrase} and varies with traffic and checks; it can be longer on weekends and public holidays.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-bold">
            {config.borderLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-[#16A34A] hover:underline inline-flex items-center gap-1">
                {l.label} &rarr;
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why book / what's included */}
      <section className="bg-gradient-to-r from-[#F0FDF4] via-white to-[#F0FDF4] border border-[#16A34A]/20 rounded-3xl p-8 shadow-sm">
        <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2 text-[#1C1C1C]">
          <ShieldCheck className="h-5 w-5 text-[#16A34A]" />
          Why Book This Kuwait to {config.destination} Transfer
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {config.whyBook.map((item, idx) => (
            <div key={idx} className="flex gap-3 bg-white p-4 rounded-2xl border border-[#16A34A]/12 shadow-2xs">
              <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-xs text-[#1C1C1C]">{item.title}</h3>
                <p className="text-[0.7rem] text-[#6B7280] mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inline booking CTA before FAQ */}
      <section className="premium-dark-section bg-gradient-to-br from-[#16A34A] to-[#116B32] rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl space-y-6">
        <div className="max-w-xl mx-auto space-y-3">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold">
            Ready to Travel from Kuwait to {config.destination}?
          </h2>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Send us your pickup area, destination, travel date and time, passenger count and luggage on WhatsApp, and we confirm your fixed fare before you book.
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-bold uppercase tracking-wider pt-2">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${waPrefill}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#FACC15] px-8 py-3.5 text-[#1C1C1C] hover:bg-[#e5b810] transition-all hover:scale-105 shadow-md inline-flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Get a Kuwait → {config.destination} Quote
          </a>
          <Link
            href={bookHref}
            className="rounded-full bg-white px-7 py-3.5 text-[#16A34A] hover:bg-white/90 transition-all hover:scale-105"
          >
            Book Online
          </Link>
        </div>
      </section>
    </>
  );
}
