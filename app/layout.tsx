"use client";

import { Geist, Geist_Mono, Playfair_Display, Lora } from "next/font/google";
import "./globals.css";
import {
  MusicPlayerProvider,
  useMusicPlayer,
} from "@/contexts/MusicPlayerContext";
import MiniMusicPlayer from "@/components/MiniMusicPlayer";
import { usePathname } from "next/navigation";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

function LayoutContent({
  children,
  isDarkMode,
  setIsDarkMode,
}: {
  children: React.ReactNode;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}) {
  const pathname = usePathname();
  const { hasInteracted } = useMusicPlayer();

  // Show mini player on non-home pages if user has interacted
  const showMiniPlayer = pathname !== "/" && hasInteracted;

  return (
    <>
      {/* Desktop Layout - Box Model Structure */}
      <div
        className="museum-grid-bg hidden md:flex min-h-screen items-center justify-center overflow-y-auto overflow-x-hidden p-8"
        style={{
          backgroundColor: "var(--bg-outer)",
        }}
      >
        <div
          className="w-full max-w-4xl p-16 my-8 relative z-0"
          style={{
            backgroundColor: "var(--bg-content)",
            border: "1px solid var(--gray-100)",
          }}
        >
          {/* Triangle Tab - Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="absolute -top-0 -right-0 w-0 h-0 border-t-[30px] border-l-[30px] border-l-transparent hover:opacity-80 transition-all cursor-pointer"
            style={{
              borderTopColor: isDarkMode ? "#f5ebe0" : "#3a3a3a",
            }}
            aria-label="Toggle dark mode"
          />
          {children}
        </div>
      </div>

      {/* Mobile Layout - Box Model Structure */}
      <div
        className={`museum-grid-bg md:hidden min-h-screen overflow-y-auto overflow-x-hidden p-4 ${
          showMiniPlayer ? "pt-[76px]" : ""
        }`}
        style={{
          backgroundColor: "var(--bg-outer)",
        }}
      >
        <div
          className="p-8 my-4 relative z-0"
          style={{
            backgroundColor: "var(--bg-content)",
            border: "1px solid var(--gray-100)",
          }}
        >
          {/* Triangle Tab - Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="absolute -top-0 -right-0 w-0 h-0 border-t-[25px] border-l-[25px] border-l-transparent hover:opacity-80 transition-all cursor-pointer"
            style={{
              borderTopColor: isDarkMode ? "#f5ebe0" : "#3a3a3a",
            }}
            aria-label="Toggle dark mode"
          />
          {children}
        </div>
      </div>

      <MiniMusicPlayer />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <html lang="en" className={isDarkMode ? "dark" : ""}>
      <head>
        <meta name="theme-color" content={isDarkMode ? "#1a1512" : "#fff6e5"} />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <style>{`
          :root {
            color-scheme: ${isDarkMode ? "dark" : "light"};
          }
        `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${lora.variable} antialiased`}
      >
        <MusicPlayerProvider>
          <LayoutContent isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
            {children}
          </LayoutContent>
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
