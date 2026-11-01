"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function VendorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const r = await signIn("vendor-login", { email, password, redirect: false });
    setLoading(false);
    if (r?.error) setError("Invalid email or password.");
    else { router.push("/vendor"); router.refresh(); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-7 shadow-sm space-y-5">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">Vendor Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Rides, costs and payments</p>
        </div>
        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 text-center">{error}</div>}
        <label className="block space-y-1.5">
          <span className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</span>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" />
        </label>
        <label className="block space-y-1.5">
          <span className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</span>
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" />
        </label>
        <button type="submit" disabled={loading}
          className="w-full min-h-[44px] rounded-lg bg-green-600 text-white font-semibold text-sm hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
        </button>
      </form>
    </div>
  );
}
