import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. Importamos os Providers que criamos
import { Providers } from "./providers";

// 2. Importamos os Toasters visuais
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// 3. Importamos o seu Layout antigo (Navbar/Footer)
// ⚠️ IMPORTANTE: Verifique se o caminho do seu Layout antigo está correto aqui:
import SiteLayout from "@/components/Layout"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spell Forger",
  description: "Comparador de Feitiços",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Envolvemos tudo com os Providers (Lógica) */}
        <Providers>
          
          {/* Colocamos o Layout Visual (Navbar) */}
          <SiteLayout>
             {children}
          </SiteLayout>

          {/* Colocamos os avisos flutuantes */}
          <Toaster />
          <Sonner />
          
        </Providers>
      </body>
    </html>
  );
}