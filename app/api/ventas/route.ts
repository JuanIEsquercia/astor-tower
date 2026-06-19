import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().split("T")[0];
}

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("ventas").orderBy("createdAt", "desc").get();

    const ventas = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString(),
    }));

    return NextResponse.json(ventas);
  } catch (err) {
    console.error("[GET /api/ventas]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getAdminDb();
    const body = await request.json();

    const {
      compradorNombre,
      compradorApellido,
      compradorDni,
      compradorTelefono,
      compradorEmail,
      unidadId,
      unidadNumero,
      valorCierre,
      moneda,
      porcentajeEntrega,
      cantidadCuotas,
      cuotasActualizables,
      indiceActualizacion,
      fechaCierre,
    } = body;

    const montoEntrega = Math.round((valorCierre * porcentajeEntrega) / 100 * 100) / 100;
    const saldoCuotas = Math.round((valorCierre - montoEntrega) * 100) / 100;
    // Siempre se precarga el monto base (saldo/N). Para cuotas ajustables es una estimación
    // que el índice irá actualizando; para fijas es el monto definitivo.
    const montoBaseCuota = Math.round((saldoCuotas / cantidadCuotas) * 100) / 100;

    const batch = db.batch();

    const ventaRef = db.collection("ventas").doc();
    batch.set(ventaRef, {
      compradorNombre,
      compradorApellido,
      compradorDni,
      compradorTelefono,
      compradorEmail,
      unidadId,
      unidadNumero,
      valorCierre: Number(valorCierre),
      moneda,
      porcentajeEntrega: Number(porcentajeEntrega),
      montoEntrega,
      saldoCuotas,
      cantidadCuotas: Number(cantidadCuotas),
      cuotasActualizables: Boolean(cuotasActualizables),
      indiceActualizacion: cuotasActualizables ? (indiceActualizacion ?? null) : null,
      fechaCierre,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Generar cuotas: cuota i vence el mes (i+1) después del cierre
    for (let i = 1; i <= cantidadCuotas; i++) {
      const cuotaRef = ventaRef.collection("cuotas").doc();
      batch.set(cuotaRef, {
        ventaId: ventaRef.id,
        numeroCuota: i,
        fechaVencimiento: addMonths(fechaCierre, i + 1),
        monto: montoBaseCuota,
        estado: "pendiente",
        fechaPago: null,
        porcentajeAplicado: null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    // Marcar unidad como vendida
    const unidadRef = db.collection("unidades").doc(unidadId);
    batch.update(unidadRef, {
      estado: "vendida",
      updatedAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    return NextResponse.json({ id: ventaRef.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/ventas]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
