import { Document, Page, Text, View, StyleSheet, Font, renderToBuffer } from "@react-pdf/renderer";
import path from "path";
import { contactConfig } from "@/lib/config/contact";
import { EAGLE_EYES } from "@/lib/pdf/eagle-eyes";
import { VAT_MODE_LABEL } from "@/lib/ops/invoice-math";
import type { InvoiceRow } from "@/lib/ops/invoices";

// Invoice document. Same design system as the quotation / receipt PDFs (green + yellow, EN/AR labels).
// Every number is read from the stored (frozen) invoice row — nothing is recalculated here.

const GREEN = "#16A34A";
const YELLOW = "#FACC15";
const GRAY = "#49505a";
const INK = "#121417";
const AMBER = "#B45309";

Font.register({
  family: "Amiri",
  fonts: [
    { src: path.join(process.cwd(), "lib/pdf/fonts/Amiri-Regular.ttf") },
    { src: path.join(process.cwd(), "lib/pdf/fonts/Amiri-Bold.ttf"), fontWeight: 700 },
  ],
});

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 10, color: INK, fontFamily: "Helvetica" },
  header: { backgroundColor: GREEN, padding: 12, marginBottom: 10, flexDirection: "row", justifyContent: "space-between" },
  brand: { color: YELLOW, fontSize: 16, fontWeight: 700, letterSpacing: 2 },
  brandSub: { color: "#d9f5d7", fontSize: 8, marginTop: 4, letterSpacing: 1 },
  brandSubAr: { color: "#d9f5d7", fontSize: 9, marginTop: 2, fontFamily: "Amiri" },
  docTitle: { color: "#fff", fontSize: 13, textAlign: "right" },
  docTitleAr: { color: YELLOW, fontSize: 11, textAlign: "right", fontFamily: "Amiri", marginTop: 2 },
  docRef: { color: YELLOW, fontSize: 11, textAlign: "right", marginTop: 4 },
  docSub: { color: "#d9f5d7", fontSize: 8, textAlign: "right", marginTop: 3 },
  section: { marginBottom: 7 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5, borderBottomWidth: 1, borderBottomColor: "#eee5d0", paddingBottom: 3 },
  title: { fontSize: 9, color: GREEN, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 },
  titleAr: { fontSize: 10, color: GRAY, fontFamily: "Amiri" },
  twoCol: { flexDirection: "row", gap: 18 },
  half: { flex: 1 },
  fieldRow: { marginBottom: 3 },
  labelRow: { flexDirection: "row", justifyContent: "space-between" },
  labelEn: { fontSize: 8, color: GRAY, textTransform: "uppercase", letterSpacing: 0.5 },
  labelAr: { fontSize: 9, color: GRAY, fontFamily: "Amiri" },
  value: { fontSize: 10, marginTop: 1, color: INK },
  table: { borderWidth: 1, borderColor: "#e5ddc9", borderRadius: 4 },
  thead: { flexDirection: "row", backgroundColor: "#f6f2e6", paddingVertical: 5, paddingHorizontal: 8 },
  th: { fontSize: 8, color: GRAY, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 },
  tr: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#eee5d0", paddingVertical: 6, paddingHorizontal: 8 },
  cDesc: { flex: 1 },
  cQty: { width: 36, textAlign: "right" },
  cUnit: { width: 76, textAlign: "right" },
  cAmt: { width: 84, textAlign: "right" },
  sumRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, paddingHorizontal: 8 },
  sumLabel: { fontSize: 10, color: GRAY },
  sumValue: { fontSize: 10, fontWeight: 700 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: GREEN, paddingVertical: 8, paddingHorizontal: 10, marginTop: 4, borderRadius: 4 },
  totalEn: { fontWeight: 700, fontSize: 12, color: "#fff" },
  totalAr: { fontFamily: "Amiri", fontSize: 12, color: "#fff" },
  totalVal: { fontWeight: 700, fontSize: 12, color: "#fff" },
  balanceBox: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 2, paddingVertical: 8, paddingHorizontal: 10, marginTop: 6, borderRadius: 4 },
  note: { fontSize: 8.5, color: GRAY, marginTop: 4, lineHeight: 1.4 },
  highlight: { fontSize: 8.5, color: INK, marginTop: 6, padding: 8, backgroundColor: "#FFF9E6", borderRadius: 4, borderWidth: 1, borderColor: YELLOW, lineHeight: 1.45 },
  void: { position: "absolute", top: 330, left: 90, borderWidth: 6, borderColor: "#B91C1C", color: "#B91C1C", fontSize: 70, fontWeight: 700, letterSpacing: 10, paddingHorizontal: 20, opacity: 0.35, transform: "rotate(-18deg)" },
  footer: { position: "absolute", bottom: 24, left: 36, right: 36, borderTopWidth: 1, borderTopColor: "#eee5d0", paddingTop: 8, fontSize: 8, color: "#8a8577" },
});

const money = (n: number, cur: string) => `${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${cur}`;
const fmtDate = (d: string) => new Date(`${d.slice(0, 10)}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const VEH: Record<string, string> = { sedan: "Executive sedan", suv: "Full-size SUV", van: "Van", bus: "Coach", limousine: "Limousine" };

function Field({ en, ar, value, valueAr }: { en: string; ar?: string; value: string; valueAr?: string }) {
  return (
    <View style={s.fieldRow}>
      <View style={s.labelRow}><Text style={s.labelEn}>{en}</Text>{ar ? <Text style={s.labelAr}>{ar}</Text> : null}</View>
      <Text style={s.value}>{value}</Text>
      {valueAr ? <Text style={[s.value, { fontFamily: "Amiri", fontSize: 11 }]}>{valueAr}</Text> : null}
    </View>
  );
}
const Title = ({ en, ar }: { en: string; ar: string }) => <View style={s.titleRow}><Text style={s.title}>{en}</Text><Text style={s.titleAr}>{ar}</Text></View>;

export function InvoiceDocumentPdf({ inv }: { inv: InvoiceRow }) {
  const cur = inv.currency;
  const hasVat = inv.vat_mode !== "none";
  const owes = inv.balance_at_issue > 0;
  const bt = inv.bill_to;
  const t = inv.trip;
  const paidInFull = !owes;

  return (
    <Document title={`Invoice ${inv.number}`}>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.brand}>TAXI SAUDI ARABIA</Text>
            <Text style={s.brandSub}>PRIVATE TRANSPORTATION SERVICES</Text>
            <Text style={s.brandSubAr}>خدمات النقل الخاص</Text>
          </View>
          <View>
            <Text style={s.docTitle}>INVOICE</Text>
            <Text style={s.docTitleAr}>فاتورة</Text>
            <Text style={s.docRef}>{inv.number}</Text>
            <Text style={s.docSub}>{VAT_MODE_LABEL[inv.vat_mode]}</Text>
          </View>
        </View>

        <View style={[s.section, s.twoCol]}>
          <View style={s.half}>
            <Title en="Billed To" ar="بيانات العميل" />
            <Field en={bt.company ? "Company" : "Name"} ar={bt.company ? "الشركة" : "الاسم"} value={bt.company || bt.name} />
            {bt.company ? <Field en="Contact" ar="جهة الاتصال" value={bt.name} /> : null}
            {bt.vat_no ? <Field en="Client VAT No." ar="الرقم الضريبي" value={bt.vat_no} /> : null}
            {bt.address ? <Field en="Address" ar="العنوان" value={bt.address} /> : null}
            {bt.email ? <Field en="Email" value={bt.email} /> : null}
            {bt.phone ? <Field en="Phone" ar="الهاتف" value={bt.phone} /> : null}
          </View>
          <View style={s.half}>
            <Title en="Invoice Details" ar="بيانات الفاتورة" />
            <Field en="Invoice Date" ar="تاريخ الفاتورة" value={fmtDate(inv.issue_date)} />
            <Field en="Booking Reference" ar="رقم الحجز" value={t.quote_reference} />
            {inv.po_reference ? <Field en="PO Reference" ar="رقم أمر الشراء" value={inv.po_reference} /> : null}
          </View>
        </View>

        {hasVat ? (
          <View style={s.section}>
            <Title en="VAT Billing Partner" ar="شريك الفوترة الضريبية" />
            <View style={s.twoCol}>
              <View style={s.half}>
                <Field en="Company" ar="الشركة" value={EAGLE_EYES.nameEn} valueAr={EAGLE_EYES.nameAr} />
                <Field en="VAT No." ar="الرقم الضريبي" value={EAGLE_EYES.vatNo} />
              </View>
              <View style={s.half}>
                <Field en="CR No." ar="السجل التجاري" value={EAGLE_EYES.crNo} />
                <Field en="Address" ar="العنوان" value={EAGLE_EYES.address} />
              </View>
            </View>
          </View>
        ) : null}

        <View style={s.section}>
          <Title en="Journey" ar="تفاصيل الرحلة" />
          <View style={s.twoCol}>
            <View style={s.half}>
              <Field en="Pick-up" ar="نقطة الانطلاق" value={t.pickup} />
              <Field en="Drop-off" ar="نقطة الوصول" value={t.drop} />
            </View>
            <View style={s.half}>
              <Field en="Date & Time" ar="التاريخ والوقت" value={`${fmtDate(t.trip_date)}${t.trip_time ? ` — ${t.trip_time.slice(0, 5)}` : ""}`} />
              {t.vehicle || t.passengers ? <Field en="Vehicle / Passengers" ar="المركبة / الركاب" value={[t.vehicle ? VEH[t.vehicle] ?? t.vehicle : null, t.passengers ? `${t.passengers} pax` : null].filter(Boolean).join(" · ")} /> : null}
            </View>
          </View>
        </View>

        <View style={s.section} wrap={false}>
          <Title en="Items" ar="البنود" />
          <View style={s.table}>
            <View style={s.thead}>
              <Text style={[s.th, s.cDesc]}>Description</Text><Text style={[s.th, s.cQty]}>Qty</Text><Text style={[s.th, s.cUnit]}>Unit</Text><Text style={[s.th, s.cAmt]}>Amount</Text>
            </View>
            {inv.lines.map((l, i) => (
              <View key={i} style={s.tr} wrap={false}>
                <Text style={s.cDesc}>{l.description}</Text>
                <Text style={s.cQty}>{l.qty}</Text>
                <Text style={s.cUnit}>{money(l.unit, cur)}</Text>
                <Text style={[s.cAmt, { fontWeight: 700 }]}>{money(Math.round(l.qty * l.unit * 100) / 100, cur)}</Text>
              </View>
            ))}
          </View>

          <View style={{ marginTop: 6 }}>
            <View style={s.sumRow}><Text style={s.sumLabel}>{hasVat ? "Subtotal (excl. VAT)" : "Subtotal"}</Text><Text style={s.sumValue}>{money(inv.subtotal, cur)}</Text></View>
            <View style={s.sumRow}><Text style={s.sumLabel}>{hasVat ? `VAT (${Math.round(inv.vat_rate * 100)}%)` : "VAT"}</Text><Text style={s.sumValue}>{hasVat ? money(inv.vat_amount, cur) : "Not charged"}</Text></View>
          </View>
          <View style={s.totalRow}>
            <View><Text style={s.totalEn}>Total Payable</Text><Text style={s.totalAr}>إجمالي المستحق</Text></View>
            <Text style={s.totalVal}>{money(inv.total, cur)}</Text>
          </View>
          <View style={s.sumRow}><Text style={s.sumLabel}>Amount paid to date (at issue)</Text><Text style={s.sumValue}>{money(inv.paid_at_issue, cur)}</Text></View>
          <View style={[s.balanceBox, { borderColor: paidInFull ? GREEN : AMBER }]}>
            <View>
              <Text style={{ fontWeight: 700, fontSize: 11, color: paidInFull ? GREEN : AMBER }}>{paidInFull ? "Balance outstanding — settled" : "Balance outstanding"}</Text>
              <Text style={{ fontFamily: "Amiri", fontSize: 11, color: paidInFull ? GREEN : AMBER }}>الرصيد المتبقي</Text>
            </View>
            <Text style={{ fontWeight: 700, fontSize: 12, color: paidInFull ? GREEN : AMBER }}>{money(inv.balance_at_issue, cur)}</Text>
          </View>
        </View>

        <View style={s.section} wrap={false}>
          <Title en="Payment" ar="الدفع" />
          <Text style={s.note}>{inv.payment_terms}</Text>
          {hasVat && owes ? (
            <View style={[s.twoCol, { marginTop: 6 }]}>
              <View style={s.half}>
                <Field en="Account Name" value={EAGLE_EYES.accountName} />
                <Field en="Bank" value={EAGLE_EYES.bankName} valueAr={EAGLE_EYES.bankNameAr} />
              </View>
              <View style={s.half}>
                <Field en="IBAN" value={EAGLE_EYES.iban} />
                <Field en="SWIFT/BIC" value={EAGLE_EYES.swift} />
              </View>
            </View>
          ) : null}
          {inv.notes ? <Text style={s.note}>{inv.notes}</Text> : null}
          {hasVat ? (
            <Text style={s.highlight}>
              This invoice is issued by Taxi Saudi Arabia on behalf of Arabian Eagle Eyes Trading Est., our registered VAT billing partner. The official
              ZATCA-compliant tax invoice (with QR code) is issued by Arabian Eagle Eyes Trading Est. directly after payment is received.
            </Text>
          ) : null}
          <Text style={s.note}>Questions about this invoice? WhatsApp {contactConfig.primaryPhoneDisplay}.</Text>
        </View>

        {inv.status === "void" ? <Text style={s.void} fixed>VOID</Text> : null}
        <View style={s.footer}><Text>Taxi Saudi Arabia — Private Transportation Services — {contactConfig.primaryPhoneDisplay} — {contactConfig.email}</Text></View>
      </Page>
    </Document>
  );
}

export async function renderInvoiceDocPdf(inv: InvoiceRow): Promise<Buffer> {
  return renderToBuffer(<InvoiceDocumentPdf inv={inv} />);
}
