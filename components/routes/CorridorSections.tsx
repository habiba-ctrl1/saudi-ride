import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Briefcase, Bus, Car, Check, Clock, Luggage, Mail, MessageSquare, Minus, Plane, Train, Users, Wallet } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";

// Visual corridor block for the Makkah<->Madinah and Jeddah<->Madinah route pages (EN + AR):
// photo header, travel-time comparison chart, pros/cons cards, "which option fits you" chooser,
// group/corporate RFQ panel and link cards.
//
// FACT SOURCES (seo/facts.md + data files; nothing estimated here):
// - Road km / drive time: lib/data/routes.ts (Makkah-Madinah 430 km / 240 min; Jeddah-Madinah 420 km / 240 min).
// - Train ~2.5 h Makkah-Madinah, bus ~6-7 h, luggage limits: lib/data/guides.ts (makkah-to-madinah-transport-guide).
// - Train ~2-2.5 h from the Jeddah Airport station, Al Sulaymaniyah station in Jeddah:
//   lib/data/blog/posts/jeddah-to-madinah-taxi-guide-fares.ts. No coach time is published for Jeddah, so none is shown.
// - Fixed fare, free cancellation 24 h, 15-30 min free waiting, meet & greet, luggage help: seo/facts.md.
// - Corporate invoicing line is the approved verbatim sentence. No prices (fare bands are TODO).
// Photos are existing site assets; alts describe what is actually in each picture.

type L = "en" | "ar";
export type Corridor = "makkah-to-madinah" | "madinah-to-makkah" | "jeddah-to-madinah" | "madinah-to-jeddah";

type Mode = { icon: LucideIcon; name: string; time: string; pct: number; open?: string; best?: boolean; pros: string[]; cons: string[] };
type Fit = { icon: LucideIcon; who: string; pick: string; why: string };
type Data = {
  from: string; to: string;
  imgFrom: { src: string; alt: string }; imgTo: { src: string; alt: string };
  eyebrow: string; title: string; lead: string; chips: [string, string][];
  cmpEyebrow: string; cmpTitle: string; cmpIntro: string; chartNote: string; modes: Mode[];
  fitEyebrow: string; fitTitle: string; fits: Fit[];
  grpEyebrow: string; grpTitle: string; grpBody: string; grpPoints: string[]; grpImg: { src: string; alt: string };
  links: { href: string; label: string; desc: string }[]; linksTitle: string;
  prefill: string; mailSubject: string; mailBody: string; mailCta: string; waCta: string; bestTag: string;
};

const IMG = {
  makkah: { src: "/gallery/makkah-drive.webp", en: "Illustration of a black SUV on a Makkah road at dusk with the Clock Tower behind", ar: "صورة توضيحية لسيارة دفع رباعي سوداء في أحد شوارع مكة وقت الغروب وخلفها برج الساعة" },
  madinah: { src: "/gallery/madinah-drive.webp", en: "Illustration of a white passenger van parked near Masjid an-Nabawi in Madinah", ar: "صورة توضيحية لسيارة فان بيضاء قرب المسجد النبوي في المدينة المنورة" },
  jeddah: { src: "/locations/jeddah-hero.webp", en: "Jeddah Corniche waterfront with palm trees and a glass tower", ar: "كورنيش جدة مع أشجار النخيل وبرج زجاجي" },
  family: { src: "/gallery/umrah-family.webp", en: "Illustration of a chauffeur greeting a family with luggage beside a black car", ar: "صورة توضيحية لسائق يستقبل عائلة مع أمتعتها بجانب سيارة سوداء" },
};
const img = (k: keyof typeof IMG, l: L) => ({ src: IMG[k].src, alt: IMG[k][l] });

function build(c: Corridor, l: L): Data {
  const en = l === "en";
  const holy = c === "makkah-to-madinah" || c === "madinah-to-makkah";
  const N = en
    ? { makkah: "Makkah", madinah: "Madinah", jeddah: "Jeddah" }
    : { makkah: "مكة المكرمة", madinah: "المدينة المنورة", jeddah: "جدة" };
  const [a, b] = c.split("-to-") as [keyof typeof N, keyof typeof N];
  const from = N[a], to = N[b];
  const pre = en ? "" : "/ar";
  const rev = `${b}-to-${a}`;

  const prefill = en
    ? `Hello Taxi Saudi Arabia,\nI would like to request a private transfer.\n\n• From: ${from} (hotel/address): \n• To: ${to} (hotel/address): \n• Date & time: \n• Passengers & luggage: \n• Vehicle: Sedan / SUV / GMC / Van\n\nPlease confirm availability and the fare.`
    : `السلام عليكم، أرغب بطلب نقل خاص.\n\n• من: ${from} (الفندق/العنوان): \n• إلى: ${to} (الفندق/العنوان): \n• التاريخ والوقت: \n• عدد الركاب والحقائب: \n• السيارة: سيدان / SUV / GMC / فان\n\nيرجى تأكيد التوفر والسعر.`;
  const mailSubject = en ? `Group / corporate transfer quote — ${from} to ${to}` : `طلب عرض سعر نقل مجموعات/شركات — ${from} إلى ${to}`;
  const mailBody = en
    ? `Hello Taxi Saudi Arabia,\n\nPlease send a written quote.\n\n• Company / group name: \n• Contact name & role: \n• Date & pickup time: \n• Pickup (${from}): \n• Drop-off (${to}): \n• Passengers & luggage: \n• Vehicle category: \n• Invoicing needed (VAT / PO reference): \n`
    : `مرحباً فريق تاكسي السعودية،\n\nنرجو إرسال عرض سعر مكتوب.\n\n• اسم الشركة/المجموعة: \n• اسم وصفة المسؤول: \n• التاريخ ووقت الاستلام: \n• الاستلام (${from}): \n• الوصول (${to}): \n• عدد الركاب والحقائب: \n• فئة السيارة: \n• الفوترة (ضريبي / أمر شراء): \n`;
  const common = {
    from, to, prefill, mailSubject, mailBody,
    imgFrom: img(a, l), imgTo: img(b, l), grpImg: img("family", l),
    mailCta: en ? "Request a written quote by email" : "اطلب عرض سعر مكتوباً بالبريد",
    waCta: en ? "Get a quote on WhatsApp" : "احصل على السعر عبر واتساب",
    bestTag: en ? "Door to door" : "من الباب إلى الباب",
    linksTitle: en ? "Plan the rest of the trip" : "خطّط لبقية رحلتك",
    grpEyebrow: en ? "Groups & companies" : "المجموعات والشركات",
    grpBody: en
      ? "Travel managers and group organisers can request a written quotation by email. Tell us the dates, group size and luggage and we confirm the vehicle categories available through our partner network. Corporate invoicing can be arranged through our sister company."
      : "يمكن لمدراء السفر ومنظمي المجموعات طلب عرض سعر مكتوب عبر البريد. أخبرنا بالتواريخ وعدد الأفراد والحقائب فنؤكد فئات السيارات المتاحة عبر شبكة شركائنا. ويمكن ترتيب فوترة الشركات عبر شركتنا الشقيقة.",
    grpPoints: en
      ? ["Written quote before you commit", "One coordinator for several vehicles", "Fare fixed and agreed in advance", "Free cancellation up to 24 hours before pickup"]
      : ["عرض سعر مكتوب قبل الالتزام", "منسّق واحد لعدة سيارات", "سعر ثابت متفق عليه مسبقاً", "إلغاء مجاني حتى 24 ساعة قبل الاستلام"],
  };

  if (holy) {
    return {
      ...common,
      eyebrow: en ? "Between the two Holy Mosques" : "بين الحرمين الشريفين",
      title: en ? `${from} to ${to} by private car: hotel to hotel in one vehicle` : `من ${from} إلى ${to} بسيارة خاصة: من فندق إلى فندق في سيارة واحدة`,
      lead: en
        ? `The road between ${from} and ${to} is about 430 km of multi-lane highway with large service stations for fuel, food, restrooms and prayer. A private car covers it in roughly 4 to 5 hours including the stops you ask for. Vehicles cannot always reach the mosque gates, so the driver drops you at the nearest permitted point to your hotel.`
        : `الطريق بين ${from} و${to} نحو 430 كم من الطرق السريعة متعددة المسارات، وعليه محطات خدمة كبيرة للوقود والطعام ودورات المياه والصلاة. تقطعه السيارة الخاصة في نحو 4 إلى 5 ساعات شاملة التوقفات التي تطلبها. لا تصل السيارات دائماً إلى أبواب الحرم، فينزلك السائق عند أقرب نقطة مسموحة من فندقك.`,
      chips: en
        ? [["Distance", "~430 km"], ["Door to door", "~4–5 hours"], ["Fare", "Fixed before booking"], ["Free waiting", "15–30 minutes"]]
        : [["المسافة", "نحو 430 كم"], ["من الباب إلى الباب", "نحو 4–5 ساعات"], ["السعر", "ثابت قبل الحجز"], ["انتظار مجاني", "15–30 دقيقة"]],
      cmpEyebrow: en ? "Honest comparison" : "مقارنة صريحة",
      cmpTitle: en ? `Private car, Haramain train or bus from ${from} to ${to}?` : `سيارة خاصة أم قطار الحرمين أم حافلة من ${from} إلى ${to}؟`,
      cmpIntro: en
        ? "The train is the fastest between stations and the bus is the cheapest. A private car is the only one that runs from your hotel door to your hotel door without changing vehicle."
        : "القطار الأسرع بين المحطتين والحافلة الأرخص، والسيارة الخاصة هي الوحيدة التي تنقلك من باب فندقك إلى باب فندقك دون تبديل وسيلة النقل.",
      chartNote: en
        ? "Approximate travel times. Train time is station to station; check the current timetable with the operator."
        : "أوقات تقريبية. وقت القطار بين المحطتين فقط؛ تحقق من الجدول الحالي لدى المشغّل.",
      modes: en
        ? [
            { icon: Car, name: "Private car", time: "4–5 h, hotel to hotel", pct: 68, best: true, pros: ["Leaves when you are ready", "All luggage stays in the vehicle", "Prayer and rest stops on request"], cons: ["Slower than the train on the main stretch", "Costs more than a single train seat"] },
            { icon: Train, name: "Haramain train", time: "~2.5 h, station to station", pct: 36, open: "+ transfers and check-in", pros: ["Fastest between stations", "Comfortable for light travellers"], cons: ["Taxi still needed at both ends", "Luggage size and weight limits", "Fixed timetable"] },
            { icon: Bus, name: "Intercity bus", time: "~6–7 h", pct: 96, pros: ["Lowest cost"], cons: ["Slowest option", "Fixed schedule and stops", "Tiring after Umrah"] },
          ]
        : [
            { icon: Car, name: "سيارة خاصة", time: "4–5 ساعات، من فندق إلى فندق", pct: 68, best: true, pros: ["تنطلق عندما تكون جاهزاً", "كل الحقائب معك في السيارة", "توقفات للصلاة والراحة عند الطلب"], cons: ["أبطأ من القطار في الجزء الرئيسي", "أعلى تكلفة من مقعد قطار واحد"] },
            { icon: Train, name: "قطار الحرمين", time: "نحو ساعتين ونصف بين المحطتين", pct: 36, open: "+ الانتقال والإجراءات", pros: ["الأسرع بين المحطتين", "مريح لمن يسافر بحقائب خفيفة"], cons: ["يلزم تاكسي في الطرفين", "قيود على حجم الحقائب ووزنها", "جدول ثابت"] },
            { icon: Bus, name: "حافلة بين المدن", time: "نحو 6–7 ساعات", pct: 96, pros: ["الأقل تكلفة"], cons: ["الأبطأ", "جدول ومحطات ثابتة", "مرهقة بعد العمرة"] },
          ],
      fitEyebrow: en ? "Which one fits you" : "أيها يناسبك",
      fitTitle: en ? "Pick by who is travelling, not by speed alone" : "اختر حسب المسافرين لا حسب السرعة فقط",
      fits: en
        ? [
            { icon: Users, who: "Family with children or elderly parents", pick: "Private SUV or van", why: "No station stairs, no second taxi, and you stop whenever someone needs to." },
            { icon: Luggage, who: "Full Umrah luggage and Zamzam", pick: "Private car", why: "Everything travels in one vehicle; the train applies luggage limits." },
            { icon: Clock, who: "One or two people with a cabin bag", pick: "Haramain train", why: "Quickest ride if your hotels are close to the stations and you travel in the daytime." },
            { icon: Wallet, who: "Tight budget and no fixed arrival time", pick: "Intercity bus", why: "Cheapest seat, but allow most of a day and expect fixed stops." },
          ]
        : [
            { icon: Users, who: "عائلة مع أطفال أو كبار سن", pick: "سيارة دفع رباعي أو فان خاصة", why: "لا سلالم محطات ولا تاكسي إضافي، وتتوقف متى احتاج أحدكم." },
            { icon: Luggage, who: "حقائب العمرة كاملة وماء زمزم", pick: "سيارة خاصة", why: "كل شيء في سيارة واحدة، بينما يفرض القطار قيوداً على الحقائب." },
            { icon: Clock, who: "شخص أو اثنان بحقيبة يد", pick: "قطار الحرمين", why: "الأسرع إذا كان فندقاك قريبين من المحطتين وتسافر نهاراً." },
            { icon: Wallet, who: "ميزانية محدودة ولا موعد وصول ثابت", pick: "حافلة بين المدن", why: "أرخص مقعد، لكن خصّص معظم اليوم وتوقّع محطات ثابتة." },
          ],
      grpTitle: en ? "Umrah groups, delegations and corporate travel between the Holy Cities" : "مجموعات العمرة والوفود وسفر الشركات بين المدينتين المقدستين",
      links: en
        ? [
            { href: "/guides/makkah-to-madinah-transport-guide", label: "Taxi vs train vs bus guide", desc: "The full comparison with luggage and timing notes." },
            { href: "/distance/makkah-to-madinah", label: "Makkah–Madinah distance", desc: "Kilometres, driving time and the road." },
            { href: `/routes/${rev}`, label: `${to} to ${from}`, desc: "The same journey in the other direction." },
            { href: "/services/umrah-transport", label: "Umrah taxi service", desc: "Airport, Makkah, Madinah and Ziyarat in one plan." },
          ]
        : [
            { href: "/guides/makkah-to-madinah-transport-guide", label: "دليل التاكسي والقطار والحافلة", desc: "المقارنة الكاملة مع ملاحظات الحقائب والتوقيت." },
            { href: "/distance/makkah-to-madinah", label: "المسافة بين مكة والمدينة", desc: "الكيلومترات ووقت القيادة والطريق." },
            { href: `${pre}/routes/${rev}`, label: `من ${to} إلى ${from}`, desc: "الرحلة نفسها بالاتجاه المعاكس." },
            { href: "/services/umrah-transport", label: "خدمة تاكسي العمرة", desc: "المطار ومكة والمدينة والزيارة في خطة واحدة." },
          ],
    };
  }

  const toMadinah = c === "jeddah-to-madinah";
  const airportHref = toMadinah ? "/routes/jeddah-airport-to-madinah" : "/routes/madinah-to-jeddah-airport";
  return {
    ...common,
    eyebrow: en ? "Red Sea coast to the Prophet's City" : "من ساحل البحر الأحمر إلى مدينة الرسول ﷺ",
    title: en ? `${from} to ${to} by private car: about 420 km, one vehicle all the way` : `من ${from} إلى ${to} بسيارة خاصة: نحو 420 كم في سيارة واحدة`,
    lead: en
      ? toMadinah
        ? "Jeddah to Madinah is about 420 km by road, roughly 4 hours of driving before rest stops. This page covers pickups from Jeddah city: a hotel on the Corniche, a home or an office. If you are landing at King Abdulaziz International Airport, use the airport version of the transfer so the pickup is planned around your flight."
        : "Madinah to Jeddah is about 420 km by road, roughly 4 hours of driving before rest stops. This page covers drop-offs in Jeddah city: a Corniche hotel, a home or an office. If you are flying out of King Abdulaziz International Airport, use the airport version of the transfer so the timing is planned around your flight."
      : toMadinah
        ? "المسافة من جدة إلى المدينة المنورة نحو 420 كم بالطريق البري، أي نحو 4 ساعات قيادة قبل توقفات الراحة. تغطي هذه الصفحة الاستلام من داخل مدينة جدة: فندق على الكورنيش أو منزل أو مكتب. إن كنت تصل إلى مطار الملك عبدالعزيز الدولي فاستخدم نسخة المطار من هذا النقل ليُرتَّب الاستلام حسب رحلتك."
        : "المسافة من المدينة المنورة إلى جدة نحو 420 كم بالطريق البري، أي نحو 4 ساعات قيادة قبل توقفات الراحة. تغطي هذه الصفحة التوصيل داخل مدينة جدة: فندق على الكورنيش أو منزل أو مكتب. إن كنت تغادر من مطار الملك عبدالعزيز الدولي فاستخدم نسخة المطار من هذا النقل ليُرتَّب التوقيت حسب رحلتك.",
    chips: en
      ? [["Distance", "~420 km"], ["Driving time", "~4 hours"], ["Fare", "Fixed before booking"], ["Free waiting", "15–30 minutes"]]
      : [["المسافة", "نحو 420 كم"], ["وقت القيادة", "نحو 4 ساعات"], ["السعر", "ثابت قبل الحجز"], ["انتظار مجاني", "15–30 دقيقة"]],
    cmpEyebrow: en ? "Honest comparison" : "مقارنة صريحة",
    cmpTitle: en ? `Private car or Haramain train from ${from} to ${to}?` : `سيارة خاصة أم قطار الحرمين من ${from} إلى ${to}؟`,
    cmpIntro: en
      ? "The Haramain train links Jeddah's Al Sulaymaniyah station and the airport station with Madinah. It is faster between stations; a private car is simpler when you count the trips to and from the stations."
      : "يربط قطار الحرمين محطة السليمانية في جدة ومحطة المطار بالمدينة المنورة. هو أسرع بين المحطتين، والسيارة الخاصة أبسط إذا حسبت الانتقال من المحطات وإليها.",
    chartNote: en
      ? "Approximate travel times. Train time is from the Jeddah Airport station to Madinah station; check the current timetable with the operator."
      : "أوقات تقريبية. وقت القطار من محطة مطار جدة إلى محطة المدينة؛ تحقق من الجدول الحالي لدى المشغّل.",
    modes: en
      ? [
          { icon: Car, name: "Private car", time: "~4 h driving, address to address", pct: 82, best: true, pros: ["Pickup from your Jeddah address", "All luggage stays in the vehicle", "You choose the departure time and stops"], cons: ["Slower than the train on the main stretch", "Costs more than a single train seat"] },
          { icon: Train, name: "Haramain train", time: "~2–2.5 h, station to station", pct: 48, open: "+ transfers and waiting", pros: ["Fastest between stations", "Good for light daytime travel"], cons: ["Car needed in Jeddah and in Madinah", "Luggage limits apply", "Fixed timetable"] },
        ]
      : [
          { icon: Car, name: "سيارة خاصة", time: "نحو 4 ساعات قيادة، من العنوان إلى العنوان", pct: 82, best: true, pros: ["الاستلام من عنوانك في جدة", "كل الحقائب معك في السيارة", "تحدد وقت الانطلاق والتوقفات"], cons: ["أبطأ من القطار في الجزء الرئيسي", "أعلى تكلفة من مقعد قطار واحد"] },
          { icon: Train, name: "قطار الحرمين", time: "نحو ساعتين إلى ساعتين ونصف بين المحطتين", pct: 48, open: "+ الانتقال والانتظار", pros: ["الأسرع بين المحطتين", "مناسب للسفر الخفيف نهاراً"], cons: ["يلزم سيارة في جدة وفي المدينة", "قيود على الحقائب", "جدول ثابت"] },
        ],
    fitEyebrow: en ? "Which one fits you" : "أيها يناسبك",
    fitTitle: en ? "Four common Jeddah–Madinah trips" : "أربع رحلات شائعة بين جدة والمدينة",
    fits: en
      ? [
          { icon: Plane, who: toMadinah ? "Landing at JED and going straight to Madinah" : "Finishing Ziyarah and flying home from JED", pick: "Airport transfer", why: "Booked against your flight number, with meet & greet at arrivals and help with luggage." },
          { icon: Users, who: "Family or group with several suitcases", pick: "Private SUV or van", why: "One vehicle from door to door, with stops whenever you need them." },
          { icon: Briefcase, who: "Business visit with a meeting time", pick: "Private car", why: "Leave from your office or hotel at a time that fits the meeting, with a written quote for your company." },
          { icon: Clock, who: "Solo traveller with a cabin bag", pick: "Haramain train", why: "Quickest if you are near a station at both ends and travel in the daytime." },
        ]
      : [
          { icon: Plane, who: toMadinah ? "تصل إلى مطار جدة وتتجه مباشرة إلى المدينة" : "تنهي الزيارة وتغادر من مطار جدة", pick: "نقل المطار", why: "يُحجز حسب رقم رحلتك، مع استقبال في صالة الوصول ومساعدة في الحقائب." },
          { icon: Users, who: "عائلة أو مجموعة بعدة حقائب", pick: "سيارة دفع رباعي أو فان خاصة", why: "سيارة واحدة من الباب إلى الباب مع توقفات متى احتجت." },
          { icon: Briefcase, who: "زيارة عمل مرتبطة بموعد اجتماع", pick: "سيارة خاصة", why: "انطلق من مكتبك أو فندقك في وقت يناسب الاجتماع، مع عرض سعر مكتوب لشركتك." },
          { icon: Clock, who: "مسافر واحد بحقيبة يد", pick: "قطار الحرمين", why: "الأسرع إذا كنت قريباً من المحطة في الطرفين وتسافر نهاراً." },
        ],
    grpTitle: en ? "Group, family and corporate transfers between Jeddah and Madinah" : "نقل المجموعات والعائلات والشركات بين جدة والمدينة",
    links: en
      ? [
          { href: airportHref, label: toMadinah ? "Jeddah Airport to Madinah" : "Madinah to Jeddah Airport", desc: "The airport version, planned around your flight." },
          { href: "/blog/jeddah-to-madinah-taxi-guide-fares", label: "Car, train, coach or flight?", desc: "All four options from Jeddah Airport compared." },
          { href: "/distance/jeddah-to-madinah", label: "Jeddah–Madinah distance", desc: "Kilometres, driving time and the road." },
          { href: `/routes/${rev}`, label: `${to} to ${from}`, desc: "The same journey in the other direction." },
        ]
      : [
          { href: airportHref, label: toMadinah ? "من مطار جدة إلى المدينة" : "من المدينة إلى مطار جدة", desc: "نسخة المطار، مرتّبة حسب رحلتك." },
          { href: "/blog/jeddah-to-madinah-taxi-guide-fares", label: "سيارة أم قطار أم حافلة أم طيران؟", desc: "مقارنة الخيارات الأربعة من مطار جدة." },
          { href: "/distance/jeddah-to-madinah", label: "المسافة بين جدة والمدينة", desc: "الكيلومترات ووقت القيادة والطريق." },
          { href: `${pre}/routes/${rev}`, label: `من ${to} إلى ${from}`, desc: "الرحلة نفسها بالاتجاه المعاكس." },
        ],
  };
}

const wa = (text: string) => `${contactConfig.whatsappLink}?text=${encodeURIComponent(text)}`;

export function CorridorSections({ corridor, locale }: { corridor: Corridor; locale: L }) {
  const d = build(corridor, locale);
  const en = locale === "en";
  const id = `cor-${corridor}`;
  const eyebrow = "mb-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#16A34A]";
  const h2 = "font-heading text-[1.6rem] font-bold leading-tight text-[#1C1C1C] md:text-[2rem]";
  const btn = "inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-colors";

  return (
    <div dir={en ? "ltr" : "rtl"} className={`space-y-12 ${en ? "" : "text-right"}`}>
      {/* ── 1. Photo header: origin → destination ── */}
      <section aria-labelledby={`${id}-intro`} className="overflow-hidden rounded-3xl border border-[#16A34A]/15 bg-white shadow-sm">
        <div className="relative grid grid-cols-2">
          {[d.imgFrom, d.imgTo].map((im, i) => (
            <div key={im.src} className="relative h-44 sm:h-60 md:h-72">
              <Image src={im.src} alt={im.alt} fill sizes="(max-width: 768px) 50vw, 420px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <p className="absolute bottom-3 start-4 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#FACC15]">{i === 0 ? (en ? "Pickup" : "الاستلام") : (en ? "Drop-off" : "الوصول")}</p>
              <p className="absolute bottom-8 start-4 font-heading text-xl font-bold text-[#FFFFFF] sm:text-2xl">{i === 0 ? d.from : d.to}</p>
            </div>
          ))}
          <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-[#FACC15] shadow-lg" aria-hidden="true">
            <ArrowRight className={`h-5 w-5 text-[#1C1C1C] ${en ? "" : "rotate-180"}`} />
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <p className={eyebrow}>{d.eyebrow}</p>
          <h2 id={`${id}-intro`} className={h2}>{d.title}</h2>
          <p className="mt-4 max-w-3xl text-[0.95rem] leading-relaxed text-[#4B5563]">{d.lead}</p>
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#16A34A]/15 bg-[#16A34A]/15 md:grid-cols-4">
            {d.chips.map(([k, v]) => (
              <div key={k} className="bg-[#F7FBF8] p-4">
                <dt className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#15803D]">{k}</dt>
                <dd className="mt-1.5 text-sm font-bold text-[#1C1C1C]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 2. Travel-time chart + pros/cons ── */}
      <section aria-labelledby={`${id}-cmp`}>
        <p className={eyebrow}>{d.cmpEyebrow}</p>
        <h2 id={`${id}-cmp`} className={h2}>{d.cmpTitle}</h2>
        <p className="mt-3 max-w-3xl text-[0.95rem] leading-relaxed text-[#4B5563]">{d.cmpIntro}</p>

        <div className="mt-6 rounded-3xl border border-[#16A34A]/15 bg-white p-5 shadow-sm sm:p-7">
          <ul className="space-y-5">
            {d.modes.map((m) => (
              <li key={m.name}>
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                  <span className="flex items-center gap-2 text-sm font-bold text-[#1C1C1C]">
                    <m.icon className={`h-4 w-4 ${m.best ? "text-[#16A34A]" : "text-[#6B7280]"}`} aria-hidden="true" /> {m.name}
                  </span>
                  <span className="text-sm font-semibold text-[#374151]">{m.time}</span>
                </div>
                <div className="mt-2 flex h-4 items-center gap-1.5" aria-hidden="true">
                  <div className={`h-full rounded-full ${m.best ? "bg-[#16A34A]" : "bg-[#9CA3AF]"}`} style={{ width: `${m.pct}%` }} />
                  {m.open && (
                    <div className="flex h-full min-w-[5.5rem] flex-1 items-center rounded-full border-2 border-dashed border-[#9CA3AF] px-2">
                      <span className="truncate text-[0.6rem] font-bold uppercase tracking-wide text-[#6B7280]">{m.open}</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-[#6B7280]">{d.chartNote}</p>
        </div>

        <div className={`mt-5 grid gap-4 ${d.modes.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {d.modes.map((m) => (
            <div key={m.name} className={`relative rounded-3xl border p-6 ${m.best ? "border-[#16A34A] bg-[#F7FBF8] shadow-md" : "border-[#E5E7EB] bg-white"}`}>
              {m.best && <span className="absolute -top-3 start-5 rounded-full bg-[#FACC15] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#1C1C1C]">{d.bestTag}</span>}
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${m.best ? "bg-[#16A34A]" : "bg-[#F3F4F6]"}`}>
                <m.icon className={`h-5 w-5 ${m.best ? "text-[#FFFFFF]" : "text-[#4B5563]"}`} aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-[#1C1C1C]">{m.name}</h3>
              <p className="text-sm font-semibold text-[#15803D]">{m.time}</p>
              <ul className="mt-4 space-y-2 text-sm text-[#1C1C1C]">
                {m.pros.map((p) => (
                  <li key={p} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" /><span>{p}</span></li>
                ))}
                {m.cons.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[#6B7280]"><Minus className="mt-0.5 h-4 w-4 shrink-0 text-[#9CA3AF]" aria-hidden="true" /><span>{p}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Which option fits you ── */}
      <section aria-labelledby={`${id}-fit`}>
        <p className={eyebrow}>{d.fitEyebrow}</p>
        <h2 id={`${id}-fit`} className={h2}>{d.fitTitle}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {d.fits.map((f) => (
            <div key={f.who} className="flex gap-4 rounded-3xl border border-[#E5E7EB] bg-white p-5 transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#16A34A]/10">
                <f.icon className="h-5 w-5 text-[#16A34A]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-[0.95rem] font-bold leading-snug text-[#1C1C1C]">{f.who}</h3>
                <p className="mt-1.5 inline-block rounded-full bg-[#FACC15]/30 px-2.5 py-0.5 text-xs font-bold text-[#1C1C1C]">{f.pick}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{f.why}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Groups & corporate (Path B) ── */}
      <section aria-labelledby={`${id}-grp`} className="premium-dark-section overflow-hidden rounded-3xl bg-[#14532D] md:grid md:grid-cols-5">
        <div className="relative h-56 md:col-span-2 md:h-auto">
          <Image src={d.grpImg.src} alt={d.grpImg.alt} fill sizes="(max-width: 768px) 100vw, 380px" className="object-cover" />
        </div>
        <div className="p-6 sm:p-9 md:col-span-3">
          <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#FACC15]">{d.grpEyebrow}</p>
          <h2 id={`${id}-grp`} className="font-heading text-[1.5rem] font-bold leading-tight text-[#FFFFFF] md:text-[1.8rem]">{d.grpTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80">{d.grpBody}</p>
          <ul className="mt-5 grid gap-2 text-sm text-[#FFFFFF] sm:grid-cols-2">
            {d.grpPoints.map((p) => (
              <li key={p} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FACC15]" aria-hidden="true" /><span>{p}</span></li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={`${contactConfig.emailLink}?subject=${encodeURIComponent(d.mailSubject)}&body=${encodeURIComponent(d.mailBody)}`} className={`${btn} bg-[#FACC15] text-[#1C1C1C] hover:bg-[#EAB308]`}>
              <Mail className="h-4 w-4" aria-hidden="true" /> {d.mailCta}
            </a>
            <a href={wa(d.prefill)} target="_blank" rel="noopener noreferrer" className={`${btn} border border-white/50 text-[#FFFFFF] hover:bg-white/10`}>
              <MessageSquare className="h-4 w-4" aria-hidden="true" /> {d.waCta}
            </a>
          </div>
        </div>
      </section>

      {/* ── 5. Link cards ── */}
      <nav aria-label={d.linksTitle}>
        <h2 className="font-heading text-xl font-bold text-[#1C1C1C]">{d.linksTitle}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {d.links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="group flex h-full flex-col rounded-2xl border border-[#E5E7EB] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:shadow-md">
                <span className="font-heading text-[0.95rem] font-bold text-[#1C1C1C] group-hover:text-[#15803D]">{l.label}</span>
                <span className="mt-1 flex-1 text-[0.8rem] leading-relaxed text-[#6B7280]">{l.desc}</span>
                <ArrowRight className={`mt-3 h-4 w-4 text-[#16A34A] ${en ? "" : "rotate-180"}`} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
