'use client'
import React, { useState, useRef, useEffect } from 'react';
import { VolumeX, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselItem {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  thumbnailUrl?: string;
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
  const carouselRef = useRef<HTMLDivElement>(null);

  // Comments data per video
  const commentsData: Record<string, Array<{id: number, time: number, text: string, author: string}>> = {
    '1': [
      { id: 1, time: 1, text: "Amazing transition!", author: "viewer1" },
      { id: 2, time: 3, text: "Love the colors here", author: "viewer2" },
      { id: 3, time: 5, text: "How did you achieve this effect?", author: "viewer3" },
      { id: 4, time: 7, text: "Smooth animation work", author: "viewer4" },
      { id: 5, time: 9, text: "The timing is perfect", author: "viewer5" },
      { id: 6, time: 11, text: "Beautiful visual design", author: "viewer6" },
      { id: 7, time: 13, text: "This is so creative!", author: "viewer7" },
      { id: 8, time: 15, text: "Great use of space", author: "viewer8" },
      { id: 9, time: 17, text: "Love the attention to detail", author: "viewer9" },
      { id: 10, time: 19, text: "Incredible work!", author: "viewer10" },
    ],
    '2': [
      { id: 11, time: 2, text: "Great lighting setup", author: "viewer11" },
      { id: 12, time: 4, text: "The pacing is perfect", author: "viewer12" },
      { id: 13, time: 6, text: "Nice camera work!", author: "viewer13" },
      { id: 14, time: 8, text: "Really clean execution", author: "viewer14" },
      { id: 15, time: 10, text: "Love this aesthetic", author: "viewer15" },
      { id: 16, time: 12, text: "Such smooth motion", author: "viewer16" },
      { id: 17, time: 14, text: "The composition is spot on", author: "viewer17" },
      { id: 18, time: 16, text: "This is inspiring!", author: "viewer18" },
      { id: 19, time: 18, text: "Great choice of music", author: "viewer19" },
      { id: 20, time: 20, text: "Phenomenal work overall", author: "viewer20" },
    ]
  };

  const getCurrentComments = () => {
    return commentsData[displayItems[currentIndex]?.id] || [];
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayItems.length);
    setIsPlaying(true); // Auto-play new video
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);
    setIsPlaying(true); // Auto-play new video
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true); // Auto-play new video
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (typeof window !== 'undefined') {
      const video = document.querySelector(`[data-video-index="${currentIndex}"] video`) as HTMLVideoElement;
      if (video) {
        video.muted = !isMuted;
      }
    }
  };

  const togglePlayPause = () => {
    if (typeof window !== 'undefined') {
      const video = document.querySelector(`[data-video-index="${currentIndex}"] video`) as HTMLVideoElement;
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
    
    if (typeof window !== 'undefined') {
      const progressBar = e.currentTarget as HTMLElement;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      
      const video = document.querySelector(`[data-video-index="${currentIndex}"] video`) as HTMLVideoElement;
      if (video && video.duration) {
        const newTime = percentage * video.duration;
        video.currentTime = Math.max(0, Math.min(newTime, video.duration));
      }
    }
  };

  // Auto-play videos when they become active
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // First, pause all videos
      const allVideos = document.querySelectorAll('[data-video-index] video') as NodeListOf<HTMLVideoElement>;
      allVideos.forEach(video => {
        video.pause();
      });

      // Then play only the current video if it should be playing
      const currentVideo = document.querySelector(`[data-video-index="${currentIndex}"] video`) as HTMLVideoElement;
      if (currentVideo) {
        currentVideo.muted = isMuted;
        if (isPlaying) {
          currentVideo.play().catch(() => {
            // Handle autoplay restrictions - some browsers require user interaction
          });
        }
      }
    }
  }, [currentIndex, isMuted, isPlaying]);

  // Reset video time only when switching to a new video
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentVideo = document.querySelector(`[data-video-index="${currentIndex}"] video`) as HTMLVideoElement;
      if (currentVideo) {
        currentVideo.currentTime = 0;
        setCurrentTime(0); // Reset comment timing
      }
    }
  }, [currentIndex]);

  // Track video progress
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const video = document.querySelector(`[data-video-index="${currentIndex}"] video`) as HTMLVideoElement;
      if (!video) return;

      const updateProgress = () => {
        if (video.duration) {
          const progressPercent = (video.currentTime / video.duration) * 100;
          setProgress(progressPercent);
          setCurrentTime(video.currentTime);
        }
      };

      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('loadedmetadata', updateProgress);

      return () => {
        video.removeEventListener('timeupdate', updateProgress);
        video.removeEventListener('loadedmetadata', updateProgress);
      };
    }
  }, [currentIndex]);

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
    const wasQuickClick = timeDiff < 200 && Math.abs(dragOffset) < 10;
    
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
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    setDragStartTime(Date.now());
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - dragStart;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const threshold = 50;
    const timeDiff = Date.now() - dragStartTime;
    const wasQuickTap = timeDiff < 200 && Math.abs(dragOffset) < 10;
    
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
      id: '1',
      title: 'Project Alpha',
      description: 'An experimental interface design exploring new interaction patterns.',
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
              transform: `translateX(${(-currentIndex * 100) + (dragOffset / (carouselRef.current?.offsetWidth || 1)) * 100}%)`,
            }}
          >
            {displayItems.map((item, index) => (
              <div key={item.id} className="w-full h-full flex-shrink-0 relative" data-video-index={index}>
                {item.videoUrl ? (
                  <>
                    <video 
                      src={item.videoUrl}
                      muted={isMuted}
                      loop
                      playsInline
                      className="w-full h-full object-cover border-0 outline-0"
                      poster={item.thumbnailUrl}
                    />
                    {/* Title Overlay */}
                    {index === currentIndex && (
                      <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-sm px-3 py-2 ">
                        <h3 className="text-white text-sm font-medium">{item.title}</h3>
                      </div>
                    )}
                    
                    {/* Dynamic Comment Components */}
                    <AnimatePresence mode="popLayout">
                      {index === currentIndex && 
                        getCurrentComments()
                          .filter(comment => currentTime >= comment.time)
                          .slice(-5) // Show only the last 5 comments
                          .map((comment, commentIndex) => {
                            // Calculate spacing for exactly 5 comments max
                            const spacing = 16; // Fixed 16px spacing between comments
                            const topPosition = 20 + (commentIndex * spacing);
                            
                            const formatTime = (seconds: number) => {
                              const mins = Math.floor(seconds / 60);
                              const secs = Math.floor(seconds % 60);
                              return `${mins}:${secs.toString().padStart(2, '0')}`;
                            };

                            return (
                              <motion.div 
                                key={comment.id}
                                className="absolute right-4 z-10 bg-black/40 backdrop-blur-sm px-3 py-2 max-w-48"
                                style={{ top: `${topPosition}%` }}
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -50, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                layout
                              >
                                <div className="text-white text-xs">
                                  <span className="text-white/60">{formatTime(comment.time)}</span> {comment.text}
                                </div>
                              </motion.div>
                            );
                          })
                      }
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-center p-8">
                    <div>
                      <div className="text-6xl mb-4 text-background/30">▶</div>
                      <h3 className="text-xl font-bold text-background mb-2">{item.title}</h3>
                      <p className="text-background/70 text-sm">{item.description}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="grid grid-cols-3 items-center p-3 bg-accent-green-dark">
          
          {/* Left - Slide Indicators */}
          <div className="flex justify-start">
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
                        ? 'bg-background' 
                        : 'bg-background/40 hover:bg-background/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Center - Progress Bar */}
          <div className="flex justify-center">
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
                {typeof window !== 'undefined' && getCurrentComments().map((comment) => {
                  const video = document.querySelector(`[data-video-index="${currentIndex}"] video`) as HTMLVideoElement;
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
          </div>
          
          {/* Right - Mute Button */}
          <div className="flex justify-end">
            <button
              onClick={toggleMute}
              className="text-background/60 hover:text-background transition-colors"
            >
              {isMuted ? (
                <VolumeX size={14} />
              ) : (
                <Volume2 size={14} />
              )}
            </button>
          </div>
        </div>

       
      </div>
    </div>
  );
} 