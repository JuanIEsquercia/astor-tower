"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ImageIcon, Loader2, LayoutGrid } from "lucide-react";
import type { Tipologia } from "@/lib/types";

export default function TipologiasPage() {
  const [tipologias, setTipologias] = useState<Tipologia[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/tipologias");
    setTipologias(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"? Se eliminarán también todas sus referencias.`)) return;
    setDeleting(id);
    await fetch(`/api/tipologias/${id}`, { method: "DELETE" });
    await load();
    setDeleting(null);
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Tipologías</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {loading ? "Cargando..." : `${tipologias.length} tipología${tipologias.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link href="/admin/tipologias/nueva" className="admin-btn-primary">
          <Plus size={16} />
          Nueva tipología
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="text-zinc-300 animate-spin" />
        </div>
      ) : tipologias.length === 0 ? (
        <div className="admin-card p-16 text-center space-y-3">
          <LayoutGrid size={32} className="text-zinc-200 mx-auto" />
          <p className="text-zinc-400 text-sm">Todavía no hay tipologías.</p>
          <Link href="/admin/tipologias/nueva" className="admin-btn-primary inline-flex">
            <Plus size={15} />
            Crear primera tipología
          </Link>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Nombre</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Superficie</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Amb.</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Baños</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Imágenes</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {tipologias.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="px-5 py-4 font-medium text-zinc-900">{t.nombre}</td>
                  <td className="px-5 py-4 text-zinc-600">{t.m2 ? `${t.m2} m²` : "—"}</td>
                  <td className="px-5 py-4 text-zinc-600">{t.ambientes || "—"}</td>
                  <td className="px-5 py-4 text-zinc-600">{t.banos || "—"}</td>
                  <td className="px-5 py-4 text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon size={13} className="text-zinc-400" />
                      {t.imagenes?.length ?? 0}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/tipologias/${t.id}`}
                        className="admin-btn-ghost text-xs py-1.5 px-3"
                      >
                        <Pencil size={13} />
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(t.id, t.nombre)}
                        disabled={deleting === t.id}
                        className="admin-btn-ghost text-xs py-1.5 px-3 hover:!bg-red-50 hover:!text-red-600 hover:!border-red-200 disabled:opacity-50"
                      >
                        {deleting === t.id
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
