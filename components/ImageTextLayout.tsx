"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { ReactNode } from "react";
import { PARALLAX_STRENGTH } from "../lib/parallax-config";
import OptimizedVideo from "./OptimizedVideo";

interface ImageTextLayoutProps {
  src: string;
  alt: string;
  caption?: string | ReactNode;
  imagePosition?: "left" | "right";
  imageSize?: "xs" | "small" | "medium" | "large";
  parallax?: number;
  children: React.ReactNode;
  className?: string;
}

const imageSizeClasses = {
  xs: "w-full md:w-60",
  small: "w-full md:w-72",
  medium: "w-full md:w-80",
  large: "w-full md:w-96",
};

export default function ImageTextLayout({
  src,
  alt,
  caption,
  imagePosition = "left",
  imageSize = "medium",
  parallax = PARALLAX_STRENGTH,
  children,
  className = "",
}: ImageTextLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Always call hooks at the top level
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${parallax * 40}%`, `-${parallax * 40}%`]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Don't render anything if src is empty or undefined
  if (!src) return null;

  // Check if the src is a video file
  const isVideo = /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(src);

  // Function to parse simple markdown links in string captions
  const parseCaption = (caption: string | ReactNode) => {
    if (typeof caption !== "string") return caption;

    // Simple regex to match [text](url) format
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(caption)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(caption.slice(lastIndex, match.index));
      }

      // Add the link
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-green hover:text-accent-green-light underline"
        >
          {match[1]}
        </a>
      );

      lastIndex = linkRegex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < caption.length) {
      parts.push(caption.slice(lastIndex));
    }

    return parts.length > 0 ? parts : caption;
  };

  const isImageLeft = imagePosition === "left";

  return (
    <div className={`my-8 ${className}`}>
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        {/* Media Container */}
        <div
          className={`relative overflow-hidden ${imageSizeClasses[imageSize]} ${
            isImageLeft ? "md:order-1" : "md:order-2"
          } flex-shrink-0 ${isVideo ? "h-auto" : "h-64"}`}
        >
          {isVideo ? (
            <div className="relative w-full group">
              <OptimizedVideo
                src={src}
                className="w-full h-auto object-contain video-hover-controls"
                autoPlay
                muted
                loop
                preload="metadata"
                controls
                priority="high"
              />
            </div>
          ) : (
            <div ref={containerRef}>
              <motion.div
                style={{
                  y: isVisible && !shouldReduceMotion ? y : 0,
                }}
                className="relative w-full h-[108%] -top-[4%]"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover"
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
              </motion.div>
            </div>
          )}

          {caption && (
            <div className="mt-3 text-sm text-foreground/60 text-center italic">
              {parseCaption(caption)}
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className={`flex-1 ${isImageLeft ? "md:order-2" : "md:order-1"}`}>
          <div className="prose prose-lg max-w-none text-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
