import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isPublicApi(pathname: string, method: string): boolean {
  // Auth endpoints (login/logout)
  if (pathname.startsWith("/api/auth/")) return true;
  // Public contact form
  if (pathname === "/api/contact") return true;
  // Public read-only routes used by the landing page
  if (method === "GET") {
    if (pathname.startsWith("/api/tipologias")) return true;
    if (pathname.startsWith("/api/amenities")) return true;
    if (pathname === "/api/config") return true;
    if (pathname.startsWith("/api/unidades")) return true;
  }
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get("astor-auth");

  if (pathname.startsWith("/admin")) {
    const isLogin = pathname === "/admin/login";
    if (isLogin && authCookie) return NextResponse.redirect(new URL("/admin", request.url));
    if (!isLogin && !authCookie) return NextResponse.redirect(new URL("/admin/login", request.url));
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    if (!isPublicApi(pathname, request.method) && !authCookie) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
