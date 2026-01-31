"use client";

import { motion } from "framer-motion";
import { easing, springs, stickerTransitions } from "@/lib/animation";

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
      dragElastic={0.05}
      dragTransition={stickerTransitions.drag}
      whileHover={{ scale: 1.02, rotate: 1 }}
      whileTap={{ scale: 0.96 }}
      whileDrag={{ scale: 1.03 }}
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 1.02,
        rotate: [0, 1.5, -1.5, 0],
        y: [0, -4, 0],
      }}
      transition={{
        opacity: { duration: 0.15, ease: easing.iosOut },
        scale: { duration: 0.15, ease: easing.iosOut },
        rotate: stickerTransitions.float.rotate,
        y: stickerTransitions.float.y,
        default: springs.tap,
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
