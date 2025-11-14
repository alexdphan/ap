"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function NowPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalVideo, setModalVideo] = useState<string | null>(null);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Wait briefly before showing videos
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full pt-20 pb-20"
    >
      {/* Magazine Grid - Like Reference */}
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 md:gap-10">
        {/* Left Side - Videos */}
        <div className="space-y-6 md:space-y-6">
          {/* Title Above Videos */}
          <div>
            <h1 className="text-heading-lg mb-2" style={{ color: 'var(--gray-900)' }}>
              Now
            </h1>
            <div className="h-px w-full mt-4" style={{ backgroundColor: 'var(--gray-100)' }} />
          </div>

          {/* NYC Video */}
          <div className="relative">
            <div className="mb-2">
              <p className="text-label" style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
                NEW YORK CITY
              </p>
            </div>

            <div
              className="cursor-pointer"
              onClick={(e) => handleVideoClick("nyc", e)}
            >
              <div className="w-full h-[220px] md:h-[180px] relative overflow-hidden">
                {/* Loading cover */}
                <AnimatePresence>
                  {!isLoaded && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="absolute inset-0 flex flex-col items-center justify-center z-10"
                      style={{ backgroundColor: 'var(--gray-100)' }}
                    >
                      <motion.div
                        animate={{
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="flex flex-col items-center gap-2"
                      >
                        <div className="text-body font-light tracking-wide" style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>
                          Loading the big apple
                        </div>
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
                  className="w-full h-full absolute inset-0"
                >
                  <iframe
                    width="200%"
                    height="200%"
                    src="https://www.youtube.com/embed/R1CG9ZuK2V8?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&iv_load_policy=3&disablekb=1&cc_load_policy=0&playsinline=1&loop=1&playlist=R1CG9ZuK2V8"
                    title="NYC Livestream"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                    className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ minWidth: "200%", minHeight: "200%" }}
                  />
                </motion.div>
              </div>
            </div>

            <div className="mt-2 md:mt-3 flex justify-between items-end">
              <p className="text-body italic" style={{ color: 'var(--gray-400)', fontSize: '0.7rem' }}>
                Live feed, 2025
              </p>
              <p className="text-body tracking-wider font-light" style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
                EST
              </p>
            </div>
          </div>

          {/* SF Video */}
          <div className="relative">
            <div className="mb-2">
              <p className="text-label" style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
                SAN FRANCISCO
              </p>
            </div>

            <div
              className="cursor-pointer relative"
              onClick={(e) => handleVideoClick("sf", e)}
            >
              {/* Ticket Annotation Box */}
              <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{
                  opacity: isLoaded ? 1 : 0,
                  scale: isLoaded ? 1 : 1.05,
                }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -right-4 -top-4 md:-right-8 md:top-16 z-40 -rotate-6"
              >
                <svg
                  width="130"
                  height="50"
                  viewBox="0 0 130 50"
                  className="drop-shadow-lg"
                >
                  {/* Ticket background with notched corners */}
                  <path
                    d="M 8 0 L 122 0 Q 130 0 130 8 L 130 12 L 126 12 L 126 38 L 130 38 L 130 42 Q 130 50 122 50 L 8 50 Q 0 50 0 42 L 0 38 L 4 38 L 4 12 L 0 12 L 0 8 Q 0 0 8 0 Z"
                    fill="#fecdd3"
                    stroke="#f472b6"
                    strokeWidth="2"
                  />

                  {/* Inner border lines */}
                  <line
                    x1="10"
                    y1="6"
                    x2="120"
                    y2="6"
                    stroke="#f472b6"
                    strokeWidth="1"
                  />
                  <line
                    x1="10"
                    y1="44"
                    x2="120"
                    y2="44"
                    stroke="#f472b6"
                    strokeWidth="1"
                  />

                  {/* Left dashed line */}
                  <line
                    x1="20"
                    y1="8"
                    x2="20"
                    y2="42"
                    stroke="#f472b6"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />

                  {/* Right dashed line */}
                  <line
                    x1="110"
                    y1="8"
                    x2="110"
                    y2="42"
                    stroke="#f472b6"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />

                  {/* Left number */}
                  <text
                    x="10"
                    y="30"
                    fill="#1f2937"
                    fontSize="7"
                    fontWeight="bold"
                    textAnchor="middle"
                    transform="rotate(-90 10 25)"
                  >
                    01234
                  </text>

                  {/* Right number */}
                  <text
                    x="120"
                    y="25"
                    fill="#1f2937"
                    fontSize="7"
                    fontWeight="bold"
                    textAnchor="middle"
                    transform="rotate(-90 120 25)"
                  >
                    23210
                  </text>

                  {/* Main text */}
                  <text
                    x="65"
                    y="22"
                    fill="#1f2937"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    NYC → SF
                  </text>
                  <text
                    x="65"
                    y="32"
                    fill="#1f2937"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    2,906 mi • 6 hrs
                  </text>
                </svg>
              </motion.div>

              <div className="w-full h-[220px] md:h-[180px] relative overflow-hidden">
                {/* Loading cover */}
                <AnimatePresence>
                    {!isLoaded && (
                      <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0 flex flex-col items-center justify-center z-10"
                        style={{ backgroundColor: 'var(--gray-100)' }}
                      >
                        <motion.div
                          animate={{
                            opacity: [0.6, 1, 0.6],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="flex flex-col items-center gap-2"
                        >
                          <div className="text-body font-light tracking-wide" style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>
                            Talking to devs apologies
                          </div>
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
                  className="w-full h-full absolute inset-0"
                >
                  <iframe
                    width="200%"
                    height="200%"
                    src="https://www.youtube.com/embed/CXYr04BWvmc?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&iv_load_policy=3&disablekb=1&cc_load_policy=0&playsinline=1&loop=1&playlist=CXYr04BWvmc"
                    title="SF Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                    className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ minWidth: "200%", minHeight: "200%" }}
                  />
                </motion.div>
              </div>
            </div>

            <div className="mt-2 md:mt-3 flex justify-between items-end">
              <p className="text-body italic" style={{ color: 'var(--gray-400)', fontSize: '0.7rem' }}>
                Live feed, 2025
              </p>
              <p className="text-body tracking-wider font-light" style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
                PST
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Editorial Text Content */}
        <div className="space-y-6 md:space-y-6 md:pt-16">
          {/* Main Body Text */}
          <div className="relative">
            {/* Vintage Stamp Badge Overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{
                opacity: isLoaded ? 1 : 0,
                scale: isLoaded ? 1 : 1.05,
              }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -top-3 -right-4 md:-top-3 md:-right-10 z-20 bg-orange-600 text-white px-2 py-1 shadow-md rotate-[20deg] transform border-2 border-dashed"
              style={{ borderColor: '#fb923c' }}
            >
              <p className="text-heading-md text-white uppercase tracking-wide" style={{ fontSize: '0.7rem' }}>
                City of dreams!
              </p>
            </motion.div>

            <p className="text-body relative z-10" style={{ color: 'var(--gray-700)', fontSize: '0.9rem' }}>
              I live in NYC, and visit SF often. I love both cities and the
              people in them. Without these cities, I wouldn't be where I am
              today.
            </p>
          </div>

          {/* Pull Quote */}
          <div className="my-6 md:my-6 py-4 md:py-5" style={{ borderTop: '1px solid var(--gray-100)', borderBottom: '1px solid var(--gray-100)' }}>
            <p className="text-heading-md text-center" style={{ color: 'var(--gray-700)' }}>
              "If you can make it there, you'll make it anywhere"
            </p>
          </div>

          {/* Currently Working On */}
          <div>
            <h2 className="text-label mb-3 md:mb-2" style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
              CURRENTLY WORKING ON
            </h2>
            <p className="text-body" style={{ color: 'var(--gray-700)', fontSize: '0.9rem' }}>
              Building products that connect people and ideas. Exploring the
              intersection of design and technology.
            </p>
          </div>

          {/* Recent Highlights */}
          <div>
            <h2 className="text-label mb-3 md:mb-2" style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
              RECENT HIGHLIGHTS
            </h2>
            <p className="text-body" style={{ color: 'var(--gray-700)', fontSize: '0.9rem' }}>
              Shipped new features, met amazing people, explored new ideas.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px w-20 md:w-20" style={{ backgroundColor: 'var(--gray-100)' }} />

          {/* Small Meta Info */}
          <div className="space-y-4 md:space-y-3">
            <div>
              <p className="text-label mb-1" style={{ color: 'var(--gray-400)', fontSize: '0.7rem' }}>
                AVAILABILITY
              </p>
              <p className="text-body" style={{ color: 'var(--gray-700)', fontSize: '0.85rem' }}>
                Open to interesting conversations and collaborations
              </p>
            </div>
            <div>
              <p className="text-label mb-1" style={{ color: 'var(--gray-400)', fontSize: '0.7rem' }}>
                LAST UPDATED
              </p>
              <p className="text-body" style={{ color: 'var(--gray-700)', fontSize: '0.85rem' }}>
                November 2025 *
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Number - Magazine Style */}
      <div className="mt-12 md:mt-6 flex justify-between items-center">
        <div className="h-px flex-1" style={{ backgroundColor: 'var(--gray-100)' }} />
        <div className="px-6 md:px-4">
          <p className="text-body" style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
            01
          </p>
        </div>
        <div className="h-px flex-1" style={{ backgroundColor: 'var(--gray-100)' }} />
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalVideo && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-lg"
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
        )}
      </AnimatePresence>
    </motion.div>
  );
}
