import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppLayout from './AppLayout';
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skate Shop - Tienda de Skateboard",
  description: "La mejor tienda de skateboard online. Encuentra tablas, ruedas, trucks y más equipamiento de skate de las mejores marcas.",
  keywords: "skateboard, skate, tablas, ruedas, trucks, bearings, Element, Almost, Flip, Spitfire, Independent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-50 antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <AppLayout>{children}</AppLayout>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
