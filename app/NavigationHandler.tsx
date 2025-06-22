"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function NavigationHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href) {
        const url = new URL(link.href);
        const href = url.pathname;
        
        // Only intercept internal links that are different from current page
        if (url.origin === window.location.origin && href !== pathname && !href.includes('#')) {
          e.preventDefault();
          e.stopPropagation();
          
          console.log(`Intercepting navigation to: ${href}`);
          
          // Dispatch transition event immediately
          window.dispatchEvent(new CustomEvent('startPageTransition'));
          
          // Navigate after delay to allow transition to start
          setTimeout(() => {
            router.push(href);
          }, 300);
        }
      }
    };

    // Capture clicks during the capture phase to intercept before other handlers
    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [router, pathname]);

  return null; // This component doesn't render anything
} 