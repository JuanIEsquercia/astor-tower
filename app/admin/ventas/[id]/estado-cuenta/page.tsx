"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer, Loader2, MessageCircle } from "lucide-react";
import type { Venta, Cuota, SiteConfig } from "@/lib/types";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function fmtFecha(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function fmtPeriodo(periodo: string) {
  const [y, m] = periodo.split("-");
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  return `${meses[Number(m) - 1]} ${y}`;
}

function fmtMonto(n: number | null, moneda: string) {
  if (n === null) return "—";
  return `${moneda} ${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function docId(ventaId: string) {
  const now = new Date();
  const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  return `EC-${yyyymm}-${ventaId.slice(0, 6).toUpperCase()}`;
}

/* ─── component ───────────────────────────────────────────────────────────── */

export default function EstadoCuentaPage() {
  const { id } = useParams() as { id: string };
  const [venta, setVenta] = useState<Venta | null>(null);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [vRes, cRes, cfRes] = await Promise.all([
      fetch(`/api/ventas/${id}`),
      fetch(`/api/ventas/${id}/cuotas`),
      fetch("/api/config"),
    ]);
    setVenta(await vRes.json());
    setCuotas(await cRes.json());
    setConfig(await cfRes.json());
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="text-zinc-300 animate-spin" />
      </div>
    );
  }

  if (!venta) return <div className="p-8 text-zinc-400">Venta no encontrada.</div>;

  // Una cuota es "confirmada" si no es ajustable, ya fue pagada,
  // o ya tuvo un porcentaje de actualización aplicado desde el panel.
  const isConfirmed = (cuota: Cuota) => {
    if (!venta.cuotasActualizables) return true;
    if (cuota.estado === "pagada") return true;
    return cuota.porcentajeAplicado != null;
  };

  const cuotasPagadas = cuotas.filter((c) => c.estado === "pagada").length;
  const saldoPendiente = cuotas
    .filter((c) => c.estado !== "pagada")
    .reduce((acc, c) => acc + (c.monto ?? 0), 0);
  const proxima = cuotas.find((c) => c.estado === "pendiente" || c.estado === "vencida");

  // Avance total: anticipo + cuotas pagadas sobre el valor de cierre
  const montoCuotasPagadas = cuotas
    .filter((c) => c.estado === "pagada")
    .reduce((acc, c) => acc + (c.monto ?? 0), 0);
  const totalPagado = venta.montoEntrega + montoCuotasPagadas;
  const pct = Math.min(100, Math.round((totalPagado / venta.valorCierre) * 100));
  const nroDocumento = docId(id);

  const whatsappText = encodeURIComponent(
    `Estimado/a ${venta.compradorNombre} ${venta.compradorApellido},\n\n` +
    `Le enviamos su estado de cuenta – *Astor Tower*.\n\n` +
    `📌 Unidad: ${venta.unidadNumero}\n` +
    `✅ Cuotas abonadas: ${cuotasPagadas}/${cuotas.length}\n` +
    `💰 Saldo pendiente: ${fmtMonto(saldoPendiente, venta.moneda)}\n` +
    (proxima ? `📅 Próximo vencimiento: ${fmtFecha(proxima.fechaVencimiento)}\n` : "") +
    `\nN° Doc: ${nroDocumento}\n\n` +
    `Para cualquier consulta comuníquese con nosotros.`
  );
  const whatsappUrl = venta.compradorTelefono
    ? `https://wa.me/${venta.compradorTelefono.replace(/\D/g, "")}?text=${whatsappText}`
    : `https://wa.me/?text=${whatsappText}`;

  return (
    <>
      {/* Barra de acciones — no se imprime */}
      <div className="print:hidden flex items-center justify-between px-8 py-4 bg-white border-b border-zinc-100 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href={`/admin/ventas/${id}`} className="admin-btn-ghost p-2">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p className="text-xs text-zinc-400">Estado de cuenta</p>
            <p className="text-sm font-semibold text-zinc-900">
              {venta.compradorNombre} {venta.compradorApellido} — Unidad {venta.unidadNumero}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn-ghost"
          >
            <MessageCircle size={15} />
            WhatsApp
          </a>
          <button onClick={() => window.print()} className="admin-btn-primary">
            <Printer size={15} />
            Imprimir / PDF
          </button>
        </div>
      </div>

      {/* Documento imprimible */}
      <div className="p-8 print:p-0 max-w-4xl mx-auto">
        <div
          className="bg-white print:shadow-none shadow-sm rounded-xl overflow-hidden"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          {/* Encabezado de marca */}
          <div style={{ backgroundColor: "#151413", color: "#fff", padding: "32px 40px" }}>
            <div className="flex items-end justify-between">
              <div>
                <p style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#a3a09c", textTransform: "uppercase", marginBottom: "6px" }}>
                  Estado de cuenta
                </p>
                <h1 style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
                  Astor Tower
                </h1>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "11px", color: "#C5A059", fontWeight: 600, margin: 0 }}>{nroDocumento}</p>
                <p style={{ fontSize: "11px", color: "#a3a09c", margin: "4px 0 0" }}>
                  Generado el {fmtFecha(new Date().toISOString().split("T")[0])}
                </p>
              </div>
            </div>
          </div>

          <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Datos del titular + unidad */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {/* Titular */}
              <div style={{ background: "#FAF8F5", borderRadius: "10px", padding: "20px" }}>
                <p style={{ fontSize: "10px", fontWeight: 600, color: "#8C867A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Titular</p>
                <p style={{ fontWeight: 700, fontSize: "16px", color: "#151413", margin: "0 0 4px" }}>
                  {venta.compradorNombre} {venta.compradorApellido}
                </p>
                <p style={{ fontSize: "13px", color: "#5C5852", margin: "0 0 2px" }}>DNI {venta.compradorDni}</p>
                {venta.compradorTelefono && <p style={{ fontSize: "13px", color: "#5C5852", margin: "0 0 2px" }}>{venta.compradorTelefono}</p>}
                {venta.compradorEmail && <p style={{ fontSize: "13px", color: "#5C5852", margin: 0 }}>{venta.compradorEmail}</p>}
              </div>

              {/* Operación */}
              <div style={{ background: "#FAF8F5", borderRadius: "10px", padding: "20px" }}>
                <p style={{ fontSize: "10px", fontWeight: 600, color: "#8C867A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Operación — Unidad {venta.unidadNumero}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {[
                    ["Precio acordado", fmtMonto(venta.valorCierre, venta.moneda)],
                    [`Anticipo (${venta.porcentajeEntrega}%)`, fmtMonto(venta.montoEntrega, venta.moneda)],
                    ["Saldo financiado", fmtMonto(venta.saldoCuotas, venta.moneda)],
                    ["Fecha boleto", fmtFecha(venta.fechaCierre)],
                    ...(venta.cuotasActualizables && venta.indiceActualizacion
                      ? [["Actualización", venta.indiceActualizacion]]
                      : []),
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <span style={{ color: "#5C5852" }}>{label}</span>
                      <span style={{ fontWeight: 600, color: "#151413" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resumen numérico destacado */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div style={{ background: "#FAF8F5", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
                <p style={{ fontSize: "24px", fontWeight: 700, color: "#151413", margin: "0 0 4px" }}>
                  {cuotasPagadas}/{cuotas.length}
                </p>
                <p style={{ fontSize: "11px", color: "#8C867A", margin: 0 }}>Cuotas abonadas</p>
              </div>
              <div style={{ background: "#FAF8F5", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#151413", margin: "0 0 4px" }}>
                  {fmtMonto(saldoPendiente, venta.moneda)}
                </p>
                <p style={{ fontSize: "11px", color: "#8C867A", margin: 0 }}>Saldo pendiente</p>
              </div>
              <div style={{ background: "#FAF8F5", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#151413", margin: "0 0 4px" }}>
                  {proxima ? fmtFecha(proxima.fechaVencimiento) : "—"}
                </p>
                <p style={{ fontSize: "11px", color: "#8C867A", margin: 0 }}>Próximo vencimiento</p>
              </div>
            </div>

            {/* Tabla de cuotas */}
            <div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #EDEAE3" }}>
                    {["N°", "Vencimiento", "Monto", "Actualiz.", "Estado"].map((h) => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "10px", fontWeight: 600, color: "#8C867A", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cuotas.map((cuota, idx) => {
                    const pagada = cuota.estado === "pagada";
                    const confirmada = isConfirmed(cuota);
                    const rowBg = pagada ? "#F0FDF4" : idx % 2 === 0 ? "#fff" : "#FAFAF9";
                    return (
                      <tr key={cuota.id} style={{ backgroundColor: rowBg, borderBottom: "1px solid #EDEAE3" }}>
                        <td style={{ padding: "9px 12px", color: "#8C867A", fontVariantNumeric: "tabular-nums" }}>
                          {cuota.numeroCuota}
                        </td>
                        <td style={{ padding: "9px 12px", color: "#1C1A17" }}>
                          {fmtFecha(cuota.fechaVencimiento)}
                        </td>
                        <td style={{ padding: "9px 12px", fontWeight: 600, color: "#1C1A17" }}>
                          {fmtMonto(cuota.monto, venta.moneda)}
                          {!pagada && !confirmada && cuota.monto !== null && (
                            <span style={{ fontSize: "10px", color: "#C5A059", marginLeft: "6px" }}>est.</span>
                          )}
                        </td>
                        <td style={{ padding: "9px 12px" }}>
                          {cuota.porcentajeAplicado != null ? (
                            <span style={{ fontSize: "11px", color: "#166534", background: "#f0fdf4", padding: "2px 7px", borderRadius: "999px", fontWeight: 600 }}>
                              +{cuota.porcentajeAplicado.toFixed(2)}%
                            </span>
                          ) : (
                            <span style={{ fontSize: "11px", color: "#D5D0C5" }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: "9px 12px" }}>
                          {pagada ? (
                            <span style={{ color: "#166534", fontWeight: 600, fontSize: "12px" }}>
                              ✓ Pagada{cuota.fechaPago ? ` · ${fmtFecha(cuota.fechaPago)}` : ""}
                            </span>
                          ) : cuota.estado === "vencida" ? (
                            <span style={{ color: "#991b1b", fontWeight: 600, fontSize: "12px" }}>⚠ Vencida</span>
                          ) : (
                            <span style={{ color: confirmada ? "#5C5852" : "#C5A059", fontSize: "12px" }}>
                              {confirmada ? "Pendiente" : "Pendiente · monto estimado"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {venta.cuotasActualizables && (
                <p style={{ fontSize: "10px", color: "#8C867A", marginTop: "8px", fontStyle: "italic" }}>
                  * Los montos marcados como «est.» son estimativos y se confirmarán al aplicar la actualización del índice {venta.indiceActualizacion} del período correspondiente.
                </p>
              )}
            </div>

            {/* Barra de progreso */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#8C867A", marginBottom: "6px" }}>
                <span>Avance de la operación (anticipo + cuotas abonadas)</span>
                <span style={{ fontWeight: 700, color: "#151413" }}>{pct}%</span>
              </div>
              <div style={{ background: "#EDEAE3", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: "#C5A059",
                    borderRadius: "999px",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>

            {/* Pie de documento */}
            <div style={{ borderTop: "1px solid #EDEAE3", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: "13px", color: "#151413", margin: "0 0 2px" }}>
                  {config?.footerDesc || "Astor Tower"}
                </p>
                {config?.telefono && (
                  <p style={{ fontSize: "12px", color: "#5C5852", margin: 0 }}>{config.telefono}</p>
                )}
                {config?.email && (
                  <p style={{ fontSize: "12px", color: "#5C5852", margin: 0 }}>{config.email}</p>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "10px", color: "#C5A059", fontWeight: 600, margin: "0 0 2px" }}>{nroDocumento}</p>
                <p style={{ fontSize: "10px", color: "#8C867A", margin: 0 }}>
                  {fmtPeriodo(new Date().toISOString().slice(0, 7))} · {cuotasPagadas}/{cuotas.length} cuotas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
