import { getAdminDb } from "@/lib/firebase-admin";
import type { AmenityItem } from "@/lib/types";
import RevealOnScroll from "./RevealOnScroll";

const FALLBACK_ITEMS: AmenityItem[] = [
  {
    id: "fallback-1",
    titulo: "Piscina y Solárium únicos",
    descripcion: "Un oasis de serenidad sobre el horizonte de Corrientes.",
    imagenUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwO8XLX7HVtGk2U5Rc3I2ifZCwNQEOebUDDWcYlC63N5EfjTI-YXeyBus14iFFStalJmWcnqljPDm85UTbBoSh85a2WIn4H6AhTD8JvKuWnHM_YRltDvbhc52ovSlPoEAVeBCNMFjdnLpnfsqZJJaJ5bdAAXP_tkl4b4yLv1oFYSWkBdbI8GDuFUAOQXTelFe5ia3f2ICL3nQ0T8h5jiC4m4_iyGvThBds_IPVLXClhkk1tLx1AVXjU3ARKPApSa6dg6vrV_8dsQ",
    orden: 0,
  },
  {
    id: "fallback-2",
    titulo: "Quincho y parrilla para disfrutar",
    descripcion: "Momentos inolvidables compartidos con seres queridos.",
    imagenUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcqzdBKcej-ylKvpqyh6AIjJ65yJWanslq6w1VAhJsB-mnhjsWsgBoIGcrEo-AG0eJJiYSr83MkY3lJgB1qs86dpgr4YhvSD_K9YgOh48l3pTQcdUIa75gSeSon9ds9hEsR1zec_pWcUmJoDNsVQdpZYQcAT2FLqMMHXDtPjQZsK-rXoWVywAW1SxRv0ptkD0EMlg-0oJRAGHfAXZLM4AvVCmZeLgOkQLpRokmrxzYgyzhZeSL4nsnDmX7WURTE63js_JppD-50w",
    orden: 1,
  },
];

async function getAmenities(): Promise<AmenityItem[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("amenities").orderBy("orden").get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AmenityItem));
  } catch {
    return FALLBACK_ITEMS;
  }
}

export default async function Amenities() {
  const items = await getAmenities();

  return (
    <section className="py-24 md:py-32 bg-background overflow-hidden" id="amenities">
      <RevealOnScroll className="px-margin-mobile md:px-margin-desktop mb-20 text-center max-w-4xl mx-auto space-y-5">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary">
          Lifestyle
        </span>
        <h2 className="font-headline text-4xl md:text-5xl text-primary">
          Espacios comunes
        </h2>
        <p className="font-body text-lg text-on-surface-variant">
          Rincones diseñados para compartir, disfrutar y relajarte,
          con vistas únicas de la ciudad.
        </p>
      </RevealOnScroll>

      <div className="px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map((item, i) => (
          <RevealOnScroll key={item.id} delay={i * 120}>
            <div className="group relative overflow-hidden rounded-3xl luxury-shadow aspect-video cursor-pointer bg-primary">
              <img
                src={item.imagenUrl}
                alt={item.titulo}
                className="w-full h-full object-cover transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent opacity-90 group-hover:from-primary/100 group-hover:via-secondary-container/15 transition-all duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 z-10">
                <div className="border-l-2 border-transparent group-hover:border-secondary pl-0 group-hover:pl-4 transition-all duration-500">
                  <h3 className="font-headline text-2xl text-on-primary tracking-wide">{item.titulo}</h3>
                  <p className="font-body text-sm text-on-primary/85 mt-2 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    {item.descripcion}
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
