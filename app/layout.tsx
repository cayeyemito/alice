import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const waltographUI = localFont({
  src: "./fonts/waltographUI.ttf",
  variable: "--font-waltograph",
  display: "swap",
});

const floralCapital = localFont({
  src: "./fonts/FloralCapitals.ttf",
  variable: "--font-FloralCapitals",
  display: "swap",
});

const kingArthur = localFont({
  src: "./fonts/kingArthur.ttf",
  variable: "--font-kingArthur",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alicia en el Pais de las Maravillas",
  description:
    "Experiencia interactiva de Alicia en el Pais de las Maravillas con narrativa visual, animaciones y escenas inmersivas.",
  keywords: [
    "Alicia en el Pais de las Maravillas",
    "cuento interactivo",
    "Next.js",
    "GSAP",
    "Lenis",
    "storybook infantil",
  ],
};

import SceneProgressBar from "@/app/components/SceneProgressBar";
import { SceneProgressProvider } from "@/app/context/SceneProgressContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
      className={`${geistSans.variable} ${geistMono.variable} ${floralCapital.variable} ${waltographUI.variable} ${kingArthur.variable} antialiased`}>
        <SceneProgressProvider>
          <SceneProgressBar />
          {children}
        </SceneProgressProvider>
      </body>
    </html>
  );
}
