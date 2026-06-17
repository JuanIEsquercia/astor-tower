"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#amenities", label: "Amenities" },
  { href: "#tipologias", label: "Tipologías" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "glass-nav py-4 shadow-[0_8px_30px_rgba(28,26,23,0.04)] border-b border-outline-variant/30"
          : "bg-transparent py-6 border-b border-transparent"
      }`}
    >
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop">
        <a
          href="#"
          className={`font-headline text-2xl tracking-tight transition-colors duration-500 ${
            scrolled ? "text-primary hover:text-secondary" : "text-white hover:text-secondary"
          }`}
        >
          Astor Tower
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`font-label text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300 hover-underline-gold ${
                scrolled
                  ? "text-on-surface-variant hover:text-primary"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacto"
            className={`px-7 py-3 rounded-full font-label text-xs uppercase tracking-[0.15em] transition-all duration-300 hover:scale-[1.02] border ${
              scrolled
                ? "bg-primary text-on-primary border-primary hover:border-secondary hover:bg-transparent hover:text-secondary shadow-[0_4px_12px_rgba(197,160,89,0.06)]"
                : "bg-white/10 text-white border-white/20 hover:bg-white hover:text-primary hover:border-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
            }`}
          >
            Contactar
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className={`md:hidden transition-colors duration-300 ${
            scrolled ? "text-primary" : "text-white"
          }`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menú"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-outline-variant mt-2 px-margin-mobile py-6 flex flex-col gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="font-label text-xs uppercase tracking-[0.15em] text-on-surface-variant font-medium animate-fadeIn"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => setMobileOpen(false)}
            className="self-start px-7 py-3 bg-primary text-on-primary rounded-full font-label text-xs uppercase tracking-[0.15em] font-medium"
          >
            Contactar
          </a>
        </div>
      )}
    </nav>
  );
}
