import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Gestão de Estoque",
  description: "Desafio técnico para controle de equipamentos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-zinc-50 text-zinc-900 h-screen overflow-hidden">
        <div className="flex h-full w-full">
          <Sidebar />
          <main className="flex-1 ml-64 overflow-auto p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
