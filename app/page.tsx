import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Concepto from "@/components/landing/Concepto";
import Amenities from "@/components/landing/Amenities";
import Interiores from "@/components/landing/Interiores";
import Tipologias from "@/components/landing/Tipologias";
import Ubicacion from "@/components/landing/Ubicacion";
import InmobiliariasAutorizadas from "@/components/landing/InmobiliariasAutorizadas";
import Contacto from "@/components/landing/Contacto";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Concepto />
        <Amenities />
        <Interiores />
        <Tipologias />
        <Ubicacion />
        <InmobiliariasAutorizadas />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
