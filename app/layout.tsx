import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Koinonia — Conecta tu fe con el mundo",
  description: "Conecta peregrinos y anfitriones católicos de todo el mundo.",
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