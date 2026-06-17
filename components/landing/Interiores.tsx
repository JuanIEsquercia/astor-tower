import RevealOnScroll from "./RevealOnScroll";
import { CheckCircle2 } from "lucide-react";

const features = [
  {
    titulo: "Terminaciones Premium",
    desc: "Mobiliario de alta calidad y pisos seleccionados.",
  },
  {
    titulo: "Tecnología Inteligente",
    desc: "Cerraduras digitales y climatización eficiente.",
  },
];

export default function Interiores() {
  return (
    <section className="py-24 md:py-32 bg-surface-container-high overflow-hidden">
      <div className="px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col lg:flex-row gap-20 items-center">

          {/* Images */}
          <RevealOnScroll className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdnLCMvZ6a4_Hnb-_vDf4Bl_9w4BsOMTX6G7CBLJZL0CDuXbVXLco2clrgbK1TM2pJmyzCvEij7h5f3yb5Rjy8UnwtkwQl_WhlxxZV4HE6nQlZM2t4V0uitAyHe5tmdnDN3_cvo0BzAkVPZNpmmSdG-hpYp9-0d7UEuYP7DidrqoR0D70inooLwyz54AgNlKrCSZFuSmbW20iXXEdwLKjJQQZMf4rlh2sf-i1yj8tNXGEL4rl1iG6QaXFc3nm6RZwrDMD6uyjlTw"
                  alt="Interior Living Astor"
                  className="rounded-2xl luxury-shadow w-full aspect-[4/5] object-cover"
                />
              </div>
              <div className="col-span-4 self-end space-y-4">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEtTEj3ajzvHL_U467yI2TDGDgTptcK_QjD2dCWL9oq88sJIm1HU9QNE7gpbOUR8fz5Uvoh9uLi2HD1lBBSkc9ej-fcKe2w2oMFgcoj0ld112cw-Xh8k_Czol_wRnShfTdJ8pdzz79g3q7QC-xBMpKriwmXvu0MgqHa_nVX7sPMPE8nKYdgNrxuDpjc2bmL6q_JdKcDKpi1L9dhewqaFo0qC5nBegs1sFKTDgJnZJlo9Zq-9vqRY7J7QUfS4qL6-s2GH8DjsNV1A"
                  alt="Detalle Interior"
                  className="rounded-2xl luxury-shadow w-full aspect-square object-cover hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="bg-primary-container/90 border border-secondary/20 p-6 rounded-2xl relative overflow-hidden group/box transition-all duration-300 hover:border-secondary/40">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl -translate-y-8 translate-x-8 transition-transform duration-1000 group-hover/box:scale-150" />
                  <p className="font-display text-4xl text-secondary font-light tracking-wide">1 · 2 · 3</p>
                  <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-primary/60 mt-2 font-semibold">
                    Dormitorios
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* Copy */}
          <RevealOnScroll className="w-full lg:w-1/2 space-y-10 order-1 lg:order-2" delay={150}>
            <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary">
              Interiores
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-primary leading-tight">
              Vivir con amplitud<br />y confort.
            </h2>
            <p className="font-body text-lg text-on-surface-variant leading-relaxed">
              Espacios proyectados con un enfoque funcional y estético, privilegiando la
              luminosidad natural a través de ventanales de piso a techo y una distribución
              que fluye orgánicamente.
            </p>
            <div className="space-y-5">
              {features.map((f) => (
                <div key={f.titulo} className="flex gap-5 items-start">
                  <CheckCircle2
                    size={20}
                    className="text-secondary mt-0.5 shrink-0"
                  />
                  <div>
                    <h4 className="font-label text-xs uppercase tracking-wider text-primary mb-1">
                      {f.titulo}
                    </h4>
                    <p className="font-body text-base text-on-surface-variant">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>

        </div>
      </div>
    </section>
  );
}
