import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MemoryVerse - AI Greeting Website Generator",
  description: "Turn your memories into beautiful surprise websites. Upload photos, write a personal message, and instantly share a animated magic greeting page with your loved ones.",
  openGraph: {
    title: "MemoryVerse - AI Greeting Website Generator",
    description: "Turn your memories into beautiful surprise websites. Upload photos, write a personal message, and instantly share an animated magic greeting page.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-heritage-white text-primary">
        {children}
      </body>
    </html>
  );
}
