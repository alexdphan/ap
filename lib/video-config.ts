/**
 * Optimized video configuration for maximum performance
 */

// Video quality presets for different connection speeds
export const VIDEO_QUALITIES = {
  low: { width: 480, height: 270, suffix: "_480p" },
  medium: { width: 720, height: 405, suffix: "_720p" },
  high: { width: 1080, height: 607, suffix: "_1080p" },
} as const;

// Detect user's connection speed and device capabilities
export function getOptimalVideoQuality(): keyof typeof VIDEO_QUALITIES {
  if (typeof window === "undefined") return "medium";

  const connection = (
    navigator as Navigator & { connection?: { effectiveType?: string } }
  ).connection;
  const devicePixelRatio = window.devicePixelRatio || 1;
  const screenWidth = window.screen.width;

  // Check for slow connection
  if (connection) {
    if (
      connection.effectiveType === "slow-2g" ||
      connection.effectiveType === "2g"
    ) {
      return "low";
    }
    if (connection.effectiveType === "3g") {
      return "medium";
    }
  }

  // Check device capabilities
  if (screenWidth < 768 || devicePixelRatio < 2) {
    return "medium";
  }

  return "high";
}

// Preload critical videos for instant playback
export function preloadVideo(
  src: string,
  priority: "high" | "low" = "low"
): void {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "video";
  link.href = src;

  if (priority === "high") {
    link.setAttribute("importance", "high");
  }

  document.head.appendChild(link);
}

// Generate optimized video URLs with CDN parameters
export function getOptimizedVideoUrl(
  baseUrl: string,
  quality?: keyof typeof VIDEO_QUALITIES
): string {
  // Only run optimization on client-side to avoid hydration issues
  if (typeof window === "undefined") return baseUrl;

  const selectedQuality = quality || getOptimalVideoQuality();

  // For R2 URLs, we can add optimization parameters
  if (baseUrl.includes("r2.dev")) {
    try {
      const url = new URL(baseUrl);

      // Add cache-busting and optimization headers via URL params if supported
      url.searchParams.set("format", "mp4");
      url.searchParams.set("quality", selectedQuality);

      return url.toString();
    } catch {
      // Fallback to original URL if URL parsing fails
      return baseUrl;
    }
  }

  return baseUrl;
}

// Video loading optimization utilities
export const VideoOptimizations = {
  // DNS prefetch for video domains
  prefetchDomains: () => {
    if (typeof window === "undefined") return;

    const domains = [
      "pub-5018f734e2604654b16c6609e8c82280.r2.dev",
      "pub-abc07a46b5d24733ab6e6ce723154196.r2.dev",
    ];

    domains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "dns-prefetch";
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });
  },

  // Preconnect to video CDN
  preconnectToCDN: () => {
    if (typeof window === "undefined") return;

    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = "https://pub-5018f734e2604654b16c6609e8c82280.r2.dev";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  },

  // Optimize video element for performance
  optimizeVideoElement: (video: HTMLVideoElement) => {
    // Enable hardware acceleration
    video.style.willChange = "transform";
    video.style.transform = "translateZ(0)";

    // Optimize loading
    video.preload = "metadata";
    video.playsInline = true;

    // Add performance attributes
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");

    return video;
  },
};

// Video intersection observer for lazy loading
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
      threshold: 0.25, // Start loading when 25% visible
      rootMargin: "50px", // Start loading 50px before entering viewport
    }
  );
}
