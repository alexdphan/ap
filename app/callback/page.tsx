"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCodeFromUrl, getTokenFromCode } from "@/lib/spotify";

export default function CallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Connecting to Spotify...");

  useEffect(() => {
    const handleCallback = async () => {
      console.log("Callback page loaded");
      
      // Get authorization code from URL
      const code = getCodeFromUrl();
      console.log("Authorization code:", code ? "Found" : "Not found");
      
      if (code) {
        setStatus("Exchanging code for token...");
        
        // Exchange code for token
        const token = await getTokenFromCode(code);
        console.log("Token received:", token ? "Yes" : "No");
        
        if (token) {
          setStatus("Success! Redirecting...");
          console.log("Redirecting to homepage");
          
          // Clear URL params and redirect to home
          window.history.replaceState({}, document.title, '/');
          router.push("/");
        } else {
          setStatus("Failed to get token. Check console for errors.");
          console.error('Failed to get token');
        }
      } else {
        setStatus("No authorization code found");
        console.error("No code in URL");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="editorial-headline text-lg">{status}</p>
        <p className="editorial-caption text-sm mt-2 text-gray-600">Check console for details</p>
      </div>
    </div>
  );
}

