import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";

const SESSION_DURATION_MS = 60 * 60 * 24 * 7 * 1000; // 7 días
const SESSION_DURATION_S  = 60 * 60 * 24 * 7;

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "Token requerido" }, { status: 400 });

    const sessionCookie = await getAdminAuth().createSessionCookie(token, {
      expiresIn: SESSION_DURATION_MS,
    });

    const cookieStore = await cookies();
    cookieStore.set("astor-auth", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_DURATION_S,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "No se pudo crear la sesión" }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("astor-auth");
  return NextResponse.json({ success: true });
}
