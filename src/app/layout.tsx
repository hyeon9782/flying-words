import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "../components/google-analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "날아라 한글!",
  description: "날아다니는 자음과 모음을 조합해서 숨겨진 단어를 맞춰보세요!",
  openGraph: {
    title: "날아라 한글!",
    description: "날아다니는 자음과 모음을 조합해서 숨겨진 단어를 맞춰보세요!",
    url: `https://flying-words.vercel.app`,
    images: [
      {
        url: `/images/날아라 한글!.png`,
        width: 1200,
        height: 630,
        alt: "날아라 한글!",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {gaId && <GoogleAnalytics gaId={gaId} />}
        {children}
      </body>
    </html>
  );
}
