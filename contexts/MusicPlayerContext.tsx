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
  ignoreYouTubeEventsRef: React.RefObject<boolean>;
  shouldAutoplayRef: React.MutableRefObject<boolean>;
  shouldOpenDropdown: boolean;
  hasInteracted: boolean;
  setCurrentVideoIndex: (index: number) => void;
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
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [shouldOpenDropdown, setShouldOpenDropdown] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false); // Track if user has ever played music
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const ignoreYouTubeEventsRef = useRef(false);
  const shouldAutoplayRef = useRef(false); // Track if next video should autoplay

  const videos = [
    {
      id: "MxEjnYdfLXU",
      title: "I Wonder",
      artist: "Kanye West",
    },
    {
      id: "O0Cw1SLdxxE",
      title: "Flashing Lights",
      artist: "Kanye West",
    },
    {
      id: "b5CngY0mGpk",
      title: "Recorddeals",
      artist: "1 9 0 5 - Topic",
    },
    { id: "2yaCAVDJF4w", title: "go", artist: "Karri · Kehlani" },
    // { id: "c2dJFshz3Bs", title: "JieJie", artist: "Karencici" },
    { id: "VqaKisKIyUo", title: "I Like It", artist: "DeBarge" },
    {
      id: "e5AyGmtIYJ8",
      title: "Can't Leave Alone",
      artist: "Pino, Avenoir, Maz B",
    },
    { id: "ax_fOTzsc1g", title: "Addicted", artist: "Naarly feat. TIMID." },
    { id: "kxgj5af8zg4", title: "Out of Time", artist: "The Weeknd" },
    {
      id: "wIyNAsmGrl0",
      title: "Leave the Door Open",
      artist: "Bruno Mars, Anderson .Paak, Silk Sonic",
    },
    {
      id: "PaSON7HvFao",
      title: "West Coast Love",
      artist: "Emotional Oranges",
    },
    { id: "O1Qh7j1yD8Y", title: "Baby Powder", artist: "Jenevieve" },
    {
      id: "le1QF3uoQNg",
      title: "Theme From New York, New York",
      artist: "Frank Sinatra",
    },
    { id: "KnkDL9lkbX8", title: "Hold On, We're Going Home", artist: "Drake" },
    { id: "COz9lDCFHjw", title: "Passionfruit", artist: "Drake" },
    { id: "nZSeA1-eZM8", title: "Because Of You", artist: "Ne-Yo" },
    { id: "3JbmE3jjCSk", title: "Versace on the Floor", artist: "Bruno Mars" },
    {
      id: "8PTDv_szmL0",
      title: "Nothin' On You",
      artist: "B.o.B feat. Bruno Mars",
    },
    {
      id: "Skbzy3BBTcM",
      title: "Rocketeer",
      artist: "Far East Movement feat. Ryan Tedder",
    },
    { id: "VNg3MxYKSi0", title: "Latch", artist: "Disclosure" },
    { id: "uzS3WG6__G4", title: "Pink + White", artist: "Frank Ocean" },
    { id: "6cucosmPj-A", title: "Every Breath You Take", artist: "The Police" },
    { id: "Tzu0302_Gzk", title: "Sure Thing", artist: "Miguel" },
    { id: "nVPK316k-Go", title: "Hello Miss Johnson", artist: "Jack Harlow" },
    { id: "HfWLgELllZs", title: "luther", artist: "Kendrick Lamar" },
    { id: "ejEzHE5ZMT8", title: "MUTT", artist: "Leon Thomas" },
    { id: "PymTCmXKcAk", title: "All Night Long", artist: "Mary J. Blige" },
    { id: "AkM-BgOpEhM", title: "Dee Green", artist: "Christian Kuria" },
    { id: "nq_ci6nqgXU", title: "Yacht Club Girl", artist: "Eliot Rhodes" },
    { id: "5BAh7bndQs0", title: "Painkiller", artist: "Ruel" },
    { id: "Uu7Uvwbl_Vs", title: "Face To Face", artist: "Ruel" },
    { id: "AiQiEiAPvUw", title: "Younger", artist: "Ruel" },
    { id: "4Jx6siXBe6Y", title: "Warm", artist: "SG Lewis" },
    {
      id: "Yeohq-Fapks",
      title: "Experience",
      artist: "Victoria Monét feat. Khalid & SG Lewis",
    },
    { id: "IqEt3o5HLfY", title: "Dreaming", artist: "SG Lewis" },
    { id: "K1B4rf-jB50", title: "One More", artist: "SG Lewis, Nile Rodgers" },
  ];

  const currentVideo = videos[currentVideoIndex];

  const handlePrevious = () => {
    setHasInteracted(true); // Mark that user has interacted
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setIsPlaying(true); // Update UI to playing state
    shouldAutoplayRef.current = true; // Flag that we should autoplay

    // Ignore YouTube events during video loading to prevent animation flicker
    ignoreYouTubeEventsRef.current = true;
    setTimeout(() => {
      ignoreYouTubeEventsRef.current = false;
    }, 1500); // Extended timeout for video loading and autoplay
  };

  const handleNext = () => {
    console.log('handleNext called!');
    setHasInteracted(true); // Mark that user has interacted
    shouldAutoplayRef.current = true; // Flag that we should autoplay FIRST
    console.log('Set shouldAutoplayRef.current to true');
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    setIsPlaying(true); // Update UI to playing state

    // Ignore YouTube events during video loading to prevent animation flicker
    ignoreYouTubeEventsRef.current = true;
    setTimeout(() => {
      ignoreYouTubeEventsRef.current = false;
    }, 1500); // Extended timeout for video loading and autoplay
  };

  const togglePlay = () => {
    setHasInteracted(true); // Mark that user has interacted
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Optimistically update state immediately for responsive UI
      const newState = !isPlaying;
      setIsPlaying(newState);

      // Temporarily ignore YouTube events to prevent conflicts
      ignoreYouTubeEventsRef.current = true;
      setTimeout(() => {
        ignoreYouTubeEventsRef.current = false;
      }, 500); // Increased timeout to prevent feedback loop

      // Send command to YouTube player
      const command = isPlaying
        ? '{"event":"command","func":"pauseVideo","args":""}'
        : '{"event":"command","func":"playVideo","args":""}';
      iframeRef.current.contentWindow.postMessage(command, "*");
    }
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentVideoIndex,
        isPlaying,
        currentVideo,
        videos,
        iframeRef,
        ignoreYouTubeEventsRef,
        shouldAutoplayRef,
        shouldOpenDropdown,
        hasInteracted,
        setCurrentVideoIndex,
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
