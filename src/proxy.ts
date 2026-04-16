import { NextRequest, NextResponse } from "next/server";

// Public routes (no auth required)
const PUBLIC_PREFIXES = [
  "/",
  "/about",
  "/contact",
  "/legal",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

function isPublic(pathname: string) {
  // consider a route public if it equals the prefix or starts with "<prefix>/"
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accessToken = request.cookies.get("session_data")?.value ?? null;

  const onPublic = isPublic(pathname);

  // If no token:
  if (!accessToken) {
    // allow all public pages, including /verify-email/[id]
    if (onPublic) return NextResponse.next();

    // Store the attempted URL so you can redirect them back after login
    const loginUrl = new URL("/login", request.url);
    // This automatically handles special characters correctly
    loginUrl.searchParams.set("callbackUrl", search);

    // otherwise force sign-in
    return NextResponse.redirect(loginUrl);
  }

  // if (accessToken && pathname == "/") {
  //   // If logged in and trying to access public auth pages, send home (or dashboard)
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // If logged in and trying to access public auth pages, send home (or dashboard)
  if (onPublic && (pathname.startsWith("/login"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  // Add a header to prevent browser caching of sensitive pages
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}

// Broad matcher to cover all pages except Next internals, static assets, and API routes
export const config = {
  matcher: [
    '/dashboard',
    '/more',
    '/profile/:path*',
    '/service/:path*',

    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)).*)',
  ],
};

