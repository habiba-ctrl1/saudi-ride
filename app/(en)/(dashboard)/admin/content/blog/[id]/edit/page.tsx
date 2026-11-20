import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogForm } from "../../BlogForm";

export const metadata: Metadata = { title: "Edit Article | Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-[#F5F0E8]">Edit Article</h1>
      <BlogForm
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          author: post.author,
          published: post.published,
        }}
      />
    </div>
  );
}
