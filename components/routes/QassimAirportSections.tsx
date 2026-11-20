import Link from "next/link";
import { CheckCircle2, Car, Users, Briefcase, UserCheck, Plane, MessageSquare } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";

// Sections for /routes/riyadh-to-al-qassim-airport (EN) and its /ar twin.
// Only claims allowed by seo/facts.md: no vehicle capacities, no prices, no airport
// procedure claims (pickups are arranged in advance, never assumed). The Riyadh
// district list is a pickup-area aid — coverage depends on the exact address and
// partner availability, stated on the page. Distance/time live in ROUTES_DATA.

type L = "en" | "ar";

const wa = (text: string) => `${contactConfig.whatsappLink}?text=${encodeURIComponent(text)}`;

const PREFILL_EN = (vehicle: string, journey = "One-way / Return") =>
  `Hello Taxi Saudi Arabia,\nI would like to request a private transfer.\n\n• From: Riyadh (pickup address/district): \n• To: Prince Naif bin Abdulaziz International Airport (ELQ)\n• Date & time: \n• Passengers & luggage: \n• Vehicle: ${vehicle}\n• Journey: ${journey}\n\nPlease confirm availability and the fare.`;

const PREFILL_AR = (vehicle: string) =>
  `السلام عليكم، أرغب بطلب نقل خاص.\n\n• من: الرياض (العنوان/الحي): \n• إلى: مطار الأمير نايف بن عبدالعزيز الدولي (ELQ)\n• التاريخ والوقت: \n• عدد الركاب والحقائب: \n• السيارة: ${vehicle}\n• الرحلة: ذهاب / ذهاب وعودة\n\nيرجى تأكيد التوفر والسعر.`;

const PREFILL_RETURN_EN = `Hello Taxi Saudi Arabia,\nI would like to arrange a private pickup from Al Qassim Airport.\n\n• From: Prince Naif bin Abdulaziz International Airport (ELQ)\n• To: Riyadh (drop-off address/district): \n• Flight number & arrival time: \n• Passengers & luggage: \n• Vehicle: Sedan / SUV / GMC / Other\n\nPlease confirm availability and the fare.`;
const PREFILL_RETURN_AR = `السلام عليكم، أرغب بترتيب استلام خاص من مطار القصيم.\n\n• من: مطار الأمير نايف بن عبدالعزيز الدولي (ELQ)\n• إلى: الرياض (عنوان/حي الوصول): \n• رقم الرحلة ووقت الوصول: \n• عدد الركاب والحقائب: \n• السيارة: سيدان / SUV / GMC / أخرى\n\nيرجى تأكيد التوفر والسعر.`;

const T = {
  en: {
    vehTitle: "Choose the right private vehicle",
    vehIntro: "Vehicles are arranged through our partner network and confirmed per booking. Tell us your passengers and luggage and we confirm which category fits — we do not promise a specific model.",
    vehicles: [
      { name: "Sedan", fit: "Individual travellers and small groups with moderate luggage.", pre: "Sedan" },
      { name: "SUV", fit: "Families and passengers who need extra space for people and bags.", pre: "SUV" },
      { name: "GMC / full-size SUV", fit: "Customers requesting a larger premium SUV, subject to availability.", pre: "GMC / full-size SUV" },
      { name: "Larger family vehicle", fit: "More passengers and luggage. Confirm the right vehicle before booking.", pre: "Larger family vehicle" },
    ],
    vehCta: "Request availability",
    stepsTitle: "How to arrange your Riyadh to Al Qassim Airport transfer",
    steps: [
      ["Send your journey details", "Share your pickup location, travel date and departure time."],
      ["Select your vehicle", "Tell us the number of passengers, luggage and preferred category."],
      ["Receive your quotation", "Our team checks partner availability and replies with the applicable fare."],
      ["Confirm your booking", "Once the service is confirmed you receive the booking details."],
    ],
    distTitle: "Private airport transfers from across Riyadh",
    distIntro: "Pickups are possible from many Riyadh areas. Coverage depends on the exact pickup address and partner availability, so send the address and we confirm.",
    districts: ["Al Olaya", "Al Malqa", "Al Nakheel", "Al Yasmin", "Al Narjis", "Al Muruj", "Al Sahafah", "Al Hamra", "Al Rawdah", "Diplomatic Quarter", "King Abdullah Financial District (KAFD)", "Riyadh city centre"],
    retTitle: "Al Qassim Airport to Riyadh private transfer",
    retBody: "Arriving at Prince Naif bin Abdulaziz International Airport (ELQ) and heading to Riyadh? You can request a private transfer to a Riyadh hotel, a residential address or an office. A driver does not automatically wait at the airport: pickups are arranged in advance, so send your flight number and destination and we confirm the details before you travel.",
    retList: ["Airport pickup requests", "Riyadh hotel transfers", "Residential drop-offs", "Business and corporate travel", "Advance reservations and return-journey inquiries"],
    retCta: "Request airport pickup",
    needsTitle: "Private transportation for different travel needs",
    needs: [
      { icon: Users, t: "Family airport transfers", d: "Plan seats and luggage in advance so the whole family travels in one vehicle. Tell us passengers, children and large cases." },
      { icon: Briefcase, t: "Business and corporate travel", d: "Written quotation by email for travel managers and teams; corporate invoicing can be arranged through our sister company." },
      { icon: UserCheck, t: "Individual and executive travel", d: "A private vehicle for one or two travellers, timed to your flight or meeting, arranged in advance." },
    ],
    rfq: "Request a written quote by email",
    whyTitle: "Why book through Taxi Saudi Arabia?",
    whyIntro: "Taxi Saudi Arabia is a booking and coordination service. We arrange your journey with suitable transport partners; we do not own or operate the vehicles ourselves.",
    why: ["One contact point for your inquiry", "Vehicle category coordination", "Route-specific quotation requests", "Advance booking assistance", "WhatsApp communication", "One-way and return journeys"],
    ctaTitle: "Arrange your private transfer to Al Qassim Airport",
    ctaBody: "Planning a trip from Riyadh to Prince Naif International Airport (ELQ)? Share your journey details to check available vehicles and receive a quotation.",
    ctaWa: "Get a quote on WhatsApp",
    ctaContact: "Contact Taxi Saudi Arabia",
    ctaNote: "Vehicle availability and final arrangements are confirmed individually.",
    airportLink: "Airport guide: Prince Naif bin Abdulaziz International Airport (ELQ)",
    buraydahLink: "Going to the city instead? Riyadh to Buraydah taxi",
    mailSubject: "Corporate transfer quote request — Riyadh to Al Qassim Airport (ELQ)",
    mailBody: "Hello Taxi Saudi Arabia,\n\nPlease send a written quote.\n\n• Company: \n• Contact name & role: \n• Dates & passengers: \n• Pickup in Riyadh: \n• Vehicle category: \n• Invoicing needed (VAT / PO reference): \n",
    contactHref: "/contact",
    airportHref: "/airports/prince-naif-qassim",
    buraydahHref: "/routes/riyadh-to-buraydah",
    dir: "ltr" as const,
  },
  ar: {
    vehTitle: "اختر السيارة الخاصة المناسبة",
    vehIntro: "تُرتَّب السيارات عبر شبكة شركائنا وتُؤكَّد لكل حجز. أخبرنا بعدد الركاب والحقائب فنؤكد الفئة المناسبة، ولا نَعِد بموديل محدد.",
    vehicles: [
      { name: "سيدان", fit: "للمسافر الفرد والمجموعات الصغيرة مع حقائب متوسطة.", pre: "سيدان" },
      { name: "SUV", fit: "للعائلات ومن يحتاج مساحة أكبر للأشخاص والحقائب.", pre: "SUV" },
      { name: "GMC / SUV كبيرة", fit: "لمن يطلب سيارة دفع رباعي كبيرة فاخرة، حسب التوفر.", pre: "GMC / SUV كبيرة" },
      { name: "سيارة عائلية أكبر", fit: "لعدد ركاب وحقائب أكبر. نؤكد السيارة المناسبة قبل الحجز.", pre: "سيارة عائلية أكبر" },
    ],
    vehCta: "اطلب التوفر",
    stepsTitle: "كيف ترتّب نقلك من الرياض إلى مطار القصيم",
    steps: [
      ["أرسل تفاصيل رحلتك", "شاركنا موقع الاستلام وتاريخ السفر ووقت الانطلاق."],
      ["اختر السيارة", "أخبرنا بعدد الركاب والحقائب والفئة المفضلة."],
      ["استلم عرض السعر", "يتحقق فريقنا من توفر الشركاء ويرسل لك السعر المناسب."],
      ["أكّد حجزك", "بعد تأكيد الخدمة تصلك تفاصيل الحجز."],
    ],
    distTitle: "نقل خاص إلى المطار من مختلف أحياء الرياض",
    distIntro: "الاستلام ممكن من أحياء كثيرة في الرياض. يعتمد التغطية على العنوان بالتحديد وتوفر الشركاء، فأرسل العنوان ونؤكد لك.",
    districts: ["العليا", "الملقا", "النخيل", "الياسمين", "النرجس", "المروج", "الصحافة", "الحمراء", "الروضة", "الحي الدبلوماسي", "مركز الملك عبدالله المالي (كافد)", "وسط الرياض"],
    retTitle: "نقل خاص من مطار القصيم إلى الرياض",
    retBody: "وصلت إلى مطار الأمير نايف بن عبدالعزيز الدولي (ELQ) وتتجه إلى الرياض؟ يمكنك طلب نقل خاص إلى فندق أو سكن أو مكتب في الرياض. لا ينتظر السائق في المطار تلقائياً؛ يُرتَّب الاستلام مسبقاً، فأرسل رقم رحلتك ووجهتك ونؤكد التفاصيل قبل سفرك.",
    retList: ["طلبات الاستلام من المطار", "التوصيل إلى فنادق الرياض", "التوصيل إلى المساكن", "سفر الأعمال والشركات", "الحجز المسبق وطلبات رحلات العودة"],
    retCta: "اطلب الاستلام من المطار",
    needsTitle: "نقل خاص يناسب احتياجات سفرك",
    needs: [
      { icon: Users, t: "نقل العائلات من المطار", d: "خطّط للمقاعد والحقائب مسبقاً ليسافر الجميع في سيارة واحدة. أخبرنا بعدد الركاب والأطفال والحقائب الكبيرة." },
      { icon: Briefcase, t: "سفر الأعمال والشركات", d: "عرض سعر مكتوب عبر البريد لمدراء السفر والفرق، ويمكن ترتيب فوترة الشركات عبر شركتنا الشقيقة." },
      { icon: UserCheck, t: "سفر الأفراد والتنفيذيين", d: "سيارة خاصة لمسافر أو اثنين، بتوقيت يناسب رحلتك أو اجتماعك، تُرتَّب مسبقاً." },
    ],
    rfq: "اطلب عرض سعر مكتوباً بالبريد",
    whyTitle: "لماذا تحجز عبر تاكسي السعودية؟",
    whyIntro: "تاكسي السعودية خدمة حجز وتنسيق. نرتّب رحلتك مع شركاء نقل مناسبين، ولا نملك السيارات أو نشغّلها بأنفسنا.",
    why: ["نقطة تواصل واحدة لطلبك", "تنسيق فئة السيارة", "طلبات عروض أسعار خاصة بالمسار", "مساعدة في الحجز المسبق", "التواصل عبر واتساب", "رحلات الذهاب والذهاب والعودة"],
    ctaTitle: "رتّب نقلك الخاص إلى مطار القصيم",
    ctaBody: "تخطط لرحلة من الرياض إلى مطار الأمير نايف الدولي (ELQ)؟ شاركنا تفاصيل رحلتك لنتحقق من السيارات المتاحة ونرسل لك السعر.",
    ctaWa: "احصل على السعر عبر واتساب",
    ctaContact: "تواصل مع تاكسي السعودية",
    ctaNote: "يُؤكَّد توفر السيارات والترتيبات النهائية لكل حجز على حدة.",
    airportLink: "دليل المطار: مطار الأمير نايف بن عبدالعزيز الدولي (ELQ)",
    buraydahLink: "تتجه إلى المدينة؟ تاكسي من الرياض إلى بريدة",
    mailSubject: "طلب عرض سعر نقل شركات — الرياض إلى مطار القصيم (ELQ)",
    mailBody: "مرحباً فريق تاكسي السعودية،\n\nنرجو إرسال عرض سعر مكتوب.\n\n• الشركة: \n• اسم وصفة المسؤول: \n• التواريخ وعدد الركاب: \n• موقع الاستلام في الرياض: \n• فئة السيارة: \n• الفوترة (ضريبي / أمر شراء): \n",
    contactHref: "/ar/contact",
    airportHref: "/airports/prince-naif-qassim",
    buraydahHref: "/routes/riyadh-to-buraydah",
    dir: "rtl" as const,
  },
};

export function QassimAirportSections({ locale }: { locale: L }) {
  const t = T[locale];
  const pre = locale === "ar" ? PREFILL_AR : PREFILL_EN;
  const card = "bg-white border border-[#16A34A]/12 rounded-3xl p-6 sm:p-8 shadow-sm";
  const btn = "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold";
  return (
    <div dir={t.dir} className={`space-y-10 ${locale === "ar" ? "text-right" : ""}`}>
      <section className={card} aria-labelledby="qa-vehicles">
        <h2 id="qa-vehicles" className="font-heading text-2xl font-bold text-[#1C1C1C]">{t.vehTitle}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#4B5563]">{t.vehIntro}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {t.vehicles.map((v) => (
            <div key={v.name} className="flex flex-col rounded-2xl border border-[#16A34A]/15 p-5">
              <Car className="h-6 w-6 text-[#16A34A]" aria-hidden />
              <h3 className="mt-3 font-heading text-lg font-bold text-[#1C1C1C]">{v.name}</h3>
              <p className="mt-1 flex-1 text-sm text-[#4B5563]">{v.fit}</p>
              <a
                href={wa(pre(v.pre))}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btn} mt-4 border border-[#16A34A] text-[#16A34A] hover:bg-[#16A34A]/5`}
              >
                <MessageSquare className="h-4 w-4" aria-hidden /> {t.vehCta}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className={card} aria-labelledby="qa-steps">
        <h2 id="qa-steps" className="font-heading text-2xl font-bold text-[#1C1C1C]">{t.stepsTitle}</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {t.steps.map(([h, d], i) => (
            <li key={h} className="flex gap-4 rounded-2xl bg-[#F9FAFB] p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#16A34A] text-sm font-bold text-white">{i + 1}</span>
              <div>
                <h3 className="font-bold text-[#1C1C1C]">{h}</h3>
                <p className="mt-1 text-sm text-[#4B5563]">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={card} aria-labelledby="qa-districts">
        <h2 id="qa-districts" className="font-heading text-2xl font-bold text-[#1C1C1C]">{t.distTitle}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#4B5563]">{t.distIntro}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {t.districts.map((d) => (
            <li key={d} className="rounded-full border border-[#16A34A]/20 bg-[#16A34A]/5 px-4 py-1.5 text-sm text-[#1C1C1C]">{d}</li>
          ))}
        </ul>
      </section>

      <section className={card} aria-labelledby="qa-return">
        <h2 id="qa-return" className="font-heading text-2xl font-bold text-[#1C1C1C]">{t.retTitle}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#4B5563]">{t.retBody}</p>
        <ul className="mt-4 grid gap-2 text-sm text-[#1C1C1C] sm:grid-cols-2">
          {t.retList.map((x) => (
            <li key={x} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden />
              <span>{x}</span>
            </li>
          ))}
        </ul>
        <a
          href={wa(locale === "ar" ? PREFILL_RETURN_AR : PREFILL_RETURN_EN)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn} mt-5 bg-[#16A34A] text-white hover:bg-[#15803D]`}
        >
          <Plane className="h-4 w-4" aria-hidden /> {t.retCta}
        </a>
      </section>

      <section className={card} aria-labelledby="qa-needs">
        <h2 id="qa-needs" className="font-heading text-2xl font-bold text-[#1C1C1C]">{t.needsTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {t.needs.map(({ icon: Icon, t: h, d }) => (
            <div key={h} className="rounded-2xl border border-[#16A34A]/15 p-5">
              <Icon className="h-6 w-6 text-[#16A34A]" aria-hidden />
              <h3 className="mt-3 font-bold text-[#1C1C1C]">{h}</h3>
              <p className="mt-1 text-sm text-[#4B5563]">{d}</p>
            </div>
          ))}
        </div>
        <a
          href={`${contactConfig.emailLink}?subject=${encodeURIComponent(t.mailSubject)}&body=${encodeURIComponent(t.mailBody)}`}
          className={`${btn} mt-5 border border-[#16A34A] text-[#16A34A] hover:bg-[#16A34A]/5`}
        >
          {t.rfq}
        </a>
      </section>

      <section className={card} aria-labelledby="qa-why">
        <h2 id="qa-why" className="font-heading text-2xl font-bold text-[#1C1C1C]">{t.whyTitle}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#4B5563]">{t.whyIntro}</p>
        <ul className="mt-4 grid gap-2 text-sm text-[#1C1C1C] sm:grid-cols-2">
          {t.why.map((x) => (
            <li key={x} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden />
              <span>{x}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-col gap-1 text-sm">
          <Link href={t.airportHref} className="font-semibold text-[#16A34A] underline underline-offset-2">{t.airportLink}</Link>
          <Link href={t.buraydahHref} className="font-semibold text-[#16A34A] underline underline-offset-2">{t.buraydahLink}</Link>
        </div>
      </section>

      <section className="rounded-3xl bg-[#14532D] p-8 text-center text-white" aria-labelledby="qa-cta">
        <h2 id="qa-cta" className="font-heading text-2xl font-bold">{t.ctaTitle}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/90">{t.ctaBody}</p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={wa(pre("Sedan / SUV / GMC / Other"))}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btn} bg-[#FACC15] text-[#1C1C1C] hover:bg-[#EAB308]`}
          >
            <MessageSquare className="h-4 w-4" aria-hidden /> {t.ctaWa}
          </a>
          <Link href={t.contactHref} className={`${btn} border border-white/60 text-white hover:bg-white/10`}>
            {t.ctaContact}
          </Link>
        </div>
        <p className="mt-4 text-xs text-white/80">{t.ctaNote}</p>
      </section>
    </div>
  );
}
