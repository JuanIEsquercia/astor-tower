"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2, Layers, Copy } from "lucide-react";
import type { Unidad } from "@/lib/types";

const ESTADO_BADGE: Record<Unidad["estado"], { bg: string; text: string; dot: string; label: string }> = {
  disponible: { bg: "#f0fdf4", text: "#166534", dot: "#16a34a", label: "Disponible" },
  reservada:  { bg: "#fffbeb", text: "#92400e", dot: "#d97706", label: "Reservada"  },
  vendida:    { bg: "#fef2f2", text: "#991b1b", dot: "#dc2626", label: "Vendida"    },
};

const FILTROS: { label: string; value: string }[] = [
  { label: "Todas",       value: "todas"      },
  { label: "Disponibles", value: "disponible" },
  { label: "Reservadas",  value: "reservada"  },
  { label: "Vendidas",    value: "vendida"    },
];

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("todas");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/unidades");
    setUnidades(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, numero: string) => {
    if (!confirm(`¿Eliminar la unidad "${numero}"?`)) return;
    setDeleting(id);
    await fetch(`/api/unidades/${id}`, { method: "DELETE" });
    await load();
    setDeleting(null);
  };

  const visible = filtro === "todas"
    ? unidades
    : unidades.filter((u) => u.estado === filtro);

  const counts = {
    disponible: unidades.filter((u) => u.estado === "disponible").length,
    reservada:  unidades.filter((u) => u.estado === "reservada").length,
    vendida:    unidades.filter((u) => u.estado === "vendida").length,
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Unidades</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {loading ? "Cargando..." : `${unidades.length} unidad${unidades.length !== 1 ? "es" : ""} registrada${unidades.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/unidades/lote" className="admin-btn-ghost">
            <Copy size={15} />
            Crear en lote
          </Link>
          <Link href="/admin/unidades/nueva" className="admin-btn-primary">
            <Plus size={16} />
            Nueva unidad
          </Link>
        </div>
      </div>

      {/* Stats rápidas */}
      {!loading && unidades.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {(["disponible", "reservada", "vendida"] as const).map((e) => {
            const b = ESTADO_BADGE[e];
            return (
              <div key={e} className="admin-card p-4 flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: b.dot }}
                />
                <div>
                  <p className="text-xl font-semibold text-zinc-900">{counts[e]}</p>
                  <p className="text-xs text-zinc-500">{b.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filtros */}
      {!loading && unidades.length > 0 && (
        <div className="flex gap-2">
          {FILTROS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFiltro(value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filtro === value
                  ? "bg-zinc-900 text-white"
                  : "bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="text-zinc-300 animate-spin" />
        </div>
      ) : unidades.length === 0 ? (
        <div className="admin-card p-16 text-center space-y-3">
          <Layers size={32} className="text-zinc-200 mx-auto" />
          <p className="text-zinc-400 text-sm">Todavía no hay unidades cargadas.</p>
          <Link href="/admin/unidades/nueva" className="admin-btn-primary inline-flex">
            <Plus size={15} />
            Crear primera unidad
          </Link>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Unidad</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Piso</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Tipología</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Orientación</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Precio</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Estado</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {visible.map((u) => {
                const badge = ESTADO_BADGE[u.estado];
                return (
                  <tr key={u.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="px-5 py-4 font-semibold text-zinc-900">{u.numero}</td>
                    <td className="px-5 py-4 text-zinc-600">{u.piso}°</td>
                    <td className="px-5 py-4 text-zinc-600">{u.tipologiaNombre || "—"}</td>
                    <td className="px-5 py-4 text-zinc-500 text-xs font-medium">{u.orientacion}</td>
                    <td className="px-5 py-4 text-zinc-600">
                      {u.precio ? `USD ${u.precio.toLocaleString("es-AR")}` : "A consultar"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: badge.bg, color: badge.text }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badge.dot }} />
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/unidades/${u.id}`}
                          className="admin-btn-ghost text-xs py-1.5 px-3"
                        >
                          <Pencil size={13} />
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(u.id, u.numero)}
                          disabled={deleting === u.id}
                          className="admin-btn-ghost text-xs py-1.5 px-3 hover:!bg-red-50 hover:!text-red-600 hover:!border-red-200 disabled:opacity-50"
                        >
                          {deleting === u.id
                            ? <Loader2 size={13} className="animate-spin" />
                            : <Trash2 size={13} />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {visible.length === 0 && (
            <p className="text-center text-sm text-zinc-400 py-8">
              No hay unidades con este estado.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
