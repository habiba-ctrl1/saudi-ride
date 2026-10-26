import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Users } from "lucide-react";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { contactConfig } from "@/lib/config/contact";
import { GMC_CITY_COPY_AR, GMC_QUOTE_FACTORS_AR, type GmcCityAr } from "@/lib/data/gmc-cities-ar";
import { Head, wa } from "@/components/ar/AlulaArabic";

// Arabic twin of components/location/cluster/GmcSection.tsx. No capacity,
// year, trim or price — see lib/data/gmc-cities-ar.ts.
export function GmcSectionAr({ city }: { city: GmcCityAr }) {
  const c = GMC_CITY_COPY_AR[city];
  return (
    <section id="gmc" aria-labelledby="gmc-heading" className="scroll-mt-24">
      <Head id="gmc-heading" eyebrow="السيارة المميزة" title={c.heading} intro={c.intro} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-white">
          <div className="relative aspect-[4/3] bg-[#F3F4F6]">
            <Image src="/fleet/gmc-yukon-xl.webp" alt="سيارة جي إم سي يوكون إكس إل دفع رباعي كبيرة متاحة عبر شبكة الشركاء" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" loading="lazy" />
          </div>
          <div className="space-y-4 p-6">
            <p className="flex items-start gap-2 text-sm leading-relaxed text-[#4B5563]">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />
              تُؤكَّد سعة الركاب والحقائب بحسب مجموعتك عند عرض السعر. وتتوفر عبر شبكة الشركاء نفسها سيارات دفع رباعي أخرى وسيارات سيدان تنفيذية وحافلات صغيرة.
            </p>
            <TrackedLink
              href={wa(c.waPrefill)}
              target="_blank"
              rel="noopener noreferrer"
              kind="whatsapp"
              sourceLocation={`gmc_section_${city}_ar`}
              contactUsed={contactConfig.whatsappNumber}
              path={c.path}
              routeId={`gmc_${city}`}
              locale="ar"
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 text-sm font-bold text-white hover:bg-[#15803D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> اطلب عرض سعر جي إم سي على واتساب
            </TrackedLink>
          </div>
        </div>
        <div className="space-y-6">
          <ul className="grid gap-3 sm:grid-cols-2">
            {c.useCases.map((u) => (
              <li key={u.title} className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h3 className="font-heading text-[0.95rem] font-bold text-[#1C1C1C]">{u.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#4B5563]">{u.text}</p>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-[#FACC15]/40 bg-[#FFFBEB] p-5">
            <h3 className="font-heading text-[0.95rem] font-bold text-[#1C1C1C]">متى لا تكون جي إم سي الخيار الأنسب؟</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#4B5563]">{c.alternative}</p>
          </div>
          <div>
            <h3 className="font-heading text-[0.95rem] font-bold text-[#1C1C1C]">ما الذي يعتمد عليه عرض السعر؟</h3>
            <ul className="mt-2 grid gap-x-6 gap-y-1 text-sm text-[#4B5563] sm:grid-cols-2">
              {GMC_QUOTE_FACTORS_AR.map((f) => (
                <li key={f} className="before:ml-2 before:text-[#16A34A] before:content-['•']">{f}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-[#6B7280]">نسعّر كل رحلة على حدة، ويُتفق على السعر قبل الحجز.</p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {c.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[#16A34A]/30 px-4 text-xs font-bold text-[#15803D] hover:bg-[#F0FDF4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
                  {l.label} <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
