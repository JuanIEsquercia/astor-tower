import type { Metadata } from "next";
import { Libre_Caslon_Text, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const libreCaslon = Libre_Caslon_Text({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-libre-caslon",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
const gaId    = process.env.NEXT_PUBLIC_GA_ID;
const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:  "Astor Tower | Departamentos en Corrientes Capital",
    template: "%s | Astor Tower",
  },
  description:
    "Departamentos de 1 a 3 dormitorios en el barrio La Cruz, Corrientes Capital. Piscina, quincho y lifestyle premium. Inversión desde pozo en Buenos Aires 1463.",
  alternates: { canonical: "/" },
  openGraph: {
    title:       "Astor Tower | Departamentos en Corrientes Capital",
    description: "Departamentos de 1 a 3 dormitorios en el barrio La Cruz, Corrientes Capital. Piscina, quincho y lifestyle premium. Inversión desde pozo.",
    url:         "/",
    siteName:    "Astor Tower",
    locale:      "es_AR",
    type:        "website",
    images: [
      {
        url: "/og-image.png",
        alt: "Astor Tower — Desarrollo arquitectónico en Corrientes",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Astor Tower | Departamentos en Corrientes Capital",
    description: "Departamentos de 1 a 3 dormitorios en el barrio La Cruz, Corrientes Capital.",
    images:      ["/og-image.png"],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:              true,
      follow:             true,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${libreCaslon.variable} ${manrope.variable}`}>
      <body>
        {children}

        {/* GA4 — activo cuando NEXT_PUBLIC_GA_ID está configurado */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}</Script>
          </>
        )}

        {/* Meta Pixel — activo cuando NEXT_PUBLIC_META_PIXEL_ID está configurado */}
        {pixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
            n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
            s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${pixelId}');
            fbq('track','PageView');
          `}</Script>
        )}
      </body>
    </html>
  );
}
