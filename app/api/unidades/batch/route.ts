import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const items = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Lista vacía." }, { status: 400 });
    }

    const db = getAdminDb();
    const batch = db.batch();

    for (const item of items) {
      const ref = db.collection("unidades").doc();
      batch.set(ref, {
        ...item,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();

    return NextResponse.json({ count: items.length });
  } catch (err) {
    console.error("[POST /api/unidades/batch]", err);
    return NextResponse.json({ error: "Error al guardar el lote." }, { status: 500 });
  }
}
