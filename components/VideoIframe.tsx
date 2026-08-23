"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

type VideoIframeProps = React.IframeHTMLAttributes<HTMLIFrameElement>;

export default function VideoIframe({
  style,
  className,
  onLoad,
  ...props
}: VideoIframeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className || ""}`}
      style={style}
    >
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.3, ease: [0, 0, 0.2, 1] }
            }
            className="absolute inset-0 z-10"
            style={{ backgroundColor: "var(--gray-100)" }}
          />
        ) : null}
      </AnimatePresence>

      <iframe
        loading="lazy"
        {...props}
        className={`h-full w-full ${className || ""}`}
        onLoad={(event) => {
          setIsLoading(false);
          onLoad?.(event);
        }}
        style={{
          ...style,
          opacity: isLoading ? 0 : 1,
          transition: shouldReduceMotion ? "none" : "opacity 0.3s ease-out",
          transform: "scale(1.02)",
          transformOrigin: "center center",
        }}
      />
    </div>
  );
}
