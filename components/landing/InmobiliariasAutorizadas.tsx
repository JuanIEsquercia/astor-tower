import { getAdminDb } from "@/lib/firebase-admin";
import type { Inmobiliaria } from "@/lib/types";
import RevealOnScroll from "./RevealOnScroll";

function whatsappUrl(telefono: string) {
  return `https://wa.me/${telefono.replace(/\D/g, "")}`;
}

async function getInmobiliarias(): Promise<Inmobiliaria[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("inmobiliarias").orderBy("orden").get();
    return snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          nombre: data.nombre ?? "",
          logoUrl: data.logoUrl ?? "",
          telefono: data.telefono ?? "",
          orden: data.orden ?? 0,
          activa: data.activa ?? true,
        } as Inmobiliaria;
      })
      .filter((i) => i.activa);
  } catch {
    return [];
  }
}

export default async function InmobiliariasAutorizadas() {
  const items = await getInmobiliarias();

  if (items.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-surface-container-lowest">
      <div className="px-margin-mobile md:px-margin-desktop">

        <RevealOnScroll className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
          <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary">
            Alianzas comerciales
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-primary leading-tight">
            Inmobiliarias autorizadas a comercializar
          </h2>
          <p className="font-body text-base text-on-surface-variant">
            Consultá directamente con los agentes exclusivos para conocer disponibilidad, precios y condiciones.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {items.map((inmo, i) => (
            <RevealOnScroll key={inmo.id} delay={i * 80}>
              <a
                href={whatsappUrl(inmo.telefono)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center p-10 rounded-3xl border border-outline-variant/40 bg-surface-container-lowest hover:border-secondary luxury-shadow hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300"
              >
                {/* Logo */}
                <div className="w-full h-20 flex items-center justify-center mb-8">
                  {inmo.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={inmo.logoUrl}
                      alt={inmo.nombre}
                      className="max-h-full max-w-[180px] object-contain"
                    />
                  ) : (
                    <span className="font-headline text-7xl text-primary/10 select-none leading-none">
                      {inmo.nombre.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Nombre */}
                <h3 className="font-headline text-xl text-primary mb-1 leading-tight">
                  {inmo.nombre}
                </h3>
                <p className="font-body text-xs text-on-surface-variant/60 uppercase tracking-widest mb-8">
                  Agente autorizado
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2.5 px-6 py-3 rounded-full border border-[#25D366]/30 bg-[#25D366]/8 group-hover:bg-[#25D366]/15 group-hover:border-[#25D366]/60 transition-all duration-300">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 shrink-0"
                    fill="#25D366"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="font-label text-xs uppercase tracking-[0.12em] text-on-surface group-hover:text-primary transition-colors">
                    Consultar por WhatsApp
                  </span>
                </div>
              </a>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}
