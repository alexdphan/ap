"use client";

import { motion } from "framer-motion";

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
      whileHover={{ scale: 1.02, rotate: -8 }}
      whileTap={{ scale: 0.95, cursor: "grabbing" }}
      initial={{ opacity: 0, scale: 1.05, rotate: -6 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 1.05,
        rotate: [-6, -10, -2, -6],
        x: [0, 5, -5, 0],
      }}
      transition={{
        opacity: { duration: 1, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 1, ease: [0.22, 1, 0.36, 1] },
        rotate: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        },
        x: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className={`${className} cursor-grab active:cursor-grabbing scale-75 md:scale-100`}
    >
      <svg
        width="130"
        height="50"
        viewBox="0 0 130 50"
        className="drop-shadow-md md:drop-shadow-lg"
      >
        {/* Ticket background with notched corners */}
        <path
          d="M 8 0 L 122 0 Q 130 0 130 8 L 130 12 L 126 12 L 126 38 L 130 38 L 130 42 Q 130 50 122 50 L 8 50 Q 0 50 0 42 L 0 38 L 4 38 L 4 12 L 0 12 L 0 8 Q 0 0 8 0 Z"
          fill="#fecdd3"
          stroke="#f472b6"
          strokeWidth="2"
        />

        {/* Inner border lines */}
        <line x1="10" y1="6" x2="120" y2="6" stroke="#f472b6" strokeWidth="1" />
        <line
          x1="10"
          y1="44"
          x2="120"
          y2="44"
          stroke="#f472b6"
          strokeWidth="1"
        />

        {/* Left dashed line */}
        <line
          x1="20"
          y1="8"
          x2="20"
          y2="42"
          stroke="#f472b6"
          strokeWidth="1"
          strokeDasharray="2,2"
        />

        {/* Right dashed line */}
        <line
          x1="110"
          y1="8"
          x2="110"
          y2="42"
          stroke="#f472b6"
          strokeWidth="1"
          strokeDasharray="2,2"
        />

        {/* Left number */}
        <text
          x="10"
          y="30"
          fill="#1f2937"
          fontSize="7"
          fontWeight="bold"
          textAnchor="middle"
          transform="rotate(-90 10 25)"
        >
          {leftNumber}
        </text>

        {/* Right number */}
        <text
          x="120"
          y="25"
          fill="#1f2937"
          fontSize="7"
          fontWeight="bold"
          textAnchor="middle"
          transform="rotate(-90 120 25)"
        >
          {rightNumber}
        </text>

        {/* Main text */}
        <text
          x="65"
          y="22"
          fill="#1f2937"
          fontSize="9"
          fontWeight="bold"
          textAnchor="middle"
        >
          {from} → {to}
        </text>
        <text x="65" y="32" fill="#1f2937" fontSize="9" textAnchor="middle">
          {distance} • {duration}
        </text>
      </svg>
    </motion.div>
  );
}
