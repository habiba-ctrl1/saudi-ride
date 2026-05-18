import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Save } from "lucide-react";

export const metadata: Metadata = {
  title: "My Profile | Customer Dashboard",
};

export default async function CustomerProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: (session.user as { id?: string }).id },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">My Profile</h1>
        <p className="text-[#A1A1A6] mt-1 text-sm">Update your personal details and booking preferences.</p>
      </div>

      <div className="bg-[#111] border border-[#C9A84C]/20 rounded-2xl p-6 md:p-8">
        <form className="space-y-8">
          
          {/* PERSONAL DETAILS */}
          <div className="space-y-6">
            <h2 className="text-[#C9A84C] font-bold uppercase tracking-wider text-sm border-b border-[#C9A84C]/10 pb-2">Personal Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={user.name || ""} 
                  className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-sm text-[#F5F0E8] focus:border-[#C9A84C] outline-none transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Phone Number</label>
                <input 
                  type="tel" 
                  defaultValue={user.phone || ""} 
                  className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-sm text-[#F5F0E8] focus:border-[#C9A84C] outline-none transition-colors" 
                  readOnly
                />
                <p className="text-[0.65rem] text-[#7C8088]">Phone numbers cannot be changed directly as they act as your ID.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user.email || ""} 
                  className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-sm text-[#F5F0E8] focus:border-[#C9A84C] outline-none transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Nationality</label>
                <input 
                  type="text" 
                  defaultValue={user.nationality || ""} 
                  className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-sm text-[#F5F0E8] focus:border-[#C9A84C] outline-none transition-colors" 
                  placeholder="e.g. Saudi Arabia"
                />
              </div>
            </div>
          </div>

          {/* PREFERENCES */}
          <div className="space-y-6">
            <h2 className="text-[#C9A84C] font-bold uppercase tracking-wider text-sm border-b border-[#C9A84C]/10 pb-2">Preferences</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Preferred Language</label>
                <select 
                  defaultValue={user.preferredLang} 
                  className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-sm text-[#F5F0E8] focus:border-[#C9A84C] outline-none transition-colors appearance-none"
                >
                  <option value="EN">English</option>
                  <option value="AR">Arabic (العربية)</option>
                  <option value="UR">Urdu (اردو)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Preferred Vehicle Type</label>
                <select 
                  defaultValue="LUXURY" 
                  className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-sm text-[#F5F0E8] focus:border-[#C9A84C] outline-none transition-colors appearance-none"
                >
                  <option value="SEDAN">Business Sedan</option>
                  <option value="LUXURY">Luxury Sedan (S-Class)</option>
                  <option value="SUV">Luxury SUV</option>
                  <option value="VAN">Family Van</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider block">Notification Preferences</label>
              
              <div className="flex items-center gap-3">
                <input type="checkbox" id="sms" className="w-4 h-4 accent-[#C9A84C]" defaultChecked />
                <label htmlFor="sms" className="text-sm text-[#F5F0E8]">SMS updates for bookings and driver arrival</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="email" className="w-4 h-4 accent-[#C9A84C]" defaultChecked />
                <label htmlFor="email" className="text-sm text-[#F5F0E8]">Email receipts and loyalty program updates</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="marketing" className="w-4 h-4 accent-[#C9A84C]" />
                <label htmlFor="marketing" className="text-sm text-[#F5F0E8]">Promotional offers and luxury travel news</label>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="button" className="bg-[#C9A84C] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded-xl hover:bg-[#B8963B] transition-colors flex items-center gap-2">
              <Save className="h-4 w-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
