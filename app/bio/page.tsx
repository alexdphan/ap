"use client";

import FloatingMusicPlayer from "@/components/FloatingMusicPlayer";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BioPage() {
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
          <h1 className="editorial-display text-7xl text-gray-900 mb-4">AP</h1>
          <div className="h-px bg-gray-300 w-full" />
        </div>

        {/* Two Column Magazine Layout */}
        <div className="grid grid-cols-[1fr_auto] gap-20 items-start">
          {/* Left Column - Text */}
          <div className="space-y-10 max-w-xl">
            <div>
              <h2 className="editorial-label text-sm text-gray-500 mb-4">
                ABOUT
              </h2>
              <p className="editorial-body text-lg text-gray-900 leading-relaxed">
                I'm currently pursuing{" "}
                <Link
                  href="/work"
                  className="text-orange-600 editorial-headline hover:text-orange-700 transition-colors"
                >
                  work
                </Link>{" "}
                in the fintech space. You'll find me always look for
                opportunities that are simple, yet overlooked. If you think we'd
                be great friends, don't hesitate to reach out.
              </p>
            </div>

            <div className="h-px bg-gray-200 w-24" />

            <div>
              <h2 className="editorial-label text-sm text-gray-500 mb-4">
                CURRENTLY LISTENING
              </h2>
              <p className="editorial-caption text-base text-gray-700 leading-relaxed">
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
          <h1 className="editorial-display text-5xl text-gray-900 mb-3 text-center">
            AP
          </h1>
          <div className="h-px bg-gray-300 w-full" />
        </div>

        {/* Floating Music Player */}
        <FloatingMusicPlayer />

        {/* Bio Description */}
        <div className="max-w-sm text-center px-4 space-y-6">
          <div>
            <h2 className="editorial-label text-[10px] text-gray-500 mb-3">
              ABOUT
            </h2>
            <p className="editorial-body text-[15px] text-gray-900">
              I'm currently pursuing{" "}
              <Link
                href="/work"
                className="text-orange-600 editorial-headline hover:text-orange-700 transition-colors"
              >
                work
              </Link>{" "}
              in the fintech space. You'll find me always look for opportunities
              that are simple, yet overlooked. If you think we'd be great
              friends, don't hesitate to reach out.
            </p>
          </div>

          <div className="h-px bg-gray-200 w-16 mx-auto" />

          <div>
            <h2 className="editorial-label text-[10px] text-gray-500 mb-2">
              CURRENTLY LISTENING
            </h2>
            <p className="editorial-caption text-xs text-gray-700">
              Music that shapes my day
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
