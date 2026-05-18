"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Loader2, Phone } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/customer";

  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep("OTP");
      } else {
        setError(data.error || "Failed to send OTP. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent, autoSubmitOtp?: string) => {
    if (e) e.preventDefault();
    
    const code = autoSubmitOtp || otp;
    if (code.length !== 6) return;

    setError("");
    setLoading(true);

    const result = await signIn("phone-otp", {
      phone,
      otp: code,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid or expired OTP code.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleOtpChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6);
    setOtp(cleaned);
    if (cleaned.length === 6) {
      handleVerifyOtp(undefined, cleaned);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block font-heading text-2xl font-bold tracking-widest uppercase mb-6">
          Riyadh <span className="text-[#C9A84C]">Luxe</span>
        </Link>
        <h1 className="font-heading text-3xl font-bold text-[#F5F0E8] mb-2">Welcome Back</h1>
        <p className="text-sm text-[#A1A1A6]">Sign in to manage your luxury transport bookings.</p>
      </div>

      <div className="bg-[#111] border border-[#C9A84C]/20 rounded-2xl p-8 shadow-2xl">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 text-center mb-6">
            {error}
          </div>
        )}

        {/* GOOGLE OAUTH */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold uppercase tracking-wider text-xs py-4 rounded-xl hover:bg-gray-100 transition-colors mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[#C9A84C]/20"></div>
          <span className="text-xs text-[#A1A1A6] font-medium uppercase tracking-widest">OR</span>
          <div className="flex-1 h-px bg-[#C9A84C]/20"></div>
        </div>

        {/* OTP FLOW */}
        {step === "PHONE" ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-[#7C8088]" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl pl-11 pr-4 py-3 text-sm text-[#F5F0E8] focus:border-[#C9A84C] outline-none transition-colors"
                  placeholder="+966 50 123 4567"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !phone}
              className="w-full bg-[#C9A84C] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs py-4 rounded-xl hover:bg-[#B8963B] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2 text-center">
              <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Enter 6-Digit Code</label>
              <p className="text-xs text-[#7C8088] mb-4">Sent to {phone}</p>
              <input
                type="text"
                value={otp}
                onChange={(e) => handleOtpChange(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] text-[#C9A84C] font-mono focus:border-[#C9A84C] outline-none transition-colors"
                placeholder="••••••"
                maxLength={6}
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-[#C9A84C] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs py-4 rounded-xl hover:bg-[#B8963B] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</> : <><ShieldCheck className="h-4 w-4" /> Verify Code</>}
            </button>
            <button
              type="button"
              onClick={() => setStep("PHONE")}
              className="w-full text-xs text-[#A1A1A6] hover:text-[#C9A84C] transition-colors"
            >
              Use a different phone number
            </button>
          </form>
        )}
      </div>

      <p className="text-center text-xs text-[#7C8088] mt-8">
        By signing in, you agree to our <Link href="/terms" className="text-[#C9A84C] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#C9A84C] hover:underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div className="text-[#C9A84C] flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
