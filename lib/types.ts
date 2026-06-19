export interface Tipologia {
  id: string;
  nombre: string;
  descripcion: string;
  m2: number;
  ambientes: number;
  banos: number;
  imagenes: string[];
  iframePanorama: string;
  orden: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Unidad {
  id: string;
  numero: string;
  piso: number;
  tipologiaId: string;
  tipologiaNombre: string;
  precio: number | null;
  estado: "disponible" | "reservada" | "vendida";
  orientacion: "FRENTE" | "INTERNO" | "CONTRAFRENTE";
  createdAt?: string;
  updatedAt?: string;
}

export interface AmenityItem {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  orden: number;
}

export interface MensajeContacto {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  mensaje: string;
  leido: boolean;
  createdAt: string;
}

export interface Desarrollador {
  id: string;
  nombre: string;
  logoUrl: string;
  orden: number;
}

export interface Inmobiliaria {
  id: string;
  nombre: string;
  logoUrl: string;
  telefono: string;
  orden: number;
  activa: boolean;
}

export interface AvanceObra {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string; // ISO date string YYYY-MM-DD
  videoUrl: string;
  orden: number;
}

export interface SiteConfig {
  telefono: string;
  email: string;
  direccion: string;
  barrio: string;
  instagram: string;
  linkedin: string;
  footerDesc: string;
}

export type Rol = "superadmin" | "usuario";

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
  activo: boolean;
  createdAt?: string;
}

export type Moneda = "USD" | "ARS";
export type IndiceActualizacion = "CAC" | "IPC" | "UVA" | "Dólar oficial" | "Otro";
export type EstadoCuota = "pendiente" | "pagada" | "vencida";

export interface Venta {
  id: string;
  // Titular
  compradorNombre: string;
  compradorApellido: string;
  compradorDni: string;
  compradorTelefono: string;
  compradorEmail: string;
  // Unidad
  unidadId: string;
  unidadNumero: string;
  // Operación
  valorCierre: number;
  moneda: Moneda;
  porcentajeEntrega: number;
  montoEntrega: number;
  saldoCuotas: number;
  cantidadCuotas: number;
  cuotasActualizables: boolean;
  indiceActualizacion: string | null;
  fechaCierre: string; // YYYY-MM-DD
  createdAt?: string;
  updatedAt?: string;
}

export interface Cuota {
  id: string;
  ventaId: string;
  numeroCuota: number;
  fechaVencimiento: string; // YYYY-MM-DD
  monto: number | null;
  estado: EstadoCuota;
  fechaPago: string | null; // YYYY-MM-DD, se registra al marcar como pagada
  porcentajeAplicado: number | null; // último % de índice aplicado a esta cuota
  createdAt?: string;
  updatedAt?: string;
}

export interface IndiceHistorial {
  id: string;
  periodo: string; // YYYY-MM
  porcentaje: number; // e.g. 2.5 representa 2.5%
  indiceNombre: string; // CAC, IPC, UVA, etc.
  cuotasActualizadas: number;
  aplicadoPor?: string;
  createdAt?: string;
}
