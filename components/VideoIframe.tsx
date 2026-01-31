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
            transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
            className="absolute inset-0 z-10 overflow-hidden"
            style={{
              backgroundColor: "var(--gray-100)",
            }}
          >
            {/* Fast shimmer effect */}
            <motion.div
              className="absolute inset-0"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                width: "50%",
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
          transition: "opacity 0.15s ease-out",
        }}
      />
    </div>
  );
}
