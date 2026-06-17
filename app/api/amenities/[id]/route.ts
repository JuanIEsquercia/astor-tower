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
    await db.collection("amenities").doc(id).update(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/amenities/[id]]", err);
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
    await db.collection("amenities").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/amenities/[id]]", err);
    return NextResponse.json({ error: "Error al eliminar." }, { status: 500 });
  }
}
