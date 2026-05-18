"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import { BlogPost } from "@prisma/client";

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const POSTS_PER_PAGE = 6;

export default function BlogClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Derive categories from posts
  const categories = useMemo(() => {
    const cats = Array.from(new Set(initialPosts.map((p) => p.category)));
    return ["All", ...cats.sort()];
  }, [initialPosts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => 
      activeCategory === "All" || post.category === activeCategory
    );
  }, [initialPosts, activeCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE, 
    currentPage * POSTS_PER_PAGE
  );

  const popularPosts = initialPosts.slice(0, 3); // Mocking popular posts

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/6 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />

        <div className="section-container relative z-10 max-w-7xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-6">
              Our Journal
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
              Travel Guides & <br />
              <span className="text-[#C9A84C]">KSA Insider Tips</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-[#A1A1A6]">
              Expert advice on navigating Saudi Arabia. From Umrah transportation guides to uncovering the heritage of AlUla, stay informed for your journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── CATEGORY FILTER ──────────────────────────────────────── */}
      <section className="sticky top-[72px] z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#C9A84C]/10 py-4">
        <div className="section-container max-w-7xl">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentPage(1);
                }}
                className={`shrink-0 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? "bg-[#C9A84C] text-[#0A0A0A] shadow-[0_4px_14px_rgba(201,168,76,0.3)]"
                    : "border border-[#C9A84C]/20 text-[#A1A1A6] hover:border-[#C9A84C]/50 hover:text-[#F5F0E8]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────── */}
      <section className="section-container max-w-7xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* LEFT: Blog Grid */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${currentPage}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
              >
                {paginatedPosts.length === 0 ? (
                  <p className="text-[#A1A1A6] col-span-full">No articles found in this category.</p>
                ) : (
                  paginatedPosts.map((post, idx) => (
                    <Link href={`/blog/${post.slug}`} key={post.id}>
                      <motion.article 
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={fadeUp}
                        transition={{ duration: 0.4, delay: (idx % 6) * 0.07 }}
                        className="group flex flex-col h-full rounded-3xl border border-[#C9A84C]/12 bg-[#111] overflow-hidden hover:border-[#C9A84C]/40 transition-all duration-300"
                      >
                        <div className="relative h-56 w-full overflow-hidden">
                          {post.coverImage && (
                            <Image 
                              src={post.coverImage} 
                              alt={post.title} 
                              fill 
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="rounded-full bg-[#111]/80 backdrop-blur-md px-3 py-1 text-[0.55rem] font-bold uppercase tracking-wider text-[#C9A84C] border border-[#C9A84C]/20">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col flex-1 p-6">
                          <h2 className="font-heading text-xl font-bold leading-tight text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors mb-3 line-clamp-2">
                            {post.title}
                          </h2>
                          <p className="text-xs text-[#A1A1A6] leading-relaxed line-clamp-3 mb-6 flex-1">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-[#C9A84C]/10 mt-auto">
                            <div className="flex items-center gap-2 text-[0.6rem] text-[#7C8088] uppercase font-bold tracking-wider">
                              <Calendar className="h-3 w-3" />
                              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                            </div>
                            <div className="bg-[#C9A84C]/10 rounded-full p-2 group-hover:bg-[#C9A84C] group-hover:text-[#0A0A0A] transition-colors">
                              <ArrowRight className="h-3.5 w-3.5 text-[#C9A84C] group-hover:text-[#0A0A0A]" />
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    </Link>
                  ))
                )}
              </motion.div>
            </AnimatePresence>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-16">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-2 rounded-full border border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm font-bold text-[#A1A1A6]">
                  Page <span className="text-[#F5F0E8]">{currentPage}</span> of {totalPages}
                </span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-full border border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <aside className="lg:col-span-1 space-y-10">
            {/* Newsletter */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#C9A84C]/30 rounded-3xl p-6">
              <h3 className="font-heading text-xl font-bold mb-2">Join the Circle</h3>
              <p className="text-xs text-[#A1A1A6] mb-6 leading-relaxed">
                Get exclusive travel tips and priority booking access delivered to your inbox.
              </p>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-full px-5 py-3 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C] transition-colors"
                />
                <button className="w-full bg-[#C9A84C] text-[#0A0A0A] font-bold uppercase tracking-wider text-[0.65rem] rounded-full py-3 hover:bg-[#B8963B] transition-colors">
                  Subscribe
                </button>
              </form>
            </div>

            {/* Popular Posts */}
            <div className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-6">
              <h3 className="font-heading text-lg font-bold mb-6">Popular Articles</h3>
              <div className="space-y-5">
                {popularPosts.map((post) => (
                  <Link href={`/blog/${post.slug}`} key={`pop-${post.id}`} className="group flex gap-4 items-center">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0">
                      {post.coverImage && <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#F5F0E8] group-hover:text-[#C9A84C] line-clamp-2 transition-colors mb-1">{post.title}</h4>
                      <p className="text-[0.55rem] text-[#7C8088] uppercase tracking-wider">{post.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories List */}
            <div className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-6">
              <h3 className="font-heading text-lg font-bold mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.filter(c => c !== "All").map(cat => (
                  <li key={`list-${cat}`}>
                    <button 
                      onClick={() => { setActiveCategory(cat); setCurrentPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="flex items-center justify-between w-full text-left text-sm text-[#A1A1A6] hover:text-[#C9A84C] transition-colors py-2 border-b border-[#C9A84C]/10 last:border-0"
                    >
                      <span>{cat}</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

        </div>
      </section>
    </>
  );
}
