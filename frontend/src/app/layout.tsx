import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Postador Auto - Automacao de Redes Sociais",
  description: "Plataforma de automacao para publicacoes em redes sociais",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} min-h-screen bg-[hsl(var(--background))]`}>
        <div className="flex min-h-screen w-full">
          <Sidebar />
          <main className="flex-1 lg:ml-72 flex flex-col">
            <Header />
            <div className="flex-1">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
