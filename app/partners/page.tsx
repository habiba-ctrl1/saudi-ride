"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { motion } from "framer-motion";
import { ShieldCheck, Building2, Handshake, Loader2, Send } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const translations = {
  en: {
    badge: "B2B Collaborations",
    title: "Partner with Saudi Arabia's Premier Transport Network",
    description: "Offer your clients, guests, and executive delegations the ultimate standard of VIP mobility. Seamless booking channels, monthly itemized billing, and dedicated concierge dispatch priorities.",
    
    // Partner Types
    partnerTitle: "Tailored Benefits by Sector",
    partnerSubtitle: "Engineered to deliver value across industries",
    partners: [
      { title: "Hotels & Luxury Resorts", desc: "Integrate premium guest pickups directly from your reception desk. Automatic commission splits, SMS driver arrivals, and instant flight-tracking VIP logistics.", icon: Building2 },
      { title: "Travel Agencies & Concierges", desc: "Access flat wholesale tariffs for large-scale Umrah packages, tourist trip excursions, and complex multi-city transits.", icon: Handshake },
      { title: "Corporates & Multinationals", desc: "Simplify business travel expense workflows with itemized monthly corporate billing, custom billing bounds, and priority executive allocations.", icon: ShieldCheck }
    ],

    // Application Form
    formTitle: "B2B Partner Registration",
    formSubtitle: "Establish a corporate trade channel within 24 hours",
    labelCompany: "Company / Organization Name",
    labelContact: "Primary Contact Person",
    labelEmail: "Official Work Email",
    labelPhone: "Direct Contact Number",
    labelType: "Collaboration Category",
    labelDetails: "Partnership Details & Requirements",
    placeholderDetails: "Outline your monthly booking volume, target routes, and specific billing expectations...",
    btnSubmit: "Submit Partnership Request",
    btnSubmitting: "Registering Partnership Request...",
    successMsg: "Your B2B partnership request has been securely submitted! Our account managers will reach out within 1 business day.",
    errorMsg: "Something went wrong. Please check your inputs or email us directly.",

    partnerTypes: [
      { value: "hotel", label: "Hotel / Luxury Resort" },
      { value: "agency", label: "Travel Agency / Tour Operator" },
      { value: "corporate", label: "Corporate Account / Business" },
      { value: "event", label: "Event Management / VIP Summit" },
      { value: "other", label: "Other Business Collaboration" }
    ],

    // Placeholder Logos
    logosTitle: "Trusted by Leading Regional Enterprises"
  },
  ar: {
    badge: "شراكات الأعمال B2B",
    title: "شريكك المثالي للتنقل الفاخر بالمملكة",
    description: "قدم لعملائك وموظفيك وضيوفك أعلى معايير الضيافة والتنقل الفاخر. قنوات حجز ذكية، فوترة شهرية ميسرة، وأولوية قصوى لجميع طلبات الحجز الخاصة بك.",
    
    // Partner Types
    partnerTitle: "مزايا مخصصة لكل قطاع",
    partnerSubtitle: "مصممة لتوفير قيمة مضافة لأعمالك",
    partners: [
      { title: "الفنادق والمنتجعات الفاخرة", desc: "تكامل ذكي ومباشر لتوصيل نزلاء الفندق من مكتب الاستقبال. تتبع تلقائي للرحلات، وإشعارات وصول السائق للنزلاء فورياً.", icon: Building2 },
      { title: "وكالات السفر والسياحة", desc: "أسعار تفضيلية خاصة لوكلاء السفر لتنقلات العمرة، والجولات السياحية الفاخرة، والرحلات الطويلة بين المدن.", icon: Handshake },
      { title: "الشركات والمؤسسات", desc: "سهل معاملات السفر لموظفيك وتنفيذيك عبر فوترة شهرية مفصلة للشركات، مع أولوية قصوى لتوفير أحدث سيارات الأسطول.", icon: ShieldCheck }
    ],

    // Application Form
    formTitle: "طلب تسجيل شريك أعمال",
    formSubtitle: "افتح حساب شراكة رسمي لأعمالك في غضون 24 ساعة فقط",
    labelCompany: "اسم الشركة / المؤسسة",
    labelContact: "مسؤول الاتصال الرئيسي",
    labelEmail: "البريد الإلكتروني الرسمي للعمل",
    labelPhone: "رقم جوال التواصل المباشر",
    labelType: "تصنيف الشراكة",
    labelDetails: "تفاصيل الشراكة والمتطلبات الخاصة",
    placeholderDetails: "اذكر حجم الحجوزات الشهري المتوقع، المسارات المستهدفة، وتفاصيل الدفع المفضلة...",
    btnSubmit: "إرسال طلب الشراكة",
    btnSubmitting: "جاري إرسال الطلب...",
    successMsg: "تم تقديم طلب الشراكة بنجاح! سيتواصل معك مدير حسابات الشركات خلال يوم عمل واحد.",
    errorMsg: "حدث خطأ ما. يرجى مراجعة البيانات أو مراسلتنا بالبريد مباشرة.",

    partnerTypes: [
      { value: "hotel", label: "فندق / منتجع فاخر" },
      { value: "agency", label: "وكالة سفر وسياحة / منظم رحلات" },
      { value: "corporate", label: "حساب شركات / أعمال" },
      { value: "event", label: "إدارة تنظيم فعاليات ومؤتمرات" },
      { value: "other", label: "تعاون تجاري آخر" }
    ],

    // Placeholder Logos
    logosTitle: "فخورون بثقة كبرى الشركات الإقليمية"
  },
  ur: {
    badge: "بی ٹو بی شراکت داری",
    title: "سعودی عرب کے معروف ترین ٹرانسپورٹ نیٹ ورک کے شراکت دار بنیں",
    description: "اپنے مہمانوں اور ایگزیکٹوز کو شاندار VIP سفر کی سہولت فراہم کریں۔ آسان ریزرویشنز، ماہانہ تفصیلی بلنگ اور کنسیرج ڈسپیچ کو ترجیح حاصل ہے۔",
    
    // Partner Types
    partnerTitle: "شعبہ وار مخصوص فوائد",
    partnerSubtitle: "کاروبار میں پریمیم سروس اور اضافی قیمت لانے کے لیے ڈیزائن کیا گیا ہے",
    partners: [
      { title: "ہوٹلز اور لگژری ریسارٹس", desc: "اپنے استقبالیہ ڈیسک سے براہ راست مہمانوں کی پک اپ بک کریں۔ خودکار ڈرائیور اپ ڈیٹس اور فوری فلائٹ ٹریکنگ سروس۔", icon: Building2 },
      { title: "ٹریول ایجنسیاں اور ٹور آپریٹرز", desc: "بڑی عمرہ گروپس، سیاحتی دوروں اور شہروں کے درمیان طویل دوروں کے لیے ہول سیل ریٹس حاصل کریں۔", icon: Handshake },
      { title: "کارپوریٹس اور ملٹی نیشنلز", desc: "کارپوریٹ بلنگ اور مینیجرز کے لیے ترجیحی گاڑیوں کی فراہمی کے ذریعے اپنے کاروباری سفر کو آسان بنائیں۔", icon: ShieldCheck }
    ],

    // Application Form
    formTitle: "بی ٹو بی پارٹنر رجسٹریشن فارم",
    formSubtitle: "24 گھنٹے کے اندر اپنی کمپنی کا پارٹنر اکاؤنٹ ایکٹیویٹ کریں",
    labelCompany: "کمپنی / تنظیم کا نام",
    labelContact: "بنیادی رابطہ کار کا نام",
    labelEmail: "آفیشل ورک ای میل",
    labelPhone: "براہ راست موبائل نمبر",
    labelType: "شراکت داری کی کیٹیگری",
    labelDetails: "شراکت داری کی تفصیلات اور ضروریات",
    placeholderDetails: "اپنے متوقع ماہانہ ٹرپس، روٹس اور مخصوص ضروریات کا ذکر کریں...",
    btnSubmit: "پارٹنرشپ کی درخواست جمع کریں",
    btnSubmitting: "درخواست جمع کی جا رہی ہے...",
    successMsg: "آپ کی درخواست کامیابی سے جمع ہو گئی ہے! ہمارے اکاؤنٹ مینیجر جلد رابطہ کریں گے۔",
    errorMsg: "کچھ غلط ہو گیا۔ براہ کرم دوبارہ کوشش کریں یا ای میل کریں۔",

    partnerTypes: [
      { value: "hotel", label: "ہوٹل / لگژری ریسارٹ" },
      { value: "agency", label: "ٹریول ایجنسی / ٹور آپریٹر" },
      { value: "corporate", label: "کارپوریٹ اکاؤنٹ / بزنس" },
      { value: "event", label: "ایونٹ مینجمنٹ / VIP سمٹ" },
      { value: "other", label: "دیگر کاروباری تعاون" }
    ],

    logosTitle: "خطے کے معروف اداروں کا قابل اعتماد ساتھی"
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function PartnersPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    partnerType: "hotel",
    details: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate Resend API partner route capture or send to contact endpoint
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          serviceType: `B2B PARTNER (${formData.partnerType.toUpperCase()})`,
          message: `Company: ${formData.companyName}\nDetails: ${formData.details}`
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(t.successMsg);
        setFormData({
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          partnerType: "hotel",
          details: ""
        });
      } else {
        toast.error(data.error || t.errorMsg);
      }
    } catch {
      toast.error(t.errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pt-28 pb-16">
      
      {/* Entrance Hero text */}
      <section className="section-container">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-[#B8963B] font-semibold">
            {t.badge}
          </span>
          <h1 className="mt-4 font-heading text-4xl font-bold leading-tight md:text-5.5xl text-[#1C1C1C]">
            {t.title}
          </h1>
          <p className="mt-6 text-sm md:text-base leading-relaxed text-[#6B7280]">
            {t.description}
          </p>
        </motion.div>
      </section>

      {/* Sector benefits grid */}
      <section className="section-container mt-16">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#B8963B] font-semibold">{t.partnerSubtitle}</span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-[#1C1C1C]">{t.partnerTitle}</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {t.partners.map((p, index) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-3xl border border-[#C9A84C]/10 bg-white p-8 space-y-5 hover:border-[#C9A84C]/35 transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#1C1C1C]">{p.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Partner Application split view */}
      <section className="section-container mt-24">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          
          {/* Left: Premium branding placeholders & logos */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-3xl border border-[#C9A84C]/10 bg-white p-8 space-y-6">
              <h3 className="font-heading text-lg font-bold text-[#16A34A]">{t.logosTitle}</h3>
              <div className="grid grid-cols-2 gap-4">
                
                {/* Custom premium shape placeholders representing luxury brands */}
                {[
                  "AL-FAISALIAH",
                  "KINGDOM HQ",
                  "ROYAL CONCIERGE",
                  "RIYADH TOURISM",
                  "JEDDAH GATEWAY",
                  "AL-ULA ECO"
                ].map((name) => (
                  <div
                    key={name}
                    className="h-16 rounded-xl border border-[#16A34A]/15 bg-[#FAFAF7] flex items-center justify-center text-[10px] uppercase tracking-widest text-[#6B7280] font-bold"
                  >
                    {name}
                  </div>
                ))}

              </div>
            </div>
            
            <div className="h-[220px] rounded-3xl overflow-hidden border border-[#16A34A]/12 relative">
              <Image
                src="/services/corporate-hero.webp"
                alt="Corporate office premium partnership"
                width={800}
                height={600}
                className="w-full h-full object-cover grayscale opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] to-transparent" />
            </div>
          </div>

          {/* Right: Partner application form */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lg:col-span-7 rounded-3xl border border-[#16A34A]/15 bg-white p-8 md:p-10 shadow-2xl relative"
          >
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />

            <div className="mb-8">
              <h2 className="font-heading text-2xl font-bold text-[#1C1C1C]">{t.formTitle}</h2>
              <p className="text-xs text-[#C9A84C] font-semibold mt-1.5">{t.formSubtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Company Name */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">{t.labelCompany}</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full rounded-xl border border-[#16A34A]/12 bg-[#F0FDF4] px-4 py-3 text-xs text-[#1C1C1C] focus:border-[#C9A84C] focus:outline-none transition-colors"
                  />
                </div>

                {/* Contact Person */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">{t.labelContact}</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full rounded-xl border border-[#16A34A]/12 bg-[#F0FDF4] px-4 py-3 text-xs text-[#1C1C1C] focus:border-[#C9A84C] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Work Email */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">{t.labelEmail}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-[#16A34A]/12 bg-[#F0FDF4] px-4 py-3 text-xs text-[#1C1C1C] focus:border-[#C9A84C] focus:outline-none transition-colors"
                  />
                </div>

                {/* Direct Number */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">{t.labelPhone}</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-[#16A34A]/12 bg-[#F0FDF4] px-4 py-3 text-xs text-[#1C1C1C] focus:border-[#C9A84C] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Partnership Category */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">{t.labelType}</label>
                <select
                  value={formData.partnerType}
                  onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                  className="w-full rounded-xl border border-[#16A34A]/12 bg-[#F0FDF4] px-4 py-3 text-xs text-[#1C1C1C] focus:border-[#C9A84C] focus:outline-none transition-colors"
                >
                  {t.partnerTypes.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Requirements text */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">{t.labelDetails}</label>
                <textarea
                  required
                  rows={4}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder={t.placeholderDetails}
                  className="w-full rounded-xl border border-[#16A34A]/12 bg-[#F0FDF4] px-4 py-3 text-xs text-[#1C1C1C] focus:border-[#C9A84C] focus:outline-none transition-colors resize-none placeholder:text-[#555]"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#16A34A] py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#15803D] disabled:bg-[#C9A84C]/50 transition-colors flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(22,163,74,0.2)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t.btnSubmitting}</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>{t.btnSubmit}</span>
                  </>
                )}
              </button>

            </form>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
