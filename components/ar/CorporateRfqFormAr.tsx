"use client";

import { useState, type FormEvent } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { trackEvent } from "@/lib/analytics";
import { CORP_AR } from "@/lib/data/makkah-cluster-ar";

// Arabic twin of CorporateRfqForm. Composes the request into email/WhatsApp
// (no backend endpoint yet). The message body is Arabic so the team reads the
// same language the sender used.
const CITIES = ["مكة المكرمة", "المدينة المنورة", "جدة", "الرياض", "أخرى"];
const VEHICLES = ["جي إم سي يوكون إكس إل / دينالي (دفع رباعي كبيرة)", "سيارة سيدان تنفيذية", "سيارة دفع رباعي كبيرة (أخرى)", "فان VIP", "كوستر / حافلة", "لست متأكداً — أرشدوني"];
const FORMATS = [
  "رحلة تنفيذية واحدة",
  "نقل من المطار إلى الفندق",
  "نقل من الفندق إلى الاجتماعات وعدة محطات",
  "سائق مخصص بالساعة أو باليوم",
  "برنامج لعدة أيام أو عدة سيارات",
  "سفر شركات متكرر",
];

const inputCls = "mt-1 block min-h-[44px] w-full rounded-xl border border-[#D1D5DB] bg-white px-3 text-sm text-[#1C1C1C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]";
const labelCls = "block text-xs font-bold text-[#374151]";

export function CorporateRfqFormAr({ city, path }: { city: "مكة المكرمة" | "المدينة المنورة"; path: string }) {
  const [error, setError] = useState("");
  const key = city === "مكة المكرمة" ? "makkah" : "madinah";

  function compose(form: HTMLFormElement): string | null {
    const d = new FormData(form);
    const g = (k: string) => String(d.get(k) ?? "").trim();
    if (!g("company") || !g("contact") || !g("email") || !g("whatsapp")) {
      setError("يرجى إدخال اسم الشركة والشخص المسؤول والبريد الإلكتروني للعمل ورقم واتساب.");
      return null;
    }
    setError("");
    return [
      `طلب نقل لشركة — ${city}`,
      `• الشركة: ${g("company")}`,
      `• الشخص المسؤول: ${g("contact")}`,
      `• البريد الإلكتروني: ${g("email")}`,
      `• واتساب: ${g("whatsapp")}`,
      `• المدينة: ${g("city") || city}`,
      `• تواريخ السفر: ${g("dates")}`,
      `• عدد الركاب: ${g("passengers")}`,
      `• عدد السيارات: ${g("vehicles")}`,
      `• فئة السيارة: ${g("category")}`,
      `• نوع الطلب: ${g("recurrence")}`,
      `• نوع الخدمة: ${g("format")}`,
      `• الاستلام والوجهة: ${g("route")}`,
      `• متطلبات إضافية: ${g("notes")}`,
      "",
      "يرجى إرسال عرض سعر مكتوب وتأكيد توفر السيارات والشروط.",
    ].join("\n");
  }

  function send(e: FormEvent<HTMLButtonElement>, channel: "email" | "whatsapp") {
    const form = e.currentTarget.form;
    if (!form) return;
    const body = compose(form);
    if (!body) return;
    trackEvent("lead_captured", { source: `corporate_rfq_${key}_${channel}`, toCity: key, locale: "ar" });
    const url =
      channel === "email"
        ? `mailto:${contactConfig.email}?subject=${encodeURIComponent(`طلب عرض سعر نقل للشركات — ${city}`)}&body=${encodeURIComponent(body)}`
        : `${contactConfig.whatsappLink}?text=${encodeURIComponent(body)}`;
    if (channel === "email") window.location.href = url;
    else window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="corporate-rfq" aria-labelledby="rfq-heading" className="scroll-mt-24" data-path={path}>
      <div className="rounded-[2rem] border border-[#E5E7EB] bg-white p-6 md:p-10">
        <p className="text-xs font-bold text-[#16A34A]">طلب للشركات</p>
        <h2 id="rfq-heading" className="mt-3 font-heading text-[1.6rem] font-bold leading-tight text-[#1C1C1C] md:text-[2rem]">
          سائق خاص ونقل تنفيذي للشركات في المملكة العربية السعودية
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4B5563]">
          لمديري سفر الشركات والمساعدين التنفيذيين ومسؤولي المكاتب وفرق استقبال الضيوف في الفنادق ومنسقي المؤتمرات والفعاليات، ومن يرتّبون استقبال عملائهم الزائرين من المطار. الطلبات المعتادة، بحسب التوفر:
        </p>
        <ul className="mt-3 grid gap-x-8 gap-y-1 text-sm text-[#4B5563] sm:grid-cols-2">
          {FORMATS.map((f) => (
            <li key={f} className="before:ml-2 before:text-[#16A34A] before:content-['•']">{f}</li>
          ))}
        </ul>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#6B7280]">
          تُؤكَّد السيارات والجداول وشروط الخدمة والأسعار لكل طلب على حدة في عرض سعر مكتوب. {CORP_AR} لا تحتاج إلى مشاركة أي معلومات سرية — يكفي ذكر مناطق الاستلام والتواريخ للبدء.
        </p>

        <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} noValidate>
          <label className={labelCls}>اسم الشركة *<input name="company" required autoComplete="organization" className={inputCls} /></label>
          <label className={labelCls}>الشخص المسؤول *<input name="contact" required autoComplete="name" className={inputCls} /></label>
          <label className={labelCls}>البريد الإلكتروني للعمل *<input name="email" type="email" required autoComplete="email" dir="ltr" className={inputCls} /></label>
          <label className={labelCls}>رقم واتساب *<input name="whatsapp" type="tel" required autoComplete="tel" dir="ltr" placeholder="+966…" className={inputCls} /></label>
          <label className={labelCls}>المدينة
            <select name="city" defaultValue={city} className={inputCls}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
          </label>
          <label className={labelCls}>تواريخ السفر<input name="dates" className={inputCls} /></label>
          <label className={labelCls}>عدد الركاب التقريبي<input name="passengers" inputMode="numeric" className={inputCls} /></label>
          <label className={labelCls}>عدد السيارات<input name="vehicles" inputMode="numeric" className={inputCls} /></label>
          <label className={labelCls}>فئة السيارة المطلوبة
            <select name="category" defaultValue={VEHICLES[0]} className={inputCls}>{VEHICLES.map((v) => <option key={v}>{v}</option>)}</select>
          </label>
          <label className={labelCls}>مرة واحدة أم متكرر
            <select name="recurrence" className={inputCls}><option>مرة واحدة</option><option>متكرر</option></select>
          </label>
          <label className={`${labelCls} sm:col-span-2`}>نوع الخدمة
            <select name="format" className={inputCls}>{FORMATS.map((f) => <option key={f}>{f}</option>)}</select>
          </label>
          <label className={`${labelCls} sm:col-span-2`}>تفاصيل الاستلام والوجهة<textarea name="route" rows={2} className={`${inputCls} py-2`} /></label>
          <label className={`${labelCls} sm:col-span-2`}>متطلبات إضافية<textarea name="notes" rows={2} className={`${inputCls} py-2`} /></label>

          {error && <p role="alert" className="text-sm font-semibold text-red-600 sm:col-span-2">{error}</p>}
          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
            <button type="button" onClick={(e) => send(e, "email")} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 text-sm font-bold text-white hover:bg-[#15803D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2">
              <Mail className="h-4 w-4" aria-hidden="true" /> أرسل الطلب بالبريد الإلكتروني
            </button>
            <button type="button" onClick={(e) => send(e, "whatsapp")} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#16A34A]/40 px-6 text-sm font-bold text-[#15803D] hover:bg-[#F0FDF4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2">
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> أرسل على واتساب
            </button>
          </div>
          <p className="text-xs text-[#6B7280] sm:col-span-2">يُفتح طلبك في تطبيق البريد أو واتساب جاهزاً للإرسال، ولا يُحفظ أي شيء على هذه الصفحة.</p>
        </form>
      </div>
    </section>
  );
}
