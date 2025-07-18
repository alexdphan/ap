"use client";
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { VideoOptimizations } from "../lib/video-config";

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: "none" | "metadata" | "auto";
  onCanPlay?: () => void;
  onLoadStart?: () => void;
  [key: string]: unknown;
}

// Mobile device detection
const isMobile = () => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

const isIOS = () => {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const isSafari = () => {
  if (typeof window === "undefined") return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

export default function OptimizedVideo({
  src,
  poster,
  className = "",
  autoPlay = false,
  muted = true,
  loop = false,
  controls = false,
  preload = "metadata",
  onCanPlay,
  onLoadStart,
  ...props
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Removed user interaction handler - using aggressive autoplay instead

  // Auto-trigger user interaction on mobile for better autoplay
  useEffect(() => {
    if (isMobile() && autoPlay && !hasUserInteracted) {
      // Automatically mark as interacted after a short delay to help with autoplay
      const timer = setTimeout(() => {
        setHasUserInteracted(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [autoPlay, hasUserInteracted]);

  useEffect(() => {
    if (!videoRef.current || !src) return;

    const video = videoRef.current;
    const isHLS = src.includes(".m3u8");
    const mobile = isMobile();
    const iOS = isIOS();
    const safari = isSafari();

    // Clean up any existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setIsLoaded(false);
    setError(null);
    setShowLoading(true); // Show loading for new video
    retryCountRef.current = 0;

    // Timeout to hide loading if video takes too long (fallback)
    const loadingTimeout = setTimeout(() => {
      setShowLoading(false);
    }, 10000); // 10 seconds timeout

    // Mobile-specific video setup
    if (mobile) {
      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");
      video.setAttribute("x-webkit-airplay", "allow");

      if (iOS) {
        video.setAttribute("preload", "none"); // iOS Safari preload fix
        video.muted = true; // Force muted for iOS
      }
    }

    const handleCanPlay = () => {
      setIsLoaded(true);
      setShowLoading(false); // Hide loading when video is ready
      onCanPlay?.();

      // Aggressive auto-play for all devices
      if (autoPlay && video.paused) {
        video.play().catch(() => {
          // If autoplay fails, try again with user interaction flag
          setHasUserInteracted(true);
          setTimeout(() => {
            if (video.paused) {
              video.play().catch(() => {
                // Final fallback - autoplay not supported
              });
            }
          }, 100);
        });
      }
    };

    const handlePlay = () => {
      setShowLoading(false); // Hide loading when video starts playing
    };

    const handlePause = () => {
      // Video paused - no state needed
    };

    const handleLoadStart = () => {
      onLoadStart?.();
    };

    const handleError = (e: Event) => {
      console.error("Video error:", e);

      // Retry logic for mobile
      if (retryCountRef.current < maxRetries && mobile) {
        retryCountRef.current += 1;
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.load();
          }
        }, 1000 * retryCountRef.current);
        return;
      }

      setError("Video failed to load");
    };

    const handleLoadedMetadata = () => {
      if (video.videoWidth && video.videoHeight) {
        const aspectRatio = video.videoWidth / video.videoHeight;
        const vertical = aspectRatio < 1;

        // Apply consistent styling
        video.style.objectFit = "cover";
        video.style.objectPosition = "center";
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.transform = "none";
        video.style.scale = "1";

        // Reset dimensions
        video.removeAttribute("width");
        video.removeAttribute("height");
        video.style.maxWidth = "none";
        video.style.maxHeight = "none";

        console.log(
          `Video ${src.slice(-20)}: ${video.videoWidth}x${
            video.videoHeight
          }, ratio: ${aspectRatio.toFixed(
            2
          )}, vertical: ${vertical}, mobile: ${mobile}, iOS: ${iOS}, safari: ${safari}`
        );
      }
    };

    // Add event listeners
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("error", handleError);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    if (isHLS) {
      // Native HLS support (Safari)
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else if (Hls.isSupported()) {
        // Use mobile-optimized HLS configuration
        const hlsConfig = VideoOptimizations.getHLSConfig();
        const hls = new Hls(hlsConfig);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // Always start loading immediately for better performance
          hls.startLoad();
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data && data.type && data.fatal) {
            console.error("HLS Fatal Error:", data.type, data.details);
            setError(`HLS Error: ${data.details || data.type}`);

            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                if (retryCountRef.current < maxRetries) {
                  retryCountRef.current += 1;
                  setTimeout(() => {
                    hls.startLoad();
                  }, 1000 * retryCountRef.current);
                }
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                if (retryCountRef.current < maxRetries) {
                  retryCountRef.current += 1;
                  hls.recoverMediaError();
                }
                break;
              default:
                hls.destroy();
                hlsRef.current = null;
                break;
            }
          }
        });

        hls.loadSource(src);
        hls.attachMedia(video);
        hlsRef.current = hls;

        // HLS will auto-start loading from MANIFEST_PARSED event
      } else {
        console.error("HLS is not supported in this browser");
        setError("HLS not supported in this browser");
      }
    } else {
      // Regular video file
      video.src = src;
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);

      clearTimeout(loadingTimeout); // Clear loading timeout

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, onCanPlay, onLoadStart, hasUserInteracted, autoPlay]);

  // Handle autoplay with aggressive retry logic
  useEffect(() => {
    if (!videoRef.current || !isLoaded) return;

    const video = videoRef.current;

    // Aggressive autoplay handling - try immediately without user interaction checks
    if (autoPlay) {
      if (video.paused) {
        // First attempt
        video.play().catch((error) => {
          console.log("Autoplay attempt 1 failed:", error.message);

          // Second attempt with muted flag
          video.muted = true;
          setTimeout(() => {
            video.play().catch((error) => {
              console.log("Autoplay attempt 2 failed:", error.message);

              // Third attempt after marking user interaction
              setHasUserInteracted(true);
              setTimeout(() => {
                video.play().catch((error) => {
                  console.log("Final autoplay attempt failed:", error.message);
                  setShowLoading(false); // Hide loading if all attempts fail
                });
              }, 200);
            });
          }, 100);
        });
      }
    } else if (!autoPlay && !video.paused) {
      video.pause();
    }
  }, [autoPlay, isLoaded]);

  // HLS loading is handled automatically in the main effect

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        poster={poster}
        className={`w-full h-full ${
          isLoaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300 ${className}`}
        muted={muted}
        loop={loop}
        controls={controls}
        preload={isMobile() ? "none" : preload}
        playsInline={true}
        {...props}
        style={{
          ...((props as React.VideoHTMLAttributes<HTMLVideoElement>).style ||
            {}),
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
        }}
      >
        Your browser does not support the video tag.
      </video>

      {/* Loading indicator */}
      {showLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="flex items-center space-x-2">
            {/* Circular loading spinner */}
            <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-white text-sm">Loading...</span>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="absolute top-2 left-2 bg-red-500 text-white p-2 text-xs rounded max-w-xs z-10">
          {error}
          {retryCountRef.current > 0 && (
            <div className="text-xs mt-1 opacity-75">
              Retry {retryCountRef.current}/{maxRetries}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
