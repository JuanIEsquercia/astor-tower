import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const db = getAdminDb();
    const doc = await db.collection("tipologias").doc(id).get();
    if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate().toISOString(),
      updatedAt: doc.data()?.updatedAt?.toDate().toISOString(),
    });
  } catch (err) {
    console.error("[GET /api/tipologias/[id]]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const db = getAdminDb();
    const body = await request.json();
    const { nombre, descripcion, m2, ambientes, banos, imagenes, iframePanorama, orden } = body;

    await db.collection("tipologias").doc(id).update({
      nombre,
      descripcion: descripcion ?? "",
      m2: Number(m2) || 0,
      ambientes: Number(ambientes) || 0,
      banos: Number(banos) || 0,
      imagenes: imagenes ?? [],
      iframePanorama: iframePanorama ?? "",
      ...(orden !== undefined && { orden }),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PUT /api/tipologias/[id]]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const db = getAdminDb();
    await db.collection("tipologias").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/tipologias/[id]]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
