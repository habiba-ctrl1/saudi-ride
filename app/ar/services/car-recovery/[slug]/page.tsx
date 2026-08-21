import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateMetadata as seo } from "@/lib/seo";
import { serviceSchema, faqSchema, recoveryBusinessSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RecoveryLeadForm } from "@/components/recovery/RecoveryLeadForm";
import { StickyRecoveryCTA } from "@/components/recovery/StickyRecoveryCTA";
import { recoveryContact } from "@/lib/config/contact";
import {
  RECOVERY_AR_CITIES,
  RECOVERY_SERVICES,
  RECOVERY_GLOBAL_FAQS_AR,
  getRecoveryCity,
} from "@/lib/data/recovery";
import { RECOVERY_ROUTES, getRecoveryRoute } from "@/lib/data/recovery-routes";
import { Truck, MapPin, Clock, Route as RouteIcon, CheckCircle2, MessageCircle, Phone, PackageCheck } from "lucide-react";

export const revalidate = 86400;

const REAL_TRUCK = "/services/car-recovery-hero.webp";
const BUSINESS_WA = recoveryContact.whatsappNumber;

export function generateStaticParams() {
  return [
    ...RECOVERY_AR_CITIES.map((c) => ({ slug: c.slug })),
    ...RECOVERY_ROUTES.map((r) => ({ slug: r.slug })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  const route = getRecoveryRoute(slug);
  if (route) {
    return seo({
      title: `${route.taglineAr} | سطحة`,
      description: `نقل سيارة من ${route.fromAr} إلى ${route.toAr} على سطحة هيدروليك (نحو ${route.distanceKm} كم). نقل محجوز بين المدن، والسعر يؤكد عبر واتساب.`,
      path: `/ar/services/car-recovery/${route.slug}`,
      locale: "ar",
      image: `https://taxisaudiarabia.com${route.image}`,
      hreflangPaths: { en: `/services/car-recovery/${route.slug}`, ar: `/ar/services/car-recovery/${route.slug}` },
    });
  }

  const city = getRecoveryCity(slug);
  if (!city || !city.introAr) return {};
  return seo({
    title: `${city.sathaAr} | سحب ونقل السيارات ٢٤ ساعة`,
    description: `${city.sathaAr} — سطحة هيدروليك من مقر في الدمام لسحب ونقل السيارات في ${city.name} والمنطقة الشرقية. السعر يؤكد عبر واتساب قبل التحرك.`,
    path: `/ar/services/car-recovery/${city.slug}`,
    locale: "ar",
    image: `https://taxisaudiarabia.com${city.image}`,
    hreflangPaths: { en: `/services/car-recovery/${city.slug}`, ar: `/ar/services/car-recovery/${city.slug}` },
  });
}

export default async function ArabicRecoveryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = getRecoveryRoute(slug);
  if (route) return <RouteViewAr route={route} />;
  const city = getRecoveryCity(slug);
  if (!city || !city.introAr) notFound();
  return <CityViewAr city={city} />;
}

/* ══════════════════════════ CITY (AR) ══════════════════════════ */
function CityViewAr({ city }: { city: NonNullable<ReturnType<typeof getRecoveryCity>> }) {
  const faqs = [...(city.faqsAr ?? []), ...RECOVERY_GLOBAL_FAQS_AR.slice(0, 3)];
  const others = RECOVERY_AR_CITIES.filter((c) => c.slug !== city.slug);
  const waText = `السلام عليكم، أحتاج سطحة في ${city.name}. موقعي: `;

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-28">
      <JsonLd
        data={[
          serviceSchema({
            name: `${city.sathaAr} — سحب ونقل السيارات`,
            description: city.introAr!,
            path: `/ar/services/car-recovery/${city.slug}`,
            serviceType: "Vehicle Towing & Recovery",
            areaServed: [city.name, "Eastern Province"],
          }),
          recoveryBusinessSchema({
            name: `${city.sathaAr}`,
            description: city.introAr!,
            path: `/ar/services/car-recovery/${city.slug}`,
            areaServed: [city.name, "Eastern Province"],
            telephone: "+966539388072",
          }),
          faqSchema(faqs),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "الرئيسية", href: "/ar" },
          { name: "سطحة وسحب السيارات", href: "/ar/services/car-recovery" },
          { name: city.sathaAr, href: `/ar/services/car-recovery/${city.slug}` },
        ]}
      />

      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image src={city.image} alt={city.sathaAr} fill priority className="object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/55 to-[#FAFAF7]/20" />
        </div>
        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.7rem] font-bold text-[#B8963B] mb-6">
            <Clock className="h-3 w-3" /> ٢٤ ساعة · مقرنا في الدمام
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">{city.sathaAr}</h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-10">{city.introAr}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`https://wa.me/${BUSINESS_WA}?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold text-white hover:bg-[#15803D] transition-all"
            >
              <MessageCircle className="h-4 w-4" /> اطلب السعر عبر واتساب
            </a>
            <a href={recoveryContact.phoneLink} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A84C] px-8 py-3.5 text-xs font-bold text-[#B8963B] hover:bg-[#C9A84C]/10 transition-all">
              <Phone className="h-4 w-4" /> اتصال مباشر
            </a>
          </div>
        </div>
      </section>

      {/* REAL TRUCK */}
      <section className="section-container max-w-5xl py-16 border-b border-[#C9A84C]/10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative h-64 md:h-72 rounded-3xl overflow-hidden border border-[#C9A84C]/15">
            <Image src={REAL_TRUCK} alt={`سطحتنا الفعلية التي تخدم ${city.name}`} fill className="object-cover" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold mb-3">سطحتنا الفعلية — وليست صورة من الإنترنت</h2>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              هذه هي السطحة الهيدروليكية الفعلية التي تخدم {city.name} والمنطقة الشرقية — تتعامل مباشرة مع صاحب السطحة في الدمام. نضيف صوراً حقيقية أكثر مع توثيق الأعمال.
            </p>
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="bg-white border border-[#16A34A]/15 rounded-3xl p-7">
            <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2.5">
              <RouteIcon className="h-5 w-5 text-[#C9A84C]" /> الطرق التي نغطيها
            </h3>
            <ul className="space-y-2.5">
              {(city.highwaysAr ?? []).map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-[#6B7280]">
                  <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5" /> {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <div className="bg-white border border-[#16A34A]/15 rounded-3xl p-7">
              <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2.5">
                <MapPin className="h-5 w-5 text-[#C9A84C]" /> الأحياء والمناطق في {city.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(city.areasAr ?? []).map((a) => (
                  <span key={a} className="rounded-full bg-[#FAFAF7] border border-[#1C1C1C]/8 px-4 py-1.5 text-xs text-[#6B7280]">{a}</span>
                ))}
              </div>
            </div>
            <div className="bg-white border border-[#16A34A]/15 rounded-3xl p-7">
              <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2.5">
                <Truck className="h-5 w-5 text-[#C9A84C]" /> الخدمات المتوفرة
              </h3>
              <ul className="space-y-2.5">
                {RECOVERY_SERVICES.map((s) => (
                  <li key={s.key} className="flex items-start gap-2 text-sm text-[#6B7280]">
                    <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5" /> {s.nameAr}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LEAD FORM */}
      <section id="request" className="section-container max-w-3xl py-20 border-b border-[#C9A84C]/10 scroll-mt-24">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold mb-4">اطلب سطحة في {city.name}</h2>
          <p className="text-[#6B7280] text-sm">أرسل التفاصيل عبر واتساب للحصول على سعر واضح — أو اتصل بسائق الدمام مباشرة.</p>
        </div>
        <RecoveryLeadForm city={city.name} lang="ar" sourceLabel={`CAR RECOVERY — ${city.name.toUpperCase()} — AR`} waText={waText} />
      </section>

      {/* FAQ */}
      <section className="section-container max-w-4xl py-20 border-b border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-12 text-center">{city.sathaAr} — الأسئلة الشائعة</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
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

      {/* CROSS-LINKS */}
      <section className="section-container max-w-5xl py-16 text-center">
        <div className="flex flex-wrap justify-center gap-3">
          {others.map((c) => (
            <Link key={c.slug} href={`/ar/services/car-recovery/${c.slug}`} className="rounded-full bg-white border border-[#16A34A]/15 px-5 py-2.5 text-sm text-[#6B7280] hover:text-[#16A34A] hover:border-[#16A34A]/35 transition-all">
              {c.sathaAr}
            </Link>
          ))}
          {RECOVERY_ROUTES.map((r) => (
            <Link key={r.slug} href={`/ar/services/car-recovery/${r.slug}`} className="rounded-full bg-white border border-[#C9A84C]/25 px-5 py-2.5 text-sm text-[#6B7280] hover:text-[#B8963B] hover:border-[#C9A84C]/50 transition-all">
              {r.taglineAr}
            </Link>
          ))}
          <Link href="/ar/services/car-recovery" className="rounded-full bg-[#16A34A] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#15803D] transition-all">كل الخدمات ←</Link>
        </div>
      </section>

      <StickyRecoveryCTA waText={waText} lang="ar" />
    </div>
  );
}

/* ══════════════════════════ ROUTE (AR) ══════════════════════════ */
function RouteViewAr({ route }: { route: (typeof RECOVERY_ROUTES)[number] }) {
  const faqs = route.faqsAr;
  const waText = `السلام عليكم، أحتاج نقل سيارة من ${route.fromAr} إلى ${route.toAr}.\nنوع السيارة: \nمكان الاستلام: \nأرجو تزويدي بالسعر والتوفر.`;
  const STEPS = [
    { icon: MessageCircle, title: "أرسل التفاصيل", desc: `نوع السيارة، ومكان الاستلام في ${route.fromAr}، والوجهة في ${route.toAr} — عبر واتساب.` },
    { icon: Clock, title: "احصل على السعر والموعد", desc: "نؤكد لك سعراً واضحاً وموعد الاستلام والتسليم قبل حجز النقل." },
    { icon: Truck, title: "تحميل السطحة", desc: "تُرفع سيارتك بالكامل على السطحة وتُثبّت للرحلة." },
    { icon: PackageCheck, title: "التسليم", desc: `تُسلّم في عنوان ${route.toAr} أو الورشة أو المعرض — مع صور عند الطلب.` },
  ];

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-28">
      <JsonLd
        data={[
          serviceSchema({
            name: route.taglineAr,
            description: route.introAr,
            path: `/ar/services/car-recovery/${route.slug}`,
            serviceType: "Vehicle Transport",
            areaServed: [route.from, route.to],
          }),
          faqSchema(faqs),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "الرئيسية", href: "/ar" },
          { name: "سطحة وسحب السيارات", href: "/ar/services/car-recovery" },
          { name: route.taglineAr, href: `/ar/services/car-recovery/${route.slug}` },
        ]}
      />

      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image src={route.image} alt={route.taglineAr} fill priority className="object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/55 to-[#FAFAF7]/20" />
        </div>
        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.7rem] font-bold text-[#B8963B] mb-6">
            <RouteIcon className="h-3 w-3" /> نحو {route.distanceKm} كم · نقل على سطحة
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">{route.taglineAr}</h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-10">{route.introAr}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`https://wa.me/${BUSINESS_WA}?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold text-white hover:bg-[#15803D] transition-all"
            >
              <MessageCircle className="h-4 w-4" /> اطلب السعر عبر واتساب
            </a>
            <a href={recoveryContact.phoneLink} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A84C] px-8 py-3.5 text-xs font-bold text-[#B8963B] hover:bg-[#C9A84C]/10 transition-all">
              <Phone className="h-4 w-4" /> اتصال مباشر
            </a>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="section-container max-w-4xl py-20 border-b border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-8 text-center">ماذا يشمل هذا النقل</h2>
        <div className="bg-white border border-[#16A34A]/15 rounded-3xl p-8">
          <ul className="space-y-3">
            {route.highlightsAr.map((h) => (
              <li key={h} className="flex items-start gap-3 text-sm text-[#6B7280]">
                <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0 mt-0.5" /> {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-12 text-center">كيف يتم النقل</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-[#16A34A]/15 relative">
              <span className="absolute top-6 left-6 text-4xl font-bold text-[#C9A84C]/15">{i + 1}</span>
              <s.icon className="h-7 w-7 text-[#16A34A] mb-4" />
              <h3 className="font-heading text-lg font-bold mb-3">{s.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LEAD FORM */}
      <section id="request" className="section-container max-w-3xl py-20 border-b border-[#C9A84C]/10 scroll-mt-24">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold mb-4">{route.taglineAr}</h2>
          <p className="text-[#6B7280] text-sm">أرسل نوع السيارة والعنوانين — نؤكد السعر عبر واتساب.</p>
        </div>
        <RecoveryLeadForm city={`${route.fromAr} ← ${route.toAr}`} lang="ar" sourceLabel={`CAR TRANSPORT — DAMMAM TO ${route.to.toUpperCase()} — AR`} waText={waText} />
      </section>

      {/* FAQ */}
      <section className="section-container max-w-4xl py-20 border-b border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-12 text-center">{route.taglineAr} — الأسئلة الشائعة</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
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

      {/* CROSS-LINKS */}
      <section className="section-container max-w-5xl py-16 text-center">
        <p className="text-sm text-[#6B7280] mb-4">تحتاج سطحة محلية؟ ابدأ بخدمة{" "}
          <Link href="/ar/services/car-recovery/dammam" className="text-[#16A34A] font-bold hover:underline">سطحة الدمام</Link>.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {RECOVERY_ROUTES.filter((r) => r.slug !== route.slug).map((r) => (
            <Link key={r.slug} href={`/ar/services/car-recovery/${r.slug}`} className="rounded-full bg-white border border-[#C9A84C]/25 px-5 py-2.5 text-sm text-[#6B7280] hover:text-[#B8963B] hover:border-[#C9A84C]/50 transition-all">
              {r.taglineAr}
            </Link>
          ))}
          <Link href="/ar/services/car-recovery" className="rounded-full bg-[#16A34A] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#15803D] transition-all">كل الخدمات ←</Link>
        </div>
      </section>

      <StickyRecoveryCTA waText={waText} lang="ar" />
    </div>
  );
}
