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
      {/* Hamburger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-white border border-gray-200  flex items-center justify-center shadow-lg"
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-5 h-4 relative flex flex-col justify-between">
          <motion.span
            className="w-full h-[2px] bg-gray-900 "
            animate={{
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 7 : 0,
            }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.span
            className="w-full h-[2px] bg-gray-900"
            animate={{
              opacity: isOpen ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="w-full h-[2px] bg-gray-900 "
            animate={{
              rotate: isOpen ? -45 : 0,
              y: isOpen ? -7 : 0,
            }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </motion.button>

      {/* Expanded Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full mb-4 bg-white border border-gray-200 shadow-2xl p-4 min-w-[140px]"
          >
            <nav className="space-y-3">
              {pages.map((page) => {
                const isActive = page.href === pathname;
                return (
                  <button
                    key={page.href}
                    onClick={() => handleNavigate(page.href)}
                    className={`block w-full text-left transition-colors ${
                      isActive
                        ? "border-l-2 border-gray-900 pl-3 text-gray-900 font-semibold"
                        : "pl-3 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <p className="text-xs uppercase tracking-widest">
                      {page.label}
                    </p>
                  </button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
