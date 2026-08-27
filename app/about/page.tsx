"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, CheckCircle2, History, Award } from "lucide-react";
import Image from "next/image";
import { trustStats } from "@/lib/config/stats";
import { credentials, hasCredential } from "@/lib/config/credentials";

const translations = {
  en: {
    badge: "About Taxi Saudi Arabia",
    title: "Saudi Arabia's Trusted Taxi & Car Service",
    description: "Taxi Saudi Arabia is a private taxi and car service operating across Saudi Arabia. We provide pre-booked rides with your price confirmed on WhatsApp for airport transfers, Umrah pilgrims, business travelers, and families — anywhere in the Kingdom.",

    // Stats
    statsTitle: "Our Numbers",
    stats: [
      { label: "Professional Drivers", value: "100%" },
      { label: "Routes Covered", value: trustStats.routesCovered },
      { label: "Saudi Cities", value: "11+" },
      { label: "Languages Spoken", value: "3" }
    ],

    // Story
    storyTitle: "Our Story",
    storySubtitle: "Built Around One Idea: A Taxi You Can Actually Trust",
    storyText1: "Taxi Saudi Arabia was built with one goal: to give people in Saudi Arabia a taxi service they can actually trust. Our fleet covers Riyadh, Jeddah, Makkah, Madinah, Dammam, and beyond — serving pilgrims, business travelers, and families with pre-booked rides, price confirmed on WhatsApp.",
    storyText2: "We focus on being on time, transparent with pricing, and respectful of our customers. We combine real Saudi hospitality with modern booking technology to make every trip simple, safe, and comfortable.",

    // Pillars (Mission & Values)
    pillarsTitle: "What We Stand For",
    pillarsSubtitle: "The values behind every ride",
    pillars: [
      {
        title: "Always On Time",
        description: "We track your flight live and plan your trip around prayer times — your driver is always ready when you need them.",
        icon: ShieldCheck
      },
      {
        title: "Professional, Vetted Drivers",
        description: "All our drivers are background-checked, hold a valid Saudi driving license, and speak English, Arabic, and Urdu.",
        icon: Sparkles
      },
      {
        title: "Professional Drivers",
        description: hasCredential(credentials.vatNumber)
          ? "Every driver holds a valid Saudi driving license, and fares are ZATCA e-invoice compliant."
          : "Every driver holds a valid Saudi driving license.",
        icon: CheckCircle2
      },
      {
        title: "Clean & Well-Maintained Cars",
        description: "Every vehicle is cleaned before each trip, regularly inspected, and fully air-conditioned for your comfort.",
        icon: History
      }
    ],

    // Certifications
    certTitle: "Licenses & Compliance",
    certSubtitle: "Professional Drivers, Transparent Pricing",
    certs: [
      { name: "Professional Drivers", desc: "Every driver holds a valid Saudi driving license", icon: Award },
      { name: "Clear Quotes on WhatsApp", desc: "Price confirmed before you book — no meter, no surge", icon: ShieldCheck },
      { name: "ZATCA E-Invoicing", desc: "VAT-registered and ZATCA-certified for businesses", icon: CheckCircle2 }
    ],

    // Team
    teamTitle: "Our Team",
    teamSubtitle: "The people who make your trip smooth",
    team: [
      { name: "Habiba", role: "Founder & CEO" },
      { name: "Ismail", role: "Co-Founder & Operations" },
    ],

    // Video Section
    videoTitle: "See What Rides With Us Look Like",
    videoText: "Take a quick look inside our cars and see why thousands of travelers across Saudi Arabia choose Taxi Saudi Arabia for every trip."
  },
  ar: {
    badge: "من نحن",
    title: "بوابتك الآمنة للتنقل الفاخر بالمملكة",
    description: "يقف الرياض لوكس تاكسي عند نقطة التقاء الضيافة السعودية والرفاهية العالمية في النقل. نحن نقدم خدمات السائقين مسبقة الحجز بأسعار ثابتة ومحددة مصممة خصيصاً للمؤتمرات التنفيذية، والعمرة، والرحلات العائلية الفاخرة.",
    
    // Stats
    statsTitle: "مسيرتنا في أرقام",
    stats: [
      { label: "سائقون مرخصون", value: "100%" },
      { label: "مسار مغطى", value: trustStats.routesCovered },
      { label: "مدينة سعودية", value: "+11" },
      { label: "لغات التحدث", value: "3" }
    ],

    // Story
    storyTitle: "قصتنا",
    storySubtitle: "فكرة واحدة: تاكسي يمكنك أن تثق به فعلاً",
    storyText1: "تأسست تاكسي السعودية بهدف واحد: تقديم خدمة تاكسي يثق بها الجميع في المملكة العربية السعودية. يغطي أسطولنا الرياض وجدة ومكة والمدينة والدمام وغيرها — نخدم الحجاج ورجال الأعمال والعائلات برحلات محجوزة مسبقاً بأسعار ثابتة.",
    storyText2: "نركز على الالتزام بالمواعيد والشفافية في الأسعار واحترام عملائنا. نجمع بين الضيافة السعودية الأصيلة وتقنيات الحجز الحديثة لنجعل كل رحلة بسيطة وآمنة ومريحة.",

    // Pillars (Mission & Values)
    pillarsTitle: "الرسالة والقيم الأساسية",
    pillarsSubtitle: "الركائز الأساسية لرياض لوكس",
    pillars: [
      {
        title: "الالتزام المطلق بالوقت",
        description: "نلتزم بدقة المواعيد التامة مع تتبع فوري للرحلات والتنسيق مع أوقات الصلوات لراحتك.",
        icon: ShieldCheck
      },
      {
        title: "نخبة من السائقين المحترفين",
        description: "سائقون محليون مدربون يحملون رخصة قيادة سعودية سارية ويتحدثون لغات متعددة.",
        icon: Sparkles
      },
      {
        title: "أسعار شفافة وموثوقة",
        description: "كل سائق يحمل رخصة قيادة سارية، والفواتير متوافقة مع هيئة الزكاة والضريبة.",
        icon: CheckCircle2
      },
      {
        title: "عناية وصيانة فائقة للأسطول",
        description: "أسطول حديث ومعقم بالكامل مع أفضل الإضافات ووسائل الراحة لتجربة VIP متميزة.",
        icon: History
      }
    ],

    // Certifications
    certTitle: "التراخيص والامتثال",
    certSubtitle: "سائقون مرخصون وأسعار شفافة",
    certs: [
      { name: "سائقون مرخصون", desc: "كل سائق يحمل رخصة قيادة سعودية سارية", icon: Award },
      { name: "أسعار ثابتة", desc: "السعر مؤكد قبل الحجز — بدون عداد أو زيادة", icon: ShieldCheck },
      { name: "هيئة الزكاة والضريبة (ZATCA)", desc: "متوافق مع الفاتورة الإلكترونية", icon: CheckCircle2 }
    ],

    // Team
    teamTitle: "فريق القيادة المتميز",
    teamSubtitle: "نعمل بشغف لضمان أفضل تجربة حجز وتنقل",
    team: [
      { name: "حبيبة", role: "المؤسسة والرئيسة التنفيذية" },
      { name: "إسماعيل", role: "الشريك المؤسس ومدير العمليات" },
    ],

    // Video Section
    videoTitle: "شاهد الفخامة داخل أسطولنا",
    videoText: "قم بجولة افتراضية داخل أسطولنا الفاخر واكتشف التفاصيل الدقيقة التي تجعل الرياض لوكس الخيار الذهبي لكل تنقلاتك."
  },
  ur: {
    badge: "ہمارے بارے میں",
    title: "وی آئی پی سفر کے لیے آپ کی پہلی پسند",
    description: "ریاض لوکس ٹیکسی سعودی مہمان نوازی اور عالمی معیار کے لگژری ٹرانسپورٹیشن کا بہترین امتزاج ہے۔ ہم سعودی عرب میں عمرہ زائرین، بزنس ایگزیکٹوز اور خاندانی مسافروں کے لیے پہلے سے بک شدہ پریمیم ڈرائیور سروسز فراہم کرتے ہیں۔",
    
    // Stats
    statsTitle: "ہماری کامیابی اعداد و شمار میں",
    stats: [
      { label: "لائسنس یافتہ ڈرائیورز", value: "100%" },
      { label: "روٹس", value: trustStats.routesCovered },
      { label: "سعودی شہر", value: "+11" },
      { label: "زبانیں", value: "3" }
    ],

    // Story
    storyTitle: "ہماری کہانی",
    storySubtitle: "ایک مقصد: ایک ایسی ٹیکسی جس پر واقعی بھروسہ کیا جا سکے",
    storyText1: "ٹیکسی سعودی عرب ایک مقصد کے ساتھ بنائی گئی: سعودی عرب میں لوگوں کو ایک قابلِ اعتماد ٹیکسی سروس دینا۔ ہمارا فلیٹ ریاض، جدہ، مکہ، مدینہ، دمام اور دیگر شہروں کا احاطہ کرتا ہے — حاجیوں، کاروباری مسافروں اور خاندانوں کو پیشگی بک شدہ، فکسڈ قیمت رائیڈز فراہم کرتے ہیں۔",
    storyText2: "ہم وقت کی پابندی، شفاف قیمتوں اور صارفین کے احترام پر توجہ دیتے ہیں۔ ہم اصل سعودی مہمان نوازی کو جدید بکنگ ٹیکنالوجی کے ساتھ ملا کر ہر سفر کو آسان، محفوظ اور آرام دہ بناتے ہیں۔",

    // Pillars (Mission & Values)
    pillarsTitle: "مشن اور بنیادی اقدار",
    pillarsSubtitle: "ریاض لوکس کی بنیادی بنیادیں",
    pillars: [
      {
        title: "مکمل اعتماد",
        description: "وقت کی سو فیصد پابندی۔ فلائٹ ٹریکنگ اور نماز کے اوقات سے ہم آہنگ سفر کی منصوبہ بندی۔",
        icon: ShieldCheck
      },
      {
        title: "منتخب ڈرائیورز کا دائرہ",
        description: "انتہائی تربیت یافتہ مقامی ماہرین، جو درست سعودی ڈرائیونگ لائسنس رکھتے ہیں اور متعدد زبانیں بولتے ہیں۔",
        icon: Sparkles
      },
      {
        title: "شفاف اور قابل اعتماد قیمتیں",
        description: hasCredential(credentials.vatNumber)
          ? "ہر ڈرائیور درست سعودی لائسنس رکھتا ہے، اور رسیدیں ZATCA کے مطابق ہیں۔"
          : "ہر ڈرائیور درست سعودی لائسنس رکھتا ہے۔",
        icon: CheckCircle2
      },
      {
        title: "گاڑیوں کی بہترین دیکھ بھال",
        description: "صرف جدید، بے داغ گاڑیاں جو پریمیم انٹیریئر اور انفرادی درجہ حرارت کی ترتیبات سے لیس ہیں۔",
        icon: History
      }
    ],

    // Certifications
    certTitle: "لائسنس اور تعمیل",
    certSubtitle: "لائسنس یافتہ ڈرائیورز، شفاف قیمتیں",
    certs: [
      { name: "لائسنس یافتہ ڈرائیورز", desc: "ہر ڈرائیور درست سعودی ڈرائیونگ لائسنس رکھتا ہے", icon: Award },
      { name: "فکسڈ قیمتیں", desc: "بکنگ سے پہلے قیمت طے — کوئی میٹر یا اضافی چارج نہیں", icon: ShieldCheck },
      { name: "ZATCA الیکٹرانک انوائس", desc: "زکوٰۃ، ٹیکس اور کسٹمز سے مصدقہ", icon: CheckCircle2 }
    ],

    // Team
    teamTitle: "ہمارا ایلیٹ لیڈرشپ",
    teamSubtitle: "آپ کے شاندار سفری تجربے کو ممکن بنانے والی ٹیم",
    team: [
      { name: "حبیبہ", role: "بانی اور چیف ایگزیکٹو" },
      { name: "اسماعیل", role: "شریک بانی اور آپریشنز" },
    ],

    // Video Section
    videoTitle: "پہیوں پر آرام دہ سفر کا تجربہ",
    videoText: "ہمارے فلیٹ کے اندر ورچوئل ٹور کریں اور ان باریک تفصیلات کو دریافت کریں جو ریاض لوکس کو سفر کا گولڈ اسٹینڈرڈ بناتی ہیں۔"
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function AboutPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const statsList = [
    { label: t.stats[0].label, value: trustStats.licensedDrivers },
    { label: t.stats[1].label, value: trustStats.routesCovered },
    { label: t.stats[2].label, value: trustStats.citiesCovered },
    { label: t.stats[3].label, value: trustStats.languagesSpoken }
  ];

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
          <span className="text-xs uppercase tracking-[0.2em] text-[#16A34A] font-semibold">
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

      {/* Stats Row */}
      <section className="section-container mt-14">
        <h2 className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-6 text-center md:text-left">{t.statsTitle}</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {statsList.map((item, idx) => (
            <motion.div
              key={item.label}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="rounded-2xl border border-[#16A34A]/12 bg-white/50 p-6 text-center hover:border-[#16A34A]/35 transition-colors"
            >
              <p className="font-heading text-3xl font-bold text-[#16A34A]">{item.value}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-[#6B7280] font-medium">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Company Story Section */}
      <section className="section-container mt-24">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-[#16A34A] font-semibold">{t.storySubtitle}</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1C1C1C]">{t.storyTitle}</h2>
            <p className="text-sm text-[#6B7280] leading-relaxed">{t.storyText1}</p>
            <p className="text-sm text-[#6B7280] leading-relaxed">{t.storyText2}</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative h-[320px] rounded-3xl overflow-hidden border border-[#16A34A]/15"
          >
            <Image
              src="/about/about-hero.webp"
              alt="Taxi Saudi Arabia Heritage fleet"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Core Pillars Section (Mission & Values) */}
      <section className="section-container mt-24">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#16A34A] font-semibold">{t.pillarsSubtitle}</span>
          <h2 className="mt-2 font-heading text-3xl md:text-4xl font-bold text-[#1C1C1C]">{t.pillarsTitle}</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {t.pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.article
                key={pillar.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group rounded-3xl border border-[#16A34A]/12 bg-white p-8 shadow-2xl hover:border-[#C9A84C]/45 transition-all duration-300"
              >
                <div className="flex gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C9A84C]/30 bg-[#F0FDF4] text-[#C9A84C] shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-heading text-xl font-bold text-[#1C1C1C] group-hover:text-[#16A34A] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-[#6B7280]">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Government & Compliance Certifications */}
      <section className="section-container mt-24">
        <div className="max-w-3xl mb-12 text-center md:text-left">
          <span className="text-xs uppercase tracking-[0.2em] text-[#16A34A] font-semibold">{t.certSubtitle}</span>
          <h2 className="mt-2 font-heading text-3xl md:text-4xl font-bold text-[#1C1C1C]">{t.certTitle}</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {t.certs
            .filter((cert) => hasCredential(credentials.vatNumber) || !cert.name.includes("ZATCA"))
            .map((cert, index) => {
            const Icon = cert.icon;
            return (
              <motion.div
                key={cert.name}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border border-[#C9A84C]/10 bg-white p-6 flex flex-col justify-between hover:border-[#C9A84C]/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C]">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#1C1C1C]">{cert.name}</h3>
                </div>
                <p className="mt-4 text-xs text-[#6B7280] font-medium border-t border-[#C9A84C]/10 pt-4">{cert.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Elite Leadership Team Section */}
      <section className="section-container mt-24 mb-12">
        <div className="max-w-3xl mb-12 text-center md:text-left">
          <span className="text-xs uppercase tracking-[0.2em] text-[#16A34A] font-semibold">{t.teamSubtitle}</span>
          <h2 className="mt-2 font-heading text-3xl md:text-4xl font-bold text-[#1C1C1C]">{t.teamTitle}</h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {t.team.map((member, index) => (
            <motion.div
              key={member.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group overflow-hidden rounded-3xl border border-[#C9A84C]/10 bg-white hover:border-[#C9A84C]/30 transition-all"
            >
              {/* Initials avatar — real photos pending, koi stock/fake photo attach nahi karna */}
              <div className="relative h-[280px] w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#F0FDF4] to-[#FAFAF7]">
                <span className="font-heading text-6xl font-bold text-[#16A34A]/40">
                  {member.name.charAt(0)}
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-lg font-bold text-[#1C1C1C]">{member.name}</h3>
                <p className="text-xs text-[#C9A84C] uppercase tracking-wider font-semibold mt-1">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
