"use client";

import Float from "@/components/fancy/blocks/float";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

export default function FloatingMusicPlayer() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    currentVideo,
    isPlaying,
    iframeRef,
    handlePrevious,
    handleNext,
    togglePlay,
    setShouldOpenDropdown,
  } = useMusicPlayer();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setMousePosition({ x: rotateY, y: rotateX });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleToggleGif = () => {
    // console.log("Toggling GIF, current state:", showGif);
    setShowGif((prev) => !prev);
    // Reset tilt on click for easier interaction
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.5, ease: "easeOut" }}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleToggleGif}
          className="cursor-pointer"
        >
          <Float speed={0.6} amplitude={[3, 8, 8]} rotationRange={[3, 3, 2]}>
            <div
              className="artwork-card"
              style={{
                transform: `perspective(1000px) rotateX(${
                  mousePosition.y
                }deg) rotateY(${mousePosition.x}deg) scale(${
                  isHovered ? 1.01 : 1
                })`,
                transition: isHovered
                  ? "transform 0.15s ease-out"
                  : "transform 0.5s ease-out",
              }}
            >
              <div className="w-48 h-48 shadow-2xl relative overflow-hidden bg-gray-100">
                {/* Toggle between YouTube thumbnail and simpson.gif */}
                {showGif ? (
                  <img
                    src="/simpson.gif"
                    alt="Simpson"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full relative">
                    <img
                      src={`https://img.youtube.com/vi/${currentVideo.id}/hqdefault.jpg`}
                      alt={currentVideo.title}
                      className="w-full h-full object-cover pointer-events-none scale-110"
                      onError={(e) => {
                        e.currentTarget.src = `https://img.youtube.com/vi/${currentVideo.id}/mqdefault.jpg`;
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Float>
        </div>
      </motion.div>
      <motion.div
        className="pt-6 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.7, ease: "easeOut" }}
      >
        {/* Song Title */}
        <div className="text-center">
          <p
            className="editorial-headline text-[11px] text-gray-900 cursor-pointer hover:text-gray-600 transition-colors"
            onClick={() => setShouldOpenDropdown(true)}
          >
            {currentVideo.title}
          </p>
          <p
            className="editorial-caption text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
            onClick={() => setShouldOpenDropdown(true)}
          >
            {currentVideo.artist}
          </p>
        </div>

        {/* Music Controls */}
        <MusicControls
          onPrevious={handlePrevious}
          onNext={handleNext}
          onTogglePlay={togglePlay}
          isPlaying={isPlaying}
        />
      </motion.div>
    </div>
  );
}

interface MusicControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  isPlaying: boolean;
}

const MusicControls = ({
  onPrevious,
  onNext,
  onTogglePlay,
  isPlaying,
}: MusicControlsProps) => {
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

  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        className="w-7 h-7 flex items-center justify-center rounded-full transition-all "
      >
        <svg
          className="w-5 h-5 text-gray-700"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
        </svg>
      </button>

      {/* Play/Pause Waveform Button */}
      <motion.div
        onClick={onTogglePlay}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="cursor-pointer px-3 py-1.5 flex items-center justify-center "
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

      {/* Next Button */}
      <button
        onClick={onNext}
        className="w-7 h-7 flex items-center justify-center rounded-full transition-all "
      >
        <svg
          className="w-5 h-5 text-gray-700"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
      </button>
    </div>
  );
};
