import type { Metadata, Viewport } from "next";
import { Barlow, Playfair_Display, UnifrakturMaguntia } from "next/font/google";
import { ES_PRODUCCION, URL_SITIO } from "@/lib/sitio";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});

// Tipografía gótica del bordado (D-015). Solo se usa en el monograma.
const gotica = UnifrakturMaguntia({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gotica",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITIO),
  title: "YAJOS · Camisas de alta costura con tus iniciales | CDMX",
  description:
    "Camisas slim con costura francesa y tus iniciales bordadas. Talla exacta por cuello, 20 colores de hilo. Entrega en 5 días hábiles en CDMX.",
  alternates: { canonical: "/" },
  robots: ES_PRODUCCION ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    title: "YAJOS · Camisas de alta costura con tus iniciales",
    description: "Talla exacta por cuello, 20 colores de hilo, entrega en CDMX.",
    type: "website",
    locale: "es_MX",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${playfair.variable} ${barlow.variable} ${gotica.variable}`}>
      <body>{children}</body>
    </html>
  );
}
