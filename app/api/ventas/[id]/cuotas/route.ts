import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const db = getAdminDb();
    const snapshot = await db
      .collection("ventas")
      .doc(id)
      .collection("cuotas")
      .orderBy("numeroCuota")
      .get();

    return NextResponse.json(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate().toISOString(),
      }))
    );
  } catch (err) {
    console.error("[GET /api/ventas/[id]/cuotas]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// Aplica un % de actualización a todas las cuotas pendientes de esta venta
export async function PATCH(request: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const { porcentaje } = await request.json();
    const db = getAdminDb();

    const snap = await db
      .collection("ventas")
      .doc(id)
      .collection("cuotas")
      .where("estado", "!=", "pagada")
      .get();

    const factor = 1 + Number(porcentaje) / 100;
    const batch = db.batch();
    let actualizadas = 0;

    for (const doc of snap.docs) {
      const monto = doc.data().monto;
      if (monto === null || monto === undefined) continue;
      batch.update(doc.ref, {
        monto: Math.round(monto * factor * 100) / 100,
        porcentajeAplicado: Number(porcentaje),
        updatedAt: FieldValue.serverTimestamp(),
      });
      actualizadas++;
    }

    await batch.commit();
    return NextResponse.json({ actualizadas });
  } catch (err) {
    console.error("[PATCH /api/ventas/[id]/cuotas]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
