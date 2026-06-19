import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("usuarios").orderBy("createdAt", "desc").get();

    return NextResponse.json(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate().toISOString(),
      }))
    );
  } catch (err) {
    console.error("[GET /api/usuarios]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = getAdminDb();
    const { email, nombre } = await req.json();

    if (!email || !nombre) {
      return NextResponse.json({ error: "Email y nombre son requeridos." }, { status: 400 });
    }

    const emailNorm = email.trim().toLowerCase();
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    // 1. Crear cuenta en Firebase Auth con contraseña temporal
    const createRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailNorm,
          password: randomBytes(16).toString("hex"),
          returnSecureToken: false,
        }),
      }
    );

    if (!createRes.ok) {
      const err = await createRes.json();
      const code = err?.error?.message ?? "";
      if (code === "EMAIL_EXISTS") {
        return NextResponse.json({ error: "Ya existe una cuenta con ese email en Firebase." }, { status: 409 });
      }
      console.error("[POST /api/usuarios] Firebase signUp error:", err);
      return NextResponse.json({ error: "No se pudo crear la cuenta. Verificá el email." }, { status: 400 });
    }

    // 2. Enviar email para que el usuario configure su propia contraseña
    await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestType: "PASSWORD_RESET", email: emailNorm }),
      }
    );

    // 3. Verificar que no esté ya en la whitelist
    const existing = await db.collection("usuarios").where("email", "==", emailNorm).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ error: "El usuario ya está registrado en el panel." }, { status: 409 });
    }

    // 4. Agregar a la whitelist
    const ref = await db.collection("usuarios").add({
      email: emailNorm,
      nombre: nombre.trim(),
      rol: "usuario",
      activo: true,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/usuarios]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
