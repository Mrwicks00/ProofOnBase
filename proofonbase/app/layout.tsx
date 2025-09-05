"use client";

import type React from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>ProofOnBase - ZKP-Enabled Decentralized Identity</title>
        <meta
          name="description"
          content="Zero-Knowledge Proof enabled decentralized identity management on Base Sepolia"
        />
      </head>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <Providers>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
