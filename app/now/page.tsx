"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function NowPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Wait 2 seconds before showing video
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-col items-center gap-8">
        {/* Livestream */}
        <div className="artwork-card">
          <div className="w-[500px] h-[250px] shadow-2xl relative overflow-hidden bg-black rounded-lg">
            {/* Loading cover */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
                <div className="text-white text-sm">Cooking 🧑‍🍳...</div>
              </div>
            )}

            {/* Video iframe with fade in */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full h-full"
            >
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/R1CG9ZuK2V8?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0"
                title="Livestream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </motion.div>
          </div>
        </div>

        {/* Bio text below */}
        <div className="max-w-sm text-center">
          <p className="text-[15px] leading-[1.7] text-gray-900 tracking-tight font-normal">
            I'm currently living in NYC, and visit SF very often.
          </p>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col items-center gap-8">
        <div className="artwork-card">
          <div className="w-[350px] h-[250px] shadow-2xl relative overflow-hidden bg-black rounded-lg">
            {/* Loading cover */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
                <div className="text-white text-sm">Loading...</div>
              </div>
            )}

            {/* Video iframe with fade in */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full h-full"
            >
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/R1CG9ZuK2V8?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&showinfo=0"
                title="Livestream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </motion.div>
          </div>
        </div>

        <div className="max-w-sm text-center px-4">
          <p className="text-[15px] leading-[1.7] text-gray-900 tracking-tight font-normal">
            I'm currently living in NYC, and visit SF very often.
          </p>
        </div>
      </div>
    </>
  );
}
