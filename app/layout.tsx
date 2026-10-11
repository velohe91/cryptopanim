import type { Metadata } from "next";
import { Press_Start_2P, Silkscreen } from "next/font/google";
import "./globals.css";

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

const ui = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  title: "CryptoPanim — Dressing Room",
  description: "Personaliza un avatar pixel-art por capas y guárdalo en este navegador.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${pixel.variable} ${ui.variable}`}>
      <body>{children}</body>
    </html>
  );
}
