"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, Trash2, Users, ShieldCheck } from "lucide-react";
import type { Usuario } from "@/lib/types";

const SUPERADMIN_EMAIL = "jiesquercia@gmail.com";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [email, setEmail]   = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/usuarios");
    setUsuarios(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (u: Usuario) => {
    setSaving(u.id);
    await fetch(`/api/usuarios/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !u.activo }),
    });
    await load();
    setSaving(null);
  };

  const handleDelete = async (u: Usuario) => {
    if (!confirm(`¿Eliminar a ${u.nombre} (${u.email})?`)) return;
    setSaving(u.id);
    await fetch(`/api/usuarios/${u.id}`, { method: "DELETE" });
    await load();
    setSaving(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAdding(true);

    const res = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nombre }),
    });

    if (!res.ok) {
      const data = await res.json();
      setAddError(data.error ?? "Error al agregar.");
      setAdding(false);
      return;
    }

    setEmail("");
    setNombre("");
    await load();
    setAdding(false);
    // Mostrar confirmación
    alert("Usuario creado. Se le envió un email para que configure su contraseña.");
  };

  return (
    <div className="p-8 space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Usuarios</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Gestioná quién tiene acceso al panel de administración.
        </p>
      </div>

      {/* Superadmin */}
      <div className="admin-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-zinc-900">Super administrador</p>
            <p className="text-xs text-zinc-400">{SUPERADMIN_EMAIL}</p>
          </div>
          <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
            Superadmin
          </span>
        </div>
      </div>

      {/* Agregar usuario */}
      <div className="admin-card p-6 space-y-4">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Agregar usuario</h2>
        <p className="text-xs text-zinc-500">
          Ingresá el nombre y email. Se crea la cuenta automáticamente y se le envía un email para que configure su propia contraseña.
        </p>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">Nombre <span className="text-red-400">*</span></label>
              <input
                className="admin-input"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Juan Pérez"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">Email <span className="text-red-400">*</span></label>
              <input
                type="email"
                className="admin-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@ejemplo.com"
                required
              />
            </div>
          </div>
          {addError && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg py-2 px-3">{addError}</p>
          )}
          <div className="flex justify-end">
            <button type="submit" disabled={adding} className="admin-btn-primary">
              {adding ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              {adding ? "Agregando..." : "Agregar usuario"}
            </button>
          </div>
        </form>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 size={22} className="text-zinc-300 animate-spin" />
        </div>
      ) : usuarios.length === 0 ? (
        <div className="admin-card p-12 text-center space-y-2">
          <Users size={28} className="text-zinc-200 mx-auto" />
          <p className="text-zinc-400 text-sm">No hay usuarios habilitados todavía.</p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Usuario</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Estado</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-zinc-900">{u.nombre}</p>
                    <p className="text-xs text-zinc-400">{u.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggle(u)}
                      disabled={saving === u.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-75 disabled:opacity-40 ${
                        u.activo
                          ? "bg-green-50 text-green-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {saving === u.id
                        ? <Loader2 size={11} className="animate-spin" />
                        : <span className={`w-1.5 h-1.5 rounded-full ${u.activo ? "bg-green-500" : "bg-zinc-400"}`} />
                      }
                      {u.activo ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDelete(u)}
                      disabled={saving === u.id}
                      className="admin-btn-ghost text-xs py-1.5 px-3 hover:!bg-red-50 hover:!text-red-600 hover:!border-red-200 disabled:opacity-40"
                    >
                      <Trash2 size={13} />
                    </button>
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
