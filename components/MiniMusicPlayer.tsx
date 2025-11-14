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
    shouldAutoplayRef,
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
    console.log('Video changed to:', currentVideo.title, 'shouldAutoplay:', shouldAutoplayRef.current);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Load new video
      const loadMessage = `{"event":"command","func":"loadVideoById","args":["${currentVideo.id}"]}`;
      iframeRef.current.contentWindow.postMessage(loadMessage, "*");

      // Subscribe to all state changes
      setTimeout(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          const listenMessage = '{"event":"listening","channel":"widget"}';
          iframeRef.current.contentWindow.postMessage(listenMessage, "*");
          
          // Also subscribe to onStateChange events
          const addEventMessage = '{"event":"command","func":"addEventListener","args":["onStateChange"]}';
          iframeRef.current.contentWindow.postMessage(addEventMessage, "*");
        }
      }, 300);

      // Only autoplay if we should (set by handleNext/handlePrevious)
      if (shouldAutoplayRef.current) {
        console.log('Will attempt autoplay in 1000ms');
        shouldAutoplayRef.current = false; // Reset flag
        // Increased delay to ensure video is loaded before playing
        setTimeout(() => {
          if (iframeRef.current && iframeRef.current.contentWindow) {
            console.log('Sending play command');
            const playMessage =
              '{"event":"command","func":"playVideo","args":""}';
            iframeRef.current.contentWindow.postMessage(playMessage, "*");
          }
        }, 1000);
      }
    }
  }, [currentVideo.id, shouldAutoplayRef]); // Only depend on video ID change

  // Listen for YouTube player events to sync state
  useEffect(() => {
    let lastHandledState = -2;
    let stateChangeTimeout: NodeJS.Timeout | null = null;
    let checkEndInterval: NodeJS.Timeout | null = null;
    let lastCurrentTime = 0;
    let videoDuration = 0;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin === "https://www.youtube.com") {
        try {
          const data = JSON.parse(event.data);
          
          // Handle onStateChange events
          if (data.event === 'onStateChange' && typeof data.info === 'number') {
            const playerState = data.info;
            
            if (playerState === 0) {
              console.log('Video ENDED via onStateChange!');
              handleNext();
              return;
            }
          }
          
          if (data.info && typeof data.info.playerState !== "undefined") {
            const playerState = data.info.playerState;

            // NEVER ignore video end events (state 0)
            if (playerState === 0) {
              console.log('Video ended via playerState!');
              lastHandledState = playerState;
              handleNext();
              return;
            }

            // Skip updates if we're temporarily ignoring YouTube events
            if (ignoreYouTubeEventsRef.current) {
              return;
            }

            // Skip if we already handled this state recently
            if (playerState === lastHandledState && playerState !== 0) {
              return;
            }

            if (stateChangeTimeout) {
              clearTimeout(stateChangeTimeout);
            }

            stateChangeTimeout = setTimeout(() => {
              lastHandledState = playerState;

              if (playerState === 1) {
                setIsPlaying(true);
              } else if (playerState === 2) {
                setIsPlaying(false);
              }
            }, 100);
          }
          
          // Track current time and duration for manual end detection
          if (data.info) {
            if (typeof data.info.currentTime === 'number') {
              lastCurrentTime = data.info.currentTime;
            }
            if (typeof data.info.duration === 'number' && data.info.duration > 0) {
              videoDuration = data.info.duration;
            }
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    };

    // Check every 500ms if video has ended (backup mechanism)
    checkEndInterval = setInterval(() => {
      if (videoDuration > 0 && lastCurrentTime > 0) {
        // If we're within 0.3 seconds of the end, consider it ended
        if (lastCurrentTime >= videoDuration - 0.3) {
          console.log(`Video ended via time check! ${lastCurrentTime}/${videoDuration}`);
          handleNext();
          clearInterval(checkEndInterval!);
        }
      }
    }, 500);

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      if (stateChangeTimeout) {
        clearTimeout(stateChangeTimeout);
      }
      if (checkEndInterval) {
        clearInterval(checkEndInterval);
      }
    };
  }, [handleNext, setIsPlaying, ignoreYouTubeEventsRef, iframeRef]);

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
          src={`https://www.youtube.com/embed/${currentVideo.id}?enablejsapi=1&autoplay=0&controls=0&modestbranding=1&rel=0&showinfo=0&mute=0&disablekb=1&widgetid=1`}
          title="Music Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          allowFullScreen
          onLoad={() => {
            // Subscribe to player state changes when iframe loads
            if (iframeRef.current && iframeRef.current.contentWindow) {
              const message = '{"event":"listening","channel":"widget"}';
              iframeRef.current.contentWindow.postMessage(message, "*");
            }
          }}
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
              <div className="flex items-center gap-3 w-full md:w-[360px] h-[60px] md:h-[64px] px-4 py-3" style={{ backgroundColor: '#FFF6E5', border: '1px solid var(--gray-100)' }}>
                {/* Video Thumbnail - Left */}
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 md:w-11 md:h-11 bg-black overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ border: '1px solid var(--gray-100)' }}
                >
                  <img
                    src={`https://img.youtube.com/vi/${currentVideo.id}/mqdefault.jpg`}
                    alt={currentVideo.title}
                    className="w-full h-full object-cover scale-110"
                  />
                </div>

                {/* Song Title - Middle */}
                <div className="flex-1 min-w-0">
                  <p className="text-caption truncate leading-tight" style={{ color: 'var(--gray-900)' }}>
                    {currentVideo.title}
                  </p>
                </div>

                {/* Playback Controls - Right */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={handlePrevious}
                    className="hover:opacity-70 transition-opacity p-1"
                    style={{ color: 'var(--gray-700)' }}
                  >
                    <svg
                      className="w-4 h-4"
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
                          className="w-[2px]"
                          style={{ backgroundColor: 'var(--gray-900)' }}
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
                    className="hover:opacity-70 transition-opacity p-1"
                    style={{ color: 'var(--gray-700)' }}
                  >
                    <svg
                      className="w-4 h-4"
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
                    className="absolute top-full w-full max-h-[340px] md:max-h-[360px] overflow-y-auto scrollbar-hide"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                      backgroundColor: '#FFF6E5',
                      border: '1px solid var(--gray-100)',
                      borderTop: 'none',
                    }}
                  >
                    {videos.map((video, index) => (
                      <div
                        key={video.id}
                        onClick={() => {
                          setHasInteracted(true); // Mark that user has interacted
                          setCurrentVideoIndex(index);
                          setIsPlaying(true);
                          shouldAutoplayRef.current = true; // Flag to autoplay
                          setShowDropdown(false);

                          // Ignore YouTube events during video loading
                          ignoreYouTubeEventsRef.current = true;
                          setTimeout(() => {
                            ignoreYouTubeEventsRef.current = false;
                          }, 1500);
                        }}
                        className="flex items-center gap-3 p-3 cursor-pointer hover:opacity-70 transition-opacity"
                        style={{
                          borderBottom: '1px solid var(--gray-100)',
                          backgroundColor: index === currentVideoIndex ? 'var(--gray-100)' : 'transparent',
                        }}
                      >
                        {/* Thumbnail */}
                        <div className="w-9 h-9 bg-black overflow-hidden flex-shrink-0" style={{ border: '1px solid var(--gray-100)' }}>
                          <img
                            src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover scale-110"
                          />
                        </div>

                        {/* Song Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-caption truncate leading-tight" style={{ color: 'var(--gray-900)' }}>
                            {video.title}
                          </p>
                        </div>

                        {/* Playing indicator */}
                        {index === currentVideoIndex && (
                          <div className="flex items-center gap-[2px]">
                            <motion.div
                              className="w-[2px] h-2 rounded-full"
                              style={{ backgroundColor: 'var(--gray-900)' }}
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
                              className="w-[2px] h-2 rounded-full"
                              style={{ backgroundColor: 'var(--gray-900)' }}
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
                              className="w-[2px] h-2 rounded-full"
                              style={{ backgroundColor: 'var(--gray-900)' }}
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
