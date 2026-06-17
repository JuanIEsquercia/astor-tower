import RevealOnScroll from "./RevealOnScroll";

export default function Concepto() {
  return (
    <section className="py-24 md:py-32 bg-surface-container-low" id="concepto">
      <div className="px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Copy */}
          <RevealOnScroll className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary">
                El Concepto
              </span>
              <h2 className="font-headline text-4xl md:text-5xl text-primary leading-tight">
                Diseño moderno,<br />detalles orgánicos.
              </h2>
            </div>
            <p className="font-body text-lg text-on-surface-variant leading-relaxed">
              Un desarrollo arquitectónico exclusivo que redefine el concepto de confort
              y modernidad en altura. Materiales de primera calidad, pensados para durar.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-2 border-l-2 border-secondary pl-5">
                <span className="block text-3xl font-light text-primary">01</span>
                <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Luminosidad Natural
                </p>
              </div>
              <div className="space-y-2 border-l-2 border-secondary pl-5">
                <span className="block text-3xl font-light text-primary">02</span>
                <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                  Materiales de calidad
                </p>
              </div>
            </div>
          </RevealOnScroll>

          {/* Images */}
          <RevealOnScroll className="lg:col-span-7 grid grid-cols-2 gap-6" delay={150}>
            <div className="pt-12">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWdfWh7NaHUvzv2nsS395EA_srN8lb5QkPGEZIVEdggZNAjIN51rMf5h02CMUQCDjubwIUZ7vJg7xPNr43orpfH3TUNYU4RTfye6UUH6at8yUyUCzalvYCyUHZsQCP9M9PMCE1WdSFP7wUtPUgtoxltdHhGYLx7e3-S70HfsLAoMFOSEs-fsXkTEZKHZuXDl4ZRHfuXho5hNdxmVoiH3D31MbmPMibIrrW9xR90jnVWSWqCTEhoEOeYdvZOxhBkJxJVqt46faN3Q"
                alt="Entrada Astor Tower"
                className="rounded-2xl luxury-shadow object-cover aspect-[3/4] w-full"
              />
            </div>
            <div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBDexMWg_3qVFkZZEn0iIfNLaLrN9D33taxazFtzmOIjUbeLMvoCjDs3bmWcImwOwsvcC80WWCpIk3tT49qb2zebqS9JUlK9iysGxdsE4oLtsiJpFdi6to9x0sX1LdJMp2W4f-9_vynI9J0huECbn5v8WhxStz1_V21X8HRz77jtzX5T4sGWgduZIFKimJkbxJGCd9D5AbWNToi1tHZInnNgOBF6NsMzyzkV0wCWiTPGALJAfBtoP3pIszPraM4AR1WWL5yKakxQ"
                alt="Lobby Astor Tower"
                className="rounded-2xl luxury-shadow object-cover aspect-[3/4] w-full"
              />
            </div>
          </RevealOnScroll>

        </div>
      </div>
    </section>
  );
}
