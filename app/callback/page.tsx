"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCodeFromUrl, getTokenFromCode } from "@/lib/spotify";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // Get authorization code from URL
      const code = getCodeFromUrl();
      
      if (code) {
        // Exchange code for token
        const token = await getTokenFromCode(code);
        
        if (token) {
          // Clear URL params and redirect to home
          window.history.replaceState({}, document.title, '/');
          router.push("/");
        } else {
          console.error('Failed to get token');
        }
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="editorial-headline text-lg">Connecting to Spotify...</p>
      </div>
    </div>
  );
}

