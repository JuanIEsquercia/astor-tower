"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Loader2, Save, Info } from "lucide-react";
import type { Tipologia, Unidad } from "@/lib/types";

interface Row {
  localId: string;
  numero: string;
  piso: string;
  precio: string;
}

function makeRow(lastPiso?: number): Row {
  return {
    localId: Math.random().toString(36).slice(2),
    numero: "",
    piso: lastPiso != null && !isNaN(lastPiso) ? String(lastPiso + 1) : "",
    precio: "",
  };
}

export default function CreacionLotePage() {
  const router = useRouter();
  const lastInputRef = useRef<HTMLInputElement>(null);

  const [tipologias, setTipologias] = useState<Tipologia[]>([]);
  const [tipologiaId, setTipologiaId] = useState("");
  const [tipologiaNombre, setTipologiaNombre] = useState("");
  const [orientacion, setOrientacion] = useState<Unidad["orientacion"]>("FRENTE");
  const [estado, setEstado] = useState<Unidad["estado"]>("disponible");
  const [rows, setRows] = useState<Row[]>([makeRow()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/tipologias")
      .then((r) => r.json())
      .then((data) => setTipologias(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleTipologia = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tip = tipologias.find((t) => t.id === e.target.value);
    setTipologiaId(e.target.value);
    setTipologiaNombre(tip?.nombre ?? "");
  };

  const addRow = () => {
    const last = rows[rows.length - 1];
    const lastPiso = last ? Number(last.piso) : NaN;
    setRows((prev) => [...prev, makeRow(isNaN(lastPiso) ? undefined : lastPiso)]);
    setTimeout(() => lastInputRef.current?.focus(), 30);
  };

  const removeRow = (localId: string) => {
    setRows((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((r) => r.localId !== localId);
    });
  };

  const updateRow = (localId: string, field: keyof Omit<Row, "localId">, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.localId === localId ? { ...r, [field]: value } : r))
    );
  };

  const validRows = rows.filter((r) => r.numero.trim() && r.piso.trim());

  const handleSave = async () => {
    if (!tipologiaId) {
      setError("Seleccioná una tipología antes de guardar.");
      return;
    }
    if (validRows.length === 0) {
      setError("Completá al menos una fila con número y piso.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = validRows.map((r) => ({
      numero: r.numero.trim(),
      piso: Number(r.piso),
      tipologiaId,
      tipologiaNombre,
      precio: r.precio ? Number(r.precio) : null,
      estado,
      orientacion,
    }));

    const res = await fetch("/api/unidades/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setError("Error al guardar. Intente nuevamente.");
      setSaving(false);
      return;
    }

    router.push("/admin/unidades");
  };

  return (
    <div className="p-8 max-w-4xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/unidades" className="admin-btn-ghost p-2">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p className="text-xs text-zinc-400">Unidades</p>
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
              Creación en lote
            </h1>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !tipologiaId || validRows.length === 0}
          className="admin-btn-primary disabled:opacity-40"
        >
          {saving
            ? <Loader2 size={16} className="animate-spin" />
            : <Save size={16} />
          }
          {saving
            ? "Guardando..."
            : `Crear ${validRows.length} unidad${validRows.length !== 1 ? "es" : ""}`
          }
        </button>
      </div>

      {/* Configuración compartida */}
      <div className="admin-card p-6 space-y-5">
        <div>
          <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
            Configuración compartida
          </h2>
          <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
            <Info size={11} />
            Estos valores se aplican a todas las unidades del lote.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">
              Tipología <span className="text-red-400">*</span>
            </label>
            <select
              className="admin-input"
              value={tipologiaId}
              onChange={handleTipologia}
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
                No hay tipologías.{" "}
                <Link href="/admin/tipologias/nueva" className="underline">
                  Crear una primero.
                </Link>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">
              Orientación <span className="text-red-400">*</span>
            </label>
            <select
              className="admin-input"
              value={orientacion}
              onChange={(e) => setOrientacion(e.target.value as Unidad["orientacion"])}
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
            {([
              { value: "disponible", label: "Disponible", color: "#16a34a" },
              { value: "reservada",  label: "Reservada",  color: "#d97706" },
              { value: "vendida",    label: "Vendida",    color: "#dc2626" },
            ] as const).map(({ value, label, color }) => (
              <label
                key={value}
                className={`flex items-center gap-2 flex-1 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                  estado === value
                    ? "border-zinc-900 bg-zinc-50"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <input
                  type="radio"
                  name="estado"
                  value={value}
                  checked={estado === value}
                  onChange={() => setEstado(value)}
                  className="hidden"
                />
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-sm font-medium text-zinc-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de unidades */}
      <div className="admin-card overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Unidades a crear
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Número y piso son obligatorios. Precio vacío = &quot;A consultar&quot;.
            </p>
          </div>
          {validRows.length > 0 && (
            <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
              {validRows.length} válida{validRows.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider w-8">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Nro / ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider w-32">
                Piso
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Precio (USD)
              </th>
              <th className="px-4 py-3 w-12" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {rows.map((row, idx) => {
              const isLast = idx === rows.length - 1;
              const isValid = row.numero.trim() && row.piso.trim();
              return (
                <tr
                  key={row.localId}
                  className={`group transition-colors ${isValid ? "" : "bg-zinc-50/30"}`}
                >
                  <td className="px-4 py-2.5 text-xs text-zinc-300 font-medium">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      ref={isLast ? lastInputRef : undefined}
                      className="admin-input py-2 text-sm"
                      value={row.numero}
                      onChange={(e) => updateRow(row.localId, "numero", e.target.value)}
                      placeholder="Ej: 3A, PH1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (isLast) addRow();
                        }
                      }}
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="number"
                      min="0"
                      className="admin-input py-2 text-sm"
                      value={row.piso}
                      onChange={(e) => updateRow(row.localId, "piso", e.target.value)}
                      placeholder="0"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="number"
                      min="0"
                      className="admin-input py-2 text-sm"
                      value={row.precio}
                      onChange={(e) => updateRow(row.localId, "precio", e.target.value)}
                      placeholder="Vacío = A consultar"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => removeRow(row.localId)}
                      disabled={rows.length === 1}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:hidden"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="px-5 py-3 border-t border-zinc-100">
          <button
            onClick={addRow}
            className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors py-1"
          >
            <Plus size={14} />
            Agregar fila
            <span className="text-zinc-300 ml-1">↵ Enter en la última fila</span>
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center bg-red-50 rounded-lg py-3 px-4">
          {error}
        </p>
      )}

    </div>
  );
}
