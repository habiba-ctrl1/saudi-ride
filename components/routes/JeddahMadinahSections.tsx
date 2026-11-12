import Link from "next/link";
import { MessageSquare, Mail } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";

// Quick answer + honest car/train/bus comparison + Path B (email RFQ) for
// /routes/jeddah-to-madinah and /routes/madinah-to-jeddah (EN + AR).
// Facts: 420 km / ~240 min = lib/data/routes.ts. Train "2-2.5 h airport station -> Madinah" and the
// existence of the JED airport station are from the live blog guide
// lib/data/blog/posts/jeddah-to-madinah-taxi-guide-fares.ts (not independently sourced; the page
// tells readers to check the operator timetable). Bus ~6-7 h is the figure already used on
// /guides/makkah-to-madinah-transport-guide for the holy-city corridor — NOT restated here for
// Jeddah, to avoid an unsourced number. No prices (facts.md: fare bands TODO). Fixed fare, 24h
// free cancellation and 15-30 min free waiting are confirmed in facts.md.

type L = "en" | "ar";
type Dir = "jeddah-to-madinah" | "madinah-to-jeddah";

const wa = (text: string) => `${contactConfig.whatsappLink}?text=${encodeURIComponent(text)}`;
const CITY = { en: { jeddah: "Jeddah", madinah: "Madinah" }, ar: { jeddah: "جدة", madinah: "المدينة المنورة" } };

export function JeddahMadinahSections({ locale, dir }: { locale: L; dir: Dir }) {
  const en = locale === "en";
  const c = CITY[locale];
  const from = dir === "jeddah-to-madinah" ? c.jeddah : c.madinah;
  const to = dir === "jeddah-to-madinah" ? c.madinah : c.jeddah;
  const pre = locale === "ar" ? "/ar" : "";
  const reverseHref = `${pre}/routes/${dir === "jeddah-to-madinah" ? "madinah-to-jeddah" : "jeddah-to-madinah"}`;
  const airportHref = dir === "jeddah-to-madinah" ? "/routes/jeddah-airport-to-madinah" : "/routes/madinah-to-jeddah-airport";

  const prefill = en
    ? `Hello Taxi Saudi Arabia,\nI would like to request a private transfer.\n\n• From: ${from} (hotel/address): \n• To: ${to} (hotel/address): \n• Date & time: \n• Passengers & luggage: \n• Vehicle: Sedan / SUV / GMC / Van\n\nPlease confirm availability and the fare.`
    : `السلام عليكم، أرغب بطلب نقل خاص.\n\n• من: ${from} (الفندق/العنوان): \n• إلى: ${to} (الفندق/العنوان): \n• التاريخ والوقت: \n• عدد الركاب والحقائب: \n• السيارة: سيدان / SUV / GMC / فان\n\nيرجى تأكيد التوفر والسعر.`;
  const mailSubject = en ? `Group / corporate transfer quote — ${from} to ${to}` : `طلب عرض سعر نقل مجموعات/شركات — ${from} إلى ${to}`;
  const mailBody = en
    ? `Hello Taxi Saudi Arabia,\n\nPlease send a written quote.\n\n• Company / group name: \n• Contact name & role: \n• Date & pickup time: \n• Pickup (${from}): \n• Drop-off (${to}): \n• Passengers & luggage: \n• Vehicle category: \n• Invoicing needed (VAT / PO reference): \n`
    : `مرحباً فريق تاكسي السعودية،\n\nنرجو إرسال عرض سعر مكتوب.\n\n• اسم الشركة/المجموعة: \n• اسم وصفة المسؤول: \n• التاريخ ووقت الاستلام: \n• الاستلام (${from}): \n• الوصول (${to}): \n• عدد الركاب والحقائب: \n• فئة السيارة: \n• الفوترة (ضريبي / أمر شراء): \n`;

  const heads = en ? ["", "Private transfer", "Haramain train"] : ["", "نقل خاص", "قطار الحرمين"];
  const rows = en
    ? [
        ["Route", "Hotel or address to hotel or address", "Station to station; a car is still needed at both ends"],
        ["Time (approx.)", "About 4 hours on the road, plus rest and prayer stops", "About 2–2.5 hours from the Jeddah Airport station to Madinah station, plus transfers"],
        ["Luggage", "Carried in the vehicle, no repacking", "Limits apply"],
        ["Flexibility", "You choose departure time and stops", "Fixed timetable"],
        ["Best for", "Families, elderly travellers, late arrivals, groups", "Light luggage and daytime travel"],
      ]
    : [
        ["المسار", "من الفندق أو العنوان إلى الفندق أو العنوان", "من محطة إلى محطة، ويلزم سيارة في الطرفين"],
        ["المدة (تقريباً)", "نحو 4 ساعات على الطريق إضافة إلى توقفات الراحة والصلاة", "نحو ساعتين إلى ساعتين ونصف من محطة مطار جدة إلى محطة المدينة، إضافة إلى الانتقال"],
        ["الحقائب", "تُحمل في السيارة دون إعادة ترتيب", "قيود على الحقائب"],
        ["المرونة", "تحدد وقت الانطلاق والتوقفات", "جدول ثابت"],
        ["الأنسب لـ", "العائلات وكبار السن والوصول المتأخر والمجموعات", "الحقائب الخفيفة والسفر نهاراً"],
      ];

  const card = "bg-white border border-[#16A34A]/12 rounded-3xl p-6 sm:p-8 shadow-sm";
  const btn = "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold";
  const link = "font-semibold text-[#16A34A] underline underline-offset-2";

  return (
    <div dir={en ? "ltr" : "rtl"} className={`space-y-10 ${en ? "" : "text-right"}`}>
      <section className={card} aria-labelledby="jm-quick">
        <h2 id="jm-quick" className="font-heading text-2xl font-bold text-[#1C1C1C]">
          {en ? `How far is ${from} from ${to} by private car?` : `كم المسافة من ${from} إلى ${to} بسيارة خاصة؟`}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4B5563]">
          {en
            ? `${from} to ${to} is about 420 km by road, roughly 4 hours in a private car before rest stops. The fare is quoted and agreed before you book — no meter and no surge — with free cancellation up to 24 hours before pickup and 15–30 minutes of free waiting. Arriving or departing by air? Ask about the airport version of this trip, which starts or ends at the terminal.`
            : `المسافة من ${from} إلى ${to} نحو 420 كم بالطريق البري، وتستغرق نحو 4 ساعات بسيارة خاصة قبل توقفات الراحة. يُحدَّد السعر ويُتفق عليه قبل الحجز دون عدّاد أو تسعير متغيّر، مع إلغاء مجاني حتى 24 ساعة قبل الاستلام وانتظار مجاني 15–30 دقيقة. هل تصل أو تغادر جواً؟ اطلب نسخة المطار من هذه الرحلة التي تبدأ أو تنتهي عند الصالة.`}
        </p>
      </section>

      <section className={card} aria-labelledby="jm-compare">
        <h2 id="jm-compare" className="font-heading text-2xl font-bold text-[#1C1C1C]">
          {en ? `Private car or Haramain train from ${from} to ${to}?` : `سيارة خاصة أم قطار الحرمين من ${from} إلى ${to}؟`}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#4B5563]">
          {en
            ? "The train is faster between stations. A private car is the only option that runs hotel to hotel without changing vehicle. Times are approximate; check the current train timetable with the operator before planning around it."
            : "القطار أسرع بين المحطتين، أما السيارة الخاصة فهي الخيار الوحيد من فندق إلى فندق دون تبديل وسيلة النقل. الأوقات تقريبية، وتحقق من جدول القطار الحالي لدى المشغّل قبل التخطيط."}
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse text-sm">
            <thead>
              <tr className="bg-[#F9FAFB]">
                {heads.map((h, i) => (
                  <th key={i} scope="col" className={`border border-[#16A34A]/15 p-3 font-bold text-[#1C1C1C] ${en ? "text-left" : "text-right"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, a, b]) => (
                <tr key={label}>
                  <th scope="row" className={`border border-[#16A34A]/15 bg-[#F9FAFB] p-3 font-semibold text-[#1C1C1C] ${en ? "text-left" : "text-right"}`}>{label}</th>
                  <td className="border border-[#16A34A]/15 p-3 text-[#1C1C1C]">{a}</td>
                  <td className="border border-[#16A34A]/15 p-3 text-[#4B5563]">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex flex-col gap-1 text-sm">
          <Link href="/blog/jeddah-to-madinah-taxi-guide-fares" className={link}>
            {en ? "Compare car, train, coach and flight from Jeddah Airport to Madinah" : "قارن بين السيارة والقطار والحافلة والطيران من مطار جدة إلى المدينة"}
          </Link>
          <Link href={airportHref} className={link}>
            {en ? "Flying in or out? Airport version of this transfer" : "تصل أو تغادر جواً؟ نسخة المطار من هذا النقل"}
          </Link>
          <Link href="/distance/jeddah-to-madinah" className={link}>
            {en ? "Jeddah to Madinah distance and driving time" : "مسافة ووقت القيادة بين جدة والمدينة"}
          </Link>
          <Link href={reverseHref} className={link}>
            {en ? `Travelling the other way? ${to} to ${from} private transfer` : `السفر بالاتجاه المعاكس؟ نقل خاص من ${to} إلى ${from}`}
          </Link>
        </div>
      </section>

      <section className={card} aria-labelledby="jm-groups">
        <h2 id="jm-groups" className="font-heading text-2xl font-bold text-[#1C1C1C]">
          {en ? "Group, family and corporate transfers between Jeddah and Madinah" : "نقل المجموعات والعائلات والشركات بين جدة والمدينة"}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#4B5563]">
          {en
            ? "Travel managers and group organisers can request a written quotation by email. Tell us the dates, group size and luggage and we confirm the vehicle categories available through our partner network. Corporate invoicing can be arranged through our sister company."
            : "يمكن لمدراء السفر ومنظمي المجموعات طلب عرض سعر مكتوب عبر البريد. أخبرنا بالتواريخ وعدد الأفراد والحقائب فنؤكد فئات السيارات المتاحة عبر شبكة شركائنا. ويمكن ترتيب فوترة الشركات عبر شركتنا الشقيقة."}
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a href={`${contactConfig.emailLink}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`} className={`${btn} border border-[#16A34A] text-[#16A34A] hover:bg-[#16A34A]/5`}>
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
