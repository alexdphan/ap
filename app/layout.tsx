"use client";

import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
// import {
//   MusicPlayerProvider,
//   useMusicPlayer,
// } from "@/contexts/MusicPlayerContext";
// import MiniMusicPlayer from "@/components/MiniMusicPlayer";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
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
  // const { hasInteracted } = useMusicPlayer();

  // Show mini player on non-home pages if user has interacted
  const showMiniPlayer = false; // pathname !== "/" && hasInteracted;

  return (
    <>
      {/* Desktop Layout - Box Model Structure */}
      <div
        className=" md:flex min-h-screen overflow-y-auto overflow-x-hidden justify-center"
        style={{
          backgroundColor: "var(--bg-outer)",
        }}
      >
        <div
          className="w-full max-w-lg mx-auto px-8 py-16 relative z-0"
          style={{
            backgroundColor: "var(--bg-content)",
            // border: "1px solid var(--gray-100)",
          }}
        >
          {/* Triangle Tab - Dark Mode Toggle */}
          {/* <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="absolute -top-0 -right-0 w-0 h-0 border-t-[30px] border-l-[30px] border-l-transparent hover:opacity-80 transition-all cursor-pointer"
            style={{
              borderTopColor: isDarkMode ? "#f5ebe0" : "#3a3a3a",
            }}
            aria-label="Toggle dark mode"
          /> */}
          {children}
        </div>
      </div>

      {/* Mobile Layout - Box Model Structure */}
      <div
        className={`museum-grid-bg md:hidden min-h-screen overflow-y-auto overflow-x-hidden pt-4 flex justify-center ${
          showMiniPlayer ? "pt-[76px]" : ""
        }`}
        style={{
          backgroundColor: "var(--bg-outer)",
        }}
      >
        <div
          className="px-4 py-16 relative z-0 w-full max-w-lg mx-auto"
          style={{
            backgroundColor: "var(--bg-content)",
            // border: "1px solid var(--gray-100)",
          }}
        >
          {/* Triangle Tab - Dark Mode Toggle */}
          {/* <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="absolute -top-0 -right-0 w-0 h-0 border-t-[25px] border-l-[25px] border-l-transparent hover:opacity-80 transition-all cursor-pointer"
            style={{
              borderTopColor: isDarkMode ? "#f5ebe0" : "#3a3a3a",
            }}
            aria-label="Toggle dark mode"
          /> */}
          {children}
        </div>
      </div>

      {/* <MiniMusicPlayer /> */}
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect system dark mode preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Set initial value
    setIsDarkMode(mediaQuery.matches);

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Update theme-color meta tag when dark mode changes
  useEffect(() => {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }

    metaThemeColor.setAttribute("content", isDarkMode ? "#121212" : "#fff6e5");
  }, [isDarkMode]);

  // Set up meta tags on mount
  useEffect(() => {
    // Apple mobile web app status bar
    let metaApple = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    );
    if (!metaApple) {
      metaApple = document.createElement("meta");
      metaApple.setAttribute("name", "apple-mobile-web-app-status-bar-style");
      document.head.appendChild(metaApple);
    }
    metaApple.setAttribute("content", "black-translucent");

    // Set color-scheme on root
    document.documentElement.style.colorScheme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  return (
    <html lang="en" className={isDarkMode ? "dark" : ""}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        {/* <MusicPlayerProvider> */}
        <LayoutContent isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
          {children}
        </LayoutContent>
        {/* </MusicPlayerProvider> */}
      </body>
    </html>
  );
}
