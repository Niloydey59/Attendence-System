import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SmartAttend - AI-Powered Attendance System | RUET",
  description:
    "Transform your classroom with our AI-powered facial recognition attendance system. Automated, accurate, and effortless attendance tracking for modern education.",
  keywords: [
    "attendance system",
    "facial recognition",
    "education",
    "RUET",
    "AI",
    "classroom management",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
