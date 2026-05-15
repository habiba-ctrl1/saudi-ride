"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseAuthBrowserClient } from "@/lib/supabase/auth-browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const supabase = getSupabaseAuthBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/admin/bookings");
      router.refresh();
    } catch {
      setError("Unable to sign in. Please check your configuration.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f8f6] px-6 py-16 text-[#121417]">
      <div className="mx-auto max-w-md rounded-2xl border border-[#e7e4db] bg-white p-8">
        <h1 className="text-2xl font-semibold">Admin Sign In</h1>
        <p className="mt-2 text-sm text-[#49505a]">Use your Supabase Auth credentials.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@email.com"
            className="w-full rounded-xl border border-[#d8dde3] px-4 py-3 text-sm outline-none focus:border-[#c7a66b]"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-[#d8dde3] px-4 py-3 text-sm outline-none focus:border-[#c7a66b]"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#121417] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1b1f24] disabled:opacity-70"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
