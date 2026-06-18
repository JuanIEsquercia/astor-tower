"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, PlayCircle, X, Loader2, Inbox } from "lucide-react";
import YouTubeInput, { parseYouTubeId } from "@/components/admin/YouTubeInput";
import type { AvanceObra } from "@/lib/types";

const emptyForm = { titulo: "", descripcion: "", fecha: "", videoUrl: "" };
type FormState = typeof emptyForm;

function formatFecha(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function AvanceObraPage() {
  const [items, setItems] = useState<AvanceObra[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const load = useCallback(async () => {
    const data = await fetch("/api/avance-obra").then((r) => r.json()).catch(() => []);
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (item: AvanceObra) => {
    setEditId(item.id);
    setForm({
      titulo: item.titulo,
      descripcion: item.descripcion,
      fecha: item.fecha,
      videoUrl: item.videoUrl,
    });
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const handleSave = async () => {
    if (!form.titulo || !form.fecha) return;
    setSaving(true);
    const body = JSON.stringify(form);
    if (editId) {
      await fetch(`/api/avance-obra/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body,
      });
    } else {
      await fetch("/api/avance-obra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
    }
    setSaving(false);
    close();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este registro de avance de obra?")) return;
    await fetch(`/api/avance-obra/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Avance de Obra</h1>
          <p className="text-sm text-zinc-500 mt-1">Registros de progreso de construcción visibles en la landing</p>
        </div>
        <button className="admin-btn-primary" onClick={openCreate}>
          <Plus size={16} />
          Nuevo registro
        </button>
      </div>

      {loading ? (
        <div className="admin-card p-12 flex items-center justify-center">
          <Loader2 size={20} className="text-zinc-400 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="admin-card p-16 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center">
            <Inbox size={24} className="text-zinc-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-700">Sin registros cargados</p>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs">
              Agregue actualizaciones de progreso que aparecerán en la landing del proyecto.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="admin-card p-5 flex items-center gap-5">
              <div className="w-20 h-14 rounded-lg bg-zinc-900 border border-zinc-100 shrink-0 flex items-center justify-center overflow-hidden">
                {item.videoUrl && parseYouTubeId(item.videoUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://img.youtube.com/vi/${parseYouTubeId(item.videoUrl)}/mqdefault.jpg`}
                    alt={item.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PlayCircle size={20} className="text-zinc-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900">{item.titulo}</p>
                <p className="text-xs text-zinc-400 mt-0.5 truncate">{item.descripcion}</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-zinc-100 text-zinc-500 shrink-0">
                {formatFecha(item.fecha)}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button className="admin-btn-ghost p-2" onClick={() => openEdit(item)}>
                  <Pencil size={14} />
                </button>
                <button
                  className="admin-btn-ghost p-2 hover:border-red-200 hover:text-red-500"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={close} />
          <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">

            <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-900">
                {editId ? "Editar registro" : "Nuevo registro"}
              </h2>
              <button onClick={close} className="admin-btn-ghost p-1.5">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Fecha <span className="text-red-400">*</span>
                </label>
                <input
                  className="admin-input"
                  type="date"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Título <span className="text-red-400">*</span>
                </label>
                <input
                  className="admin-input"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej: Inicio de losa del piso 4"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Descripción
                </label>
                <textarea
                  className="admin-input resize-none"
                  rows={3}
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Breve descripción del avance"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Video de YouTube
                </label>
                <YouTubeInput
                  value={form.videoUrl}
                  onChange={(url) => setForm({ ...form, videoUrl: url })}
                />
              </div>

            </div>

            <div className="px-6 py-5 border-t border-zinc-100 flex gap-3 justify-end">
              <button className="admin-btn-ghost" onClick={close}>Cancelar</button>
              <button
                className="admin-btn-primary"
                onClick={handleSave}
                disabled={saving || !form.titulo || !form.fecha}
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
