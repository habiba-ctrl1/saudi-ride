import { Document, Page, Text, View, StyleSheet, Font, renderToBuffer } from "@react-pdf/renderer";
import path from "path";
import { contactConfig } from "@/lib/config/contact";
import type { QuotationRow } from "@/lib/supabase/quotations";

const GOLD = "#C9A84C";
const DARK = "#0A0A0A";
const GRAY = "#49505a";

Font.register({
  family: "Amiri",
  fonts: [
    { src: path.join(process.cwd(), "lib/pdf/fonts/Amiri-Regular.ttf") },
    { src: path.join(process.cwd(), "lib/pdf/fonts/Amiri-Bold.ttf"), fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, color: "#121417", fontFamily: "Helvetica" },
  header: { backgroundColor: DARK, padding: 20, marginBottom: 24, flexDirection: "row", justifyContent: "space-between" },
  brand: { color: GOLD, fontSize: 16, fontWeight: 700, letterSpacing: 2 },
  brandSub: { color: "#A1A1A6", fontSize: 8, marginTop: 4, letterSpacing: 1 },
  brandSubAr: { color: "#A1A1A6", fontSize: 9, marginTop: 2, fontFamily: "Amiri", textAlign: "left" },
  invoiceTitle: { color: "#fff", fontSize: 13, textAlign: "right" },
  invoiceTitleAr: { color: GOLD, fontSize: 11, textAlign: "right", fontFamily: "Amiri", marginTop: 2 },
  invoiceRef: { color: GOLD, fontSize: 11, textAlign: "right", marginTop: 4 },
  section: { marginBottom: 16 },
  sectionTitleRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6, borderBottomWidth: 1, borderBottomColor: "#eee5d0", paddingBottom: 3 },
  sectionTitle: { fontSize: 9, color: GRAY, textTransform: "uppercase", letterSpacing: 1 },
  sectionTitleAr: { fontSize: 10, color: GRAY, fontFamily: "Amiri" },
  fieldRow: { marginBottom: 6 },
  labelRow: { flexDirection: "row", justifyContent: "space-between" },
  labelEn: { fontSize: 8, color: GRAY, textTransform: "uppercase", letterSpacing: 0.5 },
  labelAr: { fontSize: 9, color: GRAY, fontFamily: "Amiri" },
  value: { fontSize: 10.5, marginTop: 2, color: "#121417" },
  table: { borderWidth: 1, borderColor: "#e5ddc9", borderRadius: 4 },
  tableRow: { flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#eee5d0", paddingVertical: 8, paddingHorizontal: 10 },
  tableRowLast: { borderBottomWidth: 0 },
  tableLabelEn: { fontSize: 10 },
  tableLabelAr: { fontSize: 10, fontFamily: "Amiri" },
  tableValue: { fontSize: 10, fontWeight: 700 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#faf7f0", paddingVertical: 10, paddingHorizontal: 10, marginTop: 8, borderRadius: 4 },
  totalLabelEn: { fontWeight: 700, fontSize: 12 },
  totalLabelAr: { fontFamily: "Amiri", fontSize: 12, marginTop: 1 },
  totalValue: { fontWeight: 700, fontSize: 12, color: GOLD },
  note: { fontSize: 8.5, color: GRAY, marginTop: 4 },
  noteAr: { fontSize: 9, color: GRAY, fontFamily: "Amiri", marginTop: 1 },
  highlightNote: { fontSize: 9, color: DARK, marginTop: 8, padding: 8, backgroundColor: "#FFF9E6", borderRadius: 4, borderWidth: 1, borderColor: GOLD, lineHeight: 1.4 },
  bulletLine: { fontSize: 9.5, color: "#121417", marginBottom: 4, lineHeight: 1.4 },
  closingBlock: { marginTop: 4, marginBottom: 16, padding: 12, backgroundColor: "#faf7f0", borderRadius: 6, textAlign: "center" },
  closingText: { fontSize: 9.5, color: GRAY, marginBottom: 4 },
  closingContact: { fontSize: 11, color: GOLD, fontWeight: 700 },
  termsBlock: { marginTop: 4 },
  termLineEn: { fontSize: 8.5, color: GRAY, marginBottom: 4, lineHeight: 1.4 },
  termLineAr: { fontSize: 9.5, color: GRAY, fontFamily: "Amiri", textAlign: "right", marginBottom: 5, lineHeight: 1.6 },
  footer: { position: "absolute", bottom: 24, left: 36, right: 36, borderTopWidth: 1, borderTopColor: "#eee5d0", paddingTop: 10, fontSize: 8, color: "#8a8577" },
});

function fmt(n: number, currency: string) {
  return `${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

function Field({ labelEn, labelAr, value }: { labelEn: string; labelAr: string; value: string }) {
  return (
    <View style={styles.fieldRow}>
      <View style={styles.labelRow}>
        <Text style={styles.labelEn}>{labelEn}</Text>
        <Text style={styles.labelAr}>{labelAr}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function SectionTitle({ en, ar }: { en: string; ar: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{en}</Text>
      <Text style={styles.sectionTitleAr}>{ar}</Text>
    </View>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item, i) => (
        <Text key={i} style={styles.bulletLine}>• {item}</Text>
      ))}
    </View>
  );
}

type TripExtras = {
  vehicleLabel?: string;
  itinerary?: string[];
  included?: string[];
  excluded?: string[];
  notes?: string;
};

/**
 * luggage_notes is a plain free-text column shared by every quotation type
 * (airport transfers, car recovery, day tours, ...). Multi-stop tour quotes
 * (like a Jeddah–Taif day trip) additionally encode a structured
 * VEHICLE:/ITINERARY:/INCLUDED:/NOT INCLUDED: block inside it so this one
 * template can render dedicated sections for them — no schema change, and
 * any quotation without these markers renders exactly as before (plain
 * "Notes" field).
 */
function parseTripExtras(luggageNotes: string | null): TripExtras {
  if (!luggageNotes) return {};
  const HEADERS = ["VEHICLE:", "ITINERARY:", "INCLUDED:", "NOT INCLUDED:"] as const;
  if (!HEADERS.some((h) => luggageNotes.includes(h))) {
    return { notes: luggageNotes };
  }

  const lines = luggageNotes.split("\n");
  const extras: TripExtras = { itinerary: [], included: [], excluded: [] };
  let current: "vehicle" | "itinerary" | "included" | "excluded" | "notes" | null = null;
  const leftover: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("VEHICLE:")) { extras.vehicleLabel = line.replace("VEHICLE:", "").trim(); current = "vehicle"; continue; }
    if (line.startsWith("ITINERARY:")) { current = "itinerary"; continue; }
    if (line.startsWith("NOT INCLUDED:")) { current = "excluded"; continue; }
    if (line.startsWith("INCLUDED:")) { current = "included"; continue; }

    const bullet = line.replace(/^[-•]\s*/, "");
    if (current === "itinerary") extras.itinerary!.push(bullet);
    else if (current === "included") extras.included!.push(bullet);
    else if (current === "excluded") extras.excluded!.push(bullet);
    else if (current !== "vehicle") leftover.push(line);
  }

  if (!extras.itinerary!.length) delete extras.itinerary;
  if (!extras.included!.length) delete extras.included;
  if (!extras.excluded!.length) delete extras.excluded;
  if (leftover.length) extras.notes = leftover.join(" ");
  return extras;
}

function buildTerms(validUntilStr: string): Array<{ en: string; ar: string }> {
  return [
    {
      en: "This price includes the driver, fuel, and airport parking fees for the pickup terminal/location specified above.",
      ar: "يشمل هذا السعر السائق والوقود ورسوم مواقف المطار الخاصة بنقطة الانطلاق أو الصالة المحددة أعلاه.",
    },
    {
      en: "Any changes made after confirmation (pickup point, terminal, date, time, route, or vehicle) may result in additional charges, which will be calculated and communicated separately.",
      ar: "أي تغييرات تُطلب بعد تأكيد الحجز (نقطة الانطلاق، الصالة، التاريخ، الوقت، المسار، أو نوع المركبة) قد تترتب عليها رسوم إضافية تُحتسب وتُبلَّغ بشكل منفصل.",
    },
    {
      en: `This quotation is valid until ${validUntilStr}.`,
      ar: `هذا العرض صالح حتى ${validUntilStr}.`,
    },
    {
      en: "Price does not cover extra stops, waiting time beyond 30 minutes, or additional passengers/luggage not listed above.",
      ar: "لا يشمل السعر التوقفات الإضافية، أو وقت الانتظار الذي يتجاوز 30 دقيقة، أو ركاباً/أمتعة إضافية غير مذكورة أعلاه.",
    },
    {
      en: "Cancellations should be made at least 24 hours before the scheduled trip.",
      ar: "يُرجى إلغاء الحجز قبل 24 ساعة على الأقل من موعد الرحلة المحدد.",
    },
  ];
}

export function InvoiceDocument({ q }: { q: QuotationRow }) {
  const total = q.quoted_price ?? 0;
  const issuedAt = new Date(q.updated_at ?? q.created_at);
  const tripDate = new Date(`${q.trip_date}T00:00:00`);
  // Valid through the day after the trip itself — a fixed short window (e.g.
  // 7 days from issue) made no sense for trips booked well in advance, since
  // it would expire the quote long before the customer's actual travel date.
  const validUntil = new Date(tripDate.getTime() + 24 * 60 * 60 * 1000);
  const fmtDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const terms = buildTerms(fmtDate(validUntil));
  const extras = parseTripExtras(q.luggage_notes);
  const fareLabel = extras.excluded?.length ? "Transportation fare (see exclusions below)" : "Trip fare (all-inclusive)";
  const fareLabelAr = extras.excluded?.length ? "أجرة النقل (راجع الاستثناءات أدناه)" : "إجمالي أجرة الرحلة (شامل)";

  return (
    <Document title={`Quotation ${q.quote_reference}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>TAXI SAUDI ARABIA</Text>
            <Text style={styles.brandSub}>PREMIUM CHAUFFEUR NETWORK — KSA</Text>
            <Text style={styles.brandSubAr}>شبكة سائقين فاخرة - المملكة العربية السعودية</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>QUOTATION</Text>
            <Text style={styles.invoiceTitleAr}>عرض سعر</Text>
            <Text style={styles.invoiceRef}>{q.quote_reference}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle en="Billed To" ar="بيانات العميل" />
          <Field labelEn="Name" labelAr="الاسم" value={q.customer_name} />
          <Field labelEn="Phone" labelAr="رقم الهاتف" value={q.customer_phone} />
          {q.customer_email ? <Field labelEn="Email" labelAr="البريد الإلكتروني" value={q.customer_email} /> : null}
          <Field labelEn="Issue Date" labelAr="تاريخ الإصدار" value={fmtDate(issuedAt)} />
          <Field labelEn="Valid Until" labelAr="صالح حتى" value={fmtDate(validUntil)} />
        </View>

        <View style={styles.section}>
          <SectionTitle en="Trip Details" ar="تفاصيل الرحلة" />
          <Field labelEn="Pick-up" labelAr="نقطة الانطلاق" value={q.pickup_location} />
          <Field labelEn="Drop-off" labelAr="نقطة الوصول" value={q.drop_location} />
          <Field
            labelEn="Date & Time"
            labelAr="التاريخ والوقت"
            value={`${q.trip_date}${q.trip_time ? ` — ${q.trip_time.slice(0, 5)}` : ""}`}
          />
          <Field labelEn="Passengers" labelAr="عدد الركاب" value={String(q.passengers_count ?? "-")} />
          {extras.notes ? <Field labelEn="Notes" labelAr="ملاحظات" value={extras.notes} /> : null}
        </View>

        {(extras.vehicleLabel || q.vehicle_type_requested) ? (
          <View style={styles.section}>
            <SectionTitle en="Vehicle & Service" ar="المركبة والخدمة" />
            <Field
              labelEn="Vehicle"
              labelAr="المركبة"
              value={extras.vehicleLabel || q.vehicle_type_requested!.toUpperCase()}
            />
          </View>
        ) : null}

        {extras.itinerary?.length ? (
          <View style={styles.section}>
            <SectionTitle en="Itinerary" ar="خط سير الرحلة" />
            <BulletList items={extras.itinerary} />
          </View>
        ) : null}

        {extras.included?.length ? (
          <View style={styles.section}>
            <SectionTitle en="What's Included" ar="يشمل السعر" />
            <BulletList items={extras.included} />
          </View>
        ) : null}

        {extras.excluded?.length ? (
          <View style={styles.section}>
            <SectionTitle en="What's Not Included" ar="لا يشمل السعر" />
            <BulletList items={extras.excluded} />
          </View>
        ) : null}

        <View style={styles.section}>
          <SectionTitle en="Price Summary" ar="ملخص السعر" />
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableRowLast]}>
              <Text style={styles.tableLabelEn}>{fareLabel}</Text>
              <Text style={styles.tableLabelAr}>{fareLabelAr}</Text>
              <Text style={styles.tableValue}>{fmt(total, q.currency)}</Text>
            </View>
          </View>
          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabelEn}>Total — Cash</Text>
              <Text style={styles.totalLabelAr}>الإجمالي - نقداً</Text>
            </View>
            <Text style={styles.totalValue}>{fmt(total, q.currency)}</Text>
          </View>
          <Text style={styles.note}>Payable in cash to the driver.</Text>
          <Text style={styles.noteAr}>يُدفع نقداً للسائق.</Text>
          {extras.excluded?.length ? (
            <Text style={styles.highlightNote}>
              This rate covers transportation only. It does not include: {extras.excluded.join(", ")}.
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <SectionTitle en="Terms & Conditions" ar="الشروط والأحكام" />
          <View style={styles.termsBlock}>
            {terms.map((t, i) => (
              <Text key={`en-${i}`} style={styles.termLineEn}>{i + 1}. {t.en}</Text>
            ))}
          </View>
          <View style={styles.termsBlock}>
            {terms.map((t, i) => (
              <Text key={`ar-${i}`} style={styles.termLineAr}>{t.ar} .{i + 1}</Text>
            ))}
          </View>
        </View>

        <View style={styles.closingBlock}>
          <Text style={styles.closingText}>Questions or ready to confirm? Reach our concierge desk directly.</Text>
          <Text style={styles.closingContact}>WhatsApp {contactConfig.primaryPhoneDisplay}</Text>
        </View>

        <View style={styles.footer}>
          <Text>Taxi Saudi Arabia — Private Transportation Services — {contactConfig.primaryPhoneDisplay} — {contactConfig.email}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderInvoicePdf(q: QuotationRow): Promise<Buffer> {
  return renderToBuffer(<InvoiceDocument q={q} />);
}
