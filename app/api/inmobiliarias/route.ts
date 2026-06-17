import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("inmobiliarias").orderBy("orden").get();
    const items = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        nombre: data.nombre ?? "",
        logoUrl: data.logoUrl ?? "",
        telefono: data.telefono ?? "",
        orden: data.orden ?? 0,
        activa: data.activa ?? true,
      };
    });
    return NextResponse.json(items);
  } catch (err) {
    console.error("[GET /api/inmobiliarias]", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, logoUrl, telefono, orden, activa } = await request.json();

    if (!nombre || !telefono) {
      return NextResponse.json({ error: "Nombre y teléfono son requeridos." }, { status: 400 });
    }

    const db = getAdminDb();
    const ref = await db.collection("inmobiliarias").add({
      nombre,
      logoUrl: logoUrl ?? "",
      telefono,
      orden: orden ?? 0,
      activa: activa ?? true,
    });

    return NextResponse.json({ id: ref.id });
  } catch (err) {
    console.error("[POST /api/inmobiliarias]", err);
    return NextResponse.json({ error: "Error al guardar." }, { status: 500 });
  }
}
