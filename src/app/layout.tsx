import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from '@/contexts/UserContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DLSpins - Modern Online Casino",
  description: "Experience the thrill of online gambling with DLSpins. Play bomb sweeper and other exciting casino games. Join now and get 1000 free coins!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white min-h-screen`}
      >
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
