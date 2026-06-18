import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getAdminDb();
    await db.collection("avance-obra").doc(id).update(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/avance-obra/[id]]", err);
    return NextResponse.json({ error: "Error al actualizar." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getAdminDb();
    await db.collection("avance-obra").doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/avance-obra/[id]]", err);
    return NextResponse.json({ error: "Error al eliminar." }, { status: 500 });
  }
}
