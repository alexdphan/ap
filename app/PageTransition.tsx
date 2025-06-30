"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<
    "idle" | "enter" | "exit"
  >("idle");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const prevPathRef = useRef(pathname);
  const isFirstRender = useRef(true);
  const navigationHistory = useRef<string[]>([pathname]);

  // Determine transition direction based on navigation
  const getTransitionDirection = (
    from: string,
    to: string
  ): "forward" | "backward" => {
    const routes = ["/", "/projects", "/memos"];
    const fromIndex = routes.indexOf(from);
    const toIndex = routes.indexOf(to);

    if (fromIndex === -1 || toIndex === -1) {
      if (from === "/" && (to === "/projects" || to === "/memos")) {
        return "forward";
      }
      if ((from === "/projects" || from === "/memos") && to === "/") {
        return "backward";
      }
      return "forward";
    }

    return toIndex > fromIndex ? "forward" : "backward";
  };

  // Listen for transition events
  useEffect(() => {
    const handleTransitionStart = () => {
      // Start the transition immediately when the event is received
      if (transitionStage === "idle") {
        setTransitionStage("exit");
      }
    };

    const handleBrowserNavigation = () => {
      console.log('Browser back/forward detected');
      
      // Just determine direction - let the pathname effect handle the transition
      const currentPath = window.location.pathname;
      const historyIndex = navigationHistory.current.indexOf(currentPath);
      
      if (historyIndex === -1) {
        // New page, going forward
        setDirection("forward");
        navigationHistory.current.push(currentPath);
      } else if (historyIndex < navigationHistory.current.length - 1) {
        // Going back in history  
        setDirection("backward");
        // Trim history to current position
        navigationHistory.current = navigationHistory.current.slice(0, historyIndex + 1);
      } else {
        // Default to forward
        setDirection("forward");
      }
      
      console.log(`Browser navigation direction: ${direction}`);
    };

    window.addEventListener("startPageTransition", handleTransitionStart);
    window.addEventListener("popstate", handleBrowserNavigation);
    
    return () => {
      window.removeEventListener("startPageTransition", handleTransitionStart);
      window.removeEventListener("popstate", handleBrowserNavigation);
    };
  }, [transitionStage, direction]);

  useEffect(() => {
    // Skip transition on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayChildren(children);
      return;
    }

    // Only trigger transition if pathname actually changed
    if (prevPathRef.current !== pathname) {
      const newDirection = getTransitionDirection(
        prevPathRef.current,
        pathname
      );
      setDirection(newDirection);
      console.log(
        `Transitioning from ${prevPathRef.current} to ${pathname}, direction: ${newDirection}`
      );

      // Start transition for pathname changes
      setTransitionStage("exit");

      // Start the continuous sweep immediately
      setTimeout(() => {
        setTransitionStage("enter");
      }, 10);

      // Change content halfway through the sweep (when green overlay covers screen)
      setTimeout(() => {
        setDisplayChildren(children);
      }, 400);

      // After sweep completes, go back to idle
      setTimeout(() => {
        setTransitionStage("idle");
        prevPathRef.current = pathname;
      }, 800);
    }
  }, [pathname, children]);

  // Calculate transform based on stage and direction
  const getTransform = () => {
    if (direction === "forward") {
      // Forward navigation: sweep left to right
      if (transitionStage === "idle") {
        return "translateX(-100%)"; // Hidden off-screen left
      }
      if (transitionStage === "exit") {
        return "translateX(-100%)"; // Start from left
      }
      if (transitionStage === "enter") {
        return "translateX(100%)"; // Sweep all the way to right
      }
    } else {
      // Backward navigation: sweep right to left
      if (transitionStage === "idle") {
        return "translateX(100%)"; // Hidden off-screen right
      }
      if (transitionStage === "exit") {
        return "translateX(100%)"; // Start from right
      }
      if (transitionStage === "enter") {
        return "translateX(-100%)"; // Sweep all the way to left
      }
    }

    return "translateX(100%)";
  };

  return (
    <div className="relative min-h-screen">
      {/* Page Content with animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          {displayChildren}
        </motion.div>
      </AnimatePresence>

      {/* Transition Overlay - Always rendered for smooth transitions */}
      <div
        className="fixed inset-0 bg-accent-green z-50 pointer-events-none transition-transform duration-800 ease-in-out"
        style={{
          transform: getTransform(),
        }}
      />
    </div>
  );
}
