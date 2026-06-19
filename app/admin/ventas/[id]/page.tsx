"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2, Clock, AlertCircle, Pencil, X, Check, FileText, TrendingUp } from "lucide-react";
import type { Venta, Cuota, EstadoCuota } from "@/lib/types";

const ESTADO_CONFIG: Record<EstadoCuota, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pendiente: { label: "Pendiente", icon: Clock,         color: "#92400e", bg: "#fffbeb" },
  pagada:    { label: "Pagada",    icon: CheckCircle2,  color: "#166534", bg: "#f0fdf4" },
  vencida:   { label: "Vencida",   icon: AlertCircle,   color: "#991b1b", bg: "#fef2f2" },
};

function fmtFecha(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function fmtMonto(n: number | null, moneda: string) {
  if (n === null) return "—";
  return `${moneda} ${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface EditingCuota { id: string; monto: string }

export default function VentaDetailPage() {
  const { id } = useParams() as { id: string };
  const [venta, setVenta] = useState<Venta | null>(null);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingCuota | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Actualización de índice
  const [pctInput, setPctInput] = useState("");
  const [applyingPct, setApplyingPct] = useState(false);
  const [pctResult, setPctResult] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [vRes, cRes] = await Promise.all([
      fetch(`/api/ventas/${id}`),
      fetch(`/api/ventas/${id}/cuotas`),
    ]);
    if (!vRes.ok || !cRes.ok) { setLoading(false); return; }
    setVenta(await vRes.json());
    setCuotas(await cRes.json());
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const updateCuota = async (cuotaId: string, patch: Partial<Pick<Cuota, "monto" | "estado" | "fechaPago">>) => {
    setSaving(cuotaId);
    setSaveError(null);
    const res = await fetch(`/api/ventas/${id}/cuotas/${cuotaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setSaveError(`Error ${res.status}: ${data.error ?? "No se pudo guardar el cambio."}`);
      setSaving(null);
      return;
    }
    await load();
    setSaving(null);
    setEditing(null);
  };

  const cycleEstado = (cuota: Cuota) => {
    const hoy = new Date().toISOString().split("T")[0];
    if (cuota.estado !== "pagada") {
      updateCuota(cuota.id, { estado: "pagada", fechaPago: hoy });
    } else {
      updateCuota(cuota.id, { estado: "pendiente", fechaPago: null });
    }
  };

  const handleApplyPct = async () => {
    const pct = Number(pctInput);
    if (!pct) return;
    const pendientes = cuotas.filter((c) => c.estado !== "pagada").length;
    if (!confirm(`¿Aplicar +${pct}% a las ${pendientes} cuota${pendientes !== 1 ? "s" : ""} pendientes?`)) return;

    setApplyingPct(true);
    setPctResult(null);
    setSaveError(null);
    const res = await fetch(`/api/ventas/${id}/cuotas`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ porcentaje: pct }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setSaveError(`Error ${res.status}: ${data.error ?? "No se pudo aplicar la actualización."}`);
      setApplyingPct(false);
      return;
    }
    const data = await res.json();
    await load();
    setPctInput("");
    setPctResult(`${data.actualizadas} cuota${data.actualizadas !== 1 ? "s" : ""} actualizadas con +${pct}%`);
    setApplyingPct(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="text-zinc-300 animate-spin" />
      </div>
    );
  }

  if (!venta) return <div className="p-8 text-zinc-400">Venta no encontrada.</div>;

  const cuotasPagadas = cuotas.filter((c) => c.estado === "pagada").length;
  const montoPagado = cuotas.filter((c) => c.estado === "pagada").reduce((acc, c) => acc + (c.monto ?? 0), 0);
  const montoTotal = cuotas.reduce((acc, c) => acc + (c.monto ?? 0), 0);

  return (
    <div className="p-8 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/ventas" className="admin-btn-ghost p-2">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p className="text-xs text-zinc-400">Ventas</p>
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
              {venta.compradorNombre} {venta.compradorApellido} — Unidad {venta.unidadNumero}
            </h1>
          </div>
        </div>
        <Link href={`/admin/ventas/${id}/estado-cuenta`} className="admin-btn-ghost">
          <FileText size={15} />
          Estado de cuenta
        </Link>
      </div>

      {/* Error banner */}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-red-700">{saveError}</p>
          <button onClick={() => setSaveError(null)} className="text-red-400 hover:text-red-600 ml-4 text-xs">✕</button>
        </div>
      )}

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="admin-card p-5 space-y-3">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Titular</h2>
          <div className="space-y-1.5 text-sm">
            <p className="font-semibold text-zinc-900">{venta.compradorNombre} {venta.compradorApellido}</p>
            <p className="text-zinc-500">DNI {venta.compradorDni}</p>
            {venta.compradorTelefono && <p className="text-zinc-500">{venta.compradorTelefono}</p>}
            {venta.compradorEmail && <p className="text-zinc-500">{venta.compradorEmail}</p>}
          </div>
        </div>

        <div className="admin-card p-5 space-y-3">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Operación</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Valor cierre</span>
              <span className="font-semibold text-zinc-900">{fmtMonto(venta.valorCierre, venta.moneda)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Entrega ({venta.porcentajeEntrega}%)</span>
              <span className="text-zinc-700">{fmtMonto(venta.montoEntrega, venta.moneda)}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-100 pt-2">
              <span className="text-zinc-500">Saldo en cuotas</span>
              <span className="font-medium text-zinc-900">{fmtMonto(venta.saldoCuotas, venta.moneda)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Fecha boleto</span>
              <span className="text-zinc-600">{fmtFecha(venta.fechaCierre)}</span>
            </div>
            {venta.cuotasActualizables && venta.indiceActualizacion && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Índice</span>
                <span className="text-zinc-600">{venta.indiceActualizacion}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resumen cuotas */}
      {cuotas.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="admin-card p-4 text-center">
            <p className="text-2xl font-semibold text-zinc-900">{cuotasPagadas}/{cuotas.length}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Cuotas pagadas</p>
          </div>
          <div className="admin-card p-4 text-center">
            <p className="text-lg font-semibold text-zinc-900">{fmtMonto(montoPagado, venta.moneda)}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Cobrado</p>
          </div>
          <div className="admin-card p-4 text-center">
            <p className="text-lg font-semibold text-zinc-900">{fmtMonto(montoTotal - montoPagado, venta.moneda)}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Saldo pendiente</p>
          </div>
        </div>
      )}

      {/* Actualización de período — siempre visible */}
      <div className="admin-card p-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-zinc-700">
            <TrendingUp size={15} className="text-zinc-400" />
            <span className="text-sm font-medium">
              {venta.cuotasActualizables && venta.indiceActualizacion
                ? `Actualización ${venta.indiceActualizacion}`
                : "Actualización de cuotas"}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <div className="relative w-36">
              <input
                type="number"
                step="0.01"
                className="admin-input pr-8 text-sm"
                placeholder="2.80"
                value={pctInput}
                onChange={(e) => { setPctInput(e.target.value); setPctResult(null); }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">%</span>
            </div>
            <button
              onClick={handleApplyPct}
              disabled={!pctInput || applyingPct}
              className="admin-btn-ghost text-sm disabled:opacity-40"
            >
              {applyingPct ? <Loader2 size={14} className="animate-spin" /> : <TrendingUp size={14} />}
              Aplicar a todas las pendientes
            </button>
          </div>
          {pctResult && (
            <p className="text-xs text-emerald-600">{pctResult}</p>
          )}
        </div>
      </div>

      {/* Plan de pagos */}
      <div className="admin-card overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900">Plan de pagos</h2>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider w-12">N°</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Vencimiento</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Monto</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Actualiz.</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Estado</th>
              <th className="px-5 py-3 w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {cuotas.map((cuota) => {
              const cfg = ESTADO_CONFIG[cuota.estado];
              const Icon = cfg.icon;
              const isEditing = editing?.id === cuota.id;
              const isSaving = saving === cuota.id;

              return (
                <tr key={cuota.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-zinc-400 text-xs font-mono">{cuota.numeroCuota}</td>
                  <td className="px-5 py-3.5 text-zinc-600">{fmtFecha(cuota.fechaVencimiento)}</td>

                  {/* Monto — editable inline */}
                  <td className="px-5 py-3.5">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          autoFocus
                          className="admin-input py-1 text-sm w-32"
                          value={editing.monto}
                          onChange={(e) => setEditing((p) => p ? { ...p, monto: e.target.value } : null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") updateCuota(cuota.id, { monto: editing.monto ? Number(editing.monto) : null });
                            if (e.key === "Escape") setEditing(null);
                          }}
                        />
                        <button onClick={() => updateCuota(cuota.id, { monto: editing.monto ? Number(editing.monto) : null })} className="text-green-600 hover:text-green-700">
                          <Check size={14} />
                        </button>
                        <button onClick={() => setEditing(null)} className="text-zinc-400 hover:text-zinc-600">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-zinc-700 font-medium">{fmtMonto(cuota.monto, venta.moneda)}</span>
                    )}
                  </td>

                  {/* % actualización */}
                  <td className="px-5 py-3.5">
                    {cuota.porcentajeAplicado != null ? (
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        +{cuota.porcentajeAplicado.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="text-zinc-300 text-xs">—</span>
                    )}
                  </td>

                  {/* Estado */}
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => !isSaving && cycleEstado(cuota)}
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
                      style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      title="Click para cambiar estado"
                    >
                      {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Icon size={12} />}
                      {cfg.label}
                    </button>
                    {cuota.estado === "pagada" && cuota.fechaPago && (
                      <p className="text-xs text-zinc-400 mt-0.5 pl-1">{fmtFecha(cuota.fechaPago)}</p>
                    )}
                  </td>

                  {/* Editar monto */}
                  <td className="px-5 py-3.5 text-right">
                    {!isEditing && (
                      <button
                        onClick={() => setEditing({ id: cuota.id, monto: cuota.monto?.toString() ?? "" })}
                        className="admin-btn-ghost text-xs py-1 px-2.5"
                      >
                        <Pencil size={12} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
