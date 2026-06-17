import Link from "next/link";

export const metadata = {
  title: "Gracias por su consulta — Astor Tower",
};

export default function GraciasPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: "var(--brand-background)" }}
    >
      {/* Ícono */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-10"
        style={{ backgroundColor: "var(--brand-surface-container-low)" }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "var(--brand-secondary)" }}
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>

      {/* Logotipo / nombre */}
      <p
        className="font-label text-xs uppercase tracking-[0.3em] mb-3"
        style={{ color: "var(--brand-secondary)" }}
      >
        Astor Tower
      </p>

      {/* Headline */}
      <h1
        className="font-headline mb-6"
        style={{
          color: "var(--brand-primary)",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          lineHeight: 1.1,
        }}
      >
        Gracias por<br />su consulta
      </h1>

      {/* Subtexto */}
      <p
        className="font-body text-lg max-w-md mb-12"
        style={{ color: "var(--brand-on-surface-variant)" }}
      >
        Un asesor exclusivo se comunicará con usted a la brevedad para brindarle toda la información que necesita.
      </p>

      {/* CTA */}
      <Link
        href="/"
        className="font-label text-xs uppercase tracking-[0.2em] rounded-full px-10 py-4 transition-all duration-300"
        style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-on-primary)" }}
      >
        Volver al inicio
      </Link>

      {/* Decorador inferior */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: "var(--brand-secondary-container)" }}
      />
    </div>
  );
}
