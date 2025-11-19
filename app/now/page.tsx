"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
// import CityOfDreamsSticker from "@/components/stickers/CityOfDreamsSticker";
import VideoIframe from "@/components/VideoIframe";

export default function NowPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalVideo, setModalVideo] = useState<string | null>(null);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Wait briefly before showing videos
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Hide body scroll and mobile nav when modal is open
  useEffect(() => {
    if (modalVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [modalVideo]);

  const handleVideoClick = (
    video: string,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setClickPosition({ x: centerX, y: centerY });
    setModalVideo(video);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-block hover:opacity-70 transition-opacity"
          >
            <h1 className="text-heading" style={{ color: "var(--gray-900)" }}>
              Now
            </h1>
          </Link>
          <div
            className="h-px w-full mt-2"
            style={{ backgroundColor: "var(--gray-100)" }}
          />
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Intro Paragraph */}
          <div className="relative">
            {/* <CityOfDreamsSticker isVisible={isLoaded} /> */}

            <p
              className="text-body relative z-10"
              style={{ color: "var(--gray-700)" }}
            >
              I live in NYC, and visit SF often. I love both cities and the
              people in them. Without these cities, I wouldn't be where I am
              today.
            </p>
          </div>

          {/* Videos Section - Side by Side */}
          <div className="grid grid-cols-2 gap-4 relative">
            {/* Ticket Sticker - Between Videos */}
            {/* <TicketSticker
              from="NYC"
              to="SF"
              distance="2,906 mi"
              duration="6 hrs"
              isVisible={isLoaded}
              className="absolute top-10 md:top-24 left-1/2 -translate-x-1/2 z-40 -rotate-6"
            /> */}

            {/* NYC Video */}
            <div className="relative">
              <div className="mb-2">
                <p
                  className="text-caption"
                  style={{ color: "var(--gray-400)" }}
                >
                  New York City
                </p>
              </div>

              <div
                className="cursor-pointer"
                onClick={(e) => handleVideoClick("nyc", e)}
              >
                <div className="w-full aspect-video relative overflow-hidden">
                  <VideoIframe
                    src="https://www.youtube.com/embed/R1CG9ZuK2V8?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&iv_load_policy=3&disablekb=1&cc_load_policy=0&playsinline=1&loop=1&playlist=R1CG9ZuK2V8"
                    title="NYC Livestream"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                    className="pointer-events-none absolute"
                    style={{
                      width: "170%",
                      height: "170%",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>

              <div className="mt-2 flex justify-between items-end">
                <p
                  className="text-caption"
                  style={{ color: "var(--gray-400)" }}
                >
                  Live feed, 2025
                </p>
                <p
                  className="text-caption tracking-wider font-light"
                  style={{ color: "var(--gray-400)" }}
                >
                  EST
                </p>
              </div>
            </div>

            {/* SF Video */}
            <div className="relative">
              <div className="mb-2">
                <p
                  className="text-caption"
                  style={{ color: "var(--gray-400)" }}
                >
                  San Francisco
                </p>
              </div>

              <div
                className="cursor-pointer relative"
                onClick={(e) => handleVideoClick("sf", e)}
              >
                <div className="w-full aspect-video relative overflow-hidden">
                  <VideoIframe
                    src="https://www.youtube.com/embed/CXYr04BWvmc?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&iv_load_policy=3&disablekb=1&cc_load_policy=0&playsinline=1&loop=1&playlist=CXYr04BWvmc"
                    title="SF Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                    className="pointer-events-none absolute"
                    style={{
                      width: "170%",
                      height: "170%",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>

              <div className="mt-2 flex justify-between items-end">
                <p
                  className="text-caption"
                  style={{ color: "var(--gray-400)" }}
                >
                  Live feed, 2025
                </p>
                <p
                  className="text-caption tracking-wider font-light"
                  style={{ color: "var(--gray-400)" }}
                >
                  PST
                </p>
              </div>
            </div>
          </div>

          {/* Pull Quote */}
          <div
            className="py-4"
            style={{
              borderTop: "1px solid var(--gray-100)",
              borderBottom: "1px solid var(--gray-100)",
            }}
          >
            <p
              className="text-body text-center"
              style={{ color: "var(--gray-700)" }}
            >
              "If you can make it there, you'll make it anywhere"
            </p>
          </div>

          {/* Additional Info */}
          <div className="space-y-6">
            <div>
              <p
                className="text-body mb-3"
                style={{ color: "var(--gray-400)" }}
              >
                Currently Working On
              </p>
              <p className="text-body" style={{ color: "var(--gray-700)" }}>
                Helping startups with hiring and growth.
              </p>
            </div>

            <div>
              <p
                className="text-body mb-3"
                style={{ color: "var(--gray-400)" }}
              >
                Recent Highlights
              </p>
              <p className="text-body" style={{ color: "var(--gray-700)" }}>
                Shipped{" "}
                <Link
                  href="https://findrho.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body hover:opacity-70 transition-opacity underline"
                  style={{ color: "var(--gray-700)" }}
                >
                  findrho.co
                </Link>{" "}
                and helped some friends find opportunities they love.
              </p>
            </div>

            <div
              className="h-px w-16"
              style={{ backgroundColor: "var(--gray-100)" }}
            />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p
                  className="text-caption mb-2"
                  style={{ color: "var(--gray-400)" }}
                >
                  Availability
                </p>
                <p className="text-body" style={{ color: "var(--gray-700)" }}>
                  Open
                </p>
              </div>
              <div>
                <p
                  className="text-caption mb-2"
                  style={{ color: "var(--gray-400)" }}
                >
                  Last Updated
                </p>
                <p className="text-body" style={{ color: "var(--gray-700)" }}>
                  November 2025 *
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Number - Magazine Style */}
        <div className="mt-6 flex justify-between items-center">
          <div
            className="h-px flex-1"
            style={{ backgroundColor: "var(--gray-100)" }}
          />
          <div className="px-4">
            <p className="text-body" style={{ color: "var(--gray-400)" }}>
              02
            </p>
          </div>
          <div
            className="h-px flex-1"
            style={{ backgroundColor: "var(--gray-100)" }}
          />
        </div>
      </motion.div>

      {/* Modal - Rendered at body level via Portal */}
      {mounted &&
        modalVideo &&
        createPortal(
          <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 backdrop-blur-lg"
                onClick={() => setModalVideo(null)}
              />

              {/* Modal Content */}
              <motion.div
                initial={{
                  scale: 0.1,
                  x:
                    clickPosition.x -
                    (typeof window !== "undefined" ? window.innerWidth / 2 : 0),
                  y:
                    clickPosition.y -
                    (typeof window !== "undefined"
                      ? window.innerHeight / 2
                      : 0),
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  x: 0,
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  scale: 0.1,
                  x:
                    clickPosition.x -
                    (typeof window !== "undefined" ? window.innerWidth / 2 : 0),
                  y:
                    clickPosition.y -
                    (typeof window !== "undefined"
                      ? window.innerHeight / 2
                      : 0),
                  opacity: 0,
                  transition: {
                    duration: 0.4,
                    ease: [0.32, 0.72, 0, 1],
                  },
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className="relative aspect-video max-w-7xl w-full mx-4"
              >
                {/* Video */}
                <div className="w-full h-full">
                  <VideoIframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${
                      modalVideo === "nyc" ? "R1CG9ZuK2V8" : "CXYr04BWvmc"
                    }?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&showinfo=0`}
                    title={modalVideo === "nyc" ? "NYC Livestream" : "SF Video"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
