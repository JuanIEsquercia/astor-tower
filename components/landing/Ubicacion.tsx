import RevealOnScroll from "./RevealOnScroll";
import { MapPin } from "lucide-react";

export default function Ubicacion() {
  return (
    <section className="py-24 md:py-32 bg-surface-container-high" id="ubicacion">
      <div className="px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        <RevealOnScroll className="space-y-10">
          <div className="space-y-4">
            <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary">
              Localización
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-primary leading-tight">
              En el corazón del<br />barrio La Cruz.
            </h2>
          </div>

          <div className="flex items-center gap-5 p-6 bg-background rounded-2xl luxury-shadow">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <MapPin size={22} className="text-secondary" />
            </div>
            <div>
              <p className="font-headline text-xl text-primary">Buenos Aires 1463</p>
              <p className="font-body text-sm text-on-surface-variant mt-0.5">
                Corrientes Capital, Argentina
              </p>
            </div>
          </div>

          <p className="font-body text-lg text-on-surface-variant leading-relaxed">
            Una ubicación privilegiada que combina la tranquilidad residencial con la
            cercanía a los principales puntos de interés, gastronomía y servicios de
            la ciudad.
          </p>

          {/* Points of interest */}
          <div className="grid grid-cols-2 gap-4">
            {[
              ["5 min", "Costanera"],
              ["3 min", "Peatonal junin"],
              ["200 metros", "Av. 3 de abril"],
              ["10 min", "Terminal de Ómnibus"],
            ].map(([time, place]) => (
              <div
                key={place}
                className="flex items-center gap-4 p-4 bg-background rounded-2xl border border-outline-variant/30 hover:border-secondary/35 hover:-translate-y-0.5 transition-all duration-300 hover:shadow-[0_6px_20px_rgba(197,160,89,0.04)]"
              >
                <span className="font-label text-xs text-secondary font-bold shrink-0">{time}</span>
                <span className="font-body text-sm text-on-surface-variant">{place}</span>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={150} className="relative group/map">
          <div className="rounded-3xl overflow-hidden luxury-shadow relative">
            {/* Overlay desaturado que desaparece en hover */}
            <div className="absolute inset-0 z-10 bg-primary/20 mix-blend-color pointer-events-none transition-opacity duration-1000 group-hover/map:opacity-0" />

            <iframe
              src="https://maps.google.com/maps?q=Buenos+Aires+1463,+Corrientes,+Argentina&z=16&output=embed&hl=es"
              title="Ubicación de Astor Tower — Buenos Aires 1463, Corrientes"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[480px] border-0"
            />

            <a
              href="https://maps.google.com/?q=Buenos+Aires+1463,+Corrientes,+Argentina"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-6 right-6 z-20 px-6 py-3 bg-surface-container-lowest/90 backdrop-blur-md text-primary hover:text-secondary rounded-full font-label text-xs uppercase tracking-[0.15em] border border-outline-variant/30 hover:border-secondary/50 shadow-lg opacity-0 group-hover/map:opacity-100 translate-y-2 group-hover/map:translate-y-0 transition-all duration-500 flex items-center gap-2"
            >
              <span>Abrir Google Maps</span>
              <MapPin size={12} className="text-secondary" />
            </a>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
}
