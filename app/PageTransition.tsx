"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

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

    window.addEventListener("startPageTransition", handleTransitionStart);
    return () =>
      window.removeEventListener("startPageTransition", handleTransitionStart);
  }, [transitionStage]);

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

      // Start with exit stage (overlay slides in)
      setTransitionStage("exit");

      // After exit animation, update content and start enter stage
      setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage("enter");

        // After enter animation, go back to idle
        setTimeout(() => {
          setTransitionStage("idle");
          prevPathRef.current = pathname;
        });
      });
    }
  }, [pathname, children]);

  // Calculate transform based on stage and direction
  const getTransform = () => {
    if (direction === "forward") {
      // Forward: right to left
      if (transitionStage === "idle") {
        return "translateX(-101%)"; // Off-screen right
      }
      if (transitionStage === "exit") {
        return "translateX(0%)"; // Cover the screen from right
      }
      if (transitionStage === "enter") {
        return "translateX(-101%)"; // Exit to left
      }
    } else {
      // Backward: left to right
      if (transitionStage === "idle") {
        return "translateX(101%)"; // Off-screen left
      }
      if (transitionStage === "exit") {
        return "translateX(0%)"; // Cover the screen from left
      }
      if (transitionStage === "enter") {
        return "translateX(101%)"; // Exit to right
      }
    }

    return "translateX(101%)";
  };

  return (
    <div className="relative min-h-screen">
      {/* Page Content */}
      <div className="relative z-10">{displayChildren}</div>

      {/* Transition Overlay - Always rendered for smooth transitions */}
      <div
        className="fixed inset-0 bg-accent-green z-50 pointer-events-none transition-transform duration-400 ease-in-out"
        style={{
          transform: getTransform(),
        }}
      />
    </div>
  );
}
