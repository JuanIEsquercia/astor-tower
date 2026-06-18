import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("avance-obra").orderBy("fecha", "desc").get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(items);
  } catch (err) {
    console.error("[GET /api/avance-obra]", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const { titulo, descripcion, fecha, videoUrl } = await request.json();

    if (!titulo || !fecha) {
      return NextResponse.json({ error: "Título y fecha son requeridos." }, { status: 400 });
    }

    const db = getAdminDb();
    const ref = await db.collection("avance-obra").add({
      titulo,
      descripcion: descripcion ?? "",
      fecha,
      videoUrl: videoUrl ?? "",
      orden: Date.now(),
    });

    return NextResponse.json({ id: ref.id });
  } catch (err) {
    console.error("[POST /api/avance-obra]", err);
    return NextResponse.json({ error: "Error al guardar." }, { status: 500 });
  }
}
