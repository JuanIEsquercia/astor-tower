import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("desarrolladores").orderBy("orden").get();
    const items = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        nombre: data.nombre ?? "",
        logoUrl: data.logoUrl ?? "",
        orden: data.orden ?? 0,
      };
    });
    return NextResponse.json(items);
  } catch (err) {
    console.error("[GET /api/desarrolladores]", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, logoUrl, orden } = await request.json();

    if (!nombre) {
      return NextResponse.json({ error: "El nombre es requerido." }, { status: 400 });
    }

    const db = getAdminDb();
    const ref = await db.collection("desarrolladores").add({
      nombre,
      logoUrl: logoUrl ?? "",
      orden: orden ?? 0,
    });

    return NextResponse.json({ id: ref.id });
  } catch (err) {
    console.error("[POST /api/desarrolladores]", err);
    return NextResponse.json({ error: "Error al guardar." }, { status: 500 });
  }
}
