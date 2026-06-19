"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Layers,
  Sparkles,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Store,
  Landmark,
  HardHat,
  HandshakeIcon,
  Users,
} from "lucide-react";
import type { Rol } from "@/lib/types";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: Rol[];
};

const NAV: NavItem[] = [
  { href: "/admin",                 label: "Dashboard",       icon: LayoutDashboard, roles: ["superadmin", "usuario"] },
  { href: "/admin/tipologias",      label: "Tipologías",      icon: Building2,       roles: ["superadmin"] },
  { href: "/admin/unidades",        label: "Unidades",        icon: Layers,          roles: ["superadmin"] },
  { href: "/admin/ventas",          label: "Ventas",          icon: HandshakeIcon,   roles: ["superadmin", "usuario"] },
  { href: "/admin/amenities",       label: "Amenities",       icon: Sparkles,        roles: ["superadmin"] },
  { href: "/admin/avance-obra",     label: "Avance de Obra",  icon: HardHat,         roles: ["superadmin", "usuario"] },
  { href: "/admin/desarrolladores", label: "Desarrolladores", icon: Landmark,        roles: ["superadmin", "usuario"] },
  { href: "/admin/inmobiliarias",   label: "Inmobiliarias",   icon: Store,           roles: ["superadmin", "usuario"] },
  { href: "/admin/contactos",       label: "Contactos",       icon: Inbox,           roles: ["superadmin", "usuario"] },
  { href: "/admin/configuracion",   label: "Configuración",   icon: Settings,        roles: ["superadmin"] },
  { href: "/admin/usuarios",        label: "Usuarios",        icon: Users,           roles: ["superadmin"] },
];

export default function Sidebar({ rol }: { rol: Rol }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/admin/login");
  };

  const visibleItems = NAV.filter((item) => item.roles.includes(rol));

  return (
    <aside className="admin-sidebar w-64 shrink-0 h-screen sticky top-0 flex flex-col print:hidden">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-white/5">
        <p className="text-white/40 text-[10px] font-label uppercase tracking-[0.2em] mb-1">
          Panel de gestión
        </p>
        <p className="text-white font-headline text-xl tracking-tight">
          Astor Tower
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {visibleItems.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <a
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                active
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {label}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-6 border-t border-white/5 space-y-1">
        {rol === "superadmin" && (
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
          >
            <ExternalLink size={16} />
            Ver Landing
          </a>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
