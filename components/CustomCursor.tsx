"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Check if we're on a mobile device
    const isMobile = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;

    if (isMobile) {
      return; // Don't render custom cursor on mobile
    }

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;

    const updateCursor = () => {
      // Much more responsive movement - nearly instant like normal cursor
      dotX += (mouseX - dotX) * 0.8;
      dotY += (mouseY - dotY) * 0.8;

      if (dotRef.current) {
        dotRef.current.style.left = `${dotX}px`;
        dotRef.current.style.top = `${dotY}px`;
      }

      requestRef.current = requestAnimationFrame(updateCursor);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseEnter = () => {
      document.body.classList.add("cursor-hover");
    };

    const handleMouseLeave = () => {
      document.body.classList.remove("cursor-hover");
    };

    const handleTextEnter = () => {
      document.body.classList.add("cursor-text");
    };

    const handleTextLeave = () => {
      document.body.classList.remove("cursor-text");
    };

    const handleMouseDown = () => {
      document.body.classList.add("cursor-click");
    };

    const handleMouseUp = () => {
      document.body.classList.remove("cursor-click");
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Add hover effects for interactive elements (carousel, buttons, links)
    // This includes the RetroCarousel's draggable area and Next.js Link components
    const addInteractiveListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, input, textarea, [role="button"], [class*="cursor-grab"], [class*="cursor-pointer"], video, .cursor-pointer, [class*="cursor-grabbing"], [data-cursor="hover"], a[href="/projects"], a[href="/memos"], a[href*="/memos/"], a[href*="/projects/"], a.block'
      );

      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });

      return interactiveElements;
    };

    // Add text cursor for text elements (excluding interactive elements)
    const addTextListeners = () => {
      // Simple selector for common text elements
      const textElements = document.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6, span, div"
      );

      const validTextElements: Element[] = [];

      textElements.forEach((el) => {
        // Skip if element is or contains interactive elements
        if (
          el.tagName === "A" ||
          el.tagName === "BUTTON" ||
          el.closest("a") ||
          el.closest("button") ||
          el.querySelector("a") ||
          el.querySelector("button") ||
          el.classList.contains("cursor-pointer") ||
          el.classList.contains("cursor-grab") ||
          el.classList.contains("cursor-grabbing") ||
          el.hasAttribute("role") ||
          el.classList.contains("group") // Skip group containers that wrap links
        ) {
          return;
        }

        // Only add text cursor to elements that actually contain text
        const hasTextContent =
          el.textContent && el.textContent.trim().length > 0;
        if (hasTextContent) {
          el.addEventListener("mouseenter", handleTextEnter);
          el.addEventListener("mouseleave", handleTextLeave);
          validTextElements.push(el);
        }
      });

      return validTextElements;
    };

    // Initial setup - but wait for DOM to be ready
    let interactiveElements: NodeListOf<Element> =
      document.querySelectorAll("a"); // Initialize with valid selector
    let textElements: Element[] = [];

    // These will be properly populated in refreshCursor

    // Set up mutation observer to handle dynamically added elements
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;

      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          shouldUpdate = true;
        }
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          shouldUpdate = true;
        }
      });

      if (shouldUpdate) {
        // Debounce the update to avoid too many rapid updates
        setTimeout(() => {
          // Remove old listeners
          interactiveElements.forEach((el) => {
            el.removeEventListener("mouseenter", handleMouseEnter);
            el.removeEventListener("mouseleave", handleMouseLeave);
          });

          textElements.forEach((el) => {
            el.removeEventListener("mouseenter", handleTextEnter);
            el.removeEventListener("mouseleave", handleTextLeave);
          });

          // Add new listeners
          interactiveElements = addInteractiveListeners();
          textElements = addTextListeners();
        }, 100);
      }
    });

    // Start observing with more comprehensive options
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "data-cursor"],
    });

    // Force refresh multiple times to catch Next.js navigation and dynamic content
    const refreshCursor = () => {
      console.log("Refreshing cursor detection...");

      // Remove old listeners
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
      textElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleTextEnter);
        el.removeEventListener("mouseleave", handleTextLeave);
      });

      // Add new listeners
      interactiveElements = addInteractiveListeners();
      textElements = addTextListeners();

      console.log(
        `Found ${interactiveElements.length} interactive elements and ${textElements.length} text elements`
      );
    };

    // Wait for DOM to be fully ready
    const initializeCursor = () => {
      // Use multiple strategies to ensure DOM is ready
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", refreshCursor);
      } else {
        // DOM is already ready
        refreshCursor();
      }

      // Also use requestAnimationFrame for good measure
      requestAnimationFrame(() => {
        refreshCursor();
      });
    };

    // Initialize immediately
    initializeCursor();

    // Multiple refresh intervals to catch different rendering phases
    setTimeout(refreshCursor, 50);
    setTimeout(refreshCursor, 100);
    setTimeout(refreshCursor, 200);
    setTimeout(refreshCursor, 500);
    setTimeout(refreshCursor, 1000);
    setTimeout(refreshCursor, 2000);

    // Listen for Next.js navigation events
    const handleRouteChange = () => {
      console.log("Route change detected, refreshing cursor...");
      setTimeout(refreshCursor, 50);
      setTimeout(refreshCursor, 100);
      setTimeout(refreshCursor, 300);
      setTimeout(refreshCursor, 500);
      setTimeout(refreshCursor, 800); // Extra delay for MDX content
      setTimeout(refreshCursor, 1200); // Even longer delay for complex MDX pages
    };

    // Special handler for MDX pages that need more time to render
    const handleMDXPageLoad = () => {
      console.log("MDX page detected, using extended refresh schedule...");
      // More aggressive refresh schedule for MDX content
      setTimeout(refreshCursor, 100);
      setTimeout(refreshCursor, 300);
      setTimeout(refreshCursor, 600);
      setTimeout(refreshCursor, 1000);
      setTimeout(refreshCursor, 1500);
      setTimeout(refreshCursor, 2000);
      setTimeout(refreshCursor, 3000); // Very long delay for complex MDX
    };

    // Detect if we're on an MDX page (memos or projects with sub-paths)
    const isMDXPage = () => {
      const path = window.location.pathname;
      return path.includes("/memos/") || path.includes("/projects/");
    };

    // Enhanced route change handler that detects MDX pages
    const handleEnhancedRouteChange = () => {
      if (isMDXPage()) {
        handleMDXPageLoad();
      } else {
        handleRouteChange();
      }
    };

    // Listen for popstate (back/forward navigation)
    window.addEventListener("popstate", handleEnhancedRouteChange);

    // Listen for custom navigation events if they exist
    window.addEventListener("startPageTransition", handleEnhancedRouteChange);

    // Also refresh on window focus (when user comes back to tab)
    window.addEventListener("focus", refreshCursor);

    // Listen for URL changes (more reliable for detecting actual page changes)
    let currentPath = window.location.pathname;
    const checkForPathChange = () => {
      const newPath = window.location.pathname;
      if (newPath !== currentPath) {
        console.log(`Path changed from ${currentPath} to ${newPath}`);
        currentPath = newPath;

        // Trigger enhanced route change handler
        handleEnhancedRouteChange();
      }
    };

    // Check for path changes periodically
    const pathCheckInterval = setInterval(checkForPathChange, 100);

    // Also listen for history changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      setTimeout(checkForPathChange, 0);
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      setTimeout(checkForPathChange, 0);
    };

    // Start animation loop
    requestRef.current = requestAnimationFrame(updateCursor);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("DOMContentLoaded", refreshCursor);

      // Remove navigation and focus listeners
      window.removeEventListener("popstate", handleEnhancedRouteChange);
      window.removeEventListener(
        "startPageTransition",
        handleEnhancedRouteChange
      );
      window.removeEventListener("focus", refreshCursor);

      // Clean up path change detection
      clearInterval(pathCheckInterval);

      // Restore original history methods
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;

      observer.disconnect();

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });

      textElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleTextEnter);
        el.removeEventListener("mouseleave", handleTextLeave);
      });

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }

      // Clean up classes
      document.body.classList.remove(
        "cursor-hover",
        "cursor-click",
        "cursor-text"
      );
    };
  }, [isClient]);

  return <div ref={dotRef} className="cursor-dot" />;
}
