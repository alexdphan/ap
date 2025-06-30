"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Heading {
  id: string;
  level: number;
  text: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

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

    const elements = headings.map(heading => document.getElementById(heading.id)).filter(Boolean);
    elements.forEach(el => observer.current?.observe(el!));

    return () => observer.current?.disconnect();
  }, [headings]);

  // Get the minimum heading level to normalize indentation
  const minLevel = Math.min(...headings.map(h => h.level));

  // Smooth scroll to section
  const scrollToSection = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      const headerOffset = 100; // Adjust based on your header height
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      className="hidden lg:block fixed left-10 top-1/2 -translate-y-1/2 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.nav
        initial={{ opacity: 0.3, x: -20, scale: 0.95 }}
        animate={{ 
          opacity: isHovered ? 1 : 1,
          x: isHovered ? 0 : -20,
          scale: isHovered ? 1 : 0.95
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="space-y-1"
      >
        <AnimatePresence>
          {headings.map((heading, index) => {
            const isActive = activeId === heading.id;
            const indentLevel = heading.level - minLevel;
            
            return (
              <motion.div
                key={heading.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: isHovered ? 1 : (isActive ? 0.8 : 0.3),
                  x: 0
                }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ 
                  duration: 0.3, 
                  delay: isHovered ? index * 0.05 : 0,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(heading.id);
                  }}
                  className="group block relative w-full text-left"
                >
                  <motion.div
                    className="flex items-center gap-2 py-1 cursor-pointer"
                    style={{ 
                      paddingLeft: `${indentLevel * 12}px` 
                    }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Active indicator */}
                    <motion.div
                      className="w-0.5 bg-accent-green rounded-full"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: isActive ? 16 : 0,
                        opacity: isActive ? 1 : 0
                      }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    />
                    
                    {/* Text content */}
                    <motion.span
                      className="text-sm font-medium"
                      animate={{ 
                        color: isActive ? '#05402C' : '#10100E',
                        opacity: isActive ? 1 : (isHovered ? 0.8 : 0.6)
                      }}
                      whileHover={{
                        opacity: 1,
                        color: '#05402C'
                      }}
                      transition={{ duration: 0.2 }}
                      style={{
                        fontSize: indentLevel === 0 ? '14px' : '13px',
                      }}
                    >
                      {heading.text}
                    </motion.span>
                  </motion.div>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
} 