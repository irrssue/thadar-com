import type { Metadata } from "next";
import { Kalam, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const kalam = Kalam({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-kalam",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thadar — Student Platform",
  description: "Minimal student management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${kalam.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
