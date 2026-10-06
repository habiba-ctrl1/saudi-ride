import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { exportRows, resolvePeriod } from "@/lib/ops/reports";

// GET /api/admin/reports/export?period=month|last_month|90d|year|all|custom&from=&to= — bookings CSV for accounting (SAR, plus margin).
export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const sp = new URL(request.url).searchParams;
  const period = resolvePeriod(sp.get("period") ?? undefined, sp.get("from") ?? undefined, sp.get("to") ?? undefined);
  const rows = await exportRows(period);
  const cols = rows.length ? Object.keys(rows[0]) : ["ref"];
  // CSV-injection safe: values starting with = + - @ are prefixed with an apostrophe
  const cell = (v: unknown) => {
    let t = v == null ? "" : String(v);
    if (/^[=+\-@]/.test(t) && !/^[+-]?\d+(\.\d+)?$/.test(t) && !t.startsWith("+966") && !t.startsWith("+")) t = `'${t}`;
    return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
  };
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n");
  return new NextResponse("﻿" + csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="tsa-bookings-${period.key}.csv"` },
  });
}
