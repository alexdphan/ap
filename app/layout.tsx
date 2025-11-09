"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import MiniMusicPlayer from "@/components/MiniMusicPlayer";
import MobileNav from "@/components/MobileNav";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [startY, setStartY] = useState(0);

  const pages = ["/bio", "/now", "/work", "/inspiration", "/investments"];

  const currentIndex = pages.indexOf(pathname);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    const diffY = startY - endY;

    // Lower swipe threshold for easier navigation
    if (Math.abs(diffY) > 30) {
      if (diffY > 0 && currentIndex < pages.length - 1) {
        // Swipe up - next page
        router.push(pages[currentIndex + 1]);
      } else if (diffY < 0 && currentIndex > 0) {
        // Swipe down - previous page
        router.push(pages[currentIndex - 1]);
      }
    }
  };

  return (
    <>
      {/* Desktop Layout */}
      <div className="museum-grid-bg min-h-screen hidden md:flex items-center justify-center py-20 px-16">
        <div className="flex items-center gap-16 w-[650px]">
          <Sidebar />
          {children}
        </div>
      </div>

      {/* Mobile Layout - Full page swipeable */}
      <div
        className="museum-grid-bg min-h-screen md:hidden flex items-center justify-center py-20 px-8 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-col items-center gap-8 max-w-md w-full">
          {children}
        </div>
      </div>

      <MobileNav />
      <MiniMusicPlayer />
    </>
  );
}

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
        <MusicPlayerProvider>
          <LayoutContent>{children}</LayoutContent>
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
