import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";

// Force dynamic rendering in production to avoid stale static cache on Vercel
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "면접코칭 AI",
  description: "대학 면접을 위한 AI 코칭 서비스",
  keywords: ["면접", "AI", "코칭", "대학 면접", "모의 면접", "인공지능", "면접 준비"],
  authors: [{ name: "면접코칭 AI" }],
  creator: "면접코칭 AI",
  publisher: "면접코칭 AI",
  openGraph: {
    title: "면접코칭 AI",
    description: "대학 면접을 위한 AI 코칭 서비스",
    images: [
      {
        url: "/OG.png",
        width: 1200,
        height: 630,
        alt: "면접코칭 AI - 대학 면접을 위한 AI 코칭 서비스",
      },
    ],
    locale: "ko_KR",
    type: "website",
    siteName: "면접코칭 AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "면접코칭 AI",
    description: "대학 면접을 위한 AI 코칭 서비스",
    images: ["/OG.png"],
    creator: "@interview_ai",
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <PageTransitionWrapper>
          {children}
        </PageTransitionWrapper>
      </body>
    </html>
  );
}
