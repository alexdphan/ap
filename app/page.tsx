"use client";

import FloatingMusicPlayer from "@/components/FloatingMusicPlayer";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [showFullName, setShowFullName] = useState(false);
  const [showContactDropdown, setShowContactDropdown] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col w-full mt-8 md:mt-16"
    >
      {/* Magazine Header */}
      <div className="mb-6 md:mb-8 flex flex-col items-center md:items-start">
        <h1
          onClick={() => setShowFullName(!showFullName)}
          className="text-heading cursor-pointer relative overflow-hidden min-w-[160px] text-center md:text-left"
          style={{ color: "var(--gray-900)" }}
        >
          <span
            className={`inline-block transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              showFullName ? "-translate-x-full opacity-0" : ""
            }`}
          >
            AP
          </span>
          <span
            className={`absolute left-0 top-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              showFullName
                ? "translate-x-0 opacity-100"
                : "translate-x-[-100%] opacity-0"
            }`}
          >
            Alex Phan
          </span>
        </h1>
        <div
          className="h-px w-full mt-2"
          style={{ backgroundColor: "var(--gray-100)" }}
        />
      </div>

      {/* Content Layout */}
      <div className="flex flex-col md:grid md:grid-cols-[1fr_auto] gap-8 md:gap-16 items-center md:items-start">
        {/* Music Player - Shows first on mobile, second on desktop */}
        <div className="flex items-center justify-center w-40 mt-8 md:mt-0 md:order-2">
          <FloatingMusicPlayer />
        </div>

        {/* Text Content - Shows second on mobile, first on desktop */}
        <div className="space-y-6 max-w-xl text-center md:text-left px-4 md:px-0 md:order-1">
          {/* <div>
            <p className="text-body" style={{ color: "var(--gray-700)" }}>
              I'm currently pursuing{" "}
              <Link
                href="/work"
                className="text-body hover:opacity-70 transition-opacity underline"
                style={{ color: "var(--gray-700)" }}
              >
                work
              </Link>{" "}
              in fintech.
            </p>
          </div> */}

          {/* Philosophy */}
          <div>
            <p className="text-body" style={{ color: "var(--gray-700)" }}>
              I often look for opportunities that are simple, yet overlooked.
              {/* The best
              solutions often hide in plain sight, waiting for someone to see
              them from a different angle. */}
            </p>
          </div>

          {/* Interests */}
          <div>
            <p className="text-body" style={{ color: "var(--gray-700)" }}>
              Beyond{" "}
              <Link
                href="/work"
                className="text-body hover:opacity-70 transition-opacity underline"
                style={{ color: "var(--gray-700)" }}
              >
                work
              </Link>
              , you'll{" "}
              <Link
                href="/now"
                className="text-body hover:opacity-70 transition-opacity underline"
                style={{ color: "var(--gray-700)" }}
              >
                find me
              </Link>{" "}
               embarrasing myself learning new things, or being selfless around others. I also angel invest and advise
              startups on growth.
            </p>
          </div>

          {/* Contact */}
          <div className="relative inline-block">
            <p className="text-body" style={{ color: "var(--gray-700)" }}>
              Feel free to{" "}
              <button
                onClick={() => setShowContactDropdown(!showContactDropdown)}
                className="text-body hover:opacity-70 transition-opacity underline cursor-pointer bg-transparent border-none p-0 font-inherit"
                style={{ color: "var(--gray-700)", fontFamily: "inherit" }}
              >
                reach out
              </button>{" "}
              if you'd like to chat about anything.
            </p>

            {/* Contact Dropdown */}
            <AnimatePresence>
              {showContactDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{
                    duration: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute left-0 top-full mt-1 flex gap-3 py-2 px-3 z-10"
                  style={{
                    backgroundColor: "var(--bg-content)",
                    border: "1px solid var(--gray-100)",
                  }}
                >
                  <a
                    href="mailto:alexphan0515@gmail.com"
                    className="text-caption hover:opacity-70 transition-opacity"
                    style={{ color: "var(--gray-700)" }}
                  >
                    Email
                  </a>
                  <span style={{ color: "var(--gray-400)" }}>·</span>
                  <a
                    href="https://linkedin.com/in/alexanderdphan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-caption hover:opacity-70 transition-opacity"
                    style={{ color: "var(--gray-700)" }}
                  >
                    LinkedIn
                  </a>
                  <span style={{ color: "var(--gray-400)" }}>·</span>
                  <a
                    href="https://x.com/alexdphan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-caption hover:opacity-70 transition-opacity"
                    style={{ color: "var(--gray-700)" }}
                  >
                    X
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Writings */}
          <div>
            <p className="text-body" style={{ color: "var(--gray-700)" }}>
              Also I've been meaning to write more, so expect some thoughts here
              soon.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
