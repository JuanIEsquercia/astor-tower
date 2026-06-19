import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const db = getAdminDb();
    const doc = await db.collection("ventas").doc(id).get();
    if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate().toISOString(),
      updatedAt: doc.data()?.updatedAt?.toDate().toISOString(),
    });
  } catch (err) {
    console.error("[GET /api/ventas/[id]]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const db = getAdminDb();

    // Recuperar el unidadId antes de borrar para liberar la unidad
    const ventaDoc = await db.collection("ventas").doc(id).get();
    const unidadId = ventaDoc.data()?.unidadId;

    const batch = db.batch();

    // Borrar cuotas de la subcollection
    const cuotasSnap = await db.collection("ventas").doc(id).collection("cuotas").get();
    cuotasSnap.docs.forEach((d) => batch.delete(d.ref));

    // Borrar la venta
    batch.delete(db.collection("ventas").doc(id));

    // Devolver la unidad a disponible
    if (unidadId) {
      batch.update(db.collection("unidades").doc(unidadId), {
        estado: "disponible",
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/ventas/[id]]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
