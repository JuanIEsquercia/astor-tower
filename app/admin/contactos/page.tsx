"use client";

import { useEffect, useState, useCallback } from "react";
import { Inbox, Mail, MailOpen, CheckCheck, Loader2, Phone } from "lucide-react";
import type { MensajeContacto } from "@/lib/types";

type Filtro = "todas" | "pendientes" | "atendidas";

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

export default function ContactosPage() {
  const [items, setItems] = useState<MensajeContacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>("todas");

  const load = useCallback(async () => {
    const data = await fetch("/api/contactos").then((r) => r.json()).catch(() => []);
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const markAtendida = async (id: string) => {
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, leido: true } : m)));
    await fetch(`/api/contactos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leido: true }),
    });
  };

  const markAllAtendidas = async () => {
    const pendientes = items.filter((m) => !m.leido);
    setItems((prev) => prev.map((m) => ({ ...m, leido: true })));
    await Promise.all(
      pendientes.map((m) =>
        fetch(`/api/contactos/${m.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leido: true }),
        })
      )
    );
  };

  const pendientes = items.filter((m) => !m.leido).length;
  const filtered = items.filter((m) => {
    if (filtro === "pendientes") return !m.leido;
    if (filtro === "atendidas") return m.leido;
    return true;
  });

  return (
    <div className="p-8 space-y-8 max-w-4xl">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Contactos</h1>
          <p className="text-sm text-zinc-500 mt-1 flex items-center gap-2">
            Mensajes recibidos desde el formulario de la landing
            {pendientes > 0 && (
              <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {pendientes} pendiente{pendientes !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>
        {pendientes > 0 && (
          <button className="admin-btn-ghost" onClick={markAllAtendidas}>
            <CheckCheck size={14} />
            Marcar todo como atendido
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {(["todas", "pendientes", "atendidas"] as Filtro[]).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
              filtro === f
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            }`}
          >
            {f === "todas" ? "Todas" : f === "pendientes" ? "Pendientes" : "Atendidas"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-card p-12 flex items-center justify-center">
          <Loader2 size={20} className="text-zinc-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-card p-16 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center">
            <Inbox size={24} className="text-zinc-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-700">
              {filtro === "todas" ? "Sin mensajes todavía" : `Sin consultas ${filtro}`}
            </p>
            {filtro === "todas" && (
              <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                Cuando alguien complete el formulario de la landing, el mensaje aparecerá aquí.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="divide-y divide-zinc-50">
            {filtered.map((m) => (
              <div
                key={m.id}
                className={`px-5 py-4 flex items-start gap-4 hover:bg-zinc-50 transition-colors ${
                  m.leido ? "opacity-60" : ""
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {m.leido
                    ? <MailOpen size={16} className="text-zinc-300" />
                    : <Mail size={16} className="text-zinc-900" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className={`text-sm ${m.leido ? "font-normal text-zinc-600" : "font-semibold text-zinc-900"}`}>
                      {m.nombre}
                    </span>
                    <span className="text-xs text-zinc-400">{m.email}</span>
                    {m.telefono && (
                      <a
                        href={`https://wa.me/${m.telefono.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                      >
                        <Phone size={10} />
                        {m.telefono}
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{m.mensaje}</p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2 min-w-[80px]">
                  <span className="text-xs text-zinc-400">{timeAgo(m.createdAt)}</span>
                  {m.leido ? (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCheck size={11} />
                      Atendida
                    </span>
                  ) : (
                    <button
                      onClick={() => markAtendida(m.id)}
                      className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 transition-colors border border-zinc-200 hover:border-zinc-400 px-2 py-1 rounded-md"
                    >
                      <CheckCheck size={11} />
                      Atendida
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
