/** Convert rows to a CSV string (Excel-friendly, UTF-8 BOM included). */
export function toCsv<T extends Record<string, unknown>>(rows: T[], columns?: (keyof T & string)[]): string {
  if (rows.length === 0) return "";
  const cols = columns ?? (Object.keys(rows[0]) as (keyof T & string)[]);
  const escape = (v: unknown): string => {
    if (v === null || v === undefined) return "";
    const s = Array.isArray(v) ? v.join("; ") : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [cols.join(","), ...rows.map((r) => cols.map((c) => escape(r[c])).join(","))];
  return "﻿" + lines.join("\n");
}

/** Next.js route response helper: returns CSV as a downloadable file. */
export function csvResponse(csv: string, filename: string): Response {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
