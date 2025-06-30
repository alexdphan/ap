"use client";

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if we're on a mobile device
    const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    
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
      document.body.classList.add('cursor-hover');
    };

    const handleMouseLeave = () => {
      document.body.classList.remove('cursor-hover');
    };

    const handleMouseDown = () => {
      document.body.classList.add('cursor-click');
    };

    const handleMouseUp = () => {
      document.body.classList.remove('cursor-click');
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"]');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Start animation loop
    requestRef.current = requestAnimationFrame(updateCursor);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }

      // Clean up classes
      document.body.classList.remove('cursor-hover', 'cursor-click');
    };
  }, []);

  return (
    <div ref={dotRef} className="cursor-dot" />
  );
} 