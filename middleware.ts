import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas del admin accesibles solo por superadmin
const SUPERADMIN_PATHS = [
  "/admin/tipologias",
  "/admin/unidades",
  "/admin/amenities",
  "/admin/configuracion",
  "/admin/usuarios",
];

function isPublicApi(pathname: string, method: string): boolean {
  if (pathname.startsWith("/api/auth/")) return true;
  if (pathname === "/api/contact") return true;
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
  const rolCookie  = request.cookies.get("astor-role")?.value ?? "usuario";

  if (pathname.startsWith("/admin")) {
    const isLogin = pathname === "/admin/login";

    if (isLogin && authCookie) return NextResponse.redirect(new URL("/admin", request.url));
    if (!isLogin && !authCookie) return NextResponse.redirect(new URL("/admin/login", request.url));

    // Redirigir a dashboard si el rol no tiene acceso a la ruta
    if (!isLogin && authCookie && rolCookie !== "superadmin") {
      const restricted = SUPERADMIN_PATHS.some((p) => pathname.startsWith(p));
      if (restricted) return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    if (!isPublicApi(pathname, request.method) && !authCookie) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Proteger API de usuarios solo para superadmin
    if (pathname.startsWith("/api/usuarios") && rolCookie !== "superadmin") {
      return NextResponse.json({ error: "Acceso restringido." }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
