"use client";

import Float from "@/components/fancy/blocks/float";
import { motion, useSpring } from "framer-motion";
import { useState, useRef } from "react";
import { springs, easing } from "@/lib/animation";

export default function FloatingMusicPlayer() {
  const [showGif, setShowGif] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Snappy spring-based rotation for mouse tracking
  const rotateX = useSpring(0, springs.cardTrack);
  const rotateY = useSpring(0, springs.cardTrack);
  const scale = useSpring(1, springs.cardTrack);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const targetRotateX = ((y - centerY) / centerY) * -5;
    const targetRotateY = ((x - centerX) / centerX) * 5;

    rotateX.set(targetRotateX);
    rotateY.set(targetRotateY);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  const handleMouseEnter = () => {
    scale.set(1.01);
  };

  const handleToggleGif = () => {
    setShowGif((prev) => !prev);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div className="flex flex-col items-center justify-center w-40">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          ...springs.snappy,
          delay: 0.3,
          opacity: { duration: 0.15, delay: 0.3 },
        }}
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
            <motion.div
              className="artwork-card"
              style={{
                perspective: 1000,
                rotateX,
                rotateY,
                scale,
              }}
            >
              <div className="w-28 h-28 relative overflow-hidden bg-gray-100 magazine-frame">
                {showGif ? (
                  <img
                    src="/simpson.gif"
                    alt="Simpson"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full relative bg-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 text-xs">Music Player</div>
                  </div>
                )}
              </div>
            </motion.div>
          </Float>
        </div>
      </motion.div>
    </div>
  );
}
