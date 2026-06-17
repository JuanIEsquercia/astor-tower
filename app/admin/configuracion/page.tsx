"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import type { SiteConfig } from "@/lib/types";

const DEFAULTS: SiteConfig = {
  telefono:   "+54 379 400 0000",
  email:      "info@astortower.com.ar",
  direccion:  "Buenos Aires 1463, Corrientes Capital",
  barrio:     "La Cruz",
  instagram:  "",
  linkedin:   "",
  footerDesc: "Arquitectura que trasciende. Un santuario de diseño y exclusividad en el litoral argentino.",
};

type Status = "idle" | "loading" | "saving" | "saved" | "error";

export default function ConfiguracionPage() {
  const [form, setForm] = useState<SiteConfig>(DEFAULTS);
  const [status, setStatus] = useState<Status>("loading");

  const load = useCallback(async () => {
    try {
      const data = await fetch("/api/config").then((r) => r.json());
      setForm({ ...DEFAULTS, ...data });
    } catch {
      setForm(DEFAULTS);
    } finally {
      setStatus("idle");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (key: keyof SiteConfig) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    setStatus("saving");
    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (status === "loading") {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <Loader2 size={20} className="text-zinc-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 max-w-2xl">

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Configuración</h1>
          <p className="text-sm text-zinc-500 mt-1">Datos globales del proyecto que aparecen en la landing</p>
        </div>
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="admin-btn-primary shrink-0"
        >
          {status === "saving" && <Loader2 size={15} className="animate-spin" />}
          {status === "saved"  && <CheckCircle2 size={15} />}
          {status !== "saving" && status !== "saved" && <Save size={15} />}
          {status === "saving" ? "Guardando..." : status === "saved" ? "Guardado" : "Guardar cambios"}
        </button>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3">
          Error al guardar. Intentá nuevamente.
        </p>
      )}

      {/* Contacto */}
      <section className="space-y-5">
        <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
          Datos de contacto
        </h2>
        <div className="admin-card p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Teléfono
            </label>
            <input
              className="admin-input"
              type="tel"
              value={form.telefono}
              onChange={set("telefono")}
              placeholder="+54 379 400 0000"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Email
            </label>
            <input
              className="admin-input"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="info@astortower.com.ar"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Dirección
            </label>
            <input
              className="admin-input"
              value={form.direccion}
              onChange={set("direccion")}
              placeholder="Buenos Aires 1463, Corrientes Capital"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Barrio
            </label>
            <input
              className="admin-input"
              value={form.barrio}
              onChange={set("barrio")}
              placeholder="La Cruz"
            />
          </div>
        </div>
      </section>

      {/* Redes */}
      <section className="space-y-5">
        <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
          Redes sociales
        </h2>
        <div className="admin-card p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Instagram
            </label>
            <input
              className="admin-input"
              value={form.instagram}
              onChange={set("instagram")}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              LinkedIn
            </label>
            <input
              className="admin-input"
              value={form.linkedin}
              onChange={set("linkedin")}
              placeholder="https://linkedin.com/..."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="space-y-5">
        <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
          Texto del footer
        </h2>
        <div className="admin-card p-6">
          <textarea
            className="admin-input resize-none"
            rows={3}
            value={form.footerDesc}
            onChange={set("footerDesc")}
            placeholder="Arquitectura que trasciende..."
          />
        </div>
      </section>

    </div>
  );
}
