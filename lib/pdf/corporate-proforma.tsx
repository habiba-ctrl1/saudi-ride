import { Document, Page, Text, View, StyleSheet, Font, renderToBuffer } from "@react-pdf/renderer";
import path from "path";
import { contactConfig } from "@/lib/config/contact";
import { EAGLE_EYES, VAT_RATE } from "@/lib/pdf/eagle-eyes";

const GREEN = "#16A34A";
const YELLOW = "#FACC15";
const GRAY = "#49505a";
const INK = "#121417";

Font.register({
  family: "Amiri",
  fonts: [
    { src: path.join(process.cwd(), "lib/pdf/fonts/Amiri-Regular.ttf") },
    { src: path.join(process.cwd(), "lib/pdf/fonts/Amiri-Bold.ttf"), fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, color: INK, fontFamily: "Helvetica" },
  header: { backgroundColor: GREEN, padding: 20, marginBottom: 24, flexDirection: "row", justifyContent: "space-between" },
  brand: { color: YELLOW, fontSize: 16, fontWeight: 700, letterSpacing: 2 },
  brandSub: { color: "#d9f5d7", fontSize: 8, marginTop: 4, letterSpacing: 1 },
  brandSubAr: { color: "#d9f5d7", fontSize: 9, marginTop: 2, fontFamily: "Amiri", textAlign: "left" },
  docTitle: { color: "#fff", fontSize: 13, textAlign: "right" },
  docTitleAr: { color: YELLOW, fontSize: 11, textAlign: "right", fontFamily: "Amiri", marginTop: 2 },
  docRef: { color: YELLOW, fontSize: 11, textAlign: "right", marginTop: 4 },
  section: { marginBottom: 16 },
  sectionTitleRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6, borderBottomWidth: 1, borderBottomColor: "#eee5d0", paddingBottom: 3 },
  sectionTitle: { fontSize: 9, color: GREEN, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 },
  sectionTitleAr: { fontSize: 10, color: GRAY, fontFamily: "Amiri" },
  fieldRow: { marginBottom: 6 },
  labelRow: { flexDirection: "row", justifyContent: "space-between" },
  labelEn: { fontSize: 8, color: GRAY, textTransform: "uppercase", letterSpacing: 0.5 },
  labelAr: { fontSize: 9, color: GRAY, fontFamily: "Amiri" },
  value: { fontSize: 10.5, marginTop: 2, color: "#121417" },
  twoCol: { flexDirection: "row", gap: 20 },
  colHalf: { flex: 1 },
  table: { borderWidth: 1, borderColor: "#e5ddc9", borderRadius: 4 },
  tableRow: { flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#eee5d0", paddingVertical: 8, paddingHorizontal: 10 },
  tableRowLast: { borderBottomWidth: 0 },
  tableLabelEn: { fontSize: 10, flex: 1 },
  tableValue: { fontSize: 10, fontWeight: 700 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: GREEN, paddingVertical: 10, paddingHorizontal: 10, marginTop: 8, borderRadius: 4 },
  totalLabelEn: { fontWeight: 700, fontSize: 12, color: "#fff" },
  totalLabelAr: { fontFamily: "Amiri", fontSize: 12, marginTop: 1, color: "#fff" },
  totalValue: { fontWeight: 700, fontSize: 12, color: "#fff" },
  note: { fontSize: 8.5, color: GRAY, marginTop: 4 },
  highlightNote: { fontSize: 9, color: INK, marginTop: 10, padding: 10, backgroundColor: "#FFF9E6", borderRadius: 4, borderWidth: 1, borderColor: YELLOW, lineHeight: 1.5 },
  closingBlock: { marginTop: 4, marginBottom: 16, padding: 12, backgroundColor: "#faf7f0", borderRadius: 6, textAlign: "center" },
  closingText: { fontSize: 9.5, color: GRAY, marginBottom: 4 },
  closingContact: { fontSize: 11, color: GREEN, fontWeight: 700 },
  footer: { position: "absolute", bottom: 24, left: 36, right: 36, borderTopWidth: 1, borderTopColor: "#eee5d0", paddingTop: 10, fontSize: 8, color: "#8a8577" },
});

function fmt(n: number, currency: string) {
  return `${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

function Field({ labelEn, labelAr, value }: { labelEn: string; labelAr?: string; value: string }) {
  return (
    <View style={styles.fieldRow}>
      <View style={styles.labelRow}>
        <Text style={styles.labelEn}>{labelEn}</Text>
        {labelAr ? <Text style={styles.labelAr}>{labelAr}</Text> : null}
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

export interface CorporateProformaInput {
  invoiceNo: string;
  invoiceDate: string; // YYYY-MM-DD
  clientCompany: string;
  clientContact?: string;
  clientVatNo?: string;
  clientAddress?: string;
  serviceDescription: string;
  totalAmount: number; // VAT-inclusive
  currency: string;
  poReference?: string;
  notes?: string;
}

export function CorporateProformaDocument({ d }: { d: CorporateProformaInput }) {
  const preVat = d.totalAmount / (1 + VAT_RATE);
  const vatAmount = d.totalAmount - preVat;
  const fmtDate = (s: string) => new Date(`${s}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <Document title={`Proforma Invoice ${d.invoiceNo}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>TAXI SAUDI ARABIA</Text>
            <Text style={styles.brandSub}>CORPORATE TRANSPORTATION SERVICES</Text>
            <Text style={styles.brandSubAr}>خدمات النقل للشركات</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>PROFORMA INVOICE</Text>
            <Text style={styles.docTitleAr}>فاتورة أولية</Text>
            <Text style={styles.docRef}>{d.invoiceNo}</Text>
          </View>
        </View>

        <View style={[styles.section, styles.twoCol]}>
          <View style={styles.colHalf}>
            <SectionTitle en="Billed To" ar="بيانات العميل" />
            <Field labelEn="Company" labelAr="الشركة" value={d.clientCompany} />
            {d.clientContact ? <Field labelEn="Contact" labelAr="جهة الاتصال" value={d.clientContact} /> : null}
            {d.clientVatNo ? <Field labelEn="Client VAT No." labelAr="الرقم الضريبي" value={d.clientVatNo} /> : null}
            {d.clientAddress ? <Field labelEn="Address" labelAr="العنوان" value={d.clientAddress} /> : null}
          </View>
          <View style={styles.colHalf}>
            <SectionTitle en="Invoice Details" ar="بيانات الفاتورة" />
            <Field labelEn="Invoice Date" labelAr="تاريخ الفاتورة" value={fmtDate(d.invoiceDate)} />
            {d.poReference ? <Field labelEn="PO Reference" labelAr="رقم أمر الشراء" value={d.poReference} /> : null}
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle en="Billed By (VAT Billing Partner)" ar="الجهة المصدرة (شريك الفوترة الضريبية)" />
          <View style={styles.twoCol}>
            <View style={styles.colHalf}>
              <Field labelEn="Company" labelAr="الشركة" value={`${EAGLE_EYES.nameEn} / ${EAGLE_EYES.nameAr}`} />
              <Field labelEn="VAT No." labelAr="الرقم الضريبي" value={EAGLE_EYES.vatNo} />
              <Field labelEn="CR No." labelAr="السجل التجاري" value={EAGLE_EYES.crNo} />
            </View>
            <View style={styles.colHalf}>
              <Field labelEn="Address" labelAr="العنوان" value={EAGLE_EYES.address} />
              <Field labelEn="Email" value={EAGLE_EYES.email} />
              <Field labelEn="Phone" value={EAGLE_EYES.phone} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle en="Service Description" ar="وصف الخدمة" />
          <Text style={styles.value}>{d.serviceDescription}</Text>
        </View>

        <View style={styles.section}>
          <SectionTitle en="Amount" ar="المبلغ" />
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabelEn}>Subtotal (excl. VAT)</Text>
              <Text style={styles.tableValue}>{fmt(preVat, d.currency)}</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowLast]}>
              <Text style={styles.tableLabelEn}>VAT (15%)</Text>
              <Text style={styles.tableValue}>{fmt(vatAmount, d.currency)}</Text>
            </View>
          </View>
          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabelEn}>Total (incl. VAT)</Text>
              <Text style={styles.totalLabelAr}>الإجمالي شامل الضريبة</Text>
            </View>
            <Text style={styles.totalValue}>{fmt(d.totalAmount, d.currency)}</Text>
          </View>
          {d.notes ? <Text style={styles.note}>{d.notes}</Text> : null}
        </View>

        <View style={styles.section}>
          <SectionTitle en="Payment Details" ar="بيانات الدفع" />
          <View style={styles.twoCol}>
            <View style={styles.colHalf}>
              <Field labelEn="Account Name" value={EAGLE_EYES.accountName} />
              <Field labelEn="Bank" value={`${EAGLE_EYES.bankName} / ${EAGLE_EYES.bankNameAr}`} />
            </View>
            <View style={styles.colHalf}>
              <Field labelEn="IBAN" value={EAGLE_EYES.iban} />
              <Field labelEn="Account No." value={EAGLE_EYES.accountNo} />
              <Field labelEn="SWIFT/BIC" value={EAGLE_EYES.swift} />
            </View>
          </View>
        </View>

        <Text style={styles.highlightNote}>
          This proforma invoice is issued by Taxi Saudi Arabia on behalf of Arabian Eagle Eyes Trading Est.,
          our registered VAT billing partner, to confirm the service and payment details above. The official
          ZATCA-compliant tax invoice (with QR code) is issued by Arabian Eagle Eyes Trading Est. directly
          after payment is received.
        </Text>

        <View style={styles.closingBlock}>
          <Text style={styles.closingText}>Thank you for choosing Taxi Saudi Arabia for your corporate transportation needs.</Text>
          <Text style={styles.closingText}>Questions about this invoice? Reach our concierge desk directly.</Text>
          <Text style={styles.closingContact}>WhatsApp {contactConfig.primaryPhoneDisplay}</Text>
        </View>

        <View style={styles.footer}>
          <Text>Taxi Saudi Arabia — {contactConfig.primaryPhoneDisplay} — {contactConfig.email} — Billing partner: {EAGLE_EYES.nameEn}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderCorporateProformaPdf(d: CorporateProformaInput): Promise<Buffer> {
  return renderToBuffer(<CorporateProformaDocument d={d} />);
}
