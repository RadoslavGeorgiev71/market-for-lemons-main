import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import TaskInstructions from "@/components/layout/task-instructions";
import RevokeConsent from "@/components/layout/revoke-consent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Market for Lemons!",
  description: "An marketplace for AI-systems—lemons and non-lemons alike.",
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
        <TRPCReactProvider>
          {/* Absolute top left and top right task instructions and revoke consent button */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4">
            <TaskInstructions />
            <RevokeConsent />
          </div>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
