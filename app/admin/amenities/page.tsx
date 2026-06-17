"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Image, X, Loader2, Inbox } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import type { AmenityItem } from "@/lib/types";

const emptyForm = { titulo: "", descripcion: "", imagenUrl: "", orden: 0 };
type FormState = typeof emptyForm;

export default function AmenitiesPage() {
  const [items, setItems] = useState<AmenityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const load = useCallback(async () => {
    const data = await fetch("/api/amenities").then((r) => r.json()).catch(() => []);
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (item: AmenityItem) => {
    setEditId(item.id);
    setForm({
      titulo: item.titulo,
      descripcion: item.descripcion,
      imagenUrl: item.imagenUrl,
      orden: item.orden,
    });
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const handleSave = async () => {
    if (!form.titulo) return;
    setSaving(true);
    if (editId) {
      await fetch(`/api/amenities/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/amenities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setSaving(false);
    close();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este amenity?")) return;
    await fetch(`/api/amenities/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Amenities</h1>
          <p className="text-sm text-zinc-500 mt-1">Edite los espacios de lifestyle del proyecto</p>
        </div>
        <button className="admin-btn-primary" onClick={openCreate}>
          <Plus size={16} />
          Agregar amenity
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
            <p className="text-sm font-medium text-zinc-700">Sin amenities cargados</p>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs">
              Agregue los espacios de lifestyle que aparecerán en la landing del proyecto.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="admin-card p-5 flex items-center gap-5">
              <div className="w-20 h-14 rounded-lg bg-zinc-50 border border-zinc-100 shrink-0 flex items-center justify-center overflow-hidden">
                {item.imagenUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imagenUrl} alt={item.titulo} className="w-full h-full object-cover" />
                ) : (
                  <Image size={20} className="text-zinc-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900">{item.titulo}</p>
                <p className="text-xs text-zinc-400 mt-0.5 truncate">{item.descripcion}</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-zinc-100 text-zinc-500">
                #{item.orden}
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
                {editId ? "Editar amenity" : "Nuevo amenity"}
              </h2>
              <button onClick={close} className="admin-btn-ghost p-1.5">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Título <span className="text-red-400">*</span>
                </label>
                <input
                  className="admin-input"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej: Piscina y Solárium"
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
                  placeholder="Breve descripción del amenity"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Imagen
                </label>
                <ImageUpload
                  images={form.imagenUrl ? [form.imagenUrl] : []}
                  onChange={(imgs) => setForm({ ...form, imagenUrl: imgs[0] ?? "" })}
                  maxImages={1}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Orden de visualización
                </label>
                <input
                  className="admin-input"
                  type="number"
                  value={form.orden}
                  onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })}
                />
              </div>

            </div>

            <div className="px-6 py-5 border-t border-zinc-100 flex gap-3 justify-end">
              <button className="admin-btn-ghost" onClick={close}>Cancelar</button>
              <button
                className="admin-btn-primary"
                onClick={handleSave}
                disabled={saving || !form.titulo}
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
