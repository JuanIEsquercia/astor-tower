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
          <div className="rounded-3xl overflow-hidden luxury-shadow grayscale hover:grayscale-0 transition-all duration-1000 relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB24dzVENChNS2tPyN-w17Y2FHcSf9UeT7D_yFlUslIsrozTrQ8ooeJgTJDlXYrNSJBRbyD2UsscAJ4X6Ia6R5blNtaCpK0vVGy1NUhwX78AIrrs1uz7YU79uYok2aATQL180oymYhj14KT_EqxJpwJiwe_kGd2mCoR1P7l3dnDdfrrvkeRm8FNchDspnRylciV78IXcpZyqfCkPWBnhn0u3K4iN0F3mO1-Ok2U5KFTKuMoQd1Fgzwxj2U9Dd7ogSajAQkJ0Qkm_Q"
              alt="Mapa de Ubicación — Corrientes Capital"
              className="w-full h-[480px] object-cover transition-transform duration-1000 group-hover/map:scale-103"
            />
            {/* Elegant overlay badge */}
            <a
              href="https://maps.google.com/?q=Buenos+Aires+1463,+Corrientes,+Argentina"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-6 right-6 px-6 py-3 bg-surface-container-lowest/90 backdrop-blur-md text-primary hover:text-secondary rounded-full font-label text-xs uppercase tracking-[0.15em] border border-outline-variant/30 hover:border-secondary/50 shadow-lg opacity-0 group-hover/map:opacity-100 translate-y-2 group-hover/map:translate-y-0 transition-all duration-500 flex items-center gap-2"
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
