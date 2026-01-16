import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Glow Up Challenge - 30 Jours pour Devenir la Meilleure Version de Toi-Même",
  description: "Transforme ta vie en 30 jours avec le Glow Up Challenge. Beauté, mindset, self-care et lifestyle dans une application premium au style Pinterest.",
  keywords: ["Glow Up", "Challenge", "Self-care", "Beauté", "Mindset", "Transformation personnelle", "Femme", "Bien-être"],
  authors: [{ name: "Glow Up Challenge" }],
  icons: {
    icon: "/logo.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "UPGLOW",
  },
  openGraph: {
    title: "Glow Up Challenge - 30 Jours de Transformation",
    description: "Une expérience premium pour devenir la meilleure version de toi-même",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glow Up Challenge - 30 Jours de Transformation",
    description: "Une expérience premium pour devenir la meilleure version de toi-même",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: "#fb7185",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="UPGLOW" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
