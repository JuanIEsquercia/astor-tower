"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import type { Tipologia, Unidad } from "@/lib/types";

interface FormState {
  numero: string;
  piso: string;
  tipologiaId: string;
  tipologiaNombre: string;
  precio: string;
  estado: Unidad["estado"];
  orientacion: Unidad["orientacion"];
}

const EMPTY: FormState = {
  numero: "",
  piso: "",
  tipologiaId: "",
  tipologiaNombre: "",
  precio: "",
  estado: "disponible",
  orientacion: "FRENTE",
};

export default function UnidadFormPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const isNew = id === "nueva";

  const [form, setForm] = useState<FormState>(EMPTY);
  const [tipologias, setTipologias] = useState<Tipologia[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/tipologias")
      .then((r) => r.json())
      .then(setTipologias);

    if (!isNew) {
      fetch(`/api/unidades/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setForm({
            numero: data.numero ?? "",
            piso: data.piso?.toString() ?? "",
            tipologiaId: data.tipologiaId ?? "",
            tipologiaNombre: data.tipologiaNombre ?? "",
            precio: data.precio?.toString() ?? "",
            estado: data.estado ?? "disponible",
            orientacion: data.orientacion ?? "FRENTE",
          });
          setLoading(false);
        });
    }
  }, [id, isNew]);

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }) as FormState);

  const handleTipologia = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tip = tipologias.find((t) => t.id === e.target.value);
    setForm((f) => ({
      ...f,
      tipologiaId: e.target.value,
      tipologiaNombre: tip?.nombre ?? "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      piso: Number(form.piso) || 0,
      precio: form.precio ? Number(form.precio) : null,
    };

    const res = await fetch(
      isNew ? "/api/unidades" : `/api/unidades/${id}`,
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

    router.push("/admin/unidades");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="text-zinc-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/unidades" className="admin-btn-ghost p-2">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p className="text-xs text-zinc-400">Unidades</p>
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
              {isNew ? "Nueva unidad" : `Unidad ${form.numero || id}`}
            </h1>
          </div>
        </div>
        <button
          form="unidad-form"
          type="submit"
          disabled={saving}
          className="admin-btn-primary"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>

      <form id="unidad-form" onSubmit={handleSubmit} className="space-y-5">
        {/* Identificación */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Identificación
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                Número / Identificador <span className="text-red-400">*</span>
              </label>
              <input
                className="admin-input"
                value={form.numero}
                onChange={set("numero")}
                placeholder="Ej: 3A, PH1, 10B"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                Piso <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                className="admin-input"
                value={form.piso}
                onChange={set("piso")}
                placeholder="0"
                required
              />
            </div>
          </div>
        </div>

        {/* Tipología */}
        <div className="admin-card p-6 space-y-4">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Tipología
          </h2>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">
              Tipología asociada <span className="text-red-400">*</span>
            </label>
            <select
              className="admin-input"
              value={form.tipologiaId}
              onChange={handleTipologia}
              required
            >
              <option value="" disabled>Seleccionar tipología...</option>
              {tipologias.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                  {t.m2 ? ` — ${t.m2} m²` : ""}
                  {t.ambientes ? `, ${t.ambientes} amb.` : ""}
                </option>
              ))}
            </select>
            {tipologias.length === 0 && (
              <p className="text-xs text-amber-600 mt-1.5">
                No hay tipologías. <Link href="/admin/tipologias/nueva" className="underline">Crear una primero.</Link>
              </p>
            )}
          </div>
        </div>

        {/* Detalles comerciales */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Detalles comerciales
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                Precio (USD)
              </label>
              <input
                type="number"
                min="0"
                className="admin-input"
                value={form.precio}
                onChange={set("precio")}
                placeholder="Dejar vacío = A consultar"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                Orientación <span className="text-red-400">*</span>
              </label>
              <select
                className="admin-input"
                value={form.orientacion}
                onChange={set("orientacion")}
                required
              >
                <option value="FRENTE">Frente</option>
                <option value="INTERNO">Interno</option>
                <option value="CONTRAFRENTE">Contrafrente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-2">
              Estado de venta
            </label>
            <div className="flex gap-3">
              {(
                [
                  { value: "disponible", label: "Disponible", color: "#16a34a" },
                  { value: "reservada",  label: "Reservada",  color: "#d97706" },
                  { value: "vendida",    label: "Vendida",    color: "#dc2626" },
                ] as const
              ).map(({ value, label, color }) => (
                <label
                  key={value}
                  className={`flex items-center gap-2 flex-1 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                    form.estado === value
                      ? "border-zinc-900 bg-zinc-50"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="estado"
                    value={value}
                    checked={form.estado === value}
                    onChange={set("estado")}
                    className="hidden"
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-medium text-zinc-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
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
