import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {width:"device-width",initialScale:1,viewportFit:"cover"};

export const metadata: Metadata = {
  title: "Éter Anima — O que o selo lembra",
  description: "Uma aventura em Stone Reach. Exploração integrada, diálogos anime e combate por turnos.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
