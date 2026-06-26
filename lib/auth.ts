import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    // 1. Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    
    // 2. Admin Login (Email/Password)
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Normalise: trim stray spaces/newlines (common when pasting env
        // vars into Vercel) and compare email case-insensitively.
        const inputEmail = credentials?.email?.trim().toLowerCase();
        const inputPass = credentials?.password?.trim();
        if (!inputEmail || !inputPass) return null;

        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD?.trim();

        // Distinct server-side logs so the REAL reason shows in Vercel logs
        // instead of the generic "Invalid email or password" on the client.
        if (!adminEmail || !adminPassword) {
          console.error("[admin-login] ADMIN_EMAIL / ADMIN_PASSWORD env vars are not set in this environment");
          return null;
        }
        if (inputEmail !== adminEmail || inputPass !== adminPassword) {
          console.warn(`[admin-login] credential mismatch for "${inputEmail}"`);
          return null;
        }

        // Env is the source of truth. Try to attach the real DB id, but
        // don't fail login if the row is missing — env match is enough.
        const user = await prisma.user.findUnique({ where: { email: adminEmail } });
        return {
          id: user?.id ?? "admin",
          name: user?.name ?? "Admin",
          email: adminEmail,
          role: "ADMIN",
          loyaltyPoints: user?.loyaltyPoints ?? 0,
        };
      }
    }),

    // 3. Customer OTP Login
    CredentialsProvider({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone Number", type: "text" },
        otp: { label: "OTP Code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) return null;
        
        const user = await prisma.user.findUnique({ where: { phone: credentials.phone } });
        
        if (!user || !user.otpCode || !user.otpExpires) return null;
        
        // Check if OTP matches and is not expired
        if (user.otpCode !== credentials.otp || new Date() > user.otpExpires) {
          return null; // Invalid or expired OTP
        }
        
        // Clear OTP after successful login
        await prisma.user.update({
          where: { id: user.id },
          data: { otpCode: null, otpExpires: null }
        });
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          loyaltyPoints: user.loyaltyPoints,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "CUSTOMER";
        token.loyaltyPoints = (user as { loyaltyPoints?: number }).loyaltyPoints || 0;
      }
      
      if (trigger === "update" && session) {
        token = { ...token, ...session.user };
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const customUser = session.user as { id?: string; role?: string; loyaltyPoints?: number };
        customUser.id = token.id as string;
        customUser.role = token.role as string;
        customUser.loyaltyPoints = token.loyaltyPoints as number;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  }
};
