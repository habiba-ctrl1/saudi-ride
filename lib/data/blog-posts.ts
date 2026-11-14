// Compatibility re-export. Blog content now lives one-file-per-post in
// lib/data/blog/ (split 2026-10-02). Import from "@/lib/data/blog" in new code.
import { BLOG_POSTS } from "./blog";

export const BLOG_POSTS_DATA = BLOG_POSTS;
