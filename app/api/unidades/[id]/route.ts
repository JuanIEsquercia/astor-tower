import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const db = getAdminDb();
    const doc = await db.collection("unidades").doc(id).get();
    if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate().toISOString(),
      updatedAt: doc.data()?.updatedAt?.toDate().toISOString(),
    });
  } catch (err) {
    console.error("[GET /api/unidades/[id]]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const db = getAdminDb();
    const body = await request.json();
    const { numero, piso, tipologiaId, tipologiaNombre, precio, estado, orientacion } = body;

    await db.collection("unidades").doc(id).update({
      numero,
      piso: Number(piso) || 0,
      tipologiaId,
      tipologiaNombre: tipologiaNombre ?? "",
      precio: precio ? Number(precio) : null,
      estado,
      orientacion,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PUT /api/unidades/[id]]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const db = getAdminDb();
    await db.collection("unidades").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/unidades/[id]]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
