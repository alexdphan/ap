"use client";

import { motion } from "framer-motion";

export default function BioPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full pt-20 pb-20"
    >
      {/* Magazine Header */}
      <div className="mb-8">
        <h1 className="editorial-display text-4xl md:text-5xl text-gray-900 mb-2">
          Bio
        </h1>
        <div className="h-px bg-gray-300 w-full mt-4" />
      </div>

      {/* Content */}
      <div className="max-w-2xl space-y-8">
        {/* Introduction */}
        <div>
          <h2 className="editorial-label text-[10px] md:text-xs text-gray-500 mb-3">
            INTRODUCTION
          </h2>
          <p className="editorial-body text-[15px] md:text-sm text-gray-900 leading-relaxed">
            I'm Alex, a builder focused on creating products that make a
            difference. Currently working in fintech, exploring the intersection
            of technology and finance.
          </p>
        </div>

        {/* Background */}
        <div>
          <h2 className="editorial-label text-[10px] md:text-xs text-gray-500 mb-3">
            BACKGROUND
          </h2>
          <p className="editorial-body text-[15px] md:text-sm text-gray-900 leading-relaxed">
            My journey has taken me through various roles and experiences,
            always driven by curiosity and a desire to build meaningful
            products. I believe in simple solutions to complex problems.
          </p>
        </div>

        {/* Philosophy */}
        <div>
          <h2 className="editorial-label text-[10px] md:text-xs text-gray-500 mb-3">
            PHILOSOPHY
          </h2>
          <p className="editorial-body text-[15px] md:text-sm text-gray-900 leading-relaxed">
            I look for opportunities that are simple, yet overlooked. The best
            solutions often hide in plain sight, waiting for someone to see them
            from a different angle.
          </p>
        </div>

        {/* Interests */}
        <div>
          <h2 className="editorial-label text-[10px] md:text-xs text-gray-500 mb-3">
            INTERESTS
          </h2>
          <p className="editorial-body text-[15px] md:text-sm text-gray-900 leading-relaxed">
            Beyond work, you'll find me exploring new music, discovering hidden
            gems in NYC and SF, and always looking for the next interesting
            conversation.
          </p>
        </div>

        <div className="h-px bg-gray-200 w-20" />

        {/* Contact */}
        <div>
          <h2 className="editorial-label text-[10px] md:text-xs text-gray-500 mb-3">
            GET IN TOUCH
          </h2>
          <p className="editorial-body text-[15px] md:text-sm text-gray-900 leading-relaxed">
            If you think we'd be great friends or have something interesting to
            share, don't hesitate to reach out.
          </p>
        </div>
      </div>

      {/* Page Number - Magazine Style */}
      <div className="mt-12 md:mt-6 flex justify-between items-center">
        <div className="h-px bg-gray-200 flex-1" />
        <div className="px-6 md:px-4">
          <p className="editorial-caption text-xs md:text-[10px] text-gray-400">
            03
          </p>
        </div>
        <div className="h-px bg-gray-200 flex-1" />
      </div>
    </motion.div>
  );
}
