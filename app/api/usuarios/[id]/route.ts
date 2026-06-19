import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const db = getAdminDb();
    const { activo } = await req.json();

    await db.collection("usuarios").doc(id).update({ activo: Boolean(activo) });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/usuarios/[id]]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const db = getAdminDb();
    await db.collection("usuarios").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/usuarios/[id]]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
