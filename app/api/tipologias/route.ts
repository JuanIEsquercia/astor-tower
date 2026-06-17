import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("tipologias").orderBy("orden").get();

    const tipologias = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString(),
    }));

    return NextResponse.json(tipologias);
  } catch (err) {
    console.error("[GET /api/tipologias]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getAdminDb();
    const body = await request.json();
    const { nombre, descripcion, m2, ambientes, banos, imagenes, iframePanorama } = body;

    const last = await db.collection("tipologias").orderBy("orden", "desc").limit(1).get();
    const maxOrden = last.empty ? 0 : (last.docs[0].data().orden ?? 0);

    const docRef = await db.collection("tipologias").add({
      nombre,
      descripcion: descripcion ?? "",
      m2: Number(m2) || 0,
      ambientes: Number(ambientes) || 0,
      banos: Number(banos) || 0,
      imagenes: imagenes ?? [],
      iframePanorama: iframePanorama ?? "",
      orden: maxOrden + 1,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/tipologias]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
