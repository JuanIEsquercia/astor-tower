export default function Hero() {
  return (
    <header className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
      {/* Background image with Ken Burns zoom effect */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#121110]">
        <img
          src="/black_marble_gold_texture.png"
          alt="Astor Tower — Textura de mármol negro y vetas de oro"
          className="w-full h-full object-cover ken-burns opacity-60"
        />
        {/* Adaptive luxury radial gradient overlay for perfect readability in the center */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/80 to-[#121110]/30 md:bg-[radial-gradient(circle_at_center,rgba(18,17,16,0.85)_0%,rgba(18,17,16,0.5)_60%,transparent_100%)]" />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 w-full px-margin-mobile md:px-margin-desktop flex flex-col items-center text-center">
        <div className="max-w-3xl space-y-8 flex flex-col items-center">
          <p className="font-label text-xs uppercase tracking-[0.25em] text-secondary font-bold">
            Corrientes, Argentina
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight max-w-3xl">
            El lugar donde desearías vivir
          </h1>
          <p className="font-body text-base md:text-lg text-white/75 leading-relaxed max-w-lg mx-auto">
            Innovación y detalles orgánicos en una ubicación estratégica.
            <br />
            Un hogar diseñado y pensado para vos.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="#contacto"
              className="inline-block px-10 py-4 bg-secondary text-primary rounded-full font-label text-xs uppercase tracking-[0.15em] border border-secondary hover:bg-transparent hover:text-secondary hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_4px_25px_rgba(197,160,89,0.18)]"
            >
              Descubrir Proyecto
            </a>
            <a
              href="#tipologias"
              className="inline-block px-10 py-4 border border-white/35 text-white rounded-full font-label text-xs uppercase tracking-[0.15em] hover:border-white hover:bg-white/10 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300"
            >
              Ver Tipologías
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
