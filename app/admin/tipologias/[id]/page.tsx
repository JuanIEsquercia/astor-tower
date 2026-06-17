"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface FormState {
  nombre: string;
  descripcion: string;
  m2: string;
  ambientes: string;
  banos: string;
  imagenes: string[];
  iframePanorama: string;
}

const EMPTY: FormState = {
  nombre: "",
  descripcion: "",
  m2: "",
  ambientes: "",
  banos: "",
  imagenes: [],
  iframePanorama: "",
};

export default function TipologiaFormPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const isNew = id === "nueva";

  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/tipologias/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          nombre: data.nombre ?? "",
          descripcion: data.descripcion ?? "",
          m2: data.m2?.toString() ?? "",
          ambientes: data.ambientes?.toString() ?? "",
          banos: data.banos?.toString() ?? "",
          imagenes: data.imagenes ?? [],
          iframePanorama: data.iframePanorama ?? "",
        });
        setLoading(false);
      });
  }, [id, isNew]);

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      m2: Number(form.m2) || 0,
      ambientes: Number(form.ambientes) || 0,
      banos: Number(form.banos) || 0,
    };

    const res = await fetch(
      isNew ? "/api/tipologias" : `/api/tipologias/${id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      setError("Error al guardar. Intente nuevamente.");
      setSaving(false);
      return;
    }

    router.push("/admin/tipologias");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="text-zinc-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/tipologias" className="admin-btn-ghost p-2">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p className="text-xs text-zinc-400">Tipologías</p>
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
              {isNew ? "Nueva tipología" : form.nombre || "Editar tipología"}
            </h1>
          </div>
        </div>
        <button
          form="tipologia-form"
          type="submit"
          disabled={saving}
          className="admin-btn-primary"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>

      <form id="tipologia-form" onSubmit={handleSubmit} className="space-y-5">
        {/* Sección: Información básica */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Información básica
          </h2>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              className="admin-input"
              value={form.nombre}
              onChange={set("nombre")}
              placeholder="Ej: Suite 1 dormitorio"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">
              Descripción
            </label>
            <textarea
              className="admin-input resize-none"
              rows={3}
              value={form.descripcion}
              onChange={set("descripcion")}
              placeholder="Descripción de la tipología para la landing..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                Superficie m²
              </label>
              <input
                type="number"
                min="0"
                className="admin-input"
                value={form.m2}
                onChange={set("m2")}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                Ambientes
              </label>
              <input
                type="number"
                min="0"
                className="admin-input"
                value={form.ambientes}
                onChange={set("ambientes")}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                Baños
              </label>
              <input
                type="number"
                min="0"
                className="admin-input"
                value={form.banos}
                onChange={set("banos")}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Sección: Imágenes */}
        <div className="admin-card p-6 space-y-4">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Imágenes
          </h2>
          <p className="text-xs text-zinc-400">
            Se muestran en la landing pública. La primera imagen es la portada.
          </p>
          <ImageUpload
            images={form.imagenes}
            onChange={(imagenes) => setForm((f) => ({ ...f, imagenes }))}
          />
        </div>

        {/* Sección: Tour virtual */}
        <div className="admin-card p-6 space-y-4">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Tour virtual 360°
          </h2>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">
              URL del iframe
            </label>
            <input
              type="url"
              className="admin-input"
              value={form.iframePanorama}
              onChange={set("iframePanorama")}
              placeholder="https://..."
            />
            <p className="text-xs text-zinc-400 mt-1.5">
              URL del servicio de paneo 360° (Matterport, Kuula, etc.)
            </p>
          </div>

          {form.iframePanorama && (
            <div className="rounded-xl overflow-hidden border border-zinc-200 aspect-video">
              <iframe
                src={form.iframePanorama}
                className="w-full h-full"
                allowFullScreen
                title="Vista previa tour virtual"
              />
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center bg-red-50 rounded-lg py-3 px-4">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
