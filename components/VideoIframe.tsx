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
            transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
            className="absolute inset-0 z-10"
            style={{
              backgroundColor: "var(--gray-100)",
            }}
          />
        )}
      </AnimatePresence>

      <iframe
        loading="lazy"
        {...props}
        className={`w-full h-full ${className || ""}`}
        onLoad={(e) => {
          setIsLoading(false);
          onLoad?.(e);
        }}
        style={{
          ...style,
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease-out",
          transform: "scale(1.02)",
          transformOrigin: "center center",
        }}
      />
    </div>
  );
}
