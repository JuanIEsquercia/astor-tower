"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RevealOnScroll from "./RevealOnScroll";
import { Phone, Mail, Send } from "lucide-react";
import type { Desarrollador } from "@/lib/types";

export default function Contacto() {
  const router = useRouter();
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "", mensaje: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [desarrolladores, setDesarrolladores] = useState<Desarrollador[]>([]);

  useEffect(() => {
    fetch("/api/desarrolladores")
      .then((r) => r.json())
      .then((data) => setDesarrolladores(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      router.push("/gracias");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-24 md:py-32 bg-background" id="contacto">
      <div className="px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-24">

        {/* Info */}
        <RevealOnScroll className="space-y-12">
          <div className="space-y-4">
            <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary">
              Contacto
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-primary leading-tight">
              Contacte con<br />un asesor exclusivo
            </h2>
          </div>

          <div className="space-y-6">
            <a href="tel:+543794000000" className="flex items-center gap-5 group">
              <div className="w-11 h-11 rounded-full border border-outline-variant flex items-center justify-center group-hover:border-secondary transition-colors">
                <Phone size={18} className="text-secondary" />
              </div>
              <span className="font-body text-lg text-on-surface group-hover:text-primary transition-colors">
                +54 379 400 0000
              </span>
            </a>
            <a href="mailto:info@astortower.com.ar" className="flex items-center gap-5 group">
              <div className="w-11 h-11 rounded-full border border-outline-variant flex items-center justify-center group-hover:border-secondary transition-colors">
                <Mail size={18} className="text-secondary" />
              </div>
              <span className="font-body text-lg text-on-surface group-hover:text-primary transition-colors">
                info@astortower.com.ar
              </span>
            </a>
          </div>

          {desarrolladores.length > 0 && (
            <div className="pt-4 border-t border-outline-variant/40">
              <p className="font-label text-xs uppercase tracking-[0.2em] text-secondary mb-6">
                Desarrollado por
              </p>
              <div className="flex flex-wrap items-center gap-8">
                {desarrolladores.map((dev) => (
                  <div key={dev.id} className="flex flex-col items-center gap-2">
                    {dev.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={dev.logoUrl}
                        alt={dev.nombre}
                        className="h-10 w-auto max-w-[120px] object-contain brightness-0 opacity-50"
                      />
                    ) : (
                      <span className="font-headline text-sm text-primary/40 uppercase tracking-widest">
                        {dev.nombre}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </RevealOnScroll>

        {/* Form */}
        <RevealOnScroll delay={150}>
          <div className="bg-surface-container-low p-10 md:p-12 rounded-3xl luxury-shadow">
            <form onSubmit={handleSubmit} className="space-y-8">
                <h3 className="font-headline text-2xl text-primary font-semibold tracking-wide">Solicitar información</h3>

                {/* Nombre */}
                <div className="relative">
                  <input
                    id="nombre"
                    type="text"
                    required
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder=" "
                    className="peer w-full bg-transparent border-0 border-b border-outline-variant py-4 pt-6 text-on-surface placeholder-transparent focus:outline-none focus:border-secondary transition-colors"
                  />
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-secondary scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-left" />
                  <label
                    htmlFor="nombre"
                    className="absolute left-0 top-2 text-xs text-secondary font-label uppercase tracking-[0.1em] transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-on-surface-variant peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-xs peer-focus:text-secondary peer-focus:uppercase peer-focus:tracking-[0.1em]"
                  >
                    Nombre completo
                  </label>
                </div>

                {/* Teléfono */}
                <div className="relative">
                  <input
                    id="telefono"
                    type="tel"
                    required
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder=" "
                    className="peer w-full bg-transparent border-0 border-b border-outline-variant py-4 pt-6 text-on-surface placeholder-transparent focus:outline-none focus:border-secondary transition-colors"
                  />
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-secondary scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-left" />
                  <label
                    htmlFor="telefono"
                    className="absolute left-0 top-2 text-xs text-secondary font-label uppercase tracking-[0.1em] transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-on-surface-variant peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-xs peer-focus:text-secondary peer-focus:uppercase peer-focus:tracking-[0.1em]"
                  >
                    Teléfono
                  </label>
                </div>

                {/* Email */}
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder=" "
                    className="peer w-full bg-transparent border-0 border-b border-outline-variant py-4 pt-6 text-on-surface placeholder-transparent focus:outline-none focus:border-secondary transition-colors"
                  />
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-secondary scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-left" />
                  <label
                    htmlFor="email"
                    className="absolute left-0 top-2 text-xs text-secondary font-label uppercase tracking-[0.1em] transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-on-surface-variant peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-xs peer-focus:text-secondary peer-focus:uppercase peer-focus:tracking-[0.1em]"
                  >
                    Email
                  </label>
                </div>

                {/* Mensaje */}
                <div className="relative">
                  <textarea
                    id="mensaje"
                    rows={4}
                    required
                    value={form.mensaje}
                    onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                    placeholder=" "
                    className="peer w-full bg-transparent border-0 border-b border-outline-variant py-4 pt-6 text-on-surface placeholder-transparent focus:outline-none focus:border-secondary transition-colors resize-none"
                  />
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-secondary scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-left" />
                  <label
                    htmlFor="mensaje"
                    className="absolute left-0 top-2 text-xs text-secondary font-label uppercase tracking-[0.1em] transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-on-surface-variant peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-xs peer-focus:text-secondary peer-focus:uppercase peer-focus:tracking-[0.1em]"
                  >
                    Mensaje
                  </label>
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-500">
                    Hubo un error al enviar. Por favor intente nuevamente.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 bg-primary text-on-primary rounded-full font-label text-xs uppercase tracking-[0.18em] border border-primary hover:border-secondary hover:bg-transparent hover:text-secondary hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60 group/btn"
                >
                  {status === "loading" ? "Enviando..." : (
                    <>
                      Enviar Consulta
                      <Send size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
}
