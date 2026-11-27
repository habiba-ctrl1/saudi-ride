import type { Metadata } from "next";
import { BlogIndexView } from "@/components/blog/BlogIndexView";
import { indexMetadata } from "@/components/blog/meta";

export const metadata: Metadata = indexMetadata(false);

export default function BlogIndexPage() {
  return <BlogIndexView locale="en" />;
}
