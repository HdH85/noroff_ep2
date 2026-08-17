import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doctor appointment app",
  description: "Find your preferred doctor and location and book an appointment today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-background min-h-screen flex flex-col pt-20">
        <Header />
        <main className="flex-1">
          <div>
              <div className="relative w-full h-[200px] max-h-[50vh] bg-teal-900 flex items-center justify-center overflow-hidden">
                {/* <div className="absolute h-[100px] inset-0 bg-teal-950 z-0 mt-auto bg-transparent-50" /> */}
            
                <Image 
                  src="/EP2_logo.png"
                  alt="logo"
                  width={500}
                  height={500}
                  className="opacity-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  unoptimized
                />
              </div>
            </div>
          <div className="grid grid-cols-6 gap-4">
          <div className="col-start-1 col-span-6">{children}</div>
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
