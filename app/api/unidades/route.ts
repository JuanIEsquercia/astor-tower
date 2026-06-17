import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("unidades").orderBy("piso").get();

    const unidades = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString(),
    }));

    return NextResponse.json(unidades);
  } catch (err) {
    console.error("[GET /api/unidades]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getAdminDb();
    const body = await request.json();
    const { numero, piso, tipologiaId, tipologiaNombre, precio, estado, orientacion } = body;

    const docRef = await db.collection("unidades").add({
      numero,
      piso: Number(piso) || 0,
      tipologiaId,
      tipologiaNombre: tipologiaNombre ?? "",
      precio: precio ? Number(precio) : null,
      estado: estado ?? "disponible",
      orientacion,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/unidades]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
