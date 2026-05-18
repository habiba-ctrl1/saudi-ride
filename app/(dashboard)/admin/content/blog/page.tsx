import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Plus, Eye, EyeOff, Edit, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog CMS | Admin Dashboard",
};

export const dynamic = 'force-dynamic';

export default async function AdminBlogCMSPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      {/* ─── HEADER ───────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">Blog CMS</h1>
          <p className="text-[#A1A1A6] mt-1 text-sm">{posts.length} articles in total.</p>
        </div>
        <Link 
          href="/admin/content/blog/new"
          className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-[#B8963B] transition-colors w-fit"
        >
          <Plus className="h-4 w-4" /> New Article
        </Link>
      </div>

      {/* ─── POSTS TABLE ──────────────────────────────────────────── */}
      <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-[#7C8088] mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-[#F5F0E8] mb-2">No Articles Yet</h3>
            <p className="text-sm text-[#A1A1A6]">Create your first blog post to start building SEO content.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] border-b border-[#C9A84C]/10 text-[0.65rem] uppercase tracking-widest text-[#7C8088]">
                  <th className="p-4 font-bold">Title</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold">Author</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Created</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A84C]/5">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#1A1A1A]/50 transition-colors">
                    <td className="p-4">
                      <div className="max-w-[300px]">
                        <p className="font-medium text-sm text-[#F5F0E8] truncate">{post.title}</p>
                        <p className="text-xs text-[#7C8088] truncate mt-0.5">/{post.slug}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-[0.55rem] font-bold uppercase tracking-wider bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20">
                        {post.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[#A1A1A6]">{post.author}</td>
                    <td className="p-4">
                      {post.published ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[0.55rem] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
                          <Eye className="h-3 w-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[0.55rem] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                          <EyeOff className="h-3 w-3" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-[#A1A1A6]">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg border border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
