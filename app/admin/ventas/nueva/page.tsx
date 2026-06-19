"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import type { Unidad } from "@/lib/types";

const INDICES = ["CAC", "IPC", "UVA", "Dólar oficial", "Otro"] as const;

interface FormState {
  compradorNombre: string;
  compradorApellido: string;
  compradorDni: string;
  compradorTelefono: string;
  compradorEmail: string;
  unidadId: string;
  valorCierre: string;
  moneda: "USD" | "ARS";
  porcentajeEntrega: string;
  cantidadCuotas: string;
  cuotasActualizables: boolean;
  indiceActualizacion: string;
  indiceOtro: string;
  fechaCierre: string;
}

const EMPTY: FormState = {
  compradorNombre: "",
  compradorApellido: "",
  compradorDni: "",
  compradorTelefono: "",
  compradorEmail: "",
  unidadId: "",
  valorCierre: "",
  moneda: "USD",
  porcentajeEntrega: "",
  cantidadCuotas: "",
  cuotasActualizables: false,
  indiceActualizacion: "CAC",
  indiceOtro: "",
  fechaCierre: new Date().toISOString().split("T")[0],
};

export default function NuevaVentaPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/unidades")
      .then((r) => r.json())
      .then((all: Unidad[]) => setUnidades(all.filter((u) => u.estado === "disponible")));
  }, []);

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }) as FormState);

  const montoEntrega =
    form.valorCierre && form.porcentajeEntrega
      ? (Number(form.valorCierre) * Number(form.porcentajeEntrega)) / 100
      : null;

  const saldo =
    montoEntrega !== null && form.valorCierre
      ? Number(form.valorCierre) - montoEntrega
      : null;

  const cuotaBase =
    saldo !== null && form.cantidadCuotas && !form.cuotasActualizables
      ? saldo / Number(form.cantidadCuotas)
      : null;

  const indiceEfectivo =
    form.cuotasActualizables
      ? form.indiceActualizacion === "Otro"
        ? form.indiceOtro
        : form.indiceActualizacion
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.unidadId) { setError("Seleccioná una unidad."); return; }
    setSaving(true);
    setError("");

    const unidad = unidades.find((u) => u.id === form.unidadId);

    const res = await fetch("/api/ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        compradorNombre: form.compradorNombre,
        compradorApellido: form.compradorApellido,
        compradorDni: form.compradorDni,
        compradorTelefono: form.compradorTelefono,
        compradorEmail: form.compradorEmail,
        unidadId: form.unidadId,
        unidadNumero: unidad ? `${unidad.piso}° ${unidad.numero}` : "",
        valorCierre: Number(form.valorCierre),
        moneda: form.moneda,
        porcentajeEntrega: Number(form.porcentajeEntrega),
        cantidadCuotas: Number(form.cantidadCuotas),
        cuotasActualizables: form.cuotasActualizables,
        indiceActualizacion: indiceEfectivo,
        fechaCierre: form.fechaCierre,
      }),
    });

    if (!res.ok) {
      setError("Error al guardar. Intente nuevamente.");
      setSaving(false);
      return;
    }

    const { id } = await res.json();
    router.push(`/admin/ventas/${id}`);
  };

  const fmt = (n: number) =>
    n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="p-8 max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/ventas" className="admin-btn-ghost p-2">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p className="text-xs text-zinc-400">Ventas</p>
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">Registrar venta</h1>
          </div>
        </div>
        <button form="venta-form" type="submit" disabled={saving} className="admin-btn-primary">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Guardando..." : "Guardar y generar plan"}
        </button>
      </div>

      <form id="venta-form" onSubmit={handleSubmit} className="space-y-5">
        {/* Titular */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Titular de la compra</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">Nombre <span className="text-red-400">*</span></label>
              <input className="admin-input" value={form.compradorNombre} onChange={set("compradorNombre")} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">Apellido <span className="text-red-400">*</span></label>
              <input className="admin-input" value={form.compradorApellido} onChange={set("compradorApellido")} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">DNI <span className="text-red-400">*</span></label>
              <input className="admin-input" value={form.compradorDni} onChange={set("compradorDni")} placeholder="12345678" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">Teléfono</label>
              <input className="admin-input" value={form.compradorTelefono} onChange={set("compradorTelefono")} placeholder="+54 9 379..." />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">Email</label>
            <input type="email" className="admin-input" value={form.compradorEmail} onChange={set("compradorEmail")} />
          </div>
        </div>

        {/* Unidad */}
        <div className="admin-card p-6 space-y-4">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Unidad</h2>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">Unidad disponible <span className="text-red-400">*</span></label>
            <select className="admin-input" value={form.unidadId} onChange={set("unidadId")} required>
              <option value="" disabled>Seleccionar unidad...</option>
              {unidades.map((u) => (
                <option key={u.id} value={u.id}>
                  Piso {u.piso} - {u.numero} — {u.tipologiaNombre}
                  {u.precio ? ` · USD ${u.precio.toLocaleString("es-AR")}` : ""}
                </option>
              ))}
            </select>
            {unidades.length === 0 && (
              <p className="text-xs text-amber-600 mt-1.5">No hay unidades disponibles.</p>
            )}
          </div>
        </div>

        {/* Operación */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Condiciones de la operación</h2>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">Fecha de cierre (boleto) <span className="text-red-400">*</span></label>
            <input type="date" className="admin-input" value={form.fechaCierre} onChange={set("fechaCierre")} required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">Valor de cierre <span className="text-red-400">*</span></label>
              <input type="number" min="0" step="any" className="admin-input" value={form.valorCierre} onChange={set("valorCierre")} placeholder="0" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">Moneda <span className="text-red-400">*</span></label>
              <select className="admin-input" value={form.moneda} onChange={set("moneda")}>
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">% de entrega <span className="text-red-400">*</span></label>
              <input type="number" min="0" max="100" step="any" className="admin-input" value={form.porcentajeEntrega} onChange={set("porcentajeEntrega")} placeholder="30" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">Cantidad de cuotas <span className="text-red-400">*</span></label>
              <input type="number" min="1" step="1" className="admin-input" value={form.cantidadCuotas} onChange={set("cantidadCuotas")} placeholder="36" required />
            </div>
          </div>

          {/* Resumen calculado */}
          {montoEntrega !== null && saldo !== null && (
            <div className="bg-zinc-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Entrega ({form.porcentajeEntrega}%)</span>
                <span className="font-medium text-zinc-900">{form.moneda} {fmt(montoEntrega)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Saldo en cuotas</span>
                <span className="font-medium text-zinc-900">{form.moneda} {fmt(saldo)}</span>
              </div>
              {cuotaBase !== null && (
                <div className="flex justify-between text-zinc-500 border-t border-zinc-200 pt-2 mt-1">
                  <span>Cuota base ({form.cantidadCuotas} cuotas)</span>
                  <span>{form.moneda} {fmt(cuotaBase)}</span>
                </div>
              )}
            </div>
          )}

          {/* Actualización */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-zinc-300 accent-zinc-900"
                checked={form.cuotasActualizables}
                onChange={(e) => setForm((f) => ({ ...f, cuotasActualizables: e.target.checked }))}
              />
              <span className="text-sm font-medium text-zinc-700">Las cuotas son actualizables por índice</span>
            </label>

            {form.cuotasActualizables && (
              <div className="grid grid-cols-2 gap-4 pl-7">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">Índice <span className="text-red-400">*</span></label>
                  <select className="admin-input" value={form.indiceActualizacion} onChange={set("indiceActualizacion")}>
                    {INDICES.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                {form.indiceActualizacion === "Otro" && (
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1.5">Especificar <span className="text-red-400">*</span></label>
                    <input className="admin-input" value={form.indiceOtro} onChange={set("indiceOtro")} placeholder="Ej: Dólar MEP" required />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center bg-red-50 rounded-lg py-3 px-4">{error}</p>
        )}
      </form>
    </div>
  );
}
