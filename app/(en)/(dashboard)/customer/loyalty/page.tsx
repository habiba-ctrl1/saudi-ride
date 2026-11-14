import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Award, Copy, CheckCircle2, Gift, Ticket, Share2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Loyalty Program | Customer Dashboard",
};

export default async function CustomerLoyaltyPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const points = (session.user as { loyaltyPoints?: number }).loyaltyPoints || 0;
  const discountValue = Math.floor(points / 100) * 10;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">VIP Rewards</h1>
        <p className="text-[#A1A1A6] mt-1 text-sm">Earn points on every trip and unlock exclusive benefits.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* POINTS BALANCE */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#C9A84C] to-[#B8963B] rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 opacity-20">
            <Award className="w-64 h-64" />
          </div>
          <div className="relative z-10 text-[#0A0A0A]">
            <h2 className="font-bold uppercase tracking-wider text-sm mb-6 flex items-center gap-2">
              <Award className="h-5 w-5" /> Current Balance
            </h2>
            <div className="mb-2">
              <span className="text-6xl font-heading font-bold">{points}</span>
              <span className="text-xl font-bold ml-2">PTS</span>
            </div>
            <p className="font-medium text-[#0A0A0A]/80 mb-8">
              Equivalent to <span className="font-bold">SAR {discountValue}</span> off your next ride.
            </p>
            <button className="bg-[#0A0A0A] text-[#C9A84C] px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#111] transition-colors shadow-lg">
              Redeem on Next Booking
            </button>
          </div>
        </div>

        {/* HOW TO EARN */}
        <div className="bg-[#111] border border-[#C9A84C]/20 rounded-3xl p-6">
          <h3 className="text-[#F5F0E8] font-heading font-bold text-lg mb-6 flex items-center gap-2">
            <Gift className="h-5 w-5 text-[#C9A84C]" /> How to Earn
          </h3>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
                <Ticket className="h-4 w-4 text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#F5F0E8]">Book Rides</p>
                <p className="text-xs text-[#A1A1A6] mt-1">Earn 1 point for every 1 SAR spent on any completed ride.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
                <Share2 className="h-4 w-4 text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#F5F0E8]">Refer Friends</p>
                <p className="text-xs text-[#A1A1A6] mt-1">Both you and your friend get 50 bonus points on their first trip.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* REFERRAL LINK */}
        <div className="bg-[#111] border border-[#C9A84C]/20 rounded-2xl p-6">
          <h3 className="text-[#F5F0E8] font-bold mb-2">Your Invite Link</h3>
          <p className="text-sm text-[#A1A1A6] mb-4">Share this link to give friends SAR 50 off their first premium ride.</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm text-[#C9A84C] font-mono truncate select-all">
              https://taxisaudiarabia.com/invite/{(session.user as { id?: string }).id?.substring(0, 8)}
            </div>
            <button className="bg-[#C9A84C]/10 text-[#C9A84C] hover:bg-[#C9A84C]/20 p-3 rounded-xl transition-colors">
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-[#111] border border-[#C9A84C]/20 rounded-2xl p-6">
          <h3 className="text-[#F5F0E8] font-bold mb-4 border-b border-[#C9A84C]/10 pb-2">Recent Activity</h3>
          {points === 0 ? (
            <p className="text-sm text-[#7C8088] italic text-center py-4">No points history yet.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-[#F5F0E8]">Airport Transfer</p>
                    <p className="text-xs text-[#7C8088]">Oct 15, 2023</p>
                  </div>
                </div>
                <div className="text-green-400 font-bold text-sm">+250 pts</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-[#F5F0E8]">Welcome Bonus</p>
                    <p className="text-xs text-[#7C8088]">Oct 10, 2023</p>
                  </div>
                </div>
                <div className="text-green-400 font-bold text-sm">+100 pts</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
