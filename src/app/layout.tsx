import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextLevel - Gamifica tu Vida",
  description: "Convierte tus tareas cotidianas en una aventura",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
