import Link from "next/link";
import { MessageSquare, Mail } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";

// Quick answer + honest travel-mode comparison + Path B (corporate / group email RFQ)
// for /routes/makkah-to-madinah and /routes/madinah-to-makkah (EN + AR).
// Facts used: distance ~430 km and 240 min come from lib/data/routes.ts; train ~2.5 h and bus
// ~6-7 h are the figures already published in /guides/makkah-to-madinah-transport-guide
// (lib/data/guides.ts). No prices (facts.md: indicative fares TODO). Fixed-fare, 24h free
// cancellation, 15-30 min free waiting are confirmed in facts.md. Corporate invoicing wording
// is the verbatim approved line. Train timetable must be checked with the operator.

type L = "en" | "ar";
type Dir = "makkah-to-madinah" | "madinah-to-makkah";

const wa = (text: string) => `${contactConfig.whatsappLink}?text=${encodeURIComponent(text)}`;

const CITY = {
  en: { makkah: "Makkah", madinah: "Madinah" },
  ar: { makkah: "مكة المكرمة", madinah: "المدينة المنورة" },
};

export function HolyCitySections({ locale, dir: direction }: { locale: L; dir: Dir }) {
  const c = CITY[locale];
  const from = direction === "makkah-to-madinah" ? c.makkah : c.madinah;
  const to = direction === "makkah-to-madinah" ? c.madinah : c.makkah;
  const reverseHref = `${locale === "ar" ? "/ar" : ""}/routes/${direction === "makkah-to-madinah" ? "madinah-to-makkah" : "makkah-to-madinah"}`;
  const guideHref = "/guides/makkah-to-madinah-transport-guide";
  const distHref = "/distance/makkah-to-madinah";
  const en = locale === "en";

  const prefill = en
    ? `Hello Taxi Saudi Arabia,\nI would like to request a private transfer.\n\n• From: ${from} (hotel/address): \n• To: ${to} (hotel/address): \n• Date & time: \n• Passengers & luggage: \n• Vehicle: Sedan / SUV / GMC / Van\n\nPlease confirm availability and the fare.`
    : `السلام عليكم، أرغب بطلب نقل خاص.\n\n• من: ${from} (الفندق/العنوان): \n• إلى: ${to} (الفندق/العنوان): \n• التاريخ والوقت: \n• عدد الركاب والحقائب: \n• السيارة: سيدان / SUV / GMC / فان\n\nيرجى تأكيد التوفر والسعر.`;

  const mailSubject = en
    ? `Group / corporate transfer quote — ${from} to ${to}`
    : `طلب عرض سعر نقل مجموعات/شركات — ${from} إلى ${to}`;
  const mailBody = en
    ? `Hello Taxi Saudi Arabia,\n\nPlease send a written quote.\n\n• Company / group name: \n• Contact name & role: \n• Date & pickup time: \n• Pickup (${from}): \n• Drop-off (${to}): \n• Passengers & luggage: \n• Vehicle category: \n• Invoicing needed (VAT / PO reference): \n`
    : `مرحباً فريق تاكسي السعودية،\n\nنرجو إرسال عرض سعر مكتوب.\n\n• اسم الشركة/المجموعة: \n• اسم وصفة المسؤول: \n• التاريخ ووقت الاستلام: \n• الاستلام (${from}): \n• الوصول (${to}): \n• عدد الركاب والحقائب: \n• فئة السيارة: \n• الفوترة (ضريبي / أمر شراء): \n`;

  const rows = en
    ? [
        ["Route", "Door to door, hotel to hotel", "Station to station (taxi needed at both ends)", "Fixed bus stops"],
        ["Time (approx.)", "About 4–5 hours including prayer and rest stops", "About 2.5 hours between stations, plus transfers and check-in", "About 6–7 hours"],
        ["Luggage", "Carried in the vehicle, no repacking", "Size and weight limits apply", "Limits set by the bus operator"],
        ["Flexibility", "You choose the departure time and stops", "Fixed timetable", "Fixed timetable"],
        ["Best for", "Families, elderly pilgrims, heavy luggage, groups", "Light luggage, fastest station-to-station time", "Lowest-cost travel, no urgency"],
      ]
    : [
        ["المسار", "من الباب إلى الباب، من فندق إلى فندق", "من محطة إلى محطة (يلزم تاكسي في الطرفين)", "محطات توقف ثابتة"],
        ["المدة (تقريباً)", "نحو 4–5 ساعات شاملة توقفات الصلاة والراحة", "نحو ساعتين ونصف بين المحطتين، إضافة إلى الانتقال والإجراءات", "نحو 6–7 ساعات"],
        ["الحقائب", "تُحمل في السيارة دون إعادة ترتيب", "قيود على حجم الحقائب ووزنها", "حسب شروط مشغّل الحافلة"],
        ["المرونة", "تحدد وقت الانطلاق والتوقفات", "جدول ثابت", "جدول ثابت"],
        ["الأنسب لـ", "العائلات وكبار السن والحقائب الكثيرة والمجموعات", "الحقائب الخفيفة وأسرع وقت بين المحطتين", "أقل تكلفة دون استعجال"],
      ];
  const heads = en ? ["", "Private transfer", "Haramain train", "Intercity bus"] : ["", "نقل خاص", "قطار الحرمين", "حافلة بين المدن"];

  const card = "bg-white border border-[#16A34A]/12 rounded-3xl p-6 sm:p-8 shadow-sm";
  const btn = "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold";

  return (
    <div dir={en ? "ltr" : "rtl"} className={`space-y-10 ${en ? "" : "text-right"}`}>
      <section className={card} aria-labelledby="hc-quick">
        <h2 id="hc-quick" className="font-heading text-2xl font-bold text-[#1C1C1C]">
          {en ? `How long is a private ${from} to ${to} transfer?` : `كم تستغرق رحلة النقل الخاص من ${from} إلى ${to}؟`}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4B5563]">
          {en
            ? `${from} to ${to} is about 430 km by road. A private car takes roughly 4 to 5 hours door to door, including prayer and rest stops. The fare is quoted and agreed before you book — no meter and no surge — and cancellation is free up to 24 hours before pickup. Free waiting time is 15–30 minutes. Note that vehicles may not reach the Haram or Masjid an-Nabawi gates themselves; the driver drops you at the nearest permitted point.`
            : `المسافة بين ${from} و${to} نحو 430 كم بالطريق البري، وتستغرق الرحلة بسيارة خاصة نحو 4 إلى 5 ساعات من الباب إلى الباب شاملة توقفات الصلاة والراحة. يُحدَّد السعر ويُتفق عليه قبل الحجز دون عدّاد أو تسعير متغيّر، والإلغاء مجاني حتى 24 ساعة قبل الاستلام، والانتظار المجاني 15–30 دقيقة. قد لا تصل السيارة إلى أبواب الحرم أو المسجد النبوي، فينزلك السائق عند أقرب نقطة مسموحة.`}
        </p>
      </section>

      <section className={card} aria-labelledby="hc-compare">
        <h2 id="hc-compare" className="font-heading text-2xl font-bold text-[#1C1C1C]">
          {en ? `Private car, train or bus from ${from} to ${to}?` : `سيارة خاصة أم قطار أم حافلة من ${from} إلى ${to}؟`}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#4B5563]">
          {en
            ? "The train is faster between stations and the bus is cheapest; a private car is the only option that goes from your hotel to your hotel. Times are approximate. Check the current train timetable with the operator before you plan around it."
            : "القطار أسرع بين المحطتين والحافلة الأرخص، أما السيارة الخاصة فهي الخيار الوحيد من فندقك إلى فندقك. الأوقات تقريبية، وتحقق من جدول القطار الحالي لدى المشغّل قبل التخطيط."}
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <thead>
              <tr className="bg-[#F9FAFB]">
                {heads.map((h, i) => (
                  <th key={i} scope="col" className={`border border-[#16A34A]/15 p-3 font-bold text-[#1C1C1C] ${en ? "text-left" : "text-right"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, a, b, d]) => (
                <tr key={label}>
                  <th scope="row" className={`border border-[#16A34A]/15 bg-[#F9FAFB] p-3 font-semibold text-[#1C1C1C] ${en ? "text-left" : "text-right"}`}>{label}</th>
                  <td className="border border-[#16A34A]/15 p-3 text-[#1C1C1C]">{a}</td>
                  <td className="border border-[#16A34A]/15 p-3 text-[#4B5563]">{b}</td>
                  <td className="border border-[#16A34A]/15 p-3 text-[#4B5563]">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex flex-col gap-1 text-sm">
          <Link href={guideHref} className="font-semibold text-[#16A34A] underline underline-offset-2">
            {en ? "Full guide: Makkah to Madinah by taxi, Haramain train or bus" : "الدليل الكامل: من مكة إلى المدينة بالتاكسي أو قطار الحرمين أو الحافلة"}
          </Link>
          <Link href={distHref} className="font-semibold text-[#16A34A] underline underline-offset-2">
            {en ? "Makkah to Madinah distance and driving time" : "مسافة ووقت القيادة بين مكة والمدينة"}
          </Link>
          <Link href={reverseHref} className="font-semibold text-[#16A34A] underline underline-offset-2">
            {en ? `Travelling the other way? ${to} to ${from} private transfer` : `السفر بالاتجاه المعاكس؟ نقل خاص من ${to} إلى ${from}`}
          </Link>
        </div>
      </section>

      <section className={card} aria-labelledby="hc-groups">
        <h2 id="hc-groups" className="font-heading text-2xl font-bold text-[#1C1C1C]">
          {en ? "Group, delegation and corporate transfers between the Holy Cities" : "نقل المجموعات والوفود والشركات بين المدينتين المقدستين"}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#4B5563]">
          {en
            ? "Travel managers and group organisers can request a written quotation by email. Tell us the dates, group size and luggage and we confirm the vehicle categories available through our partner network. Corporate invoicing can be arranged through our sister company."
            : "يمكن لمدراء السفر ومنظمي المجموعات طلب عرض سعر مكتوب عبر البريد. أخبرنا بالتواريخ وعدد الأفراد والحقائب فنؤكد فئات السيارات المتاحة عبر شبكة شركائنا. ويمكن ترتيب فوترة الشركات عبر شركتنا الشقيقة."}
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={`${contactConfig.emailLink}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`}
            className={`${btn} border border-[#16A34A] text-[#16A34A] hover:bg-[#16A34A]/5`}
          >
            <Mail className="h-4 w-4" aria-hidden /> {en ? "Request a written quote by email" : "اطلب عرض سعر مكتوباً بالبريد"}
          </a>
          <a href={wa(prefill)} target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#16A34A] text-white hover:bg-[#15803D]`}>
            <MessageSquare className="h-4 w-4" aria-hidden /> {en ? "Get a quote on WhatsApp" : "احصل على السعر عبر واتساب"}
          </a>
        </div>
      </section>
    </div>
  );
}
