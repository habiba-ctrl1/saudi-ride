import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let locale = "";
  let strippedPath = pathname;

  if (pathname.startsWith('/ar/') || pathname === '/ar') {
    locale = "ar";
    strippedPath = pathname.substring(3) || "/";
  }

  // Check protected routes with NextAuth using the stripped pathname
  const isAdminRoute = strippedPath.startsWith('/admin') && strippedPath !== '/admin/login';
  const isCustomerRoute = strippedPath.startsWith('/customer') || strippedPath.startsWith('/dashboard');
  const isAdminApiRoute = strippedPath.startsWith('/api/admin');

  if (isAdminRoute || isCustomerRoute || isAdminApiRoute) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      if (strippedPath.startsWith('/api/')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      const loginUrl = isAdminRoute 
        ? '/admin/login' 
        : (locale ? `/${locale}/login` : '/login');
      const url = new URL(loginUrl, request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
    
    if ((isAdminRoute || isAdminApiRoute) && token.role !== 'ADMIN') {
      if (strippedPath.startsWith('/api/')) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL(locale ? `/${locale}` : '/', request.url));
    }
    
    if (isCustomerRoute && token.role !== 'CUSTOMER' && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL(locale ? `/${locale}` : '/', request.url));
    }
  }

  // Generate appropriate response (rewrite for localized routes, next for standard routes)
  let response: NextResponse;
  if (locale) {
    const url = request.nextUrl.clone();
    url.pathname = strippedPath;
    response = NextResponse.rewrite(url);
    response.cookies.set("language", locale, { maxAge: 60 * 60 * 24 * 365, path: "/" });
  } else {
    response = NextResponse.next();
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
