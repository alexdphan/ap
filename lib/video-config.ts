/**
 * Mobile-optimized video configuration
 */

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

const isSlowConnection = () => {
  if (typeof window === "undefined") return false;
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
  return (
    connection &&
    (connection.effectiveType === "slow-2g" ||
      connection.effectiveType === "2g" ||
      connection.saveData)
  );
};

// Mobile-optimized video quality presets
export const VIDEO_QUALITIES = {
  low: { width: 480, height: 270, suffix: "_480p" },
  medium: { width: 720, height: 405, suffix: "_720p" },
  high: { width: 1080, height: 607, suffix: "_1080p" },
} as const;

// Smart quality detection for mobile
export function getOptimalVideoQuality(): keyof typeof VIDEO_QUALITIES {
  if (typeof window === "undefined") return "medium";

  const mobile = isMobile();
  const iOS = isIOS();
  const slowConnection = isSlowConnection();

  // Force lower quality on mobile with slow connections
  if (mobile && slowConnection) {
    return "low";
  }

  // iOS devices can handle higher quality but be conservative
  if (iOS) {
    return "medium";
  }

  // Android mobile devices
  if (mobile) {
    return "medium";
  }

  const connection = (
    navigator as Navigator & { connection?: { effectiveType?: string } }
  ).connection;

  // Desktop connection-based detection
  if (connection?.effectiveType === "3g") {
    return "medium";
  }

  return "high";
}

// Direct video URL - no optimization
export function getOptimizedVideoUrl(baseUrl: string): string {
  return baseUrl; // Just return the direct URL
}

// Mobile-optimized video optimizations
export const VideoOptimizations = {
  // Enhanced preconnect for mobile
  preconnectToCDN: () => {
    if (typeof window === "undefined") return;

    const links = [
      "https://customer-vs7mnf7pn9caalyg.cloudflarestream.com",
      "https://videodelivery.net",
    ];

    links.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = href;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });
  },

  // Mobile-optimized video element setup
  optimizeVideoElement: (video: HTMLVideoElement) => {
    const mobile = isMobile();
    const iOS = isIOS();

    // Basic optimizations
    video.preload = mobile ? "none" : "metadata";
    video.playsInline = true;
    video.setAttribute("playsinline", "true");

    // Mobile-specific optimizations
    if (mobile) {
      video.setAttribute("webkit-playsinline", "true");
      video.setAttribute("x-webkit-airplay", "allow");

      // iOS-specific fixes
      if (iOS) {
        video.muted = true; // iOS requires muted for autoplay
        video.setAttribute("preload", "none"); // Prevent auto-loading on iOS
      }
    }

    return video;
  },

  // Get mobile-optimized HLS config
  getHLSConfig: () => {
    const mobile = isMobile();
    const slowConnection = isSlowConnection();

    return {
      debug: false,
      enableWorker: !mobile, // Disable worker on mobile
      lowLatencyMode: false,
      backBufferLength: mobile ? 3 : 10,
      maxBufferLength: mobile ? 5 : 10,
      maxMaxBufferLength: mobile ? 10 : 30,
      maxBufferSize: mobile ? 5 * 1000 * 1000 : 60 * 1000 * 1000, // 5MB for mobile
      maxBufferHole: 0.5,
      levelLoadingTimeOut: mobile ? 20000 : 10000,
      manifestLoadingTimeOut: mobile ? 20000 : 10000,
      // Mobile-specific optimizations
      ...(mobile && {
        autoStartLoad: false, // Manual loading control on mobile
        startFragPrefetch: false,
        testBandwidth: false,
        capLevelToPlayerSize: true, // Match video size to player size
      }),
      // Slow connection optimizations
      ...(slowConnection && {
        abrEwmaDefaultEstimate: 100000, // Lower initial estimate
        abrEwmaSlowVoD: 10, // More conservative adaptation
        maxStarvationDelay: 8, // Longer starvation tolerance
      }),
    };
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
