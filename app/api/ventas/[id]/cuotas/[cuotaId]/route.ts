import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

type Ctx = { params: Promise<{ id: string; cuotaId: string }> };

export async function PUT(request: Request, { params }: Ctx) {
  try {
    const { id, cuotaId } = await params;
    const db = getAdminDb();
    const body = await request.json();
    const { monto, estado, fechaPago, porcentajeAplicado } = body;

    const updates: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (monto !== undefined) updates.monto = monto !== null ? Number(monto) : null;
    if (estado !== undefined) updates.estado = estado;
    if (fechaPago !== undefined) updates.fechaPago = fechaPago;
    if (porcentajeAplicado !== undefined) updates.porcentajeAplicado = porcentajeAplicado !== null ? Number(porcentajeAplicado) : null;

    await db
      .collection("ventas")
      .doc(id)
      .collection("cuotas")
      .doc(cuotaId)
      .update(updates);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PUT /api/ventas/[id]/cuotas/[cuotaId]]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
