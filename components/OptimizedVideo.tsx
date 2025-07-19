"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  getOptimizedVideoUrl,
  VideoOptimizations,
  createVideoIntersectionObserver,
  preloadVideo,
} from "../lib/video-config";
import { videoPerformanceMonitor } from "../lib/video-performance";
import {
  isSafari,
  safariOptimizer,
  createSafariVideoObserver,
  getSafariConnectionSpeed,
  getSafariOptimalFormat,
  loadVideoWithBlob,
} from "../lib/safari-video-optimizations";

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
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSafariBrowser, setIsSafariBrowser] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState(src);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    // Set hydrated flag after a brief delay to ensure hydration is complete
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Initialize optimizations after hydration
  useEffect(() => {
    if (!isHydrated) return;

    const safari = isSafari();
    setIsSafariBrowser(safari);
    setShouldLoad(priority === "high");

    // Apply URL optimizations after hydration
    let finalOptimizedSrc = src;

    if (safari) {
      // Start aggressive preloading for Safari immediately
      if (priority === "high") {
        safariOptimizer.preloadForSafari(src, "high");
      }

      // Optimize URL for Safari
      finalOptimizedSrc = getSafariOptimalFormat(src);
      setOptimizedSrc(finalOptimizedSrc);

      // Use blob loading for instant playback on fast connections
      const connectionSpeed = getSafariConnectionSpeed();
      if (connectionSpeed === "fast" && priority === "high") {
        loadVideoWithBlob(finalOptimizedSrc)
          .then((blobUrl) => {
            setOptimizedSrc(blobUrl);
          })
          .catch(() => {
            // Fallback to direct URL
          });
      }
    } else {
      // Apply standard optimizations for non-Safari browsers
      finalOptimizedSrc = getOptimizedVideoUrl(src);
      setOptimizedSrc(finalOptimizedSrc);
    }

    VideoOptimizations.prefetchDomains();
    VideoOptimizations.preconnectToCDN();
  }, [isHydrated, priority, src]);

  // High priority videos should preload immediately
  useEffect(() => {
    if (isHydrated && priority === "high") {
      preloadVideo(optimizedSrc, "high");
    }
  }, [isHydrated, optimizedSrc, priority]);

  // Safari-specific intersection observer for aggressive loading
  useEffect(() => {
    if (!videoRef.current || !isHydrated) return;

    const observer = isSafariBrowser
      ? createSafariVideoObserver((video, visible, distance) => {
          setIsVisible(visible);

          // Aggressive preloading for Safari when video is close to viewport
          if (distance < 400 && !shouldLoad) {
            // 400px threshold for Safari
            setShouldLoad(true);
            safariOptimizer.preloadForSafari(optimizedSrc, "high");
            videoPerformanceMonitor.startTracking(optimizedSrc, priority);
          }
        })
      : createVideoIntersectionObserver((video, visible) => {
          setIsVisible(visible);
          if (visible && !shouldLoad) {
            setShouldLoad(true);
            videoPerformanceMonitor.startTracking(optimizedSrc, priority);
          }
        });

    if (observer) {
      observer.observe(videoRef.current);
      return () => observer.disconnect();
    }
  }, [shouldLoad, optimizedSrc, priority, isHydrated, isSafariBrowser]);

  // Update video src after hydration to apply optimizations
  useEffect(() => {
    if (!videoRef.current || !isHydrated || !shouldLoad) return;

    const video = videoRef.current;

    // Use a small delay to ensure hydration is fully complete
    const timer = setTimeout(() => {
      // Only update src if it's different (to avoid unnecessary reloads)
      if (video.src !== optimizedSrc) {
        video.src = optimizedSrc;
        video.load(); // Reload with optimized src
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isHydrated, shouldLoad, optimizedSrc]);

  // Handle video loading and optimization
  const handleVideoRef = useCallback(
    (video: HTMLVideoElement | null) => {
      if (!video || !isHydrated) return;

      // Apply Safari-specific optimizations
      if (isSafariBrowser) {
        safariOptimizer.optimizeVideoForSafari(video);

        // Check for preloaded video data
        const preloadedVideo = safariOptimizer.getPreloadedVideo(optimizedSrc);
        if (preloadedVideo && preloadedVideo.readyState >= 3) {
          // Transfer preloaded data for instant playback
          video.currentTime = 0;
          setIsLoaded(true);
        }
      } else {
        // Apply standard optimizations
        VideoOptimizations.optimizeVideoElement(video);
      }

      // Handle loading events
      const handleCanPlay = () => {
        setIsLoaded(true);
        videoPerformanceMonitor.recordLoadComplete(video.src);
        onCanPlay?.();
      };

      const handleLoadStart = () => {
        onLoadStart?.();
      };

      const handleLoadedData = () => {
        videoPerformanceMonitor.recordFirstFrame(video.src);

        // Safari-specific: force a frame render
        if (isSafariBrowser) {
          video.currentTime = 0.1;
          setTimeout(() => {
            video.currentTime = 0;
          }, 10);
        }
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
    [onCanPlay, onLoadStart, optimizedSrc, isHydrated, isSafariBrowser]
  );

  // Safari-specific autoplay handling
  useEffect(() => {
    if (!videoRef.current || !isVisible || !autoPlay || !isLoaded) return;

    const video = videoRef.current;

    if (isSafariBrowser && video.paused) {
      // Safari requires user interaction, but we can try
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Safari autoplay blocked - this is expected
          console.log("Safari autoplay blocked (expected):", error.name);
        });
      }
    } else if (video.paused) {
      video.play().catch(() => {
        // Handle other browser autoplay restrictions
      });
    }
  }, [isVisible, autoPlay, isLoaded, isSafariBrowser]);

  return (
    <video
      ref={(el) => {
        videoRef.current = el;
        if (isHydrated) {
          handleVideoRef(el);
        }
      }}
      src={src}
      poster={poster}
      className={`${className} ${
        isHydrated && isLoaded ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
      autoPlay={isHydrated ? autoPlay && isVisible : false}
      muted={muted}
      loop={loop}
      controls={controls}
      preload={isHydrated && shouldLoad ? preload : "none"}
      playsInline
      suppressHydrationWarning={true}
      {...props}
    >
      Your browser does not support the video tag.
    </video>
  );
}
