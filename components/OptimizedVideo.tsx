"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
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
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Handle user interaction for mobile autoplay
  const handleUserInteraction = useCallback(() => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      if (autoPlay && videoRef.current) {
        setShouldAutoPlay(true);
      }
    }
  }, [autoPlay, hasUserInteracted]);

  // Setup user interaction listeners for mobile
  useEffect(() => {
    if (isMobile()) {
      const events = ["touchstart", "click", "scroll"];
      events.forEach((event) => {
        document.addEventListener(event, handleUserInteraction, {
          once: true,
          passive: true,
        });
      });

      return () => {
        events.forEach((event) => {
          document.removeEventListener(event, handleUserInteraction);
        });
      };
    }
  }, [handleUserInteraction]);

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
    setIsPlaying(false);
    retryCountRef.current = 0;

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
      onCanPlay?.();

      // Auto-play logic for mobile
      if (autoPlay && mobile && hasUserInteracted && video.paused) {
        video.play().catch(() => {
          // Silent fail for autoplay
        });
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
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
          // Start loading manually on mobile after user interaction
          if (mobile && !hasUserInteracted) {
            // Wait for user interaction before starting load
          } else {
            hls.startLoad();
          }
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

        // Start loading on mobile after user interaction
        if (mobile && hasUserInteracted && !hlsConfig.autoStartLoad) {
          hls.startLoad();
        }
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
    const mobile = isMobile();

    // Aggressive autoplay handling
    if (autoPlay || shouldAutoPlay) {
      if (video.paused) {
        video.play().catch((error) => {
          console.log("Autoplay failed:", error.message);

          // If autoplay fails on mobile and we haven't tried user interaction yet
          if (mobile && !hasUserInteracted) {
            // Try to trigger user interaction automatically
            const tryAutoInteraction = () => {
              setHasUserInteracted(true);
              setTimeout(() => {
                if (videoRef.current && videoRef.current.paused) {
                  videoRef.current.play().catch(() => {
                    // Final fallback - video needs manual interaction
                  });
                }
              }, 100);
            };

            // Attempt interaction after a short delay
            setTimeout(tryAutoInteraction, 500);
          }
        });
      }
    } else if (!autoPlay && !video.paused) {
      video.pause();
    }
  }, [autoPlay, shouldAutoPlay, isLoaded, hasUserInteracted]);

  // Start HLS loading after user interaction on mobile
  useEffect(() => {
    if (hasUserInteracted && hlsRef.current && isMobile()) {
      hlsRef.current.startLoad();
    }
  }, [hasUserInteracted]);

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
      {(!isLoaded ||
        (autoPlay && !isPlaying && !hasUserInteracted && isMobile())) && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm cursor-pointer"
          onClick={() => {
            if (!hasUserInteracted) {
              setHasUserInteracted(true);
              if (videoRef.current && autoPlay) {
                videoRef.current.play().catch(() => {
                  // Manual play failed
                });
              }
            }
          }}
        >
          <div className="flex flex-col items-center space-y-3 pointer-events-none">
            {/* Spinning loader */}
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <div className="bg-black/50 text-white px-3 py-1 rounded text-sm font-medium">
              {!isLoaded ? "Loading video..." : "Starting playback..."}
            </div>
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
