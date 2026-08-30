import { Metadata } from "next";
import { BlogForm } from "../BlogForm";

export const metadata: Metadata = { title: "New Article | Admin Dashboard" };

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-[#F5F0E8]">New Article</h1>
      <BlogForm />
    </div>
  );
}
