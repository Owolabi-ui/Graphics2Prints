import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import ClientProviders from "@/components/Providers";
import { PaystackScript } from "./api/payment/components/PaystackScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata configuration
export const metadata: Metadata = {
  title: "Graphics2Prints",
  description: "Printing, Branding, Graphic Design, Gift items and more",
  keywords:
    "Graphics2Prints, Printing, Branding, Graphic Design, Gift items",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PaystackScript />
        <ClientProviders>
          <Header />
          {children}
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
