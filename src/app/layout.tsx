import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "For Juzuuuu | An Interactive Poem",
  description: "A slow, immersive, and emotional love letter brought to life through nature. Dedicated to Juzuuuu.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // Allows content to extend under notch/home bar
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${cormorant.variable} ${playfair.variable} ${inter.variable} antialiased bg-[#070B14] text-[#F8FAFC] overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
