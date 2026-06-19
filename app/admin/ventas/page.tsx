"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Loader2, HandshakeIcon, Trash2 } from "lucide-react";
import type { Venta } from "@/lib/types";

function fmtMonto(valor: number, moneda: string) {
  return `${moneda} ${valor.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function fmtFecha(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/ventas");
    setVentas(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (v: Venta) => {
    if (!confirm(`¿Eliminar la venta de la unidad ${v.unidadNumero} a ${v.compradorNombre} ${v.compradorApellido}?\nEsto devolverá la unidad al estado "disponible".`)) return;
    setDeleting(v.id);
    await fetch(`/api/ventas/${v.id}`, { method: "DELETE" });
    await load();
    setDeleting(null);
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Ventas</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {loading ? "Cargando..." : `${ventas.length} venta${ventas.length !== 1 ? "s" : ""} registrada${ventas.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link href="/admin/ventas/nueva" className="admin-btn-primary">
          <Plus size={16} />
          Registrar venta
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="text-zinc-300 animate-spin" />
        </div>
      ) : ventas.length === 0 ? (
        <div className="admin-card p-16 text-center space-y-3">
          <HandshakeIcon size={32} className="text-zinc-200 mx-auto" />
          <p className="text-zinc-400 text-sm">Todavía no hay ventas registradas.</p>
          <Link href="/admin/ventas/nueva" className="admin-btn-primary inline-flex">
            <Plus size={15} />
            Registrar primera venta
          </Link>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Comprador</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Unidad</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Valor cierre</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Cuotas</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Fecha cierre</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {ventas.map((v) => (
                <tr key={v.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-zinc-900">{v.compradorNombre} {v.compradorApellido}</p>
                    <p className="text-xs text-zinc-400">DNI {v.compradorDni}</p>
                  </td>
                  <td className="px-5 py-4 font-medium text-zinc-700">{v.unidadNumero}</td>
                  <td className="px-5 py-4 text-zinc-700">{fmtMonto(v.valorCierre, v.moneda)}</td>
                  <td className="px-5 py-4 text-zinc-600">
                    {v.cantidadCuotas}
                    {v.cuotasActualizables && (
                      <span className="ml-1.5 text-xs text-zinc-400">· {v.indiceActualizacion}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-zinc-500 text-xs">{fmtFecha(v.fechaCierre)}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/ventas/${v.id}`}
                        className="admin-btn-ghost text-xs py-1.5 px-3"
                      >
                        Ver plan de pagos
                      </Link>
                      <button
                        onClick={() => handleDelete(v)}
                        disabled={deleting === v.id}
                        className="admin-btn-ghost text-xs py-1.5 px-3 hover:!bg-red-50 hover:!text-red-600 hover:!border-red-200 disabled:opacity-50"
                      >
                        {deleting === v.id
                          ? <Loader2 size={13} className="animate-spin" />
                          : <Trash2 size={13} />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
