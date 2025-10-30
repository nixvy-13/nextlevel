import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextLevel - Mis Misiones",
  description: "Gestiona tus misiones y objetivos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full relative">
            <div className="absolute top-4 left-4 z-50">
              <SidebarTrigger className="bg-gray-900 hover:bg-gray-800 border-2 border-purple-500 hover:border-purple-400 text-purple-400 hover:text-purple-300 p-3 rounded-sm shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all" />
            </div>
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
