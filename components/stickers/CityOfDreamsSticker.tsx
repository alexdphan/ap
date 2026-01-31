"use client";

import { motion } from "framer-motion";
import { easing, springs, stickerTransitions } from "@/lib/animation";

interface CityOfDreamsStickerProps {
  isVisible?: boolean;
  className?: string;
}

export default function CityOfDreamsSticker({
  isVisible = true,
  className = "absolute -top-3 -right-8 md:-top-8 md:-right-8 z-20",
}: CityOfDreamsStickerProps) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.05}
      dragTransition={stickerTransitions.drag}
      whileHover={{ scale: 1.02, rotate: 3 }}
      whileTap={{ scale: 0.96 }}
      whileDrag={{ scale: 1.03 }}
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 1.02,
        y: [0, -5, 0],
      }}
      transition={{
        opacity: { duration: 0.15, ease: easing.iosOut },
        scale: { duration: 0.15, ease: easing.iosOut },
        y: stickerTransitions.float.y,
        default: springs.tap,
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
