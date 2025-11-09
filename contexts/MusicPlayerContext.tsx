"use client";

import { createContext, useContext, useState, useRef, ReactNode } from "react";

interface Video {
  id: string;
  title: string;
  artist: string;
}

interface MusicPlayerContextType {
  currentVideoIndex: number;
  isPlaying: boolean;
  currentVideo: Video;
  videos: Video[];
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  setCurrentVideoIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  togglePlay: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(
  undefined
);

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videos = [
    {
      id: "b5CngY0mGpk",
      title: "Recorddeals",
      artist: "1 9 0 5 - Topic",
    },
    { id: "2yaCAVDJF4w", title: "Song 2", artist: "Artist 2" },
    { id: "c2dJFshz3Bs", title: "Song 3", artist: "Artist 3" },
    { id: "gt_Oe2yGE4o", title: "Song 4", artist: "Artist 4" },
    { id: "e5AyGmtIYJ8", title: "Song 5", artist: "Artist 5" },
  ];

  const currentVideo = videos[currentVideoIndex];

  const handlePrevious = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setIsPlaying(true); // Always autoplay when switching
  };

  const handleNext = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    setIsPlaying(true); // Always autoplay when switching
  };

  const togglePlay = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const command = isPlaying
        ? '{"event":"command","func":"pauseVideo","args":""}'
        : '{"event":"command","func":"playVideo","args":""}';
      iframeRef.current.contentWindow.postMessage(command, "*");
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentVideoIndex,
        isPlaying,
        currentVideo,
        videos,
        iframeRef,
        setCurrentVideoIndex,
        setIsPlaying,
        handlePrevious,
        handleNext,
        togglePlay,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
}
