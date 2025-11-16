"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [showContactDropdown, setShowContactDropdown] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col w-full mt-16 md:mt-32"
      >
        {/* Magazine Header */}
        <div className="flex flex-col w-full">
          <h1 className="text-heading" style={{ color: "var(--gray-900)" }}>
            Alex Phan
          </h1>
          {/* <div
          className="h-px w-full mt-2 mb-5"
          style={{ backgroundColor: "var(--gray-100)" }}
        /> */}
        </div>

        {/* Content Layout */}
        <div className="flex flex-col w-full">
          {/* Text Content */}
          <div className="w-full">
            {/* Philosophy */}
            <p className="text-body my-5" style={{ color: "var(--gray-700)" }}>
              You'll constantly find me looking for opportunities that are
              simple, yet overlooked.
            </p>

            {/* Work */}
            <p className="text-body my-5" style={{ color: "var(--gray-700)" }}>
              I'm currently helping{" "}
              <a
                href="https://rho.co"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Rho
              </a>{" "}
              on modern business banking. Previously, I was at{" "}
              <a
                href="https://browserbase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Browserbase
              </a>{" "}
              as a founding growth engineer.
            </p>

            {/* Interests */}
            <p className="text-body my-5" style={{ color: "var(--gray-700)" }}>
              I also angel invest and advise startups on growth. You'll find me
              embarassing myself learning new things, challenging myself, or being selfless around
              others.
            </p>
            {/* Contact */}
            {/* <div className="relative inline-block my-5"> */}
            <p className="text-body" style={{ color: "var(--gray-700)" }}>
              I live in NYC and visit SF often. Feel free to{" "}
              <button
                onClick={() => setShowContactDropdown(!showContactDropdown)}
                className="text-body underline cursor-pointer bg-transparent border-none p-0 font-inherit text-body hover:opacity-70 transition-opacity underline"
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
                    className="text-caption"
                    style={{ color: "var(--gray-700)" }}
                  >
                    Email
                  </a>
                  <span style={{ color: "var(--gray-400)" }}>·</span>
                  <a
                    href="https://linkedin.com/in/alexanderdphan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-caption"
                    style={{ color: "var(--gray-700)" }}
                  >
                    LinkedIn
                  </a>
                  <span style={{ color: "var(--gray-400)" }}>·</span>
                  <a
                    href="https://x.com/alexdphan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-caption"
                    style={{ color: "var(--gray-700)" }}
                  >
                    X
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* </div> */}
      </motion.div>
    </>
  );
}
