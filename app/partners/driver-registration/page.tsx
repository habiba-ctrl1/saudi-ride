"use client";

import { useLanguage } from "@/lib/context/LanguageContext";
import { motion } from "framer-motion";
import { CheckSquare, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const translations = {
  en: {
    badge: "Chauffeur Network",
    title: "Drive with Riyadh Taxi",
    description: "Join Saudi Arabia's premier network of luxury executive chauffeurs. Secure premium steady bookings, benefit from flexible dispatch hours, and enjoy high earnings.",
    
    // Requirements
    reqTitle: "Chauffeur Minimum Qualifications",
    reqSubtitle: "High standards to protect luxury travel",
    reqs: [
      "Must hold a valid, clean Saudi Arabia Driving License.",
      "Must have a completely clean background record (No active violations).",
      "Vehicle year model must be 2020 or newer (spotless condition).",
      "Professional attire (traditional Saudi dress or dark formal suit).",
      "Basic multilingual capability (Arabic & English conversational skills)."
    ],

    // What to Expect
    stepsTitle: "What to Expect After Applying",
    steps: [
      { num: "1", title: "Document Verification", desc: "Our recruitment managers perform comprehensive license validation and background registry checks." },
      { num: "2", title: "Physical Vehicle Audit", desc: "A 40-point visual and mechanical vehicle inspection is scheduled at our Riyadh fleet hub." },
      { num: "3", title: "VIP Hospitality Training", desc: "Complete specialized concierge client-care, route protocols, and luggage handling courses." }
    ],

    // Application Form
    formTitle: "Chauffeur Partner Application",
    formSubtitle: "Complete the form below to begin screening",
    labelName: "Chauffeur Full Name",
    labelPhone: "Phone / WhatsApp Number",
    labelLicense: "Saudi Driving License Number",
    labelVehicle: "Vehicle Year, Brand & Model",
    labelExp: "Chauffeur Experience Duration",
    btnSubmit: "Submit Driver Application",
    btnSubmitting: "Registering Driver Applicant...",
    successMsg: "Your Chauffeur application has been safely received! Our fleet coordinators will contact you via WhatsApp shortly.",
    errorMsg: "Something went wrong. Please check your form or reach out directly to operations.",

    expOptions: [
      { value: "1-2", label: "1 to 2 Years" },
      { value: "3-5", label: "3 to 5 Years" },
      { value: "5+", label: "5+ Years Executive Chauffeur" }
    ]
  },
  ar: {
    badge: "شبكة السائقين المحترفين",
    title: "انضم إلى نخبة سائقي رياض لوكس",
    description: "انضم إلى أرقى شبكة تنقل فاخر بالمملكة. احصل على رحلات مستمرة بأسعار ممتازة، واستمتع بمرونة ساعات العمل وبدعم تقني وفني على مدار الساعة.",
    
    // Requirements
    reqTitle: "شروط ومتطلبات الانضمام",
    reqSubtitle: "معايير عالية لضمان خدمة VIP تليق بعملائنا",
    reqs: [
      "حيازة رخصة قيادة سعودية سارية المفعول وسجل مروري خالٍ من المخالفات.",
      "سجل جنائي نظيف بالكامل وبدون قيود نشطة.",
      "يجب أن تكون السيارة موديل 2020 أو أحدث وبحالة ممتازة وخالية من العيوب.",
      "الالتزام بالزي الرسمي المهندم (الزي السعودي الرسمي أو بدلة رسمية غامقة).",
      "معرفة أساسية بالتحدث باللغتين العربية والإنجليزية لسهولة التواصل.",
    ],

    // What to Expect
    stepsTitle: "خطوات التقديم والقبول",
    steps: [
      { num: "١", title: "مراجعة المستندات والتراخيص", desc: "يقوم فريق التشغيل لدينا بالتحقق من صحة المستندات والرخص والسجل المروري للمتقدم." },
      { num: "٢", title: "الفحص الفني للسيارة", desc: "تحديد موعد لفحص السيارة في مركزنا بالرياض للتأكد من مطابقتها لمعايير الفئة الفاخرة." },
      { num: "٣", title: "تدريب كبار الشخصيات", desc: "حضور دورة تدريبية مكثفة حول خدمة العملاء الراقية، بروتوكولات الحقائب، وإدارة المسارات." }
    ],

    // Application Form
    formTitle: "طلب انضمام سائق خاص",
    formSubtitle: "أكمل النموذج أدناه لبدء عملية الفرز المباشر",
    labelName: "اسم السائق الكامل",
    labelPhone: "رقم الجوال / الواتساب",
    labelLicense: "رقم رخصة القيادة السعودية",
    labelVehicle: "سنة الصنع، نوع السيارة وموديلها",
    labelExp: "سنة الخبرة في مجال القيادة",
    btnSubmit: "تقديم طلب الانضمام",
    btnSubmitting: "جاري تقديم الطلب...",
    successMsg: "تم استلام طلب الانضمام الخاص بك بنجاح! سيتواصل معك مسؤولو الأسطول قريباً عبر الواتساب.",
    errorMsg: "حدث خطأ ما. يرجى مراجعة البيانات أو الاتصال بإدارة العمليات مباشرة.",

    expOptions: [
      { value: "1-2", label: "من سنة إلى سنتين" },
      { value: "3-5", label: "من ٣ إلى ٥ سنوات" },
      { value: "5+", label: "أكثر من ٥ سنوات خبرة" }
    ]
  },
  ur: {
    badge: "ڈرائیور نیٹ ورک",
    title: "ریاض لوکس کے ساتھ کام کریں",
    description: "سعودی عرب کے معروف ترین لگژری ڈرائیور نیٹ ورک کا حصہ بنیں۔ مستقل بکنگز، لچکدار اوقات کار اور بہترین آمدنی حاصل کریں۔",
    
    // Requirements
    reqTitle: "ڈرائیور کے لیے کم از کم اہلیت",
    reqSubtitle: "پریمیم سروس اور معیار کو برقرار رکھنے کے لیے سخت معیارات",
    reqs: [
      "سعودی عرب کا درست اور صاف ڈرائیونگ لائسنس ہونا ضروری ہے۔",
      "سجل مروری مکمل طور پر صاف ہونا چاہیے (کوئی خلاف ورزی نہ ہو)۔",
      "گاڑی کا ماڈل 2020 یا اس سے نیا اور بالکل بے داغ ہونا چاہیے۔",
      "پیشہ ورانہ لباس (سعودی روایتی لباس یا ڈارک فارمل سوٹ)۔",
      "عربی اور انگریزی میں بنیادی گفتگو کرنے کی صلاحیت۔"
    ],

    // What to Expect
    stepsTitle: "درخواست کے بعد کا طریقہ کار",
    steps: [
      { num: "1", title: "کاغذات کی جانچ پڑتال", desc: "ہمارے مینیجرز لائسنس کی توثیق اور بیک گراؤنڈ چیکس انجام دیتے ہیں۔" },
      { num: "2", title: "گاڑی کا فزیکل معائنہ", desc: "ریاض فلیٹ حب میں گاڑی کا مکمل بصری اور مکینیکل معائنہ کیا جاتا ہے۔" },
      { num: "3", title: "وی آئی پی کسٹمر کیئر ٹریننگ", desc: "لگژری گیسٹ پروٹوکول، کسٹمر کیئر اور سامان سنبھالنے کی خصوصی تربیت۔" }
    ],

    // Application Form
    formTitle: "ڈرائیور پارٹنر فارم",
    formSubtitle: "اسکریننگ شروع کرنے کے لیے درج ذیل فارم پُر کریں",
    labelName: "ڈرائیور کا پورا نام",
    labelPhone: "موبائل / واٹس ایپ نمبر",
    labelLicense: "سعودی لائسنس نمبر",
    labelVehicle: "گاڑی کا سال، برانڈ اور ماڈل",
    labelExp: "ڈرائیونگ کا تجربہ",
    btnSubmit: "درخواست جمع کریں",
    btnSubmitting: "درخواست جمع کی جا رہی ہے...",
    successMsg: "آپ کی درخواست کامیابی سے موصول ہو گئی ہے! ہماری فلیٹ ٹیم جلد رابطہ کرے گی۔",
    errorMsg: "کچھ غلط ہو گیا۔ براہ کرم دوبارہ کوشش کریں یا کسٹمر سروس سے رابطہ کریں۔",

    expOptions: [
      { value: "1-2", label: "1 سے 2 سال" },
      { value: "3-5", label: "3 سے 5 سال" },
      { value: "5+", label: "5 سال سے زیادہ کا تجربہ" }
    ]
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function DriverRegistrationPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    licenseNumber: "",
    vehicleDetails: "",
    experience: "3-5"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/partners/driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(t.successMsg);
        setFormData({
          name: "",
          phone: "",
          licenseNumber: "",
          vehicleDetails: "",
          experience: "3-5"
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
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-28 pb-16">
      
      {/* Entrance Hero text */}
      <section className="section-container">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">
            {t.badge}
          </span>
          <h1 className="mt-4 font-heading text-4xl font-bold leading-tight md:text-5.5xl text-[#F5F0E8]">
            {t.title}
          </h1>
          <p className="mt-6 text-sm md:text-base leading-relaxed text-[#A1A1A6]">
            {t.description}
          </p>
        </motion.div>
      </section>

      {/* Grid split of details/checklist vs application form */}
      <section className="section-container mt-16">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          
          {/* Left: Requirements checklist & steps timeline */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Checklist */}
            <div className="rounded-3xl border border-[#C9A84C]/10 bg-[#111111] p-8 space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold">{t.reqSubtitle}</span>
                <h3 className="font-heading text-xl font-bold text-[#F5F0E8]">{t.reqTitle}</h3>
              </div>
              <div className="space-y-4 text-xs font-semibold text-[#A1A1A6]">
                {t.reqs.map((req, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <CheckSquare className="h-4.5 w-4.5 text-[#C9A84C] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{req}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Application steps */}
            <div className="rounded-3xl border border-[#C9A84C]/10 bg-[#111111] p-8 space-y-6">
              <h3 className="font-heading text-xl font-bold text-[#F5F0E8]">{t.stepsTitle}</h3>
              <div className="space-y-6">
                {t.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start relative group">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/35 text-xs font-extrabold text-[#C9A84C] shrink-0 mt-0.5">
                      {step.num}
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-heading text-sm font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors">{step.title}</h4>
                      <p className="text-[10px] text-[#A1A1A6] leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Driver application Form */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lg:col-span-7 rounded-3xl border border-[#C9A84C]/20 bg-[#121212] p-8 md:p-10 shadow-2xl relative"
          >
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />

            <div className="mb-8">
              <h2 className="font-heading text-2xl font-bold text-[#F5F0E8]">{t.formTitle}</h2>
              <p className="text-xs text-[#C9A84C] font-semibold mt-1.5">{t.formSubtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#A1A1A6] font-semibold">{t.labelName}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-[#C9A84C]/15 bg-black/40 px-4 py-3.5 text-xs text-[#F5F0E8] focus:border-[#C9A84C] focus:outline-none transition-colors"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#A1A1A6] font-semibold">{t.labelPhone}</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-[#C9A84C]/15 bg-black/40 px-4 py-3.5 text-xs text-[#F5F0E8] focus:border-[#C9A84C] focus:outline-none transition-colors"
                  />
                </div>

                {/* Saudi License Number */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#A1A1A6] font-semibold">{t.labelLicense}</label>
                  <input
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full rounded-xl border border-[#C9A84C]/15 bg-black/40 px-4 py-3.5 text-xs text-[#F5F0E8] focus:border-[#C9A84C] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Vehicle Specs */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#A1A1A6] font-semibold">{t.labelVehicle}</label>
                  <input
                    type="text"
                    required
                    value={formData.vehicleDetails}
                    onChange={(e) => setFormData({ ...formData, vehicleDetails: e.target.value })}
                    placeholder="e.g. 2022 Toyota Camry"
                    className="w-full rounded-xl border border-[#C9A84C]/15 bg-black/40 px-4 py-3.5 text-xs text-[#F5F0E8] focus:border-[#C9A84C] focus:outline-none transition-colors"
                  />
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#A1A1A6] font-semibold">{t.labelExp}</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full rounded-xl border border-[#C9A84C]/15 bg-black/40 px-4 py-3.5 text-xs text-[#F5F0E8] focus:border-[#C9A84C] focus:outline-none transition-colors"
                  >
                    {t.expOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#121212]">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#C9A84C] py-4 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#B8963B] disabled:bg-[#C9A84C]/50 transition-colors flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(201,168,76,0.2)]"
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
