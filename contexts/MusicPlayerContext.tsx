"use client";

import { createContext, useContext, useState, useRef, ReactNode, useEffect } from "react";

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
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fetch tracks from API on mount
  useEffect(() => {
    async function fetchTracks() {
      try {
        const response = await fetch('/api/playlist');
        const data = await response.json();
        setTracks(data.tracks);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tracks:', error);
        setLoading(false);
      }
    }
    fetchTracks();
  }, []);

  const currentTrack = tracks[currentTrackIndex] || {
    id: "1",
    title: "Loading...",
    artist: "Loading...",
    spotifyTrackId: "",
    imageUrl: "/disk.png"
  };

  if (loading || tracks.length === 0) {
    return (
      <MusicPlayerContext.Provider
        value={{
          currentTrackIndex: 0,
          isPlaying: false,
          currentTrack,
          tracks: [],
          iframeRef,
          hasInteracted: false,
          shouldOpenDropdown: false,
          setCurrentTrackIndex: () => {},
          setIsPlaying: () => {},
          setShouldOpenDropdown: () => {},
          setHasInteracted: () => {},
          handlePrevious: () => {},
          handleNext: () => {},
          togglePlay: () => {},
        }}
      >
        {children}
      </MusicPlayerContext.Provider>
    );
  }

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
