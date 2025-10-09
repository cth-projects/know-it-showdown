import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

import { ThemeProvider } from "@/components/ThemeProvider";
import { PusherProvider } from "@/contexts/PusherContext";
import { AudioProvider } from "@/contexts/AudioContext";

export const metadata: Metadata = {
  title: "Know-it Showdown",
  description:
    "Know-It Showdown is a fast-paced trivia party game where players compete to prove their knowledge across diverse categories. Answer questions correctly to earn points, but watch out - wrong answers can cost you! Features multiple rounds with increasing difficulty, special power-ups, and head-to-head showdown moments where players can steal points from opponents. Perfect for 3-8 players who love testing their wits in a competitive, entertaining format. Categories range from pop culture and history to science and sports, ensuring something for everyone in this ultimate battle of brains!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable}`}>
      <body className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <PusherProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AudioProvider>
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </AudioProvider>
          </ThemeProvider>
        </PusherProvider>
      </body>
    </html>
  );
}
