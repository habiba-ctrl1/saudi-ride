import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createServerClient } from "@supabase/ssr";
import { AR_REAL_ROUTES, AR_REWRITE_ROUTES } from "@/lib/config/i18n";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isArabic = pathname === "/ar" || pathname.startsWith("/ar/");
  const strippedPath = isArabic ? (pathname === "/ar" ? "/" : pathname.slice(3)) : pathname;

  if (isArabic && !AR_REAL_ROUTES.includes(strippedPath) && !AR_REWRITE_ROUTES.includes(strippedPath)) {
    // No Arabic content for this path — send visitors to the English page
    // instead of serving an identical duplicate under /ar (was a big
    // duplicate-content signal across the whole site).
    return NextResponse.redirect(new URL(strippedPath, request.url), 301);
  }

  // None of the /ar-available routes are auth-protected, so the admin/customer
  // checks below only ever need to apply to plain (non-/ar) paths.
  const isAdminRoute = !isArabic && pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isCustomerRoute = !isArabic && (pathname.startsWith('/customer') || pathname.startsWith('/dashboard'));
  const isAdminApiRoute = !isArabic && pathname.startsWith('/api/admin');

  if (isAdminRoute || isCustomerRoute || isAdminApiRoute) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const loginUrl = isAdminRoute ? '/admin/login' : '/login';
      const url = new URL(loginUrl, request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    if ((isAdminRoute || isAdminApiRoute) && token.role !== 'ADMIN') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (isCustomerRoute && token.role !== 'CUSTOMER' && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Only the noindex utility pages still need an internal rewrite; the
  // indexable pages (AR_REAL_ROUTES) have real files under app/ar/*.
  let response: NextResponse;
  if (isArabic && AR_REWRITE_ROUTES.includes(strippedPath)) {
    const url = request.nextUrl.clone();
    url.pathname = strippedPath;
    response = NextResponse.rewrite(url);
  } else {
    response = NextResponse.next();
  }
  if (isArabic) {
    response.cookies.set("language", "ar", { maxAge: 60 * 60 * 24 * 365, path: "/" });
  }

  // Sync Supabase Session if client variables exist
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        }
      }
    });
    void supabase.auth.getUser();
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/api/admin/:path*"
  ],
};
