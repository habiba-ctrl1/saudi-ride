import Link from "next/link";
import { Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { contactConfig, recoveryContact } from "@/lib/config/contact";
import type { BlogCta as BlogCtaData } from "@/lib/data/blog";
import { BLOG_STRINGS, type BlogLocale } from "./strings";

// End-of-article conversion block. Matches the site's lead model:
// Path A (individual) = structured WhatsApp prefill + the shared quote form;
// Path B (corporate) adds a written-quote email RFQ; car-recovery posts go to
// the recovery intake instead. Facts shown are the confirmed ones in facts.md.
export function BlogCta({ cta, title, locale }: { cta?: BlogCtaData; title: string; locale: BlogLocale }) {
  const s = BLOG_STRINGS[locale];
  const kind = cta?.kind ?? "individual";
  const ar = locale === "ar";

  if (kind === "recovery") {
    const wa = buildWhatsAppUrl(
      {
        intro: cta?.intro ?? (ar ? "السلام عليكم، أحتاج سطحة / سحب سيارة." : "Hello, I need a car recovery / satha."),
        fields: ar
          ? [{ label: "الموقع الحالي" }, { label: "الوجهة" }, { label: "نوع السيارة" }, { label: "المشكلة" }]
          : [{ label: "Current location" }, { label: "Drop-off" }, { label: "Car make & model" }, { label: "What happened" }],
      },
      recoveryContact.whatsappNumber,
    );
    return (
      <section className="blog-cta" aria-labelledby="blog-cta-h">
        <h2 id="blog-cta-h" className="font-heading text-2xl font-bold text-[#0F172A]">
          {cta?.heading ?? (ar ? "تحتاج سطحة الآن؟" : "Need a recovery truck now?")}
        </h2>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-[#475569]">
          {cta?.text ??
            (ar
              ? "أرسل موقعك ونوع السيارة عبر واتساب ونؤكد لك السعر قبل إرسال السطحة."
              : "Send your location and car details on WhatsApp and we confirm the price before the truck is dispatched.")}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
            <MessageCircle className="h-5 w-5" /> {s.whatsapp}
          </a>
          <a href={recoveryContact.phoneLink} className="btn btn-secondary btn-lg">
            <Phone className="h-5 w-5" /> {s.callRecovery}
          </a>
        </div>
      </section>
    );
  }

  const wa = buildWhatsAppUrl(
    ar
      ? {
          intro: cta?.intro ?? `السلام عليكم، أرغب بعرض سعر لرحلة خاصة (من دليل: ${title}).`,
          fields: [
            { label: "من", value: cta?.from },
            { label: "إلى", value: cta?.to },
            { label: "التاريخ والوقت" },
            { label: "عدد الركاب والحقائب" },
            { label: "السيارة (سيدان / SUV / فان)" },
          ],
        }
      : {
          intro: cta?.intro ?? `Hello, I'd like a quote for a private transfer (from your guide: ${title}).`,
          from: cta?.from,
          to: cta?.to,
        },
  );

  const rfqSubject = ar ? `طلب عرض سعر للشركات — ${title}` : `Corporate transport RFQ — ${title}`;
  const rfqBody = ar
    ? `مرحباً فريق تاكسي السعودية،\n\nنرغب بعرض سعر مكتوب لتنقلات الشركة.\n\n• اسم الشركة: \n• اسم المسؤول ومنصبه: \n• المدينة / المدن: \n• التواريخ والرحلات: \n• عدد الركاب لكل رحلة: \n• فئة السيارة (سيدان تنفيذية / SUV / فان / حافلة): \n• هل تحتاجون فاتورة للشركة؟: \n\nشكراً لكم.`
    : `Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for company transport.\n\n• Company: \n• Contact name & role: \n• City / cities: \n• Dates & movements: \n• Passengers per movement: \n• Vehicle category (executive sedan / SUV / van / coaster): \n• Company invoice needed?: \n\nThank you.`;

  return (
    <section className="blog-cta" aria-labelledby="blog-cta-h">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <h2 id="blog-cta-h" className="font-heading text-2xl font-bold text-[#0F172A] md:text-[1.75rem]">
            {cta?.heading ?? s.ctaHeading}
          </h2>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-[#475569]">{cta?.text ?? s.ctaText}</p>
          <ul className="mt-5 space-y-2 text-sm text-[#334155]">
            {s.indexFacts.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden /> {f}
              </li>
            ))}
            {kind === "corporate" && (
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden /> {s.invoicing}
              </li>
            )}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <MessageCircle className="h-4 w-4" /> {s.whatsapp}
            </a>
            {kind === "corporate" && (
              <a
                href={`mailto:${contactConfig.email}?subject=${encodeURIComponent(rfqSubject)}&body=${encodeURIComponent(rfqBody)}`}
                className="btn btn-secondary"
              >
                <Mail className="h-4 w-4" /> {s.rfq}
              </a>
            )}
          </div>
          <p className="mt-2 text-xs text-[#64748B]">
            <Link href="/routes" className="inline-flex min-h-11 items-center underline underline-offset-2 hover:text-[#15803D]">
              {s.browseRoutes}
            </Link>
          </p>
        </div>
        <div className="rounded-2xl border border-[#0F172A]/[0.07] bg-white p-1 sm:p-2">
          <WhatsAppQuoteForm defaultPickup={cta?.from ?? ""} defaultDropoff={cta?.to ?? ""} forceLocale={locale} />
        </div>
      </div>
    </section>
  );
}
