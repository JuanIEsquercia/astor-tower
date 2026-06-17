import type { Metadata } from "next";
import { Libre_Caslon_Text, Manrope } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Astor Tower | Architectural Serenity",
  description:
    "Desarrollo arquitectónico exclusivo en el barrio La Cruz, Corrientes. Innovación y detalles orgánicos en una ubicación estratégica.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${libreCaslon.variable} ${manrope.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
