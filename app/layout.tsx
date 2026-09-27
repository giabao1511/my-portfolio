import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AnalyticsProvider } from "./components/analytics";
import { LenisProvider } from "./components/scroll/LenisProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Chau Gia Bao | Software Engineer",
    template: "%s | Chau Gia Bao",
  },
  description:
    "Software Engineer specializing in high-performance web platforms, TypeScript ecosystem, Next.js, and distributed systems. 4+ years experience in B2B SaaS, E-Commerce, and FinTech.",
  keywords: [
    "Software Engineer",
    "Full Stack Developer",
    "TypeScript",
    "Next.js",
    "React",
    "Vietnam",
    "Ho Chi Minh City",
  ],
  authors: [{ name: "Chau Gia Bao" }],
  creator: "Chau Gia Bao",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://giabao.dev",
    siteName: "Chau Gia Bao Portfolio",
    title: "Chau Gia Bao | Software Engineer",
    description:
      "Software Engineer specializing in high-performance web platforms, TypeScript ecosystem, Next.js, and distributed systems.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chau Gia Bao | Software Engineer",
    description:
      "Software Engineer specializing in high-performance web platforms.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <LenisProvider>
          {children}
        </LenisProvider>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
