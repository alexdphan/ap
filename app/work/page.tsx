"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    // Wait briefly before showing videos
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

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
        className="flex flex-col w-full pt-12 pb-20"
      >
        {/* Magazine Header */}
        <div className="mb-8">
          <h1 className="editorial-display text-4xl md:text-5xl text-gray-900 mb-3">
            Work
          </h1>
          <div className="h-px bg-gray-300 w-full" />
        </div>

        {/* Project Sections */}
        <div className="space-y-8">
          {/* Rho Section */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-4 md:gap-8 items-start pb-8 border-b border-gray-200">
            <div className="space-y-3 md:pt-4 order-2 md:order-1">
              <div>
                <a
                  href="https://rho.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-label text-[10px] text-gray-400 mb-1 hover:text-gray-600 transition-colors cursor-pointer inline-block md:pointer-events-none md:cursor-default"
                >
                  RHO
                </a>
                <h2 className="editorial-display text-2xl text-gray-900 mb-2">
                  Modern Business Banking
                </h2>
                <p className="editorial-body text-xs text-gray-700 leading-relaxed">
                  Transforming how businesses manage their finances with
                  intelligent banking solutions that save time and reduce
                  complexity.
                </p>
              </div>
              <div className="h-px bg-gray-200 w-16" />
              <p className="editorial-caption text-[9px] text-gray-500">
                Fintech • Series C
              </p>
            </div>

            <div className="space-y-2 order-1 md:order-2">
              <div className="relative">
                <div className="w-full h-[200px] md:h-[220px] relative overflow-hidden">
                  {/* Loading cover */}
                  <AnimatePresence>
                    {!isLoaded && (
                      <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10"
                      >
                        <motion.div
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="text-gray-400 text-xs font-light tracking-wide"
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
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope"
                      style={{ width: "110%", height: "110%", border: 0 }}
                    />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{
                    opacity: isLoaded ? 1 : 0,
                    scale: isLoaded ? 1 : 1.05,
                  }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -right-6 md:-right-15 -top-12 pointer-events-none"
                >
                  <div className="relative w-[140px] h-[140px]">
                    {/* Starburst shape */}
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full drop-shadow-md rotate-200"
                    >
                      <defs>
                        <filter id="shadow">
                          <feDropShadow
                            dx="0"
                            dy="2"
                            stdDeviation="3"
                            floodOpacity="0.3"
                          />
                        </filter>
                      </defs>
                      {/* Outer gold border */}
                      <polygon
                        points="50,5 57,30 66,23 64,35 80,28 71,40 90,38 75,49 96,52 80,59 94,70 77,70 86,85 70,77 74,95 60,82 57,99 50,84 43,99 40,82 26,95 30,77 14,85 23,70 6,70 20,59 4,52 25,49 10,38 29,40 20,28 36,35 34,23 43,30"
                        fill="#D4AF37"
                        filter="url(#shadow)"
                      />
                      {/* Black middle layer for depth */}
                      <polygon
                        points="50,7 56,30 65,24 63,35 79,29 70,40 89,38 76,48 95,51 79,58 92,68 78,69 85,83 71,76 73,93 61,81 58,97 50,83 42,97 39,81 27,93 29,76 15,83 22,69 8,68 21,58 5,51 24,48 11,38 30,40 21,29 37,35 35,24 44,30"
                        fill="#1a1a1a"
                      />
                      {/* Inner red starburst */}
                      <polygon
                        points="50,10 54,31 62,26 61,36 75,33 70,43 85,42 77,50 90,52 79,58 88,66 79,67 84,80 72,74 73,90 62,79 58,95 50,82 42,95 38,79 27,90 28,74 16,80 21,67 12,66 21,58 10,52 23,50 15,42 30,43 25,33 39,36 38,26 46,31"
                        fill="#DC2626"
                      />
                    </svg>
                    {/* WOW text */}
                    <div className="absolute inset-0 flex items-center justify-center px-4 -translate-y-3 translate-x-2">
                      <span
                        className="text-white font-black text-xl tracking-tight text-center leading-tight"
                        style={{
                          fontFamily: 'Impact, "Arial Black", sans-serif',
                          WebkitTextStroke: "1.5px black",
                          paintOrder: "stroke fill",
                          transform: "rotate(-8deg)",
                          display: "block",
                        }}
                      >
                        Find Rho in action!
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Browserbase Section */}
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4 md:gap-8 items-start pb-8">
            <div className="space-y-3 order-1 md:order-1">
              <div className="relative">
                <div className="w-full h-[200px] md:h-[220px] relative overflow-hidden">
                  {/* Loading cover */}
                  <AnimatePresence>
                    {!isLoaded && (
                      <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10"
                      >
                        <motion.div
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="text-gray-400 text-xs font-light tracking-wide"
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
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope"
                      style={{ width: "110%", height: "110%", border: 0 }}
                    />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{
                    opacity: isLoaded ? 1 : 0,
                    scale: isLoaded ? 1 : 1.05,
                  }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-2 md:-bottom-8 left-2 w-[120px] md:w-[100px] h-[80px] md:h-[100px] border border-gray-300 shadow-sm pointer-events-none bg-cover bg-center"
                  style={{ backgroundImage: "url(/paper.jpg)" }}
                >
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <p className="editorial-caption text-[8px] text-gray-900 leading-tight text-center">
                      Browserbase Director and Series B Launch
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="space-y-3 md:pt-4 order-2 md:order-2">
              <div>
                <a
                  href="https://browserbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-label text-[10px] text-gray-400 mb-1 hover:text-gray-600 transition-colors inline-block md:pointer-events-none md:cursor-default"
                >
                  BROWSERBASE
                </a>
                <h2 className="editorial-display text-2xl text-gray-900 mb-2">
                  Headless Browser Infrastructure
                </h2>
                <p className="editorial-body text-xs text-gray-700 leading-relaxed">
                  Building the serverless runtime for browser automation. Making
                  it simple for developers to run, debug, and monitor headless
                  browsers at scale.
                </p>
              </div>
              <p className="editorial-caption text-[9px] text-gray-500">
                AI Grant Batch 3 • Series B
              </p>
            </div>
          </div>

          {/* Other Projects Section */}
          <div className="pt-0 md:pt-0">
            <div className="mb-4 md:mb-0">
              <a
                href="https://alexdphan-github-io-git-main-alexander-phans-projects.vercel.app/projects"
                className="editorial-label text-[10px] text-gray-400 mb-3 hover:text-gray-600 transition-colors cursor-pointer inline-block"
              >
                OTHER PROJECTS →
              </a>
            </div>

            <div className="flex gap-4 md:hidden">
              <p className="editorial-body text-[10px] text-gray-700 leading-relaxed">
                Analytics Platform • Mobile Commerce
              </p>
            </div>
          </div>
        </div>

        {/* Page Number - Magazine Style */}
        <div className="mt-12 md:mt-6 flex justify-between items-center">
          <div className="h-px bg-gray-200 flex-1" />
          <div className="px-6 md:px-4">
            <p className="editorial-caption text-xs md:text-[10px] text-gray-400">
              02
            </p>
          </div>
          <div className="h-px bg-gray-200 flex-1" />
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modalVideo && (
          <div className="fixed left-0 top-0 z-[110] flex h-screen w-screen items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-0 h-full w-full bg-black/80 backdrop-blur-lg"
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
                  (typeof window !== "undefined" ? window.innerHeight / 2 : 0),
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
                  (typeof window !== "undefined" ? window.innerHeight / 2 : 0),
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
              <div className="w-full h-full bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://customer-vs7mnf7pn9caalyg.cloudflarestream.com/${
                    modalVideo === "rho"
                      ? "d92f2aed546bf4a481c20b22328c0611"
                      : "51a62e7e813329fb699cd3cf07804c2f"
                  }/iframe?autoplay=true&muted=false&controls=true`}
                  title={modalVideo === "rho" ? "Rho Demo" : "Browserbase Demo"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  allowFullScreen
                  style={{ border: 0 }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
