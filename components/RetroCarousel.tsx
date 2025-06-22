"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  VolumeX,
  Volume2,
  MessageSquare,
  Menu,
  Maximize,
  Minimize,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { supabase, Comment, CommentInsert } from "../lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface CarouselItem {
  title: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

interface TenorGif {
  id: string;
  title: string;
  media_formats: {
    tinygif: {
      url: string;
      dims: [number, number];
    };
    gif: {
      url: string;
      dims: [number, number];
    };
  };
}

interface RetroCarouselProps {
  items: CarouselItem[];
}

export default function RetroCarousel({ items }: RetroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState({ name: "", text: "" });
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [tenorGifs, setTenorGifs] = useState<TenorGif[]>([]);
  const [loadingGifs, setLoadingGifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const carouselRef = useRef<HTMLDivElement>(null);
  const gifButtonRef = useRef<HTMLButtonElement>(null);
  const lastToggleTime = useRef(0);
  const [commentContainerHeight, setCommentContainerHeight] = useState(0);
  const commentContainerRef = useRef<HTMLDivElement>(null);
  const [measuredComments, setMeasuredComments] = useState<{
    [key: string]: number;
  }>({});
  const measurementRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [showAllComments, setShowAllComments] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const [showVideoDropdown, setShowVideoDropdown] = useState(false);
  const [videoSearchTerm, setVideoSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [manualExtendedIndex, setManualExtendedIndex] = useState<number | null>(
    null
  );
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [preloadedVideos, setPreloadedVideos] = useState<Set<string>>(
    new Set()
  );

  // Placeholder items if none provided
  const defaultItems: CarouselItem[] = [
    {
      title: "Project Alpha",
      description:
        "An experimental interface design exploring new interaction patterns.",
    },
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

  // Create extended array for seamless infinite loop
  const extendedItems = [
    displayItems[displayItems.length - 1], // Clone of last item at beginning
    ...displayItems,
    displayItems[0], // Clone of first item at end
  ];

  // Adjust index for extended array (real index + 1 because of leading clone)
  const extendedIndex =
    manualExtendedIndex !== null ? manualExtendedIndex : currentIndex + 1;

  // Function to get adjacent video indices for preloading
  const getAdjacentIndices = useCallback(
    (currentIdx: number) => {
      const total = displayItems.length;
      const prev = (currentIdx - 1 + total) % total;
      const next = (currentIdx + 1) % total;
      return { prev, current: currentIdx, next };
    },
    [displayItems.length]
  );

  // Simplified preloading for Safari compatibility
  const preloadVideo = useCallback(
    (videoUrl: string) => {
      if (!videoUrl || preloadedVideos.has(videoUrl)) return;

      const video = document.createElement("video");
      video.src = videoUrl;
      video.preload = "metadata"; // More conservative for Safari
      video.muted = true;
      video.playsInline = true;

      video.addEventListener(
        "loadeddata",
        () => {
          setPreloadedVideos((prev) => new Set([...prev, videoUrl]));
        },
        { once: true }
      );

      video.load();
    },
    [preloadedVideos]
  );

  // Preload adjacent videos when current video changes
  useEffect(() => {
    if (!isClient) return;

    const { prev, current, next } = getAdjacentIndices(currentIndex);

    // Preload current, previous, and next videos
    [prev, current, next].forEach((idx) => {
      const item = displayItems[idx];
      if (item?.videoUrl) {
        preloadVideo(item.videoUrl);
      }
    });
  }, [currentIndex, isClient, displayItems, getAdjacentIndices, preloadVideo]);

  // Initial preload on mount
  useEffect(() => {
    if (!isClient || displayItems.length === 0) return;

    // Preload first few videos immediately
    const videosToPreload = Math.min(3, displayItems.length);
    for (let i = 0; i < videosToPreload; i++) {
      const item = displayItems[i];
      if (item?.videoUrl) {
        preloadVideo(item.videoUrl);
      }
    }
  }, [isClient, displayItems, preloadVideo]);

  // Prevent hydration mismatch and detect mobile
  useEffect(() => {
    setIsClient(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Small delay to ensure hydration is complete
    const timer = setTimeout(() => {
      checkMobile();
      // Ensure transitions are enabled after initial render
      setIsTransitioning(true);
      // Reset any manual index overrides on initial load
      setManualExtendedIndex(null);
    }, 100);

    window.addEventListener("resize", checkMobile);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Cleanup body scroll on unmount
  useEffect(() => {
    return () => {
      if (isClient && isFullscreen) {
        document.body.style.overflow = '';
      }
    };
  }, [isClient, isFullscreen]);

    const toggleFullscreen = () => {
    const newFullscreenState = !isFullscreen;
    setIsFullscreen(newFullscreenState);

    // Prevent body scroll when in fullscreen mode
    if (isClient) {
      if (newFullscreenState) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        

      } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      }
    }
  };

  // Comments state - now using Supabase
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>(
    {}
  );

  // Fetch comments for current video
  const fetchComments = useCallback(async (videoIndex: number) => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("video_index", videoIndex)
        .order("time_seconds", { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  }, []);

  // Add new comment to database
  const addComment = async (comment: CommentInsert) => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .insert([comment])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  // Fetch comment counts for all videos
  const fetchCommentCounts = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("video_index")
        .order("video_index");

      if (error) throw error;

      // Count comments per video
      const counts: Record<number, number> = {};
      data?.forEach((comment) => {
        counts[comment.video_index] = (counts[comment.video_index] || 0) + 1;
      });

      setCommentCounts(counts);
    } catch (error) {
      console.error("Error fetching comment counts:", error);
    }
  };

  // Subscribe to real-time comment updates with error handling and debouncing
  useEffect(() => {
    if (!isClient) return;

    let channel: RealtimeChannel | null = null;
    let mounted = true;

    // Debounce subscription setup to avoid rapid WebSocket connections
    const timeoutId = setTimeout(() => {
      if (!mounted) return;

      try {
        channel = supabase
          .channel(`comments-${currentIndex}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "comments",
              filter: `video_index=eq.${currentIndex}`,
            },
            (payload) => {
              if (!mounted) return;

              if (payload.eventType === "INSERT") {
                setComments((prev) =>
                  [...prev, payload.new as Comment].sort(
                    (a, b) => a.time_seconds - b.time_seconds
                  )
                );
              } else if (payload.eventType === "DELETE") {
                setComments((prev) =>
                  prev.filter((comment) => comment.id !== payload.old.id)
                );
              }
            }
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              console.log(`Subscribed to comments for video ${currentIndex}`);
            } else if (status === "CHANNEL_ERROR") {
              console.warn(`Channel error for video ${currentIndex}:`, status);
            }
          });
      } catch (error) {
        console.warn("Failed to setup realtime subscription:", error);
      }
    }, 200); // 200ms debounce

    return () => {
      mounted = false;
      clearTimeout(timeoutId);

      if (channel) {
        try {
          supabase.removeChannel(channel).catch((error) => {
            // Silently handle WebSocket cleanup errors in development
            if (process.env.NODE_ENV === "development") {
              console.debug(
                "WebSocket cleanup error (expected in dev):",
                error.message
              );
            }
          });
        } catch {
          // Silent cleanup
        }
      }
    };
  }, [currentIndex, isClient]);

  // Subscribe to real-time comment count updates for all videos
  useEffect(() => {
    if (!isClient) return;

    let channel: RealtimeChannel | null = null;
    let mounted = true;

    // Delay subscription to avoid conflicts with other subscriptions
    const timeoutId = setTimeout(() => {
      if (!mounted) return;

      try {
        channel = supabase
          .channel("all-comments-counts")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "comments",
            },
            () => {
              if (!mounted) return;
              // Refresh comment counts when any comment is added/deleted
              fetchCommentCounts();
            }
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              console.log("Subscribed to comment count updates");
            } else if (status === "CHANNEL_ERROR") {
              console.warn("Channel error for comment counts:", status);
            }
          });
      } catch (error) {
        console.warn("Failed to setup comment count subscription:", error);
      }
    }, 300); // Slight delay to avoid conflicts

    return () => {
      mounted = false;
      clearTimeout(timeoutId);

      if (channel) {
        try {
          supabase.removeChannel(channel).catch((_error) => {
            if (process.env.NODE_ENV === "development") {
              console.debug(
                "WebSocket cleanup error (expected in dev):",
                _error.message
              );
            }
          });
        } catch {
          // Silent cleanup
        }
      }
    };
  }, [isClient]);

  // Fetch comments when video changes
  useEffect(() => {
    fetchComments(currentIndex);
  }, [currentIndex, fetchComments]);

  // Fetch comment counts on mount
  useEffect(() => {
    fetchCommentCounts();
  }, []);

  const getCurrentComments = () => {
    return comments;
  };

  // Function to render comment content with GIFs
  const renderCommentContent = (text: string) => {
    // If text contains GIF marker, extract and show the actual GIF
    if (text.includes("[GIF|")) {
      // Extract the URL from [GIF|url|title] format
      const gifMatch = text.match(/\[GIF\|([^|]+)\|([^\]]*)\]/);

      if (gifMatch) {
        const gifUrl = gifMatch[1];
        const gifTitle = gifMatch[2];

        // Get text before and after the GIF
        const textBefore = text.substring(0, text.indexOf("[GIF|"));
        const textAfter = text.substring(text.indexOf("]") + 1);

        return (
          <div className="flex items-center">
            {textBefore && <span>{textBefore}</span>}
            <Image
              src={gifUrl}
              alt={gifTitle}
              width={80}
              height={80}
                                            className="inline-block object-cover ml-1"
            />
            {textAfter && <span>{textAfter}</span>}
          </div>
        );
      }
    }

    // For non-GIF text, return as-is
    return text;
  };

  // Fetch GIFs from Tenor (trending or search)
  const fetchGifs = async (query: string | undefined = undefined) => {
    setLoadingGifs(true);
    try {
      // Using Tenor's public API key
      const endpoint = query
        ? `https://tenor.googleapis.com/v2/search?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&q=${encodeURIComponent(query)}&limit=12`
        : "https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&limit=12";

      const response = await fetch(endpoint);
      const data = await response.json();
      setTenorGifs(data.results || []);
    } catch (_error) {
      console.error("Failed to fetch GIFs:", _error);
      setTenorGifs([]);
    } finally {
      setLoadingGifs(false);
    }
  };

  // Debounced search function
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search for 300ms
    searchTimeoutRef.current = setTimeout(() => {
      if (query.trim()) {
        fetchGifs(query.trim());
      } else {
        fetchGifs(undefined); // Fetch trending when query is empty
      }
    }, 300);
  };

  const handleGifSelect = (gif: TenorGif) => {
    setNewComment((prev) => {
      // Get the current cursor position in the text input
      const textInput = document.querySelector(
        'input[placeholder="Type text, add GIFs..."]'
      ) as HTMLInputElement;
      const cursorPosition = textInput?.selectionStart || prev.text.length;

      // Insert GIF at cursor position
      const beforeCursor = prev.text.substring(0, cursorPosition);
      const afterCursor = prev.text.substring(cursorPosition);
      const gifText = `[GIF|${gif.media_formats.gif.url}|${gif.title || "GIF"}]`;

      return {
        ...prev,
        text: beforeCursor + gifText + afterCursor,
      };
    });

    // Don't close the picker immediately - allow multiple GIF selections
    // setShowGifPicker(false);  // Commented out to keep picker open
  };

  const toggleGifPicker = () => {
    if (!showGifPicker) {
      // Fetch GIFs when opening picker
      if (tenorGifs.length === 0) {
        fetchGifs(undefined);
      }
    } else {
      // Clear search when closing picker
      setSearchQuery("");
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    }
    setShowGifPicker(!showGifPicker);
  };

  const handleAddComment = async () => {
    if (newComment.text.trim()) {
      const timestamp = Math.floor(currentTime);
      const commentData: CommentInsert = {
        video_index: currentIndex,
        time_seconds: timestamp,
        text: newComment.text,
      };

      // Only add author if name is provided
      if (newComment.name.trim()) {
        commentData.author = newComment.name;
      }

      try {
        await addComment(commentData);
        // Reset form on success
        setNewComment({ name: "", text: "" });
        setShowCommentForm(false);
      } catch (_error) {
        console.error("Failed to add comment:", _error);
        // Could add user feedback here
      }
    }
  };

  const nextSlide = useCallback(() => {
    // Safety check to ensure we have items
    if (!displayItems.length || !isClient) return;

    setCurrentIndex((prev) => {
      if (prev === displayItems.length - 1) {
        // Use the clone at the end for seamless transition
        setManualExtendedIndex(displayItems.length + 1); // Clone of first item at end

        // After transition completes, reset to actual first item
        setTimeout(() => {
          // Use requestAnimationFrame for smoother timing
          requestAnimationFrame(() => {
            setIsTransitioning(false);
            setManualExtendedIndex(1); // Real first item
            requestAnimationFrame(() => {
              setIsTransitioning(true);
              setManualExtendedIndex(null); // Clear manual override
            });
          });
        }, 5); // Slightly longer than CSS transition to ensure completion

        return 0; // Update state to first item
      } else {
        return Math.min(displayItems.length - 1, prev + 1);
      }
    });
    setIsPlaying(true);
  }, [displayItems, isClient, setIsTransitioning, setManualExtendedIndex]);

  const prevSlide = useCallback(() => {
    // Safety check to ensure we have items
    if (!displayItems.length || !isClient) {
      return;
    }

    setCurrentIndex((prev) => {
      if (prev === 0) {
        // Use the clone at the beginning for seamless transition
        setManualExtendedIndex(0); // Clone of last item at beginning

        // After transition completes, reset to actual last item
        setTimeout(() => {
          // Use requestAnimationFrame for smoother timing
          requestAnimationFrame(() => {
            setIsTransitioning(false);
            setManualExtendedIndex(displayItems.length); // Real last item
            requestAnimationFrame(() => {
              setIsTransitioning(true);
              setManualExtendedIndex(null); // Clear manual override
            });
          });
        }, 310); // Slightly longer than CSS transition to ensure completion

        return displayItems.length - 1; // Update state to last item
      } else {
        return Math.max(0, prev - 1);
      }
    });
    setIsPlaying(true);
  }, [
    displayItems,
    isClient,
    setIsTransitioning,
    setManualExtendedIndex,
    currentIndex,
  ]);

  const goToSlide = (index: number) => {
    setManualExtendedIndex(null); // Reset manual index when directly navigating
    setCurrentIndex(index);
    setIsPlaying(true); // Auto-play new video
  };

  const toggleMute = useCallback(() => {
    if (isClient) {
      const video = document.querySelector(
        `[data-video-index="${extendedIndex}"] video`
      ) as HTMLVideoElement;
      if (video) {
        // Read current video muted state directly
        const newMutedState = !video.muted;
        video.muted = newMutedState;
        setIsMuted(newMutedState);
      }
    }
  }, [isClient, extendedIndex]);

  const togglePlayPause = useCallback(() => {
    const now = Date.now();
    const timeSinceLastToggle = now - lastToggleTime.current;

    // Debounce rapid calls
    if (timeSinceLastToggle < 100) {
      return;
    }

    lastToggleTime.current = now;

    if (isClient) {
      const video = document.querySelector(
        `[data-video-index="${extendedIndex}"] video`
      ) as HTMLVideoElement;
      if (video) {
        // Read current video playing state directly
        const isCurrentlyPlaying = !video.paused;

        if (isCurrentlyPlaying) {
          video.pause();
          setIsPlaying(false);
        } else {
          video.play().catch((error) => {
            console.log("Play failed:", error);
            setIsPlaying(false);
          });
          setIsPlaying(true);
        }
      }
    }
  }, [isClient, extendedIndex]);

  const handleProgressBarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isClient) {
      const progressBar = e.currentTarget as HTMLElement;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;

      const video = document.querySelector(
        `[data-video-index="${extendedIndex}"] video`
      ) as HTMLVideoElement;
      if (video && video.duration) {
        const newTime = percentage * video.duration;
        video.currentTime = Math.max(0, Math.min(newTime, video.duration));
      }
    }
  };

  // Simple autoplay for Safari compatibility
  useEffect(() => {
    if (!isClient) return;

    const timeoutId = setTimeout(() => {
      // First, pause all videos
      const allVideos = document.querySelectorAll(
        "[data-video-index] video"
      ) as NodeListOf<HTMLVideoElement>;
      allVideos.forEach((video) => {
        video.pause();
        video.muted = isMuted;
      });

      // Then play only the current video if it should be playing
      const currentVideo = document.querySelector(
        `[data-video-index="${extendedIndex}"] video`
      ) as HTMLVideoElement;

      if (currentVideo) {
        currentVideo.muted = isMuted;
        if (isPlaying) {
          currentVideo.play().catch(() => {
            // Handle autoplay restrictions
          });
        }
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [currentIndex, isMuted, isPlaying, isClient, extendedIndex]);

  // Track comment container height
  useEffect(() => {
    if (isClient && commentContainerRef.current) {
      const updateHeight = () => {
        if (commentContainerRef.current) {
          setCommentContainerHeight(commentContainerRef.current.offsetHeight);
        }
      };

      updateHeight();
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }
  }, [isClient]);

  // Enhanced function to calculate visible comments with precise measurements
  const getVisibleComments = () => {
    const allComments = getCurrentComments().filter(
      (comment) => currentTime >= comment.time_seconds
    );

    if (!commentContainerHeight || allComments.length === 0) {
      // Enhanced fallback for different modes
      const fallbackCount = isFullscreen ? 12 : isMobile ? 3 : 5;
      return allComments.slice(-fallbackCount);
    }

    // Available height accounting for padding and gaps
    const availableHeight = commentContainerHeight - 16; // Account for top/bottom padding
    const gapHeight = 8; // gap-2 = 8px

    let totalHeight = 0;
    const visibleComments = [];

    // Work backwards from the most recent comments
    for (let i = allComments.length - 1; i >= 0; i--) {
      const comment = allComments[i];
      const commentKey = `${comment.id}-${comment.time_seconds}`;

      // Get measured height or use estimated height as fallback
      // Adjust estimated height for fullscreen mode
      const estimatedHeight = isFullscreen ? 60 : isMobile ? 55 : 65;
      const commentHeight = measuredComments[commentKey] || estimatedHeight;

      // Check if adding this comment would exceed available height
      const heightNeeded =
        totalHeight +
        commentHeight +
        (visibleComments.length > 0 ? gapHeight : 0);

      if (heightNeeded <= availableHeight) {
        visibleComments.unshift(comment); // Add to beginning since we're working backwards
        totalHeight = heightNeeded;
      } else {
        // Stop adding comments if this one would be cut off
        break;
      }
    }

    return visibleComments;
  };

  // Function to measure comment height after render
  const measureComment = (
    commentId: string,
    commentTime: number,
    element: HTMLDivElement | null
  ) => {
    if (element) {
      const commentKey = `${commentId}-${commentTime}`;
      measurementRefs.current[commentKey] = element;

      // Measure the height including margins
      const rect = element.getBoundingClientRect();
      const height = rect.height;

      setMeasuredComments((prev) => ({
        ...prev,
        [commentKey]: height,
      }));
    }
  };

  // Reset video time only when switching to a new video
  useEffect(() => {
    if (isClient) {
      const currentVideo = document.querySelector(
        `[data-video-index="${extendedIndex}"] video`
      ) as HTMLVideoElement;
      if (currentVideo) {
        currentVideo.currentTime = 0;
        setCurrentTime(0); // Reset comment timing
      }
    }
  }, [currentIndex, isClient, extendedIndex]);

  // Track video progress
  useEffect(() => {
    if (!isClient) return;

    const video = document.querySelector(
      `[data-video-index="${extendedIndex}"] video`
    ) as HTMLVideoElement;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        const progressPercent = (video.currentTime / video.duration) * 100;
        setProgress(progressPercent);
        setCurrentTime(video.currentTime);
      }
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", updateProgress);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", updateProgress);
    };
  }, [currentIndex, isClient, extendedIndex]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragStartTime(Date.now());
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStart;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const threshold = 50;
    const timeDiff = Date.now() - dragStartTime;
    const wasQuickClick = timeDiff < 300 && Math.abs(dragOffset) < 15; // More lenient

    if (wasQuickClick) {
      // This was a click/tap, toggle play/pause
      togglePlayPause();
    } else if (dragOffset > threshold) {
      prevSlide();
    } else if (dragOffset < -threshold) {
      nextSlide();
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    setIsDragging(true);

    // Use vertical coordinates for fullscreen mobile, horizontal otherwise
    if (isFullscreen && isMobile) {
      setDragStart(e.touches[0].clientY);
    } else {
      setDragStart(e.touches[0].clientX);
    }
    setDragStartTime(Date.now());
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent scrolling/zooming

    // Use vertical coordinates for fullscreen mobile, horizontal otherwise
    if (isFullscreen && isMobile) {
      const diff = e.touches[0].clientY - dragStart;
      setDragOffset(diff);
    } else {
      const diff = e.touches[0].clientX - dragStart;
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent default touch behavior

    const threshold = 50;
    const timeDiff = Date.now() - dragStartTime;
    const wasQuickTap = timeDiff < 300 && Math.abs(dragOffset) < 20; // More lenient for mobile

    if (wasQuickTap) {
      // This was a tap, toggle play/pause
      togglePlayPause();
    } else if (isFullscreen && isMobile) {
      // Vertical swipes for fullscreen mobile: up = next, down = prev
      if (dragOffset < -threshold) {
        nextSlide(); // Swipe up = next
      } else if (dragOffset > threshold) {
        prevSlide(); // Swipe down = prev
      }
    } else {
      // Horizontal swipes for desktop and non-fullscreen mobile
      if (dragOffset > threshold) {
        prevSlide(); // Swipe right = prev
      } else if (dragOffset < -threshold) {
        nextSlide(); // Swipe left = next
      }
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  // Get visible thumbnails for revolving display
  const getFilteredVideos = () => {
    if (!videoSearchTerm.trim()) return displayItems;
    return displayItems.filter((item) =>
      item.title.toLowerCase().includes(videoSearchTerm.toLowerCase())
    );
  };

  const visibleThumbnails = useMemo(() => {
    const maxVisible = isMobile ? 3 : 4;
    const thumbnails = [];

    if (isMobile) {
      // Mobile: show [current, next, next+1]
      for (let i = 0; i < maxVisible; i++) {
        const index = (currentIndex + i) % displayItems.length;
        thumbnails.push({
          item: displayItems[index],
          originalIndex: index,
          isActive: index === currentIndex,
        });
      }
    } else {
      // Desktop: show [prev, current, next, next+1]
      for (let i = -1; i < maxVisible - 1; i++) {
        const index =
          (currentIndex + i + displayItems.length) % displayItems.length;
        thumbnails.push({
          item: displayItems[index],
          originalIndex: index,
          isActive: index === currentIndex,
        });
      }
    }

    return thumbnails;
  }, [currentIndex, displayItems, isMobile]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowVideoDropdown(false);
        setVideoSearchTerm("");
      }
    };

    if (showVideoDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showVideoDropdown]);

  // Close dropdown when video changes
  useEffect(() => {
    setShowVideoDropdown(false);
  }, [currentIndex]);

  // Keyboard navigation and shortcuts
  useEffect(() => {
    if (!isClient) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keys if user is typing in an input (except for space bar which should work globally)
      const isTyping =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement;

      // Global shortcuts that work even when typing
      if (e.key === " ") {
        e.preventDefault();
        togglePlayPause();
        return;
      }

      // Other shortcuts only work when not typing
      if (isTyping) {
        return;
      }

      // Media control shortcuts
      if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        toggleMute();
        return;
      }

      if (e.key.toLowerCase() === "c") {
        e.preventDefault();
        if (!showCommentForm) {
          setShowCommentForm(true);
          // Focus the name input after the form opens
          setTimeout(() => {
            nameInputRef.current?.focus();
          }, 100);
        } else {
          setShowCommentForm(false);
        }
        return;
      }

      if (e.key.toLowerCase() === "v") {
        e.preventDefault();
        setShowAllComments(!showAllComments);
        return;
      }

      if (e.key.toLowerCase() === "t") {
        e.preventDefault();
        setShowVideoDropdown(!showVideoDropdown);
        return;
      }

      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      // Navigation shortcuts
      if (isFullscreen && isMobile) {
        // Mobile fullscreen: use up/down arrows
        if (e.key === "ArrowUp") {
          e.preventDefault();
          prevSlide();
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          nextSlide();
        }
      } else {
        // Desktop and non-fullscreen mobile: use left/right arrows
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          prevSlide();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          nextSlide();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isClient,
    isFullscreen,
    isMobile,
    showCommentForm,
    showAllComments,
    isMuted,
    isPlaying,
    showVideoDropdown,
    currentIndex,
    nextSlide,
    prevSlide,
    toggleMute,
    togglePlayPause,
    toggleFullscreen,
  ]);

  return (
    <div
      ref={fullscreenContainerRef}
      className={`${
        isFullscreen 
          ? "fixed inset-0 w-screen h-screen z-[9999] bg-black safari-fullscreen" 
          : "relative w-full"
      }`}
      style={{
        // Safari-specific fixes
        ...(isFullscreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          WebkitTransform: 'translateZ(0)', // Force hardware acceleration
        })
      }}
      suppressHydrationWarning={true}
    >
      {/* Minimal Carousel */}
      <div
        className={`relative overflow-hidden ${
          isFullscreen 
            ? "h-full flex flex-col bg-black" 
            : "bg-accent-green"
        }`}
      >
        {/* Screen */}
        <div
          ref={carouselRef}
          className={`relative overflow-hidden cursor-grab active:cursor-grabbing ${
            isFullscreen ? "flex-1" : "aspect-video"
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel Content */}
          <div
            className={`h-full ${isTransitioning ? "transition-transform duration-300 ease-out" : ""} ${
              isFullscreen && isMobile ? "flex flex-col" : "flex"
            }`}
            style={{
              transform:
                isFullscreen && isMobile
                  ? `translateY(${-extendedIndex * 100 + (dragOffset / (carouselRef.current?.offsetHeight || 1)) * 100}%)`
                  : `translateX(${-extendedIndex * 100 + (dragOffset / (carouselRef.current?.offsetWidth || 1)) * 100}%)`,
            }}
          >
            {extendedItems.map((item, index) => (
              <div
                key={`${index}-${item.title}`}
                className="w-full h-full flex-shrink-0 relative"
                data-video-index={index}
              >
                {item.videoUrl ? (
                  <>
                    <video
                      src={item.videoUrl}
                      muted={isMuted}
                      loop
                      playsInline
                      className={`w-full h-full border-0 outline-0 ${
                        isFullscreen 
                          ? "object-contain" 
                          : "object-cover"
                      }`}
                      poster={item.thumbnailUrl}
                    />

                    {/* Loading indicator for videos that aren't preloaded */}
                    {item.videoUrl &&
                      !preloadedVideos.has(item.videoUrl) &&
                      index === extendedIndex && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="text-white text-sm flex items-center gap-2">
                            {/* <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> */}
                            {/* Loading... */}
                          </div>
                        </div>
                      )}

                    {/* Simple Play/Pause Overlay for Testing */}
                    {index === extendedIndex && (
                      <div
                        className="absolute inset-0 z-5 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          togglePlayPause();
                        }}
                        title="Play/pause (space)"
                      />
                    )}
                    {/* Title Overlay */}
                    {index === extendedIndex && (
                                              <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-sm px-2 py-2 pointer-events-none h-6 flex items-center">
                          <h3 className="text-white text-xs md:text-sm font-medium">
                            {item.title}
                          </h3>
                        </div>
                    )}

                    {/* Dynamic Comment Components - Column Layout */}
                    <AnimatePresence mode="popLayout">
                      {index === extendedIndex && showAllComments && (
                        <div
                          ref={commentContainerRef}
                          className={`absolute pointer-events-none z-20 ${
                            isFullscreen
                              ? "top-4 bottom-16 right-4 w-auto max-w-[50%]"
                              : isMobile
                                ? "top-4 bottom-4 right-1 w-auto max-w-[70%]"
                                : "top-4 bottom-4 right-2 w-auto max-w-[40%]"
                          }`}
                        >
                          <div className="flex flex-col gap-2 h-full items-end justify-end">
                            {getVisibleComments().map((comment) => {
                              const formatTime = (seconds: number) => {
                                const mins = Math.floor(seconds / 60);
                                const secs = Math.floor(seconds % 60);
                                return `${mins}:${secs.toString().padStart(2, "0")}`;
                              };

                              const truncateTextWithGifs = (
                                text: string,
                                maxLength: number
                              ) => {
                                if (text.length <= maxLength) return text;

                                // Check if there are GIF markers
                                const gifRegex = /\[GIF\|([^|]+)\|([^\]]*)\]/g;
                                const hasGifs = gifRegex.test(text);

                                if (hasGifs) {
                                  // If there are GIFs, don't truncate - show the full text with GIFs
                                  return text;
                                }

                                return text.substring(0, maxLength) + "...";
                              };

                              const truncatedText = isFullscreen
                                ? comment.text // Don't truncate in fullscreen
                                : isMobile
                                  ? truncateTextWithGifs(comment.text, 30)
                                  : comment.text;

                              return (
                                <motion.div
                                  key={comment.id}
                                  ref={(el) =>
                                    measureComment(
                                      comment.id.toString(),
                                      comment.time_seconds,
                                      el
                                    )
                                  }
                                  className={`bg-black/60 backdrop-blur-sm px-3 py-2 text-xs text-white w-auto inline-block ${
                                    isFullscreen
                                      ? "max-w-[300px]"
                                      : isMobile
                                        ? "max-w-[160px]"
                                        : "max-w-[200px]"
                                  }`}
                                  initial={{ x: 30, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  exit={{ x: -30, opacity: 0 }}
                                  transition={{
                                    duration: 0.2,
                                    ease: "easeOut",
                                  }}
                                >
                                  <div className="leading-tight break-words">
                                    <div className="flex items-start gap-1 text-xs">
                                      <span className="text-white/60 flex-shrink-0 text-[10px]">
                                        {formatTime(comment.time_seconds)}
                                      </span>
                                      {comment.author && (
                                        <span className="text-white/80 flex-shrink-0 text-[10px]">
                                          {comment.author}
                                        </span>
                                      )}
                                    </div>
                                    <div className="mt-1">
                                      {renderCommentContent(truncatedText)}
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-center p-8">
                    <div>
                      <div className="text-6xl mb-4 text-background/30">▶</div>
                      <h3 className="text-xl font-bold text-background mb-2">
                        {item.title}
                      </h3>
                      <p className="text-background/70 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Controls */}
        <div
          className={`flex items-center justify-between px-3 bg-accent-green-dark relative ${
            isFullscreen 
              ? "h-auto py-2 z-[10000] safari-fullscreen-controls" 
              : "h-10 z-40"
          }`}
          style={{ 
            paddingBottom: isFullscreen 
              ? `calc(0.5rem + env(safe-area-inset-bottom, 20px))` 
              : "env(safe-area-inset-bottom)",
            // Safari-specific positioning
            ...(isFullscreen && {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              minHeight: '44px', // Minimum touch target for iOS
              WebkitTransform: 'translateZ(0)', // Force hardware acceleration
            })
          }}
        >
          {/* Left - Video Selector Dropdown */}
          <div className="flex-shrink-0 relative" ref={dropdownRef}>
            {displayItems.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowVideoDropdown(!showVideoDropdown);
                  }}
                  className="flex h-8 items-center px-2 hover:bg-background/10 transition-colors group relative"
                  title="Select video (t)"
                >
                  <AnimatePresence mode="popLayout">
                    {visibleThumbnails.map((thumb) => (
                      <motion.div
                        key={thumb.originalIndex}
                        layout
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{
                          opacity: thumb.isActive && isPlaying ? 0.8 : 1,
                          scale: 1,
                          x: 0,
                        }}
                        exit={{ opacity: 0, scale: 0.8, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-5 h-5 overflow-hidden mr-4 last:mr-0"
                      >
                        {thumb.item.thumbnailUrl ? (
                          <Image
                            src={thumb.item.thumbnailUrl}
                            alt={thumb.item.title}
                            width={20}
                            height={20}
                            className="w-full h-full object-cover"
                          />
                        ) : thumb.item.videoUrl ? (
                          <video
                            src={thumb.item.videoUrl}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                            onLoadedMetadata={(e) => {
                              // Safari fix: Force seek to show first frame
                              const video = e.target as HTMLVideoElement;
                              if (video.duration > 0) {
                                video.currentTime = 0.1;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-background/40"></div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </button>

                {/* Video Dropdown */}
                <AnimatePresence>
                  {showVideoDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-full left-0 mb-2 w-48 md:w-64 bg-accent-green-dark border border-accent-green  shadow-lg z-50"
                    >
                      <div className="p-1.5 md:p-2">
                        <div className="flex items-center gap-2 mb-1.5 md:mb-2 px-1.5 md:px-2">
                          <div className="text-background/60 flex-shrink-0">
                            <Search size={12} />
                          </div>
                          <input
                            type="text"
                            placeholder="Search videos..."
                            value={videoSearchTerm}
                            onChange={(e) => setVideoSearchTerm(e.target.value)}
                            className="flex-1 px-2 py-1 text-[10px] md:text-xs bg-background/10 text-background placeholder-background/50 border border-background/20 focus:outline-none focus:border-background/40"
                          />
                        </div>
                        <div
                          className={`${isMobile && isFullscreen ? "max-h-64" : "max-h-32 md:max-h-48"} overflow-y-auto space-y-1`}
                        >
                          {getFilteredVideos().map((item) => {
                            const index = displayItems.findIndex(
                              (displayItem) => displayItem.title === item.title
                            );
                            return (
                              <button
                                key={`${index}-${item.title}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  goToSlide(index);
                                  setShowVideoDropdown(false);
                                }}
                                className={`w-full flex items-center gap-2 md:gap-3 p-1.5 md:p-2 transition-colors text-left ${
                                  index === currentIndex
                                    ? "bg-background/20 text-background"
                                    : "hover:bg-background/10 text-background/80"
                                }`}
                              >
                                <div className="w-6 h-4 md:w-8 md:h-6 overflow-hidden flex-shrink-0">
                                  {item.thumbnailUrl ? (
                                    <Image
                                      src={item.thumbnailUrl}
                                      alt={item.title}
                                      width={32}
                                      height={24}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : item.videoUrl ? (
                                    <video
                                      src={item.videoUrl}
                                      className="w-full h-full object-cover"
                                      muted
                                      playsInline
                                      preload="metadata"
                                      onLoadedMetadata={(e) => {
                                        // Safari fix: Force seek to show first frame
                                        const video =
                                          e.target as HTMLVideoElement;
                                        if (video.duration > 0) {
                                          video.currentTime = 0.1;
                                        }
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-background/40"></div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-[11px] md:text-xs font-medium">
                                    {item.title}
                                  </div>
                                </div>

                                {/* Comment count */}
                                <div className="flex items-center gap-0.5 md:gap-1 text-background/60">
                                  <MessageSquare className="w-2 h-2 md:w-2.5 md:h-2.5" />
                                  <span className="text-[10px] md:text-xs">
                                    {commentCounts[index] || 0}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Center - Progress Bar and Comment */}
          <div className="flex items-center flex-1 justify-center">
            <div className="relative">
              <div
                className="w-24 md:w-32 h-1 bg-background/20 overflow-hidden cursor-pointer hover:bg-background/30 transition-colors"
                onClick={handleProgressBarClick}
              >
                <div
                  className="h-full bg-background transition-all duration-300 pointer-events-none"
                  style={{ width: `${progress}%` }}
                />

                {/* Comment Indicators on Progress Bar */}
                {isClient &&
                  getCurrentComments().length > 0 &&
                  getCurrentComments().map((comment) => {
                    const video = document.querySelector(
                      `[data-video-index="${extendedIndex}"] video`
                    ) as HTMLVideoElement;
                    const duration = video?.duration || 30; // fallback duration
                    const position = (comment.time_seconds / duration) * 100;

                    return (
                      <div
                        key={`indicator-${comment.id}`}
                        className="absolute top-0 w-1 h-1 bg-accent-green-dark transform -translate-x-0.5 z-20"
                        style={{ left: `${Math.min(position, 95)}%` }}
                      />
                    );
                  })}
              </div>
            </div>

            {/* Comment Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowCommentForm(!showCommentForm);
              }}
              className="text-background/60 hover:text-background transition-colors h-8 px-2 md:h-6 md:px-2 flex items-center justify-center touch-manipulation"
              title="Add comment (c)"
            >
              <MessageSquare size={13} />
            </button>
          </div>

          {/* Right - Mute Button, Comment Toggle, and Fullscreen Button */}
          <div className="flex-shrink-0 flex items-center gap-0">
            <button
              onClick={toggleMute}
              className="text-background/60 hover:text-background transition-colors h-8 px-2 md:h-6 md:px-2 flex items-center justify-center touch-manipulation"
              title="Toggle mute (m)"
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className={`transition-colors h-8 md:h-6 md:px-2 px-2 flex items-center justify-center touch-manipulation ${
                showAllComments
                  ? "text-background hover:text-background/80"
                  : "text-background/40 hover:text-background/60"
              }`}
              title={`${showAllComments ? "Hide comments" : "Show comments"} (v)`}
            >
              <Menu size={17} />
            </button>
                    <button
          onClick={toggleFullscreen}
          className="text-background/60 hover:text-background transition-colors h-8 px-2 md:h-6 md:px-2 flex items-center justify-center touch-manipulation"
          title={`${isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} (f)`}
        >
              {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
            </button>
          </div>
        </div>

        {/* Comment Form */}
        <AnimatePresence>
          {showCommentForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden bg-accent-green-dark border-t border-accent-green"
            >
              <div 
                className={`flex items-center px-3 ${isFullscreen ? "h-auto py-2" : "h-10"}`}
                style={{
                  paddingBottom: isFullscreen 
                    ? `calc(0.5rem + env(safe-area-inset-bottom))` 
                    : undefined
                }}
              >
                <div className="flex items-center gap-2 flex-1">
                  <input
                    ref={nameInputRef}
                    type="text"
                    placeholder="Name"
                    value={newComment.name}
                    onChange={(e) =>
                      setNewComment({ ...newComment, name: e.target.value })
                    }
                    className="w-20 h-6 px-2 text-xs bg-background/10 text-background placeholder-background/50 border-0 focus:outline-none"
                  />
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder={`Comment @${Math.floor(currentTime)}s`}
                      value={newComment.text}
                      onChange={(e) =>
                        setNewComment({ ...newComment, text: e.target.value })
                      }
                      className="w-full h-6 px-2 pr-12 text-xs bg-background/10 text-background placeholder-background/50 border-0 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-1">
                    <button
                      ref={gifButtonRef}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleGifPicker();
                      }}
                      className="h-6 px-2 text-xs bg-background/20 text-background hover:bg-background/30 transition-colors flex items-center justify-center"
                    >
                      GIF
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddComment();
                      }}
                      disabled={!newComment.text.trim()}
                      className="h-6 px-2 text-xs bg-background text-accent-green disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background/90 transition-colors flex items-center justify-center"
                    >
                      Post
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowCommentForm(false);
                        setShowGifPicker(false);
                      }}
                      className="h-6 px-2 text-xs bg-background/20 text-background hover:bg-background/30 transition-colors flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>

              {/* GIF Picker - now part of the comment form layout */}
              <AnimatePresence>
                {showGifPicker && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden bg-accent-green-dark border-t border-accent-green"
                  >
                    <div className="p-2 md:p-3">
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-3">
                          <input
                            type="text"
                            placeholder="Search for GIFs..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs bg-background/10 text-background placeholder-background/50 border border-background/20 focus:outline-none focus:border-background/40 mr-2"
                            autoFocus
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowGifPicker(false);
                            }}
                            className="px-3 py-2 text-xs bg-background/20 text-background hover:bg-background/30 transition-colors flex-shrink-0"
                          >
                            Done
                          </button>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-40 md:max-h-48 overflow-y-auto overflow-x-hidden">
                          {loadingGifs ? (
                            <div className="col-span-3 md:col-span-4 flex items-center justify-center py-4">
                              <div className="text-xs text-background/60">
                                Loading GIFs...
                              </div>
                            </div>
                          ) : (
                            tenorGifs.map((gif) => (
                              <button
                                key={gif.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleGifSelect(gif);
                                }}
                                className="w-full relative bg-background/10 hover:bg-background/20 transition-colors overflow-hidden border-0 p-0 touch-manipulation flex items-center justify-center"
                                style={{
                                  height: "80px",
                                  aspectRatio: "1 / 1",
                                }}
                              >
                                <Image
                                  src={gif.media_formats.tinygif.url}
                                  alt={gif.title}
                                  width={76}
                                  height={76}
                                  unoptimized
                                  className="object-cover"
                                />
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
