import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("amenities").orderBy("orden").get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(items);
  } catch (err) {
    console.error("[GET /api/amenities]", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const { titulo, descripcion, imagenUrl, orden } = await request.json();

    if (!titulo) {
      return NextResponse.json({ error: "El título es requerido." }, { status: 400 });
    }

    const db = getAdminDb();
    const ref = await db.collection("amenities").add({
      titulo,
      descripcion: descripcion ?? "",
      imagenUrl: imagenUrl ?? "",
      orden: orden ?? 0,
    });

    return NextResponse.json({ id: ref.id });
  } catch (err) {
    console.error("[POST /api/amenities]", err);
    return NextResponse.json({ error: "Error al guardar." }, { status: 500 });
  }
}
