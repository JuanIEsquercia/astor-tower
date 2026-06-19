import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getAdminDb } from "@/lib/firebase-admin";

const SESSION_DURATION_S  = 60 * 60 * 24 * 7;
const SESSION_DURATION_MS = SESSION_DURATION_S * 1000;

const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL ?? "jiesquercia@gmail.com";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "Token requerido" }, { status: 400 });

    // Verifica el ID token via Firebase Identity Toolkit REST API
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

    const { localId: uid, email = "" } = users[0];

    // Determinar rol
    let rol = "superadmin";

    if (email !== SUPERADMIN_EMAIL) {
      // Buscar en la whitelist de usuarios habilitados
      const db = getAdminDb();
      const snap = await db
        .collection("usuarios")
        .where("email", "==", email)
        .where("activo", "==", true)
        .limit(1)
        .get();

      if (snap.empty) {
        return NextResponse.json(
          { error: "No tenés acceso al panel. Contactá al administrador." },
          { status: 403 }
        );
      }

      rol = snap.docs[0].data().rol ?? "usuario";
    }

    // Crea sesión en Firestore
    const sessionToken = randomBytes(32).toString("hex");
    const db = getAdminDb();
    await db.collection("sessions").doc(sessionToken).set({
      uid,
      email,
      rol,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    });

    // Setea cookies
    const cookieStore = await cookies();
    const cookieOpts = {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge:   SESSION_DURATION_S,
      path:     "/",
    };
    cookieStore.set("astor-auth", sessionToken, cookieOpts);
    cookieStore.set("astor-role", rol, cookieOpts);

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
  cookieStore.delete("astor-role");
  return NextResponse.json({ success: true });
}
