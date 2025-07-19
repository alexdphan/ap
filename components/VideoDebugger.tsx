"use client";
import React, { useEffect, useState } from "react";

// Mobile device detection functions
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

interface ConnectionInfo {
  effectiveType?: string;
  saveData?: boolean;
  downlink?: number;
}

export default function VideoDebugger() {
  const [deviceInfo, setDeviceInfo] = useState<{
    userAgent: string;
    isMobile: boolean;
    isIOS: boolean;
    isSafari: boolean;
    connection: ConnectionInfo | null;
    viewportSize: { width: number; height: number };
    pixelRatio: number;
  } | null>(null);

  const [videoSupport, setVideoSupport] = useState<{
    hlsNative: boolean;
    hlsJs: boolean;
    mp4: boolean;
    webm: boolean;
    canAutoplay: boolean;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Device detection
    const connection = (
      navigator as Navigator & {
        connection?: {
          effectiveType?: string;
          saveData?: boolean;
          downlink?: number;
        };
      }
    ).connection;
    setDeviceInfo({
      userAgent: navigator.userAgent,
      isMobile: isMobile(),
      isIOS: isIOS(),
      isSafari: isSafari(),
      connection: connection
        ? {
            effectiveType: connection.effectiveType,
            saveData: connection.saveData,
            downlink: connection.downlink,
          }
        : null,
      viewportSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      pixelRatio: window.devicePixelRatio || 1,
    });

    // Video support testing
    const video = document.createElement("video");
    const hlsNative = video.canPlayType("application/vnd.apple.mpegurl") !== "";
    const mp4 = video.canPlayType("video/mp4") !== "";
    const webm = video.canPlayType("video/webm") !== "";

    // Test autoplay capability
    const testAutoplay = async () => {
      const testVideo = document.createElement("video");
      testVideo.muted = true;
      testVideo.autoplay = true;
      testVideo.src =
        "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMWF2YzEAAAAIZnJlZQAAAuFtZGF0AAACvgYF//9g3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDEyOCByMjY0MyA1Y2Y2YWQzIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIGluZGV4ZXM6IGY0NDAwZDVlMTQyNDMwIDRjNGJhOGM1NGNiN2JkNyAtIENvcHlsZWZ0IDIwMTUtMjAxNiBhLWFjIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yIDMgMS0yID3l5vdBMmV0YQAAABpm1kYXQAAAKdBgfAm/ACAeJAAABOQrAA=";
      testVideo.playsInline = true;

      try {
        await testVideo.play();
        return true;
      } catch {
        return false;
      }
    };

    testAutoplay().then((canAutoplay) => {
      // Import Hls.js dynamically to test availability
      import("hls.js")
        .then((HlsModule) => {
          setVideoSupport({
            hlsNative,
            hlsJs: HlsModule.default.isSupported(),
            mp4,
            webm,
            canAutoplay,
          });
        })
        .catch(() => {
          setVideoSupport({
            hlsNative,
            hlsJs: false,
            mp4,
            webm,
            canAutoplay,
          });
        });
    });
  }, []);

  if (!deviceInfo || !videoSupport) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <div className="text-sm font-mono">Loading device info...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg space-y-4">
      <h3 className="text-lg font-bold">Video Debug Info</h3>

      <div className="space-y-2">
        <h4 className="font-semibold text-green-600">Device Detection</h4>
        <div className="text-sm font-mono space-y-1">
          <div>
            Mobile:{" "}
            <span
              className={
                deviceInfo.isMobile ? "text-green-600" : "text-red-600"
              }
            >
              {String(deviceInfo.isMobile)}
            </span>
          </div>
          <div>
            iOS:{" "}
            <span
              className={deviceInfo.isIOS ? "text-green-600" : "text-red-600"}
            >
              {String(deviceInfo.isIOS)}
            </span>
          </div>
          <div>
            Safari:{" "}
            <span
              className={
                deviceInfo.isSafari ? "text-green-600" : "text-red-600"
              }
            >
              {String(deviceInfo.isSafari)}
            </span>
          </div>
          <div>
            Viewport: {deviceInfo.viewportSize.width}x
            {deviceInfo.viewportSize.height}
          </div>
          <div>Pixel Ratio: {deviceInfo.pixelRatio}</div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-blue-600">Connection Info</h4>
        <div className="text-sm font-mono space-y-1">
          {deviceInfo.connection ? (
            <>
              <div>
                Type: {deviceInfo.connection.effectiveType || "unknown"}
              </div>
              <div>
                Save Data:{" "}
                <span
                  className={
                    deviceInfo.connection.saveData
                      ? "text-orange-600"
                      : "text-green-600"
                  }
                >
                  {String(deviceInfo.connection.saveData)}
                </span>
              </div>
              <div>
                Downlink: {deviceInfo.connection.downlink || "unknown"} Mbps
              </div>
            </>
          ) : (
            <div>Connection API not supported</div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-purple-600">Video Support</h4>
        <div className="text-sm font-mono space-y-1">
          <div>
            HLS Native:{" "}
            <span
              className={
                videoSupport.hlsNative ? "text-green-600" : "text-red-600"
              }
            >
              {String(videoSupport.hlsNative)}
            </span>
          </div>
          <div>
            HLS.js:{" "}
            <span
              className={videoSupport.hlsJs ? "text-green-600" : "text-red-600"}
            >
              {String(videoSupport.hlsJs)}
            </span>
          </div>
          <div>
            MP4:{" "}
            <span
              className={videoSupport.mp4 ? "text-green-600" : "text-red-600"}
            >
              {String(videoSupport.mp4)}
            </span>
          </div>
          <div>
            WebM:{" "}
            <span
              className={videoSupport.webm ? "text-green-600" : "text-red-600"}
            >
              {String(videoSupport.webm)}
            </span>
          </div>
          <div>
            Autoplay:{" "}
            <span
              className={
                videoSupport.canAutoplay ? "text-green-600" : "text-orange-600"
              }
            >
              {String(videoSupport.canAutoplay)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-gray-600">User Agent</h4>
        <div className="text-xs font-mono bg-white p-2 rounded overflow-x-auto">
          {deviceInfo.userAgent}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-indigo-600">Recommendations</h4>
        <div className="text-sm space-y-1">
          {deviceInfo.isMobile && !videoSupport.canAutoplay && (
            <div className="text-orange-600">
              ⚠️ Autoplay disabled - requires user interaction
            </div>
          )}
          {deviceInfo.isIOS && !deviceInfo.isSafari && (
            <div className="text-blue-600">
              ℹ️ iOS Chrome/Firefox may have different behavior than Safari
            </div>
          )}
          {deviceInfo.connection?.saveData && (
            <div className="text-orange-600">
              📱 Save Data mode enabled - consider lower quality
            </div>
          )}
          {!videoSupport.hlsNative && !videoSupport.hlsJs && (
            <div className="text-red-600">❌ No HLS support detected</div>
          )}
          {deviceInfo.isMobile && (
            <div className="text-green-600">
              ✅ Mobile optimizations should be active
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
