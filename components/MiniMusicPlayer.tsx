"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { usePathname } from "next/navigation";

export default function MiniMusicPlayer() {
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    currentVideo,
    currentVideoIndex,
    isPlaying,
    iframeRef,
    videos,
    handlePrevious,
    handleNext,
    togglePlay,
    setIsPlaying,
    setCurrentVideoIndex,
    shouldOpenDropdown,
    setShouldOpenDropdown,
    ignoreYouTubeEventsRef,
    hasInteracted,
    setHasInteracted,
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

  // Update video when currentVideo changes, but don't reload iframe
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Load new video
      const loadMessage = `{"event":"command","func":"loadVideoById","args":["${currentVideo.id}"]}`;
      iframeRef.current.contentWindow.postMessage(loadMessage, "*");

      // Only autoplay if user has interacted and should be playing
      if (hasInteracted && isPlaying) {
        setTimeout(() => {
          if (iframeRef.current && iframeRef.current.contentWindow) {
            const playMessage =
              '{"event":"command","func":"playVideo","args":""}';
            iframeRef.current.contentWindow.postMessage(playMessage, "*");
          }
        }, 500);
      }

      // Request player state updates
      const listenMessage = '{"event":"listening","id":1,"channel":"widget"}';
      iframeRef.current.contentWindow.postMessage(listenMessage, "*");
    }
  }, [currentVideo.id, hasInteracted, isPlaying]);

  // Listen for YouTube player events to sync state
  useEffect(() => {
    let lastHandledState = -2; // Track last handled state to prevent duplicates
    let stateChangeTimeout: NodeJS.Timeout | null = null;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin === "https://www.youtube.com") {
        try {
          const data = JSON.parse(event.data);
          if (data.info && typeof data.info.playerState !== "undefined") {
            const playerState = data.info.playerState;
            // YouTube player states: -1 = unstarted, 0 = ended, 1 = playing, 2 = paused, 3 = buffering, 5 = cued

            // Skip updates if we're temporarily ignoring YouTube events (during manual toggle)
            if (ignoreYouTubeEventsRef.current) {
              return;
            }

            // Skip if we already handled this state recently (prevent duplicate events)
            if (playerState === lastHandledState && playerState !== 0) {
              return;
            }

            // Clear any pending state changes
            if (stateChangeTimeout) {
              clearTimeout(stateChangeTimeout);
            }

            // Debounce state changes slightly to avoid rapid flickering
            stateChangeTimeout = setTimeout(() => {
              lastHandledState = playerState;

              if (playerState === 0) {
                // Video ended - auto-advance and autoplay
                ignoreYouTubeEventsRef.current = true;
                setIsPlaying(true);
                handleNext();
                // Reset after longer timeout for video loading
                setTimeout(() => {
                  ignoreYouTubeEventsRef.current = false;
                }, 1500);
              } else if (playerState === 1) {
                // Video is playing - sync UI only if different
                setIsPlaying(true);
              } else if (playerState === 2) {
                // Video is paused - sync UI only if different
                setIsPlaying(false);
              }
            }, 100);
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      if (stateChangeTimeout) {
        clearTimeout(stateChangeTimeout);
      }
    };
  }, [handleNext, setIsPlaying, ignoreYouTubeEventsRef]);

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
      setShouldOpenDropdown(false); // Reset the trigger
    }
  }, [shouldOpenDropdown, setShouldOpenDropdown]);

  return (
    <>
      {/* Global iframe - always mounted in fixed position */}
      <div className="fixed top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none">
        <iframe
          ref={iframeRef}
          width="192"
          height="192"
          src={`https://www.youtube.com/embed/${currentVideo.id}?enablejsapi=1&autoplay=0&controls=0&modestbranding=1&rel=0&showinfo=0&mute=0&disablekb=1&widgetid=1&disablePictureInPicture=1`}
          title="Music Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          allowFullScreen
        />
      </div>

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
                {/* Video Thumbnail - Left */}
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-12 h-12 md:w-14 md:h-14 bg-black overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img
                    src={`https://img.youtube.com/vi/${currentVideo.id}/mqdefault.jpg`}
                    alt={currentVideo.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Song Title - Middle */}
                <div className="flex-1 min-w-0">
                  <p className="editorial-headline text-xs text-gray-900 truncate leading-tight">
                    {currentVideo.title}
                  </p>
                </div>

                {/* Playback Controls - Right */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handlePrevious}
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
                    onClick={togglePlay}
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
                    onClick={handleNext}
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
                    {videos.map((video, index) => (
                      <div
                        key={video.id}
                        onClick={() => {
                          setHasInteracted(true); // Mark that user has interacted
                          setCurrentVideoIndex(index);
                          setIsPlaying(true);
                          setShowDropdown(false);

                          // Ignore YouTube events during video loading
                          ignoreYouTubeEventsRef.current = true;
                          setTimeout(() => {
                            ignoreYouTubeEventsRef.current = false;
                          }, 1000);
                        }}
                        className={`
                        flex items-center gap-3 p-3 md:p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0
                        ${index === currentVideoIndex ? "bg-gray-50" : ""}
                      `}
                      >
                        {/* Thumbnail */}
                        <div className="w-10 h-10 md:w-11 md:h-11 bg-black overflow-hidden flex-shrink-0">
                          <img
                            src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Song Info */}
                        <div className="flex-1 min-w-0">
                          <p className="editorial-headline text-xs text-gray-900 truncate">
                            {video.title}
                          </p>
                          <p className="editorial-caption text-[10px] text-gray-500 truncate">
                            {video.artist}
                          </p>
                        </div>

                        {/* Playing indicator */}
                        {index === currentVideoIndex && (
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
