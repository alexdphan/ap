"use client";

import { createContext, useContext, useState, useRef, ReactNode, useEffect } from "react";
import { getAuthUrl, getStoredToken, clearToken } from "@/lib/spotify";

interface Track {
  id: string;
  title: string;
  artist: string;
  spotifyUri: string;
  imageUrl: string;
}

interface MusicPlayerContextType {
  currentTrackIndex: number;
  isPlaying: boolean;
  currentTrack: Track;
  tracks: Track[];
  player: Spotify.Player | null;
  isAuthenticated: boolean;
  deviceId: string | null;
  hasInteracted: boolean;
  shouldOpenDropdown: boolean;
  login: () => Promise<string>;
  logout: () => void;
  setCurrentTrackIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setShouldOpenDropdown: (open: boolean) => void;
  setHasInteracted: (interacted: boolean) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  togglePlay: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(
  undefined
);

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldOpenDropdown, setShouldOpenDropdown] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Updated track list with Spotify URIs
  const tracks: Track[] = [
    {
      id: "1",
      title: "I Wonder",
      artist: "Kanye West",
      spotifyUri: "spotify:track:3YRCqOhFifThpSRFJ1VWFM",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2738b82ad699e06fce5d8fa06ef",
    },
    {
      id: "2",
      title: "Flashing Lights",
      artist: "Kanye West",
      spotifyUri: "spotify:track:6tDqIE0hK8WpjZAIK5Jjsb",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2738b82ad699e06fce5d8fa06ef",
    },
    {
      id: "3",
      title: "I Like It",
      artist: "DeBarge",
      spotifyUri: "spotify:track:6FcYWXWTmMFB9BTr9vE7Rz",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273f3ed8f5b22d0f8d8e1c3e0e5",
    },
    {
      id: "4",
      title: "Out of Time",
      artist: "The Weeknd",
      spotifyUri: "spotify:track:2LBqCSwhJGcFQeTHMVGwy3",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2734ab2520c2c77a1d66b9ee21d",
    },
    {
      id: "5",
      title: "Leave the Door Open",
      artist: "Bruno Mars, Anderson .Paak, Silk Sonic",
      spotifyUri: "spotify:track:7MAibcTli4IisCtbHKrGMh",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273e9a375a0e5f2a5b3d0c4e7e3",
    },
    {
      id: "6",
      title: "Passionfruit",
      artist: "Drake",
      spotifyUri: "spotify:track:5mCPDVBb16L4XQwDdbRUpz",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273f907de96b9a4fbc04accc0d5",
    },
    {
      id: "7",
      title: "Pink + White",
      artist: "Frank Ocean",
      spotifyUri: "spotify:track:4bRFHhanVfXKIF4GKLmqRt",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2737e7e8bc0e3d76c6e5e2f0e3e",
    },
    {
      id: "8",
      title: "Sure Thing",
      artist: "Miguel",
      spotifyUri: "spotify:track:5lB5LAVjqByZJELJKdR7LE",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2736e8e8bc0e3d76c6e5e2f0e3e",
    },
    {
      id: "9",
      title: "Latch",
      artist: "Disclosure",
      spotifyUri: "spotify:track:3XVozq1aeqsJwpXrEZrDJ9",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2736e8e8bc0e3d76c6e5e2f0e3e",
    },
    {
      id: "10",
      title: "Versace on the Floor",
      artist: "Bruno Mars",
      spotifyUri: "spotify:track:5p7ujcrUXASCNwRaWNHR1C",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2734c6d69c3cec9eb6c7f5e5e3e",
    },
  ];

  const currentTrack = tracks[currentTrackIndex];

  // Check for token on mount
  useEffect(() => {
    const storedToken = getStoredToken();

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    if (!token) return;

    // Load Spotify SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Alex Phan Music Player',
        getOAuthToken: (cb: (token: string) => void) => {
          cb(token);
        },
        volume: 0.8,
      });

      // Error handling
      spotifyPlayer.addListener('initialization_error', ({ message }: { message: string }) => {
        console.error('Initialization Error:', message);
      });

      spotifyPlayer.addListener('authentication_error', ({ message }: { message: string }) => {
        console.error('Authentication Error:', message);
        clearToken();
        setIsAuthenticated(false);
      });

      spotifyPlayer.addListener('account_error', ({ message }: { message: string }) => {
        console.error('Account Error:', message);
      });

      spotifyPlayer.addListener('playback_error', ({ message }: { message: string }) => {
        console.error('Playback Error:', message);
      });

      // Ready
      spotifyPlayer.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });

      // Not Ready
      spotifyPlayer.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Player state changed
      spotifyPlayer.addListener('player_state_changed', (state: Spotify.PlaybackState | null) => {
        if (!state) return;

        console.log('Player State Changed:', state);
        
        setIsPlaying(!state.paused);

        // Check if track ended (position is at the end and paused)
        if (state.paused && state.position === 0 && state.duration > 0) {
          console.log('Track ended, playing next!');
          handleNext();
        }
      });

      // Connect to the player
      spotifyPlayer.connect();

      setPlayer(spotifyPlayer);
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [token]);

  const login = async () => {
    const url = await getAuthUrl();
    return url;
  };

  const logout = () => {
    if (player) {
      player.disconnect();
    }
    clearToken();
    setIsAuthenticated(false);
    setToken(null);
    setPlayer(null);
  };

  const playTrack = async (uri: string) => {
    if (!player || !deviceId || !token) return;

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [uri] }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const handlePrevious = () => {
    setHasInteracted(true);
    const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(newIndex);
    playTrack(tracks[newIndex].spotifyUri);
    setIsPlaying(true);
  };

  const handleNext = () => {
    setHasInteracted(true);
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(newIndex);
    playTrack(tracks[newIndex].spotifyUri);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setHasInteracted(true);
    if (!player) return;

    player.togglePlay().then(() => {
      console.log('Toggled playback');
    });
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrackIndex,
        isPlaying,
        currentTrack,
        tracks,
        player,
        isAuthenticated,
        deviceId,
        hasInteracted,
        shouldOpenDropdown,
        login,
        logout,
        setCurrentTrackIndex,
        setIsPlaying,
        setShouldOpenDropdown,
        setHasInteracted,
        handlePrevious,
        handleNext,
        togglePlay,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
}
