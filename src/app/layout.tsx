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
  title: "날아라 한글!",
  description: "날아다니는 자음과 모음을 조합해서 숨겨진 단어를 맞춰보세요!",
  openGraph: {
    title: "날아라 한글!",
    description: "날아다니는 자음과 모음을 조합해서 숨겨진 단어를 맞춰보세요!",
    url: `https://flying-words.vercel.app`,
    images: ["/images/날아라 한글!.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
