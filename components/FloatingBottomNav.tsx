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

interface NavigationItem {
  id: string;
  title: string;
  href: string;
}

interface FloatingBottomNavProps {
  headings: Heading[];
  currentPath: string;
  allItems: NavigationItem[];
  type: "projects" | "memos";
}

export default function FloatingBottomNav({
  headings,
  currentPath,
  allItems,
  type,
}: FloatingBottomNavProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [prevActiveId, setPrevActiveId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const router = useRouter();

  // Find current item index and get prev/next
  const currentIndex = allItems.findIndex((item) => item.href === currentPath);
  const currentItem = allItems[currentIndex];
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem =
    currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  // Determine scroll direction based on heading indices
  const getScrollDirection = () => {
    if (!prevActiveId || !activeId) return "down";

    const prevIndex = headings.findIndex((h) => h.id === prevActiveId);
    const currentIndex = headings.findIndex((h) => h.id === activeId);

    return currentIndex > prevIndex ? "down" : "up";
  };

  const scrollDirection = getScrollDirection();

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
            setPrevActiveId(activeId);
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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prevItem) {
        router.push(prevItem.href);
      } else if (e.key === "ArrowRight" && nextItem) {
        router.push(nextItem.href);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevItem, nextItem, router]);

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#F6F4EC] backdrop-blur-md border border-accent-green shadow-xl cursor-pointer"
      >
        <AnimatePresence mode="popLayout">
          {isHovered ? (
            // Expanded state - single column layout
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scaleY: 0.3 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0.3 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="px-4 py-2 w-[280px] md:w-[320px]"
              style={{ transformOrigin: "bottom center" }}
            >
              <div className="flex flex-col gap-3">
                {/* Navigation arrows with title */}
                <motion.div
                  className="flex items-center justify-between h-7"
                  layout
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-1 transition-colors flex-shrink-0 ${
                      prevItem
                        ? "text-accent-green hover:text-accent-green/80 cursor-pointer"
                        : "text-accent-green/30 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (prevItem) router.push(prevItem.href);
                    }}
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </motion.div>

                  {/* Current post title */}
                  <motion.div className="flex-1 text-center px-2" layout>
                    <motion.h3
                      className="text-accent-green text-sm md:text-base font-medium truncate"
                      layout
                    >
                      {currentItem?.title || "Navigation"}
                    </motion.h3>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-1 transition-colors flex-shrink-0 ${
                      nextItem
                        ? "text-accent-green hover:text-accent-green/80 cursor-pointer"
                        : "text-accent-green/30 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (nextItem) router.push(nextItem.href);
                    }}
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.div>
                </motion.div>

                {/* Table of Contents - vertical */}
                {headings.length > 0 && (
                  <motion.div
                    className="flex flex-col gap-1 max-h-[160px] md:max-h-[180px] overflow-y-auto scrollbar-hide"
                    layout
                  >
                    {headings.map((heading, index) => {
                      const isActive = activeId === heading.id;
                      return (
                        <motion.button
                          key={heading.id}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.15,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToSection(heading.id);
                          }}
                          className={`text-left px-2 py-1.5 text-sm md:text-base transition-all duration-200 ease-out ${
                            isActive
                              ? "bg-accent-green/10 text-accent-green border border-accent-green/20"
                              : "text-accent-green/70 hover:text-accent-green hover:bg-accent-green/5 border border-transparent"
                          }`}
                          layout
                        >
                          <motion.span
                            className="truncate block"
                            initial={
                              isActive
                                ? {
                                    y: scrollDirection === "down" ? 5 : -5,
                                    opacity: 0.8,
                                  }
                                : false
                            }
                            animate={{
                              color: isActive ? "#05402c" : "#05402c99",
                              fontWeight: isActive ? 500 : 400,
                              y: 0,
                              opacity: 1,
                            }}
                            transition={{
                              duration: 0.2,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            key={
                              isActive
                                ? `${activeId}-active`
                                : `${heading.id}-inactive`
                            }
                          >
                            {heading.text}
                          </motion.span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            // Collapsed state - minimal indicator
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scaleY: 0.3 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0.3 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="px-4 py-2 w-[280px] md:w-[320px]"
              style={{ transformOrigin: "bottom center" }}
            >
              <motion.div
                className="flex items-center justify-center h-6"
                layout
              >
                <motion.div
                  className="text-sm md:text-base text-accent-green/80 truncate text-center"
                  layout
                >
                  <motion.span
                    initial={{
                      opacity: 0,
                      y: scrollDirection === "down" ? 10 : -10,
                    }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      y: scrollDirection === "down" ? -10 : 10,
                    }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    key={activeId || "default"}
                  >
                    {headings.length > 0 &&
                      activeId &&
                      (headings.find((h) => h.id === activeId)?.text ||
                        "Navigation")}
                    {(!headings.length || !activeId) && "Navigation"}
                  </motion.span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
