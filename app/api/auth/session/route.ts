import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getAdminDb } from "@/lib/firebase-admin";

const SESSION_DURATION_S  = 60 * 60 * 24 * 7;        // 7 días en segundos
const SESSION_DURATION_MS = SESSION_DURATION_S * 1000; // 7 días en ms

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "Token requerido" }, { status: 400 });

    // Verifica el ID token via Firebase Identity Toolkit REST API (sin firebase-admin/auth)
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const verifyRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      }
    );

    if (!verifyRes.ok) {
      console.error("[POST /api/auth/session] Token inválido:", await verifyRes.text());
      return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }

    const { users } = await verifyRes.json();
    if (!users?.length) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 401 });
    }

    // Genera un token de sesión aleatorio y lo guarda en Firestore
    const sessionToken = randomBytes(32).toString("hex");
    const db = getAdminDb();
    await db.collection("sessions").doc(sessionToken).set({
      uid:       users[0].localId,
      email:     users[0].email ?? "",
      expiresAt: Date.now() + SESSION_DURATION_MS,
    });

    // Setea la cookie de sesión
    const cookieStore = await cookies();
    cookieStore.set("astor-auth", sessionToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge:   SESSION_DURATION_S,
      path:     "/",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/auth/session]", err);
    const msg = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("astor-auth")?.value;

  if (sessionToken) {
    const db = getAdminDb();
    await db.collection("sessions").doc(sessionToken).delete().catch(() => {});
  }

  cookieStore.delete("astor-auth");
  return NextResponse.json({ success: true });
}
