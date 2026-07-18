"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { motion } from "framer-motion";
import { Phone, Mail, MessageSquare, Clock, MapPin, Send, Loader2 } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { useState } from "react";
import { toast } from "sonner";

const translations = {
  en: {
    badge: "Contact Concierge Desk",
    title: "Speak with our private booking desk",
    description: "Available 24/7 for airport, Umrah, and custom intercity reservations across the Kingdom and neighboring GCC corridors.",
    cards: [
      {
        title: "Primary Phone Desk",
        value: contactConfig.primaryPhoneDisplay,
        link: contactConfig.primaryPhoneLink,
        badge: "Call 24/7 Support",
        icon: Phone
      },
      {
        title: "Official Email Inquiry",
        value: contactConfig.email,
        link: contactConfig.emailLink,
        badge: "Send RFP / Proposal",
        icon: Mail
      },
      {
        title: "VIP WhatsApp Chat",
        value: "Start Booking Chat",
        link: contactConfig.whatsappLink,
        badge: "Fast Instant Booking",
        icon: MessageSquare
      }
    ],
    // Hours & Map
    officeHoursTitle: "Concierge Operational Hours",
    officeHoursDesc: "Our dispatch managers operate round-the-clock. Physical office assistance is available by appointment at our Olaya Headquarters in Riyadh.",
    officeHoursDays: "Saturday – Thursday: 8:00 AM – 10:00 PM",
    officeHoursFriday: "Friday: 2:00 PM – 9:00 PM (Emergency Dispatch: 24/7)",
    locationTitle: "HQ Location",
    locationDesc: "Al-Olaya District, Riyadh 12211, Kingdom of Saudi Arabia",

    // Form
    formTitle: "Send a Private Message",
    formSubtitle: "Receive a reply within 15 minutes",
    labelName: "Your Full Name",
    labelEmail: "Your Email Address",
    labelPhone: "Phone / WhatsApp Number",
    labelService: "Desired Service Category",
    labelMessage: "Detailed Travel Request",
    placeholderMessage: "Specify pickup date, time, vehicle preference, and route...",
    btnSubmit: "Send Request",
    btnSubmitting: "Dispatching Message...",
    successMessage: "Your message has been safely received! Our concierge team will reach out to you shortly.",
    errorMessage: "Something went wrong. Please try again or chat with us on WhatsApp.",
    services: [
      { value: "airport", label: "Airport VIP Transfer" },
      { value: "umrah", label: "Umrah Pilgrimage Transport" },
      { value: "intercity", label: "Intercity Fixed Journey" },
      { value: "corporate", label: "Corporate Executive Travel" },
      { value: "hourly", label: "Hourly Car Hire with Driver" }
    ]
  },
  ar: {
    badge: "مكتب الحجز الفاخر",
    title: "تحدث مع مكتب الحجوزات المباشر",
    description: "متاحون على مدار الساعة لخدمتكم وتلبية طلبات الحجز للمطارات، والعمرة، والتنقل الفاخر والسريع بين المدن ودول الخليج.",
    cards: [
      {
        title: "هاتف الحجز المباشر",
        value: contactConfig.primaryPhoneDisplay,
        link: contactConfig.primaryPhoneLink,
        badge: "اتصال مباشر 24/7",
        icon: Phone
      },
      {
        title: "البريد الإلكتروني الرسمي",
        value: contactConfig.email,
        link: contactConfig.emailLink,
        badge: "إرسال طلبات وعروض",
        icon: Mail
      },
      {
        title: "دردشة واتساب VIP",
        value: "ابدأ محادثة الحجز",
        link: contactConfig.whatsappLink,
        badge: "حجز فوري سريع",
        icon: MessageSquare
      }
    ],
    // Hours & Map
    officeHoursTitle: "أوقات عمل كونسيرج مكتبنا",
    officeHoursDesc: "يعمل مديرو الحركة على مدار الساعة. خدمات الدعم والمقابلة الشخصية متاحة في مقرنا بحي العليا بالرياض بموعد مسبق.",
    officeHoursDays: "السبت – الخميس: 8:00 صباحاً – 10:00 مساءً",
    officeHoursFriday: "الجمعة: 2:00 ظهراً – 9:00 مساءً (الحركة: 24/7)",
    locationTitle: "المقر الرئيسي",
    locationDesc: "حي العليا، الرياض 12211، المملكة العربية السعودية",

    // Form
    formTitle: "أرسل رسالة خاصة",
    formSubtitle: "سيتم الرد عليك في غضون 15 دقيقة فقط",
    labelName: "الاسم الكامل",
    labelEmail: "البريد الإلكتروني",
    labelPhone: "رقم الجوال / الواتساب",
    labelService: "نوع الخدمة المطلوبة",
    labelMessage: "تفاصيل طلب السفر الخاص بك",
    placeholderMessage: "اذكر تاريخ ووقت الرحلة، السيارة المفضلة، ومسار التوصيل...",
    btnSubmit: "إرسال الرسالة",
    btnSubmitting: "جاري الإرسال...",
    successMessage: "تم استلام رسالتك بنجاح! سيتواصل معك كونسيرج الخدمة خلال دقائق.",
    errorMessage: "حدث خطأ ما. يرجى المحاولة لاحقاً أو مراسلتنا مباشرة عبر الواتساب.",
    services: [
      { value: "airport", label: "توصيل مطار VIP" },
      { value: "umrah", label: "تنقلات العمرة والزيارة" },
      { value: "intercity", label: "تنقلات ثابتة بين المدن" },
      { value: "corporate", label: "خدمات رجال الأعمال والشركات" },
      { value: "hourly", label: "حجز سائق خاص بالساعة" }
    ]
  },
  ur: {
    badge: "بکنگ کنسیرج ڈیسک",
    title: "ہمارے نجی بکنگ ڈیسک سے رابطہ کریں",
    description: "ہوائی اڈے، عمرہ اور انٹرسٹی سفر کی بکنگ کے لیے مملکت اور جی سی سی کوریڈورز میں 24/7 دستیاب ہیں۔",
    cards: [
      {
        title: "بنیادی فون ڈیسک",
        value: contactConfig.primaryPhoneDisplay,
        link: contactConfig.primaryPhoneLink,
        badge: "کال کریں 24/7 سپورٹ",
        icon: Phone
      },
      {
        title: "آفیشل ای میل انکوائری",
        value: contactConfig.email,
        link: contactConfig.emailLink,
        badge: "تجاویز بھیجیں",
        icon: Mail
      },
      {
        title: "وی آئی پی واٹس ایپ چیٹ",
        value: "فوری بکنگ چیٹ",
        link: contactConfig.whatsappLink,
        badge: "فوری اور تیز بکنگ",
        icon: MessageSquare
      }
    ],
    // Hours & Map
    officeHoursTitle: "کنسیرج کے اوقات کار",
    officeHoursDesc: "ہمارے ڈسپیچ مینیجرز چوبیس گھنٹے کام کرتے ہیں۔ ہمارے ریاض آفس میں ملاقات کے لیے پیشگی وقت مقرر کرنا ضروری ہے۔",
    officeHoursDays: "ہفتہ – جمعرات: 8:00 صبح – 10:00 رات",
    officeHoursFriday: "جمعہ: 2:00 دوپہر – 9:00 رات (ایمرجنسی ڈسپیچ: 24/7)",
    locationTitle: "ہیڈ کوارٹر مقام",
    locationDesc: "العلیہ ڈسٹرکٹ، ریاض 12211، سعودی عرب",

    // Form
    formTitle: "نجی پیغام بھیجیں",
    formSubtitle: "15 منٹ کے اندر جواب حاصل کریں",
    labelName: "آپ کا پورا نام",
    labelEmail: "ای میل ایڈریس",
    labelPhone: "فون / واٹس ایپ نمبر",
    labelService: "مطلوبہ سروس کیٹیگری",
    labelMessage: "سفر کی تفصیلی درخواست",
    placeholderMessage: "پک اپ کی تاریخ، وقت، پسندیدہ گاڑی اور روٹ بتائیں...",
    btnSubmit: "درخواست بھیجیں",
    btnSubmitting: "پیغام بھیجا جا رہا ہے...",
    successMessage: "آپ کا پیغام کامیابی سے موصول ہو گیا ہے! ہماری کنسیرج ٹیم جلد ہی آپ سے رابطہ کرے گی۔",
    errorMessage: "کچھ غلط ہو گیا۔ براہ کرم دوبارہ کوشش کریں یا واٹس ایپ پر چیٹ کریں۔",
    services: [
      { value: "airport", label: "ایئرپورٹ وی آئی پی ٹرانسفر" },
      { value: "umrah", label: "عمرہ زائرین ٹرانسپورٹ" },
      { value: "intercity", label: "انٹرسٹی فکسڈ جرنی" },
      { value: "corporate", label: "کارپوریٹ ایگزیکٹو ٹریول" },
      { value: "hourly", label: "سائیک سائیک ڈرائیور چارٹر" }
    ]
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function ContactPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "airport",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(t.successMessage);
        setFormData({
          name: "",
          email: "",
          phone: "",
          serviceType: "airport",
          message: ""
        });
      } else {
        toast.error(data.error || t.errorMessage);
      }
    } catch {
      toast.error(t.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pt-28 pb-16">
      <section className="section-container">
        
        {/* Entrance Hero text */}
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

        {/* Dynamic Contact Grid Cards */}
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {t.cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.a
                key={card.title}
                href={card.link}
                target={card.title.includes("WhatsApp") || card.title.includes("واتساب") || card.title.includes("واٹس ایپ") ? "_blank" : undefined}
                rel={card.title.includes("WhatsApp") || card.title.includes("واتساب") || card.title.includes("واٹس ایپ") ? "noopener noreferrer" : undefined}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-[#16A34A]/12 bg-white p-8 shadow-2xl hover:border-[#C9A84C]/45 transition-all duration-300"
                whileHover={{ y: -6 }}
              >
                <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#C9A84C]/5 blur-2xl pointer-events-none" />

                <div className="space-y-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C9A84C]/35 bg-[#F0FDF4] text-[#C9A84C] shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[0.6rem] uppercase tracking-[0.18em] text-[#C9A84C] font-bold">
                      {card.badge}
                    </span>
                    <h2 className="font-heading text-xl font-bold text-[#1C1C1C] group-hover:text-[#16A34A] transition-colors">
                      {card.title}
                    </h2>
                  </div>
                </div>

                <div className="mt-8 border-t border-[#C9A84C]/10 pt-5 text-sm font-semibold tracking-wide text-[#1C1C1C]">
                  {card.value}
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Contact Split Form & Info Section */}
        <div className="mt-20 grid gap-12 lg:grid-cols-12 items-start">
          
          {/* Left Column: Form Info, Hours and Maps (Lg: 5cols) */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Working Hours */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-3xl border border-[#C9A84C]/10 bg-white p-8 space-y-5"
            >
              <h3 className="font-heading text-xl font-bold text-[#1C1C1C] flex items-center gap-3">
                <Clock className="h-5 w-5 text-[#C9A84C]" />
                <span>{t.officeHoursTitle}</span>
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">{t.officeHoursDesc}</p>
              
              <div className="space-y-2 text-xs border-t border-[#C9A84C]/10 pt-4 font-semibold text-[#1C1C1C]">
                <p className="text-[#C9A84C]">{t.officeHoursDays}</p>
                <p>{t.officeHoursFriday}</p>
              </div>
            </motion.div>

            {/* HQ Address Details */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-3xl border border-[#C9A84C]/10 bg-white p-8 space-y-4"
            >
              <h3 className="font-heading text-xl font-bold text-[#1C1C1C] flex items-center gap-3">
                <MapPin className="h-5 w-5 text-[#C9A84C]" />
                <span>{t.locationTitle}</span>
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed font-semibold">{t.locationDesc}</p>
            </motion.div>

            {/* Styled Custom-Darkened Saudi Map */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="h-[260px] rounded-3xl overflow-hidden border border-[#16A34A]/12 relative"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115949.20815152864!2d46.60222045147572!3d24.713551690013098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489301%3A0x8e79f1851173875c!2sAl%20Olaya%2C%20Riyadh%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                className="w-full h-full border-0 grayscale opacity-90"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>

          </div>

          {/* Right Column: Private Chauffeur Request Form (Lg: 7cols) */}
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
                
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">{t.labelName}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-[#16A34A]/12 bg-[#F0FDF4] px-4 py-3 text-xs text-[#1C1C1C] focus:border-[#C9A84C] focus:outline-none transition-colors"
                  />
                </div>

                {/* Email */}
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

              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                
                {/* Phone */}
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

                {/* Service Category */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">{t.labelService}</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full rounded-xl border border-[#16A34A]/12 bg-[#F0FDF4] px-4 py-3 text-xs text-[#1C1C1C] focus:border-[#C9A84C] focus:outline-none transition-colors"
                  >
                    {t.services.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-white text-[#1C1C1C]">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">{t.labelMessage}</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t.placeholderMessage}
                  className="w-full rounded-xl border border-[#16A34A]/12 bg-[#F0FDF4] px-4 py-3 text-xs text-[#1C1C1C] focus:border-[#C9A84C] focus:outline-none transition-colors resize-none placeholder:text-[#555]"
                />
              </div>

              {/* Submit Button */}
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
