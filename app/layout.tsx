import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shadcn-dir.vercel.app"),
  title: {
    default: "ShadCN Directory - Curated UI Component Archive",
    template: "%s | ShadCN Directory",
  },
  description:
    "A definitive catalog of premium components, templates, and UI kits built with shadcn/ui for modern web experiences.",
  keywords: [
    "shadcn",
    "shadcn ui",
    "ui components",
    "react components",
    "next.js templates",
    "tailwind css",
    "ui library",
    "component library",
    "design system",
    "open source",
  ],
  authors: [{ name: "Avijit" }],
  creator: "Avijit",
  publisher: "ShadCN Directory",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shadcn-dir.vercel.app",
    siteName: "ShadCN Directory",
    title: "ShadCN Directory - Curated UI Component Archive",
    description:
      "A definitive catalog of premium components, templates, and UI kits built with shadcn/ui for modern web experiences.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "ShadCN Directory Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShadCN Directory - Curated UI Component Archive",
    description:
      "A definitive catalog of premium components, templates, and UI kits built with shadcn/ui for modern web experiences.",
    images: ["/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://shadcn-dir.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <div className="flex flex-col min-h-screen relative">
            <Navbar />
            {children}
            <Footer />
          </div>
          <Toaster theme="dark" richColors />
        <Analytics />
      </body>
    </html>
  );
}
