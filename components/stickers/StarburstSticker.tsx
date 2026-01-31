"use client";

import { motion } from "framer-motion";
import { easing, springs, stickerTransitions } from "@/lib/animation";

interface StarburstStickerProps {
  text: string;
  isVisible?: boolean;
  className?: string;
}

export default function StarburstSticker({
  text,
  isVisible = true,
  className = "absolute -right-4 md:-right-12 -top-12"
}: StarburstStickerProps) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.05}
      dragTransition={stickerTransitions.drag}
      whileHover={{ scale: 1.02, rotate: 2 }}
      whileTap={{ scale: 0.96 }}
      whileDrag={{ scale: 1.03 }}
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 1.02,
        rotate: [0, 3, -3, 0],
        y: [0, -6, 0],
      }}
      transition={{
        opacity: { duration: 0.15, ease: easing.iosOut },
        scale: { duration: 0.15, ease: easing.iosOut },
        rotate: stickerTransitions.float.rotate,
        y: stickerTransitions.float.y,
        default: springs.tap,
      }}
      className={`${className} cursor-grab active:cursor-grabbing scale-75 md:scale-100`}
    >
      <div className="relative w-[100px] h-[100px] md:w-[140px] md:h-[140px]">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md rotate-200"
        >
          <defs>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>
          <polygon
            points="50,5 57,30 66,23 64,35 80,28 71,40 90,38 75,49 96,52 80,59 94,70 77,70 86,85 70,77 74,95 60,82 57,99 50,84 43,99 40,82 26,95 30,77 14,85 23,70 6,70 20,59 4,52 25,49 10,38 29,40 20,28 36,35 34,23 43,30"
            fill="#D4AF37"
            filter="url(#shadow)"
          />
          <polygon
            points="50,7 56,30 65,24 63,35 79,29 70,40 89,38 76,48 95,51 79,58 92,68 78,69 85,83 71,76 73,93 61,81 58,97 50,83 42,97 39,81 27,93 29,76 15,83 22,69 8,68 21,58 5,51 24,48 11,38 30,40 21,29 37,35 35,24 44,30"
            fill="#1a1a1a"
          />
          <polygon
            points="50,10 54,31 62,26 61,36 75,33 70,43 85,42 77,50 90,52 79,58 88,66 79,67 84,80 72,74 73,90 62,79 58,95 50,82 42,95 38,79 27,90 28,74 16,80 21,67 12,66 21,58 10,52 23,50 15,42 30,43 25,33 39,36 38,26 46,31"
            fill="#DC2626"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center px-3 md:px-4 -translate-y-1 md:-translate-y-3 translate-x-1 md:translate-x-2">
          <span
            className="text-white font-black text-sm md:text-xl tracking-tight text-center leading-tight"
            style={{
              fontFamily: 'Impact, "Arial Black", sans-serif',
              WebkitTextStroke: "1.5px black",
              paintOrder: "stroke fill",
              transform: "rotate(-8deg)",
              display: "block",
            }}
          >
            {text}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
