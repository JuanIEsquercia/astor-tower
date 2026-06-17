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

export interface SiteConfig {
  telefono: string;
  email: string;
  direccion: string;
  barrio: string;
  instagram: string;
  linkedin: string;
  footerDesc: string;
}
