"use client";

import { useRouter } from 'next/navigation';
import React from 'react';

interface DelayedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

// Create a custom event for page transitions
export const pageTransitionEvent = new Event('startPageTransition');

export default function DelayedLink({ href, children, className }: DelayedLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Trigger the transition immediately
    window.dispatchEvent(pageTransitionEvent);
    
    // Navigate after delay
    setTimeout(() => {
      router.push(href);
    }, 400);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
} 