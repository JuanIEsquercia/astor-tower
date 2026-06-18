import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Concepto from "@/components/landing/Concepto";
import Amenities from "@/components/landing/Amenities";
import Interiores from "@/components/landing/Interiores";
import Tipologias from "@/components/landing/Tipologias";
import AvanceObra from "@/components/landing/AvanceObra";
import Ubicacion from "@/components/landing/Ubicacion";
import InmobiliariasAutorizadas from "@/components/landing/InmobiliariasAutorizadas";
import Contacto from "@/components/landing/Contacto";
import Footer from "@/components/landing/Footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Residence",
  name: "Astor Tower",
  description:
    "Departamentos de 1 a 3 dormitorios en el barrio La Cruz, Corrientes Capital. Piscina, quincho y lifestyle premium. Inversión desde pozo.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://astortower.com",
  address: {
    "@type": "PostalAddress",
    streetAddress:   "Buenos Aires 1463",
    addressLocality: "Corrientes Capital",
    addressRegion:   "Corrientes",
    postalCode:      "W3400",
    addressCountry:  "AR",
  },
  geo: {
    "@type":    "GeoCoordinates",
    latitude:   -27.4806,
    longitude:  -58.8341,
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Piscina",              value: true },
    { "@type": "LocationFeatureSpecification", name: "Quincho y parrilla",   value: true },
    { "@type": "LocationFeatureSpecification", name: "Ascensor",             value: true },
  ],
  numberOfRooms: "1 a 3 dormitorios",
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main>
        <Hero />
        <Concepto />
        <Amenities />
        <Interiores />
        <Tipologias />
        <AvanceObra />
        <Ubicacion />
        <InmobiliariasAutorizadas />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
