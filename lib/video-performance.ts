/**
 * Video Performance Monitoring Utility
 * Tracks video loading metrics and optimization effectiveness
 */

interface VideoMetrics {
  url: string;
  loadStartTime: number;
  loadEndTime?: number;
  firstFrameTime?: number;
  fileSize?: number;
  quality: string;
  connectionType?: string;
}

class VideoPerformanceMonitor {
  private metrics: VideoMetrics[] = [];
  private enabled =
    typeof window !== "undefined" && process.env.NODE_ENV === "development";

  startTracking(url: string, quality: string): string {
    if (!this.enabled) return "";

    const id = `${url}-${Date.now()}`;
    const metric: VideoMetrics = {
      url,
      loadStartTime: performance.now(),
      quality,
      connectionType: this.getConnectionType(),
    };

    this.metrics.push(metric);
    return id;
  }

  recordLoadComplete(url: string): void {
    if (!this.enabled) return;

    const metric = this.metrics.find((m) => m.url === url && !m.loadEndTime);
    if (metric) {
      metric.loadEndTime = performance.now();
      this.logMetric(metric);
    }
  }

  recordFirstFrame(url: string): void {
    if (!this.enabled) return;

    const metric = this.metrics.find((m) => m.url === url && !m.firstFrameTime);
    if (metric) {
      metric.firstFrameTime = performance.now();
    }
  }

  private getConnectionType(): string {
    const connection = (
      navigator as Navigator & { connection?: { effectiveType?: string } }
    ).connection;
    return connection?.effectiveType || "unknown";
  }

  private logMetric(metric: VideoMetrics): void {
    const loadTime = metric.loadEndTime! - metric.loadStartTime;
    const firstFrameTime = metric.firstFrameTime
      ? metric.firstFrameTime - metric.loadStartTime
      : null;

    console.group(`🎬 Video Performance: ${metric.url.split("/").pop()}`);
    console.log(`📊 Load Time: ${loadTime.toFixed(2)}ms`);
    if (firstFrameTime) {
      console.log(`🖼️ First Frame: ${firstFrameTime.toFixed(2)}ms`);
    }
    console.log(`📱 Quality: ${metric.quality}`);
    console.log(`🌐 Connection: ${metric.connectionType}`);
    console.groupEnd();
  }

  getAverageLoadTime(): number {
    const completedMetrics = this.metrics.filter((m) => m.loadEndTime);
    if (completedMetrics.length === 0) return 0;

    const totalTime = completedMetrics.reduce(
      (sum, m) => sum + (m.loadEndTime! - m.loadStartTime),
      0
    );
    return totalTime / completedMetrics.length;
  }

  getMetricsSummary() {
    const completed = this.metrics.filter((m) => m.loadEndTime);
    const avgLoadTime = this.getAverageLoadTime();

    return {
      totalVideos: this.metrics.length,
      completedLoads: completed.length,
      averageLoadTime: avgLoadTime,
      fastestLoad: Math.min(
        ...completed.map((m) => m.loadEndTime! - m.loadStartTime)
      ),
      slowestLoad: Math.max(
        ...completed.map((m) => m.loadEndTime! - m.loadStartTime)
      ),
    };
  }
}

export const videoPerformanceMonitor = new VideoPerformanceMonitor();

// Performance comparison helper
export function compareWithBaseline(currentTime: number, baselineTime: number) {
  const improvement = ((baselineTime - currentTime) / baselineTime) * 100;

  if (improvement > 0) {
    console.log(`🚀 Performance improved by ${improvement.toFixed(1)}%`);
  } else {
    console.log(
      `📉 Performance decreased by ${Math.abs(improvement).toFixed(1)}%`
    );
  }

  return improvement;
}
