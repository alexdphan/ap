"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const pages = [
    { href: "/bio", label: "bio" },
    { href: "/now", label: "now" },
    { href: "/work", label: "work" },
    { href: "/inspiration", label: "inspiration" },
    { href: "/investments", label: "investments" },
  ];

  const currentIndex = pages.findIndex((page) => page.href === pathname);
  const currentPage = pages[currentIndex] || pages[0];

  const handleNavigate = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] md:hidden">
      {/* Magazine-style Menu Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 bg-white border border-gray-200 shadow-lg flex items-center gap-2"
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{
            rotate: isOpen ? 90 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-5 h-5 border border-gray-900 flex items-center justify-center"
        >
          <motion.div
            className="w-2 h-2 bg-gray-900"
            animate={{
              scale: isOpen ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
        <span className="editorial-label text-[10px] text-gray-900">
          {isOpen ? "CLOSE" : "MENU"}
        </span>
      </motion.button>

      {/* Expanded Menu - Magazine Style */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full mb-4 bg-white border border-gray-200 shadow-2xl px-6 py-5 min-w-[180px]"
          >
            {/* Menu Header */}
            <div className="mb-4 pb-3 border-b border-gray-200">
              <p className="editorial-display text-2xl text-gray-900">Index</p>
            </div>

            <nav className="space-y-4">
              {pages.map((page, index) => {
                const isActive = page.href === pathname;
                return (
                  <button
                    key={page.href}
                    onClick={() => handleNavigate(page.href)}
                    className="block w-full text-left transition-colors group"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="editorial-caption text-[10px] text-gray-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p
                        className={`editorial-label text-xs ${
                          isActive
                            ? "text-gray-900"
                            : "text-gray-500 group-hover:text-gray-900"
                        }`}
                      >
                        {page.label}
                      </p>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="editorial-caption text-[9px] text-gray-400 tracking-wider">
                AP · 2025
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
