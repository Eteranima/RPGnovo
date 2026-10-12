import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaProvider } from "@/components/pwa-provider";

export const viewport: Viewport = {width:"device-width",initialScale:1,viewportFit:"cover",themeColor:"#0c1425"};

export const metadata: Metadata = {
  title: "Éter Anima — O que o selo lembra",
  description: "Uma aventura em Stone Reach. Exploração integrada, diálogos anime e combate por turnos.",
  manifest: "/manifest.webmanifest",
  applicationName: "Éter Anima",
  appleWebApp: { capable: true, title: "Éter Anima", statusBarStyle: "black-translucent" },
  icons: {
    icon: "/pwa/icon-192.png",
    shortcut: "/pwa/icon-192.png",
    apple: "/pwa/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased"><PwaProvider>{children}</PwaProvider></body>
    </html>
  );
}
