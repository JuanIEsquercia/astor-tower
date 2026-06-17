import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("contactos").orderBy("createdAt", "desc").get();
    const items = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        nombre: data.nombre,
        telefono: data.telefono ?? "",
        email: data.email,
        mensaje: data.mensaje,
        leido: data.leido ?? false,
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
      };
    });
    return NextResponse.json(items);
  } catch (err) {
    console.error("[GET /api/contactos]", err);
    return NextResponse.json([], { status: 200 });
  }
}
