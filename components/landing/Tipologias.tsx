import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";
import { getAdminDb } from "@/lib/firebase-admin";
import type { Tipologia } from "@/lib/types";

async function getTipologias(): Promise<Tipologia[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("tipologias").orderBy("orden").get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Tipologia, "id">),
    }));
  } catch {
    return [];
  }
}

function cardSpan(index: number, total: number): string {
  if (index === 0) return "md:col-span-2 md:row-span-2";
  if (index === total - 1 && total % 2 === 0) return "md:col-span-2";
  return "";
}

export default async function Tipologias() {
  const tipologias = await getTipologias();

  if (tipologias.length === 0) return null;

  return (
    <section className="py-24 md:py-40 bg-background" id="tipologias">
      <RevealOnScroll className="px-margin-mobile md:px-margin-desktop mb-20 text-center">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary">
          Plantas
        </span>
        <h2 className="font-headline text-4xl md:text-5xl text-primary mt-3">
          Nuestras Tipologías
        </h2>
        <p className="font-body text-lg text-on-surface-variant mt-4">
          Explore la variedad de unidades diseñadas para elevar su estilo de vida.
        </p>
      </RevealOnScroll>

      <div className="px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-8">
        {tipologias.map((t, i) => {
          const imagen = t.imagenes?.[0];
          const meta = [
            t.ambientes ? `${t.ambientes} amb.` : null,
            t.m2 ? `${t.m2} m²` : null,
          ]
            .filter(Boolean)
            .join(" · ");

          return (
            <RevealOnScroll
              key={t.id}
              className={cardSpan(i, tipologias.length)}
              delay={i * 80}
            >
              <Link href={`/tipologias/${t.id}`} className="block h-full">
              <div className="group cursor-pointer overflow-hidden rounded-3xl border border-outline-variant/30 hover:border-secondary/40 transition-all duration-500 bg-surface relative h-full min-h-[280px] luxury-shadow">
                {imagen ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={imagen}
                    alt={t.nombre}
                    className={`w-full h-full object-contain group-hover:scale-103 transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
                      i === 0 ? "p-12" : "p-6"
                    }`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center min-h-[280px]">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-on-surface-variant/20"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                  </div>
                )}

                {/* Glassmorphism hover overlay */}
                <div className="absolute inset-0 bg-primary-container/25 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <span className="font-label text-xs uppercase tracking-[0.15em] text-on-primary bg-primary border border-transparent hover:border-secondary hover:bg-transparent hover:text-secondary px-6 py-3 rounded-full translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                    Ver Detalles
                  </span>
                </div>

                {/* Info label */}
                <div className="absolute bottom-5 left-5 right-5 p-5 bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl border border-outline-variant/20 group-hover:border-secondary/25 transition-all duration-500">
                  {meta && (
                    <p className="font-label text-xs uppercase tracking-[0.18em] text-secondary font-bold mb-1">
                      {meta}
                    </p>
                  )}
                  <h3 className="font-headline text-xl text-primary font-semibold tracking-wide">{t.nombre}</h3>
                  {t.descripcion && (
                    <p className="font-body text-sm text-on-surface-variant mt-1.5 line-clamp-2">
                      {t.descripcion}
                    </p>
                  )}
                </div>
              </div>
              </Link>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}
