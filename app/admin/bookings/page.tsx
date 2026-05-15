import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { getRecentBookings } from "@/lib/supabase/bookings";

export const metadata: Metadata = {
  title: "Admin Bookings | Riyadh Luxe Taxi",
  description: "Secure admin page for recent website bookings.",
  robots: {
    index: false,
    follow: false
  }
};

function parseAllowedEmails() {
  const raw = process.env.ADMIN_ALLOWED_EMAILS || "";
  return raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export default async function AdminBookingsPage() {
  const supabase = await getSupabaseAuthServerClient();
  if (!supabase) {
    return (
      <main className="min-h-screen bg-[#f8f8f6] px-6 py-16 text-[#121417]">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#e7e4db] bg-white p-8">
          <h1 className="text-2xl font-semibold">Auth setup required</h1>
          <p className="mt-3 text-sm text-[#49505a]">
            Set <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code> in <code>.env.local</code>.
          </p>
        </div>
      </main>
    );
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const allowedEmails = parseAllowedEmails();
  const currentEmail = user.email?.toLowerCase() || "";
  const authorized = allowedEmails.length === 0 || allowedEmails.includes(currentEmail);

  if (!authorized) {
    return (
      <main className="min-h-screen bg-[#f8f8f6] px-6 py-16 text-[#121417]">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8">
          <h1 className="text-2xl font-semibold">Access denied</h1>
          <p className="mt-3 text-sm text-[#49505a]">
            {user.email} is not in <code>ADMIN_ALLOWED_EMAILS</code>.
          </p>
          <form action="/auth/signout" method="post" className="mt-5">
            <button className="rounded-xl bg-[#121417] px-5 py-3 text-sm font-medium text-white">Sign out</button>
          </form>
        </div>
      </main>
    );
  }

  const { rows, error, configured } = await getRecentBookings(100);

  return (
    <main className="min-h-screen bg-[#f8f8f6] px-6 py-10 text-[#121417]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-2xl border border-[#e7e4db] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold">Recent Bookings</h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-full border border-[#e0ddd4] px-3 py-1">{user.email}</span>
              <form action="/auth/signout" method="post">
                <button className="rounded-full bg-[#121417] px-4 py-1.5 text-white">Sign out</button>
              </form>
            </div>
          </div>
          <p className="mt-2 text-sm text-[#49505a]">Secure admin view from Supabase ({rows.length} records).</p>
          <p className="mt-1 text-xs text-[#7c8088]">
            If this is your first login, create admin users in Supabase Auth and add emails in{" "}
            <code>ADMIN_ALLOWED_EMAILS</code>.
          </p>
          <p className="mt-1 text-xs text-[#7c8088]">
            Need help? <Link className="underline" href="/admin/login">Go to login page</Link>.
          </p>
        </div>

        {!configured && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
            Supabase is not configured. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
          </div>
        )}

        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>}

        <div className="overflow-x-auto rounded-2xl border border-[#e7e4db] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f2efe9] text-xs uppercase tracking-[0.08em] text-[#5f6470]">
              <tr>
                <th className="px-4 py-3">Booking ID</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Pax</th>
                <th className="px-4 py-3">Lang</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-[#7c8088]" colSpan={6}>
                    No bookings found yet.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-[#efede7]">
                  <td className="px-4 py-3 font-medium">{row.booking_id}</td>
                  <td className="px-4 py-3 text-[#49505a]">
                    <div>{row.pickup}</div>
                    <div className="text-xs text-[#7c8088]">to {row.dropoff}</div>
                  </td>
                  <td className="px-4 py-3 text-[#49505a]">
                    {row.travel_date} {row.travel_time}
                  </td>
                  <td className="px-4 py-3">{row.passengers}</td>
                  <td className="px-4 py-3 uppercase">{row.locale}</td>
                  <td className="px-4 py-3 text-[#7c8088]">{new Date(row.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
