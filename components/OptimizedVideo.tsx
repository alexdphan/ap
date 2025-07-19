"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  getOptimizedVideoUrl,
  VideoOptimizations,
  createVideoIntersectionObserver,
  preloadVideo,
} from "../lib/video-config";
import { videoPerformanceMonitor } from "../lib/video-performance";

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
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Optimize video URL only on client
  const optimizedSrc = isClient ? getOptimizedVideoUrl(src) : src;

  // Initialize client-side state and optimizations
  useEffect(() => {
    setIsClient(true);
    setShouldLoad(priority === "high");
    VideoOptimizations.prefetchDomains();
    VideoOptimizations.preconnectToCDN();
  }, [priority]);

  // High priority videos should preload immediately
  useEffect(() => {
    if (priority === "high") {
      preloadVideo(optimizedSrc, "high");
    }
  }, [optimizedSrc, priority]);

  // Intersection observer for lazy loading
  useEffect(() => {
    if (!videoRef.current) return;

    const observer = createVideoIntersectionObserver((video, visible) => {
      setIsVisible(visible);
      if (visible && !shouldLoad) {
        setShouldLoad(true);
        // Start performance tracking when video becomes visible
        videoPerformanceMonitor.startTracking(optimizedSrc, priority);
      }
    });

    if (observer) {
      observer.observe(videoRef.current);
      return () => observer.disconnect();
    }
  }, [shouldLoad, optimizedSrc, priority]);

  // Handle video loading and optimization
  const handleVideoRef = useCallback(
    (video: HTMLVideoElement | null) => {
      if (!video) return;

      // Apply optimizations to video element
      VideoOptimizations.optimizeVideoElement(video);

      // Handle loading events
      const handleCanPlay = () => {
        setIsLoaded(true);
        videoPerformanceMonitor.recordLoadComplete(optimizedSrc);
        onCanPlay?.();
      };

      const handleLoadStart = () => {
        onLoadStart?.();
      };

      const handleLoadedData = () => {
        videoPerformanceMonitor.recordFirstFrame(optimizedSrc);
      };

      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("loadstart", handleLoadStart);
      video.addEventListener("loadeddata", handleLoadedData);

      return () => {
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("loadstart", handleLoadStart);
        video.removeEventListener("loadeddata", handleLoadedData);
      };
    },
    [onCanPlay, onLoadStart, optimizedSrc]
  );

  // Auto-play optimization for visible videos
  useEffect(() => {
    if (!videoRef.current || !isVisible || !autoPlay || !isLoaded) return;

    const video = videoRef.current;
    if (video.paused) {
      video.play().catch(() => {
        // Handle autoplay restrictions gracefully
      });
    }
  }, [isVisible, autoPlay, isLoaded]);

  // Render simple video element during SSR to avoid hydration mismatch
  if (!isClient) {
    return (
      <video
        src={src}
        poster={poster}
        className={className}
        muted={muted}
        loop={loop}
        controls={controls}
        preload="none"
        playsInline
        {...props}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <video
      ref={(el) => {
        videoRef.current = el;
        handleVideoRef(el);
      }}
      src={shouldLoad ? optimizedSrc : undefined}
      poster={poster}
      className={`${className} ${
        isLoaded ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
      autoPlay={autoPlay && isVisible}
      muted={muted}
      loop={loop}
      controls={controls}
      preload={shouldLoad ? preload : "none"}
      playsInline
      {...props}
    >
      Your browser does not support the video tag.
    </video>
  );
}
