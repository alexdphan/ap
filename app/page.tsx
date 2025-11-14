"use client";

import FloatingMusicPlayer from "@/components/FloatingMusicPlayer";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      {/* Desktop Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex flex-col w-full"
      >
        {/* Magazine Header */}
        <div className="mb-12">
          <h1 className="text-heading-lg" style={{ color: 'var(--gray-900)' }}>AP</h1>
          <div className="h-px w-full" style={{ backgroundColor: 'var(--gray-100)' }} />
        </div>

        {/* Two Column Magazine Layout */}
        <div className="grid grid-cols-[1fr_auto] gap-20 items-start">
          {/* Left Column - Text */}
          <div className="space-y-10 max-w-xl">
            <div>
              <h2 className="text-label mb-4" style={{ color: 'var(--gray-400)' }}>
                ABOUT
              </h2>
              <p className="text-body" style={{ color: 'var(--gray-700)' }}>
                I'm currently pursuing{" "}
                <Link
                  href="/work"
                  className="text-heading-md hover:opacity-70 transition-colors"
                  style={{ color: '#ea580c' }}
                >
                  work
                </Link>{" "}
                in the fintech space. You'll find me always look for
                opportunities that are simple, yet overlooked. If you think we'd
                be great friends, don't hesitate to reach out.
              </p>
            </div>

            <div className="h-px w-24" style={{ backgroundColor: 'var(--gray-100)' }} />

            <div>
              <h2 className="text-label mb-4" style={{ color: 'var(--gray-400)' }}>
                CURRENTLY LISTENING
              </h2>
              <p className="text-body" style={{ color: 'var(--gray-700)' }}>
                Music that shapes my day, curated moments of inspiration
              </p>
            </div>
          </div>

          {/* Right Column - Music Player */}
          <div className="flex items-center justify-center">
            <FloatingMusicPlayer />
          </div>
        </div>
      </motion.div>

      {/* Mobile Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="md:hidden flex flex-col items-center gap-8 w-full"
      >
        {/* Magazine Header */}
        <div className="mb-4 w-full">
          <h1 className="text-heading-lg text-center" style={{ color: 'var(--gray-900)', fontSize: '2.5rem' }}>
            AP
          </h1>
          <div className="h-px w-full" style={{ backgroundColor: 'var(--gray-100)' }} />
        </div>

        {/* Floating Music Player */}
        <FloatingMusicPlayer />

        {/* Bio Description */}
        <div className="max-w-sm text-center px-4 space-y-6">
          <div>
            <h2 className="text-label mb-3" style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
              ABOUT
            </h2>
            <p className="text-body" style={{ color: 'var(--gray-700)' }}>
              I'm currently pursuing{" "}
              <Link
                href="/work"
                className="text-heading-md hover:opacity-70 transition-colors"
                style={{ color: '#ea580c' }}
              >
                work
              </Link>{" "}
              in the fintech space. You'll find me always look for opportunities
              that are simple, yet overlooked. If you think we'd be great
              friends, don't hesitate to reach out.
            </p>
          </div>

          <div className="h-px w-16 mx-auto" style={{ backgroundColor: 'var(--gray-100)' }} />

          <div>
            <h2 className="text-label mb-2" style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>
              CURRENTLY LISTENING
            </h2>
            <p className="text-body" style={{ color: 'var(--gray-700)', fontSize: '0.8rem' }}>
              Music that shapes my day
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
