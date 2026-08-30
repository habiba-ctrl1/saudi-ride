import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { generateMetadata as seo } from "@/lib/seo";
import { serviceSchema, faqSchema, itemListSchema, speakableSchema, recoveryBusinessSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { RecoveryLeadForm } from "@/components/recovery/RecoveryLeadForm";
import { StickyRecoveryCTA } from "@/components/recovery/StickyRecoveryCTA";
import { recoveryContact } from "@/lib/config/contact";
import {
  RECOVERY_AR_CITIES,
  RECOVERY_SERVICES,
  RECOVERY_PRICE_FACTORS_AR,
  RECOVERY_GLOBAL_FAQS_AR,
} from "@/lib/data/recovery";
import { RECOVERY_ROUTES } from "@/lib/data/recovery-routes";
import { Truck, Clock, CheckCircle2, MessageCircle, Phone, Route as RouteIcon } from "lucide-react";

const BUSINESS_WA = recoveryContact.whatsappNumber;
const HERO_WA = "السلام عليكم، أحتاج سطحة / نقل سيارة. موقعي: ";

export const metadata: Metadata = seo({
  title: "سطحة الدمام والمنطقة الشرقية | سحب ونقل السيارات ٢٤ ساعة",
  description:
    "سطحة هيدروليك في الدمام والمنطقة الشرقية — سحب ونقل السيارات على مدار الساعة في الدمام والخبر والظهران والقطيف والأحساء، بالإضافة إلى نقل السيارات من الدمام إلى الرياض وجدة وينبع. السعر عبر واتساب.",
  path: "/ar/services/car-recovery",
  locale: "ar",
  image: "https://taxisaudiarabia.com/services/car-recovery-hero.webp",
  hreflangPaths: { en: "/services/car-recovery", ar: "/ar/services/car-recovery" },
});

export default function ArabicRecoveryHub() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-28">
      <JsonLd
        data={[
          serviceSchema({
            name: "خدمة سطحة وسحب السيارات (الدمام والمنطقة الشرقية)",
            description:
              "سطحة هيدروليك في الدمام والمنطقة الشرقية لسحب ونقل السيارات، بالإضافة إلى نقل السيارات بين المدن في السعودية.",
            path: "/ar/services/car-recovery",
            serviceType: "Vehicle Towing & Recovery",
            areaServed: [...RECOVERY_AR_CITIES.map((c) => c.name), "Eastern Province"],
          }),
          recoveryBusinessSchema({
            name: "سطحة الدمام — سحب ونقل السيارات",
            description: "سطحة هيدروليك في الدمام والمنطقة الشرقية على مدار الساعة، والسعر يؤكد عبر واتساب قبل التحرك.",
            path: "/ar/services/car-recovery",
            areaServed: [...RECOVERY_AR_CITIES.map((c) => c.name), "Eastern Province"],
            telephone: "+966539388072",
          }),
          faqSchema(RECOVERY_GLOBAL_FAQS_AR),
          itemListSchema([
            ...RECOVERY_AR_CITIES.map((c) => ({ name: c.sathaAr, href: `/ar/services/car-recovery/${c.slug}` })),
            ...RECOVERY_ROUTES.map((r) => ({ name: r.taglineAr, href: `/ar/services/car-recovery/${r.slug}` })),
          ]),
          speakableSchema({ path: "/ar/services/car-recovery" }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "الرئيسية", href: "/ar" },
          { name: "الخدمات", href: "/services" },
          { name: "سطحة وسحب السيارات", href: "/ar/services/car-recovery" },
        ]}
      />

      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image src="/services/car-recovery-hero.webp" alt="سطحة الدمام لسحب السيارات" fill priority className="object-cover opacity-65" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/50 to-[#FAFAF7]/15" />
        </div>
        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.7rem] font-bold text-[#16A34A] mb-6">
            <Clock className="h-3 w-3" /> ٢٤ ساعة · مقرنا في الدمام · المنطقة الشرقية
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            سطحة الدمام وسحب السيارات
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-6">
            سطحة هيدروليك من مقرنا في الدمام للأعطال والحوادث والمساعدة على الطريق في المنطقة الشرقية —{" "}
            <Link href="/ar/services/car-recovery/dammam" className="text-[#16A34A] hover:underline">الدمام</Link>،{" "}
            <Link href="/ar/services/car-recovery/al-khobar" className="text-[#16A34A] hover:underline">الخبر</Link>،{" "}
            <Link href="/ar/services/car-recovery/dhahran" className="text-[#16A34A] hover:underline">الظهران</Link>،{" "}
            <Link href="/ar/services/car-recovery/qatif" className="text-[#16A34A] hover:underline">القطيف</Link>،{" "}
            <Link href="/ar/services/car-recovery/al-ahsa" className="text-[#16A34A] hover:underline">الأحساء</Link> — بالإضافة إلى نقل السيارات إلى الرياض وجدة وينبع. السعر يؤكد عبر واتساب.
          </p>
          <div id="speakable-summary" className="max-w-2xl mx-auto mb-10 text-right">
            <TLDRSummary
              answer="سطحة من مقر في الدمام — خدمة على مدار الساعة في المنطقة الشرقية مع نقل السيارات بين المدن إلى الرياض وجدة وينبع. أرسل موقعك عبر واتساب لتأكيد السعر قبل تحرك السطحة."
              facts={[
                { label: "المقر", value: "الدمام" },
                { label: "التغطية", value: "المنطقة الشرقية + نقل بين المدن" },
                { label: "السعر", value: "عبر واتساب" },
              ]}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`https://wa.me/${BUSINESS_WA}?text=${encodeURIComponent(HERO_WA)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold text-white hover:bg-[#15803D] transition-all"
            >
              <MessageCircle className="h-4 w-4" /> اطلب السعر عبر واتساب
            </a>
            <a href={recoveryContact.phoneLink} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A84C] px-8 py-3.5 text-xs font-bold text-[#16A34A] hover:bg-[#C9A84C]/10 transition-all">
              <Phone className="h-4 w-4" /> اتصال مباشر
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-12 text-center">خدمات السطحة وسحب السيارات</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECOVERY_SERVICES.map((s) => (
            <div key={s.key} className="bg-white rounded-3xl p-8 border border-[#16A34A]/15">
              <Truck className="h-8 w-8 text-[#C9A84C] mb-4" />
              <h3 className="font-heading text-lg font-bold mb-3">{s.nameAr}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING FACTORS */}
      <section className="section-container max-w-4xl py-20 border-b border-[#C9A84C]/10">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold mb-4">كيف يُحتسب السعر</h2>
          <p className="text-[#6B7280] text-sm max-w-2xl mx-auto">لا توجد أسعار ثابتة معلنة — تحصل على سعر واضح ومؤكد عبر واتساب قبل تحرك السطحة.</p>
        </div>
        <div className="bg-white border border-[#16A34A]/15 rounded-3xl p-8">
          <ul className="grid sm:grid-cols-2 gap-3">
            {RECOVERY_PRICE_FACTORS_AR.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-[#6B7280]">
                <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5" /> {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* EASTERN CLUSTER */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-12 text-center">تغطية المنطقة الشرقية</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECOVERY_AR_CITIES.map((c) => (
            <Link key={c.slug} href={`/ar/services/car-recovery/${c.slug}`} className="group rounded-3xl overflow-hidden border border-[#16A34A]/12 bg-white hover:border-[#16A34A]/35 transition-all">
              <div className="relative h-44">
                <Image src={c.image} alt={c.sathaAr} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
                <div className="absolute bottom-4 right-4 left-4">
                  <p className="text-lg font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">{c.sathaAr}</p>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <p className="text-xs text-[#6B7280]">{c.taglineAr}</p>
                <span className="text-xs font-bold text-[#16A34A] shrink-0">التفاصيل ←</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ROUTES */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-4 text-center">نقل السيارات من الدمام بين المدن</h2>
        <p className="text-center text-[#6B7280] text-sm mb-12 max-w-2xl mx-auto">نقل محجوز على سطحة عبر المملكة — وليس طوارئ محلية. أرسل نوع السيارة والوجهة للحصول على السعر.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECOVERY_ROUTES.map((r) => (
            <Link key={r.slug} href={`/ar/services/car-recovery/${r.slug}`} className="rounded-3xl border border-[#C9A84C]/20 bg-white p-7 hover:border-[#C9A84C]/50 transition-all">
              <RouteIcon className="h-7 w-7 text-[#C9A84C] mb-4" />
              <h3 className="font-heading text-lg font-bold mb-2">{r.taglineAr}</h3>
              <p className="text-xs text-[#6B7280]">نحو {r.distanceKm} كم · نقل على سطحة</p>
              <span className="mt-4 inline-block text-xs font-bold text-[#16A34A]">اطلب السعر ←</span>
            </Link>
          ))}
        </div>
      </section>

      {/* LEAD FORM */}
      <section id="request" className="section-container max-w-3xl py-20 border-b border-[#C9A84C]/10 scroll-mt-24">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold mb-4">اطلب سطحة أو نقل سيارة</h2>
          <p className="text-[#6B7280] text-sm">أرسل التفاصيل عبر واتساب للحصول على سعر واضح — أو اتصل بسائق الدمام مباشرة.</p>
        </div>
        <RecoveryLeadForm lang="ar" sourceLabel="CAR RECOVERY — HUB — AR" waText={HERO_WA} />
      </section>

      {/* FAQ */}
      <section className="section-container max-w-4xl py-20">
        <h2 className="font-heading text-3xl font-bold mb-12 text-center">الأسئلة الشائعة</h2>
        <div className="space-y-6">
          {RECOVERY_GLOBAL_FAQS_AR.map((faq, i) => (
            <div key={i} className="bg-white border border-[#16A34A]/12 rounded-2xl p-6">
              <h3 className="font-bold text-[#1C1C1C] mb-3 flex items-start gap-3 text-base">
                <CheckCircle2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                {faq.question}
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed pr-8">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <StickyRecoveryCTA waText={HERO_WA} lang="ar" />
    </div>
  );
}
