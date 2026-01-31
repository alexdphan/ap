"use client";

import { motion } from "framer-motion";
import { easing, springs, stickerTransitions } from "@/lib/animation";

interface TicketStickerProps {
  from: string;
  to: string;
  distance: string;
  duration: string;
  leftNumber?: string;
  rightNumber?: string;
  isVisible?: boolean;
  className?: string;
}

export default function TicketSticker({
  from,
  to,
  distance,
  duration,
  leftNumber = "01234",
  rightNumber = "23210",
  isVisible = true,
  className = "absolute -right-2 -top-4 md:-right-6 md:top-16 z-40 -rotate-6",
}: TicketStickerProps) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.05}
      dragTransition={stickerTransitions.drag}
      whileHover={{ scale: 1.02, rotate: -4 }}
      whileTap={{ scale: 0.96 }}
      whileDrag={{ scale: 1.03 }}
      initial={{ opacity: 0, scale: 1.02, rotate: -6 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 1.02,
        rotate: [-6, -8, -4, -6],
        x: [0, 3, -3, 0],
      }}
      transition={{
        opacity: { duration: 0.15, ease: easing.iosOut },
        scale: { duration: 0.15, ease: easing.iosOut },
        rotate: stickerTransitions.float.rotate,
        x: stickerTransitions.float.y,
        default: springs.tap,
      }}
      className={`${className} cursor-grab active:cursor-grabbing scale-50 md:scale-100`}
    >
      <svg width="130" height="50" viewBox="0 0 130 50" className="drop-shadow-md md:drop-shadow-lg">
        <path
          d="M 8 0 L 122 0 Q 130 0 130 8 L 130 12 L 126 12 L 126 38 L 130 38 L 130 42 Q 130 50 122 50 L 8 50 Q 0 50 0 42 L 0 38 L 4 38 L 4 12 L 0 12 L 0 8 Q 0 0 8 0 Z"
          fill="#fecdd3"
          stroke="#f472b6"
          strokeWidth="2"
        />
        <line x1="10" y1="6" x2="120" y2="6" stroke="#f472b6" strokeWidth="1" />
        <line x1="10" y1="44" x2="120" y2="44" stroke="#f472b6" strokeWidth="1" />
        <line x1="20" y1="8" x2="20" y2="42" stroke="#f472b6" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="110" y1="8" x2="110" y2="42" stroke="#f472b6" strokeWidth="1" strokeDasharray="2,2" />
        <text x="10" y="30" fill="#1f2937" fontSize="7" fontWeight="bold" textAnchor="middle" transform="rotate(-90 10 25)">
          {leftNumber}
        </text>
        <text x="120" y="25" fill="#1f2937" fontSize="7" fontWeight="bold" textAnchor="middle" transform="rotate(-90 120 25)">
          {rightNumber}
        </text>
        <text x="65" y="22" fill="#1f2937" fontSize="9" fontWeight="bold" textAnchor="middle">
          {from} → {to}
        </text>
        <text x="65" y="32" fill="#1f2937" fontSize="9" textAnchor="middle">
          {distance} • {duration}
        </text>
      </svg>
    </motion.div>
  );
}
