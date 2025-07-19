"use client";
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

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
  const hlsRef = useRef<Hls | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVertical, setIsVertical] = useState<boolean | null>(null);

  useEffect(() => {
    if (!videoRef.current || !src) return;

    const video = videoRef.current;
    const isHLS = src.includes(".m3u8");

    // Clean up any existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setIsLoaded(false);
    setError(null);

    const handleCanPlay = () => {
      setIsLoaded(true);
      onCanPlay?.();
    };

    const handleLoadStart = () => {
      onLoadStart?.();
    };

    const handleError = (e: any) => {
      console.error("Video error:", e);
      setError("Video failed to load");
    };

    const handleLoadedMetadata = () => {
      if (video.videoWidth && video.videoHeight) {
        const aspectRatio = video.videoWidth / video.videoHeight;
        const vertical = aspectRatio < 1;
        setIsVertical(vertical);

        // Force all videos to use the same display format
        const objectFitValue = "cover"; // Fills container, may crop but stays centered

        // Apply object-fit and additional scaling properties directly to the video element
        video.style.objectFit = objectFitValue;
        video.style.objectPosition = "center";
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.transform = "none";
        video.style.scale = "1";

        // Reset any potential viewport or scaling attributes
        video.removeAttribute("width");
        video.removeAttribute("height");
        video.style.maxWidth = "none";
        video.style.maxHeight = "none";

        console.log(
          `Video ${src.slice(-20)}: ${video.videoWidth}x${
            video.videoHeight
          }, ratio: ${aspectRatio.toFixed(
            2
          )}, vertical: ${vertical}, objectFit: ${objectFitValue}, applied: ${
            video.style.objectFit
          }`
        );

        // Log additional debug info
        setTimeout(() => {
          const rect = video.getBoundingClientRect();
          console.log(
            `Container: ${rect.width.toFixed(0)}x${rect.height.toFixed(
              0
            )}, Video: ${video.videoWidth}x${video.videoHeight}, DisplayedAs: ${
              video.offsetWidth
            }x${video.offsetHeight}`
          );
        }, 100);
      }
    };

    // Add event listeners
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("error", handleError);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    if (isHLS) {
      // Check if browser supports HLS natively (Safari)
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS support (Safari)
        video.src = src;
      } else if (Hls.isSupported()) {
        // Use hls.js for browsers without native HLS support (Chrome)
        const hls = new Hls({
          debug: false, // Turn off debug to reduce console noise
          enableWorker: false,
          lowLatencyMode: false,
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          backBufferLength: 90,
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // HLS manifest loaded successfully
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          // Only log actual errors, not empty objects
          if (data && data.type && data.fatal) {
            console.error("HLS Fatal Error:", data.type, data.details);
            setError(`HLS Error: ${data.details || data.type}`);

            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          }
        });

        hls.loadSource(src);
        hls.attachMedia(video);
        hlsRef.current = hls;
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

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, onCanPlay, onLoadStart]);

  // Handle autoplay changes
  useEffect(() => {
    if (!videoRef.current || !isLoaded) return;

    const video = videoRef.current;

    if (autoPlay && video.paused) {
      video.play().catch(() => {
        // Autoplay failed - this is normal and expected
      });
    } else if (!autoPlay && !video.paused) {
      video.pause();
    }
  }, [autoPlay, isLoaded]);

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
        preload={preload}
        playsInline
        {...props}
        style={{
          ...((props as any).style || {}),
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
        }}
      >
        Your browser does not support the video tag.
      </video>

      {/* Only show error if there's a real error */}
      {error && (
        <div className="absolute top-2 left-2 bg-red-500 text-white p-2 text-xs rounded max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
}
