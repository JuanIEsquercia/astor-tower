import { getAdminDb } from "@/lib/firebase-admin";
import type { AvanceObra } from "@/lib/types";
import { parseYouTubeId, isYouTubeShort } from "@/components/admin/YouTubeInput";
import RevealOnScroll from "./RevealOnScroll";

async function getAvances(): Promise<AvanceObra[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("avance-obra").orderBy("fecha", "desc").get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AvanceObra));
  } catch {
    return [];
  }
}

function formatFecha(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${d} ${meses[parseInt(m, 10) - 1]} ${y}`;
}

export default async function AvanceObra() {
  const avances = await getAvances();

  if (avances.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-surface-variant" id="avance-obra">
      <RevealOnScroll className="px-margin-mobile md:px-margin-desktop mb-20 text-center max-w-4xl mx-auto space-y-5">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary">
          Obra en curso
        </span>
        <h2 className="font-headline text-4xl md:text-5xl text-primary">
          Avance de obra
        </h2>
        <p className="font-body text-lg text-on-surface-variant">
          Seguí el progreso de Astor Tower en tiempo real. Actualizaciones directas desde el sitio.
        </p>
      </RevealOnScroll>

      <div className="px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {avances.map((item, i) => {
          const videoId = parseYouTubeId(item.videoUrl ?? "");
          const short = isYouTubeShort(item.videoUrl ?? "");

          return (
            <RevealOnScroll key={item.id} delay={i * 100}>
              <article className="bg-background rounded-3xl overflow-hidden luxury-shadow flex flex-col">
                {videoId ? (
                  <div className={short ? "flex justify-center bg-zinc-900 py-4" : ""}>
                    <div
                      className={`overflow-hidden ${
                        short
                          ? "w-[200px] aspect-[9/16] rounded-2xl"
                          : "aspect-video"
                      }`}
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={item.titulo}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-zinc-100 flex items-center justify-center">
                    <span className="font-label text-xs uppercase tracking-widest text-zinc-400">Sin video</span>
                  </div>
                )}

                <div className="p-7 flex flex-col gap-3 flex-1">
                  <time
                    dateTime={item.fecha}
                    className="font-label text-xs uppercase tracking-[0.15em] text-secondary"
                  >
                    {formatFecha(item.fecha)}
                  </time>
                  <h3 className="font-headline text-xl text-primary leading-snug">
                    {item.titulo}
                  </h3>
                  {item.descripcion && (
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                      {item.descripcion}
                    </p>
                  )}
                </div>
              </article>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}
