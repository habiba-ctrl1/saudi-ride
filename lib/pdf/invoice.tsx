import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { contactConfig } from "@/lib/config/contact";
import type { QuotationRow } from "@/lib/supabase/quotations";

const GOLD = "#C9A84C";
const DARK = "#0A0A0A";
const GRAY = "#49505a";

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, color: "#121417", fontFamily: "Helvetica" },
  header: { backgroundColor: DARK, padding: 20, marginBottom: 24, flexDirection: "row", justifyContent: "space-between" },
  brand: { color: GOLD, fontSize: 16, fontWeight: 700, letterSpacing: 2 },
  brandSub: { color: "#A1A1A6", fontSize: 8, marginTop: 4, letterSpacing: 1 },
  invoiceTitle: { color: "#fff", fontSize: 14, textAlign: "right" },
  invoiceRef: { color: GOLD, fontSize: 11, textAlign: "right", marginTop: 4 },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 9, color: GRAY, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  row: { flexDirection: "row", marginBottom: 4 },
  label: { width: 130, color: GRAY, fontWeight: 700 },
  value: { flex: 1 },
  table: { borderWidth: 1, borderColor: "#e5ddc9", borderRadius: 4 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#eee5d0", paddingVertical: 8, paddingHorizontal: 10 },
  tableRowLast: { borderBottomWidth: 0 },
  tableLabel: { flex: 3 },
  tableValue: { flex: 1, textAlign: "right" },
  totalRow: { flexDirection: "row", backgroundColor: "#faf7f0", paddingVertical: 10, paddingHorizontal: 10, marginTop: 8, borderRadius: 4 },
  totalLabel: { flex: 3, fontWeight: 700, fontSize: 12 },
  totalValue: { flex: 1, textAlign: "right", fontWeight: 700, fontSize: 12, color: GOLD },
  note: { fontSize: 9, color: GRAY, marginTop: 4 },
  footer: { position: "absolute", bottom: 24, left: 36, right: 36, borderTopWidth: 1, borderTopColor: "#eee5d0", paddingTop: 10, fontSize: 8, color: "#8a8577" },
});

function fmt(n: number, currency: string) {
  return `${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export function InvoiceDocument({ q }: { q: QuotationRow }) {
  const total = q.quoted_price ?? 0;
  const deposit = Math.round(total * 0.3 * 100) / 100;
  const balance = Math.round((total - deposit) * 100) / 100;
  const issuedDate = new Date(q.updated_at ?? q.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <Document title={`Invoice ${q.quote_reference}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>TAXI SAUDI ARABIA</Text>
            <Text style={styles.brandSub}>PREMIUM CHAUFFEUR NETWORK — KSA</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceRef}>{q.quote_reference}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billed To</Text>
          <View style={styles.row}><Text style={styles.label}>Name</Text><Text style={styles.value}>{q.customer_name}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Phone</Text><Text style={styles.value}>{q.customer_phone}</Text></View>
          {q.customer_email ? <View style={styles.row}><Text style={styles.label}>Email</Text><Text style={styles.value}>{q.customer_email}</Text></View> : null}
          <View style={styles.row}><Text style={styles.label}>Invoice date</Text><Text style={styles.value}>{issuedDate}</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          <View style={styles.row}><Text style={styles.label}>Pick-up</Text><Text style={styles.value}>{q.pickup_location}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Drop-off</Text><Text style={styles.value}>{q.drop_location}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Date &amp; time</Text><Text style={styles.value}>{q.trip_date}{q.trip_time ? ` — ${q.trip_time.slice(0, 5)}` : ""}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Passengers</Text><Text style={styles.value}>{q.passengers_count ?? "-"}</Text></View>
          {q.vehicle_type_requested ? <View style={styles.row}><Text style={styles.label}>Vehicle</Text><Text style={styles.value}>{q.vehicle_type_requested.toUpperCase()}</Text></View> : null}
          {q.luggage_notes ? <View style={styles.row}><Text style={styles.label}>Notes</Text><Text style={styles.value}>{q.luggage_notes}</Text></View> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Trip fare (all-inclusive)</Text>
              <Text style={styles.tableValue}>{fmt(total, q.currency)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Deposit due now (30%)</Text>
              <Text style={styles.tableValue}>{fmt(deposit, q.currency)}</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowLast]}>
              <Text style={styles.tableLabel}>Balance due on trip day (70%)</Text>
              <Text style={styles.tableValue}>{fmt(balance, q.currency)}</Text>
            </View>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{fmt(total, q.currency)}</Text>
          </View>
          <Text style={styles.note}>Deposit confirms and locks your booking. Balance is payable to the driver on the day of travel.</Text>
        </View>

        <View style={styles.footer}>
          <Text>Taxi Saudi Arabia — {contactConfig.primaryPhoneDisplay} — {contactConfig.email}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderInvoicePdf(q: QuotationRow): Promise<Buffer> {
  return renderToBuffer(<InvoiceDocument q={q} />);
}
