"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoIframeProps
  extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  videoTitle?: string;
}

export default function VideoIframe({
  videoTitle,
  style,
  className,
  onLoad,
  ...props
}: VideoIframeProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className || ""}`}
      style={style}
    >
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-10"
            style={{
              backgroundColor: "var(--gray-100)",
            }}
          >
            <motion.div
              className="w-full h-full"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                backgroundColor: "var(--gray-100)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <iframe
        {...props}
        loading="lazy"
        className={`w-full h-full ${className || ""}`}
        onLoad={(e) => {
          setIsLoading(false);
          onLoad?.(e);
        }}
        style={{
          ...style,
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      />
    </div>
  );
}

