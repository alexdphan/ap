"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SiteHeaderProps {
  titleColor?: string;
}

export default function SiteHeader({
  titleColor = "text-accent-green",
}: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationLinks = [
    { href: "/projects", label: "Projects" },
    { href: "/memos", label: "Memos" },
    { href: "/investments", label: "Investments" },
  ];

  const linkClassName =
    "relative text-base font-normal text-foreground tracking-wide hover:text-white hover:bg-foreground/10 transition-all duration-200 cursor-pointer overflow-hidden group py-1 px-2 underline decoration-foreground underline-offset-4 text-center";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-6">
      <div className="max-w-2xl mx-auto relative">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={`text-3xl md:text-4xl font-bold tracking-tighter hover:text-accent-green ap-title-animate cursor-pointer ${titleColor}`}
          >
            [ AP ]
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex flex-row gap-4 items-center">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClassName}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex items-center justify-center w-8 h-8 text-foreground/70 hover:text-accent-green transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full right-0 z-10 bg-[#F6F4ED]/90 backdrop-blur-sm border border-foreground/10 w-48"
            >
              <div className="p-2 flex flex-col gap-0.5">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="text-sm font-medium text-foreground/60 hover:text-foreground/80 hover:bg-foreground/3 transition-all duration-200 py-2 px-2 border border-transparent"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
