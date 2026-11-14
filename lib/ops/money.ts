// SAR is the operating currency. PKR is shown ONLY next to revenue / cost / margin figures (owner request),
// converted with the rate stored in app_settings (key sar_to_pkr_rate) — never a hard-coded constant.
import { prisma } from "@/lib/prisma";

export async function getPkrRate(): Promise<number | null> {
  const r = await prisma.$queryRawUnsafe<{ value: string }[]>(`SELECT value FROM app_settings WHERE key='sar_to_pkr_rate'`);
  const n = r.length ? Number(r[0].value) : NaN;
  return Number.isFinite(n) && n > 0 ? n : null;
}
