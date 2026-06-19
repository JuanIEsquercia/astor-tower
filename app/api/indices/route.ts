import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("indiceHistorial").orderBy("periodo", "desc").get();

    return NextResponse.json(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate().toISOString(),
      }))
    );
  } catch (err) {
    console.error("[GET /api/indices]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getAdminDb();
    const { periodo, porcentaje, indiceNombre } = await request.json();

    // Validar que no exista ya un registro para este período + índice
    const existing = await db
      .collection("indiceHistorial")
      .where("periodo", "==", periodo)
      .where("indiceNombre", "==", indiceNombre)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        { error: `Ya existe una actualización de ${indiceNombre} para ${periodo}.` },
        { status: 409 }
      );
    }

    const factor = 1 + Number(porcentaje) / 100;

    // Traer todas las ventas indexadas con este índice
    const ventasSnap = await db
      .collection("ventas")
      .where("cuotasActualizables", "==", true)
      .where("indiceActualizacion", "==", indiceNombre)
      .get();

    const batch = db.batch();
    let cuotasActualizadas = 0;

    for (const ventaDoc of ventasSnap.docs) {
      const cuotasSnap = await ventaDoc.ref
        .collection("cuotas")
        .where("estado", "!=", "pagada")
        .get();

      for (const cuotaDoc of cuotasSnap.docs) {
        const montoActual = cuotaDoc.data().monto;
        if (montoActual === null || montoActual === undefined) continue;

        batch.update(cuotaDoc.ref, {
          monto: Math.round(montoActual * factor * 100) / 100,
          porcentajeAplicado: Number(porcentaje),
          updatedAt: FieldValue.serverTimestamp(),
        });
        cuotasActualizadas++;
      }
    }

    // Registrar en el historial
    const histRef = db.collection("indiceHistorial").doc();
    batch.set(histRef, {
      periodo,
      porcentaje: Number(porcentaje),
      indiceNombre,
      cuotasActualizadas,
      createdAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    return NextResponse.json({ cuotasActualizadas }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/indices]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
