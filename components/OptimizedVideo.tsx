"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  VideoOptimizations,
  createVideoIntersectionObserver,
} from "../lib/video-config";

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: "none" | "metadata" | "auto";
  priority?: "high" | "low";
  onCanPlay?: () => void;
  onLoadStart?: () => void;
  [key: string]: unknown;
}

export default function OptimizedVideo({
  src,
  poster,
  className = "",
  autoPlay = false,
  muted = true,
  loop = false,
  controls = false,
  preload = "metadata",
  priority = "low",
  onCanPlay,
  onLoadStart,
  ...props
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Basic CDN preconnect
  useEffect(() => {
    if (isClient) {
      VideoOptimizations.preconnectToCDN();
    }
  }, [isClient]);

  // Simple intersection observer
  useEffect(() => {
    if (!videoRef.current || !isClient) return;

    const observer = createVideoIntersectionObserver((video, visible) => {
      setIsVisible(visible);
    });

    if (observer) {
      observer.observe(videoRef.current);
      return () => observer.disconnect();
    }
  }, [isClient]);

  // Basic video setup
  useEffect(() => {
    if (!videoRef.current || !isClient) return;

    const video = videoRef.current;
    VideoOptimizations.optimizeVideoElement(video);

    const handleCanPlay = () => {
      setIsLoaded(true);
      onCanPlay?.();
    };

    const handleLoadStart = () => {
      onLoadStart?.();
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadstart", handleLoadStart);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadstart", handleLoadStart);
    };
  }, [isClient, onCanPlay, onLoadStart]);

  // Simple autoplay handling
  useEffect(() => {
    if (!videoRef.current || !isVisible || !autoPlay || !isLoaded) return;

    const video = videoRef.current;
    if (video.paused) {
      video.play().catch(() => {
        // Handle autoplay restrictions
      });
    }
  }, [isVisible, autoPlay, isLoaded]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={`${className} ${
        isLoaded ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
      autoPlay={isClient ? autoPlay && isVisible : false}
      muted={muted}
      loop={loop}
      controls={controls}
      preload={isClient ? preload : "none"}
      playsInline
      suppressHydrationWarning={true}
      {...props}
    >
      Your browser does not support the video tag.
    </video>
  );
}
