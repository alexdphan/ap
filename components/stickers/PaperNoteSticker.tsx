"use client";

import { motion } from "framer-motion";

interface PaperNoteStickerProps {
  text: string;
  isVisible?: boolean;
  className?: string;
}

export default function PaperNoteSticker({
  text,
  isVisible = true,
  className = "absolute -bottom-2 md:-bottom-8 left-2 w-[120px] md:w-[100px] h-[80px] md:h-[100px]",
}: PaperNoteStickerProps) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      whileHover={{ scale: 1.02, rotate: 2 }}
      whileTap={{ scale: 0.95, cursor: "grabbing" }}
      initial={{ opacity: 0, scale: 1.05, rotate: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 1.05,
        rotate: [0, 2, -2, 0],
        y: [0, -6, 0],
      }}
      transition={{
        opacity: { duration: 1, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 1, ease: [0.22, 1, 0.36, 1] },
        rotate: {
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className={`${className} shadow-sm bg-cover bg-center cursor-grab active:cursor-grabbing scale-75 md:scale-100`}
      style={{
        backgroundImage: "url(/paper.jpg)",
        border: "1px solid var(--gray-100)",
      }}
    >
      <div className="w-full h-full flex items-center justify-center p-1.5 md:p-2">
        <p
          className="text-[10px] md:text-caption leading-tight text-center paper-note-text"
          style={{ color: "var(--gray-900)" }}
        >
          {text}
        </p>
      </div>
    </motion.div>
  );
}
