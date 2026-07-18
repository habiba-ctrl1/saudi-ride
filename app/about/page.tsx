"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, CheckCircle2, History, Award } from "lucide-react";
import Image from "next/image";
import { trustStats } from "@/lib/config/stats";

const translations = {
  en: {
    badge: "About Taxi Saudi Arabia",
    title: "Saudi Arabia's Trusted Taxi & Car Service",
    description: "Taxi Saudi Arabia is a licensed taxi and car service operating across Saudi Arabia. We provide pre-booked, fixed-price rides for airport transfers, Umrah pilgrims, business travelers, and families — anywhere in the Kingdom.",

    // Stats
    statsTitle: "Our Numbers",
    stats: [
      { label: "Ministry Licensed", value: "100%" },
      { label: "Trips Completed", value: "50k+" },
      { label: "Years in Service", value: "12+ Years" },
      { label: "Countries Served", value: "40+" }
    ],

    // Story
    storyTitle: "Our Story",
    storySubtitle: "Started in 2014 in Riyadh",
    storyText1: "Taxi Saudi Arabia was founded in 2014 in Riyadh with one goal: to give people in Saudi Arabia a taxi service they can actually trust. What started with five cars has grown into a fleet covering Riyadh, Jeddah, Makkah, Madinah, Dammam, and beyond — serving thousands of pilgrims, business travelers, and families every year.",
    storyText2: "Over the past 12 years, we have built a reputation for being on time, transparent with pricing, and respectful of our customers. We combine real Saudi hospitality with modern booking technology to make every trip simple, safe, and comfortable.",

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
        description: "All our drivers are background-checked, government-certified, and speak English, Arabic, and Urdu.",
        icon: Sparkles
      },
      {
        title: "Government Licensed",
        description: "Fully licensed by the Saudi Ministry of Transport (MOT) and compliant with ZATCA electronic invoicing rules.",
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
    certSubtitle: "Fully Licensed by Saudi Government",
    certs: [
      { name: "Ministry of Transport (MOT)", desc: "Official Operator License #1024-MOT", icon: Award },
      { name: "General Authority for Transport (TGA)", desc: "Compliant with Saudi transport regulations", icon: ShieldCheck },
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
      { label: "ترخيص رسمي", value: "100%" },
      { label: "رحلات VIP ناجحة", value: "+50 ألف" },
      { label: "سنوات من الخدمة", value: "12+ سنة" },
      { label: "عملاؤنا حول العالم", value: "40+ دولة" }
    ],

    // Story
    storyTitle: "مسيرتنا العريقة",
    storySubtitle: "تأسست عام 2014",
    storyText1: "تأسس الرياض لوكس تاكسي في قلب مدينة الرياض عام 2014 برؤية فريدة: إعادة صياغة مفهوم النقل الفاخر لكبار الشخصيات في المملكة العربية السعودية. ما بدأ بأسطول متواضع من 5 سيارات سيدان فاخرة نما ليصبح شبكة النقل الأكثر فخامة وتميزاً بالمملكة.",
    storyText2: "على مدار العقد الماضي، أثبتنا مكانتنا كخيار رئيسي وموثوق وآمن للسفر. من خلال دمج الضيافة السعودية الأصيلة مع تقنيات إدارة الأسطول الحديثة، نضمن أن تكون كل رحلة معنا واحة من الراحة والرفاهية المطلقة.",

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
        description: "سائقون محليون مدربون ومعتمدون من الهيئة العامة للنقل ويتحدثون لغات متعددة.",
        icon: Sparkles
      },
      {
        title: "ترخيص رسمي وتوافق تام",
        description: "مرخص بالكامل من وزارة النقل ومتوافق مع الفواتير الإلكترونية لهيئة الزكاة والضريبة.",
        icon: CheckCircle2
      },
      {
        title: "عناية وصيانة فائقة للأسطول",
        description: "أسطول حديث ومعقم بالكامل مع أفضل الإضافات ووسائل الراحة لتجربة VIP متميزة.",
        icon: History
      }
    ],

    // Certifications
    certTitle: "التراخيص والامتثال الحكومي",
    certSubtitle: "مرخصون ومعتمدون بالكامل",
    certs: [
      { name: "وزارة النقل", desc: "ترخيص مشغل رسمي رقم 1024-MOT", icon: Award },
      { name: "الهيئة العامة للنقل (TGA)", desc: "متوافق مع لوائح الليموزين التنفيذي", icon: ShieldCheck },
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
      { label: "منظور شدہ لائسنس", value: "100%" },
      { label: "وی آئی پی دورے مکمل", value: "+50 ہزار" },
      { label: "سروس سال", value: "12+ سال" },
      { label: "عالمی مسافر ممالک", value: "40+ ممالک" }
    ],

    // Story
    storyTitle: "ہمارا ورثہ",
    storySubtitle: "2014 میں قائم کیا گیا",
    storyText1: "2014 میں ریاض کے قلب میں قائم ہونے والی، ریاض لوکس ٹیکسی کا آغاز ایک منفرد وژن کے ساتھ ہوا: سعودی عرب میں وی آئی پی ٹرانسپورٹ کے معیار کو بدلنا۔ پانچ ایگزیکٹو گاڑیوں سے شروع ہونے والا سفر اب سعودی عرب کی سب سے بڑی لگژری ٹرانسپورٹ سروس بن چکا ہے۔",
    storyText2: "پچھلی دہائی کے دوران، ہم نے خود کو قابل بھروسہ، محفوظ اور باوقار سفر کے سب سے بہترین انتخاب کے طور پر ثابت کیا ہے۔ روایتی سعودی مہمان نوازی کو جدید ٹیکنالوجی کے ساتھ ملا کر، ہم اس بات کو یقینی بناتے ہیں کہ ہر سفر انتہائی آرام دہ اور پرسکون ہو۔",

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
        description: "انتہائی تربیت یافتہ مقامی ماہرین، جو پبلک اتھارٹی کے معیارات سے تصدیق شدہ ہیں اور متعدد زبانیں بولتے ہیں۔",
        icon: Sparkles
      },
      {
        title: "زکوٰۃ و ٹیکس سے منظور شدہ",
        description: "وزارت ٹرانسپورٹ اور ZATCA کے الیکٹرانک انوائسنگ پروٹوکول کے تحت مکمل طور پر لائسنس یافتہ۔",
        icon: CheckCircle2
      },
      {
        title: "گاڑیوں کی بہترین دیکھ بھال",
        description: "صرف جدید، بے داغ گاڑیاں جو پریمیم انٹیریئر اور انفرادی درجہ حرارت کی ترتیبات سے لیس ہیں۔",
        icon: History
      }
    ],

    // Certifications
    certTitle: "سرکاری لائسنس اور قوانین کی تعمیل",
    certSubtitle: "مکمل طور پر لائسنس یافتہ اور منظور شدہ",
    certs: [
      { name: "وزارت ٹرانسپورٹ", desc: "آفیشل آپریٹر لائسنس #1024-MOT", icon: Award },
      { name: "پبلک ٹرانسپورٹ اتھارٹی (TGA)", desc: "ایگزیکٹو لیموزین کوڈز کے مطابق تعمیل", icon: ShieldCheck },
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
    { label: t.stats[1].label, value: trustStats.vipTripsCompleted },
    { label: t.stats[2].label, value: `${trustStats.experienceYears} ${language === 'ar' ? 'عاماً' : 'Years'}` },
    { label: t.stats[3].label, value: `${language === 'ar' ? '+' : ''}${trustStats.countriesServed.replace('+', '')} ${language === 'ar' ? 'دولة' : 'Countries'}` }
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
            <span className="text-xs uppercase tracking-[0.2em] text-[#B8963B] font-semibold">{t.storySubtitle}</span>
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
          <span className="text-xs uppercase tracking-[0.2em] text-[#B8963B] font-semibold">{t.pillarsSubtitle}</span>
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
          <span className="text-xs uppercase tracking-[0.2em] text-[#B8963B] font-semibold">{t.certSubtitle}</span>
          <h2 className="mt-2 font-heading text-3xl md:text-4xl font-bold text-[#1C1C1C]">{t.certTitle}</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {t.certs.map((cert, index) => {
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
          <span className="text-xs uppercase tracking-[0.2em] text-[#B8963B] font-semibold">{t.teamSubtitle}</span>
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
