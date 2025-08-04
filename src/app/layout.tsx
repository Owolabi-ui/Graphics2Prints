import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import ClientProviders from "@/components/Providers";
import { PaystackScript } from "./api/payment/components/PaystackScript";
import WhatsAppButton from "@/components/WhatsappButton/WhatsAppButton";
import GlobalLoader from "@/components/GlobalLoader/GlobalLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
        className={`${inter.variable} antialiased`}
      >
        <PaystackScript />
        <ClientProviders>
          <GlobalLoader />
          <Header />
          {children}
          <Footer />
          <WhatsAppButton />
        </ClientProviders>
      </body>
    </html>
  );
}
