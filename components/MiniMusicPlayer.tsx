"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { usePathname } from "next/navigation";

export default function MiniMusicPlayer() {
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    currentTrack,
    currentTrackIndex,
    isPlaying,
    tracks,
    iframeRef,
    handlePrevious,
    handleNext,
    setCurrentTrackIndex,
    shouldOpenDropdown,
    setShouldOpenDropdown,
    hasInteracted,
    setHasInteracted,
    setIsPlaying,
  } = useMusicPlayer();

  const [showDropdown, setShowDropdown] = useState(false);
  const bars = 5;

  const getRandomHeights = () => {
    return Array.from({ length: bars }, () => Math.random() * 0.8 + 0.2);
  };

  const [heights, setHeights] = useState(getRandomHeights());

  useEffect(() => {
    if (isPlaying) {
      const waveformIntervalId = setInterval(() => {
        setHeights(getRandomHeights());
      }, 100);

      return () => {
        clearInterval(waveformIntervalId);
      };
    }
    setHeights(Array(bars).fill(0.1));
  }, [isPlaying]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, pathname]);

  // Open dropdown when requested from FloatingMusicPlayer
  useEffect(() => {
    if (shouldOpenDropdown) {
      setShowDropdown(true);
      setShouldOpenDropdown(false);
    }
  }, [shouldOpenDropdown, setShouldOpenDropdown]);

  // Load Spotify iFrame API and set up controller
  const embedControllerRef = useRef<any>(null);
  const hasLoadedAPIRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || hasLoadedAPIRef.current) return;
    
    // Don't initialize if tracks aren't loaded yet
    if (!currentTrack.spotifyTrackId || tracks.length === 0) {
      console.log("⏳ Waiting for tracks to load before initializing Spotify API...");
      return;
    }

    // Load the iFrame API script
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    
    script.onload = () => {
      console.log("✅ Spotify iFrame API script loaded");
    };

    document.body.appendChild(script);
    hasLoadedAPIRef.current = true;

    // Set up the callback for when the API is ready
    (window as any).onSpotifyIframeApiReady = (IFrameAPI: any) => {
      console.log("✅ Spotify iFrame API Ready");
      
      const element = iframeRef.current;
      if (!element) {
        console.error("❌ iframeRef element not found");
        return;
      }

      const options = {
        uri: `spotify:track:${currentTrack.spotifyTrackId}`,
        width: "100%",
        height: "152",
      };

      console.log("🎵 Creating controller with URI:", options.uri);

      IFrameAPI.createController(element, options, (EmbedController: any) => {
        embedControllerRef.current = EmbedController;
        console.log("✅ Embed Controller Created");

        // Listen to playback updates to sync state
        EmbedController.addListener("playback_update", (e: any) => {
          console.log("📊 Playback update:", e.data);
          
          // Sync play/pause state
          if (e.data.isPaused !== undefined) {
            setIsPlaying(!e.data.isPaused);
          }

          // Auto-advance to next track when current one ends
          if (e.data.position >= e.data.duration - 1 && e.data.duration > 0) {
            console.log("⏭️ Track ended, advancing to next");
            handleNext();
          }
        });

        EmbedController.addListener("ready", () => {
          console.log("✅ Embed player ready");
        });
      });
    };

    return () => {
      if (embedControllerRef.current) {
        embedControllerRef.current.destroy();
      }
    };
  }, [currentTrack.spotifyTrackId, tracks.length]); // Re-run when tracks are loaded

  // Handle track changes
  useEffect(() => {
    if (embedControllerRef.current && currentTrack.spotifyTrackId) {
      console.log(`🎵 Loading track: ${currentTrack.title}`);
      embedControllerRef.current.loadUri(`spotify:track:${currentTrack.spotifyTrackId}`);
    }
  }, [currentTrack.spotifyTrackId, currentTrack.title]);

  // Handle play/pause changes
  useEffect(() => {
    if (!embedControllerRef.current) return;

    if (isPlaying) {
      console.log("▶️ Playing");
      embedControllerRef.current.play().catch((err: any) => {
        console.warn("⚠️ Play failed (might need user interaction):", err);
      });
    } else {
      console.log("⏸️ Pausing");
      embedControllerRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <>
      {/* Hidden Spotify Embed Player - controlled by iFrame API */}
      <div 
        ref={iframeRef} 
        className="fixed top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none"
      />

      {/* Show mini player on non-home pages (only if user has interacted), or on home page when dropdown is open */}
      <AnimatePresence mode="wait">
        {((pathname !== "/" && hasInteracted) || showDropdown) && (
          <motion.div
            key="mini-player"
            className="fixed top-0 left-0 right-0 md:left-auto md:right-8 md:top-8 z-50"
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{
              type: "tween",
              ease: [0.16, 1, 0.3, 1],
              duration: 0.4,
            }}
          >
            <div ref={dropdownRef} className="relative">
              <div className="flex items-center gap-3 w-full md:w-[400px] h-[68px] md:h-[72px] border-b border-gray-100 p-4 bg-white">
                {/* Album Art - Left */}
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-12 h-12 md:w-14 md:h-14 bg-black overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img
                    src={currentTrack.imageUrl}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/disk.png";
                    }}
                  />
                </div>

                {/* Song Title - Middle */}
                <div className="flex-1 min-w-0">
                  <p className="editorial-headline text-xs text-gray-900 truncate leading-tight">
                    {currentTrack.title}
                  </p>
                </div>

                {/* Playback Controls - Right */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setHasInteracted(true);
                      console.log('Previous button clicked');
                      handlePrevious();
                    }}
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                    </svg>
                  </button>

                  <motion.div
                    onClick={() => {
                      setHasInteracted(true);
                      console.log('Play/Pause clicked, current state:', isPlaying);
                      setIsPlaying(!isPlaying);
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer px-3 py-1.5 flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex h-[14px] md:h-[16px] items-center gap-[2px]"
                    >
                      {/* Waveform visualization */}
                      {heights.map((height, index) => (
                        <motion.div
                          key={index}
                          className="bg-gray-900 w-[2px]"
                          initial={{ height: 2 }}
                          animate={{
                            height: Math.max(4, height * 16),
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 10,
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>

                  <button
                    onClick={() => {
                      setHasInteracted(true);
                      console.log('Next button clicked');
                      handleNext();
                    }}
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Dropdown Song List */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full w-full bg-white border-b border-gray-100 max-h-[340px] md:max-h-[360px] overflow-y-auto scrollbar-hide"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {tracks.map((track, index) => (
                      <div
                        key={track.id}
                        onClick={() => {
                          setHasInteracted(true);
                          setCurrentTrackIndex(index);
                          setIsPlaying(true);
                          setShowDropdown(false);
                        }}
                        className={`
                        flex items-center gap-3 p-3 md:p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0
                        ${index === currentTrackIndex ? "bg-gray-50" : ""}
                      `}
                      >
                        {/* Thumbnail */}
                        <div className="w-10 h-10 md:w-11 md:h-11 bg-black overflow-hidden flex-shrink-0">
                          <img
                            src={track.imageUrl}
                            alt={track.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/disk.png";
                            }}
                          />
                        </div>

                        {/* Song Info */}
                        <div className="flex-1 min-w-0">
                          <p className="editorial-headline text-xs text-gray-900 truncate">
                            {track.title}
                          </p>
                          <p className="editorial-caption text-[10px] text-gray-500 truncate">
                            {track.artist}
                          </p>
                        </div>

                        {/* Playing indicator */}
                        {index === currentTrackIndex && (
                          <div className="flex items-center gap-[2px]">
                            <motion.div
                              className="w-[2px] h-2 bg-gray-900 rounded-full"
                              animate={{
                                height: isPlaying ? [8, 4, 8] : 4,
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "linear",
                                repeatType: "reverse",
                              }}
                            />
                            <motion.div
                              className="w-[2px] h-2 bg-gray-900 rounded-full"
                              animate={{
                                height: isPlaying ? [4, 8, 4] : 4,
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "linear",
                                repeatType: "reverse",
                                delay: 0.27,
                              }}
                            />
                            <motion.div
                              className="w-[2px] h-2 bg-gray-900 rounded-full"
                              animate={{
                                height: isPlaying ? [8, 4, 8] : 4,
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "linear",
                                repeatType: "reverse",
                                delay: 0.53,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
