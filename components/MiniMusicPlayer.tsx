"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { usePathname } from "next/navigation";

export default function MiniMusicPlayer() {
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    currentTrack,
    currentTrackIndex,
    isPlaying,
    tracks,
    iframeRef,
    handlePrevious,
    handleNext,
    setCurrentTrackIndex,
    shouldOpenDropdown,
    setShouldOpenDropdown,
    hasInteracted,
    setHasInteracted,
    setIsPlaying,
  } = useMusicPlayer();

  const [showDropdown, setShowDropdown] = useState(false);
  const bars = 5;

  const getRandomHeights = () => {
    return Array.from({ length: bars }, () => Math.random() * 0.8 + 0.2);
  };

  const [heights, setHeights] = useState(getRandomHeights());

  useEffect(() => {
    if (isPlaying) {
      const waveformIntervalId = setInterval(() => {
        setHeights(getRandomHeights());
      }, 100);

      return () => {
        clearInterval(waveformIntervalId);
      };
    }
    setHeights(Array(bars).fill(0.1));
  }, [isPlaying]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, pathname]);

  // Open dropdown when requested from FloatingMusicPlayer
  useEffect(() => {
    if (shouldOpenDropdown) {
      setShowDropdown(true);
      setShouldOpenDropdown(false);
    }
  }, [shouldOpenDropdown, setShouldOpenDropdown]);

  // Spotify Web Playback SDK player
  const playerRef = useRef<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isSDKReady, setIsSDKReady] = useState(false);

  // Load Spotify Web Playback SDK
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load the SDK script
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      console.log("✅ Spotify Web Playback SDK loaded");
      setIsSDKReady(true);
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
    };
  }, []);

  // Initialize player when SDK is ready
  useEffect(() => {
    if (!isSDKReady || typeof window === "undefined") return;

    // For now, we'll need users to authenticate via OAuth
    // This is a placeholder - you'll need to implement proper OAuth flow
    const getToken = () => {
      // Check if token is in environment (for testing)
      if (process.env.NEXT_PUBLIC_SPOTIFY_ACCESS_TOKEN) {
        return process.env.NEXT_PUBLIC_SPOTIFY_ACCESS_TOKEN;
      }
      
      // Check localStorage (after OAuth flow)
      return localStorage.getItem('spotify_access_token');
    };

    const token = getToken();
    
    if (!token) {
      console.error("❌ Missing Spotify access token. Please add NEXT_PUBLIC_SPOTIFY_ACCESS_TOKEN to .env.local or implement OAuth flow.");
      console.log("📝 Get a token from: https://developer.spotify.com/console/get-users-profile/");
      console.log("📝 Required scopes: streaming, user-read-email, user-read-private, user-modify-playback-state, user-read-playback-state");
      return;
    }

    console.log("✅ Spotify token found, initializing player...");

    const player = new (window as any).Spotify.Player({
      name: 'Alex Phan Web Player',
      getOAuthToken: (cb: any) => { cb(token); },
      volume: 0.5
    });

    // Ready
    player.addListener('ready', ({ device_id }: any) => {
      console.log('✅ Ready with Device ID', device_id);
      setDeviceId(device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }: any) => {
      console.log('❌ Device ID has gone offline', device_id);
    });

    // Player state changed
    player.addListener('player_state_changed', (state: any) => {
      if (!state) return;
      
      console.log('📊 Player state:', state);
      setIsPlaying(!state.paused);

      // Auto-advance when track ends
      if (state.position === 0 && state.paused && state.track_window.current_track) {
        console.log("⏭️ Track ended, advancing to next");
        handleNext();
      }
    });

    // Errors
    player.addListener('initialization_error', ({ message }: any) => {
      console.error('❌ Initialization error:', message);
    });

    player.addListener('authentication_error', ({ message }: any) => {
      console.error('❌ Authentication error:', message);
    });

    player.addListener('account_error', ({ message }: any) => {
      console.error('❌ Account error:', message);
    });

    player.addListener('playback_error', ({ message }: any) => {
      console.error('❌ Playback error:', message);
    });

    // Connect
    player.connect();
    playerRef.current = player;

  }, [isSDKReady]);

  // Handle track changes
  useEffect(() => {
    if (!deviceId || !currentTrack.spotifyTrackId) return;

    console.log(`🎵 Playing track: ${currentTrack.title}`);
    
    // Get token
    const token = process.env.NEXT_PUBLIC_SPOTIFY_ACCESS_TOKEN || 
                  (typeof window !== 'undefined' ? localStorage.getItem('spotify_access_token') : null);
    
    if (!token) {
      console.error("❌ No token available for playback");
      return;
    }
    
    // Use Spotify Web API to play track on this device
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({
        uris: [`spotify:track:${currentTrack.spotifyTrackId}`]
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    }).catch(err => {
      console.error('❌ Failed to play track:', err);
    });
  }, [currentTrack.spotifyTrackId, deviceId]);

  // Handle play/pause
  useEffect(() => {
    if (!playerRef.current) return;

    if (isPlaying) {
      console.log("▶️ Resuming");
      playerRef.current.resume();
    } else {
      console.log("⏸️ Pausing");
      playerRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <>
      {/* Show mini player on non-home pages (only if user has interacted), or on home page when dropdown is open */}
      <AnimatePresence mode="wait">
        {((pathname !== "/" && hasInteracted) || showDropdown) && (
          <motion.div
            key="mini-player"
            className="fixed top-0 left-0 right-0 md:left-auto md:right-8 md:top-8 z-50"
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{
              type: "tween",
              ease: [0.16, 1, 0.3, 1],
              duration: 0.4,
            }}
          >
            <div ref={dropdownRef} className="relative">
              <div className="flex items-center gap-3 w-full md:w-[400px] h-[68px] md:h-[72px] border-b border-gray-100 p-4 bg-white">
                {/* Album Art - Left */}
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-12 h-12 md:w-14 md:h-14 bg-black overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img
                    src={currentTrack.imageUrl}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/disk.png";
                    }}
                  />
                </div>

                {/* Song Title - Middle */}
                <div className="flex-1 min-w-0">
                  <p className="editorial-headline text-xs text-gray-900 truncate leading-tight">
                    {currentTrack.title}
                  </p>
                </div>

                {/* Playback Controls - Right */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setHasInteracted(true);
                      console.log('⏮️ Previous button clicked');
                      console.log('Current track index:', currentTrackIndex);
                      console.log('Player exists:', !!playerRef.current);
                      handlePrevious();
                    }}
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                    </svg>
                  </button>

                  <motion.div
                    onClick={() => {
                      setHasInteracted(true);
                      console.log('⏯️ Play/Pause clicked, current state:', isPlaying);
                      console.log('Player exists:', !!playerRef.current);
                      setIsPlaying(!isPlaying);
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer px-3 py-1.5 flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex h-[14px] md:h-[16px] items-center gap-[2px]"
                    >
                      {/* Waveform visualization */}
                      {heights.map((height, index) => (
                        <motion.div
                          key={index}
                          className="bg-gray-900 w-[2px]"
                          initial={{ height: 2 }}
                          animate={{
                            height: Math.max(4, height * 16),
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 10,
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>

                  <button
                    onClick={() => {
                      setHasInteracted(true);
                      console.log('⏭️ Next button clicked');
                      console.log('Current track index:', currentTrackIndex);
                      console.log('Player exists:', !!playerRef.current);
                      handleNext();
                    }}
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Dropdown Song List */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full w-full bg-white border-b border-gray-100 max-h-[340px] md:max-h-[360px] overflow-y-auto scrollbar-hide"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {tracks.map((track, index) => (
                      <div
                        key={track.id}
                        onClick={() => {
                          setHasInteracted(true);
                          setCurrentTrackIndex(index);
                          setIsPlaying(true);
                          setShowDropdown(false);
                        }}
                        className={`
                        flex items-center gap-3 p-3 md:p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0
                        ${index === currentTrackIndex ? "bg-gray-50" : ""}
                      `}
                      >
                        {/* Thumbnail */}
                        <div className="w-10 h-10 md:w-11 md:h-11 bg-black overflow-hidden flex-shrink-0">
                          <img
                            src={track.imageUrl}
                            alt={track.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/disk.png";
                            }}
                          />
                        </div>

                        {/* Song Info */}
                        <div className="flex-1 min-w-0">
                          <p className="editorial-headline text-xs text-gray-900 truncate">
                            {track.title}
                          </p>
                          <p className="editorial-caption text-[10px] text-gray-500 truncate">
                            {track.artist}
                          </p>
                        </div>

                        {/* Playing indicator */}
                        {index === currentTrackIndex && (
                          <div className="flex items-center gap-[2px]">
                            <motion.div
                              className="w-[2px] h-2 bg-gray-900 rounded-full"
                              animate={{
                                height: isPlaying ? [8, 4, 8] : 4,
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "linear",
                                repeatType: "reverse",
                              }}
                            />
                            <motion.div
                              className="w-[2px] h-2 bg-gray-900 rounded-full"
                              animate={{
                                height: isPlaying ? [4, 8, 4] : 4,
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "linear",
                                repeatType: "reverse",
                                delay: 0.27,
                              }}
                            />
                            <motion.div
                              className="w-[2px] h-2 bg-gray-900 rounded-full"
                              animate={{
                                height: isPlaying ? [8, 4, 8] : 4,
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "linear",
                                repeatType: "reverse",
                                delay: 0.53,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
