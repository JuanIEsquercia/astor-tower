"use client";

import { useEffect, useState } from "react";
import { Building2, Layers, CheckCircle2, Inbox } from "lucide-react";
import Link from "next/link";

interface Stats {
  tipologias: number;
  unidades: number;
  disponibles: number;
}

const quickLinks = [
  { href: "/admin/tipologias",   label: "Gestionar Tipologías",  desc: "Crear y editar tipos de unidades" },
  { href: "/admin/unidades",     label: "Gestionar Unidades",    desc: "Alta, edición y estado de venta" },
  { href: "/admin/amenities",    label: "Editar Amenities",      desc: "Actualizar la sección de lifestyle" },
  { href: "/admin/avance-obra",  label: "Avance de Obra",        desc: "Subir videos de progreso de construcción" },
  { href: "/admin/contactos",    label: "Ver Mensajes",          desc: "Consultas recibidas del formulario" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ tipologias: 0, unidades: 0, disponibles: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/tipologias").then((r) => r.json()).catch(() => []),
      fetch("/api/unidades").then((r) => r.json()).catch(() => []),
    ]).then(([tips, unis]) => {
      const tArr = Array.isArray(tips) ? tips : [];
      const uArr = Array.isArray(unis) ? unis : [];
      setStats({
        tipologias: tArr.length,
        unidades: uArr.length,
        disponibles: uArr.filter((u: { estado: string }) => u.estado === "disponible").length,
      });
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: "Tipologías",       value: loading ? "—" : String(stats.tipologias), icon: Building2,    color: "#735c00" },
    { label: "Unidades totales", value: loading ? "—" : String(stats.unidades),   icon: Layers,       color: "#0a0a0a" },
    { label: "Disponibles",      value: loading ? "—" : String(stats.disponibles), icon: CheckCircle2, color: "#166534" },
    { label: "Mensajes nuevos",  value: "—",                                        icon: Inbox,        color: "#3b82f6" },
  ];

  return (
    <div className="p-8 space-y-10 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Gestión de contenido de Astor Tower</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="admin-card p-5 space-y-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}12` }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
          Acceso rápido
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickLinks.map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="admin-card p-5 flex items-center justify-between group hover:border-zinc-300 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-zinc-900">{label}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
              </div>
              <span className="text-zinc-300 group-hover:text-zinc-600 group-hover:translate-x-1 transition-all text-lg">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
