import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const { nombre, telefono, email, mensaje } = await request.json();

    if (!nombre || !telefono || !email || !mensaje) {
      return NextResponse.json({ error: "Campos requeridos faltantes." }, { status: 400 });
    }

    const db = getAdminDb();
    await db.collection("contactos").add({
      nombre,
      telefono,
      email,
      mensaje,
      leido: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json({ error: "Error al guardar el mensaje." }, { status: 500 });
  }
}
