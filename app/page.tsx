"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useState, useEffect, useRef } from "react";
import Image from "next/image";

import VideoIframe from "@/components/VideoIframe";
import { springs, transitions } from "@/lib/animation";

export default function Home() {
  const [hoveredPreview, setHoveredPreview] = useState<string | null>(null);
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{
    rho: string;
    browserbase: string;
  }>({
    rho: "findrho.co",
    browserbase: "series-b",
  });
  const [, setSelectedSubProject] = useState<{
    [key: string]: string;
  }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [preloadReady, setPreloadReady] = useState<Record<string, boolean>>(
    {}
  );
  const previewRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const projectListRef = useRef<HTMLDivElement | null>(null);
  const [listScroll, setListScroll] = useState<{ atStart: boolean; atEnd: boolean }>({ atStart: true, atEnd: false });
  const shouldReduceMotion = useReducedMotion();

  // Drag select state
  const [dragSelect, setDragSelect] = useState<{
    isActive: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  }>({
    isActive: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  const rhoProjects = [
    {
      id: "findrho.co",
      name: "Find Rho",
      video: "d92f2aed546bf4a481c20b22328c0611",
      url: "https://findrho.co",
    },
  ];

  const browserbaseProjects = [
    {
      id: "series-b",
      name: "Director and Series B",
      video: "51a62e7e813329fb699cd3cf07804c2f",
      url: "https://browserbase.com",
    },
    {
      id: "brainrot",
      name: "Brainrot Generator",
      video: "0a570e29470d2313d66e6a19614ec82b",
      url: "https://x.com/alexdphan/status/1879984298138505320?s=20",
    },
    {
      id: "mcp",
      name: "Early Browser MCP",
      video: "8c54ad68f121b9d448c66f204de2347b",
      url: "https://x.com/alexdphan/status/1861501370010083519?s=20",
    },
    {
      id: "bb-computer-use",
      name: "Anthropic's Computer Use",
      video: "10d6ade97343f1b260298be521cb4be5",
      url: "https://x.com/alexdphan/status/1849159686467322221?s=20",
    },
    {
      id: "browsegpt",
      name: "BrowseGPT",
      video: "07f679d0bb531390748f9c3838adcd00",
      url: "https://x.com/alexdphan/status/1846271931395534936?s=20",
    },
    {
      id: "stagehand-v2",
      name: "Stagehand v2",
      video: "5288a9f57f7fa07e8d0a12b48675c6e6",
      url: "https://x.com/Stagehanddev/status/1906771592648249700?s=20",
    },
    {
      id: "bb-culture",
      name: "#1 Early Stage",
      video: "c720865aa9ee17dfc4ed6bb752742766",
      url: "https://x.com/alexdphan/status/1904630387856597207",
    },
    {
      id: "series-a",
      name: "Series A",
      video: "eb97ebce0968ab2393a92fb7e28b1834",
      url: "https://x.com/pk_iv/status/1851270308701106383?s=20",
    },
    {
      id: "bb-sdk",
      name: "Browserbase Playground",
      video: "ae8fd53badf11d751cac880a6fb18ee2",
      url: "https://x.com/alexdphan/status/1821618745191899304?s=20",
    },
  ];

  const isPreloadedModal =
    videoModal === selectedVideo.rho ||
    videoModal === selectedVideo.browserbase;
  const isModalVisible = Boolean(
    videoModal &&
      (isPreloadedModal ? preloadReady[videoModal] : modalVisible)
  );

  const handleCloseModal = useCallback(() => {
    setVideoModal(null);
    setModalVisible(false);
  }, []);

  useEffect(() => {
    if (!videoModal) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleCloseModal();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleCloseModal, videoModal]);

  const getModalVideo = () => {
    if (!videoModal) return { url: "", title: "" };

    // Check if it's a Rho project
    const rhoProject = rhoProjects.find((p) => p.id === videoModal);
    if (rhoProject) {
      return {
        url: `https://customer-vs7mnf7pn9caalyg.cloudflarestream.com/${rhoProject.video}/iframe?autoplay=true&muted=false&controls=true&preload=auto&defaultTextTrack=false`,
        title: rhoProject.name,
      };
    }

    // Check if it's a Browserbase project
    const bbProject = browserbaseProjects.find((p) => p.id === videoModal);
    if (bbProject) {
      return {
        url: `https://customer-vs7mnf7pn9caalyg.cloudflarestream.com/${bbProject.video}/iframe?autoplay=true&muted=false&controls=true&preload=auto&defaultTextTrack=false`,
        title: bbProject.name,
      };
    }

    // NYC or SF
    if (videoModal === "nyc") {
      return {
        url: "https://www.youtube.com/embed/VGnFLdQW39A?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&showinfo=0",
        title: "NYC Livestream",
      };
    }
    if (videoModal === "sf") {
      return {
        url: "https://www.youtube.com/embed/CXYr04BWvmc?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&showinfo=0",
        title: "SF Video",
      };
    }

    return { url: "", title: "" };
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Check video previews (rho, browserbase, nyc, sf)
      if (hoveredPreview) {
        const isClickInsidePreview = Object.values(previewRefs.current).some(
          (ref) => ref?.contains(target)
        );
        if (!isClickInsidePreview) {
          setHoveredPreview(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [hoveredPreview]);

  // Drag select functionality
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (!e.isPrimary) return;

      // Only start drag select if clicking on the background (not on interactive elements)
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("iframe");

      if (!isInteractive) {
        target.setPointerCapture?.(e.pointerId);
        setDragSelect({
          isActive: true,
          startX: e.clientX,
          startY: e.clientY,
          currentX: e.clientX,
          currentY: e.clientY,
        });
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      if (dragSelect.isActive) {
        setDragSelect((prev) => ({
          ...prev,
          currentX: e.clientX,
          currentY: e.clientY,
        }));
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      setDragSelect((prev) => ({ ...prev, isActive: false }));
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointercancel", handlePointerUp);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [dragSelect.isActive]);

  useEffect(() => {
    document.body.classList.toggle("drag-select-active", dragSelect.isActive);
    return () => document.body.classList.remove("drag-select-active");
  }, [dragSelect.isActive]);

  return (
    <>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col gap-3.5">
          {/* Profile and copy share one vertical spacing rhythm. */}
          <header className="w-full">
            <div className="flex items-center gap-3">
              <Image
                src="/alex.jpg"
                alt="Alex Phan"
                width={48}
                height={48}
                className="profile-image size-12 shrink-0 object-cover"
                quality={100}
                priority
              />
              <div className="flex h-12 min-w-0 flex-col justify-center">
                <h1
                  className="text-body font-medium leading-5"
                  style={{ color: "var(--text-primary)" }}
                >
                  AP
                </h1>
                <p
                  className="text-caption"
                  style={{ color: "var(--text-muted)", whiteSpace: "pre" }}
                >
                  Alex Phan
                </p>
              </div>
            </div>
          </header>

          {/* Philosophy */}
          <p
            className="text-body text-pretty"
            style={{ color: "var(--gray-700)" }}
          >
            Pursuing opportunities elegantly simple, yet overlooked.
          </p>

          {/* Work */}
          <div
            className="text-body text-pretty"
            style={{ color: "var(--gray-700)" }}
          >
              Angel investing & growth advising on the side. Previously,
              growth engineer at{" "}
              <button
                type="button"
                onClick={() =>
                  setHoveredPreview(hoveredPreview === "rho" ? null : "rho")
                }
                className="inline-preview-trigger"
              >
                Rho
              </button>
              {" "}
              and{" "}
              <button
                type="button"
                onClick={() =>
                  setHoveredPreview(
                    hoveredPreview === "browserbase" ? null : "browserbase"
                  )
                }
                className="inline-preview-trigger"
              >
                Browserbase
              </button>
              .
          </div>

          {/* Contact */}
          <div
            className="text-body text-pretty"
            style={{ color: "var(--gray-700)" }}
          >
              <button
                type="button"
                onClick={() =>
                  setHoveredPreview(hoveredPreview === "nyc" ? null : "nyc")
                }
                className="inline-preview-trigger"
              >
                NYC
              </button>{" "}
              based,{" "}
              <button
                type="button"
                onClick={() =>
                  setHoveredPreview(hoveredPreview === "sf" ? null : "sf")
                }
                className="inline-preview-trigger"
              >
                SF
              </button>{" "}
              frequent. Feel free to{" "}
              <button
                type="button"
                onClick={() =>
                  setHoveredPreview(
                    hoveredPreview === "contact" ? null : "contact"
                  )
                }
                className="inline-preview-trigger"
              >
                reach out
              </button>{" "}
              if you’d like to chat.
          </div>
        </div>

        {/* Every preview uses the original persistent spring reveal. */}
        <motion.div
            ref={(el) => {
              previewRefs.current["rho"] = el;
            }}
            initial={false}
            animate={
              hoveredPreview === "rho"
                ? { opacity: 1, height: "auto" }
                : { opacity: 0, height: 0 }
            }
            transition={shouldReduceMotion ? { duration: 0 } : springs.snappy}
            className="w-full"
            style={{
              overflow: "hidden",
              pointerEvents: hoveredPreview === "rho" ? "auto" : "none",
            }}
            aria-hidden={hoveredPreview !== "rho"}
          >
            <div className="relative w-full pt-6">
              <div
                className="media-frame aspect-video w-full overflow-hidden"
              >
                <VideoIframe
                  key={selectedVideo.rho}
                  src={`https://customer-vs7mnf7pn9caalyg.cloudflarestream.com/${
                    rhoProjects.find((p) => p.id === selectedVideo.rho)
                      ?.video || rhoProjects[0].video
                  }/iframe?autoplay=true&muted=true&controls=true&loop=true&preload=auto&defaultTextTrack=false`}
                  title="Rho"
                  loading="eager"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  className="w-full h-full pointer-events-none"
                  style={{ border: 0 }}
                />
              </div>
              <p
                className="mt-3 text-caption font-medium"
                style={{ color: "var(--gray-900)" }}
              >
                Rho
              </p>
            </div>
        </motion.div>

        <motion.div
            ref={(el) => {
              previewRefs.current["browserbase"] = el;
            }}
            initial={false}
            animate={
              hoveredPreview === "browserbase"
                ? { opacity: 1, height: "auto" }
                : { opacity: 0, height: 0 }
            }
            transition={shouldReduceMotion ? { duration: 0 } : springs.snappy}
            className="w-full"
            style={{
              overflow: "hidden",
              pointerEvents:
                hoveredPreview === "browserbase" ? "auto" : "none",
            }}
            aria-hidden={hoveredPreview !== "browserbase"}
          >
            <div className="relative w-full pt-6">
              <div
                className="media-frame aspect-video w-full overflow-hidden"
              >
                <VideoIframe
                  key={selectedVideo.browserbase}
                  src={`https://customer-vs7mnf7pn9caalyg.cloudflarestream.com/${
                    browserbaseProjects.find(
                      (p) => p.id === selectedVideo.browserbase
                    )?.video || browserbaseProjects[0].video
                  }/iframe?autoplay=true&muted=true&controls=true&loop=true&preload=auto&defaultTextTrack=false`}
                  title="Browserbase"
                  loading="eager"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  className="w-full h-full pointer-events-none"
                  style={{ border: 0 }}
                />
              </div>
              <div className="relative mt-3">
                <div
                  ref={projectListRef}
                  className="flex items-center gap-7 overflow-x-auto"
                  style={{
                    scrollbarWidth: "none",
                    maskImage: `linear-gradient(to right, ${listScroll.atStart ? "black" : "transparent"} 0%, black ${listScroll.atStart ? "0%" : "10%"}, black ${listScroll.atEnd ? "100%" : "80%"}, ${listScroll.atEnd ? "black" : "transparent"} 100%)`,
                    WebkitMaskImage: `linear-gradient(to right, ${listScroll.atStart ? "black" : "transparent"} 0%, black ${listScroll.atStart ? "0%" : "10%"}, black ${listScroll.atEnd ? "100%" : "80%"}, ${listScroll.atEnd ? "black" : "transparent"} 100%)`,
                  }}
                  onScroll={(e) => {
                    const el = e.currentTarget;
                    const atStart = el.scrollLeft < 5;
                    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;
                    setListScroll({ atStart, atEnd });
                  }}
                >
                  {browserbaseProjects.map((project) => (
                    <span key={project.id} className="shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideo((prev) => ({
                            ...prev,
                            browserbase: project.id,
                          }));
                        }}
                        className="text-caption cursor-pointer whitespace-nowrap border-none bg-transparent p-0 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
                        style={{
                          color:
                            selectedVideo.browserbase === project.id
                              ? "var(--gray-900)"
                              : "var(--gray-400)",
                        }}
                      >
                        {project.name}
                      </button>
                    </span>
                  ))}
                  <span className="w-6 shrink-0" aria-hidden="true" />
                </div>
              </div>
            </div>
        </motion.div>

        <motion.div
            ref={(el) => {
              previewRefs.current["nyc"] = el;
            }}
            initial={false}
            animate={
              hoveredPreview === "nyc"
                ? { opacity: 1, height: "auto" }
                : { opacity: 0, height: 0 }
            }
            transition={shouldReduceMotion ? { duration: 0 } : springs.snappy}
            className="w-full"
            style={{
              overflow: "hidden",
              pointerEvents: hoveredPreview === "nyc" ? "auto" : "none",
            }}
            aria-hidden={hoveredPreview !== "nyc"}
          >
            <div className="w-full pt-6">
              <div
                className="media-frame aspect-video w-full overflow-hidden"
              >
                <VideoIframe
                  src="https://www.youtube.com/embed/VGnFLdQW39A?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&iv_load_policy=3&disablekb=1&cc_load_policy=0&playsinline=1&loop=1&playlist=VGnFLdQW39A"
                  title="NYC Livestream"
                  loading="eager"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  className="h-full w-full pointer-events-none"
                  style={{ border: 0 }}
                />
              </div>
              <p
                className="mt-3 text-caption font-medium"
                style={{ color: "var(--gray-900)" }}
              >
                New York City
              </p>
            </div>
        </motion.div>

        <motion.div
            ref={(el) => {
              previewRefs.current["sf"] = el;
            }}
            initial={false}
            animate={
              hoveredPreview === "sf"
                ? { opacity: 1, height: "auto" }
                : { opacity: 0, height: 0 }
            }
            transition={shouldReduceMotion ? { duration: 0 } : springs.snappy}
            className="w-full"
            style={{
              overflow: "hidden",
              pointerEvents: hoveredPreview === "sf" ? "auto" : "none",
            }}
            aria-hidden={hoveredPreview !== "sf"}
          >
            <div className="w-full pt-6">
              <div
                className="media-frame aspect-video w-full overflow-hidden"
              >
                <VideoIframe
                  src="https://www.youtube.com/embed/CXYr04BWvmc?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&iv_load_policy=3&disablekb=1&cc_load_policy=0&playsinline=1&loop=1&playlist=CXYr04BWvmc"
                  title="SF Video"
                  loading="eager"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  className="h-full w-full pointer-events-none"
                  style={{ border: 0 }}
                />
              </div>
              <p
                className="mt-3 text-caption font-medium"
                style={{ color: "var(--gray-900)" }}
              >
                San Francisco
              </p>
            </div>
        </motion.div>

        <motion.div
            ref={(el) => {
              previewRefs.current["contact"] = el;
            }}
            initial={false}
            animate={
              hoveredPreview === "contact"
                ? { opacity: 1, height: "auto", marginTop: 24 }
                : { opacity: 0, height: 0, marginTop: 0 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    ...springs.snappy,
                    opacity: { ...transitions.fade, duration: 0.12 },
                  }
            }
            className="w-full"
            style={{
              overflow: "hidden",
              pointerEvents: hoveredPreview === "contact" ? "auto" : "none",
            }}
            aria-hidden={hoveredPreview !== "contact"}
          >
            <div className="relative w-full">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border border-[var(--image-outline)] p-3">
                <a
                    href="mailto:alexphan0515@gmail.com"
                    className="text-caption font-medium hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Email
                </a>
                <a
                    href="https://linkedin.com/in/alexanderdphan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-caption font-medium hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    LinkedIn
                </a>
                <a
                    href="https://x.com/alexdphan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-caption font-medium hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    X
                </a>
                <a
                    href="https://alexdphan-github-io-alexander-phans-projects.vercel.app/projects"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-caption font-medium hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Archive
                </a>
              </div>
            </div>
        </motion.div>
      </div>

      {/* ======= VIDEO MODAL SYSTEM =======
           Preloaded modals keep their iframes mounted for an instant open.
           Fallback modal handles YouTube and sidebar-switched videos. */}

      {/* Modal backdrop — shared across preloaded and fallback modals */}
      <AnimatePresence>
        {videoModal && isModalVisible && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : transitions.fade}
            className="modal-backdrop fixed inset-0 z-50"
            onClick={handleCloseModal}
          />
        )}
      </AnimatePresence>

      {/* Preloaded video modals — persistent iframes, always in DOM */}
      {[
        {
          videoId: selectedVideo.rho,
          project:
            rhoProjects.find((p) => p.id === selectedVideo.rho) ||
            rhoProjects[0],
          category: "rho" as const,
          projects: rhoProjects,
        },
        {
          videoId: selectedVideo.browserbase,
          project:
            browserbaseProjects.find(
              (p) => p.id === selectedVideo.browserbase
            ) || browserbaseProjects[0],
          category: "browserbase" as const,
          projects: browserbaseProjects,
        },
      ].map(({ videoId, project, category, projects }) => {
        const isActive = videoModal === videoId && isModalVisible;
        const url = `https://customer-vs7mnf7pn9caalyg.cloudflarestream.com/${project.video}/iframe?autoplay=true&muted=true&controls=true&preload=auto&defaultTextTrack=false`;

        return (
          <div
            key={`preload-${videoId}`}
            className="fixed inset-0 z-[51] flex items-center justify-center p-4 sm:p-6 lg:p-8"
            style={{
              pointerEvents: isActive ? "auto" : "none",
              overscrollBehavior: "contain",
            }}
            aria-hidden={!isActive}
            role={isActive ? "dialog" : undefined}
            aria-modal={isActive ? "true" : undefined}
            aria-label={isActive ? project.name : undefined}
            onClick={isActive ? handleCloseModal : undefined}
          >
            <motion.div
              initial={false}
              animate={
                isActive
                  ? { opacity: 1, transform: "translateY(0) scale(1)" }
                  : {
                      opacity: 0,
                      transform: shouldReduceMotion
                        ? "translateY(0) scale(1)"
                        : "translateY(20px) scale(0.95)",
                    }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { ...springs.snappy, opacity: { duration: 0.15 } }
              }
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="aspect-video min-w-0 flex-1">
                  <iframe
                    src={url}
                    title={project.name}
                    className="h-full w-full"
                    style={{ border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                    loading="eager"
                    tabIndex={isActive ? 0 : -1}
                    onLoad={() => {
                      setPreloadReady((prev) => ({
                        ...prev,
                        [videoId]: true,
                      }));
                    }}
                  />
                </div>
                {isActive && (
                  <div
                    className="surface-panel flex max-h-56 w-full flex-col overflow-y-auto p-2 md:max-h-none md:w-56 md:self-stretch"
                  >
                    <div className="flex flex-col gap-1">
                      {projects.map((proj) => (
                        <button
                          type="button"
                          key={proj.id}
                          onClick={() => {
                            setVideoModal(proj.id);
                            setSelectedSubProject((prev) => ({
                              ...prev,
                              [category]: proj.id,
                            }));
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "var(--gray-100)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                          className="text-caption cursor-pointer rounded p-2 text-left"
                          style={{
                            color:
                              videoModal === proj.id
                                ? "var(--gray-900)"
                                : "var(--gray-400)",
                          }}
                        >
                          {proj.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        );
      })}

      {/* Fallback modal — for YouTube, or videos switched via sidebar */}
      <AnimatePresence>
        {videoModal &&
          videoModal !== selectedVideo.rho &&
          videoModal !== selectedVideo.browserbase && (
            <motion.div
              key="fallback-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: isModalVisible ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : transitions.fade}
              className="fixed inset-0 z-[51] flex items-center justify-center p-4 sm:p-6 lg:p-8"
              style={{
                pointerEvents: isModalVisible ? "auto" : "none",
                overscrollBehavior: "contain",
              }}
              role="dialog"
              aria-modal="true"
              aria-label={getModalVideo().title}
              onClick={handleCloseModal}
            >
              <motion.div
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        transform: "translateY(20px) scale(0.95)",
                      }
                }
                animate={
                  isModalVisible
                    ? { opacity: 1, transform: "translateY(0) scale(1)" }
                    : {
                        opacity: 0,
                        transform: shouldReduceMotion
                          ? "translateY(0) scale(1)"
                          : "translateY(20px) scale(0.95)",
                      }
                }
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        transform: "translateY(10px) scale(0.98)",
                      }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { ...springs.snappy, opacity: { duration: 0.15 } }
                }
                className="relative w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                {getModalVideo().url && (
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="aspect-video min-w-0 flex-1">
                      <VideoIframe
                        src={getModalVideo().url}
                        title={getModalVideo().title}
                        loading="eager"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                        allowFullScreen
                        className="h-full w-full"
                        style={{ border: 0 }}
                        onLoad={() => {
                          if (!modalVisible) setModalVisible(true);
                        }}
                      />
                    </div>
                    {isModalVisible &&
                      (rhoProjects.find((p) => p.id === videoModal) ||
                        browserbaseProjects.find(
                          (p) => p.id === videoModal
                        )) && (
                        <div
                          className="surface-panel flex max-h-56 w-full flex-col overflow-y-auto p-2 md:max-h-none md:w-56 md:self-stretch"
                        >
                          <div className="flex flex-col gap-1">
                            {(rhoProjects.find((p) => p.id === videoModal)
                              ? rhoProjects
                              : browserbaseProjects
                            ).map((project) => (
                              <button
                                type="button"
                                key={project.id}
                                onClick={() => {
                                  setVideoModal(project.id);
                                  setSelectedSubProject((prev) => ({
                                    ...prev,
                                    [rhoProjects.find(
                                      (p) => p.id === videoModal
                                    )
                                      ? "rho"
                                      : "browserbase"]: project.id,
                                  }));
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "var(--gray-100)")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "transparent")
                                }
                                className="text-caption cursor-pointer rounded p-2 text-left"
                                style={{
                                  color:
                                    videoModal === project.id
                                      ? "var(--gray-900)"
                                      : "var(--gray-400)",
                                }}
                              >
                                {project.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Drag Select Box */}
      {dragSelect.isActive && (
          <div
            className="fixed pointer-events-none z-[9999]"
            style={{
              left: Math.min(dragSelect.startX, dragSelect.currentX),
              top: Math.min(dragSelect.startY, dragSelect.currentY),
              width: Math.abs(dragSelect.currentX - dragSelect.startX),
              height: Math.abs(dragSelect.currentY - dragSelect.startY),
              backgroundColor: "color-mix(in srgb, var(--gray-900) 5%, transparent)",
              boxShadow: "0 0 0 0.5px color-mix(in srgb, var(--gray-900) 15%, transparent)",
            }}
          />
      )}
    </>
  );
}
