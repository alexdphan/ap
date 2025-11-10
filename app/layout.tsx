"use client";

import { Geist, Geist_Mono, Playfair_Display, Lora } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import MiniMusicPlayer from "@/components/MiniMusicPlayer";
import MobileNav from "@/components/MobileNav";
import { usePathname } from "next/navigation";

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

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Layout */}
      <div
        className={`museum-grid-bg hidden md:block py-16 px-16 ${
          pathname === "/" ||
          pathname === "/inspiration" ||
          pathname === "/investments"
            ? "h-screen overflow-hidden"
            : "min-h-screen overflow-y-auto"
        }`}
      >
        {/* Fixed Sidebar */}
        <div className="fixed left-16 top-1/2 -translate-y-1/2 z-40">
          <Sidebar />
        </div>

        {/* Content Area - Centered */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-full max-w-3xl ${
            pathname === "/" ||
            pathname === "/inspiration" ||
            pathname === "/investments"
              ? "top-1/2 -translate-y-1/2"
              : "top-0"
          }`}
        >
          <div className="flex items-center justify-center">{children}</div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div
        className={`museum-grid-bg md:hidden flex justify-center px-8 ${
          pathname === "/" ||
          pathname === "/inspiration" ||
          pathname === "/investments"
            ? "h-screen items-center overflow-hidden"
            : "min-h-screen overflow-y-auto"
        }`}
      >
        <div className="flex flex-col gap-8 max-w-md w-full">{children}</div>
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
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${lora.variable} antialiased`}
      >
        <MusicPlayerProvider>
          <LayoutContent>{children}</LayoutContent>
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
