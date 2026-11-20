import type { Metadata } from "next";
import { BlogIndexView } from "@/components/blog/BlogIndexView";
import { indexMetadata } from "@/components/blog/meta";

export const metadata: Metadata = indexMetadata(true);

export default function ArabicBlogIndexPage() {
  return <BlogIndexView locale="ar" />;
}
