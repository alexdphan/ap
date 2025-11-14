"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import StarburstSticker from "@/components/stickers/StarburstSticker";
import PaperNoteSticker from "@/components/stickers/PaperNoteSticker";

export default function WorkPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showControls, setShowControls] = useState<{
    rho: boolean;
    browserbase: boolean;
  }>({
    rho: false,
    browserbase: false,
  });
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

  // Hide body scroll when modal is open
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
      {/* Unified Responsive Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col w-full"
      >
        {/* Magazine Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-block hover:opacity-70 transition-opacity"
          >
            <h1 className="text-heading" style={{ color: "var(--gray-900)" }}>
              Work
            </h1>
          </Link>
          <div
            className="h-px w-full mt-2"
            style={{ backgroundColor: "var(--gray-100)" }}
          />
        </div>

        {/* Project Sections */}
        <div className="space-y-6">
          {/* Rho Section */}
          <div
            className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4 md:gap-6 items-start pb-6"
            style={{ borderBottom: "1px solid var(--gray-100)" }}
          >
            <div className="space-y-2 md:pt-2 order-2 md:order-1">
              <div>
                <a
                  href="https://rho.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body mb-2 hover:opacity-70 transition-colors cursor-pointer inline-block"
                  style={{ color: "var(--gray-400)" }}
                >
                  Rho
                </a>
                <h2
                  className="text-heading mb-2"
                  style={{ color: "var(--gray-900)" }}
                >
                  Modern Business Banking
                </h2>
                <p className="text-body" style={{ color: "var(--gray-700)" }}>
                  Transforming how businesses manage their finances with
                  intelligent banking solutions that save time and reduce
                  complexity.
                </p>
              </div>
              <div
                className="h-px w-16"
                style={{ backgroundColor: "var(--gray-100)" }}
              />
              <p className="text-body" style={{ color: "var(--gray-400)" }}>
                Fintech • Series C
              </p>
            </div>

            <div className="space-y-2 order-1 md:order-2">
              <div className="relative">
                <div className="w-full aspect-video relative overflow-hidden">
                  {/* Loading cover */}
                  <AnimatePresence>
                    {!isLoaded && (
                      <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center z-10"
                        style={{ backgroundColor: "var(--gray-100)" }}
                      >
                        <motion.div
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="text-caption md:text-body font-light tracking-wide"
                          style={{ color: "var(--gray-400)" }}
                        >
                          Waking up the bankers
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Video iframe */}
                  <motion.div
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{
                      opacity: isLoaded ? 1 : 0,
                      scale: isLoaded ? 1 : 1.05,
                    }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-full absolute inset-0 cursor-pointer"
                    onClick={(e) => handleVideoClick("rho", e)}
                  >
                    <iframe
                      src="https://customer-vs7mnf7pn9caalyg.cloudflarestream.com/d92f2aed546bf4a481c20b22328c0611/iframe?autoplay=true&muted=true&controls=false&loop=true"
                      className="absolute pointer-events-none w-full h-full"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope"
                      style={{
                        border: 0,
                        top: "0",
                        left: "0",
                      }}
                    />
                  </motion.div>
                </div>
                <StarburstSticker
                  text="Find Rho in action!"
                  isVisible={isLoaded}
                  className="absolute -right-4 md:-right-12 -top-12 scale-[1] md:scale-[0.6]"
                />
              </div>
            </div>
          </div>

          {/* Browserbase Section */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-4 md:gap-6 items-start pb-6">
            <div className="space-y-2 order-1 md:order-1">
              <div className="relative">
                <div className="w-full aspect-video relative overflow-hidden">
                  {/* Loading cover */}
                  <AnimatePresence>
                    {!isLoaded && (
                      <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center z-10"
                        style={{ backgroundColor: "var(--gray-100)" }}
                      >
                        <motion.div
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="text-caption md:text-body font-light tracking-wide"
                          style={{ color: "var(--gray-400)" }}
                        >
                          Chasing the headless browsers
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Video iframe */}
                  <motion.div
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{
                      opacity: isLoaded ? 1 : 0,
                      scale: isLoaded ? 1 : 1.05,
                    }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-full absolute inset-0 cursor-pointer"
                    onClick={(e) => handleVideoClick("browserbase", e)}
                  >
                    <iframe
                      src="https://customer-vs7mnf7pn9caalyg.cloudflarestream.com/51a62e7e813329fb699cd3cf07804c2f/iframe?autoplay=true&muted=true&controls=false&loop=true"
                      className="absolute pointer-events-none w-full h-full"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope"
                      style={{
                        border: 0,
                        top: "0",
                        left: "0",
                      }}
                    />
                  </motion.div>
                </div>
                <PaperNoteSticker
                  text="Browserbase Director and Series B Launch"
                  isVisible={isLoaded}
                  className="absolute -bottom-2 md:-bottom-6 left-2 w-[90px] md:w-[80px] h-[60px] md:h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-2 md:pt-2 order-2 md:order-2">
              <div>
                <a
                  href="https://browserbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body mb-2 hover:opacity-70 transition-colors cursor-pointer inline-block"
                  style={{ color: "var(--gray-400)" }}
                >
                  Browserbase
                </a>
                <h2
                  className="text-heading mb-2"
                  style={{ color: "var(--gray-900)" }}
                >
                  Headless Browser Infrastructure
                </h2>
                <p className="text-body" style={{ color: "var(--gray-700)" }}>
                  Building the serverless runtime for browser automation. Making
                  it simple for developers to run, debug, and monitor headless
                  browsers at scale.
                </p>
              </div>
              <p className="text-body" style={{ color: "var(--gray-400)" }}>
                AI Grant Batch 3 • Series B
              </p>
            </div>
          </div>

          {/* Other Projects Section */}
          <div className="pt-0 md:pt-0">
            <div className="mb-4 md:mb-0">
              <a
                href="https://alexdphan-github-io-git-main-alexander-phans-projects.vercel.app/projects"
                className="text-body mb-3 hover:opacity-70 transition-colors cursor-pointer inline-block"
                style={{ color: "var(--gray-400)" }}
              >
                Other Projects →
              </a>
            </div>

            <div className="flex gap-4 md:hidden">
              <p className="text-body" style={{ color: "var(--gray-700)" }}>
                Analytics Platform • Mobile Commerce
              </p>
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
              01
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
                  <iframe
                    className="w-full h-full"
                    src={`https://customer-vs7mnf7pn9caalyg.cloudflarestream.com/${
                      modalVideo === "rho"
                        ? "d92f2aed546bf4a481c20b22328c0611"
                        : "51a62e7e813329fb699cd3cf07804c2f"
                    }/iframe?autoplay=true&muted=false&controls=true`}
                    title={
                      modalVideo === "rho" ? "Rho Demo" : "Browserbase Demo"
                    }
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                    style={{ border: 0 }}
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
