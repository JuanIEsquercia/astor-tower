const navLinks = {
  Proyecto: [
    { label: "Amenities", href: "#amenities" },
    { label: "Ubicación", href: "#ubicacion" },
    { label: "Tipologías", href: "#tipologias" },
  ],
  Empresa: [
    { label: "Concepto", href: "#concepto" },
    { label: "Urbania", href: "#" },
    { label: "Contacto", href: "#contacto" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface-container border-t border-surface-container-highest">
      <div className="px-margin-mobile md:px-margin-desktop py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

          {/* Brand */}
          <div className="space-y-5">
            <span className="font-headline text-2xl text-primary">Astor Tower</span>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed max-w-xs">
              Arquitectura que trasciende. Diseño y exclusividad
              en el litoral argentino.
            </p>
          </div>

          {/* Nav */}
          <div className="grid grid-cols-2 gap-8">
            {Object.entries(navLinks).map(([section, links]) => (
              <div key={section} className="space-y-4">
                <p className="font-label text-xs uppercase tracking-[0.15em] text-primary">
                  {section}
                </p>
                <nav className="flex flex-col gap-3">
                  {links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      className="font-body text-sm text-on-surface-variant hover:text-secondary transition-colors duration-300"
                    >
                      {l.label}
                    </a>
                  ))}
                </nav>
              </div>
            ))}
          </div>

          {/* Social + legal */}
          <div className="space-y-6">
            <div className="flex gap-6">
              <a
                href="#"
                className="font-body text-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100"
              >
                Instagram
              </a>
              <a
                href="#"
                className="font-body text-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100"
              >
                LinkedIn
              </a>
            </div>
            <p className="font-label text-xs text-on-surface-variant/50">
              © 2025 Astor Tower. Todos los derechos reservados.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
