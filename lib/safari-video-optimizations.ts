/**
 * Safari-Specific Video Optimizations
 * Handles Safari's unique video loading requirements for instant playback
 */

// Detect Safari browser and iOS
export function isSafari(): boolean {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent;
  return /^((?!chrome|android).)*safari/i.test(userAgent);
}

export function isIOSSafari(): boolean {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(userAgent) && !("MSStream" in window);
}

// Safari-specific preloading strategies
export class SafariVideoOptimizer {
  private preloadedVideos = new Set<string>();
  private videoCache = new Map<string, HTMLVideoElement>();

  // Aggressive preloading for Safari
  preloadForSafari(
    videoUrl: string,
    priority: "high" | "medium" | "low" = "medium"
  ): void {
    if (this.preloadedVideos.has(videoUrl)) return;

    // Create invisible video element for preloading
    const video = document.createElement("video");
    video.src = videoUrl;

    // Set preload strategy based on priority
    switch (priority) {
      case "high":
        video.preload = "auto"; // Force full preload for instant playback
        break;
      case "medium":
        video.preload = "metadata"; // Load metadata and some content
        break;
      case "low":
        video.preload = "none"; // Only load when needed
        break;
    }

    video.muted = true; // Required for autoplay
    video.playsInline = true; // iOS requirement
    video.style.display = "none";
    video.style.position = "absolute";
    video.style.top = "-9999px";

    // Safari-specific attributes
    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("playsinline", "true");

    // Add to DOM for loading (Safari requirement)
    document.body.appendChild(video);

    // Load the video
    video.load();

    // Cache the loaded video
    video.addEventListener("canplaythrough", () => {
      this.videoCache.set(videoUrl, video);
      this.preloadedVideos.add(videoUrl);

      // Remove from DOM after loading
      setTimeout(() => {
        if (video.parentNode) {
          video.parentNode.removeChild(video);
        }
      }, 1000);
    });

    // Cleanup on error
    video.addEventListener("error", () => {
      if (video.parentNode) {
        video.parentNode.removeChild(video);
      }
    });
  }

  // Get preloaded video data for instant transfer
  getPreloadedVideo(videoUrl: string): HTMLVideoElement | null {
    return this.videoCache.get(videoUrl) || null;
  }

  // Safari-specific video element optimization
  optimizeVideoForSafari(video: HTMLVideoElement): void {
    // Force hardware acceleration
    video.style.webkitTransform = "translate3d(0,0,0)";
    video.style.webkitBackfaceVisibility = "hidden";
    video.style.webkitPerspective = "1000";

    // iOS-specific optimizations
    if (isIOSSafari()) {
      video.setAttribute("webkit-playsinline", "true");
      video.setAttribute("playsinline", "true");
    }

    // Safari-specific attributes for better performance
    video.setAttribute("preload", "auto");
    video.setAttribute("x-webkit-airplay", "allow");

    // Force immediate loading
    video.load();
  }

  // Predict and preload next videos based on user behavior
  predictivePreload(currentIndex: number, videoUrls: string[]): void {
    const preloadIndices = [
      currentIndex + 1, // Next video
      currentIndex - 1, // Previous video
      currentIndex + 2, // Two ahead
    ].filter((i) => i >= 0 && i < videoUrls.length);

    preloadIndices.forEach((index, priorityIndex) => {
      const url = videoUrls[index];
      if (url) {
        setTimeout(() => {
          this.preloadForSafari(url, priorityIndex === 0 ? "high" : "medium");
        }, priorityIndex * 100); // Stagger preloading
      }
    });
  }

  // Clear cache to prevent memory issues
  clearCache(): void {
    this.videoCache.clear();
    this.preloadedVideos.clear();
  }
}

export const safariOptimizer = new SafariVideoOptimizer();

// Safari-specific video loading with blob optimization
export async function loadVideoWithBlob(videoUrl: string): Promise<string> {
  try {
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.warn("Blob loading failed, using direct URL:", error);
    return videoUrl;
  }
}

// Safari video intersection observer with aggressive loading
export function createSafariVideoObserver(
  callback: (
    video: HTMLVideoElement,
    isVisible: boolean,
    distance: number
  ) => void
) {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        const distance = entry.boundingClientRect.top;
        callback(video, entry.isIntersecting, distance);
      });
    },
    {
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0], // Multiple thresholds for precise control
      rootMargin: isSafari() ? "200px" : "100px", // Larger margin for Safari
    }
  );
}

// Safari connection speed detection
export function getSafariConnectionSpeed(): "slow" | "medium" | "fast" {
  if (typeof window === "undefined") return "medium";

  const connection = (
    navigator as Navigator & {
      connection?: {
        effectiveType?: string;
        downlink?: number;
      };
    }
  ).connection;

  if (connection) {
    // Use downlink speed if available
    if (connection.downlink) {
      if (connection.downlink >= 10) return "fast";
      if (connection.downlink >= 1.5) return "medium";
      return "slow";
    }

    // Fallback to effective type
    switch (connection.effectiveType) {
      case "4g":
        return "fast";
      case "3g":
        return "medium";
      default:
        return "slow";
    }
  }

  // Default assumption for Safari
  return "medium";
}

// Safari-specific codec preferences
export function getSafariOptimalFormat(baseUrl: string): string {
  // Safari strongly prefers H.264/MP4
  if (baseUrl.includes(".webm")) {
    // Try to find MP4 alternative
    return baseUrl.replace(".webm", ".mp4");
  }

  // Add Safari-specific encoding hints
  if (baseUrl.includes("r2.dev")) {
    try {
      const url = new URL(baseUrl);
      url.searchParams.set("format", "mp4");
      url.searchParams.set("codec", "h264");
      url.searchParams.set("profile", "baseline"); // Safari-compatible profile
      return url.toString();
    } catch {
      return baseUrl;
    }
  }

  return baseUrl;
}
