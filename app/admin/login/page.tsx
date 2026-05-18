"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 mb-6">
            <ShieldCheck className="h-8 w-8 text-[#C9A84C]" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-[#F5F0E8] mb-2">Admin Access</h1>
          <p className="text-sm text-[#A1A1A6]">Sign in to the Riyadh Luxe management dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111] border border-[#C9A84C]/20 rounded-2xl p-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-sm text-[#F5F0E8] focus:border-[#C9A84C] outline-none transition-colors"
              placeholder="admin@riyadhluxe.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-sm text-[#F5F0E8] focus:border-[#C9A84C] outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A84C] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs py-4 rounded-xl hover:bg-[#B8963B] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Authenticating...</> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-[#7C8088] mt-6">
          Protected area. Unauthorized access is monitored.
        </p>
      </div>
    </div>
  );
}
