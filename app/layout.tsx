"use client";

import { Geist, Geist_Mono, Playfair_Display, Lora } from "next/font/google";
import "./globals.css";
import { MusicPlayerProvider, useMusicPlayer } from "@/contexts/MusicPlayerContext";
import MiniMusicPlayer from "@/components/MiniMusicPlayer";
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
  const { hasInteracted } = useMusicPlayer();
  
  // Show mini player on non-home pages if user has interacted
  const showMiniPlayer = pathname !== "/" && hasInteracted;

  return (
    <>
      {/* Desktop Layout - Box Model Structure */}
      <div className="museum-grid-bg hidden md:flex min-h-screen items-center justify-center overflow-y-auto overflow-x-hidden p-8">
        <div className="w-full max-w-4xl p-16 my-8 relative z-0" style={{ backgroundColor: '#FFF6E5', border: '1px solid var(--gray-100)' }}>
          {children}
        </div>
      </div>

      {/* Mobile Layout - Box Model Structure */}
      <div className={`museum-grid-bg md:hidden min-h-screen overflow-y-auto overflow-x-hidden p-4 ${showMiniPlayer ? 'pt-[76px]' : ''}`}>
        <div className="p-8 my-4 relative z-0" style={{ backgroundColor: '#FFF6E5', border: '1px solid var(--gray-100)' }}>
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
