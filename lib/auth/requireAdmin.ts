import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type AdminAuthResult =
  | { ok: true; email: string }
  | { ok: false; status: 401 | 403; error: string };

/**
 * Server-side, authoritative admin check — the caller must actually branch
 * on the result and return early on failure. Shared by every /api/admin/**
 * route so the check can't quietly regress into a no-op again (several
 * routes previously logged a role check but never enforced it, relying
 * solely on middleware.ts as the only real gate).
 */
export async function requireAdmin(): Promise<AdminAuthResult> {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string; email?: string } | undefined;
  if (!user) return { ok: false, status: 401, error: "Unauthorized" };
  if (user.role !== "ADMIN") return { ok: false, status: 403, error: "Forbidden" };
  return { ok: true, email: user.email ?? "admin" };
}
