/**
 * Simple video configuration
 */

// Basic video quality presets
export const VIDEO_QUALITIES = {
  low: { width: 480, height: 270, suffix: "_480p" },
  medium: { width: 720, height: 405, suffix: "_720p" },
  high: { width: 1080, height: 607, suffix: "_1080p" },
} as const;

// Simple quality detection
export function getOptimalVideoQuality(): keyof typeof VIDEO_QUALITIES {
  if (typeof window === "undefined") return "medium";

  const connection = (
    navigator as Navigator & { connection?: { effectiveType?: string } }
  ).connection;

  // Simple connection check
  if (
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g"
  ) {
    return "low";
  }
  if (connection?.effectiveType === "3g") {
    return "medium";
  }

  return "high";
}

// Direct video URL - no optimization
export function getOptimizedVideoUrl(baseUrl: string): string {
  return baseUrl; // Just return the direct URL
}

// Basic video optimizations
export const VideoOptimizations = {
  // Basic preconnect
  preconnectToCDN: () => {
    if (typeof window === "undefined") return;

    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = "https://customer-vs7mnf7pn9caalyg.cloudflarestream.com";
    document.head.appendChild(link);
  },

  // Basic video element setup
  optimizeVideoElement: (video: HTMLVideoElement) => {
    video.preload = "metadata";
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    return video;
  },
};

// Simple intersection observer
export function createVideoIntersectionObserver(
  callback: (video: HTMLVideoElement, isVisible: boolean) => void
) {
  if (typeof window === "undefined") return null;

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        callback(video, entry.isIntersecting);
      });
    },
    {
      threshold: 0.25,
      rootMargin: "50px",
    }
  );
}
