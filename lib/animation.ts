// iOS-style animation configurations - fast, snappy, responsive

export const springs = {
  // iOS-style snappy - very fast, no bounce
  snappy: { type: "spring" as const, stiffness: 700, damping: 40, mass: 0.5 },
  // Quick and controlled
  quick: { type: "spring" as const, stiffness: 600, damping: 35, mass: 0.5 },
  // Standard iOS feel
  ios: { type: "spring" as const, stiffness: 500, damping: 30, mass: 0.8 },
  // For interactive elements - immediate response
  tap: { type: "spring" as const, stiffness: 800, damping: 50, mass: 0.3 },
  // For cards - responsive tracking
  cardTrack: { stiffness: 400, damping: 25 },
  // Modal/sheet appearance
  sheet: { type: "spring" as const, stiffness: 400, damping: 30, mass: 0.8 },
};

// iOS uses these easing curves
export const easing = {
  // iOS default - quick start, smooth end
  ios: [0.25, 0.1, 0.25, 1.0] as const,
  // iOS ease-out - snappy
  iosOut: [0, 0, 0.2, 1] as const,
  // iOS ease-in
  iosIn: [0.4, 0, 1, 1] as const,
  // For UI elements
  snappy: [0.2, 0, 0, 1] as const,
};

// Transition presets - all fast
export const transitions = {
  // Ultra fast fade
  fade: {
    duration: 0.15,
    ease: easing.iosOut,
  },
  // Quick slide
  slide: {
    duration: 0.2,
    ease: easing.ios,
  },
  // For staggered children - tight timing
  stagger: {
    staggerChildren: 0.03,
  },
};

// Sticker-specific configs - still playful but snappier
export const stickerTransitions = {
  float: {
    y: {
      duration: 3,
      repeat: Infinity,
      ease: [0.45, 0.05, 0.55, 0.95] as const,
    },
    rotate: {
      duration: 4,
      repeat: Infinity,
      ease: [0.45, 0.05, 0.55, 0.95] as const,
    },
  },
  drag: {
    bounceStiffness: 500,
    bounceDamping: 30,
  },
};
