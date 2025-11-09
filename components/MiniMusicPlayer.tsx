"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { usePathname } from "next/navigation";

export default function MiniMusicPlayer() {
  const pathname = usePathname();

  const {
    currentVideo,
    isPlaying,
    iframeRef,
    handlePrevious,
    handleNext,
    togglePlay,
    setIsPlaying,
  } = useMusicPlayer();

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
      // Load new video and autoplay if isPlaying is true
      const loadMessage = `{"event":"command","func":"loadVideoById","args":["${currentVideo.id}"]}`;
      iframeRef.current.contentWindow.postMessage(loadMessage, "*");

      // If we should be playing, send play command after loading
      if (isPlaying) {
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
  }, [currentVideo.id, isPlaying]);

  // Listen for YouTube player events to sync state
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === "https://www.youtube.com") {
        try {
          const data = JSON.parse(event.data);
          if (data.info && typeof data.info.playerState !== "undefined") {
            const playerState = data.info.playerState;
            // YouTube player states: -1 = unstarted, 0 = ended, 1 = playing, 2 = paused, 3 = buffering, 5 = cued

            if (playerState === 0) {
              // Video ended - auto-advance and autoplay
              setIsPlaying(true);
              handleNext();
            } else if (playerState === 1) {
              // Video is playing - sync UI
              setIsPlaying(true);
            } else if (playerState === 2) {
              // Video is paused - sync UI
              setIsPlaying(false);
            }
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleNext, setIsPlaying]);

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
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Show mini player on non-bio pages when music is playing */}
      <AnimatePresence mode="wait">
        {pathname !== "/bio" && isPlaying && (
          <motion.div
            key="mini-player"
            className="fixed top-8 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-50"
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{
              type: "tween",
              ease: [0.16, 1, 0.3, 1],
              duration: 0.4,
            }}
          >
            <div className="flex items-center gap-3 w-[340px] h-[68px] border border-gray-100 p-4 ">
              {/* Video Thumbnail - Left */}
              <div className="w-12 h-12 bg-black  overflow-hidden flex-shrink-0">
                <img
                  src={`https://img.youtube.com/vi/${currentVideo.id}/mqdefault.jpg`}
                  alt={currentVideo.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Song Title - Middle */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate leading-tight">
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
                  className="cursor-pointer px-3 py-1.5 flex items-center justify-center rounded-lg "
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-[14px] items-center gap-[2px]"
                  >
                    {/* Waveform visualization */}
                    {heights.map((height, index) => (
                      <motion.div
                        key={index}
                        className="bg-gray-900 w-[2px] rounded-full"
                        initial={{ height: 2 }}
                        animate={{
                          height: Math.max(4, height * 14),
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
