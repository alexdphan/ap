"use client";
import React, { useState, useRef, useEffect } from "react";
import { VolumeX, Volume2, MessageSquare, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface CarouselItem {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

interface GiphyGif {
  id: string;
  title: string;
  images: {
    fixed_height_small: {
      url: string;
      width: string;
      height: string;
    };
    original: {
      url: string;
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
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState({ name: "", text: "" });
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [giphyGifs, setGiphyGifs] = useState<GiphyGif[]>([]);
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

  // Prevent hydration mismatch and detect mobile
  useEffect(() => {
    setIsClient(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Comments data per video - using state so updates trigger re-renders
  const [commentsData, setCommentsData] = useState<
    Record<
      string,
      Array<{ id: number; time: number; text: string; author?: string }>
    >
  >({
    "1": [
      { id: 1, time: 1, text: "Amazing transition!", author: "anon" },
      { id: 2, time: 3, text: "Love the colors here" },
      {
        id: 3,
        time: 5,
        text: "How did you achieve this effect?",
        author: "designer123",
      },
      {
        id: 4,
        time: 7,
        text: "[GIF|https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif|clap]",
      },
      { id: 5, time: 9, text: "The timing is perfect", author: "anon" },
      { id: 6, time: 11, text: "Beautiful visual design" },
      { id: 7, time: 13, text: "based", author: "creative_mind" },
      { id: 8, time: 15, text: "Great use of space" },
      { id: 9, time: 17, text: "Love the attention to detail", author: "anon" },
      { id: 10, time: 19, text: "Incredible work!" },
    ],
    "2": [
      { id: 11, time: 2, text: "Great lighting setup", author: "filmmaker" },
      { id: 12, time: 4, text: "The pacing is perfect " },
      { id: 13, time: 6, text: "Nice camera work!", author: "videographer" },
      { id: 14, time: 8, text: "Really clean execution" },
      { id: 15, time: 10, text: "Love this aesthetic", author: "anon" },
      { id: 16, time: 12, text: "Such smooth motion" },
      {
        id: 17,
        time: 14,
        text: "The composition is spot on",
        author: "art_lover",
      },
      { id: 18, time: 16, text: "This is inspiring!" },
      { id: 19, time: 18, text: "Great choice of music", author: "anon" },
      { id: 20, time: 20, text: "Phenomenal work overall" },
    ],
  });

  const getCurrentComments = () => {
    return commentsData[displayItems[currentIndex]?.id] || [];
  };

  // Function to render comment content with GIFs
  const renderCommentContent = (text: string) => {
    console.log("Comment text:", text); // Debug

    // If text contains GIF marker, extract and show the actual GIF
    if (text.includes("[GIF|")) {
      console.log("Found GIF marker! Extracting GIF"); // Debug

      // Extract the URL from [GIF|url|title] format
      const gifMatch = text.match(/\[GIF\|([^|]+)\|([^\]]*)\]/);

      if (gifMatch) {
        const gifUrl = gifMatch[1];
        const gifTitle = gifMatch[2];
        console.log("Extracted URL:", gifUrl); // Debug

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
              unoptimized
              className="inline-block object-cover ml-1"
              onLoad={() => console.log("GIF loaded:", gifUrl)}
              onError={() => console.log("GIF failed to load:", gifUrl)}
            />
            {textAfter && <span>{textAfter}</span>}
          </div>
        );
      }
    }

    // For non-GIF text, return as-is
    return text;
  };

  // Fetch GIFs from Giphy (trending or search)
  const fetchGifs = async (query: string | undefined = undefined) => {
    setLoadingGifs(true);
    try {
      // Using Giphy's public API key for demo purposes
      const endpoint = query
        ? `https://api.giphy.com/v1/gifs/search?api_key=GlVGYHkr3WSBnllca54iNt0yFbjz7L65&q=${encodeURIComponent(query)}&limit=12`
        : "https://api.giphy.com/v1/gifs/trending?api_key=GlVGYHkr3WSBnllca54iNt0yFbjz7L65&limit=12";

      const response = await fetch(endpoint);
      const data = await response.json();
      setGiphyGifs(data.data || []);
    } catch (error) {
      console.error("Failed to fetch GIFs:", error);
      setGiphyGifs([]);
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

  const handleGifSelect = (gif: GiphyGif) => {
    setNewComment((prev) => {
      // Get the current cursor position in the text input
      const textInput = document.querySelector(
        'input[placeholder="Type text, add GIFs..."]'
      ) as HTMLInputElement;
      const cursorPosition = textInput?.selectionStart || prev.text.length;

      // Insert GIF at cursor position
      const beforeCursor = prev.text.substring(0, cursorPosition);
      const afterCursor = prev.text.substring(cursorPosition);
      const gifText = `[GIF|${gif.images.fixed_height_small.url}|${gif.title || "GIF"}]`;

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
      if (giphyGifs.length === 0) {
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

  const handleAddComment = () => {
    if (newComment.text.trim()) {
      const timestamp = Math.floor(currentTime);
      const comment: {
        id: number;
        time: number;
        text: string;
        author?: string;
      } = {
        id: Date.now(),
        time: timestamp,
        text: newComment.text,
      };

      // Only add author if name is provided
      if (newComment.name.trim()) {
        comment.author = newComment.name;
      }

      // Add to current video's comments using state setter
      const videoId = displayItems[currentIndex]?.id;
      if (videoId && commentsData[videoId]) {
        setCommentsData((prev) => ({
          ...prev,
          [videoId]: [...prev[videoId], comment].sort(
            (a, b) => a.time - b.time
          ),
        }));
      }

      // Reset form
      setNewComment({ name: "", text: "" });
      setShowCommentForm(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayItems.length);
    setIsPlaying(true); // Auto-play new video
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + displayItems.length) % displayItems.length
    );
    setIsPlaying(true); // Auto-play new video
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true); // Auto-play new video
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isClient) {
      const video = document.querySelector(
        `[data-video-index="${currentIndex}"] video`
      ) as HTMLVideoElement;
      if (video) {
        video.muted = !isMuted;
      }
    }
  };

  const togglePlayPause = () => {
    const now = Date.now();
    const timeSinceLastToggle = now - lastToggleTime.current;

    // Debounce rapid calls
    if (timeSinceLastToggle < 100) {
      return;
    }

    lastToggleTime.current = now;

    if (isClient) {
      const video = document.querySelector(
        `[data-video-index="${currentIndex}"] video`
      ) as HTMLVideoElement;
      if (video) {
        if (isPlaying) {
          video.pause();
          setIsPlaying(false);
        } else {
          video.play().catch(() => {
            // Handle play restrictions
          });
          setIsPlaying(true);
        }
      }
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isClient) {
      const progressBar = e.currentTarget as HTMLElement;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;

      const video = document.querySelector(
        `[data-video-index="${currentIndex}"] video`
      ) as HTMLVideoElement;
      if (video && video.duration) {
        const newTime = percentage * video.duration;
        video.currentTime = Math.max(0, Math.min(newTime, video.duration));
      }
    }
  };

  // Enhanced autoplay useEffect with Safari-specific handling
  useEffect(() => {
    if (isClient) {
      // First, pause all videos
      const allVideos = document.querySelectorAll(
        "[data-video-index] video"
      ) as NodeListOf<HTMLVideoElement>;
      allVideos.forEach((video) => {
        video.pause();
      });

      // Then play only the current video if it should be playing
      const currentVideo = document.querySelector(
        `[data-video-index="${currentIndex}"] video`
      ) as HTMLVideoElement;
      if (currentVideo) {
        currentVideo.muted = isMuted;

        // Safari-specific handling
        if (isPlaying) {
          // Wait for the video to be ready to play
          const playWhenReady = () => {
            currentVideo.play().catch((error) => {
              console.log("Autoplay failed:", error);
              // For Safari, we might need user interaction first
            });
          };

          if (currentVideo.readyState >= 3) {
            // Video is ready to play
            playWhenReady();
          } else {
            // Wait for video to be ready
            currentVideo.addEventListener("canplaythrough", playWhenReady, {
              once: true,
            });
          }
        } else {
          currentVideo.pause();
        }
      }
    }
  }, [currentIndex, isMuted, isPlaying, isClient]);

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
      (comment) => currentTime >= comment.time
    );

    if (!commentContainerHeight || allComments.length === 0) {
      return allComments.slice(-(isMobile ? 3 : 5)); // Conservative fallback
    }

    // Available height accounting for padding and gaps
    const availableHeight = commentContainerHeight - 16; // Account for top/bottom padding
    const gapHeight = 8; // gap-2 = 8px

    let totalHeight = 0;
    const visibleComments = [];

    // Work backwards from the most recent comments
    for (let i = allComments.length - 1; i >= 0; i--) {
      const comment = allComments[i];
      const commentKey = `${comment.id}-${comment.time}`;

      // Get measured height or use estimated height as fallback
      const commentHeight =
        measuredComments[commentKey] || (isMobile ? 55 : 65);

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
        `[data-video-index="${currentIndex}"] video`
      ) as HTMLVideoElement;
      if (currentVideo) {
        currentVideo.currentTime = 0;
        setCurrentTime(0); // Reset comment timing
      }
    }
  }, [currentIndex, isClient]);

  // Track video progress
  useEffect(() => {
    if (isClient) {
      const video = document.querySelector(
        `[data-video-index="${currentIndex}"] video`
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
    }
  }, [currentIndex, isClient]);

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
    setDragStart(e.touches[0].clientX);
    setDragStartTime(Date.now());
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent scrolling/zooming
    const diff = e.touches[0].clientX - dragStart;
    setDragOffset(diff);
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
    } else if (dragOffset > threshold) {
      prevSlide();
    } else if (dragOffset < -threshold) {
      nextSlide();
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  // Placeholder items if none provided
  const defaultItems: CarouselItem[] = [
    {
      id: "1",
      title: "Project Alpha",
      description:
        "An experimental interface design exploring new interaction patterns.",
    },
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

  return (
    <div className="relative w-full">
      {/* Minimal Carousel */}
      <div className="relative bg-accent-green overflow-hidden">
        {/* Screen */}
        <div
          ref={carouselRef}
          className="relative aspect-video overflow-hidden cursor-grab active:cursor-grabbing"
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
            className="flex h-full transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(${-currentIndex * 100 + (dragOffset / (carouselRef.current?.offsetWidth || 1)) * 100}%)`,
            }}
          >
            {displayItems.map((item, index) => (
              <div
                key={item.id}
                className="w-full h-full flex-shrink-0 relative"
                data-video-index={index}
              >
                {item.videoUrl ? (
                  <>
                    <video
                      src={item.videoUrl}
                      autoPlay
                      muted // Use boolean attribute instead of muted={isMuted} for autoplay
                      loop
                      playsInline
                      webkit-playsinline="true"
                      preload="auto" // Changed from "metadata" to "auto" for mobile Safari
                      controls={false} // Explicitly disable controls
                      className="w-full h-full object-cover border-0 outline-0"
                      poster={item.thumbnailUrl}
                      onLoadedData={() => {
                        // Force play when video is loaded on mobile Safari
                        if (index === currentIndex && isPlaying) {
                          const video = document.querySelector(
                            `[data-video-index="${index}"] video`
                          ) as HTMLVideoElement;
                          if (video) {
                            video.muted = true; // Ensure it's muted
                            video.play().catch(() => {
                              // Silent fail for autoplay restrictions
                            });
                          }
                        }
                      }}
                    />

                    {/* Simple Play/Pause Overlay for Testing */}
                    {index === currentIndex && (
                      <div
                        className="absolute inset-0 z-5 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          togglePlayPause();
                        }}
                      />
                    )}
                    {/* Title Overlay */}
                    {index === currentIndex && (
                      <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-sm px-3 py-2 pointer-events-none">
                        <h3 className="text-white text-xs md:text-sm font-medium">
                          {item.title}
                        </h3>
                      </div>
                    )}

                    {/* Dynamic Comment Components - Column Layout */}
                    <AnimatePresence mode="popLayout">
                      {index === currentIndex && showAllComments && (
                        <div
                          ref={commentContainerRef}
                          className={`absolute top-4 bottom-4 pointer-events-none ${
                            isMobile
                              ? "right-1 w-auto max-w-[70%]"
                              : "right-2 w-auto max-w-[40%]"
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

                              const truncatedText = isMobile
                                ? truncateTextWithGifs(comment.text, 30)
                                : comment.text;

                              return (
                                <motion.div
                                  key={comment.id}
                                  ref={(el) =>
                                    measureComment(
                                      comment.id.toString(),
                                      comment.time,
                                      el
                                    )
                                  }
                                  className={`bg-black/60 backdrop-blur-sm rounded px-3 py-2 text-xs text-white w-auto inline-block ${
                                    isMobile ? "max-w-[160px]" : "max-w-[200px]"
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
                                        {formatTime(comment.time)}
                                      </span>
                                      {comment.author && (
                                        <span className="text-white/80 flex-shrink-0 text-[10px]">
                                          {comment.author}
                                        </span>
                                      )}
                                    </div>
                                    <div className="mt-1">
                                      {renderCommentContent(
                                        isMobile ? truncatedText : comment.text
                                      )}
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
        <div className="flex items-center justify-between px-3 bg-accent-green-dark">
          {/* Left - Slide Indicators */}
          <div className="flex-shrink-0 pl-2">
            {displayItems.length > 1 && (
              <div className="flex space-x-2">
                {displayItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      goToSlide(index);
                    }}
                    className={`w-2 h-2 transition-colors ${
                      index === currentIndex
                        ? "bg-background"
                        : "bg-background/40 hover:bg-background/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Center - Progress Bar and Comment */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <div
                className="w-48 h-1 bg-background/20 rounded-full overflow-hidden cursor-pointer hover:bg-background/30 transition-colors"
                onClick={handleProgressBarClick}
              >
                <div
                  className="h-full bg-background transition-all duration-300 pointer-events-none"
                  style={{ width: `${progress}%` }}
                />

                {/* Comment Indicators on Progress Bar */}
                {isClient &&
                  getCurrentComments().map((comment) => {
                    const video = document.querySelector(
                      `[data-video-index="${currentIndex}"] video`
                    ) as HTMLVideoElement;
                    const duration = video?.duration || 30; // fallback duration
                    const position = (comment.time / duration) * 100;

                    return (
                      <div
                        key={`indicator-${comment.id}`}
                        className="absolute top-0 w-1 h-1 bg-black/30 rounded-none transform -translate-x-0.5 z-20"
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
              className="text-background/60 hover:text-background  transition-colors px-2 py-2 rounded-sm"
            >
              <MessageSquare size={14} />
            </button>
          </div>

          {/* Right - Mute Button and Comment Toggle */}
          <div className="flex-shrink-0 flex items-center gap-0">
            <button
              onClick={toggleMute}
              className="text-background/60 hover:text-background transition-colors p-2"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className={`transition-colors p-2 ${
                showAllComments 
                  ? "text-background hover:text-background/80" 
                  : "text-background/40 hover:text-background/60"
              }`}
              title={showAllComments ? "Hide comments" : "Show comments"}
            >
              <Menu size={14} />
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
              <div className="p-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Top row on mobile, left side on desktop */}
                  <div className="flex gap-2 flex-1">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newComment.name}
                      onChange={(e) =>
                        setNewComment({ ...newComment, name: e.target.value })
                      }
                      className="w-20 px-2 py-1 text-xs bg-background/10 text-background placeholder-background/50 border-0 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Type text, add GIFs..."
                      value={newComment.text}
                      onChange={(e) =>
                        setNewComment({ ...newComment, text: e.target.value })
                      }
                      className="flex-1 px-2 py-1 text-xs bg-background/10 text-background placeholder-background/50 border-0 focus:outline-none"
                    />
                  </div>

                  {/* Bottom row on mobile, right side on desktop */}
                  <div className="flex gap-2 items-center justify-between sm:justify-end">
                    <span className="text-background/60 text-xs">
                      @{Math.floor(currentTime)}s
                    </span>
                    <div className="flex gap-1">
                      <button
                        ref={gifButtonRef}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleGifPicker();
                        }}
                        className="px-2 py-1 text-xs bg-background/20 text-background hover:bg-background/30 transition-colors"
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
                        className="px-2 py-1 text-xs bg-background text-accent-green disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background/90 transition-colors"
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
                        className="px-2 py-1 text-xs bg-background/20 text-background hover:bg-background/30 transition-colors"
                      >
                        ×
                      </button>
                    </div>
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
                    <div className="p-3 flex justify-center">
                      <div className="w-90 md:w-150">
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
                            className="px-3 py-2 text-xs bg-background/20 text-background hover:bg-background/30 transition-colors"
                          >
                            Done
                          </button>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                          {loadingGifs ? (
                            <div className="col-span-3 md:col-span-4 flex items-center justify-center py-4">
                              <div className="text-xs text-background/60">
                                Loading GIFs...
                              </div>
                            </div>
                          ) : (
                            giphyGifs.map((gif) => (
                              <button
                                key={gif.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleGifSelect(gif);
                                }}
                                className="relative w-full bg-background/10 hover:bg-background/20 transition-colors overflow-hidden border-0 p-0"
                                style={{ 
                                  aspectRatio: '1',
                                  minHeight: '60px',
                                  maxHeight: '80px'
                                }}
                              >
                                <Image
                                  src={gif.images.fixed_height_small.url}
                                  alt={gif.title}
                                  fill
                                  sizes="(max-width: 768px) 33vw, 25vw"
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
