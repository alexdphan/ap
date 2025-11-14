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
        <h1 className="text-heading-lg mb-2" style={{ color: 'var(--gray-900)' }}>
          Bio
        </h1>
        <div className="h-px w-full mt-4" style={{ backgroundColor: 'var(--gray-100)' }} />
      </div>

      {/* Content */}
      <div className="max-w-2xl space-y-8">
        {/* Introduction */}
        <div>
          <h2 className="text-label mb-3" style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
            INTRODUCTION
          </h2>
          <p className="text-body" style={{ color: 'var(--gray-700)' }}>
            I'm Alex, a builder focused on creating products that make a
            difference. Currently working in fintech, exploring the intersection
            of technology and finance.
          </p>
        </div>

        {/* Background */}
        <div>
          <h2 className="text-label mb-3" style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
            BACKGROUND
          </h2>
          <p className="text-body" style={{ color: 'var(--gray-700)' }}>
            My journey has taken me through various roles and experiences,
            always driven by curiosity and a desire to build meaningful
            products. I believe in simple solutions to complex problems.
          </p>
        </div>

        {/* Philosophy */}
        <div>
          <h2 className="text-label mb-3" style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
            PHILOSOPHY
          </h2>
          <p className="text-body" style={{ color: 'var(--gray-700)' }}>
            I look for opportunities that are simple, yet overlooked. The best
            solutions often hide in plain sight, waiting for someone to see them
            from a different angle.
          </p>
        </div>

        {/* Interests */}
        <div>
          <h2 className="text-label mb-3" style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
            INTERESTS
          </h2>
          <p className="text-body" style={{ color: 'var(--gray-700)' }}>
            Beyond work, you'll find me exploring new music, discovering hidden
            gems in NYC and SF, and always looking for the next interesting
            conversation.
          </p>
        </div>

        <div className="h-px w-20" style={{ backgroundColor: 'var(--gray-100)' }} />

        {/* Contact */}
        <div>
          <h2 className="text-label mb-3" style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
            GET IN TOUCH
          </h2>
          <p className="text-body" style={{ color: 'var(--gray-700)' }}>
            If you think we'd be great friends or have something interesting to
            share, don't hesitate to reach out.
          </p>
        </div>
      </div>

      {/* Page Number - Magazine Style */}
      <div className="mt-12 md:mt-6 flex justify-between items-center">
        <div className="h-px flex-1" style={{ backgroundColor: 'var(--gray-100)' }} />
        <div className="px-6 md:px-4">
          <p className="text-body" style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
            03
          </p>
        </div>
        <div className="h-px flex-1" style={{ backgroundColor: 'var(--gray-100)' }} />
      </div>
    </motion.div>
  );
}
