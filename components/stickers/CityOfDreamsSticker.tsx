"use client";

import { motion } from "framer-motion";

interface CityOfDreamsStickerProps {
  isVisible?: boolean;
  className?: string;
}

export default function CityOfDreamsSticker({
  isVisible = true,
  className = "absolute -top-3 -right-2 md:-top-8 md:-right-8 z-20",
}: CityOfDreamsStickerProps) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      whileHover={{ scale: 1.02, rotate: 5 }}
      whileTap={{ scale: 0.95, cursor: "grabbing" }}
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 1.05,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: { duration: 1, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 1, ease: [0.22, 1, 0.36, 1] },
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className={`${className} bg-orange-600 text-white px-1.5 py-0.5 md:px-2 md:py-1 shadow-md rotate-[20deg] border border-dashed md:border-2 cursor-grab active:cursor-grabbing`}
      style={{ borderColor: "#fb923c" }}
    >
      <p className="text-[10px] md:text-caption text-white uppercase tracking-wide pointer-events-none">
        City of dreams!
      </p>
    </motion.div>
  );
}
