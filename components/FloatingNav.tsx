"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface Heading {
  id: string;
  level: number;
  text: string;
}

interface FloatingBottomNavProps {
  headings: Heading[];
  currentPath: string;
}

export default function FloatingBottomNav({
  headings,
  currentPath,
}: FloatingBottomNavProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const router = useRouter();

  // Handle click for mobile
  const handleClick = () => {
    setIsHovered(!isHovered);
  };

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter(Boolean);
    elements.forEach((el) => observer.current?.observe(el!));

    return () => observer.current?.disconnect();
  }, [headings, activeId]);

  // Scroll to section
  const scrollToSection = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#F6F4EC] backdrop-blur-md border border-accent-green/20 shadow-lg cursor-pointer"
      >
        <AnimatePresence mode="popLayout">
          {isHovered ? (
            // Expanded state - show all nav items
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="p-2"
              style={{ transformOrigin: "center left" }}
            >
              <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto">
                {headings.map((heading) => {
                  const isActive = activeId === heading.id;
                  return (
                    <motion.button
                      key={heading.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.15,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToSection(heading.id);
                      }}
                      className={`text-left px-2 py-1.5 text-sm transition-all duration-200 ease-out ${
                        isActive
                          ? "bg-accent-green/10 text-accent-green border border-accent-green/20"
                          : "text-accent-green/70 hover:text-accent-green hover:bg-accent-green/5 border border-transparent"
                      }`}
                      style={{
                        paddingLeft: `${8 + (heading.level - 1) * 8}px`,
                      }}
                    >
                      <span className="truncate block font-medium">
                        {heading.text}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            // Collapsed state - hamburger icon
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="p-2"
              style={{ transformOrigin: "center left" }}
            >
              <svg
                className="w-5 h-5 text-accent-green/70"
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
