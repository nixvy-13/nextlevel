import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { ClerkProvider } from '@clerk/nextjs'
import { ChevronRight } from "lucide-react";

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
    <ClerkProvider>
      <html lang="es">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
        >
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full flex flex-col">
              <div className="sticky top-0 z-40 w-full bg-black border-b-2 border-purple-500/30">
                <div className="flex items-center h-[72px] px-4 md:px-8 gap-4">
                  <div className="flex-shrink-0">
                    <SidebarTrigger className="bg-gray-900 hover:bg-gray-800 border-2 border-purple-500 hover:border-purple-400 text-purple-400 hover:text-purple-300 p-2 rounded-sm shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </SidebarTrigger>
                  </div>
                  <div className="flex-1">
                    <AppHeader />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                {children}
              </div>
            </main>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
