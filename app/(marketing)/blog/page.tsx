import { db } from "@/lib/db";
import BlogClient from "./BlogClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Guides & KSA Insider Tips | Riyadh Luxe Taxi Blog",
  description: "Expert insights, travel guides, and tips for your journey across Saudi Arabia. Read about Umrah, NEOM, AlUla, and premium transport.",
};

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24">
      <BlogClient initialPosts={posts} />
    </main>
  );
}
