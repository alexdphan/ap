"use client";

import { createContext, useContext, useState, useRef, ReactNode } from "react";

interface Track {
  id: string;
  title: string;
  artist: string;
  spotifyTrackId: string;
  imageUrl: string;
}

interface MusicPlayerContextType {
  currentTrackIndex: number;
  isPlaying: boolean;
  currentTrack: Track;
  tracks: Track[];
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  hasInteracted: boolean;
  shouldOpenDropdown: boolean;
  setCurrentTrackIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setShouldOpenDropdown: (open: boolean) => void;
  setHasInteracted: (interacted: boolean) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  togglePlay: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(
  undefined
);

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldOpenDropdown, setShouldOpenDropdown] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Track list with Spotify track IDs for embeds
  const tracks: Track[] = [
    {
      id: "1",
      title: "I Wonder",
      artist: "Kanye West",
      spotifyTrackId: "3YRCqOhFifThpSRFJ1VWFM",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2738b82ad699e06fce5d8fa06ef",
    },
    {
      id: "2",
      title: "Flashing Lights",
      artist: "Kanye West",
      spotifyTrackId: "6tDqIE0hK8WpjZAIK5Jjsb",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2738b82ad699e06fce5d8fa06ef",
    },
    {
      id: "3",
      title: "I Like It",
      artist: "DeBarge",
      spotifyTrackId: "6FcYWXWTmMFB9BTr9vE7Rz",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273f3ed8f5b22d0f8d8e1c3e0e5",
    },
    {
      id: "4",
      title: "Out of Time",
      artist: "The Weeknd",
      spotifyTrackId: "2LBqCSwhJGcFQeTHMVGwy3",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2734ab2520c2c77a1d66b9ee21d",
    },
    {
      id: "5",
      title: "Leave the Door Open",
      artist: "Bruno Mars, Anderson .Paak, Silk Sonic",
      spotifyTrackId: "7MAibcTli4IisCtbHKrGMh",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273e9a375a0e5f2a5b3d0c4e7e3",
    },
    {
      id: "6",
      title: "Passionfruit",
      artist: "Drake",
      spotifyTrackId: "5mCPDVBb16L4XQwDdbRUpz",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273f907de96b9a4fbc04accc0d5",
    },
    {
      id: "7",
      title: "Pink + White",
      artist: "Frank Ocean",
      spotifyTrackId: "4bRFHhanVfXKIF4GKLmqRt",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2737e7e8bc0e3d76c6e5e2f0e3e",
    },
    {
      id: "8",
      title: "Sure Thing",
      artist: "Miguel",
      spotifyTrackId: "5lB5LAVjqByZJELJKdR7LE",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2736e8e8bc0e3d76c6e5e2f0e3e",
    },
    {
      id: "9",
      title: "Latch",
      artist: "Disclosure",
      spotifyTrackId: "3XVozq1aeqsJwpXrEZrDJ9",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2736e8e8bc0e3d76c6e5e2f0e3e",
    },
    {
      id: "10",
      title: "Versace on the Floor",
      artist: "Bruno Mars",
      spotifyTrackId: "5p7ujcrUXASCNwRaWNHR1C",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2734c6d69c3cec9eb6c7f5e5e3e",
    },
  ];

  const currentTrack = tracks[currentTrackIndex];

  const handlePrevious = () => {
    setHasInteracted(true);
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true); // Auto-play next track
  };

  const handleNext = () => {
    setHasInteracted(true);
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true); // Auto-play next track
  };

  const togglePlay = () => {
    setHasInteracted(true);
    setIsPlaying((prev) => !prev);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrackIndex,
        isPlaying,
        currentTrack,
        tracks,
        iframeRef,
        hasInteracted,
        shouldOpenDropdown,
        setCurrentTrackIndex,
        setIsPlaying,
        setShouldOpenDropdown,
        setHasInteracted,
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
