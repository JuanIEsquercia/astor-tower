import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminDb } from "@/lib/firebase-admin";
import type { Tipologia, Unidad } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

const ESTADO = {
  disponible: { label: "Disponible", bg: "#f0fdf4", text: "#166534", dot: "#16a34a" },
  reservada:  { label: "Reservada",  bg: "#fffbeb", text: "#92400e", dot: "#d97706" },
  vendida:    { label: "Vendida",    bg: "#fef2f2", text: "#991b1b", dot: "#dc2626" },
} as const;

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  try {
    const doc = await getAdminDb().collection("tipologias").doc(id).get();
    if (!doc.exists) return { title: "Tipología — Astor Tower" };
    const d = doc.data() as Tipologia;
    return {
      title: `${d.nombre} — Astor Tower`,
      description: d.descripcion || `Tipología ${d.nombre} en Astor Tower`,
    };
  } catch {
    return { title: "Astor Tower" };
  }
}

async function getData(id: string) {
  const db = getAdminDb();
  const [tipDoc, uSnap] = await Promise.all([
    db.collection("tipologias").doc(id).get(),
    db.collection("unidades").where("tipologiaId", "==", id).get(),
  ]);

  if (!tipDoc.exists) return null;

  const tipologia = { id: tipDoc.id, ...(tipDoc.data() as Omit<Tipologia, "id">) };
  const unidades = uSnap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Unidad, "id">) }))
    .sort((a, b) => a.piso - b.piso || a.numero.localeCompare(b.numero));

  return { tipologia, unidades };
}

export default async function TipologiaPage({ params }: Params) {
  const { id } = await params;

  let data: Awaited<ReturnType<typeof getData>>;
  try {
    data = await getData(id);
  } catch {
    notFound();
  }
  if (!data) notFound();

  const { tipologia: t, unidades } = data;
  const heroImg = t.imagenes?.[0];
  const galleryImgs = t.imagenes?.slice(1) ?? [];
  const disponibles = unidades.filter((u) => u.estado === "disponible").length;

  return (
    <div style={{ backgroundColor: "var(--brand-background)", minHeight: "100vh" }}>

      {/* ── Nav sticky ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255,248,243,0.85)",
          borderColor: "rgba(116,120,120,0.12)",
        }}
      >
        <div
          className="px-margin-mobile md:px-margin-desktop flex items-center justify-between"
          style={{ height: "64px" }}
        >
          <Link
            href="/#tipologias"
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: "var(--brand-on-surface-variant)" }}
          >
            <ArrowLeft size={15} />
            <span className="font-body">Volver</span>
          </Link>

          <span
            className="font-headline text-lg tracking-tight"
            style={{ color: "var(--brand-primary)" }}
          >
            Astor Tower
          </span>

          <Link
            href="/#contacto"
            className="font-label text-xs uppercase tracking-[0.15em] transition-all duration-300 rounded-full px-5 py-2"
            style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-on-primary)" }}
          >
            Consultar
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ height: "65vh" }}>
        {heroImg ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={heroImg}
            alt={t.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background:
                "linear-gradient(135deg, var(--brand-surface-container-high), var(--brand-surface-container))",
            }}
          />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 px-margin-mobile md:px-margin-desktop pb-12">
          <p
            className="font-label text-xs uppercase tracking-[0.25em] mb-2"
            style={{ color: "var(--brand-secondary-container)" }}
          >
            Tipología
          </p>
          <h1 className="font-headline text-white" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
            {t.nombre}
          </h1>
          <div className="flex flex-wrap gap-6 mt-4">
            {t.ambientes ? (
              <span className="font-body text-white/75">{t.ambientes} ambientes</span>
            ) : null}
            {t.m2 ? (
              <span className="font-body text-white/75">{t.m2} m²</span>
            ) : null}
            {t.banos ? (
              <span className="font-body text-white/75">{t.banos} baños</span>
            ) : null}
            {disponibles > 0 && (
              <span
                className="font-label text-xs uppercase tracking-[0.15em] px-3 py-1 rounded-full"
                style={{ backgroundColor: "#16a34a22", color: "#16a34a" }}
              >
                {disponibles} disponible{disponibles !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Descripción ── */}
      {t.descripcion && (
        <section className="py-20 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-2xl">
            <p
              className="font-label text-xs uppercase tracking-[0.2em] mb-4"
              style={{ color: "var(--brand-secondary)" }}
            >
              Descripción
            </p>
            <p
              className="font-body text-xl leading-relaxed"
              style={{ color: "var(--brand-on-surface-variant)" }}
            >
              {t.descripcion}
            </p>
          </div>
        </section>
      )}

      {/* ── Galería ── */}
      {galleryImgs.length > 0 && (
        <section className="py-8 pb-20 px-margin-mobile md:px-margin-desktop">
          <p
            className="font-label text-xs uppercase tracking-[0.2em] mb-8"
            style={{ color: "var(--brand-secondary)" }}
          >
            Galería
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImgs.map((url, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={i}
                src={url}
                alt={`${t.nombre} — imagen ${i + 2}`}
                className="w-full aspect-video object-cover rounded-2xl"
                style={{ boxShadow: "0 4px 20px rgba(140,131,118,0.10)" }}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Tour 360° ── */}
      {t.iframePanorama && (
        <section
          className="py-20"
          style={{ backgroundColor: "var(--brand-surface-container-low)" }}
        >
          <div className="px-margin-mobile md:px-margin-desktop">
            <p
              className="font-label text-xs uppercase tracking-[0.2em] mb-8"
              style={{ color: "var(--brand-secondary)" }}
            >
              Tour virtual 360°
            </p>
          </div>
          <div className="w-full aspect-video">
            <iframe
              src={t.iframePanorama}
              className="w-full h-full"
              allowFullScreen
              title={`Tour virtual — ${t.nombre}`}
            />
          </div>
        </section>
      )}

      {/* ── Unidades ── */}
      {unidades.length > 0 && (
        <section className="py-20 px-margin-mobile md:px-margin-desktop">
          <p
            className="font-label text-xs uppercase tracking-[0.2em] mb-2"
            style={{ color: "var(--brand-secondary)" }}
          >
            Unidades
          </p>
          <h2
            className="font-headline text-3xl mb-10"
            style={{ color: "var(--brand-primary)" }}
          >
            Disponibilidad
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unidades.map((u) => {
              const badge = ESTADO[u.estado];
              const dimmed = u.estado === "vendida";
              return (
                <div
                  key={u.id}
                  className="rounded-2xl p-6 transition-all duration-200"
                  style={{
                    backgroundColor: "var(--brand-surface-container-lowest)",
                    border: "1px solid var(--brand-outline-variant)",
                    opacity: dimmed ? 0.5 : 1,
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p
                        className="font-headline text-2xl"
                        style={{ color: "var(--brand-primary)" }}
                      >
                        {u.numero}
                      </p>
                      <p
                        className="font-body text-sm mt-0.5"
                        style={{ color: "var(--brand-on-surface-variant)" }}
                      >
                        Piso {u.piso}° · {u.orientacion.charAt(0) + u.orientacion.slice(1).toLowerCase()}
                      </p>
                    </div>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-label"
                      style={{ backgroundColor: badge.bg, color: badge.text }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: badge.dot }}
                      />
                      {badge.label}
                    </span>
                  </div>
                  <p
                    className="font-body text-lg font-medium"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    {u.precio ? `USD ${u.precio.toLocaleString("es-AR")}` : "A consultar"}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section
        className="py-24 px-margin-mobile md:px-margin-desktop text-center"
        style={{ backgroundColor: "var(--brand-inverse-surface)" }}
      >
        <p
          className="font-label text-xs uppercase tracking-[0.25em] mb-4"
          style={{ color: "var(--brand-secondary-container)" }}
        >
          ¿Le interesa esta tipología?
        </p>
        <h2
          className="font-headline text-3xl md:text-4xl mb-8"
          style={{ color: "var(--brand-inverse-on-surface)" }}
        >
          Hable con un asesor exclusivo
        </h2>
        <Link
          href="/#contacto"
          className="inline-block font-label text-xs uppercase tracking-[0.2em] rounded-full px-10 py-4 transition-all duration-300"
          style={{ backgroundColor: "var(--brand-secondary-container)", color: "var(--brand-on-secondary-container)" }}
        >
          Solicitar información
        </Link>
      </section>

    </div>
  );
}
