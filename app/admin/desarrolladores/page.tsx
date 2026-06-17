"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Building2, X, Loader2, Image } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Desarrollador } from "@/lib/types";

const emptyForm = { nombre: "", logoUrl: "", orden: 0 };
type FormState = typeof emptyForm;

export default function DesarrolladoresPage() {
  const [items, setItems] = useState<Desarrollador[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const load = useCallback(async () => {
    const data = await fetch("/api/desarrolladores").then((r) => r.json()).catch(() => []);
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (item: Desarrollador) => {
    setEditId(item.id);
    setForm({
      nombre: item.nombre ?? "",
      logoUrl: item.logoUrl ?? "",
      orden: item.orden ?? 0,
    });
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const handleSave = async () => {
    if (!form.nombre) return;
    setSaving(true);
    if (editId) {
      await fetch(`/api/desarrolladores/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/desarrolladores", {
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
    if (!confirm("¿Eliminar este desarrollador?")) return;
    await fetch(`/api/desarrolladores/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Desarrolladores</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Marcas y empresas detrás del proyecto — aparecen en la sección "Desarrollado por"
          </p>
        </div>
        <button className="admin-btn-primary" onClick={openCreate}>
          <Plus size={16} />
          Agregar
        </button>
      </div>

      {loading ? (
        <div className="admin-card p-12 flex items-center justify-center">
          <Loader2 size={20} className="text-zinc-400 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="admin-card p-16 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center">
            <Building2 size={24} className="text-zinc-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-700">Sin desarrolladores cargados</p>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs">
              Agregue las marcas y empresas que dan respaldo al proyecto. Sus logos aparecerán en la sección de contacto.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="admin-card p-5 flex items-center gap-5">
              <div className="w-24 h-12 rounded-lg bg-zinc-50 border border-zinc-100 shrink-0 flex items-center justify-center overflow-hidden">
                {item.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.logoUrl} alt={item.nombre} className="max-w-full max-h-full object-contain p-1" />
                ) : (
                  <Image size={18} className="text-zinc-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900">{item.nombre}</p>
                <p className="text-xs text-zinc-400 mt-0.5">Orden: {item.orden}</p>
              </div>
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
                {editId ? "Editar desarrollador" : "Nuevo desarrollador"}
              </h2>
              <button onClick={close} className="admin-btn-ghost p-1.5">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Nombre <span className="text-red-400">*</span>
                </label>
                <input
                  className="admin-input"
                  value={form.nombre}
                  onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Ej: Grupo Construir S.A."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Logo
                </label>
                <ImageUpload
                  images={form.logoUrl ? [form.logoUrl] : []}
                  onChange={(imgs) => setForm((prev) => ({ ...prev, logoUrl: imgs[0] ?? "" }))}
                  maxImages={1}
                />
                <p className="text-xs text-zinc-400">
                  Se mostrará en escala de grises sobre el fondo de la landing.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Orden de visualización
                </label>
                <input
                  className="admin-input"
                  type="number"
                  value={form.orden}
                  onChange={(e) => setForm((prev) => ({ ...prev, orden: Number(e.target.value) }))}
                />
              </div>

            </div>

            <div className="px-6 py-5 border-t border-zinc-100 flex gap-3 justify-end">
              <button className="admin-btn-ghost" onClick={close}>Cancelar</button>
              <button
                className="admin-btn-primary"
                onClick={handleSave}
                disabled={saving || !form.nombre}
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
