"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface Heading {
  id: string;
  level: number;
  text: string;
}

interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon?: string;
}

interface FloatingBottomNavProps {
  headings: Heading[];
  currentPath: string;
  allItems?: NavigationItem[];
}

export default function FloatingBottomNav({
  headings,
  currentPath,
  allItems = [],
}: FloatingBottomNavProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Find current item index and get prev/next
  const currentIndex = allItems.findIndex((item) => item.href === currentPath);
  const currentItem = allItems[currentIndex];
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem =
    currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  // Handle hover with delay
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 50); // 200ms delay before showing
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 50); // 100ms delay before hiding
  };

  // Handle click for mobile
  const handleClick = () => {
    setIsHovered(!isHovered);
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    if (headings.length === 0) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        // Find the entry that's most visible
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Use the first intersecting entry (topmost)
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: `0% 0% -70% 0%`,
        threshold: 0.1,
      }
    );

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter(Boolean);

    elements.forEach((el) => observer.current?.observe(el!));

    return () => observer.current?.disconnect();
  }, [headings]);

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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#F6F4ED]/90 backdrop-blur-sm border border-foreground/10 cursor-pointer"
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
              className="p-2 w-72"
              style={{ transformOrigin: "center left" }}
            >
              <div className="flex flex-col gap-2">
                {/* Navigation header with current article and arrows */}
                {currentItem && (
                  <div className="flex items-center justify-between gap-2 pb-2 mb-1 border-b border-foreground/15">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-1 transition-colors flex-shrink-0 ${
                        prevItem
                          ? "text-foreground/70 hover:text-foreground hover:bg-foreground/5 cursor-pointer"
                          : "text-foreground/30 cursor-not-allowed"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (prevItem) router.push(prevItem.href);
                      }}
                      disabled={!prevItem}
                    >
                      <svg
                        className="w-4 h-4"
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
                    </motion.button>

                    <div className="flex-1 text-center px-2">
                      <h3 className="text-foreground text-sm font-semibold leading-tight flex items-center justify-center gap-2">
                        {currentItem.icon && (
                          <Image
                            src={currentItem.icon}
                            alt={currentItem.title}
                            width={16}
                            height={16}
                            className="flex-shrink-0"
                          />
                        )}
                        <span className="truncate">{currentItem.title}</span>
                      </h3>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-1 transition-colors flex-shrink-0 ${
                        nextItem
                          ? "text-foreground/70 hover:text-foreground hover:bg-foreground/5 cursor-pointer"
                          : "text-foreground/30 cursor-not-allowed"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (nextItem) router.push(nextItem.href);
                      }}
                      disabled={!nextItem}
                    >
                      <svg
                        className="w-4 h-4"
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
                    </motion.button>
                  </div>
                )}

                {/* Table of contents */}
                <div className="flex flex-col gap-0.5 max-h-[200px] overflow-y-auto pr-1">
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
                        className={`text-left px-2 py-2 text-sm transition-all duration-200 ease-out ${
                          isActive
                            ? "bg-foreground/8 text-foreground border border-foreground/20"
                            : "text-foreground/60 hover:text-foreground/80 hover:bg-foreground/3 border border-transparent"
                        }`}
                        style={{
                          paddingLeft: `${8 + (heading.level - 1) * 8}px`,
                        }}
                      >
                        <span
                          className={`truncate block leading-snug ${
                            isActive ? "font-semibold" : "font-medium"
                          }`}
                        >
                          {heading.text}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
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
                className="w-6 h-6 text-foreground/70"
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
